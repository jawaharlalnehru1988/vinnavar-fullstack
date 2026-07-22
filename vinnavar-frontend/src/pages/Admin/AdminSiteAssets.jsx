import { API_BASE_URL, getImageUrl } from "../../services/api";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const AdminSiteAssets = () => {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploadingKey, setUploadingKey] = useState(null);
    const [editedData, setEditedData] = useState({});

    // New Asset Modal
    const [showNewAssetModal, setShowNewAssetModal] = useState(false);
    const [newAssetForm, setNewAssetForm] = useState({ key: "", value: "", group: "GENERAL", description: "" });

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
            }
        } catch (err) {
            console.error("Failed to load site settings", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

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
                Swal.fire({ icon: "success", title: "Asset & Metadata Saved", timer: 1500, showConfirmButton: false });
                loadSettings();
            } else {
                Swal.fire({ icon: "error", title: "Save Failed" });
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
                Swal.fire({ icon: "success", title: "Replacement Image Uploaded", text: "Click 'Save Changes' to confirm.", timer: 2000 });
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
                setNewAssetForm({ key: "", value: "", group: "GENERAL", description: "" });
                loadSettings();
            }
        } catch (err) {
            Swal.fire({ icon: "error", title: "Failed to create asset" });
        }
    };

    if (loading) return <div className="text-center my-5 fs-4">Loading Site Assets Manager...</div>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold m-0 text-success">🖼️ Site Assets & Images Metadata CRUD</h3>
                    <p className="text-muted small m-0">Edit store logos, hero sliders, promo banners, descriptions, and labels dynamically from the backend.</p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-success fw-bold" onClick={() => setShowNewAssetModal(true)}>
                        + Register New Asset
                    </button>
                    <button className="btn btn-outline-success fw-bold" onClick={loadSettings}>
                        🔄 Refresh
                    </button>
                </div>
            </div>

            <div className="row g-4">
                {settings.map((s) => {
                    const current = editedData[s.settingKey] || { value: s.settingValue, description: s.description, group: s.settingGroup };
                    const isImage = current.value?.startsWith("/media/") || current.value?.endsWith(".png") || current.value?.endsWith(".jpg") || current.value?.endsWith(".svg");
                    const imgUrl = isImage ? getImageUrl(current.value) : null;

                    return (
                        <div key={s.id} className="col-md-6">
                            <div className="card shadow-sm border-0 h-100">
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <div>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="badge bg-success">{current.group || "GENERAL"}</span>
                                            <span className="text-muted small font-monospace">{s.settingKey}</span>
                                        </div>

                                        {/* Metadata Editor Fields */}
                                        <div className="mb-2">
                                            <label className="form-label small fw-bold text-muted mb-0">Asset Title / Description:</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm fw-bold"
                                                value={current.description || ""}
                                                onChange={(e) => handleInputChange(s.settingKey, "description", e.target.value)}
                                            />
                                        </div>

                                        <div className="mb-2">
                                            <label className="form-label small fw-bold text-muted mb-0">Asset Category Group:</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                value={current.group || ""}
                                                onChange={(e) => handleInputChange(s.settingKey, "group", e.target.value)}
                                            />
                                        </div>

                                        {isImage && imgUrl && (
                                            <div className="my-3 text-center bg-light p-2 rounded border" style={{ maxHeight: "140px", overflow: "hidden" }}>
                                                <img
                                                    src={imgUrl}
                                                    alt={current.description}
                                                    style={{ maxHeight: "120px", maxWidth: "100%", objectFit: "contain" }}
                                                    className="rounded"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-3">
                                        {isImage && (
                                            <div className="mb-2">
                                                <label className="form-label small fw-bold text-muted mb-0">Upload Replacement Image File:</label>
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
                                            <label className="form-label small fw-bold text-muted mb-0">Asset Value / URL:</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm font-monospace"
                                                value={current.value || ""}
                                                onChange={(e) => handleInputChange(s.settingKey, "value", e.target.value)}
                                            />
                                        </div>

                                        <button
                                            className="btn btn-success btn-sm w-100 fw-bold"
                                            onClick={() => handleSaveFullMetadata(s.settingKey)}
                                        >
                                            💾 Save Metadata & Image Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

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
                                        <label className="form-label fw-bold">Asset Group</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g. LOGO, HERO_SLIDER, PROMO_BANNER, LABELS"
                                            value={newAssetForm.group}
                                            onChange={(e) => setNewAssetForm({ ...newAssetForm, group: e.target.value })}
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
