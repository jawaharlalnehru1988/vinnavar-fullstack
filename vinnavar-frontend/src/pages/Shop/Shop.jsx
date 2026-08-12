import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ScrollToTop from "../ScrollToTop";
import { API_BASE_URL, fetchCategories, fetchProducts, getImageUrl, toggleWishlist } from "../../services/api";
import { ProductSkeleton } from "../../Component/Skeleton";
import { useTranslation } from "react-i18next";

const assortment = getImageUrl("/media/site/assortment-citrus-fruits.png");

const Product = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Featured");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const catParam = searchParams.get("category");
    if (catParam) {
      setSelectedCategoryId(parseInt(catParam));
    }
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [catData, prodData] = await Promise.all([
          fetchCategories(),
          fetchProducts()
        ]);
        setCategories(catData || []);
        setProducts(prodData || []);

        const defaults = {};
        (prodData || []).forEach((prod) => {
          const default5kg = prod.variants?.find((v) => v.variantName?.toLowerCase().replace(/\s+/g, "") === "5kg");
          const defaultVar = default5kg || prod.variants?.find((v) => v.default || v.isDefault) || prod.variants?.[0];
          if (defaultVar) {
            defaults[prod.id] = defaultVar;
          }
        });
        setSelectedVariants(defaults);
      } catch (err) {
        console.error("Error loading shop data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleVariantChange = (productId, variantId) => {
    const product = products.find((p) => p.id === productId);
    const variant = product?.variants?.find((v) => v.id === parseInt(variantId));
    if (variant) {
      setSelectedVariants((prev) => ({ ...prev, [productId]: variant }));
    }
  };

  const handleAddToCart = async (product) => {
    const variant = selectedVariants[product.id] || product.variants?.[0];
    if (!variant) return;

    let cartId = localStorage.getItem("vinnavar_cart_id");
    if (!cartId) {
      cartId = "cart_" + Math.random().toString(36).substring(2, 11);
      localStorage.setItem("vinnavar_cart_id", cartId);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/cart/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: cartId,
          productId: product.id,
          variantId: variant.id,
          quantity: 1
        })
      });

      if (response.ok) {
        window.dispatchEvent(new Event("cartUpdated"));
        Swal.fire({
          icon: "success",
          title: "Added to Cart",
          text: `${product.name} (${variant.variantName}) added to cart!`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (err) {
      Swal.fire("Cart Error", "Failed to add product to cart.", "error");
    }
  };

  const handleToggleWishlist = async (product) => {
    const variant = selectedVariants[product.id] || product.variants?.[0];
    try {
      await toggleWishlist(product.id, variant?.id);
      Swal.fire({
        icon: "success",
        title: "Wishlist Updated",
        text: `${product.name} updated in your wishlist!`,
        timer: 1200,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire("Wishlist Error", "Could not update wishlist.", "error");
    }
  };

  // Include all active categories from backend
  const activeCategories = categories.filter((cat) => cat.active !== false);

  // Filter products based on category & search term
  let filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategoryId ? p.category?.id === selectedCategoryId : true;
    const matchesSearch = searchTerm.trim()
      ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  // Sort products
  if (sortBy === "Low to High") {
    filteredProducts.sort((a, b) => {
      const pA = selectedVariants[a.id]?.discountPrice || selectedVariants[a.id]?.price || 0;
      const pB = selectedVariants[b.id]?.discountPrice || selectedVariants[b.id]?.price || 0;
      return pA - pB;
    });
  } else if (sortBy === "High to Low") {
    filteredProducts.sort((a, b) => {
      const pA = selectedVariants[a.id]?.discountPrice || selectedVariants[a.id]?.price || 0;
      const pB = selectedVariants[b.id]?.discountPrice || selectedVariants[b.id]?.price || 0;
      return pB - pA;
    });
  }

  const selectedCategoryObj = categories.find((c) => c.id === selectedCategoryId);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <ScrollToTop />
      {loading ? (
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="w-48 h-8 bg-slate-200/80 rounded-full animate-pulse"></div>
          <ProductSkeleton count={6} />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center text-xs sm:text-sm font-medium text-slate-500 space-x-2">
            <Link to="/" className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors">
              {t("nav_home")}
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">{t("nav_shop_catalog")}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Column: Categories & Search */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Categories Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-extrabold text-slate-900 text-base uppercase tracking-wider">
                    {t("categories")}
                  </h3>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
                    {activeCategories.length}
                  </span>
                </div>
                <div className="space-y-1">
                  <button
                    type="button"
                    className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                      selectedCategoryId === null
                        ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
                        : "text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
                    }`}
                    onClick={() => setSelectedCategoryId(null)}
                  >
                    🌱 {t("all_categories")}
                  </button>
                  {activeCategories.map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                        selectedCategoryId === cat.id
                          ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
                          : "text-slate-600 hover:bg-slate-50 hover:text-emerald-700"
                      }`}
                      onClick={() => setSelectedCategoryId(cat.id)}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Search Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
                <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider pb-2 border-b border-slate-100">
                  {t("search_catalog")}
                </h3>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                  <input
                    type="text"
                    className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400"
                    placeholder={t("search_placeholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                      onClick={() => setSearchTerm("")}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Banner Offer Card */}
              <div
                className="relative rounded-3xl overflow-hidden shadow-md p-6 text-white text-center flex flex-col justify-center min-h-[260px]"
                style={{ backgroundImage: `url(${assortment})`, backgroundSize: "cover", backgroundPosition: "center" }}
              >
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
                <div className="relative z-10 space-y-3">
                  <span className="inline-block px-3 py-1 bg-emerald-500/30 text-emerald-200 text-[10px] font-extrabold uppercase tracking-widest rounded-full border border-emerald-400/30">
                    {t("farm_fresh")}
                  </span>
                  <h4 className="text-xl font-black">{t("pure_organic")}</h4>
                  <p className="text-xs text-slate-200">{t("cert_grains_oils")}</p>
                  <div>
                    <button
                      type="button"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
                      onClick={() => { setSelectedCategoryId(null); setSearchTerm(""); }}
                    >
                      {t("shop_all_items")}
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Main Content Column: Catalog Header & Grid */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Category Header Banner */}
              <div className="relative overflow-hidden bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-900 rounded-3xl p-8 text-white shadow-xl">
                <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="relative z-10 space-y-2">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                    {t("catalog_view")}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                    {selectedCategoryObj ? selectedCategoryObj.name : t("all_organic_products")}
                  </h1>
                  <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
                    {selectedCategoryObj?.description || t("browse_complete_range")}
                  </p>
                </div>
              </div>

              {/* Filter Controls & Products Count Bar */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs font-medium text-slate-600">
                  {t("showing")} <span className="font-extrabold text-slate-900">{filteredProducts.length}</span> {t("organic_products_count")}
                </div>

                <div className="flex items-center gap-3">
                  <select
                    className="py-2 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="Featured">{t("sort_featured")}</option>
                    <option value="Low to High">{t("price_low_high")}</option>
                    <option value="High to Low">{t("price_high_low")}</option>
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm text-center space-y-6">
                  <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-3xl text-amber-600 border border-amber-200/60 shadow-sm">
                    🛠️
                  </div>
                  
                  <div className="space-y-2 max-w-xl mx-auto">
                    <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">
                      Products are being updated in Admin side. kindly contact Owner
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      We are currently populating products for <span className="font-bold text-emerald-700">{selectedCategoryObj?.name || "this category"}</span>. For instant queries or bulk availability, please contact the store owner directly.
                    </p>
                  </div>

                  <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/70 text-xs sm:text-sm">
                    <a href="https://wa.me/917550210447" target="_blank" rel="noopener noreferrer" className="font-bold text-white hover:opacity-90 flex items-center gap-2 bg-[#25D366] px-4 py-2 rounded-xl shadow-sm transition-all active:scale-95">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="18" height="18" fill="white">
                        <path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.737 5.469 2.027 7.77L0 32l8.479-2.001A15.93 15.93 0 0 0 16 32c8.836 0 16-7.163 16-16S24.836 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.784-1.856l-.486-.29-5.033 1.187 1.21-4.908-.317-.502A13.247 13.247 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.258-9.907c-.398-.2-2.355-1.162-2.72-1.294-.365-.133-.63-.2-.895.2-.265.398-1.027 1.294-1.26 1.56-.232.265-.464.299-.862.1-.398-.2-1.681-.62-3.202-1.977-1.183-1.056-1.982-2.36-2.214-2.758-.232-.398-.025-.613.175-.812.18-.179.398-.464.597-.696.2-.232.265-.398.398-.663.133-.265.066-.497-.033-.696-.1-.2-.895-2.16-1.227-2.958-.323-.776-.65-.671-.895-.683l-.763-.013c-.265 0-.696.1-1.06.497-.365.398-1.393 1.361-1.393 3.32 0 1.958 1.426 3.851 1.626 4.116.2.265 2.807 4.285 6.802 6.01.951.41 1.693.655 2.271.839.954.304 1.822.261 2.509.158.765-.114 2.355-.963 2.686-1.893.332-.93.332-1.727.232-1.893-.099-.166-.364-.265-.762-.464z"/>
                      </svg>
                      +91 7550210447
                    </a>
                    <a href="mailto:vinnavarbrand@gmail.com" className="font-semibold text-slate-700 hover:text-emerald-700 flex items-center gap-1.5 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs">
                      ✉️ vinnavarbrand@gmail.com
                    </a>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const footerEl = document.getElementById("footer") || document.querySelector("footer");
                        if (footerEl) {
                          footerEl.scrollIntoView({ behavior: "smooth" });
                        } else {
                          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                        }
                      }}
                      className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-full shadow-md shadow-emerald-700/20 transition-all active:scale-95 flex items-center gap-2"
                    >
                      <span>👇</span> View Owner & Store Details in Footer
                    </button>

                    <button
                      type="button"
                      className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-full transition-all active:scale-95"
                      onClick={() => { setSelectedCategoryId(null); setSearchTerm(""); }}
                    >
                      View All Categories
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => {
                    const currentVariant = selectedVariants[product.id] || product.variants?.[0];
                    const imgUrl = getImageUrl(product.imageUrl);

                    return (
                      <div
                        key={product.id}
                        className="group relative bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                      >
                        <div className="space-y-4">
                          {/* Image Container & Badges */}
                          <div className="relative bg-slate-50 rounded-2xl p-4 h-48 flex items-center justify-center overflow-hidden">
                            {product.featured && (
                              <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white uppercase tracking-wider shadow-sm">
                                {t("featured_badge")}
                              </span>
                            )}
                            <button
                              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-slate-200/60 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-white transition-all"
                              title="Add to Wishlist"
                              onClick={() => handleToggleWishlist(product)}
                            >

                              ❤️
                            </button>

                            <Link to={`/product/${product.slug}`} className="w-full h-full flex items-center justify-center">
                              <img
                                src={imgUrl}
                                alt={product.name}
                                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/media/placeholder.png";
                                }}
                              />
                            </Link>
                          </div>

                          {/* Details */}
                          <div>
                            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide">
                              {product.category?.name || "Organic Staples"}
                            </span>
                            <h3 className="font-bold text-slate-900 text-sm mt-1 truncate hover:text-emerald-700 transition-colors">
                              <Link to={`/product/${product.slug}`}>
                                {product.name}
                              </Link>
                            </h3>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                              {product.shortDescription}
                            </p>
                          </div>

                          {/* Variant Selector (Weight Badges) */}
                          {product.variants && product.variants.length > 0 && (
                            <div className="space-y-1 mt-2">
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                {t("weight")}
                              </label>
                              <div className="flex flex-wrap gap-1.5 pt-0.5">
                                {product.variants.map((v) => {
                                  const isSelected = currentVariant?.id === v.id;
                                  return (
                                    <button
                                      key={v.id}
                                      type="button"
                                      onClick={() => handleVariantChange(product.id, v.id)}
                                      className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all border d-inline-flex align-items-center gap-1 cursor-pointer ${
                                        isSelected
                                          ? "bg-emerald-700 text-white border-emerald-700 shadow-sm scale-105"
                                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300"
                                      }`}
                                    >
                                      <span>{v.variantName}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Price & Add Button */}
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                          <div>
                            <span className="text-base font-black text-slate-900">
                              ₹{currentVariant?.discountPrice || currentVariant?.price || 0}
                            </span>
                            {currentVariant?.discountPrice && (
                              <span className="text-xs text-slate-400 line-through ml-1.5 font-medium">
                                ₹{currentVariant?.price}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-full shadow-md shadow-emerald-700/20 transition-all active:scale-95"
                            onClick={() => handleAddToCart(product)}
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default Product;
