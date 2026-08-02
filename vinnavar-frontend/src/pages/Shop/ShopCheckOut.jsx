import { API_BASE_URL, createRazorpayOrder, getImageUrl, processCodCheckout, verifyRazorpayPayment } from "../../services/api";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MagnifyingGlass } from 'react-loader-spinner';
import Swal from 'sweetalert2';
import ScrollToTop from "../ScrollToTop";

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const ShopCheckOut = () => {
    const navigate = useNavigate();
    const [loaderStatus, setLoaderStatus] = useState(true);
    const [cart, setCart] = useState(null);
    const paymentMethod = "RAZORPAY";
    const [isProcessing, setIsProcessing] = useState(false);

    const [shippingForm, setShippingForm] = useState({
        name: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "Tamil Nadu",
        pincode: ""
    });

    const fetchCart = async () => {
        const cartId = localStorage.getItem("vinnavar_cart_id");
        if (!cartId) {
            setCart({ items: [], subtotal: 0 });
            setLoaderStatus(false);
            return;
        }
        try {
            const res = await fetch(`${API_BASE_URL}/cart/${cartId}`);
            if (res.ok) {
                const data = await res.json();
                setCart(data);
            }
        } catch (err) {
            console.error("Error fetching checkout cart", err);
        } finally {
            setLoaderStatus(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingForm((prev) => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        const cartId = localStorage.getItem("vinnavar_cart_id");
        if (!cart || !cart.items || cart.items.length === 0) {
            Swal.fire("Empty Cart", "Your cart has no items to checkout.", "warning");
            return;
        }

        if (!shippingForm.name || !shippingForm.phone || !shippingForm.street || !shippingForm.pincode) {
            Swal.fire("Missing Information", "Please fill in your Full Name, Mobile Phone, Delivery Address, and Pincode.", "warning");
            return;
        }

        const checkoutData = {
            cartId,
            customerName: shippingForm.name,
            customerEmail: shippingForm.email || "customer@vinnavar.com",
            customerPhone: shippingForm.phone,
            shippingAddress: {
                street: shippingForm.street,
                city: shippingForm.city,
                state: shippingForm.state,
                pincode: shippingForm.pincode
            },
            paymentMethod
        };

        setIsProcessing(true);

        if (paymentMethod === "RAZORPAY") {
            try {
                const isScriptLoaded = await loadRazorpayScript();
                if (!isScriptLoaded) {
                    Swal.fire("SDK Error", "Failed to load Razorpay SDK. Please check your internet connection.", "error");
                    setIsProcessing(false);
                    return;
                }

                const razorpayData = await createRazorpayOrder(checkoutData);

                const options = {
                    key: razorpayData.keyId,
                    amount: razorpayData.amountInPaise,
                    currency: razorpayData.currency || "INR",
                    name: "Vinnavar Organics",
                    description: `Order Payment for ${razorpayData.orderNumber}`,
                    image: getImageUrl("/media/site/Grocerylogo.png"),
                    order_id: razorpayData.razorpayOrderId.startsWith("order_") ? razorpayData.razorpayOrderId : undefined,
                    prefill: {
                        name: shippingForm.name,
                        email: shippingForm.email,
                        contact: shippingForm.phone
                    },
                    theme: {
                        color: "#0aad0a"
                    },
                    handler: async function (response) {
                        try {
                            const verification = await verifyRazorpayPayment({
                                orderNumber: razorpayData.orderNumber,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpayOrderId: response.razorpay_order_id || razorpayData.razorpayOrderId,
                                razorpaySignature: response.razorpay_signature || ""
                            });

                            localStorage.removeItem("vinnavar_cart_id");

                            Swal.fire({
                                icon: "success",
                                title: "Payment Successful! 🎉",
                                html: `Thank you for your order!<br/>Order Number: <strong>${verification.orderNumber || razorpayData.orderNumber}</strong><br/>Payment ID: <code>${response.razorpay_payment_id}</code>`,
                                confirmButtonText: "Return to Home",
                                confirmButtonColor: "#0aad0a"
                            }).then(() => {
                                navigate("/");
                            });
                        } catch (err) {
                            Swal.fire({ icon: "error", title: "Payment Verification Issue", text: err.message });
                        } finally {
                            setIsProcessing(false);
                        }
                    },
                    modal: {
                        ondismiss: function () {
                            setIsProcessing(false);
                            Swal.fire({ icon: "info", title: "Payment Cancelled", text: "You can retry checkout anytime." });
                        }
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.on("payment.failed", function (response) {
                    setIsProcessing(false);
                    Swal.fire({
                        icon: "error",
                        title: "Payment Failed",
                        text: response.error?.description || "Payment failed. Please try again."
                    });
                });
                rzp.open();
            } catch (err) {
                console.error("Razorpay error", err);
                setIsProcessing(false);
                Swal.fire("Checkout Failed", err.message || "Failed to initiate Razorpay payment.", "error");
            }
        } else {
            // Cash on Delivery
            try {
                const order = await processCodCheckout(checkoutData);
                localStorage.removeItem("vinnavar_cart_id");

                Swal.fire({
                    icon: "success",
                    title: "Order Placed (COD)! 🎉",
                    html: `Thank you for your order! Your Order ID is <strong>${order.orderNumber}</strong>.<br/>We will deliver your pure organic items shortly.`,
                    confirmButtonText: "Return to Home",
                    confirmButtonColor: "#0aad0a"
                }).then(() => {
                    navigate("/");
                });
            } catch (err) {
                Swal.fire("Checkout Failed", err.message || "Failed to place COD order.", "error");
            } finally {
                setIsProcessing(false);
            }
        }
    };

    return (
        <div>
            {loaderStatus ? (
                <div className="loader-container d-flex justify-content-center align-items-center my-5 py-5">
                    <MagnifyingGlass
                        visible={true}
                        height="100"
                        width="100"
                        ariaLabel="magnifying-glass-loading"
                        glassColor="#c0efff"
                        color="#0aad0a"
                    />
                </div>
            ) : (
                <>
                    <ScrollToTop />
                    <section className="mb-lg-14 mb-8 mt-6">
                        <div className="container">
                            <div className="row mb-4">
                                <div className="col-12">
                                    <h1 className="fw-bold mb-1 text-success">🛍️ Secure Checkout</h1>
                                    <p className="text-muted small">
                                        100% Pure Organic Staples. Fast delivery across Tamil Nadu & India.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handlePlaceOrder}>
                                <div className="row g-4">
                                    {/* Left Column: Delivery Address & Payment Method */}
                                    <div className="col-lg-7 col-md-12">
                                        {/* Card 1: Customer & Delivery Address */}
                                        <div className="card shadow-sm border-0 mb-4 rounded-3">
                                            <div className="card-header bg-success text-white fw-bold py-3">
                                                📍 1. Shipping & Delivery Address
                                            </div>
                                            <div className="card-body p-4">
                                                <div className="row g-3">
                                                    <div className="col-12 col-md-6">
                                                        <label className="form-label small fw-bold">Full Name *</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="name"
                                                            placeholder="e.g. Lokesh Rajan"
                                                            value={shippingForm.name}
                                                            onChange={handleInputChange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-12 col-md-6">
                                                        <label className="form-label small fw-bold">Mobile Phone Number *</label>
                                                        <input
                                                            type="tel"
                                                            className="form-control"
                                                            name="phone"
                                                            placeholder="+91 9876543210"
                                                            value={shippingForm.phone}
                                                            onChange={handleInputChange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-12">
                                                        <label className="form-label small fw-bold">Email Address (Optional)</label>
                                                        <input
                                                            type="email"
                                                            className="form-control"
                                                            name="email"
                                                            placeholder="you@example.com"
                                                            value={shippingForm.email}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                    <div className="col-12">
                                                        <label className="form-label small fw-bold">House / Flat / Street Address *</label>
                                                        <textarea
                                                            className="form-control"
                                                            name="street"
                                                            rows="2"
                                                            placeholder="#16, MS Nagar Phase 2, Kurumanthangal Road"
                                                            value={shippingForm.street}
                                                            onChange={handleInputChange}
                                                            required
                                                        ></textarea>
                                                    </div>
                                                    <div className="col-12 col-md-4">
                                                        <label className="form-label small fw-bold">City / Town</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="city"
                                                            placeholder="Arani"
                                                            value={shippingForm.city}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                    <div className="col-12 col-md-4">
                                                        <label className="form-label small fw-bold">State</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="state"
                                                            value={shippingForm.state}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                    <div className="col-12 col-md-4">
                                                        <label className="form-label small fw-bold">Pincode *</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="pincode"
                                                            placeholder="632314"
                                                            value={shippingForm.pincode}
                                                            onChange={handleInputChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card 2: Payment Method */}
                                        <div className="card shadow-sm border-0 mb-4 rounded-3">
                                            <div className="card-header bg-success text-white fw-bold py-3">
                                                💳 2. Payment Method
                                            </div>
                                            <div className="card-body p-4">
                                                {/* Razorpay Online Payment Option */}
                                                <div className="card p-3 border border-success bg-light rounded-3">
                                                    <div className="d-flex align-items-center">
                                                        <div className="form-check me-3">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="paymentOption"
                                                                id="payRazorpay"
                                                                checked={true}
                                                                readOnly
                                                            />
                                                        </div>
                                                        <div className="w-100">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div>
                                                                    <strong className="text-dark d-block fs-6">Razorpay Online Payment (UPI, Cards, NetBanking)</strong>
                                                                    <span className="text-muted small">Pay securely via UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, and Wallets.</span>
                                                                </div>
                                                                <span className="badge bg-success px-2.5 py-1.5 ms-2">Instant & Secure</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Order Summary */}
                                    <div className="col-lg-5 col-md-12">
                                        <div className="card shadow-sm border-0 sticky-top" style={{ top: "90px" }}>
                                            <div className="card-header bg-light fw-bold py-3 border-bottom">
                                                📦 Order Details & Summary
                                            </div>
                                            {(!cart || !cart.items || cart.items.length === 0) ? (
                                                <div className="p-4 text-center text-muted">
                                                    <p className="mb-2">Your cart is currently empty.</p>
                                                    <Link to="/Shop" className="btn btn-sm btn-success">Browse Products</Link>
                                                </div>
                                            ) : (
                                                <>
                                                    <ul className="list-group list-group-flush" style={{ maxHeight: "300px", overflowY: "auto" }}>
                                                        {cart.items.map((item) => {
                                                            const product = item.product || {};
                                                            const variant = item.variant || {};
                                                            const imgUrl = getImageUrl(product.imageUrl || product.imageUrls?.[0]);
                                                            const itemTotal = item.unitPrice ? (item.unitPrice * item.quantity) : 0;

                                                            return (
                                                                <li key={item.id} className="list-group-item px-4 py-3">
                                                                    <div className="row align-items-center g-2">
                                                                        <div className="col-2">
                                                                            <img
                                                                                src={imgUrl}
                                                                                alt={product.name}
                                                                                className="img-fluid rounded border p-1"
                                                                                style={{ maxHeight: "45px", objectFit: "contain" }}
                                                                            />
                                                                        </div>
                                                                        <div className="col-6">
                                                                            <h6 className="mb-0 small fw-bold text-truncate">{product.name}</h6>
                                                                            <span className="badge bg-light text-success border small">
                                                                                {variant.variantName}
                                                                            </span>
                                                                        </div>
                                                                        <div className="col-2 text-center text-muted small">
                                                                            x{item.quantity}
                                                                        </div>
                                                                        <div className="col-2 text-end">
                                                                            <span className="fw-bold small">
                                                                                ₹{itemTotal.toLocaleString('en-IN')}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>

                                                    <div className="card-body bg-light border-top p-4">
                                                        <div className="d-flex justify-content-between mb-2 small">
                                                            <span>Items Subtotal</span>
                                                            <span className="fw-bold">₹{(cart.subtotal || 0).toLocaleString('en-IN')}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-2 small">
                                                            <span>Delivery & Taxes</span>
                                                            <span className="text-success fw-bold">FREE</span>
                                                        </div>
                                                        <hr />
                                                        <div className="d-flex justify-content-between fw-bold fs-5 text-dark mb-4">
                                                            <span>Total Payable</span>
                                                            <span className="text-success">₹{(cart.subtotal || 0).toLocaleString('en-IN')}</span>
                                                        </div>

                                                        <button
                                                            type="submit"
                                                            className="btn btn-success btn-lg w-100 fw-bold py-3 shadow-sm"
                                                            disabled={isProcessing}
                                                        >
                                                            {isProcessing ? (
                                                                "Processing Payment..."
                                                            ) : (
                                                                `🔒 Pay ₹${(cart.subtotal || 0).toLocaleString('en-IN')} via Razorpay`
                                                            )}
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export default ShopCheckOut;
