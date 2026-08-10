import { API_BASE_URL, getImageUrl } from "../../services/api";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import Swal from "sweetalert2";

import { CartSkeleton } from "../../Component/Skeleton";
import { useTranslation } from "react-i18next";

const ShopCart = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [cart, setCart] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [settingsMap, setSettingsMap] = useState({});
  const [policyModal, setPolicyModal] = useState(null); // { title, content }

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/settings`);
      if (res.ok) {
        const data = await res.json();
        setSettingsMap(data || {});
      }
    } catch (err) {
      console.error("Error fetching store settings", err);
    }
  };

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
    fetchSettings();
    window.addEventListener("cartUpdated", fetchCart);
    return () => {
      window.removeEventListener("cartUpdated", fetchCart);
    };
  }, []);

  const openPolicy = (type) => {
    if (type === "REFUND") {
      setPolicyModal({
        title: "📜 Refund & Cancellation Policy",
        content: settingsMap.refund_policy || "Refund Policy details loading..."
      });
    } else if (type === "PRIVACY") {
      setPolicyModal({
        title: "🔒 Privacy Policy",
        content: settingsMap.privacy_policy || "Privacy Policy details loading..."
      });
    } else if (type === "TERMS") {
      setPolicyModal({
        title: "📋 Terms & Conditions",
        content: settingsMap.terms_conditions || "Terms & Conditions details loading..."
      });
    }
  };

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
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="w-48 h-8 bg-slate-200/80 rounded-full animate-pulse"></div>
          <CartSkeleton count={3} />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Page Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200/60 mb-2">
                {t("shopping_bag")}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{t("my_cart")}</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {items.length > 0
                  ? (cart?.totalItemCount || items.length) === 1 ? t("cart_one_item") : t("cart_multi_items", { count: cart?.totalItemCount || items.length })
                  : t("cart_empty_msg")}
              </p>
            </div>
            {items.length > 0 && (
              <button
                type="button"
                className="px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 font-bold text-xs rounded-full border border-slate-200/80 transition-all self-start sm:self-auto"
                onClick={handleClearCart}
              >
                🗑️ {t("clear_cart_btn")}
              </button>
            )}
          </div>

          {/* Cart Content */}
          {items.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 sm:p-16 border border-slate-100 shadow-sm text-center space-y-4 max-w-xl mx-auto">
              <div className="text-5xl">🛒</div>
              <h2 className="text-xl font-black text-slate-900">{t("cart_empty_title")}</h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {t("cart_empty_desc")}
              </p>
              <div className="pt-2">
                <Link
                  to="/Shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-full shadow-lg shadow-emerald-700/20 transition-all active:scale-95"
                >
                  <span>{t("explore_catalog")}</span>
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
                    <span>{t("free_delivery")}</span>
                  </div>
                  <Link
                    to="/ShopCheckOut"
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-full transition-all shadow-sm"
                  >
                    {t("checkout_now")} ➔
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
                                {variant.variantName || t("standard_pack")}
                              </span>
                              <span className="text-xs font-medium text-slate-500">₹{item.unitPrice} / {t("unit")}</span>
                            </div>
                            <button
                              type="button"
                              className="text-[11px] font-bold text-red-500 hover:text-red-700 pt-1 block"
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={updatingItemId === item.id}
                            >
                              🗑️ {t("remove_btn")}
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
                    <span>← {t("continue_shopping")}</span>
                  </Link>
                </div>

              </div>

              {/* Right Column: Order Summary Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 sticky top-24">
                  <h2 className="font-black text-slate-900 text-center text-lg border-b border-slate-100 pb-3 uppercase tracking-wider">
                    {t("your_order")}
                  </h2>

                  {/* Itemized List in Summary */}
                  <div className="space-y-3 pb-3 border-b border-slate-100">
                    <div className="flex justify-between text-xs font-bold text-slate-900 uppercase pb-1 border-b border-slate-100">
                      <span>{t("product_col")}</span>
                      <span>{t("subtotal_col")}</span>
                    </div>
                    {items.map((item, idx) => {
                      const p = item.product || {};
                      const v = item.variant || {};
                      const lineTotal = item.unitPrice ? item.unitPrice * item.quantity : 0;
                      return (
                        <div key={idx} className="flex justify-between items-start text-xs gap-3">
                          <span className="text-slate-600 font-medium leading-tight">
                            {p.name} {v.variantName ? `- ${v.variantName}` : ''}<br />
                            <strong className="text-slate-900">× {item.quantity}</strong>
                          </span>
                          <span className="font-semibold text-slate-800 whitespace-nowrap">
                            ₹{lineTotal.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-3 text-xs font-medium">
                    <div className="flex justify-between text-slate-700">
                      <span className="font-bold text-slate-900">{t("subtotal_label")}</span>
                      <span className="font-black text-emerald-700">₹{subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-700">
                      <span className="font-bold text-slate-900">{t("shipment")}</span>
                      <span className="text-right">
                        <span className="text-[11px] text-slate-500 block">{t("weight_shipping", { weight: (cart?.totalWeightKg || 0).toFixed(1) })}</span>
                        <span className="font-black text-emerald-700">₹{(cart?.shippingFee ?? 48).toFixed(2)}</span>
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-700">
                      <span className="font-bold text-slate-900">{t("tax_gst")}</span>
                      <span className="font-black text-emerald-700">₹{(cart?.gstTax ?? 0).toFixed(2)}</span>
                    </div>

                    {cart?.roundOff !== undefined && cart?.roundOff !== null && cart.roundOff !== 0 && (
                      <div className="flex justify-between text-slate-700">
                        <span className="font-bold text-slate-900">{t("round_off")}</span>
                        <span className="font-black text-emerald-700">{cart.roundOff > 0 ? `+₹${cart.roundOff.toFixed(2)}` : `-₹${Math.abs(cart.roundOff).toFixed(2)}`}</span>
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-sm font-black text-slate-900">
                      <span>{t("total")}</span>
                      <span className="text-2xl text-emerald-700">
                        ₹{(cart?.totalAmount ?? (subtotal + (cart?.shippingFee ?? 48) + (subtotal * 0.05))).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-full shadow-lg shadow-emerald-700/20 transition-all active:scale-95 flex items-center justify-between px-6"
                    onClick={() => navigate("/ShopCheckOut")}
                  >
                    <span>{t("proceed_to_checkout")}</span>
                    <span>₹{(cart?.totalAmount ?? (subtotal + (cart?.shippingFee ?? 48) + (subtotal * 0.05))).toFixed(2)} ➔</span>
                  </button>

                  <div className="text-center pt-3 border-t border-slate-100 space-y-2">
                    <p className="text-[11px] text-slate-400 font-semibold">
                      🔒 {t("safe_checkout")}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 text-[11px] font-bold text-emerald-700">
                      <button type="button" onClick={() => openPolicy("REFUND")} className="hover:underline cursor-pointer border-0 bg-transparent text-emerald-700 p-0 font-bold">{t("refund_policy")}</button>
                      <span>•</span>
                      <button type="button" onClick={() => openPolicy("PRIVACY")} className="hover:underline cursor-pointer border-0 bg-transparent text-emerald-700 p-0 font-bold">{t("privacy_policy")}</button>
                      <span>•</span>
                      <button type="button" onClick={() => openPolicy("TERMS")} className="hover:underline cursor-pointer border-0 bg-transparent text-emerald-700 p-0 font-bold">{t("terms_conditions")}</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* Dynamic Policy Modal */}
      {policyModal && (
        <div className="modal show d-block bg-dark bg-opacity-50" tabIndex={-1} style={{ zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
              <div className="modal-header bg-emerald-700 text-white py-3 px-4">
                <h5 className="modal-title font-bold text-white mb-0">{policyModal.title}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setPolicyModal(null)} />
              </div>
              <div className="modal-body p-4 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-sans max-h-96 overflow-y-auto">
                {policyModal.content}
              </div>
              <div className="modal-footer border-0 pt-0">
                <button type="button" className="btn btn-sm btn-success font-bold rounded-pill px-4" onClick={() => setPolicyModal(null)}>
                  {t("close_btn")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopCart;
