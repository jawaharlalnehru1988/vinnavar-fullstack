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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>📰</span> Blog Articles Management
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Create, edit, and publish organic blog posts and recipes</p>
        </div>
        <button
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          onClick={() => handleOpenModal()}
        >
          <span>➕</span> Add New Article
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-bold mt-2">Loading blog articles...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs font-bold font-mono uppercase tracking-wider">
                  <th className="py-3.5 px-4">Article</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {blogs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-500 font-medium">
                      No blog posts found. Click "Add New Article" to create one.
                    </td>
                  </tr>
                ) : (
                  blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={getImageUrl(blog.imageUrl)}
                            alt={blog.title}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/media/placeholder.png";
                            }}
                          />
                          <div>
                            <div className="font-bold text-slate-900">{blog.title}</div>
                            <div className="text-xs font-mono text-slate-400">{blog.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {blog.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          blog.active
                            ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}>
                          {blog.active ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-300 transition-all shadow-xs"
                            onClick={() => handleOpenModal(blog)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-rose-200 transition-all shadow-xs"
                            onClick={() => handleDelete(blog.id)}
                          >
                            Delete
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
      )}

      {/* Modal Form for Create / Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-100 my-8 overflow-hidden">
            <div className="bg-emerald-700 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <span>📰</span> {editingBlog ? "Edit Blog Post" : "Add New Blog Post"}
              </h3>
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white font-bold transition-all"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-7">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Title *</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Benefits of Karuppu Kavuni Rice"
                  />
                </div>
                <div className="sm:col-span-5">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Category *</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Recipes, Organic Living"
                  />
                </div>
              </div>

              {/* Cover Image Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 uppercase tracking-wider">Cover Image Selection</label>
                  <div className="bg-slate-200/80 p-1 rounded-xl flex items-center gap-1 shadow-inner">
                    <button
                      type="button"
                      className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-all ${
                        imageOption === "upload"
                          ? "bg-white text-emerald-800 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                      onClick={() => setImageOption("upload")}
                    >
                      📁 Upload File
                    </button>
                    <button
                      type="button"
                      className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-all ${
                        imageOption === "url"
                          ? "bg-white text-emerald-800 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                      onClick={() => setImageOption("url")}
                    >
                      🌐 External Web Link
                    </button>
                  </div>
                </div>

                {imageOption === "upload" ? (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full text-xs text-slate-600 bg-white border border-slate-200 rounded-xl p-2"
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                    {uploading && <p className="text-xs text-emerald-600 font-bold">Uploading image to server...</p>}
                    {!uploading && formData.imageUrl && (
                      <p className="text-[11px] text-slate-500 font-mono truncate">Current Path: {formData.imageUrl}</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="e.g. https://images.unsplash.com/photo-1540420773420-3366772f4999"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Paste an image URL from open source sites like Unsplash, Pexels, or your media server.
                    </span>
                  </div>
                )}

                {/* Live Image Preview Thumbnail */}
                {formData.imageUrl && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <img
                      src={getImageUrl(formData.imageUrl)}
                      alt="Live Preview"
                      className="w-20 h-14 rounded-xl object-cover border border-slate-200"
                      onError={(e) => {
                        e.target.src = "/media/placeholder.png";
                      }}
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 block">Image Preview</span>
                      <span className="text-slate-400 font-mono truncate block max-w-md">{formData.imageUrl}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Short Description / Excerpt</label>
                <textarea
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  rows="2"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Brief summary shown on blog list cards..."
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Full Content *</label>
                <textarea
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  rows="5"
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Detailed article body text..."
                ></textarea>
              </div>

              <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
                <span className="font-bold text-slate-800 text-xs">Publish (Active in Store Blog)</span>
              </label>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs disabled:opacity-50"
                  disabled={uploading}
                >
                  {editingBlog ? "Save Changes" : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlog;
