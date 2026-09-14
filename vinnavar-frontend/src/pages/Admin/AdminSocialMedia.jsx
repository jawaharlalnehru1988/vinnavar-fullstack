import React, { useState, useEffect } from "react";
import {
  fetchSocialMediaLinks,
  createSocialMediaLink,
  updateSocialMediaLink,
  deleteSocialMediaLink,
  uploadImageFile,
  API_BASE_URL
} from "../../services/api";

const PRESET_PLATFORMS = [
  { name: "YouTube", icon: "/media/site/youtube.svg", placeholder: "https://youtube.com/@your-channel" },
  { name: "Facebook", icon: "/media/site/facebook.svg", placeholder: "https://facebook.com/your-page" },
  { name: "Instagram", icon: "/media/site/instagram.svg", placeholder: "https://instagram.com/your-handle" },
  { name: "WhatsApp", icon: "/media/site/whatsapp.svg", placeholder: "https://wa.me/91XXXXXXXXXX" }
];

const AdminSocialMedia = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    iconImageUrl: "",
    link: ""
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      setLoading(true);
      const data = await fetchSocialMediaLinks();
      setLinks(data || []);
      setError(null);
    } catch (err) {
      setError("Failed to load social media links");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (link = null) => {
    setEditingLink(link);
    if (link) {
      setFormData({
        name: link.name || "",
        iconImageUrl: link.iconImageUrl || "",
        link: link.link || ""
      });
    } else {
      setFormData({ name: "", iconImageUrl: "", link: "" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLink(null);
  };

  const handleSelectPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      name: preset.name,
      iconImageUrl: preset.icon,
      link: prev.link || ""
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "name" && !prev.iconImageUrl) {
        const found = PRESET_PLATFORMS.find(
          (p) => p.name.toLowerCase() === value.trim().toLowerCase()
        );
        if (found) {
          updated.iconImageUrl = found.icon;
        }
      }
      return updated;
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadImageFile(file);
      setFormData((prev) => ({ ...prev, iconImageUrl: imageUrl }));
    } catch (err) {
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let finalIcon = formData.iconImageUrl;
    if (!finalIcon && formData.name) {
      const found = PRESET_PLATFORMS.find(
        (p) => p.name.toLowerCase() === formData.name.trim().toLowerCase()
      );
      if (found) finalIcon = found.icon;
    }

    if (!formData.name) {
      alert("Name is required.");
      return;
    }
    if (!finalIcon) {
      alert("Please choose a preset or upload an icon image.");
      return;
    }

    try {
      const payload = {
        ...formData,
        iconImageUrl: finalIcon
      };

      if (editingLink) {
        await updateSocialMediaLink(editingLink.id, payload);
      } else {
        await createSocialMediaLink(payload);
      }
      handleCloseModal();
      loadLinks();
    } catch (err) {
      alert("Error saving social media link: " + (err.message || "Please check server logs"));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this social media link?")) {
      try {
        await deleteSocialMediaLink(id);
        loadLinks();
      } catch (err) {
        alert("Failed to delete link.");
      }
    }
  };

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL.replace("/api/v1", "").replace("/api", "")}${url}`;
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="mb-1 text-success fw-bold">Social Media Manager</h5>
          <p className="text-muted small mb-0">Manage social channel links displayed in the footer</p>
        </div>
        <button className="btn btn-sm btn-success px-3" onClick={() => handleOpenModal()}>
          + Add New Link
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : links.length === 0 ? (
        <div className="text-center text-muted py-4">No social media links configured yet.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle border">
            <thead className="table-light">
              <tr>
                <th scope="col" style={{ width: "80px" }}>Icon</th>
                <th scope="col">Platform Name</th>
                <th scope="col">Target Link</th>
                <th scope="col" className="text-center" style={{ width: "160px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map((sLink) => (
                <tr key={sLink.id}>
                  <td>
                    <img
                      src={getImageUrl(sLink.iconImageUrl)}
                      alt={sLink.name}
                      style={{ height: "34px", width: "34px", objectFit: "contain", borderRadius: "50%" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/34?text=?";
                      }}
                    />
                  </td>
                  <td className="fw-semibold text-dark">{sLink.name}</td>
                  <td>
                    {sLink.link ? (
                      <a href={sLink.link} target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-none small">
                        {sLink.link} <i className="bi bi-box-arrow-up-right ms-1 small"></i>
                      </a>
                    ) : (
                      <span className="text-muted small">-</span>
                    )}
                  </td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleOpenModal(sLink)}>
                      <i className="bi bi-pencil-square"></i> Edit
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(sLink.id)}>
                      <i className="bi bi-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">{editingLink ? "Edit" : "Add"} Social Media Link</h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {!editingLink && (
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted d-block">Quick Select Preset</label>
                      <div className="d-flex flex-wrap gap-2">
                        {PRESET_PLATFORMS.map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            className={`btn btn-sm ${formData.name === preset.name ? "btn-success" : "btn-outline-secondary"} d-flex align-items-center gap-1`}
                            onClick={() => handleSelectPreset(preset)}
                          >
                            <img src={getImageUrl(preset.icon)} alt={preset.name} style={{ width: 18, height: 18 }} />
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label fw-bold">Platform Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="e.g., YouTube, Facebook, WhatsApp"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Link (URL) <span className="text-danger">*</span></label>
                    <input
                      type="url"
                      className="form-control"
                      name="link"
                      value={formData.link}
                      onChange={handleChange}
                      placeholder="https://..."
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Icon Image</label>
                    <div className="d-flex align-items-center gap-3">
                      {formData.iconImageUrl && (
                        <div className="border rounded p-1 bg-light">
                          <img
                            src={getImageUrl(formData.iconImageUrl)}
                            alt="Preview"
                            style={{ width: "40px", height: "40px", objectFit: "contain" }}
                          />
                        </div>
                      )}
                      <div className="flex-grow-1">
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={handleFileChange}
                          disabled={uploading}
                        />
                        <div className="form-text text-muted">
                          {formData.iconImageUrl
                            ? "Icon selected. Uploading a file will override it."
                            : "Upload custom icon or choose a preset platform above."}
                        </div>
                      </div>
                    </div>
                    {uploading && <div className="form-text text-primary mt-1">Uploading image...</div>}
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success" disabled={uploading}>
                    Save Link
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSocialMedia;
