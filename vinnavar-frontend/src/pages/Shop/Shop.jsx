import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ScrollToTop from "../ScrollToTop";
import { API_BASE_URL, fetchCategories, fetchProducts, getImageUrl, toggleWishlist } from "../../services/api";

const assortment = getImageUrl("/media/site/assortment-citrus-fruits.png");

const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Featured");
  const [loading, setLoading] = useState(true);

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
          const defaultVar = prod.variants?.find((v) => v.default) || prod.variants?.[0];
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

  // Filter categories to only include categories that have at least 1 product
  const activeCategories = categories.filter((cat) =>
    products.some((p) => p.category?.id === cat.id)
  );

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
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500 font-medium">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <span>Loading Organic Product Catalog...</span>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center text-xs sm:text-sm font-medium text-slate-500 space-x-2">
            <Link to="/" className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Shop Catalog</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Column: Categories & Search */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Categories Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-extrabold text-slate-900 text-base uppercase tracking-wider">
                    Categories
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
                    🌱 All Categories
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
                  Search Catalog
                </h3>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                  <input
                    type="text"
                    className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400"
                    placeholder="Search organic products..."
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
                    Farm Fresh Guaranteed
                  </span>
                  <h4 className="text-xl font-black">100% Pure Organic</h4>
                  <p className="text-xs text-slate-200">Certified Grains &amp; Cold-Pressed Oils</p>
                  <div>
                    <button
                      type="button"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
                      onClick={() => { setSelectedCategoryId(null); setSearchTerm(""); }}
                    >
                      Shop All Items
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
                    Catalog View
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                    {selectedCategoryObj ? selectedCategoryObj.name : "All Organic Products"}
                  </h1>
                  <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
                    {selectedCategoryObj?.description || "Browse our complete range of certified organic grains, cold-pressed oils, and healthy natural staples."}
                  </p>
                </div>
              </div>

              {/* Filter Controls & Products Count Bar */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs font-medium text-slate-600">
                  Showing <span className="font-extrabold text-slate-900">{filteredProducts.length}</span> organic products
                </div>

                <div className="flex items-center gap-3">
                  <select
                    className="py-2 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="Featured">Sort by: Featured</option>
                    <option value="Low to High">Price: Low to High</option>
                    <option value="High to Low">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-sm text-center space-y-4">
                  <div className="text-4xl">🌿</div>
                  <h3 className="font-bold text-slate-900 text-base">No organic products found</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    No matching items found for your search. Try clearing filters or select another category.
                  </p>
                  <button
                    className="px-6 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200 transition-all active:scale-95"
                    onClick={() => { setSelectedCategoryId(null); setSearchTerm(""); }}
                  >
                    Reset All Filters
                  </button>
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
                              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white uppercase tracking-wider shadow-sm">
                                Featured
                              </span>
                            )}
                            <button
                              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-slate-200/60 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-white transition-all"
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

                          {/* Variant Selector */}
                          {product.variants && product.variants.length > 0 && (
                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Size / Volume:
                              </label>
                              <select
                                className="w-full py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
                                value={currentVariant?.id || ""}
                                onChange={(e) => handleVariantChange(product.id, e.target.value)}
                              >
                                {product.variants.map((v) => (
                                  <option key={v.id} value={v.id}>
                                    {v.variantName} - ₹{v.discountPrice || v.price}
                                  </option>
                                ))}
                              </select>
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

export default Shop;
