import React, { useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL, getImageUrl } from "../../services/api";

const AdminProducts = ({ products, categories, loadData }) => {
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState(false);

    const [productForm, setProductForm] = useState({
        name: "",
        slug: "",
        hsnCode: "1006",
        categoryId: "",
        shortDescription: "",
        fullDescription: "",
        benefits: "",
        imageUrl: "",
        imageUrls: [],
        videoUrl: "",
        featured: false,
        active: true,
        variants: [
            { variantName: "500g", price: "", discountPrice: "" },
            { variantName: "2kg", price: "", discountPrice: "" },
            { variantName: "5kg", price: "", discountPrice: "" }
        ]
    });

    const resetProductForm = () => {
        setEditingProductId(null);
        setProductForm({
            name: "",
            slug: "",
            hsnCode: "1006",
            categoryId: "",
            shortDescription: "",
            fullDescription: "",
            benefits: "",
            imageUrl: "",
            imageUrls: [],
            videoUrl: "",
            featured: false,
            active: true,
            variants: [
                { variantName: "500g", price: "", discountPrice: "" },
                { variantName: "2kg", price: "", discountPrice: "" },
                { variantName: "5kg", price: "", discountPrice: "" }
            ]
        });
    };

    const handleEditProduct = (prod) => {
        setEditingProductId(prod.id);
        const initialImages = (Array.isArray(prod.imageUrls) && prod.imageUrls.length > 0)
            ? prod.imageUrls
            : (prod.imageUrl ? [prod.imageUrl] : []);

        const rawVariants = Array.isArray(prod.variants) && prod.variants.length > 0
            ? prod.variants.map((v) => ({
                variantName: v.variantName || "",
                price: v.price != null ? v.price.toString() : "",
                discountPrice: v.discountPrice != null ? v.discountPrice.toString() : ""
            }))
            : [];

        const defaultNames = ["500g", "2kg", "5kg"];
        while (rawVariants.length < 3) {
            const existingNames = rawVariants.map((v) => (v.variantName || "").toLowerCase().replace(/\s+/g, ""));
            const unusedDefault = defaultNames.find((d) => !existingNames.includes(d.toLowerCase().replace(/\s+/g, ""))) || defaultNames[rawVariants.length] || "";
            rawVariants.push({
                variantName: unusedDefault,
                price: "",
                discountPrice: ""
            });
        }

        setProductForm({
            name: prod.name || "",
            slug: prod.slug || "",
            hsnCode: prod.hsnCode || "1006",
            categoryId: prod.category?.id || "",
            shortDescription: prod.shortDescription || "",
            fullDescription: prod.fullDescription || "",
            benefits: prod.benefits || "",
            imageUrl: prod.imageUrl || (initialImages[0] || ""),
            imageUrls: initialImages,
            videoUrl: prod.videoUrl || "",
            featured: prod.featured || false,
            active: prod.active || true,
            variants: rawVariants
        });
        setShowProductModal(true);
    };

    const handleDeleteProduct = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This product will be removed from your catalog.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, { method: "DELETE" });
                if (res.ok) {
                    Swal.fire("Deleted!", "Product has been deleted.", "success");
                    loadData();
                }
            } catch (err) {
                Swal.fire("Error", "Failed to delete product.", "error");
            }
        }
    };

    const handleQuickImageUpload = async (productId, file) => {
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
                const prod = products.find((p) => p.id === productId);
                if (prod) {
                    const payload = {
                        name: prod.name,
                        slug: prod.slug,
                        categoryId: prod.category?.id,
                        shortDescription: prod.shortDescription,
                        fullDescription: prod.fullDescription,
                        benefits: prod.benefits,
                        imageUrl: data.imageUrl,
                        featured: prod.featured,
                        active: prod.active,
                        variants: prod.variants
                    };
                    await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    });
                    Swal.fire({ icon: "success", title: "Product Photo Updated", timer: 1200, showConfirmButton: false });
                    loadData();
                }
            }
        } catch (err) {
            Swal.fire("Error", "Failed to update product photo", "error");
        }
    };

    const handleMultiImageUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const maxImageSize = 1 * 1024 * 1024;
        const validFiles = [];
        const oversizedFiles = [];

        files.forEach((file) => {
            if (file.size > maxImageSize) {
                oversizedFiles.push(file.name);
            } else {
                validFiles.push(file);
            }
        });

        if (oversizedFiles.length > 0) {
            Swal.fire({
                icon: "warning",
                title: "File Limit Exceeded",
                html: `The following image(s) exceed the <b>1 MB</b> limit and were skipped:<br/><small>${oversizedFiles.join(", ")}</small>`
            });
        }

        if (validFiles.length === 0) return;

        const formData = new FormData();
        validFiles.forEach((file) => formData.append("files", file));

        setUploadingImage(true);
        try {
            const res = await fetch(`${API_BASE_URL}/admin/products/upload-images`, {
                method: "POST",
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                const uploadedUrls = data.imageUrls || [];
                setProductForm((prev) => {
                    const newImages = [...(prev.imageUrls || []), ...uploadedUrls];
                    const primary = prev.imageUrl || newImages[0] || "";
                    return {
                        ...prev,
                        imageUrl: primary,
                        imageUrls: newImages
                    };
                });
                Swal.fire({ icon: "success", title: `${uploadedUrls.length} Image(s) Uploaded`, timer: 1200, showConfirmButton: false });
            } else {
                const errData = await res.json().catch(() => ({}));
                Swal.fire({ icon: "error", title: "Upload Failed", text: errData.error || "Failed to upload images" });
            }
        } catch (err) {
            Swal.fire({ icon: "error", title: "Upload Error" });
        } finally {
            setUploadingImage(false);
        }
    };

    const handleVideoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const maxVideoSize = 10 * 1024 * 1024;
        if (file.size > maxVideoSize) {
            Swal.fire({
                icon: "warning",
                title: "Video Too Large",
                text: `Video file '${file.name}' (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the 10 MB limit.`
            });
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setUploadingVideo(true);
        try {
            const res = await fetch(`${API_BASE_URL}/admin/products/upload-video`, {
                method: "POST",
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setProductForm((prev) => ({ ...prev, videoUrl: data.videoUrl }));
                Swal.fire({ icon: "success", title: "Video Uploaded", timer: 1200, showConfirmButton: false });
            } else {
                const errData = await res.json().catch(() => ({}));
                Swal.fire({ icon: "error", title: "Video Upload Failed", text: errData.error || "Failed to upload video" });
            }
        } catch (err) {
            Swal.fire({ icon: "error", title: "Video Upload Error" });
        } finally {
            setUploadingVideo(false);
        }
    };

    const handleSetPrimaryImage = (url) => {
        setProductForm((prev) => ({ ...prev, imageUrl: url }));
    };

    const handleRemoveImage = (index) => {
        setProductForm((prev) => {
            const currentList = (prev.imageUrls && prev.imageUrls.length > 0)
                ? prev.imageUrls
                : (prev.imageUrl ? [prev.imageUrl] : []);
            const updatedImages = currentList.filter((_, i) => i !== index);
            let updatedPrimary = prev.imageUrl;
            if (!updatedImages.includes(updatedPrimary)) {
                updatedPrimary = updatedImages[0] || "";
            }
            return {
                ...prev,
                imageUrl: updatedPrimary,
                imageUrls: updatedImages
            };
        });
    };

    const handleRemoveVideo = () => {
        setProductForm((prev) => ({ ...prev, videoUrl: "" }));
    };

    const handleAddVariant = () => {
        setProductForm((prev) => ({
            ...prev,
            variants: [
                ...(prev.variants || []),
                { variantName: "", price: "", discountPrice: "" }
            ]
        }));
    };

    const handleRemoveVariant = (index) => {
        if ((productForm.variants || []).length <= 1) {
            Swal.fire({ icon: "info", title: "Minimum 1 Variant Required", text: "A product must have at least one variant size/price." });
            return;
        }
        setProductForm((prev) => ({
            ...prev,
            variants: (prev.variants || []).filter((_, i) => i !== index)
        }));
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();

        const primaryImg = productForm.imageUrl || (productForm.imageUrls?.[0] || "");
        const payload = {
            name: productForm.name,
            slug: productForm.slug,
            hsnCode: productForm.hsnCode || "1006",
            categoryId: productForm.categoryId ? parseInt(productForm.categoryId) : null,
            shortDescription: productForm.shortDescription,
            fullDescription: productForm.fullDescription,
            benefits: productForm.benefits,
            imageUrl: primaryImg,
            imageUrls: productForm.imageUrls || [],
            videoUrl: productForm.videoUrl || "",
            featured: productForm.featured,
            active: productForm.active,
            variants: (productForm.variants || [])
                .map((v, idx) => ({
                    variantName: v.variantName?.trim() || "",
                    price: v.price ? parseFloat(v.price) : null,
                    discountPrice: v.discountPrice ? parseFloat(v.discountPrice) : null,
                    isDefault: idx === 0
                }))
                .filter((v, idx) => idx === 0 || (v.variantName !== "" || v.price !== null))
        };

        const url = editingProductId
            ? `${API_BASE_URL}/admin/products/${editingProductId}`
            : `${API_BASE_URL}/admin/products`;

        const method = editingProductId ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                Swal.fire({
                    icon: "success",
                    title: editingProductId ? "Product Updated" : "Product Created",
                    timer: 1500,
                    showConfirmButton: false
                });
                setShowProductModal(false);
                resetProductForm();
                loadData();
            } else {
                const errData = await res.json().catch(() => ({}));
                Swal.fire({ icon: "error", title: "Save Failed", text: errData.message || errData.error || "Failed to save product" });
            }
        } catch (err) {
            Swal.fire({ icon: "error", title: "Server Error", text: err.message || "Could not connect to backend server" });
        }
    };

    return (
        <div className="space-y-5">
            {/* Header section */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <span>📦</span> Product Catalog CRUD
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Manage organic food products, prices, and media</p>
                </div>
                <button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-sm hover:shadow-emerald-950/20 transition-all duration-150 flex items-center gap-2"
                    onClick={() => {
                        resetProductForm();
                        setShowProductModal(true);
                    }}
                >
                    <span>+</span> Add New Organic Product
                </button>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs font-bold font-mono uppercase tracking-wider">
                                <th className="py-3.5 px-4 text-center">Image</th>
                                <th className="py-3.5 px-4">Product Name</th>
                                <th className="py-3.5 px-4">HSN Code</th>
                                <th className="py-3.5 px-4">Category</th>
                                <th className="py-3.5 px-4">Variant / Price</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-slate-500 font-medium">
                                        No organic products found in catalog.
                                    </td>
                                </tr>
                            ) : (
                                products.map((p) => {
                                    const defaultVar = p.variants?.[0] || {};
                                    const imgUrl = getImageUrl(p.imageUrl);

                                    return (
                                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="py-3 px-4 text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    <img
                                                        src={imgUrl}
                                                        alt={p.name}
                                                        className="w-14 h-14 object-cover rounded-xl border border-slate-200 shadow-sm"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "/media/placeholder.png";
                                                        }}
                                                    />
                                                    <label className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer hover:underline">
                                                        Change Photo
                                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleQuickImageUpload(p.id, e.target.files[0])} />
                                                    </label>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                                            <td className="py-3 px-4">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                                    {p.hsnCode || "1006"}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-slate-600 font-medium">{p.category?.name || "Unassigned"}</td>
                                            <td className="py-3 px-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                                                    {defaultVar.variantName || "Standard"}: ₹{defaultVar.discountPrice || defaultVar.price || 0}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                                    p.active
                                                        ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"
                                                        : "bg-slate-100 text-slate-600 border border-slate-200"
                                                }`}>
                                                    {p.active ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-300 transition-all shadow-sm"
                                                        onClick={() => handleEditProduct(p)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-rose-200 transition-all shadow-sm"
                                                        onClick={() => handleDeleteProduct(p.id)}
                                                    >
                                                        Delete
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

            {/* PRODUCT MODAL */}
            {showProductModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full border border-slate-100 my-8 overflow-hidden">
                        <div className="bg-emerald-700 text-white px-6 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-extrabold flex items-center gap-2">
                                <span>📦</span> {editingProductId ? "Edit Organic Product" : "Add New Organic Product"}
                            </h3>
                            <button
                                type="button"
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white font-bold transition-all"
                                onClick={() => setShowProductModal(false)}
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSaveProduct} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Product Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                                        value={productForm.name}
                                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Slug (URL Keyword)</label>
                                    <input
                                        type="text"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                                        value={productForm.slug}
                                        onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                                        placeholder="e.g. kattuyanam-rice"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">HSN Code</label>
                                    <input
                                        type="text"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-mono"
                                        value={productForm.hsnCode}
                                        onChange={(e) => setProductForm({ ...productForm, hsnCode: e.target.value })}
                                        placeholder="1006"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Category</label>
                                    <select
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                                        value={productForm.categoryId}
                                        onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Short Description</label>
                                    <input
                                        type="text"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                                        value={productForm.shortDescription}
                                        onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Full Description</label>
                                    <textarea
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                                        rows="3"
                                        value={productForm.fullDescription}
                                        onChange={(e) => setProductForm({ ...productForm, fullDescription: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Health Benefits & Culinary Uses</label>
                                    <textarea
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                                        rows="2"
                                        value={productForm.benefits}
                                        onChange={(e) => setProductForm({ ...productForm, benefits: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            {/* Multi-Image & Video Gallery */}
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                                <h4 className="font-bold text-emerald-800 text-sm flex items-center gap-1.5">
                                    <span>🖼️</span> Product Media & Video Gallery
                                </h4>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Upload Product Photos (Max 1MB per image):</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="w-full text-xs text-slate-600 bg-white border border-slate-200 rounded-xl p-2"
                                        onChange={handleMultiImageUpload}
                                        disabled={uploadingImage}
                                    />
                                    {uploadingImage && <p className="text-xs text-emerald-600 font-bold mt-1">Uploading images...</p>}
                                </div>

                                {/* Image Previews */}
                                {productForm.imageUrls && productForm.imageUrls.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {productForm.imageUrls.map((url, idx) => {
                                            const isPrimary = productForm.imageUrl === url;
                                            return (
                                                <div key={idx} className={`relative border p-1 rounded-xl bg-white text-center w-24 ${isPrimary ? "border-2 border-emerald-600" : "border-slate-200"}`}>
                                                    <img src={getImageUrl(url)} alt={`Media ${idx}`} className="w-full h-16 object-cover rounded-lg" />
                                                    {isPrimary ? (
                                                        <span className="absolute top-1 left-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">Main</span>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className="text-[10px] text-emerald-700 font-bold hover:underline mt-1 block w-full text-center"
                                                            onClick={() => handleSetPrimaryImage(url)}
                                                        >
                                                            Set Main
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className="absolute top-1 right-1 bg-rose-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                                                        onClick={() => handleRemoveImage(idx)}
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Upload Product Video (MP4, Max 10MB):</label>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        className="w-full text-xs text-slate-600 bg-white border border-slate-200 rounded-xl p-2"
                                        onChange={handleVideoUpload}
                                        disabled={uploadingVideo}
                                    />
                                    {uploadingVideo && <p className="text-xs text-emerald-600 font-bold mt-1">Uploading video...</p>}
                                </div>

                                {productForm.videoUrl && (
                                    <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
                                        <span className="font-bold text-emerald-700 truncate">🎥 {productForm.videoUrl}</span>
                                        <button type="button" className="text-rose-600 font-bold hover:underline ml-2" onClick={handleRemoveVideo}>Remove</button>
                                    </div>
                                )}
                            </div>

                            {/* Variants Section */}
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-slate-900 text-sm">Pack Sizes & Pricing Variants</h4>
                                    <button type="button" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg" onClick={handleAddVariant}>+ Add Size</button>
                                </div>
                                {(productForm.variants || []).map((v, idx) => (
                                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                                        <div className="col-span-5">
                                            <input
                                                type="text"
                                                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                                                placeholder="Variant Name (e.g. 5kg)"
                                                value={v.variantName}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setProductForm((prev) => {
                                                        const updated = [...(prev.variants || [])];
                                                        updated[idx].variantName = val;
                                                        return { ...prev, variants: updated };
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                                                placeholder="Price (₹)"
                                                value={v.price}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setProductForm((prev) => {
                                                        const updated = [...(prev.variants || [])];
                                                        updated[idx].price = val;
                                                        return { ...prev, variants: updated };
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-emerald-700"
                                                placeholder="Offer (₹)"
                                                value={v.discountPrice}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setProductForm((prev) => {
                                                        const updated = [...(prev.variants || [])];
                                                        updated[idx].discountPrice = val;
                                                        return { ...prev, variants: updated };
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="col-span-1 text-center">
                                            <button type="button" className="text-slate-400 hover:text-rose-600 font-bold" onClick={() => handleRemoveVariant(idx)}>&times;</button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4" checked={productForm.featured} onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })} />
                                    <span className="text-xs font-bold text-slate-800">Mark as Featured Product</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4" checked={productForm.active} onChange={(e) => setProductForm({ ...productForm, active: e.target.checked })} />
                                    <span className="text-xs font-bold text-slate-800">Active in Store Catalog</span>
                                </label>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl" onClick={() => setShowProductModal(false)}>Cancel</button>
                                <button type="submit" className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
