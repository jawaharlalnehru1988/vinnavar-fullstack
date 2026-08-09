import { API_BASE_URL, getImageUrl } from "../../services/api";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const formatGroupLabel = (group) => {
    if (!group) return "General";
    if (group === "ALL") return "All Site Assets";
    if (group === "GENERAL") return "General Assets";
    if (group === "HERO_SLIDER") return "Hero Sliders";
    if (group === "PROMO_BANNER") return "Promo Banners";
    if (group === "LABELS") return "Labels & Banners";
    if (group === "LOGO") return "Store Logos";
    if (group === "FOOTER") return "Footer & Contact";
    if (group === "POLICIES") return "Store Policies";
    return group
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
};

const isAssetImage = (val) => {
    if (!val || typeof val !== "string") return false;
    const clean = val.trim().toLowerCase().split("?")[0].split("#")[0];
    if (clean.startsWith("/media/") || clean.startsWith("data:image/")) return true;
    const imgExts = [
        ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".bmp", ".ico", ".avif", ".tiff", ".jfif", ".pjpeg", ".pjp"
    ];
    if (imgExts.some((ext) => clean.endsWith(ext))) return true;
    if (clean.startsWith("http://") || clean.startsWith("https://")) {
        return imgExts.some((ext) => clean.includes(ext)) || clean.includes("image") || clean.includes("photo") || clean.includes("img") || clean.includes("asset") || clean.includes("banner") || clean.includes("logo");
    }
    return false;
};

const AdminSiteAssets = ({ selectedAssetGroup = "ALL", onSettingsLoaded }) => {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploadingKey, setUploadingKey] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [viewMode, setViewMode] = useState("LIST"); // "LIST" or "GRID"

    // New Asset Modal
    const [showNewAssetModal, setShowNewAssetModal] = useState(false);
    const [newAssetForm, setNewAssetForm] = useState({
        key: "",
        value: "",
        group: selectedAssetGroup !== "ALL" ? selectedAssetGroup : "GENERAL",
        description: ""
    });

    // Edit Asset Details Modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingKey, setEditingKey] = useState(null);
    const [editAssetForm, setEditAssetForm] = useState({
        key: "",
        description: "",
        group: "",
        value: ""
    });

    const loadSettings = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/admin/settings`);
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
                const initialMap = {};
                data.forEach((s) => {
                    initialMap[s.settingKey] = {
                        value: s.settingValue || "",
                        description: s.description || "",
                        group: s.settingGroup || "GENERAL"
                    };
                });
                setEditedData(initialMap);

                if (onSettingsLoaded) {
                    const uniqueGroups = Array.from(new Set(data.map((s) => s.settingGroup).filter(Boolean)));
                    onSettingsLoaded(uniqueGroups);
                }
            }
        } catch (err) {
            console.error("Failed to load site settings", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSettings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectedAssetGroup !== "ALL") {
            setNewAssetForm((prev) => ({ ...prev, group: selectedAssetGroup }));
        }
    }, [selectedAssetGroup]);

    const handleInputChange = (key, field, val) => {
        setEditedData((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                [field]: val
            }
        }));
    };

    const handleSaveFullMetadata = async (key) => {
        const item = editedData[key];
        if (!item) return;

        try {
            const res = await fetch(`${API_BASE_URL}/admin/settings/${key}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    value: item.value,
                    description: item.description,
                    group: item.group
                })
            });

            if (res.ok) {
                Swal.fire({ icon: "success", title: "Asset Saved", timer: 1500, showConfirmButton: false });
                loadSettings();
            } else {
                Swal.fire({ icon: "error", title: "Save Failed" });
            }
        } catch (err) {
            Swal.fire({ icon: "error", title: "Server Error" });
        }
    };

    const handleDeleteAsset = async (key) => {
        const result = await Swal.fire({
            title: "Delete Site Asset?",
            html: `Are you sure you want to delete asset <code>${key}</code>?<br><span class="text-rose-600 font-bold text-xs">This action cannot be undone.</span>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e11d48",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Yes, Delete Asset",
            cancelButtonText: "Cancel"
        });

        if (!result.isConfirmed) return;

        try {
            const res = await fetch(`${API_BASE_URL}/admin/settings/${key}`, {
                method: "DELETE"
            });

            if (res.ok) {
                Swal.fire({ icon: "success", title: "Asset Deleted", timer: 1500, showConfirmButton: false });
                loadSettings();
            } else {
                Swal.fire({ icon: "error", title: "Failed to delete asset" });
            }
        } catch (err) {
            Swal.fire({ icon: "error", title: "Server Error while deleting" });
        }
    };

    const handleOpenEditModal = (s) => {
        const current = editedData[s.settingKey] || { value: s.settingValue, description: s.description, group: s.settingGroup };
        setEditingKey(s.settingKey);
        setEditAssetForm({
            key: s.settingKey,
            description: current.description || "",
            group: current.group || "GENERAL",
            value: current.value || ""
        });
        setShowEditModal(true);
    };

    const handleSaveEditModal = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/admin/settings/${editingKey}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    value: editAssetForm.value,
                    description: editAssetForm.description,
                    group: editAssetForm.group
                })
            });

            if (res.ok) {
                Swal.fire({ icon: "success", title: "Asset Details Updated", timer: 1500, showConfirmButton: false });
                setShowEditModal(false);
                loadSettings();
            } else {
                Swal.fire({ icon: "error", title: "Update Failed" });
            }
        } catch (err) {
            Swal.fire({ icon: "error", title: "Server Error" });
        }
    };

    const handleAssetFileUpload = async (key, file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setUploadingKey(key);
        try {
            const res = await fetch(`${API_BASE_URL}/admin/settings/upload-asset`, {
                method: "POST",
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                handleInputChange(key, "value", data.imageUrl);
                Swal.fire({ icon: "success", title: "Replacement Image Uploaded", text: "Click 'Save' to confirm.", timer: 2000 });
            } else {
                Swal.fire({ icon: "error", title: "Upload Failed" });
            }
        } catch (err) {
            Swal.fire({ icon: "error", title: "Upload Error" });
        } finally {
            setUploadingKey(null);
        }
    };

    const handleCreateNewAsset = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/admin/settings/${newAssetForm.key}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    value: newAssetForm.value,
                    description: newAssetForm.description,
                    group: newAssetForm.group
                })
            });

            if (res.ok) {
                Swal.fire({ icon: "success", title: "New Asset Registered", timer: 1500, showConfirmButton: false });
                setShowNewAssetModal(false);
                setNewAssetForm({ key: "", value: "", group: selectedAssetGroup !== "ALL" ? selectedAssetGroup : "GENERAL", description: "" });
                loadSettings();
            }
        } catch (err) {
            Swal.fire({ icon: "error", title: "Failed to create asset" });
        }
    };

    if (loading) return (
        <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-500 font-bold mt-2">Loading site assets manager...</p>
        </div>
    );

    const filteredSettings = selectedAssetGroup && selectedAssetGroup !== "ALL"
        ? settings.filter((s) => (s.settingGroup || "GENERAL").toUpperCase() === selectedAssetGroup.toUpperCase())
        : settings;

    return (
        <div className="space-y-6">
            {/* Main Header & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <span>🖼️</span> Site Assets & Images
                        <span className="bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1 rounded-full font-mono">
                            {formatGroupLabel(selectedAssetGroup)} ({filteredSettings.length})
                        </span>
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Manage banners, logos, and site settings with Grid or List view, inline editing, and deletion
                    </p>
                </div>
                
                <div className="flex items-center gap-2">
                    {/* View Switcher */}
                    <div className="bg-slate-200/80 p-1 rounded-xl flex items-center gap-1 shadow-inner">
                        <button
                            type="button"
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                                viewMode === "GRID"
                                    ? "bg-white text-slate-900 shadow-xs"
                                    : "text-slate-600 hover:text-slate-900"
                            }`}
                            onClick={() => setViewMode("GRID")}
                        >
                            🎴 Grid View
                        </button>
                        <button
                            type="button"
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                                viewMode === "LIST"
                                    ? "bg-white text-slate-900 shadow-xs"
                                    : "text-slate-600 hover:text-slate-900"
                            }`}
                            onClick={() => setViewMode("LIST")}
                        >
                            📋 List View
                        </button>
                    </div>

                    <button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1"
                        onClick={() => setShowNewAssetModal(true)}
                    >
                        + Add Asset
                    </button>
                    <button
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs p-2 rounded-xl border border-slate-200 transition-all"
                        onClick={loadSettings}
                        title="Refresh"
                    >
                        🔄
                    </button>
                </div>
            </div>

            {filteredSettings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm text-center p-8">
                    <h4 className="text-slate-600 font-medium text-sm mb-3">No assets registered under category <strong className="text-slate-900">{formatGroupLabel(selectedAssetGroup)}</strong></h4>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs" onClick={() => setShowNewAssetModal(true)}>
                        + Add First Asset to {formatGroupLabel(selectedAssetGroup)}
                    </button>
                </div>
            ) : viewMode === "GRID" ? (
                /* GRID VIEW (Cards Layout) */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredSettings.map((s) => {
                        const current = editedData[s.settingKey] || { value: s.settingValue, description: s.description, group: s.settingGroup };
                        const isImage = isAssetImage(current.value);
                        const imgUrl = isImage ? getImageUrl(current.value) : null;

                        return (
                            <div key={s.id || s.settingKey} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                                {current.group || "GENERAL"}
                                            </span>
                                            <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                                                {s.settingKey}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-1">
                                            <button
                                                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-2.5 py-1 rounded-lg border border-slate-300 transition-all shadow-xs"
                                                onClick={() => handleOpenEditModal(s)}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-2.5 py-1 rounded-lg border border-rose-200 transition-all shadow-xs"
                                                onClick={() => handleDeleteAsset(s.settingKey)}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Asset Title / Description:</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                                            value={current.description || ""}
                                            onChange={(e) => handleInputChange(s.settingKey, "description", e.target.value)}
                                        />
                                    </div>

                                    {isImage && imgUrl && (
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 h-36 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={imgUrl}
                                                alt={current.description || "Asset Preview"}
                                                className="max-h-32 max-w-full object-contain rounded-lg"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "/media/placeholder.png";
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3 pt-2">
                                    {isImage && (
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Upload Replacement Image File:</label>
                                            <input
                                                type="file"
                                                className="w-full text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-2"
                                                accept="image/*"
                                                onChange={(e) => handleAssetFileUpload(s.settingKey, e.target.files[0])}
                                            />
                                            {uploadingKey === s.settingKey && <p className="text-xs text-emerald-600 font-bold mt-1">Uploading file...</p>}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Asset Value / URL:</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium focus:ring-2 focus:ring-emerald-500"
                                            value={current.value || ""}
                                            onChange={(e) => handleInputChange(s.settingKey, "value", e.target.value)}
                                        />
                                    </div>

                                    <button
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-xl shadow-xs transition-all"
                                        onClick={() => handleSaveFullMetadata(s.settingKey)}
                                    >
                                        💾 Save Metadata & Image Changes
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* LIST VIEW (Table Layout) */
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs font-bold font-mono uppercase tracking-wider whitespace-nowrap">
                                    <th className="py-3.5 px-4 w-20">Preview</th>
                                    <th className="py-3.5 px-4">Asset Key & Group</th>
                                    <th className="py-3.5 px-4">Title / Description</th>
                                    <th className="py-3.5 px-4">Value / URL</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {filteredSettings.map((s) => {
                                    const current = editedData[s.settingKey] || { value: s.settingValue, description: s.description, group: s.settingGroup };
                                    const isImage = isAssetImage(current.value);
                                    const imgUrl = isImage ? getImageUrl(current.value) : null;

                                    return (
                                        <tr key={s.id || s.settingKey} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="py-3 px-4">
                                                {isImage && imgUrl ? (
                                                    <img
                                                        src={imgUrl}
                                                        alt={current.description || "Asset Preview"}
                                                        className="w-12 h-12 object-contain rounded-xl border border-slate-200 bg-slate-50 p-1"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "/media/placeholder.png";
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-md">Text</span>
                                                )}
                                            </td>

                                            <td className="py-3 px-4 whitespace-nowrap">
                                                <div className="font-mono font-bold text-xs text-slate-900">{s.settingKey}</div>
                                                <span className="inline-block bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5">
                                                    {current.group || "GENERAL"}
                                                </span>
                                            </td>

                                            <td className="py-3 px-4">
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                                                    value={current.description || ""}
                                                    onChange={(e) => handleInputChange(s.settingKey, "description", e.target.value)}
                                                    placeholder="Asset description"
                                                />
                                            </td>

                                            <td className="py-3 px-4">
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-medium focus:ring-2 focus:ring-emerald-500"
                                                    value={current.value || ""}
                                                    onChange={(e) => handleInputChange(s.settingKey, "value", e.target.value)}
                                                    placeholder="Asset value or URL"
                                                />
                                                {isImage && (
                                                    <div className="mt-1">
                                                        <label className="text-[10px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 cursor-pointer">
                                                            📷 Replace Image
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={(e) => handleAssetFileUpload(s.settingKey, e.target.files[0])}
                                                            />
                                                        </label>
                                                        {uploadingKey === s.settingKey && <span className="ml-2 text-[10px] text-emerald-600 font-bold">Uploading...</span>}
                                                    </div>
                                                )}
                                            </td>

                                            <td className="py-3 px-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-2.5 py-1 rounded-lg shadow-xs"
                                                        onClick={() => handleSaveFullMetadata(s.settingKey)}
                                                    >
                                                        💾 Save
                                                    </button>
                                                    <button
                                                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-2.5 py-1 rounded-lg border border-slate-300"
                                                        onClick={() => handleOpenEditModal(s)}
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-2.5 py-1 rounded-lg border border-rose-200"
                                                        onClick={() => handleDeleteAsset(s.settingKey)}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* MODAL: EDIT ASSET DETAILS */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-100 overflow-hidden">
                        <div className="bg-emerald-700 text-white px-6 py-4 flex items-center justify-between">
                            <h3 className="text-base font-extrabold flex items-center gap-2">
                                <span>✏️</span> Edit Asset Details
                            </h3>
                            <button type="button" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white font-bold transition-all" onClick={() => setShowEditModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSaveEditModal} className="p-6 space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Setting Key (Read-Only Code)</label>
                                <input
                                    type="text"
                                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-mono font-bold text-slate-600"
                                    value={editAssetForm.key}
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Asset Title / Description</label>
                                <input
                                    type="text"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                                    placeholder="e.g. Header Brand Logo"
                                    value={editAssetForm.description}
                                    onChange={(e) => setEditAssetForm({ ...editAssetForm, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Asset Group / Category</label>
                                <input
                                    type="text"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                                    placeholder="e.g. LOGO, HERO_SLIDER, PROMO_BANNER, LABELS, FOOTER"
                                    value={editAssetForm.group}
                                    onChange={(e) => setEditAssetForm({ ...editAssetForm, group: e.target.value.toUpperCase() })}
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Asset Value / Image URL / Text</label>
                                <textarea
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-emerald-500"
                                    rows="3"
                                    value={editAssetForm.value}
                                    onChange={(e) => setEditAssetForm({ ...editAssetForm, value: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                                <button type="button" className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl" onClick={() => setShowEditModal(false)}>Cancel</button>
                                <button type="submit" className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: REGISTER NEW ASSET */}
            {showNewAssetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-100 overflow-hidden">
                        <div className="bg-emerald-700 text-white px-6 py-4 flex items-center justify-between">
                            <h3 className="text-base font-extrabold flex items-center gap-2">
                                <span>➕</span> Register New Site Asset / Metadata
                            </h3>
                            <button type="button" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white font-bold transition-all" onClick={() => setShowNewAssetModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleCreateNewAsset} className="p-6 space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Setting Key (Unique Code)</label>
                                <input
                                    type="text"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                                    placeholder="e.g. promo_banner_top"
                                    value={newAssetForm.key}
                                    onChange={(e) => setNewAssetForm({ ...newAssetForm, key: e.target.value.toLowerCase().replaceAll(" ", "_") })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Asset Title / Description</label>
                                <input
                                    type="text"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                                    placeholder="e.g. Top Promotional Header Banner"
                                    value={newAssetForm.description}
                                    onChange={(e) => setNewAssetForm({ ...newAssetForm, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Asset Group / Category</label>
                                <input
                                    type="text"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                                    placeholder="e.g. LOGO, HERO_SLIDER, PROMO_BANNER, LABELS"
                                    value={newAssetForm.group}
                                    onChange={(e) => setNewAssetForm({ ...newAssetForm, group: e.target.value.toUpperCase() })}
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Asset Value / Image URL / Text</label>
                                <textarea
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-emerald-500"
                                    rows="2"
                                    placeholder="/media/images/my_image.png or banner text"
                                    value={newAssetForm.value}
                                    onChange={(e) => setNewAssetForm({ ...newAssetForm, value: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                                <button type="button" className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl" onClick={() => setShowNewAssetModal(false)}>Cancel</button>
                                <button type="submit" className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs">Register Asset</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSiteAssets;
