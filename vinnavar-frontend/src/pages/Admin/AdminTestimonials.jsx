import React, { useState, useEffect } from "react";
import { fetchAdminTestimonials, createAdminTestimonial, updateAdminTestimonial, deleteAdminTestimonial } from "../../services/api";
import Swal from "sweetalert2";

const AdminTestimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal state for Add/Edit
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("ADD"); // "ADD" | "EDIT"
    const [selectedTestimonial, setSelectedTestimonial] = useState(null);

    // Form inputs
    const [formData, setFormData] = useState({
        customerName: "",
        customerLocation: "",
        rating: 5,
        reviewText: "",
        productName: "",
        active: true
    });
    const [submitting, setSubmitting] = useState(false);

    const loadTestimonials = async () => {
        setLoading(true);
        try {
            const data = await fetchAdminTestimonials();
            setTestimonials(data);
        } catch (err) {
            console.error("Failed to fetch testimonials", err);
            Swal.fire("Error", "Failed to load testimonials list.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTestimonials();
    }, []);

    const handleOpenAddModal = () => {
        setModalMode("ADD");
        setSelectedTestimonial(null);
        setFormData({
            customerName: "",
            customerLocation: "",
            rating: 5,
            reviewText: "",
            productName: "",
            active: true
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item) => {
        setModalMode("EDIT");
        setSelectedTestimonial(item);
        setFormData({
            customerName: item.customerName || "",
            customerLocation: item.customerLocation || "",
            rating: item.rating || 5,
            reviewText: item.reviewText || "",
            productName: item.productName || "",
            active: item.active !== false
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (modalMode === "ADD") {
                await createAdminTestimonial(formData);
                Swal.fire({
                    icon: "success",
                    title: "Testimonial Created! 🎉",
                    text: `Testimonial from ${formData.customerName} added successfully.`,
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                await updateAdminTestimonial(selectedTestimonial.id, formData);
                Swal.fire({
                    icon: "success",
                    title: "Testimonial Updated! ✏️",
                    text: `Testimonial updated successfully.`,
                    timer: 2000,
                    showConfirmButton: false
                });
            }
            handleCloseModal();
            loadTestimonials();
        } catch (err) {
            Swal.fire("Error", err.message || "Failed to save testimonial.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleActive = async (item) => {
        try {
            await updateAdminTestimonial(item.id, { ...item, active: !item.active });
            loadTestimonials();
        } catch (err) {
            Swal.fire("Error", "Failed to update status.", "error");
        }
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: `Delete Review by ${item.customerName}?`,
            text: "This testimonial will be permanently deleted from the database.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e11d48",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Yes, Delete"
        });

        if (result.isConfirmed) {
            try {
                await deleteAdminTestimonial(item.id);
                Swal.fire("Deleted!", "Testimonial has been removed.", "success");
                loadTestimonials();
            } catch (err) {
                Swal.fire("Error", err.message || "Failed to delete testimonial.", "error");
            }
        }
    };

    const filteredTestimonials = testimonials.filter((item) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        const name = (item.customerName || "").toLowerCase();
        const location = (item.customerLocation || "").toLowerCase();
        const text = (item.reviewText || "").toLowerCase();
        const product = (item.productName || "").toLowerCase();
        return name.includes(query) || location.includes(query) || text.includes(query) || product.includes(query);
    });

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <span>💬</span> Customer Testimonials
                        <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-xs font-bold px-3 py-1 rounded-full font-mono">
                            {testimonials.length} Total
                        </span>
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Manage customer reviews & testimonials displayed in the moving carousel on the Home page
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                        onClick={handleOpenAddModal}
                    >
                        <span>➕</span> Add Testimonial
                    </button>
                    <button
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 transition-all flex items-center gap-1.5"
                        onClick={loadTestimonials}
                    >
                        <span>🔄</span> Refresh
                    </button>
                </div>
            </div>

            {/* Search Filter */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
                <div className="relative w-full max-w-md">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs text-slate-400">🔍</span>
                    <input
                        type="text"
                        className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
                        placeholder="Search testimonials by Name, Location, Product, or Review..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 font-bold"
                            onClick={() => setSearchQuery("")}
                        >
                            ✕
                        </button>
                    )}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                    Showing <strong className="text-slate-800">{filteredTestimonials.length}</strong> of <strong className="text-slate-800">{testimonials.length}</strong> testimonials
                </div>
            </div>

            {/* Testimonials Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs font-bold font-mono uppercase tracking-wider whitespace-nowrap">
                                <th className="py-3.5 px-4">Customer</th>
                                <th className="py-3.5 px-4">Rating & Product</th>
                                <th className="py-3.5 px-4 w-[35%]">Review Content</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center">
                                        <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-xs text-slate-500 font-bold mt-2">Fetching testimonials...</p>
                                    </td>
                                </tr>
                            ) : filteredTestimonials.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-slate-500 font-medium">
                                        <div className="text-4xl mb-2 opacity-40">💬</div>
                                        <div className="font-bold text-slate-800">No testimonials found</div>
                                        <div className="text-xs text-slate-400 mt-1">
                                            {searchQuery ? "Try refining your search query." : "Click 'Add Testimonial' to create one."}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredTestimonials.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="font-bold text-slate-900">{item.customerName}</div>
                                            <div className="text-xs text-slate-400">📍 {item.customerLocation || "India"}</div>
                                        </td>
                                        <td className="py-3 px-4 whitespace-nowrap">
                                            <div className="text-amber-400 font-bold text-sm tracking-widest">
                                                {"★".repeat(item.rating || 5)}
                                            </div>
                                            {item.productName && (
                                                <span className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md mt-1">
                                                    🌾 {item.productName}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-xs text-slate-600 italic">
                                            "{item.reviewText}"
                                        </td>
                                        <td className="py-3 px-4 whitespace-nowrap">
                                            <button
                                                className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                                                    item.active !== false
                                                        ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 hover:bg-emerald-500/20"
                                                        : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                                                }`}
                                                onClick={() => handleToggleActive(item)}
                                            >
                                                {item.active !== false ? "✓ Active" : "Hidden"}
                                            </button>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-300 transition-all shadow-xs"
                                                    onClick={() => handleOpenEditModal(item)}
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-rose-200 transition-all shadow-xs"
                                                    onClick={() => handleDelete(item)}
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Add / Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden">
                        <div className="bg-emerald-700 text-white px-6 py-4 flex items-center justify-between">
                            <h3 className="text-base font-extrabold flex items-center gap-2">
                                <span>💬</span> {modalMode === "ADD" ? "Add New Testimonial" : `Edit Testimonial (#${selectedTestimonial?.id})`}
                            </h3>
                            <button
                                type="button"
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white font-bold transition-all"
                                onClick={handleCloseModal}
                            >
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSubmitForm} className="p-6 space-y-4 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Customer Name *</label>
                                    <input
                                        type="text"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                                        placeholder="e.g. Kavitha R."
                                        value={formData.customerName}
                                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Location (City, State)</label>
                                    <input
                                        type="text"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                                        placeholder="e.g. Chennai, Tamil Nadu"
                                        value={formData.customerLocation}
                                        onChange={(e) => setFormData({ ...formData, customerLocation: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Product Purchased</label>
                                    <input
                                        type="text"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                                        placeholder="e.g. Traditional Poongar Rice"
                                        value={formData.productName}
                                        onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Rating (1 to 5 Stars) *</label>
                                    <select
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                                        value={formData.rating}
                                        onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                                    >
                                        <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                                        <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                                        <option value={3}>⭐⭐⭐ (3 Stars)</option>
                                        <option value={2}>⭐⭐ (2 Stars)</option>
                                        <option value={1}>⭐ (1 Star)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Review Text *</label>
                                <textarea
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                                    rows="3"
                                    placeholder="Enter customer review text..."
                                    value={formData.reviewText}
                                    onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                                    required
                                />
                            </div>

                            <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                                    checked={formData.active}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                />
                                <span className="font-bold text-slate-800 text-xs">
                                    Publish Testimonial to Home Page Carousel
                                </span>
                            </label>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl"
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs disabled:opacity-50"
                                    disabled={submitting}
                                >
                                    {submitting ? "Saving..." : modalMode === "ADD" ? "Create Testimonial" : "Update Testimonial"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTestimonials;
