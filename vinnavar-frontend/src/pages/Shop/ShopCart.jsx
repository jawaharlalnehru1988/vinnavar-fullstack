import { API_BASE_URL, getImageUrl } from "../../services/api";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
        window.dispatchEvent(new Event("cartUpdated"));
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
        window.dispatchEvent(new Event("cartUpdated"));
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
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <ScrollToTop />
      {loaderStatus ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500 font-medium">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <span>Loading Your Shopping Cart...</span>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Page Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200/60 mb-2">
                Shopping Bag
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">My Organic Cart</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {items.length > 0
                  ? `You have ${cart?.totalItemCount || items.length} pure organic item(s) ready for checkout.`
                  : "Your shopping cart is currently empty."}
              </p>
            </div>
            {items.length > 0 && (
              <button
                type="button"
                className="px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 font-bold text-xs rounded-full border border-slate-200/80 transition-all self-start sm:self-auto"
                onClick={handleClearCart}
              >
                🗑️ Clear Cart
              </button>
            )}
          </div>

          {/* Cart Content */}
          {items.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 sm:p-16 border border-slate-100 shadow-sm text-center space-y-4 max-w-xl mx-auto">
              <div className="text-5xl">🛒</div>
              <h2 className="text-xl font-black text-slate-900">Your Cart is Empty</h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Explore our certified organic grains, traditional rice varieties, and cold-pressed oils.
              </p>
              <div className="pt-2">
                <Link
                  to="/Shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-full shadow-lg shadow-emerald-700/20 transition-all active:scale-95"
                >
                  <span>Explore Organic Catalog</span>
                  <span>➔</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Cart Items List */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Free Shipping Highlight Banner */}
                <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl p-4 border border-emerald-200/80 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <span className="text-base">🌱</span>
                    <span>Free Delivery Unlocked! Inclusive of shipping charges &amp; all GST taxes.</span>
                  </div>
                  <Link
                    to="/ShopCheckOut"
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-full transition-all shadow-sm"
                  >
                    Checkout Now ➔
                  </Link>
                </div>

                {/* Items List Card */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
                  {items.map((item) => {
                    const product = item.product || {};
                    const variant = item.variant || {};
                    const imgUrl = getImageUrl(product.imageUrl || product.imageUrls?.[0]);
                    const itemTotal = item.unitPrice ? item.unitPrice * item.quantity : 0;

                    return (
                      <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Image & Info */}
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <Link to={`/product/${product.slug}`} className="flex-shrink-0">
                            <img
                              src={imgUrl}
                              alt={product.name}
                              className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-2xl bg-slate-50 border border-slate-100 p-2"
                            />
                          </Link>
                          <div className="space-y-1">
                            <h3 className="font-bold text-slate-900 text-sm hover:text-emerald-700 transition-colors">
                              <Link to={`/product/${product.slug}`}>{product.name}</Link>
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-emerald-800 text-[10px] font-extrabold rounded-full border border-slate-200/60">
                                {variant.variantName || "Standard"}
                              </span>
                              <span className="text-xs font-medium text-slate-500">₹{item.unitPrice} / unit</span>
                            </div>
                            <button
                              type="button"
                              className="text-[11px] font-bold text-red-500 hover:text-red-700 pt-1 block"
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={updatingItemId === item.id}
                            >
                              🗑️ Remove
                            </button>
                          </div>
                        </div>

                        {/* Quantity Controls & Price */}
                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          {/* Quantity Selector */}
                          <div className="flex items-center border border-slate-200 rounded-full bg-slate-50 p-1">
                            <button
                              type="button"
                              className="w-7 h-7 rounded-full bg-white text-slate-700 font-black text-sm flex items-center justify-center hover:bg-slate-200 transition-colors disabled:opacity-50"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={updatingItemId === item.id}
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-xs font-black text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className="w-7 h-7 rounded-full bg-white text-slate-700 font-black text-sm flex items-center justify-center hover:bg-slate-200 transition-colors disabled:opacity-50"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={updatingItemId === item.id}
                            >
                              +
                            </button>
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <span className="text-base font-black text-slate-900">
                              ₹{itemTotal.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Back to Shop Link */}
                <div>
                  <Link
                    to="/Shop"
                    className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                  >
                    <span>← Continue Shopping</span>
                  </Link>
                </div>

              </div>

              {/* Right Column: Order Summary Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 sticky top-24">
                  <h2 className="font-black text-slate-900 text-lg border-b border-slate-100 pb-3">
                    Order Summary
                  </h2>

                  <div className="space-y-3 text-xs font-medium">
                    <div className="flex justify-between text-slate-600">
                      <span>Item Subtotal ({cart?.totalItemCount || items.length} items)</span>
                      <span className="font-bold text-slate-900">₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Shipping &amp; Delivery</span>
                      <span className="font-bold text-emerald-600">FREE</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>GST Taxes</span>
                      <span className="font-bold text-emerald-600">Inclusive</span>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-sm font-black text-slate-900">
                      <span>Total Amount</span>
                      <span className="text-xl text-emerald-700">₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-full shadow-lg shadow-emerald-700/20 transition-all active:scale-95 flex items-center justify-between px-6"
                    onClick={() => navigate("/ShopCheckOut")}
                  >
                    <span>Proceed to Checkout</span>
                    <span>₹{subtotal.toLocaleString("en-IN")} ➔</span>
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-[11px] text-slate-400 font-semibold">
                      🔒 Safe &amp; Secure Checkout • 100% Organic Guarantee
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default ShopCart;
