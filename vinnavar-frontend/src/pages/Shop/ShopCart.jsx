import { API_BASE_URL, getImageUrl } from "../../services/api";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import Swal from "sweetalert2";

const ShopCart = () => {
  const navigate = useNavigate();
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [cart, setCart] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null);

  const fetchCart = async () => {
    const cartId = localStorage.getItem("vinnavar_cart_id");
    if (!cartId) {
      setCart({ cartId: "", items: [], totalItemCount: 0, subtotal: 0 });
      setLoaderStatus(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/cart/${cartId}`);
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      } else {
        setCart({ cartId, items: [], totalItemCount: 0, subtotal: 0 });
      }
    } catch (err) {
      console.error("Error fetching cart data", err);
    } finally {
      setLoaderStatus(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }

    setUpdatingItemId(itemId);
    try {
      const res = await fetch(`${API_BASE_URL}/cart/items/${itemId}?quantity=${newQuantity}`, {
        method: "PUT"
      });
      if (res.ok) {
        const updatedCart = await res.json();
        setCart(updatedCart);
      } else {
        Swal.fire("Error", "Failed to update quantity", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Error updating quantity", "error");
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    setUpdatingItemId(itemId);
    try {
      const res = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Item Removed",
          timer: 1200,
          showConfirmButton: false
        });
        fetchCart();
      }
    } catch (err) {
      Swal.fire("Error", "Failed to remove item", "error");
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleClearCart = async () => {
    const cartId = localStorage.getItem("vinnavar_cart_id");
    if (!cartId) return;

    const result = await Swal.fire({
      title: "Clear Organic Cart?",
      text: "Are you sure you want to remove all items from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, clear it!"
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_BASE_URL}/cart/${cartId}`, {
          method: "DELETE"
        });
        if (res.ok) {
          Swal.fire("Cleared!", "Your cart is now empty.", "success");
          fetchCart();
        }
      } catch (err) {
        Swal.fire("Error", "Failed to clear cart.", "error");
      }
    }
  };

  const subtotal = cart?.subtotal || 0;
  const items = cart?.items || [];

  return (
    <div>
      <ScrollToTop />
      {loaderStatus ? (
        <div className="loader-container">
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
        <section className="mb-lg-14 mb-8 mt-8">
          <div className="container">
            {/* HEADING */}
            <div className="row">
              <div className="col-12">
                <div className="card py-1 border-0 mb-4">
                  <div>
                    <h1 className="fw-bold">My Organic Cart</h1>
                    <p className="mb-0 text-muted">
                      {items.length > 0
                        ? `You have ${cart?.totalItemCount || items.length} item(s) in your cart.`
                        : "Your shopping cart is currently empty."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* MAIN CART ROW */}
            {items.length === 0 ? (
              <div className="text-center py-5 bg-white rounded shadow-sm my-4">
                <div className="mb-3 display-1 text-muted">🛒</div>
                <h3 className="fw-bold text-dark">Your Cart is Empty</h3>
                <p className="text-muted mb-4">Explore our pure traditional organic rice, oils, and natural products.</p>
                <Link to="/Shop" className="btn btn-success btn-lg fw-bold px-4">
                  Explore Products
                </Link>
              </div>
            ) : (
              <div className="row">
                <div className="col-lg-8 col-md-7">
                  <div className="py-3">
                    {/* FREE SHIPPING ALERT */}
                    <div className="alert alert-success p-3 d-flex align-items-center justify-content-between" role="alert">
                      <div>
                        <strong>🌱 Free Delivery Unlocked!</strong> Inclusive of shipping charges & all taxes.
                      </div>
                      <Link to="/ShopCheckOut" className="btn btn-sm btn-success fw-bold">
                        Checkout Now &rsaquo;
                      </Link>
                    </div>

                    <ul className="list-group list-group-flush border rounded bg-white mb-4">
                      {items.map((item) => {
                        const product = item.product || {};
                        const variant = item.variant || {};
                        const imgUrl = getImageUrl(product.imageUrl || product.imageUrls?.[0]);
                        const itemTotal = item.unitPrice ? (item.unitPrice * item.quantity) : 0;

                        return (
                          <li key={item.id} className="list-group-item py-3 px-3">
                            <div className="row align-items-center">
                              {/* PRODUCT IMAGE */}
                              <div className="col-3 col-md-2">
                                <Link to={`/product/${product.slug}`}>
                                  <img
                                    src={imgUrl}
                                    alt={product.name}
                                    className="img-fluid rounded border p-1"
                                    style={{ maxHeight: "80px", objectFit: "contain" }}
                                  />
                                </Link>
                              </div>

                              {/* PRODUCT INFO */}
                              <div className="col-4 col-md-5">
                                <h6 className="mb-1 fw-bold">
                                  <Link to={`/product/${product.slug}`} className="text-decoration-none text-dark">
                                    {product.name}
                                  </Link>
                                </h6>
                                <span className="badge bg-light text-success border me-2">
                                  {variant.variantName || "Standard"}
                                </span>
                                <span className="small text-muted">
                                  ₹{item.unitPrice} each
                                </span>

                                <div className="mt-2 small">
                                  <button
                                    type="button"
                                    className="btn btn-link p-0 text-danger text-decoration-none small"
                                    onClick={() => handleRemoveItem(item.id)}
                                    disabled={updatingItemId === item.id}
                                  >
                                    🗑️ Remove
                                  </button>
                                </div>
                              </div>

                              {/* QUANTITY CONTROL */}
                              <div className="col-3 col-md-3">
                                <div className="input-group input-group-sm justify-content-center" style={{ maxWidth: "120px" }}>
                                  <button
                                    className="btn btn-outline-secondary fw-bold"
                                    type="button"
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    disabled={updatingItemId === item.id}
                                  >
                                    -
                                  </button>
                                  <input
                                    type="text"
                                    className="form-control text-center fw-bold px-1"
                                    value={item.quantity}
                                    readOnly
                                  />
                                  <button
                                    className="btn btn-outline-secondary fw-bold"
                                    type="button"
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    disabled={updatingItemId === item.id}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              {/* ITEM TOTAL PRICE */}
                              <div className="col-2 text-end">
                                <span className="fw-bold fs-6 text-dark">
                                  ₹{itemTotal.toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    {/* CART ACTION BUTTONS */}
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <Link to="/Shop" className="btn btn-outline-success fw-bold">
                        &lsaquo; Continue Shopping
                      </Link>
                      <button
                        type="button"
                        className="btn btn-outline-danger fw-bold"
                        onClick={handleClearCart}
                      >
                        Clear Cart
                      </button>
                    </div>
                  </div>
                </div>

                {/* SIDEBAR SUMMARY */}
                <div className="col-12 col-lg-4 col-md-5">
                  <div className="mb-5 card shadow-sm border-0 mt-3 mt-md-0">
                    <div className="card-body p-4">
                      <h5 className="fw-bold mb-3 text-dark">Order Summary</h5>
                      
                      <div className="card border-light mb-3">
                        <ul className="list-group list-group-flush small">
                          <li className="list-group-item d-flex justify-content-between align-items-center py-2">
                            <span>Item Subtotal ({cart?.totalItemCount || items.length} items)</span>
                            <span className="fw-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center py-2">
                            <span>Shipping & Delivery</span>
                            <span className="text-success fw-bold">FREE</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center py-2 bg-light">
                            <span className="fw-bold fs-6 text-dark">Total Amount</span>
                            <span className="fw-bold fs-5 text-success">
                              ₹{subtotal.toLocaleString('en-IN')}
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="d-grid gap-2 mb-3">
                        <button
                          className="btn btn-success btn-lg fw-bold d-flex justify-content-between align-items-center py-3"
                          onClick={() => navigate("/ShopCheckOut")}
                        >
                          <span>Proceed to Checkout</span>
                          <span>₹{subtotal.toLocaleString('en-IN')} &rsaquo;</span>
                        </button>
                      </div>

                      <p className="text-muted small text-center mb-0">
                        🔒 Safe & Secure Checkout • 100% Organic Guarantee
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default ShopCart;
