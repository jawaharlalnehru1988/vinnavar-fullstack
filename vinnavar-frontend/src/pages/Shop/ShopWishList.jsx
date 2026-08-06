import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Swal from "sweetalert2";
import ScrollToTop from "../ScrollToTop";
import { API_BASE_URL, getImageUrl, fetchWishlist, removeFromWishlist, clearWishlist } from "../../services/api";
import { CartSkeleton } from "../../Component/Skeleton";

const ShopWishList = () => {
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [wishlist, setWishlist] = useState({ items: [], totalItemCount: 0 });
  const [selectedItems, setSelectedItems] = useState([]);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const loadWishlistData = async () => {
    try {
      const data = await fetchWishlist();
      setWishlist(data || { items: [], totalItemCount: 0 });
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
    } finally {
      setLoaderStatus(false);
    }
  };

  useEffect(() => {
    loadWishlistData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(wishlist.items.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleAddToCart = async (item) => {
    setActionLoadingId(item.id);
    try {
      let cartId = localStorage.getItem("vinnavar_cart_id");
      if (!cartId) {
        cartId = "cart_" + Math.random().toString(36).substring(2, 11);
        localStorage.setItem("vinnavar_cart_id", cartId);
      }

      const variantId = item.variant
        ? item.variant.id
        : item.product.variants && item.product.variants.length > 0
        ? item.product.variants[0].id
        : null;

      const response = await fetch(`${API_BASE_URL}/cart/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: cartId,
          productId: item.product.id,
          variantId: variantId,
          quantity: 1
        })
      });

      if (response.ok) {
        window.dispatchEvent(new Event("cartUpdated"));
        Swal.fire({
          icon: "success",
          title: "Added to Organic Cart",
          text: `${item.product.name} ${item.variant ? `(${item.variant.variantName})` : ""} added to your cart!`,
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        Swal.fire("Cart Error", "Failed to add item to cart.", "error");
      }
    } catch (error) {
      console.error("Error adding item to cart from wishlist:", error);
      Swal.fire("Error", "Could not add item to cart.", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRemove = async (itemId, productName) => {
    const result = await Swal.fire({
      title: "Remove from Wishlist?",
      text: `Remove ${productName || "this item"} from your wishlist?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, remove it!"
    });

    if (result.isConfirmed) {
      setActionLoadingId(itemId);
      try {
        const success = await removeFromWishlist(itemId);
        if (success) {
          window.dispatchEvent(new Event("cartUpdated"));
          Swal.fire({
            icon: "success",
            title: "Removed",
            text: "Item removed from wishlist",
            timer: 1200,
            showConfirmButton: false
          });
          setSelectedItems(selectedItems.filter((id) => id !== itemId));
          loadWishlistData();
        } else {
          Swal.fire("Error", "Failed to remove item from wishlist.", "error");
        }
      } catch (err) {
        console.error("Error removing item:", err);
        Swal.fire("Error", "Failed to remove item", "error");
      } finally {
        setActionLoadingId(null);
      }
    }
  };

  const handleClearAll = async () => {
    if (!wishlist.items || wishlist.items.length === 0) return;

    const result = await Swal.fire({
      title: "Clear Entire Wishlist?",
      text: "Are you sure you want to clear all products from your wishlist?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, clear all!"
    });

    if (result.isConfirmed) {
      try {
        await clearWishlist();
        setSelectedItems([]);
        window.dispatchEvent(new Event("cartUpdated"));
        Swal.fire({
          icon: "success",
          title: "Wishlist Cleared",
          timer: 1200,
          showConfirmButton: false
        });
        loadWishlistData();
      } catch (err) {
        Swal.fire("Error", "Failed to clear wishlist.", "error");
      }
    }
  };

  const allSelected = wishlist.items.length > 0 && selectedItems.length === wishlist.items.length;

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
          
          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full border border-red-200/60 mb-2">
                ❤️ Saved Favorites
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">My Wishlist</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {wishlist.items.length === 1
                  ? "There is 1 saved organic product in your wishlist."
                  : `There are ${wishlist.items.length} saved organic products in your wishlist.`}
              </p>
            </div>

            {wishlist.items.length > 0 && (
              <button
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-full border border-red-200/80 transition-all self-start sm:self-auto flex items-center gap-1.5"
                onClick={handleClearAll}
              >
                <span>🗑️</span> Clear Wishlist
              </button>
            )}
          </div>

          {/* Main Content */}
          {wishlist.items.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 sm:p-16 border border-slate-100 shadow-sm text-center space-y-4 max-w-xl mx-auto">
              <div className="text-5xl">❤️</div>
              <h2 className="text-xl font-black text-slate-900">Your Wishlist is Empty</h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Save your favorite traditional organic rice, cold-pressed oils, and spices here for quick access later!
              </p>
              <div className="pt-2">
                <Link
                  to="/Shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-full shadow-lg shadow-emerald-700/20 transition-all active:scale-95"
                >
                  <span>Explore Products</span>
                  <span>➔</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              
              {/* Desktop Table View */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-100 uppercase tracking-wider font-extrabold text-[11px] text-slate-400">
                    <tr>
                      <th scope="col" className="p-4 w-12 text-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                          checked={allSelected}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th scope="col" className="py-4 px-4">Product</th>
                      <th scope="col" className="py-4 px-4">Variant / Unit</th>
                      <th scope="col" className="py-4 px-4">Price</th>
                      <th scope="col" className="py-4 px-4">Stock Status</th>
                      <th scope="col" className="py-4 px-4 text-center">Action</th>
                      <th scope="col" className="py-4 px-4 text-center">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {wishlist.items.map((item) => {
                      const product = item.product || {};
                      const variant =
                        item.variant ||
                        (product.variants && product.variants.length > 0 ? product.variants[0] : null);
                      const price = variant ? variant.discountPrice || variant.price : 0;
                      const isOriginalPrice = variant && variant.discountPrice && variant.price > variant.discountPrice;
                      const inStock = variant ? variant.stockQuantity > 0 : true;
                      const imageSrc = getImageUrl(product.imageUrl || "/media/placeholder.png");

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                          {/* Checkbox */}
                          <td className="p-4 text-center">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                              checked={selectedItems.includes(item.id)}
                              onChange={() => handleSelectItem(item.id)}
                            />
                          </td>

                          {/* Image & Product Name */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <Link to={`/product/${product.slug || product.id}`} className="flex-shrink-0">
                                <img
                                  src={imageSrc}
                                  alt={product.name || "Product"}
                                  className="w-16 h-16 object-contain rounded-2xl bg-slate-50 border border-slate-100 p-1.5"
                                />
                              </Link>
                              <div>
                                <h3 className="font-bold text-slate-900 text-xs sm:text-sm hover:text-emerald-700 transition-colors">
                                  <Link to={`/product/${product.slug || product.id}`}>
                                    {product.name}
                                  </Link>
                                </h3>
                                <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                                  {product.category?.name || "Organic Staples"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Variant */}
                          <td className="py-4 px-4">
                            <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-800 text-[11px] font-bold rounded-full border border-slate-200/60">
                              {variant?.variantName || "Standard Pack"}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-4 px-4">
                            <div className="font-black text-slate-900 text-sm">
                              ₹{Number(price).toFixed(2)}
                              {isOriginalPrice && (
                                <span className="text-xs font-normal text-slate-400 line-through ml-1.5">
                                  ₹{Number(variant.price).toFixed(2)}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Stock Status */}
                          <td className="py-4 px-4">
                            {inStock ? (
                              <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase tracking-wider rounded-full border border-emerald-200/60">
                                In Stock
                              </span>
                            ) : (
                              <span className="inline-block px-2.5 py-1 bg-red-50 text-red-600 text-[10px] font-extrabold uppercase tracking-wider rounded-full border border-red-200/60">
                                Out of Stock
                              </span>
                            )}
                          </td>

                          {/* Add to Cart Action */}
                          <td className="py-4 px-4 text-center">
                            {inStock ? (
                              <button
                                type="button"
                                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-full shadow-md shadow-emerald-700/20 transition-all active:scale-95 disabled:opacity-50 inline-flex items-center gap-1.5"
                                disabled={actionLoadingId === item.id}
                                onClick={() => handleAddToCart(item)}
                              >
                                {actionLoadingId === item.id ? (
                                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                  <span>🛒</span>
                                )}
                                <span>Add to Cart</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="px-4 py-2 bg-slate-100 text-slate-400 font-bold text-xs rounded-full cursor-not-allowed"
                                disabled
                              >
                                Out of Stock
                              </button>
                            )}
                          </td>

                          {/* Delete Item */}
                          <td className="py-4 px-4 text-center">
                            <button
                              type="button"
                              className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                              title="Delete Item"
                              onClick={() => handleRemove(item.id, product.name)}
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default ShopWishList;
