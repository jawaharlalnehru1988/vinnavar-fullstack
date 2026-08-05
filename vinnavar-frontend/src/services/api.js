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

// Wishlist API Services
export const getWishlistId = () => {
    let wishlistId = localStorage.getItem("vinnavar_wishlist_id");
    if (!wishlistId) {
        wishlistId = "wishlist_" + Math.random().toString(36).substring(2, 11);
        localStorage.setItem("vinnavar_wishlist_id", wishlistId);
    }
    return wishlistId;
};

export const fetchWishlist = async (wishlistId = getWishlistId()) => {
    const res = await fetch(`${API_BASE_URL}/wishlist/${wishlistId}`);
    if (!res.ok) return { wishlistId, items: [], totalItemCount: 0 };
    return res.json();
};

export const addToWishlist = async (productId, variantId = null) => {
    const wishlistId = getWishlistId();
    const res = await fetch(`${API_BASE_URL}/wishlist/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wishlistId, productId, variantId })
    });
    if (!res.ok) throw new Error("Failed to add item to wishlist");
    return res.json();
};

export const toggleWishlist = async (productId, variantId = null) => {
    const wishlistId = getWishlistId();
    const res = await fetch(`${API_BASE_URL}/wishlist/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wishlistId, productId, variantId })
    });
    if (!res.ok) throw new Error("Failed to toggle wishlist item");
    return res.json();
};

export const removeFromWishlist = async (itemId) => {
    const res = await fetch(`${API_BASE_URL}/wishlist/items/${itemId}`, {
        method: "DELETE"
    });
    return res.ok;
};

export const clearWishlist = async (wishlistId = getWishlistId()) => {
    const res = await fetch(`${API_BASE_URL}/wishlist/${wishlistId}`, {
        method: "DELETE"
    });
    return res.ok;
};

// Checkout & Razorpay API Services
export const processCodCheckout = async (checkoutData) => {
    const res = await fetch(`${API_BASE_URL}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutData)
    });
    if (!res.ok) throw new Error("Failed to process COD checkout");
    return res.json();
};

export const createRazorpayOrder = async (checkoutData) => {
    const res = await fetch(`${API_BASE_URL}/checkout/create-razorpay-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutData)
    });
    if (!res.ok) throw new Error("Failed to create Razorpay order");
    return res.json();
};

export const verifyRazorpayPayment = async (verificationData) => {
    const res = await fetch(`${API_BASE_URL}/checkout/verify-razorpay-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(verificationData)
    });
    if (!res.ok) throw new Error("Failed to verify Razorpay payment");
    return res.json();
};

// Customer Authentication API Services
export const customerRegister = async (registerData) => {
    const res = await fetch(`${API_BASE_URL}/auth/customer/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData)
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to register. Please try again.");
    }
    return data;
};

export const customerLogin = async (loginData) => {
    const res = await fetch(`${API_BASE_URL}/auth/customer/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to sign in. Please check your credentials.");
    }
    return data;
};

export const customerForgotPassword = async (resetData) => {
    const res = await fetch(`${API_BASE_URL}/auth/customer/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resetData)
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to reset password. Please check your details.");
    }
    return data;
};

// Admin Customer Management API Services
export const fetchAdminCustomers = async () => {
    const res = await fetch(`${API_BASE_URL}/admin/customers`);
    if (!res.ok) return [];
    return res.json();
};

export const createAdminCustomer = async (customerData) => {
    const res = await fetch(`${API_BASE_URL}/admin/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create customer.");
    return data;
};

export const updateAdminCustomer = async (id, customerData) => {
    const res = await fetch(`${API_BASE_URL}/admin/customers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update customer.");
    return data;
};

export const deleteAdminCustomer = async (id) => {
    const res = await fetch(`${API_BASE_URL}/admin/customers/${id}`, {
        method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed to delete customer.");
    return true;
};

// Testimonials API Services
export const fetchTestimonials = async () => {
    const res = await fetch(`${API_BASE_URL}/testimonials`);
    if (!res.ok) return [];
    return res.json();
};

export const fetchAdminTestimonials = async () => {
    const res = await fetch(`${API_BASE_URL}/admin/testimonials`);
    if (!res.ok) return [];
    return res.json();
};

export const createAdminTestimonial = async (testimonialData) => {
    const res = await fetch(`${API_BASE_URL}/admin/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testimonialData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create testimonial.");
    return data;
};

export const updateAdminTestimonial = async (id, testimonialData) => {
    const res = await fetch(`${API_BASE_URL}/admin/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testimonialData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update testimonial.");
    return data;
};

export const deleteAdminTestimonial = async (id) => {
    const res = await fetch(`${API_BASE_URL}/admin/testimonials/${id}`, {
        method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed to delete testimonial.");
    return true;
};


