import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { API_BASE_URL, fetchProducts, getImageUrl, toggleWishlist, getCartId } from "../services/api";
import { useTranslation } from "react-i18next";

import { calculateUSP } from "../utils/usp";

const OrganicProductList = ({ categoryId, limit = 10 }) => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language || 'en';
    const [products, setProducts] = useState([]);
    const [selectedVariants, setSelectedVariants] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const params = categoryId ? { categoryId } : {};
                const data = await fetchProducts(params);
                setProducts(data);

                // Default variants setup (5kg default)
                const defaults = {};
                data.forEach((prod) => {
                    const default5kg = prod.variants?.find((v) => v.variantName?.toLowerCase().replace(/\s+/g, "") === "5kg");
                    const defaultVar = default5kg || prod.variants?.find((v) => v.default || v.isDefault) || prod.variants?.[0];
                    if (defaultVar) {
                        defaults[prod.id] = defaultVar;
                    }
                });
                setSelectedVariants(defaults);
            } catch (err) {
                console.error("Error loading products", err);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, [categoryId]);

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

        const cartId = getCartId();


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
                    title: "Added to Organic Cart",
                    text: `${product.name} (${variant.variantName}) added to cart!`,
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Cart Error",
                text: "Failed to add product to cart."
            });
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

    if (loading) {
        return (
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <div className="w-48 h-8 bg-slate-200/80 rounded-full animate-pulse mb-2"></div>
                        <div className="w-72 h-4 bg-slate-200/80 rounded-full animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        {Array.from({ length: limit || 10 }).map((_, idx) => (
                            <div key={idx} className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm animate-pulse h-[530px] flex flex-col justify-between">
                                <div className="space-y-4">
                                    <div className="w-full h-64 sm:h-72 bg-slate-100 rounded-2xl"></div>
                                    <div className="w-28 h-3 bg-slate-200 rounded-full"></div>
                                    <div className="w-3/4 h-5 bg-slate-200 rounded-full"></div>
                                    <div className="w-full h-3.5 bg-slate-200/60 rounded-full"></div>
                                </div>
                                <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                                    <div className="w-32 h-7 bg-slate-200 rounded-full"></div>
                                    <div className="w-24 h-10 bg-emerald-100 rounded-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Title Bar */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-4 border-b border-slate-100">
                    <div>
                        <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/50">
                            {t("cert_organic")}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
                            {t("pure_organic_staples")}
                        </h2>
                    </div>
                    <div>
                        <Link
                            to="/Product"
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all shadow-xs active:scale-95"
                        >
                            <span>{t("view_all_products")}</span>
                            <span>➔</span>
                        </Link>
                    </div>
                </div>

                {/* Product Cards Grid: 2 Columns & 5 Rows (Big Size Showcase) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {(limit ? products.slice(0, limit) : products).map((product) => {
                        const currentVariant = selectedVariants[product.id] || product.variants?.[0];
                        const imgUrl = getImageUrl(product.imageUrl);

                        return (
                            <div
                                key={product.id}
                                className="group relative bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    {/* Image Container & Badges (Enlarged Big-Size View) */}
                                    <div className="relative bg-slate-50/80 rounded-2xl p-6 h-64 sm:h-72 flex items-center justify-center overflow-hidden">
                                        {product.featured && (
                                            <span className="absolute top-3.5 left-3.5 z-10 px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white uppercase tracking-wider shadow-sm">
                                                Featured
                                            </span>
                                        )}
                                        <button
                                            className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-slate-200/70 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-white transition-all cursor-pointer"
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
                                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                                            {product.category?.nameTranslations?.[currentLang] || product.category?.name || "Organic Staples"}
                                        </span>
                                        <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mt-1 truncate hover:text-emerald-700 transition-colors leading-snug">
                                            <Link to={`/product/${product.slug}`}>
                                                {product.nameTranslations?.[currentLang] || product.name}
                                            </Link>
                                        </h3>
                                        <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                            {product.descriptionTranslations?.[currentLang] || product.shortDescription}
                                        </p>
                                    </div>

                                    {/* Variant selector (Weight Badges) */}
                                    {product.variants && product.variants.length > 0 && (
                                        <div className="space-y-1.5 mt-2">
                                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                WEIGHT / VARIANT:
                                            </label>
                                            <div className="flex flex-wrap gap-2 pt-0.5">
                                                {product.variants.map((v) => {
                                                    const isSelected = currentVariant?.id === v.id;
                                                    const vPrice = v.discountPrice || v.price || 0;
                                                    const vUsp = calculateUSP(vPrice, v.variantName);
                                                    return (
                                                        <button
                                                            key={v.id}
                                                            type="button"
                                                            onClick={() => handleVariantChange(product.id, v.id)}
                                                            title={vUsp ? `${v.variantName} ${vUsp}` : v.variantName}
                                                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border d-inline-flex align-items-center gap-1 cursor-pointer ${
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

                                {/* Price & Add Button with Dynamic Unit Selling Price (USP) */}
                                {(() => {
                                    const activePrice = currentVariant?.discountPrice || currentVariant?.price || 0;
                                    const activeUsp = calculateUSP(activePrice, currentVariant?.variantName);
                                    const hasDiscount = currentVariant?.discountPrice && currentVariant.price > currentVariant.discountPrice;

                                    return (
                                        <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100">
                                            <div className="flex flex-col">
                                                <div className="flex items-baseline flex-wrap gap-2">
                                                    <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                                        ₹{activePrice.toLocaleString('en-IN')}
                                                    </span>
                                                    {hasDiscount && (
                                                        <span className="text-xs sm:text-sm text-slate-400 line-through font-medium">
                                                            ₹{currentVariant.price.toLocaleString('en-IN')}
                                                        </span>
                                                    )}
                                                </div>
                                                {/* Unit Selling Price */}
                                                {activeUsp && (
                                                    <div className="text-xs sm:text-sm text-slate-600 font-semibold leading-tight mt-0.5">
                                                        {activeUsp}
                                                    </div>
                                                )}
                                                {hasDiscount && (
                                                    <div className="mt-1">
                                                        <span className="text-[10px] sm:text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md inline-flex items-center">
                                                            <i className="fa fa-arrow-down mr-1 text-[8px]"></i>
                                                            {Math.round(((currentVariant.price - currentVariant.discountPrice) / currentVariant.price) * 100)}% OFF
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-extrabold rounded-full shadow-md shadow-emerald-700/20 hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                                                onClick={() => handleAddToCart(product)}
                                            >
                                                <span>🛒</span>
                                                <span>+ Add</span>
                                            </button>
                                        </div>
                                    );
                                })()}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default OrganicProductList;
