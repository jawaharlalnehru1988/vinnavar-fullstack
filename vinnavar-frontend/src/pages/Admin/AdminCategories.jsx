import React, { useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL, getImageUrl } from "../../services/api";

const AdminCategories = ({ categories, products, loadData }) => {
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [categoryForm, setCategoryForm] = useState({
        name: "",
        description: "",
        imageUrl: "",
        nameTranslations: { ta: "", hi: "", te: "", kn: "", ml: "", mr: "", bn: "", pa: "" },
        descriptionTranslations: { ta: "", hi: "", te: "", kn: "", ml: "", mr: "", bn: "", pa: "" }
    });
    const [categoryViewMode, setCategoryViewMode] = useState("list");
    const [categoryCurrentPage, setCategoryCurrentPage] = useState(1);

    const handleQuickCategoryImageUpload = async (catId, file) => {
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`${API_BASE_URL}/admin/products/upload-image`, {
                method: "POST",
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                const cat = categories.find((c) => c.id === catId);
                if (cat) {
                    await fetch(`${API_BASE_URL}/admin/categories/${catId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            name: cat.name,
                            description: cat.description,
                            imageUrl: data.imageUrl
                        })
                    });
                    Swal.fire({ icon: "success", title: "Category Image Updated", timer: 1200, showConfirmButton: false });
                    loadData();
                }
            }
        } catch (err) {
            Swal.fire("Error", "Failed to upload category image", "error");
        }
    };

    const handleCategoryImageUploadInModal = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`${API_BASE_URL}/admin/products/upload-image`, {
                method: "POST",
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setCategoryForm((prev) => ({ ...prev, imageUrl: data.imageUrl }));
                Swal.fire({ icon: "success", title: "Image Uploaded", timer: 1200, showConfirmButton: false });
            }
        } catch (err) {
            Swal.fire("Error", "Image upload failed", "error");
        }
    };

    const handleSaveCategory = async (e) => {
        e.preventDefault();
        const url = editingCategoryId
            ? `${API_BASE_URL}/admin/categories/${editingCategoryId}`
            : `${API_BASE_URL}/admin/categories`;
        const method = editingCategoryId ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(categoryForm)
            });
            if (res.ok) {
                Swal.fire({ icon: "success", title: editingCategoryId ? "Category Updated" : "Category Created", timer: 1500, showConfirmButton: false });
                setShowCategoryModal(false);
                setEditingCategoryId(null);
                setCategoryForm({
                    name: "",
                    description: "",
                    imageUrl: "",
                    nameTranslations: { ta: "", hi: "", te: "", kn: "", ml: "", mr: "", bn: "", pa: "" },
                    descriptionTranslations: { ta: "", hi: "", te: "", kn: "", ml: "", mr: "", bn: "", pa: "" }
                });
                loadData();
            }
        } catch (err) {
            Swal.fire("Error", "Failed to save category", "error");
        }
    };

    const handleEditCategory = (cat) => {
        setEditingCategoryId(cat.id);
        setCategoryForm({
            name: cat.name || "",
            description: cat.description || "",
            imageUrl: cat.imageUrl || "",
            nameTranslations: cat.nameTranslations || { ta: "", hi: "", te: "", kn: "", ml: "", mr: "", bn: "", pa: "" },
            descriptionTranslations: cat.descriptionTranslations || { ta: "", hi: "", te: "", kn: "", ml: "", mr: "", bn: "", pa: "" }
        });
        setShowCategoryModal(true);
    };

    const handleDeleteCategory = async (id) => {
        const result = await Swal.fire({
            title: "Delete Category?",
            text: "Are you sure you want to delete this category?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete"
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`${API_BASE_URL}/admin/categories/${id}`, { method: "DELETE" });
                if (res.ok) {
                    Swal.fire("Deleted!", "Category has been removed.", "success");
                    loadData();
                }
            } catch (err) {
                Swal.fire("Error", "Failed to delete category.", "error");
            }
        }
    };

    const categoriesPerPage = 9;
    const totalCatPages = Math.ceil(categories.length / categoriesPerPage) || 1;
    const safeCurrentPage = Math.min(categoryCurrentPage, totalCatPages);
    const indexOfLastCat = safeCurrentPage * categoriesPerPage;
    const indexOfFirstCat = indexOfLastCat - categoriesPerPage;
    const currentCategories = categories.slice(indexOfFirstCat, indexOfLastCat);

    return (
        <div className="space-y-6">
            {/* Header bar with Count, View Toggle, and Add button */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <span>🗂️</span> Category Management
                    </h2>
                    <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-xs font-bold px-3 py-1 rounded-full font-mono">
                        Total: {categories.length}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {/* View Toggle */}
                    <div className="bg-slate-200/80 p-1 rounded-xl flex items-center gap-1 shadow-inner">
                        <button
                            type="button"
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                                categoryViewMode === "list"
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-600 hover:text-slate-900"
                            }`}
                            onClick={() => setCategoryViewMode("list")}
                        >
                            📋 List View
                        </button>
                        <button
                            type="button"
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                                categoryViewMode === "card"
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-600 hover:text-slate-900"
                            }`}
                            onClick={() => setCategoryViewMode("card")}
                        >
                            🎴 Card View
                        </button>
                    </div>

                    <button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-2 rounded-xl shadow-sm transition-all duration-150 flex items-center gap-1.5"
                        onClick={() => {
                            setEditingCategoryId(null);
                            setCategoryForm({ name: "", description: "", imageUrl: "" });
                            setShowCategoryModal(true);
                        }}
                    >
                        <span>+</span> Add New Category
                    </button>
                </div>
            </div>

            {/* LIST VIEW */}
            {categoryViewMode === "list" ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs font-bold font-mono uppercase tracking-wider">
                                    <th className="py-3.5 px-4 w-12 text-center">#</th>
                                    <th className="py-3.5 px-4 w-20">Image</th>
                                    <th className="py-3.5 px-4">Category Name</th>
                                    <th className="py-3.5 px-4">Description</th>
                                    <th className="py-3.5 px-4 text-center">Products</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {currentCategories.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-8 text-center text-slate-500 font-medium">
                                            No organic categories found.
                                        </td>
                                    </tr>
                                ) : (
                                    currentCategories.map((c, idx) => {
                                        const catImgUrl = c.imageUrl ? getImageUrl(c.imageUrl) : null;
                                        const productCount = products.filter(
                                            (p) => p.categoryId === c.id || (p.category && p.category.id === c.id)
                                        ).length;
                                        return (
                                            <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="py-3 px-4 text-center font-mono font-bold text-slate-400">
                                                    {indexOfFirstCat + idx + 1}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {catImgUrl ? (
                                                        <img
                                                            src={catImgUrl}
                                                            alt={c.name}
                                                            className="w-12 h-12 object-cover rounded-xl border border-slate-200 shadow-sm"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = "/media/placeholder.png";
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-lg text-slate-400">
                                                            📁
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 font-bold text-emerald-800">{c.name}</td>
                                                <td className="py-3 px-4 text-slate-500 max-w-xs truncate text-xs">
                                                    {c.description || "No description provided."}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                                        📦 {productCount} items
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 cursor-pointer transition-all">
                                                            🖼️ Image
                                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleQuickCategoryImageUpload(c.id, e.target.files[0])} />
                                                        </label>
                                                        <button
                                                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-300 transition-all shadow-sm"
                                                            onClick={() => handleEditCategory(c)}
                                                        >
                                                            ✏️ Edit
                                                        </button>
                                                        <button
                                                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-rose-200 transition-all shadow-sm"
                                                            onClick={() => handleDeleteCategory(c.id)}
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* CARD VIEW */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {currentCategories.map((c) => {
                        const catImgUrl = c.imageUrl ? getImageUrl(c.imageUrl) : null;
                        const productCount = products.filter(
                            (p) => p.categoryId === c.id || (p.category && p.category.id === c.id)
                        ).length;

                        return (
                            <div key={c.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
                                <div className="p-4 bg-slate-50 border-b border-slate-100 h-36 flex items-center justify-center overflow-hidden relative">
                                    {catImgUrl ? (
                                        <img src={catImgUrl} alt={c.name} className="max-h-28 max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
                                    ) : (
                                        <div className="text-4xl opacity-40">📁</div>
                                    )}
                                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs border border-slate-200">
                                        📦 {productCount} items
                                    </span>
                                </div>
                                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                    <div>
                                        <h3 className="font-extrabold text-slate-900 text-base mb-1 group-hover:text-emerald-700 transition-colors">{c.name}</h3>
                                        <p className="text-slate-500 text-xs line-clamp-2">{c.description || "No description provided."}</p>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                        <label className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 cursor-pointer">
                                            🖼️ Change Image
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleQuickCategoryImageUpload(c.id, e.target.files[0])} />
                                        </label>
                                        <div className="flex items-center gap-1.5">
                                            <button className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-300" onClick={() => handleEditCategory(c)}>✏️ Edit</button>
                                            <button className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-rose-200" onClick={() => handleDeleteCategory(c.id)}>🗑️</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* PAGINATION CONTROLS */}
            {totalCatPages > 1 && (
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
                    <div className="text-xs font-medium text-slate-500">
                        Showing <span className="font-bold text-slate-800">{indexOfFirstCat + 1}</span> to <span className="font-bold text-slate-800">{Math.min(indexOfLastCat, categories.length)}</span> of <span className="font-bold text-slate-800">{categories.length}</span> categories
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button
                            className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40"
                            onClick={() => setCategoryCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={safeCurrentPage === 1}
                        >
                            &laquo; Previous
                        </button>
                        {Array.from({ length: totalCatPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${
                                    safeCurrentPage === page
                                        ? "bg-emerald-600 text-white shadow-sm"
                                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                                }`}
                                onClick={() => setCategoryCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40"
                            onClick={() => setCategoryCurrentPage((prev) => Math.min(prev + 1, totalCatPages))}
                            disabled={safeCurrentPage === totalCatPages}
                        >
                            Next &raquo;
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL: ADD / EDIT CATEGORY */}
            {showCategoryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="bg-emerald-700 text-white px-6 py-4 flex items-center justify-between shrink-0">
                            <h3 className="text-base font-extrabold flex items-center gap-2">
                                <span>🗂️</span> {editingCategoryId ? "Edit Organic Category" : "Add Organic Category"}
                            </h3>
                            <button
                                type="button"
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white font-bold transition-all"
                                onClick={() => { setShowCategoryModal(false); setEditingCategoryId(null); }}
                            >
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSaveCategory} className="p-6 space-y-4 overflow-y-auto">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Category Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                                    value={categoryForm.name}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Description</label>
                                <textarea
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                                    rows="3"
                                    value={categoryForm.description}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Upload Category Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-2"
                                    onChange={handleCategoryImageUploadInModal}
                                />
                                {categoryForm.imageUrl && <p className="text-xs text-emerald-600 font-bold mt-1.5 truncate">Selected: {categoryForm.imageUrl}</p>}
                            </div>

                            {/* Multilingual Category Names & Descriptions */}
                            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-3">
                                <span className="block text-xs font-bold text-amber-900">🌐 Category Multilingual Translations (Optional)</span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                                    {[
                                        { code: "ta", label: "Tamil (தமிழ்)" },
                                        { code: "hi", label: "Hindi (हिंदी)" },
                                        { code: "te", label: "Telugu (తెలుగు)" },
                                        { code: "kn", label: "Kannada (ಕನ್ನಡ)" },
                                        { code: "ml", label: "Malayalam (മലയാളം)" },
                                        { code: "mr", label: "Marathi (मराठी)" },
                                        { code: "bn", label: "Bengali (বাংলা)" },
                                        { code: "pa", label: "Punjabi (ਪੰਜਾਬੀ)" }
                                    ].map((lang) => (
                                        <div key={lang.code} className="p-2.5 bg-white rounded-xl border border-amber-200 space-y-1.5">
                                            <span className="block text-xs font-bold text-amber-900">{lang.label}</span>
                                            <input
                                                type="text"
                                                placeholder="Category Name"
                                                className="w-full px-2.5 py-1.5 bg-amber-50/30 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                                                value={categoryForm.nameTranslations?.[lang.code] || ""}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setCategoryForm((prev) => ({
                                                        ...prev,
                                                        nameTranslations: { ...(prev.nameTranslations || {}), [lang.code]: val }
                                                    }));
                                                }}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Description"
                                                className="w-full px-2.5 py-1.5 bg-amber-50/30 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                                                value={categoryForm.descriptionTranslations?.[lang.code] || ""}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setCategoryForm((prev) => ({
                                                        ...prev,
                                                        descriptionTranslations: { ...(prev.descriptionTranslations || {}), [lang.code]: val }
                                                    }));
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl"
                                    onClick={() => { setShowCategoryModal(false); setEditingCategoryId(null); }}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm">
                                    Save Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
