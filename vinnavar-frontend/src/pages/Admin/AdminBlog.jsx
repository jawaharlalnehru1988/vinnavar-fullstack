import React, { useEffect, useState } from "react";
import { fetchAdminBlogs, createBlog, updateBlog, deleteBlog, uploadImageFile, getImageUrl } from "../../services/api";

const BLOG_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" }
];

const INITIAL_TRANSLATIONS = {
  en: "",
  ta: "",
  hi: "",
  te: "",
  kn: "",
  ml: "",
  mr: "",
  bn: "",
  pa: ""
};

const AdminBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const [activeLangTab, setActiveLangTab] = useState("ta"); // Default to Tamil as client requested or English
  const [imageOption, setImageOption] = useState("upload"); // "url" or "upload"
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Recipes",
    shortDescription: "",
    content: "",
    imageUrl: "/media/site/blog-img-1.jpg",
    author: "Vinnavar Team",
    readTimeMinutes: 5,
    featured: false,
    active: true,
    titleTranslations: { ...INITIAL_TRANSLATIONS },
    shortDescriptionTranslations: { ...INITIAL_TRANSLATIONS },
    contentTranslations: { ...INITIAL_TRANSLATIONS }
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

      // Merge translations with empty template so all 9 languages are addressable
      const mergedTitles = { ...INITIAL_TRANSLATIONS, ...(blog.titleTranslations || {}) };
      const mergedDescs = { ...INITIAL_TRANSLATIONS, ...(blog.shortDescriptionTranslations || {}) };
      const mergedContents = { ...INITIAL_TRANSLATIONS, ...(blog.contentTranslations || {}) };

      // If default fields exist but translation for English or Tamil is missing, sync them
      if (!mergedTitles.en && blog.title && !blog.title.match(/[\u0B80-\u0BFF]/)) {
        mergedTitles.en = blog.title;
      }
      if (!mergedTitles.ta && blog.title && blog.title.match(/[\u0B80-\u0BFF]/)) {
        mergedTitles.ta = blog.title;
      }

      setFormData({
        title: blog.title || "",
        slug: blog.slug || "",
        category: blog.category || "Recipes",
        shortDescription: blog.shortDescription || "",
        content: blog.content || "",
        imageUrl: blog.imageUrl || "/media/site/blog-img-1.jpg",
        author: blog.author || "Vinnavar Team",
        readTimeMinutes: blog.readTimeMinutes || 5,
        featured: blog.featured || false,
        active: blog.active !== undefined ? blog.active : true,
        titleTranslations: mergedTitles,
        shortDescriptionTranslations: mergedDescs,
        contentTranslations: mergedContents
      });

      // Prefer tab that has content
      if (mergedTitles.ta) {
        setActiveLangTab("ta");
      } else if (mergedTitles.en) {
        setActiveLangTab("en");
      } else {
        setActiveLangTab("en");
      }

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
        author: "Vinnavar Team",
        readTimeMinutes: 5,
        featured: false,
        active: true,
        titleTranslations: { ...INITIAL_TRANSLATIONS },
        shortDescriptionTranslations: { ...INITIAL_TRANSLATIONS },
        contentTranslations: { ...INITIAL_TRANSLATIONS }
      });
      setActiveLangTab("en");
      setImageOption("upload");
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

  const handleTranslationChange = (field, langCode, value) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: {
          ...(prev[field] || {}),
          [langCode]: value
        }
      };

      // Also keep primary title/description/content synchronized with the active translation if appropriate
      if (field === "titleTranslations" && (langCode === "en" || !prev.title)) {
        updated.title = value || prev.title;
      }
      if (field === "shortDescriptionTranslations" && (langCode === "en" || !prev.shortDescription)) {
        updated.shortDescription = value || prev.shortDescription;
      }
      if (field === "contentTranslations" && (langCode === "en" || !prev.content)) {
        updated.content = value || prev.content;
      }

      return updated;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Determine fallback title and content for backend required fields
    const titles = formData.titleTranslations || {};
    const descs = formData.shortDescriptionTranslations || {};
    const contents = formData.contentTranslations || {};

    const resolvedTitle = formData.title || titles.en || titles.ta || Object.values(titles).find((v) => v?.trim()) || "Untitled Blog Post";
    const resolvedDesc = formData.shortDescription || descs.en || descs.ta || Object.values(descs).find((v) => v?.trim()) || "";
    const resolvedContent = formData.content || contents.en || contents.ta || Object.values(contents).find((v) => v?.trim()) || "Article content coming soon...";

    const payload = {
      ...formData,
      title: resolvedTitle,
      shortDescription: resolvedDesc,
      content: resolvedContent,
      titleTranslations: titles,
      shortDescriptionTranslations: descs,
      contentTranslations: contents
    };

    try {
      if (editingBlog) {
        await updateBlog(editingBlog.id, payload);
      } else {
        await createBlog(payload);
      }
      setShowModal(false);
      loadBlogs();
    } catch (err) {
      console.error("Error saving blog:", err);
      alert("Failed to save blog post. Please check the required fields.");
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

  // Helper to count how many languages have content for an article
  const getFilledLanguages = (blog) => {
    const titles = blog.titleTranslations || {};
    const codes = Object.keys(titles).filter((k) => titles[k] && titles[k].trim() !== "");
    // If empty translations but base title exists, consider default
    if (codes.length === 0 && blog.title) {
      return ["default"];
    }
    return codes;
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>📰</span> Blog Articles Management
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage multilingual blog posts with unified Article ID and common imagery across 9 languages
          </p>
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
                  <th className="py-3.5 px-4 w-16">ID</th>
                  <th className="py-3.5 px-4">Article &amp; Supported Languages</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {blogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500 font-medium">
                      No blog posts found. Click "Add New Article" to create one.
                    </td>
                  </tr>
                ) : (
                  blogs.map((blog) => {
                    const filledLangs = getFilledLanguages(blog);
                    return (
                      <tr key={blog.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Article ID Column */}
                        <td className="py-3 px-4 font-mono font-bold text-slate-600">
                          <span className="px-2 py-1 bg-slate-100 rounded-md border border-slate-200 text-xs">
                            #{blog.id}
                          </span>
                        </td>

                        {/* Article Details & Languages */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={getImageUrl(blog.imageUrl)}
                              alt={blog.title}
                              className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-xs flex-shrink-0"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/media/placeholder.png";
                              }}
                            />
                            <div className="space-y-1">
                              <div className="font-bold text-slate-900 leading-snug">
                                {blog.titleTranslations?.ta || blog.titleTranslations?.en || blog.title}
                              </div>
                              <div className="text-[11px] font-mono text-slate-400">
                                /{blog.slug || blog.id}
                              </div>
                              
                              {/* 9 Language Status Pills */}
                              <div className="flex flex-wrap gap-1 pt-1">
                                {BLOG_LANGUAGES.map((lang) => {
                                  const isAvailable = Boolean(blog.titleTranslations?.[lang.code]);
                                  return (
                                    <span
                                      key={lang.code}
                                      title={`${lang.name} (${lang.nativeName})`}
                                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                        isAvailable
                                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                          : "bg-slate-100 text-slate-400 border border-slate-200 opacity-60"
                                      }`}
                                    >
                                      {lang.code.toUpperCase()}
                                    </span>
                                  );
                                })}
                              </div>
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
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Multilingual Modal Form with Article ID & Common Media */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-100 my-8 overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">📰</span>
                <div>
                  <h3 className="text-base font-extrabold">
                    {editingBlog ? `Edit Blog Article #${editingBlog.id}` : "Add New Blog Article"}
                  </h3>
                  <p className="text-[11px] text-emerald-200">
                    Same Article ID &amp; Image across all 9 regional languages
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white font-bold transition-all"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[82vh] overflow-y-auto custom-scrollbar text-xs">
              
              {/* Article ID & System Metadata Header Box */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-black text-sm flex items-center justify-center shadow-sm">
                    {editingBlog ? `#${editingBlog.id}` : "NEW"}
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 block">
                      Article Identifier (ID)
                    </span>
                    <span className="text-sm font-black text-emerald-950 font-mono">
                      {editingBlog ? `Blog Article ID: #${editingBlog.id}` : "Auto-assigned upon creation"}
                    </span>
                  </div>
                </div>

                {editingBlog && (
                  <div className="text-[11px] font-mono text-emerald-800 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-xs">
                    Public Permalink: <span className="font-bold">/blog/{formData.slug || editingBlog.id}</span>
                  </div>
                )}
              </div>

              {/* Shared Metadata: Cover Image & Category */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="md:col-span-12">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <span>🖼️</span> Common Article Media &amp; Categorization (Shared for all 9 languages)
                  </h4>
                </div>

                {/* Category & Slug */}
                <div className="md:col-span-6 space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Category *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Recipes, Health & Nutrition, Organic Living"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Custom URL Slug (Optional)
                    </label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="e.g. karuppu-kavuni-kanji (leave blank to auto-generate)"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Author Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        placeholder="Vinnavar Team"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Read Time (Mins)
                      </label>
                      <input
                        type="number"
                        min="1"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                        value={formData.readTimeMinutes}
                        onChange={(e) => setFormData({ ...formData, readTimeMinutes: parseInt(e.target.value) || 5 })}
                      />
                    </div>
                  </div>
                </div>

                {/* Common Cover Image Selection */}
                <div className="md:col-span-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700 uppercase tracking-wider">
                      Cover Image (Same across all languages)
                    </label>
                    <div className="bg-slate-200/80 p-0.5 rounded-xl flex items-center gap-1 shadow-inner">
                      <button
                        type="button"
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                          imageOption === "upload"
                            ? "bg-white text-emerald-800 shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                        onClick={() => setImageOption("upload")}
                      >
                        📁 Upload
                      </button>
                      <button
                        type="button"
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                          imageOption === "url"
                            ? "bg-white text-emerald-800 shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                        onClick={() => setImageOption("url")}
                      >
                        🌐 URL
                      </button>
                    </div>
                  </div>

                  {imageOption === "upload" ? (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-center space-y-1.5">
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-1.5"
                        onChange={handleFileUpload}
                        disabled={uploading}
                      />
                      {uploading && <p className="text-xs text-emerald-600 font-bold">Uploading image to server...</p>}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="e.g. /media/site/recipe.jpg or https://..."
                      />
                    </div>
                  )}

                  {/* Live Image Preview */}
                  {formData.imageUrl && (
                    <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200">
                      <img
                        src={getImageUrl(formData.imageUrl)}
                        alt="Article Cover Preview"
                        className="w-16 h-12 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                        onError={(e) => {
                          e.target.src = "/media/placeholder.png";
                        }}
                      />
                      <div className="text-[11px] overflow-hidden">
                        <span className="font-bold text-slate-800 block">Cover Preview</span>
                        <span className="text-slate-400 font-mono truncate block max-w-xs">{formData.imageUrl}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 9-Language Tab Navigation Bar */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                    <span>🌐</span> Multi-Language Article Content (9 Languages Supported)
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Switch language tabs below to edit content for each regional language
                  </span>
                </div>

                {/* Tabs Grid */}
                <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                  {BLOG_LANGUAGES.map((lang) => {
                    const isTabActive = activeLangTab === lang.code;
                    const hasTitle = Boolean(formData.titleTranslations?.[lang.code]?.trim());
                    const hasContent = Boolean(formData.contentTranslations?.[lang.code]?.trim());
                    const isFilled = hasTitle || hasContent;

                    return (
                      <button
                        type="button"
                        key={lang.code}
                        onClick={() => setActiveLangTab(lang.code)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                          isTabActive
                            ? "bg-white text-emerald-800 shadow-sm border border-emerald-300 font-black"
                            : "text-slate-600 hover:bg-white/60"
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                        <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${
                          isFilled
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-500"
                        }`}>
                          {lang.code}
                        </span>
                        {isFilled && <span className="text-emerald-600 text-xs">✓</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Active Language Editing Form */}
                {(() => {
                  const currentLangObj = BLOG_LANGUAGES.find((l) => l.code === activeLangTab) || BLOG_LANGUAGES[0];
                  const currentLangCode = currentLangObj.code;

                  return (
                    <div className="p-4 bg-emerald-50/30 rounded-2xl border border-emerald-200/70 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{currentLangObj.flag}</span>
                          <span className="font-extrabold text-emerald-900 text-sm">
                            Editing in {currentLangObj.name} ({currentLangObj.nativeName})
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                          Lang Code: {currentLangCode}
                        </span>
                      </div>

                      {/* Title for this language */}
                      <div>
                        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Article Title ({currentLangObj.name}) *
                        </label>
                        <input
                          type="text"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                          value={formData.titleTranslations?.[currentLangCode] || ""}
                          onChange={(e) => handleTranslationChange("titleTranslations", currentLangCode, e.target.value)}
                          placeholder={`Enter article headline in ${currentLangObj.name} (${currentLangObj.nativeName})...`}
                        />
                      </div>

                      {/* Short Description / Excerpt for this language */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block font-bold text-slate-700 uppercase tracking-wider">
                            Short Description / Card Excerpt ({currentLangObj.name})
                          </label>
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            (formData.shortDescriptionTranslations?.[currentLangCode] || "").length >= 1000
                              ? "bg-red-100 text-red-700 font-black"
                              : (formData.shortDescriptionTranslations?.[currentLangCode] || "").length > 850
                              ? "bg-amber-100 text-amber-800"
                              : "text-slate-400 bg-slate-100"
                          }`}>
                            {(formData.shortDescriptionTranslations?.[currentLangCode] || "").length} / 1,000
                          </span>
                        </div>
                        <textarea
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                          rows="2"
                          maxLength={1000}
                          value={formData.shortDescriptionTranslations?.[currentLangCode] || ""}
                          onChange={(e) => handleTranslationChange("shortDescriptionTranslations", currentLangCode, e.target.value)}
                          placeholder={`Brief excerpt shown on cards in ${currentLangObj.name}...`}
                        ></textarea>
                        <div className="flex justify-end mt-0.5">
                          <span className="text-[10px] font-mono text-slate-400">
                            {(formData.shortDescriptionTranslations?.[currentLangCode] || "").length} / 1,000 characters
                          </span>
                        </div>
                      </div>

                      {/* Full Body Content for this language */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block font-bold text-slate-700 uppercase tracking-wider">
                            Full Article Content ({currentLangObj.name})
                          </label>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            (formData.contentTranslations?.[currentLangCode] || "").length >= 30000
                              ? "bg-red-100 text-red-700 font-black"
                              : (formData.contentTranslations?.[currentLangCode] || "").length > 27000
                              ? "bg-amber-100 text-amber-800"
                              : "text-slate-400 bg-slate-100"
                          }`}>
                            {(formData.contentTranslations?.[currentLangCode] || "").length.toLocaleString()} / 30,000
                          </span>
                        </div>
                        <textarea
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 font-sans leading-relaxed"
                          rows="7"
                          maxLength={30000}
                          value={formData.contentTranslations?.[currentLangCode] || ""}
                          onChange={(e) => handleTranslationChange("contentTranslations", currentLangCode, e.target.value)}
                          placeholder={`Write complete blog post in ${currentLangObj.name}. Supports headings (###), bullet points (-), numbered lists (1.), and paragraphs...`}
                        ></textarea>
                        <div className="flex items-center justify-between mt-1 px-1">
                          <span className="text-[11px] text-slate-400">
                            Supports markdown formatting (### headings, - bullets, 1. numbered lists)
                          </span>
                          <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ${
                            (formData.contentTranslations?.[currentLangCode] || "").length >= 30000
                              ? "bg-red-50 text-red-600 border border-red-200"
                              : (formData.contentTranslations?.[currentLangCode] || "").length > 27000
                              ? "bg-amber-50 text-amber-600 border border-amber-200"
                              : "bg-slate-50 text-slate-500 border border-slate-200"
                          }`}>
                            {(formData.contentTranslations?.[currentLangCode] || "").length.toLocaleString()} / 30,000 characters
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Publication Status & Toggles */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <input
                    type="checkbox"
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  />
                  <span className="font-bold text-slate-800 text-xs">Publish (Active in Store Blog)</span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <input
                    type="checkbox"
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  <span className="font-bold text-slate-800 text-xs">Featured Hero Post</span>
                </label>
              </div>

              {/* Footer Save & Cancel Buttons */}
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
                  className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-700/20 disabled:opacity-50 transition-all active:scale-95"
                  disabled={uploading}
                >
                  {editingBlog ? "Save Multi-Language Changes" : "Publish Article"}
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
