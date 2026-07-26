import React, { useEffect, useState } from "react";
import { fetchAdminBlogs, createBlog, updateBlog, deleteBlog, uploadImageFile, getImageUrl } from "../../services/api";

const AdminBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const [imageOption, setImageOption] = useState("url"); // "url" or "upload"
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Recipes",
    shortDescription: "",
    content: "",
    imageUrl: "/media/site/blog-img-1.jpg",
    active: true
  });

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminBlogs();
      setBlogs(data || []);
    } catch (err) {
      console.error("Failed to load admin blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleOpenModal = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title || "",
        slug: blog.slug || "",
        category: blog.category || "Recipes",
        shortDescription: blog.shortDescription || "",
        content: blog.content || "",
        imageUrl: blog.imageUrl || "/media/site/blog-img-1.jpg",
        active: blog.active !== undefined ? blog.active : true
      });
      // Automatically select tab based on image URL type
      if (blog.imageUrl && (blog.imageUrl.startsWith("http://") || blog.imageUrl.startsWith("https://"))) {
        setImageOption("url");
      } else {
        setImageOption("upload");
      }
    } else {
      setEditingBlog(null);
      setFormData({
        title: "",
        slug: "",
        category: "Recipes",
        shortDescription: "",
        content: "",
        imageUrl: "/media/site/blog-img-1.jpg",
        active: true
      });
      setImageOption("url");
    }
    setShowModal(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const uploadedPath = await uploadImageFile(file);
      setFormData((prev) => ({ ...prev, imageUrl: uploadedPath }));
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingBlog) {
        await updateBlog(editingBlog.id, formData);
      } else {
        await createBlog(formData);
      }
      setShowModal(false);
      loadBlogs();
    } catch (err) {
      console.error("Error saving blog:", err);
      alert("Failed to save blog post.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deleteBlog(id);
        loadBlogs();
      } catch (err) {
        console.error("Error deleting blog:", err);
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Blog Articles Management</h3>
          <p className="text-muted mb-0">Create, edit, and publish organic blog posts and recipes.</p>
        </div>
        <button
          className="btn btn-success fw-semibold px-4 rounded-pill shadow-sm d-flex align-items-center gap-2"
          onClick={() => handleOpenModal()}
        >
          <span>➕</span>
          <span>Add New Article</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4">Article</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th className="pe-4 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-muted">
                        No blog posts found. Click "Add New Article" to create one.
                      </td>
                    </tr>
                  ) : (
                    blogs.map((blog) => (
                      <tr key={blog.id}>
                        <td className="ps-4">
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={getImageUrl(blog.imageUrl)}
                              alt={blog.title}
                              className="rounded-3"
                              style={{ width: "50px", height: "50px", objectFit: "cover" }}
                            />
                            <div>
                              <div className="fw-bold text-dark">{blog.title}</div>
                              <small className="text-muted">{blog.slug}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border px-2.5 py-1 rounded-pill">
                            {blog.category}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${blog.active ? "bg-success" : "bg-secondary"} rounded-pill`}>
                            {blog.active ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="pe-4 text-end">
                          <button
                            className="btn btn-sm btn-outline-primary me-2 rounded-pill"
                            onClick={() => handleOpenModal(blog)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger rounded-pill"
                            onClick={() => handleDelete(blog.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form for Create / Edit */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">
                  {editingBlog ? "Edit Blog Post" : "Add New Blog Post"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-7">
                      <label className="form-label fw-semibold">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Benefits of Karuppu Kavuni Rice"
                      />
                    </div>
                    <div className="col-md-5">
                      <label className="form-label fw-semibold">Category</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g. Recipes, Organic Living"
                      />
                    </div>

                    {/* Dual Option Image Selection */}
                    <div className="col-12">
                      <label className="form-label fw-semibold d-flex justify-content-between align-items-center">
                        <span>Cover Image Selection</span>
                        <div className="btn-group btn-group-sm" role="group">
                          <button
                            type="button"
                            className={`btn ${imageOption === "upload" ? "btn-success" : "btn-outline-secondary"}`}
                            onClick={() => setImageOption("upload")}
                          >
                            📁 Upload File
                          </button>
                          <button
                            type="button"
                            className={`btn ${imageOption === "url" ? "btn-success" : "btn-outline-secondary"}`}
                            onClick={() => setImageOption("url")}
                          >
                            🌐 External Web Link / URL
                          </button>
                        </div>
                      </label>

                      {imageOption === "upload" ? (
                        <div className="p-3 bg-light rounded-3 border text-center">
                          <input
                            type="file"
                            accept="image/*"
                            className="form-control"
                            onChange={handleFileUpload}
                            disabled={uploading}
                          />
                          {uploading && (
                            <small className="text-success mt-2 d-block">
                              Uploading image to server...
                            </small>
                          )}
                          {!uploading && formData.imageUrl && (
                            <small className="text-muted mt-2 d-block text-truncate">
                              Current Uploaded Path: <code>{formData.imageUrl}</code>
                            </small>
                          )}
                        </div>
                      ) : (
                        <div>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            placeholder="e.g. https://images.unsplash.com/photo-1540420773420-3366772f4999"
                          />
                          <small className="text-muted mt-1 d-block">
                            Paste an image URL from open source sites like Unsplash, Pexels, or your media server.
                          </small>
                        </div>
                      )}

                      {/* Live Image Preview Thumbnail */}
                      {formData.imageUrl && (
                        <div className="mt-3 d-flex align-items-center gap-3 p-2 bg-light rounded-3 border">
                          <img
                            src={getImageUrl(formData.imageUrl)}
                            alt="Live Preview"
                            className="rounded-2"
                            style={{ width: "80px", height: "60px", objectFit: "cover" }}
                            onError={(e) => {
                              e.target.src = "/media/placeholder.png";
                            }}
                          />
                          <div className="small">
                            <span className="fw-semibold text-dark d-block">Image Preview</span>
                            <span className="text-muted text-truncate d-inline-block" style={{ maxWidth: "450px" }}>
                              {formData.imageUrl}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Short Description / Excerpt</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={formData.shortDescription}
                        onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                        placeholder="Brief summary shown on blog list cards..."
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Full Content</label>
                      <textarea
                        className="form-control"
                        rows="5"
                        required
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Detailed article body text..."
                      ></textarea>
                    </div>
                    <div className="col-12 d-flex align-items-center gap-2 mt-3">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="activeSwitch"
                          checked={formData.active}
                          onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        />
                        <label className="form-check-label fw-semibold" htmlFor="activeSwitch">
                          Publish (Active)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-4"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success rounded-pill px-4 fw-semibold" disabled={uploading}>
                    {editingBlog ? "Save Changes" : "Publish Article"}
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

export default AdminBlog;
