import React, { useState, useEffect } from "react";
import {
  fetchSocialMediaLinks,
  createSocialMediaLink,
  updateSocialMediaLink,
  deleteSocialMediaLink,
  uploadImageFile, // Re-using the settings asset upload endpoint we verified
  API_BASE_URL
} from "../../services/api";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (!formData.name || !formData.iconImageUrl) {
      alert("Name and Icon Image are required.");
      return;
    }

    try {
      if (editingLink) {
        await updateSocialMediaLink(editingLink.id, formData);
      } else {
        await createSocialMediaLink(formData);
      }
      handleCloseModal();
      loadLinks();
    } catch (err) {
      alert("Error saving social media link");
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
    return `${API_BASE_URL.replace("/api", "")}${url}`;
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 text-success fw-bold">Social Media Manager</h5>
        <button className="btn btn-sm btn-success" onClick={() => handleOpenModal()}>
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
                <th scope="col">Icon</th>
                <th scope="col">Name</th>
                <th scope="col">Link</th>
                <th scope="col" className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map((sLink) => (
                <tr key={sLink.id}>
                  <td style={{ width: "80px" }}>
                    <img
                      src={getImageUrl(sLink.iconImageUrl)}
                      alt={sLink.name}
                      style={{ height: "30px", width: "30px", objectFit: "contain", borderRadius: "50%" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/30?text=?";
                      }}
                    />
                  </td>
                  <td className="fw-medium">{sLink.name}</td>
                  <td>
                    {sLink.link ? (
                      <a href={sLink.link} target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-none small">
                        {sLink.link}
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
                  <div className="mb-3">
                    <label className="form-label fw-bold">Name (e.g., Whatsapp, Facebook)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Link (URL)</label>
                    <input
                      type="url"
                      className="form-control"
                      name="link"
                      value={formData.link}
                      onChange={handleChange}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Icon Image</label>
                    <div className="d-flex align-items-center gap-3">
                      {formData.iconImageUrl && (
                        <div className="border rounded p-1">
                          <img
                            src={getImageUrl(formData.iconImageUrl)}
                            alt="Preview"
                            style={{ width: "40px", height: "40px", objectFit: "contain" }}
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                      />
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
