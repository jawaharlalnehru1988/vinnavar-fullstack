import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { API_BASE_URL, fetchProducts, getImageUrl, toggleWishlist, getCartId } from "../services/api";
import { useTranslation } from "react-i18next";
import { Fade } from "react-awesome-reveal";

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
                        {Array.from({ length: limit || 9 }).map((_, idx) => (
                            <div key={idx} className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm animate-pulse h-[500px] flex flex-col justify-between">
                                <div className="space-y-4">
                                    <div className="w-full h-56 sm:h-64 bg-slate-100 rounded-2xl"></div>
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
        <section className="py-16 home-organic-products-section relative overflow-hidden">
            {/* Subtle floating background ambient lights */}
            <div className="home-ambient-glow-1"></div>
            <div className="home-ambient-glow-2"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header Title Bar */}
                <Fade direction="up" triggerOnce>
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 pb-5 border-b border-emerald-100/80">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase text-emerald-800 bg-emerald-100/70 border border-emerald-300/60 shadow-xs mb-2">
                                <span>🌿</span>
                                <span>{t("cert_organic", "100% CERTIFIED ORGANIC")}</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                                {t("pure_organic_staples", "Pure Organic Staples & Products")}
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                                {t("organic_staples_subtitle", "Directly sourced from trusted regional farmers. Unpolished, preservative-free & nutrient-rich.")}
                            </p>
                        </div>
                        <div>
                            <Link
                                to="/Product"
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-all shadow-xs hover:shadow-md active:scale-95"
                            >
                                <span>{t("view_all_products", "View All Products")}</span>
                                <span className="text-sm font-bold">➔</span>
                            </Link>
                        </div>
                    </div>
                </Fade>

                {/* Product Cards Grid: 3 Columns per row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
                    {(limit ? products.slice(0, limit) : products).map((product) => {
                        const currentVariant = selectedVariants[product.id] || product.variants?.[0];
                        const imgUrl = getImageUrl(product.imageUrl);

                        return (
                            <Fade key={product.id} direction="up" triggerOnce fraction={0.08} className="h-full">
                                <div className="group relative bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full">
                                <div className="space-y-3.5">
                                    {/* Image Container & Badges (Refined 3-Column Size View) */}
                                    <div className="aesthetic-image-stage relative rounded-2xl p-5 h-56 sm:h-64 flex items-center justify-center overflow-hidden">
                                        {product.featured && (
                                            <span className="absolute top-3.5 left-3.5 z-10 px-3 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-emerald-600 to-emerald-500 text-white uppercase tracking-wider shadow-sm">
                                                Featured
                                            </span>
                                        )}
                                        <button
                                            className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-white/95 backdrop-blur-md shadow-sm border border-slate-200/70 flex items-center justify-center text-slate-400 hover:text-red-500 hover:scale-110 transition-all cursor-pointer"
                                            title="Add to Wishlist"
                                            onClick={() => handleToggleWishlist(product)}
                                        >
                                            ❤️
                                        </button>

                                        <Link to={`/product/${product.slug}`} className="w-full h-full flex items-center justify-center">
                                            <img
                                                src={imgUrl}
                                                alt={product.name}
                                                className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "/media/placeholder.png";
                                                }}
                                            />
                                        </Link>
                                    </div>

                                    {/* Details */}
                                    <div>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-emerald-800 bg-emerald-50/90 border border-emerald-200/70 uppercase tracking-wider">
                                            {product.category?.nameTranslations?.[currentLang] || product.category?.name || "Organic Staples"}
                                        </span>
                                        <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mt-1.5 truncate group-hover:text-emerald-700 transition-colors leading-snug">
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
                                            <label className="block text-[11px] font-bold text-slate-400 dark:text-amber-200/90 uppercase tracking-wider">
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
                                                                    ? "bg-gradient-to-r from-emerald-800 to-emerald-700 text-white border-emerald-800 shadow-sm scale-105"
                                                                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 dark:bg-stone-800/90 dark:text-amber-100 dark:border-amber-400/25 dark:hover:bg-stone-700"
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
                                        <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100 dark:border-amber-400/20">
                                            <div className="flex flex-col">
                                                <div className="flex items-baseline flex-wrap gap-2">
                                                    <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-amber-400 tracking-tight">
                                                        ₹{activePrice.toLocaleString('en-IN')}
                                                    </span>
                                                    {hasDiscount && (
                                                        <span className="text-xs sm:text-sm text-slate-400 dark:text-stone-400 line-through font-medium">
                                                            ₹{currentVariant.price.toLocaleString('en-IN')}
                                                        </span>
                                                    )}
                                                </div>
                                                {/* Unit Selling Price */}
                                                {activeUsp && (
                                                    <div className="text-xs sm:text-sm text-slate-600 dark:text-emerald-300 font-semibold leading-tight mt-0.5">
                                                        {activeUsp}
                                                    </div>
                                                )}
                                                {hasDiscount && (
                                                    <div className="mt-1">
                                                        <span className="text-[10px] sm:text-xs font-bold text-red-600 bg-red-50 border border-red-100 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800/60 px-2 py-0.5 rounded-md inline-flex items-center">
                                                            <i className="fa fa-arrow-down mr-1 text-[8px]"></i>
                                                            {Math.round(((currentVariant.price - currentVariant.discountPrice) / currentVariant.price) * 100)}% OFF
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                className="aesthetic-add-btn px-5 sm:px-6 py-2.5 sm:py-3 text-white text-xs sm:text-sm font-extrabold rounded-full flex items-center gap-1.5 cursor-pointer active:scale-95"
                                                onClick={() => handleAddToCart(product)}
                                            >
                                                <span>🛒</span>
                                                <span>+ Add</span>
                                            </button>
                                        </div>
                                    );
                                })()}
                            </div>
                            </Fade>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default OrganicProductList;
