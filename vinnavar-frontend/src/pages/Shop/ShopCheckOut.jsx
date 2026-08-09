import { API_BASE_URL, createRazorpayOrder, getImageUrl, processCodCheckout, verifyRazorpayPayment } from "../../services/api";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
        gstin: "",
        street: "",
        city: "",
        state: "Tamil Nadu",
        pincode: ""
    });

    const [sameAsShipping, setSameAsShipping] = useState(true);

    const [billingForm, setBillingForm] = useState({
        name: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "Tamil Nadu",
        pincode: ""
    });

    const fetchCart = async (stateVal = shippingForm.state, pMethod = paymentMethod) => {
        const cartId = localStorage.getItem("vinnavar_cart_id");
        if (!cartId) {
            setCart({ items: [], subtotal: 0 });
            setLoaderStatus(false);
            return;
        }
        try {
            const res = await fetch(`${API_BASE_URL}/cart/${cartId}?state=${encodeURIComponent(stateVal || "Tamil Nadu")}&paymentMethod=${pMethod}`);
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
        fetchCart(shippingForm.state, paymentMethod);
    }, [shippingForm.state, paymentMethod]);

    useEffect(() => {
        const savedCustomer = localStorage.getItem("vinnavar_customer");
        if (savedCustomer) {
            try {
                const customer = JSON.parse(savedCustomer);
                setShippingForm(prev => ({
                    ...prev,
                    name: customer.name || prev.name,
                    email: customer.email || prev.email,
                    phone: customer.mobileNumber || prev.phone
                }));

                if (customer.mobileNumber) {
                    fetch(`${API_BASE_URL}/customer/addresses?mobile=${customer.mobileNumber}`)
                        .then(r => r.ok ? r.json() : [])
                        .then(addresses => {
                            if (Array.isArray(addresses) && addresses.length > 0) {
                                const defDelivery = addresses.find(a => a.addressType === "DELIVERY" && a.isDefault) || addresses.find(a => a.addressType === "DELIVERY");
                                if (defDelivery) {
                                    setShippingForm(prev => ({
                                        ...prev,
                                        name: defDelivery.fullName || prev.name,
                                        phone: defDelivery.phone || prev.phone,
                                        street: defDelivery.streetAddress || prev.street,
                                        city: defDelivery.city || prev.city,
                                        state: defDelivery.state || prev.state,
                                        pincode: defDelivery.pincode || prev.pincode
                                    }));
                                }

                                const defBilling = addresses.find(a => a.addressType === "BILLING" && a.isDefault) || addresses.find(a => a.addressType === "BILLING");
                                if (defBilling) {
                                    setBillingForm(prev => ({
                                        ...prev,
                                        name: defBilling.fullName || prev.name,
                                        phone: defBilling.phone || prev.phone,
                                        street: defBilling.streetAddress || prev.street,
                                        city: defBilling.city || prev.city,
                                        state: defBilling.state || prev.state,
                                        pincode: defBilling.pincode || prev.pincode
                                    }));
                                }
                            }
                        })
                        .catch(err => console.error("Error fetching saved addresses for checkout", err));
                }
            } catch (e) {
                console.error("Error parsing customer details for checkout", e);
            }
        }
    }, []);

    const handleShippingChange = (e) => {
        const { name, value } = e.target;
        setShippingForm((prev) => {
            const updated = { ...prev, [name]: value };
            if (sameAsShipping && name !== "gstin") {
                setBillingForm((bPrev) => ({ ...bPrev, [name]: value }));
            }
            return updated;
        });
    };

    const handleBillingChange = (e) => {
        const { name, value } = e.target;
        setBillingForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSameAsShippingToggle = (e) => {
        const checked = e.target.checked;
        setSameAsShipping(checked);
        if (checked) {
            setBillingForm({
                name: shippingForm.name,
                email: shippingForm.email,
                phone: shippingForm.phone,
                street: shippingForm.street,
                city: shippingForm.city,
                state: shippingForm.state,
                pincode: shippingForm.pincode
            });
        }
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        const cartId = localStorage.getItem("vinnavar_cart_id");
        if (!cart || !cart.items || cart.items.length === 0) {
            Swal.fire("Empty Cart", "Your cart has no items to checkout.", "warning");
            return;
        }

        if (!shippingForm.name || !shippingForm.phone || !shippingForm.street || !shippingForm.pincode) {
            Swal.fire("Missing Shipping Information", "Please fill in your Full Name, Mobile Phone, Shipping Address, and Pincode.", "warning");
            return;
        }

        if (!sameAsShipping && (!billingForm.name || !billingForm.street || !billingForm.pincode)) {
            Swal.fire("Missing Billing Information", "Please fill in all required Billing Address fields.", "warning");
            return;
        }

        const activeBilling = sameAsShipping ? {
            street: shippingForm.street,
            city: shippingForm.city,
            state: shippingForm.state,
            pincode: shippingForm.pincode
        } : {
            street: billingForm.street,
            city: billingForm.city,
            state: billingForm.state,
            pincode: billingForm.pincode
        };

        const checkoutData = {
            cartId,
            customerName: shippingForm.name,
            customerEmail: shippingForm.email || "customer@vinnavar.com",
            customerPhone: shippingForm.phone,
            userGstin: shippingForm.gstin || "",
            shippingAddress: {
                street: shippingForm.street,
                city: shippingForm.city,
                state: shippingForm.state,
                pincode: shippingForm.pincode
            },
            billingAddress: activeBilling,
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
                        color: "#047857"
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
                                confirmButtonColor: "#047857"
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
            try {
                const order = await processCodCheckout(checkoutData);
                localStorage.removeItem("vinnavar_cart_id");

                Swal.fire({
                    icon: "success",
                    title: "Order Placed (COD)! 🎉",
                    html: `Thank you for your order! Your Order ID is <strong>${order.orderNumber}</strong>.<br/>We will deliver your pure organic items shortly.`,
                    confirmButtonText: "Return to Home",
                    confirmButtonColor: "#047857"
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
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            <ScrollToTop />
            {loaderStatus ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500 font-medium">
                    <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <span>Initializing Secure Checkout...</span>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto space-y-8">
                    
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-8 text-white shadow-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-200 text-xs font-extrabold rounded-full border border-emerald-400/30 uppercase tracking-widest mb-2">
                                    Trusted Razorpay Gateway
                                </span>
                                <h1 className="text-2xl sm:text-3xl font-black">🛍️ Secure Checkout</h1>
                                <p className="text-emerald-100 text-xs sm:text-sm mt-1">
                                    100% Pure Organic Staples. Delivered directly to your home across India.
                                </p>
                            </div>
                            <Link
                                to="/ShopCart"
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-full border border-white/20 transition-all self-start sm:self-auto"
                            >
                                ← Edit Shopping Cart
                            </Link>
                        </div>
                    </div>

                    <form onSubmit={handlePlaceOrder}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* Left Column: Delivery & Billing Details (2 cols) */}
                            <div className="lg:col-span-2 space-y-6">
                                
                                {/* 1. Shipping Address Card */}
                                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
                                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                        <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
                                            1
                                        </span>
                                        <h2 className="font-extrabold text-slate-900 text-base">
                                            Shipping &amp; Delivery Address
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                                name="name"
                                                placeholder="e.g. Lokesh Rajan"
                                                value={shippingForm.name}
                                                onChange={handleShippingChange}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">Mobile Phone Number *</label>
                                            <input
                                                type="tel"
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                                name="phone"
                                                placeholder="+91 9876543210"
                                                value={shippingForm.phone}
                                                onChange={handleShippingChange}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">Email Address (Optional)</label>
                                            <input
                                                type="email"
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                                name="email"
                                                placeholder="you@example.com"
                                                value={shippingForm.email}
                                                onChange={handleShippingChange}
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">User GSTIN (Optional)</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 uppercase font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                                name="gstin"
                                                placeholder="33AAAAA0000A1Z5"
                                                value={shippingForm.gstin}
                                                onChange={handleShippingChange}
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label className="block font-bold text-slate-700 mb-1">House / Flat / Street Address *</label>
                                            <textarea
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                                name="street"
                                                rows="2"
                                                placeholder="#16, MS Nagar Phase 2, Kurumanthangal Road"
                                                value={shippingForm.street}
                                                onChange={handleShippingChange}
                                                required
                                            ></textarea>
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">City / Town</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                                name="city"
                                                placeholder="Arani"
                                                value={shippingForm.city}
                                                onChange={handleShippingChange}
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">State</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                                name="state"
                                                value={shippingForm.state}
                                                onChange={handleShippingChange}
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">Pincode *</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                                name="pincode"
                                                placeholder="632314"
                                                value={shippingForm.pincode}
                                                onChange={handleShippingChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Billing Address Card */}
                                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
                                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                        <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
                                            2
                                        </span>
                                        <h2 className="font-extrabold text-slate-900 text-base">
                                            Billing Address
                                        </h2>
                                    </div>

                                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                                        <label className="flex items-center gap-3 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={sameAsShipping}
                                                onChange={handleSameAsShippingToggle}
                                                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                                            />
                                            <span className="text-xs font-bold text-slate-900">
                                                Billing Address is same as Shipping Address
                                            </span>
                                        </label>
                                    </div>

                                    {!sameAsShipping && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                            <div>
                                                <label className="block font-bold text-slate-700 mb-1">Billing Full Name *</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                                    name="name"
                                                    value={billingForm.name}
                                                    onChange={handleBillingChange}
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block font-bold text-slate-700 mb-1">Billing Phone Number *</label>
                                                <input
                                                    type="tel"
                                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                                    name="phone"
                                                    value={billingForm.phone}
                                                    onChange={handleBillingChange}
                                                    required
                                                />
                                            </div>

                                            <div className="sm:col-span-2">
                                                <label className="block font-bold text-slate-700 mb-1">Billing Address *</label>
                                                <textarea
                                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                                    name="street"
                                                    rows="2"
                                                    value={billingForm.street}
                                                    onChange={handleBillingChange}
                                                    required
                                                ></textarea>
                                            </div>

                                            <div>
                                                <label className="block font-bold text-slate-700 mb-1">City / Town</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                                    name="city"
                                                    value={billingForm.city}
                                                    onChange={handleBillingChange}
                                                />
                                            </div>

                                            <div>
                                                <label className="block font-bold text-slate-700 mb-1">Pincode *</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                                    name="pincode"
                                                    value={billingForm.pincode}
                                                    onChange={handleBillingChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* 3. Payment Method Card */}
                                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
                                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                        <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
                                            3
                                        </span>
                                        <h2 className="font-extrabold text-slate-900 text-base">
                                            Payment Method
                                        </h2>
                                    </div>

                                    <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 rounded-full bg-emerald-700 border-2 border-white shadow-xs"></div>
                                            <div>
                                                <div className="font-bold text-slate-900 text-xs sm:text-sm">
                                                    Razorpay Payment Gateway (UPI, Cards, NetBanking)
                                                </div>
                                                <div className="text-slate-500 text-[11px] mt-0.5">
                                                    Pay securely via GPay, PhonePe, Paytm, Credit/Debit Cards, &amp; NetBanking.
                                                </div>
                                            </div>
                                        </div>
                                        <span className="px-2.5 py-1 bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-xs">
                                            Instant &amp; 100% Safe
                                        </span>
                                    </div>
                                </div>

                            </div>

                            {/* Right Column: Order Summary (1 col) */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 sticky top-24">
                                    <h2 className="font-black text-slate-900 text-lg border-b border-slate-100 pb-3">
                                        Order Summary
                                    </h2>

                                    {(!cart || !cart.items || cart.items.length === 0) ? (
                                        <div className="text-center py-6 text-slate-400 space-y-3">
                                            <p className="text-xs">Your cart is empty.</p>
                                            <Link to="/Shop" className="inline-block px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-full">
                                                Browse Products
                                            </Link>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="max-h-64 overflow-y-auto space-y-3 pr-1 divide-y divide-slate-100">
                                                {cart.items.map((item) => {
                                                    const product = item.product || {};
                                                    const variant = item.variant || {};
                                                    const imgUrl = getImageUrl(product.imageUrl || product.imageUrls?.[0]);
                                                    const itemTotal = item.unitPrice ? item.unitPrice * item.quantity : 0;

                                                    return (
                                                        <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                                                            <div className="flex items-center gap-3">
                                                                <img
                                                                    src={imgUrl}
                                                                    alt={product.name}
                                                                    className="w-10 h-10 object-contain rounded-xl bg-slate-50 border border-slate-100 p-1"
                                                                />
                                                                <div>
                                                                    <h4 className="font-bold text-slate-900 text-xs truncate max-w-[130px]">
                                                                        {product.name}
                                                                    </h4>
                                                                    <span className="text-[10px] text-emerald-700 font-semibold">
                                                                        {variant.variantName} x {item.quantity}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <span className="font-extrabold text-slate-900">
                                                                ₹{itemTotal.toLocaleString("en-IN")}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="space-y-2 text-xs font-medium pt-4 border-t border-slate-100">
                                                <div className="flex justify-between text-slate-700">
                                                    <span className="font-bold text-slate-900">Base Price (Subtotal)</span>
                                                    <span className="font-black text-slate-900">₹{(cart.subtotal || 0).toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-slate-700">
                                                    <span className="font-bold text-slate-900">Shipment</span>
                                                    <span className="text-right">
                                                        <span className="text-[10px] text-slate-500 block">Weight Based ({(cart.totalWeightKg || 0).toFixed(1)} kg):</span>
                                                        <span className="font-black text-emerald-700">₹{(cart.shippingFee ?? 48).toFixed(2)}</span>
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-slate-700">
                                                    <span className="font-bold text-slate-900">GST Tax</span>
                                                    <span className="font-black text-emerald-700">₹{(cart.gstTax ?? 0).toFixed(2)}</span>
                                                </div>
                                                {cart?.roundOff !== undefined && cart?.roundOff !== null && cart.roundOff !== 0 && (
                                                    <div className="flex justify-between text-slate-700">
                                                        <span className="font-bold text-slate-900">Round Off</span>
                                                        <span className="font-black text-emerald-700">{cart.roundOff > 0 ? `+₹${cart.roundOff.toFixed(2)}` : `-₹${Math.abs(cart.roundOff).toFixed(2)}`}</span>
                                                    </div>
                                                )}
                                                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-sm font-black text-slate-900">
                                                    <span>Total Payable</span>
                                                    <span className="text-xl text-emerald-700">
                                                        ₹{(cart.totalAmount ?? ((cart.subtotal || 0) + (cart.shippingFee ?? 48) + ((cart.subtotal || 0) * 0.05))).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-full shadow-lg shadow-emerald-700/20 transition-all active:scale-95 disabled:opacity-50"
                                                disabled={isProcessing}
                                            >
                                                {isProcessing ? (
                                                    "Processing Secure Payment..."
                                                ) : (
                                                    `🔒 Pay ₹${(cart.totalAmount ?? ((cart.subtotal || 0) + (cart.shippingFee ?? 48) + ((cart.subtotal || 0) * 0.05))).toFixed(2)} via Razorpay`
                                                )}
                                            </button>

                                            <div className="text-center">
                                                <p className="text-[11px] text-slate-400 font-semibold">
                                                    🛡️ 100% Encrypted &amp; Verified by Razorpay
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                        </div>
                    </form>

                </div>
            )}
        </div>
    );
};

export default ShopCheckOut;
