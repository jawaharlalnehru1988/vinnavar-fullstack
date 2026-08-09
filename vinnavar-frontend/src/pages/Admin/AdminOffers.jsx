import React, { useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL, getImageUrl } from "../../services/api";

const AdminOffers = ({ products, loadData }) => {
    const [offerViewMode, setOfferViewMode] = useState("card");
    const [offerFilter, setOfferFilter] = useState("on_offer");
    const [offerSearch, setOfferSearch] = useState("");
    const [offerCurrentPage, setOfferCurrentPage] = useState(1);

    const handleQuickDiscountUpdate = async (product) => {
        const defaultVar = product.variants?.[0] || {};
        const currentDiscount = defaultVar.discountPrice || "";
        const currentPrice = defaultVar.price || 0;

        const { value: formValues } = await Swal.fire({
            title: `Set Offer Price for "${product.name}"`,
            html: `
                <div class="text-left mb-3">
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Original Price (₹):</label>
                    <input id="swal-price" type="number" class="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-bold text-sm" value="${currentPrice}" readonly disabled />
                </div>
                <div class="text-left mb-2">
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Discount / Offer Price (₹):</label>
                    <input id="swal-discount" type="number" step="0.01" class="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-emerald-700 font-extrabold text-sm focus:ring-2 focus:ring-emerald-500" placeholder="Enter discount price or leave empty to clear offer" value="${currentDiscount}" />
                    <small class="text-slate-400 text-xs mt-1 block">Must be less than original price ₹${currentPrice}</small>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Save Offer Price",
            confirmButtonColor: "#059669",
            preConfirm: () => {
                const discountInput = document.getElementById("swal-discount").value;
                if (discountInput !== "" && parseFloat(discountInput) >= currentPrice) {
                    Swal.showValidationMessage(`Offer price must be less than regular price (₹${currentPrice})`);
                    return false;
                }
                return discountInput;
            }
        });

        if (formValues !== undefined) {
            const newDiscount = formValues !== "" && parseFloat(formValues) > 0 ? parseFloat(formValues) : null;
            const updatedVariants = (product.variants && product.variants.length > 0)
                ? product.variants.map((v, idx) => idx === 0 ? { ...v, discountPrice: newDiscount } : v)
                : [{ variantName: "Standard", price: currentPrice, discountPrice: newDiscount, isDefault: true }];

            const payload = {
                name: product.name,
                slug: product.slug,
                categoryId: product.category?.id || null,
                shortDescription: product.shortDescription,
                fullDescription: product.fullDescription,
                benefits: product.benefits,
                imageUrl: product.imageUrl,
                imageUrls: product.imageUrls || [],
                videoUrl: product.videoUrl || "",
                featured: product.featured,
                active: product.active,
                variants: updatedVariants
            };

            try {
                const res = await fetch(`${API_BASE_URL}/admin/products/${product.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    Swal.fire({ icon: "success", title: "Offer Price Updated!", timer: 1200, showConfirmButton: false });
                    loadData();
                } else {
                    Swal.fire({ icon: "error", title: "Update Failed", text: "Could not update offer price." });
                }
            } catch (err) {
                Swal.fire({ icon: "error", title: "Server Error", text: "Could not connect to backend server." });
            }
        }
    };

    const allOfferProducts = products.filter((p) => {
        const defaultVar = p.variants?.find((v) => v.default) || p.variants?.[0] || {};
        const hasDiscount = defaultVar.discountPrice && defaultVar.discountPrice < defaultVar.price;
        if (offerFilter === "on_offer") return hasDiscount;
        return true;
    }).filter((p) => {
        if (!offerSearch.trim()) return true;
        return p.name.toLowerCase().includes(offerSearch.toLowerCase()) ||
            (p.category?.name && p.category.name.toLowerCase().includes(offerSearch.toLowerCase()));
    });

    const activeDealsCount = products.filter((p) => {
        const defaultVar = p.variants?.find((v) => v.default) || p.variants?.[0] || {};
        return defaultVar.discountPrice && defaultVar.discountPrice < defaultVar.price;
    }).length;

    const offersPerPage = 9;
    const totalOfferPages = Math.ceil(allOfferProducts.length / offersPerPage) || 1;
    const safeCurrentPage = Math.min(offerCurrentPage, totalOfferPages);
    const indexOfLastOffer = safeCurrentPage * offersPerPage;
    const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
    const currentOfferProducts = allOfferProducts.slice(indexOfFirstOffer, indexOfLastOffer);

    return (
        <div className="space-y-6">
            {/* Header bar with Count, Filter, Search, and View Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <span>🏷️</span> Offers & Discounts
                    </h2>
                    <span className="bg-rose-500/10 text-rose-700 border border-rose-500/20 text-xs font-bold px-3 py-1 rounded-full font-mono">
                        Active Deals: {activeDealsCount}
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Search input */}
                    <input
                        type="text"
                        className="w-48 px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
                        placeholder="Search offer products..."
                        value={offerSearch}
                        onChange={(e) => {
                            setOfferSearch(e.target.value);
                            setOfferCurrentPage(1);
                        }}
                    />

                    {/* Filter dropdown */}
                    <select
                        className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                        value={offerFilter}
                        onChange={(e) => {
                            setOfferFilter(e.target.value);
                            setOfferCurrentPage(1);
                        }}
                    >
                        <option value="on_offer">🔥 On Offer Only</option>
                        <option value="all">📦 All Products</option>
                    </select>

                    {/* View Toggle */}
                    <div className="bg-slate-200/80 p-1 rounded-xl flex items-center gap-1 shadow-inner">
                        <button
                            type="button"
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                                offerViewMode === "card"
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-600 hover:text-slate-900"
                            }`}
                            onClick={() => setOfferViewMode("card")}
                        >
                            🎴 Card View
                        </button>
                        <button
                            type="button"
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                                offerViewMode === "list"
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-600 hover:text-slate-900"
                            }`}
                            onClick={() => setOfferViewMode("list")}
                        >
                            📋 List View
                        </button>
                    </div>
                </div>
            </div>

            {/* CARD VIEW */}
            {offerViewMode === "card" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {currentOfferProducts.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                            <h4 className="text-slate-700 font-bold text-base mb-1">No items found matching filter</h4>
                            <p className="text-slate-400 text-xs">Select 'All Products' to set new discounts.</p>
                        </div>
                    ) : (
                        currentOfferProducts.map((p) => {
                            const defaultVar = p.variants?.find((v) => v.default) || p.variants?.[0] || {};
                            const originalPrice = defaultVar.price || 0;
                            const discountPrice = defaultVar.discountPrice;
                            const hasDiscount = discountPrice && discountPrice < originalPrice;
                            const discountPercent = hasDiscount
                                ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
                                : 0;
                            const prodImg = p.imageUrl ? getImageUrl(p.imageUrl) : null;

                            return (
                                <div key={p.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden relative group">
                                    {hasDiscount && (
                                        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                                            <span className="bg-rose-600 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full shadow-sm">
                                                OFFER
                                            </span>
                                            <span className="bg-amber-400 text-slate-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full shadow-sm">
                                                {discountPercent}% OFF
                                            </span>
                                        </div>
                                    )}

                                    <div className="p-4 bg-slate-50 border-b border-slate-100 h-44 flex items-center justify-center overflow-hidden">
                                        {prodImg ? (
                                            <img
                                                src={prodImg}
                                                alt={p.name}
                                                className="max-h-36 max-w-full object-contain group-hover:scale-105 transition-transform duration-300 rounded-lg"
                                            />
                                        ) : (
                                            <div className="text-4xl opacity-40">📦</div>
                                        )}
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                        <div>
                                            <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider block">
                                                {p.category?.name || "General"}
                                            </span>
                                            <h3 className="font-extrabold text-slate-900 text-base mt-0.5 truncate" title={p.name}>
                                                {p.name}
                                            </h3>
                                            <div className="flex items-baseline gap-2 mt-2">
                                                {hasDiscount ? (
                                                    <>
                                                        <span className="text-xl font-extrabold text-emerald-700">
                                                            ₹{discountPrice}
                                                        </span>
                                                        <span className="text-xs text-slate-400 line-through font-semibold">
                                                            ₹{originalPrice}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-xl font-extrabold text-slate-900">
                                                        ₹{originalPrice}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-slate-100">
                                            <button
                                                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs py-2 rounded-xl border border-emerald-200/80 transition-all flex items-center justify-center gap-1.5"
                                                onClick={() => handleQuickDiscountUpdate(p)}
                                            >
                                                🏷️ {hasDiscount ? "Edit Discount" : "Add Discount"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            ) : (
                /* LIST VIEW */
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs font-bold font-mono uppercase tracking-wider">
                                    <th className="py-3.5 px-4 w-12 text-center">#</th>
                                    <th className="py-3.5 px-4 w-16">Image</th>
                                    <th className="py-3.5 px-4">Product Name</th>
                                    <th className="py-3.5 px-4">Category</th>
                                    <th className="py-3.5 px-4 text-right">Original Price</th>
                                    <th className="py-3.5 px-4 text-right">Offer Price</th>
                                    <th className="py-3.5 px-4 text-center">Savings</th>
                                    <th className="py-3.5 px-4 text-center">Status</th>
                                    <th className="py-3.5 px-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {currentOfferProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="py-8 text-center text-slate-500 font-medium">
                                            No offer products found matching your filter.
                                        </td>
                                    </tr>
                                ) : (
                                    currentOfferProducts.map((p, idx) => {
                                        const defaultVar = p.variants?.find((v) => v.default) || p.variants?.[0] || {};
                                        const originalPrice = defaultVar.price || 0;
                                        const discountPrice = defaultVar.discountPrice;
                                        const hasDiscount = discountPrice && discountPrice < originalPrice;
                                        const discountPercent = hasDiscount
                                            ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
                                            : 0;
                                        const prodImg = p.imageUrl ? getImageUrl(p.imageUrl) : null;

                                        return (
                                            <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="py-3 px-4 text-center font-mono font-bold text-slate-400">
                                                    {indexOfFirstOffer + idx + 1}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {prodImg ? (
                                                        <img
                                                            src={prodImg}
                                                            alt={p.name}
                                                            className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-xs text-slate-400">
                                                            📦
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                                                <td className="py-3 px-4 text-slate-500 text-xs">{p.category?.name || "Uncategorized"}</td>
                                                <td className="py-3 px-4 text-right font-semibold text-slate-400">₹{originalPrice}</td>
                                                <td className="py-3 px-4 text-right font-bold text-emerald-700">
                                                    {hasDiscount ? `₹${discountPrice}` : "-"}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    {hasDiscount ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                                            {discountPercent}% OFF (Save ₹{(originalPrice - discountPrice).toFixed(2)})
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400 text-xs">No Discount</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    {hasDiscount ? (
                                                        <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">OFFER</span>
                                                    ) : (
                                                        <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full">Regular</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <button
                                                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-1.5 rounded-lg border border-emerald-200 transition-all"
                                                        onClick={() => handleQuickDiscountUpdate(p)}
                                                    >
                                                        🏷️ Set Offer
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* PAGINATION CONTROLS */}
            {totalOfferPages > 1 && (
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
                    <div className="text-xs font-medium text-slate-500">
                        Showing <span className="font-bold text-slate-800">{indexOfFirstOffer + 1}</span> to <span className="font-bold text-slate-800">{Math.min(indexOfLastOffer, allOfferProducts.length)}</span> of <span className="font-bold text-slate-800">{allOfferProducts.length}</span> items
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button
                            className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40"
                            onClick={() => setOfferCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={safeCurrentPage === 1}
                        >
                            &laquo; Previous
                        </button>
                        {Array.from({ length: totalOfferPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${
                                    safeCurrentPage === page
                                        ? "bg-emerald-600 text-white shadow-sm"
                                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                                }`}
                                onClick={() => setOfferCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40"
                            onClick={() => setOfferCurrentPage((prev) => Math.min(prev + 1, totalOfferPages))}
                            disabled={safeCurrentPage === totalOfferPages}
                        >
                            Next &raquo;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOffers;
