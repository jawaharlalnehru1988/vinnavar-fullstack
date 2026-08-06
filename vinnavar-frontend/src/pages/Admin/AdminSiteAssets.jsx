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
            html: `Are you sure you want to delete asset <code>${key}</code>?<br><span className="text-danger small">This action cannot be undone.</span>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
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

    if (loading) return <div className="text-center my-5 fs-4">Loading Site Assets Manager...</div>;

    const filteredSettings = selectedAssetGroup && selectedAssetGroup !== "ALL"
        ? settings.filter((s) => (s.settingGroup || "GENERAL").toUpperCase() === selectedAssetGroup.toUpperCase())
        : settings;

    return (
        <div>
            {/* Main Header & Actions */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom gap-3">
                <div>
                    <div className="d-flex align-items-center gap-2">
                        <h3 className="fw-bold m-0 text-success">🖼️ Site Assets & Images</h3>
                        <span className="badge bg-warning text-dark font-monospace fs-6 px-3 py-1 rounded-pill">
                            Category: {formatGroupLabel(selectedAssetGroup)} ({filteredSettings.length})
                        </span>
                    </div>
                    <p className="text-muted small m-0 mt-1">
                        Manage banners, logos, and site settings with Grid or List view, inline editing, and deletion.
                    </p>
                </div>
                
                <div className="d-flex align-items-center gap-2">
                    {/* View Switcher */}
                    <div className="btn-group" role="group">
                        <button
                            type="button"
                            className={`btn btn-sm ${viewMode === "GRID" ? "btn-success active" : "btn-outline-success"}`}
                            onClick={() => setViewMode("GRID")}
                            title="Grid View"
                        >
                            <i className="fa fa-th-large me-1"></i> Grid View
                        </button>
                        <button
                            type="button"
                            className={`btn btn-sm ${viewMode === "LIST" ? "btn-success active" : "btn-outline-success"}`}
                            onClick={() => setViewMode("LIST")}
                            title="List View"
                        >
                            <i className="fa fa-list me-1"></i> List View
                        </button>
                    </div>

                    <button className="btn btn-success btn-sm fw-bold" onClick={() => setShowNewAssetModal(true)}>
                        + Add Asset
                    </button>
                    <button className="btn btn-outline-success btn-sm fw-bold" onClick={loadSettings} title="Refresh">
                        🔄
                    </button>
                </div>
            </div>

            {filteredSettings.length === 0 ? (
                <div className="card shadow-sm border-0 text-center p-5 my-4">
                    <h5 className="text-muted fw-normal mb-3">No assets registered under category <b>{formatGroupLabel(selectedAssetGroup)}</b></h5>
                    <div>
                        <button className="btn btn-success" onClick={() => setShowNewAssetModal(true)}>
                            + Add First Asset to {formatGroupLabel(selectedAssetGroup)}
                        </button>
                    </div>
                </div>
            ) : viewMode === "GRID" ? (
                /* GRID VIEW (Cards Layout) */
                <div className="row g-4">
                    {filteredSettings.map((s) => {
                        const current = editedData[s.settingKey] || { value: s.settingValue, description: s.description, group: s.settingGroup };
                        const isImage = current.value?.startsWith("/media/") || current.value?.endsWith(".png") || current.value?.endsWith(".jpg") || current.value?.endsWith(".svg") || current.value?.endsWith(".webp");
                        const imgUrl = isImage ? getImageUrl(current.value) : null;

                        return (
                            <div key={s.id || s.settingKey} className="col-md-6">
                                <div className="card shadow-sm border-0 h-100 position-relative">
                                    <div className="card-body d-flex flex-column justify-content-between">
                                        <div>
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="badge bg-success px-3 py-2 fs-6">{current.group || "GENERAL"}</span>
                                                    <span className="text-muted small font-monospace bg-light px-2 py-1 rounded border">{s.settingKey}</span>
                                                </div>
                                                
                                                {/* Action Buttons: Edit & Delete */}
                                                <div className="d-flex gap-1">
                                                    <button
                                                        className="btn btn-outline-primary btn-sm px-2 py-1"
                                                        onClick={() => handleOpenEditModal(s)}
                                                        title="Edit Asset Details"
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger btn-sm px-2 py-1"
                                                        onClick={() => handleDeleteAsset(s.settingKey)}
                                                        title="Delete Asset"
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Metadata Title / Description */}
                                            <div className="mb-3">
                                                <label className="form-label small fw-bold text-muted mb-1">Asset Title / Description:</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm fw-bold"
                                                    value={current.description || ""}
                                                    onChange={(e) => handleInputChange(s.settingKey, "description", e.target.value)}
                                                />
                                            </div>

                                            {isImage && imgUrl && (
                                                <div className="my-3 text-center bg-light p-3 rounded border" style={{ maxHeight: "150px", overflow: "hidden" }}>
                                                    <img
                                                        src={imgUrl}
                                                        alt={current.description}
                                                        style={{ maxHeight: "125px", maxWidth: "100%", objectFit: "contain" }}
                                                        className="rounded"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-3">
                                            {isImage && (
                                                <div className="mb-3">
                                                    <label className="form-label small fw-bold text-muted mb-1">Upload Replacement Image File:</label>
                                                    <input
                                                        type="file"
                                                        className="form-control form-control-sm"
                                                        accept="image/*"
                                                        onChange={(e) => handleAssetFileUpload(s.settingKey, e.target.files[0])}
                                                    />
                                                    {uploadingKey === s.settingKey && <div className="small text-primary mt-1">Uploading file...</div>}
                                                </div>
                                            )}

                                            <div className="mb-3">
                                                <label className="form-label small fw-bold text-muted mb-1">Asset Value / URL:</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm font-monospace"
                                                    value={current.value || ""}
                                                    onChange={(e) => handleInputChange(s.settingKey, "value", e.target.value)}
                                                />
                                            </div>

                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-success btn-sm flex-grow-1 fw-bold py-2"
                                                    onClick={() => handleSaveFullMetadata(s.settingKey)}
                                                >
                                                    💾 Save Metadata & Image Changes
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* LIST VIEW (Table Layout) */
                <div className="card shadow-sm border-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th style={{ width: "90px" }}>Preview</th>
                                    <th>Asset Key & Group</th>
                                    <th>Title / Description</th>
                                    <th>Value / URL</th>
                                    <th style={{ width: "220px" }} className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSettings.map((s) => {
                                    const current = editedData[s.settingKey] || { value: s.settingValue, description: s.description, group: s.settingGroup };
                                    const isImage = current.value?.startsWith("/media/") || current.value?.endsWith(".png") || current.value?.endsWith(".jpg") || current.value?.endsWith(".svg") || current.value?.endsWith(".webp");
                                    const imgUrl = isImage ? getImageUrl(current.value) : null;

                                    return (
                                        <tr key={s.id || s.settingKey}>
                                            {/* Preview Thumbnail */}
                                            <td>
                                                {isImage && imgUrl ? (
                                                    <img
                                                        src={imgUrl}
                                                        alt={current.description}
                                                        style={{ width: "50px", height: "50px", objectFit: "contain" }}
                                                        className="rounded border bg-light p-1"
                                                    />
                                                ) : (
                                                    <span className="badge bg-secondary">Text</span>
                                                )}
                                            </td>

                                            {/* Key & Group */}
                                            <td>
                                                <div className="fw-bold font-monospace small text-dark">{s.settingKey}</div>
                                                <span className="badge bg-success small mt-1">{current.group || "GENERAL"}</span>
                                            </td>

                                            {/* Description Input */}
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm fw-semibold"
                                                    value={current.description || ""}
                                                    onChange={(e) => handleInputChange(s.settingKey, "description", e.target.value)}
                                                    placeholder="Asset description"
                                                />
                                            </td>

                                            {/* Value / URL Input */}
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm font-monospace"
                                                    value={current.value || ""}
                                                    onChange={(e) => handleInputChange(s.settingKey, "value", e.target.value)}
                                                    placeholder="Asset value or URL"
                                                />
                                                {isImage && (
                                                    <div className="mt-1">
                                                        <label className="btn btn-outline-secondary btn-sm py-0 px-2 small" style={{ fontSize: "0.75rem" }}>
                                                            📷 Replace Image
                                                            <input
                                                                type="file"
                                                                className="d-none"
                                                                accept="image/*"
                                                                onChange={(e) => handleAssetFileUpload(s.settingKey, e.target.files[0])}
                                                            />
                                                        </label>
                                                        {uploadingKey === s.settingKey && <span className="ms-2 small text-primary">Uploading...</span>}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="text-end">
                                                <div className="d-flex justify-content-end gap-1">
                                                    <button
                                                        className="btn btn-success btn-sm px-2"
                                                        onClick={() => handleSaveFullMetadata(s.settingKey)}
                                                        title="Save Changes"
                                                    >
                                                        💾 Save
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-primary btn-sm px-2"
                                                        onClick={() => handleOpenEditModal(s)}
                                                        title="Edit Asset Details"
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger btn-sm px-2"
                                                        onClick={() => handleDeleteAsset(s.settingKey)}
                                                        title="Delete Asset"
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
                <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title fw-bold">✏️ Edit Asset Details</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <form onSubmit={handleSaveEditModal}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Setting Key (Read-Only Code)</label>
                                        <input
                                            type="text"
                                            className="form-control font-monospace bg-light"
                                            value={editAssetForm.key}
                                            readOnly
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Asset Title / Description</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g. Header Brand Logo"
                                            value={editAssetForm.description}
                                            onChange={(e) => setEditAssetForm({ ...editAssetForm, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Asset Group / Category</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g. LOGO, HERO_SLIDER, PROMO_BANNER, LABELS, FOOTER"
                                            value={editAssetForm.group}
                                            onChange={(e) => setEditAssetForm({ ...editAssetForm, group: e.target.value.toUpperCase() })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Asset Value / Image URL / Text</label>
                                        <textarea
                                            className="form-control font-monospace"
                                            rows="3"
                                            value={editAssetForm.value}
                                            onChange={(e) => setEditAssetForm({ ...editAssetForm, value: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary fw-bold">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: REGISTER NEW ASSET */}
            {showNewAssetModal && (
                <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title fw-bold">Register New Site Asset / Metadata</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowNewAssetModal(false)}></button>
                            </div>
                            <form onSubmit={handleCreateNewAsset}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Setting Key (Unique Code)</label>
                                        <input
                                            type="text"
                                            className="form-control font-monospace"
                                            placeholder="e.g. promo_banner_top"
                                            value={newAssetForm.key}
                                            onChange={(e) => setNewAssetForm({ ...newAssetForm, key: e.target.value.toLowerCase().replaceAll(" ", "_") })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Asset Title / Description</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g. Top Promotional Header Banner"
                                            value={newAssetForm.description}
                                            onChange={(e) => setNewAssetForm({ ...newAssetForm, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Asset Group / Category</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g. LOGO, HERO_SLIDER, PROMO_BANNER, LABELS"
                                            value={newAssetForm.group}
                                            onChange={(e) => setNewAssetForm({ ...newAssetForm, group: e.target.value.toUpperCase() })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Asset Value / Image URL / Text</label>
                                        <textarea
                                            className="form-control font-monospace"
                                            rows="2"
                                            placeholder="/media/images/my_image.png or banner text"
                                            value={newAssetForm.value}
                                            onChange={(e) => setNewAssetForm({ ...newAssetForm, value: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowNewAssetModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-success fw-bold">Register Asset</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSiteAssets;
