import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { API_BASE_URL, fetchProducts, getImageUrl, toggleWishlist, getCartId } from "../services/api";
import { useTranslation } from "react-i18next";

import { ProductSkeleton } from "./Skeleton";

const OrganicProductList = ({ categoryId, limit = 8 }) => {
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
                    <ProductSkeleton count={limit || 4} />
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

                {/* Product Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {(limit ? products.slice(0, limit) : products).map((product) => {
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
                                                Featured
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
                                            {product.category?.nameTranslations?.[currentLang] || product.category?.name || "Organic Staples"}
                                        </span>
                                        <h3 className="font-bold text-slate-900 text-sm mt-1 truncate hover:text-emerald-700 transition-colors">
                                            <Link to={`/product/${product.slug}`}>
                                                {product.nameTranslations?.[currentLang] || product.name}
                                            </Link>
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                            {product.descriptionTranslations?.[currentLang] || product.shortDescription}
                                        </p>
                                    </div>

                                    {/* Variant selector (Weight Badges) */}
                                    {product.variants && product.variants.length > 0 && (
                                        <div className="space-y-1 mt-2">
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                WEIGHT:
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
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-base font-black text-slate-900">
                                                ₹{currentVariant?.discountPrice || currentVariant?.price || 0}
                                            </span>
                                            {currentVariant?.discountPrice && (
                                                <span className="text-xs text-slate-400 line-through font-medium">
                                                    ₹{currentVariant?.price}
                                                </span>
                                            )}
                                        </div>
                                        {currentVariant?.discountPrice && currentVariant.price > currentVariant.discountPrice && (
                                            <div className="mt-0.5">
                                                <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded inline-flex items-center">
                                                    <i className="fa fa-arrow-down mr-1 text-[8px]"></i>
                                                    {Math.round(((currentVariant.price - currentVariant.discountPrice) / currentVariant.price) * 100)}% OFF
                                                </span>
                                            </div>
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
            </div>
        </section>
    );
};

export default OrganicProductList;
