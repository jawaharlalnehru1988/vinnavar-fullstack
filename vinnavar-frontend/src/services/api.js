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
