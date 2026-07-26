const getApiBaseUrl = () => {
    if (typeof window !== "undefined") {
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
            return "http://localhost:8087/api/v1";
        }
        return `${window.location.origin}/api/v1`;
    }
    return "http://localhost:8087/api/v1";
};

export const API_BASE_URL = getApiBaseUrl();

export const getImageUrl = (path) => {
    if (!path) return "/media/placeholder.png";
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }
    if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
        return path.startsWith("/") ? path : `/${path}`;
    }
    return `http://localhost:8087${path.startsWith("/") ? path : `/${path}`}`;
};

export const fetchHealth = async () => {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.json();
};

export const fetchCategories = async () => {
    const res = await fetch(`${API_BASE_URL}/categories`);
    return res.json();
};

export const fetchProducts = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_BASE_URL}/products?${query}` : `${API_BASE_URL}/products`;
    const res = await fetch(url);
    return res.json();
};

export const fetchProductBySlug = async (slug) => {
    const res = await fetch(`${API_BASE_URL}/products/${slug}`);
    if (!res.ok) return null;
    return res.json();
};

export const fetchSettings = async () => {
    const res = await fetch(`${API_BASE_URL}/settings`);
    if (!res.ok) return {};
    return res.json();
};

// Blog API Services
export const fetchBlogs = async () => {
    const res = await fetch(`${API_BASE_URL}/blogs`);
    if (!res.ok) return [];
    return res.json();
};

export const fetchFeaturedBlog = async () => {
    const res = await fetch(`${API_BASE_URL}/blogs/featured`);
    if (!res.ok) return null;
    return res.json();
};

export const fetchBlogCategories = async () => {
    const res = await fetch(`${API_BASE_URL}/blogs/categories`);
    if (!res.ok) return [];
    return res.json();
};

export const fetchBlogsByCategory = async (category) => {
    const res = await fetch(`${API_BASE_URL}/blogs/category/${encodeURIComponent(category)}`);
    if (!res.ok) return [];
    return res.json();
};

export const fetchBlogBySlug = async (slug) => {
    const res = await fetch(`${API_BASE_URL}/blogs/${slug}`);
    if (!res.ok) return null;
    return res.json();
};

// Admin Blog Management API Services
export const fetchAdminBlogs = async () => {
    const res = await fetch(`${API_BASE_URL}/admin/blogs`);
    if (!res.ok) return [];
    return res.json();
};

export const createBlog = async (blogData) => {
    const res = await fetch(`${API_BASE_URL}/admin/blogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData)
    });
    return res.json();
};

export const updateBlog = async (id, blogData) => {
    const res = await fetch(`${API_BASE_URL}/admin/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData)
    });
    return res.json();
};

export const deleteBlog = async (id) => {
    const res = await fetch(`${API_BASE_URL}/admin/blogs/${id}`, {
        method: "DELETE"
    });
    return res.ok;
};

export const uploadImageFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_BASE_URL}/admin/settings/upload-asset`, {
        method: "POST",
        body: formData
    });
    if (!res.ok) throw new Error("Failed to upload image");
    const data = await res.json();
    return data.imageUrl;
};

