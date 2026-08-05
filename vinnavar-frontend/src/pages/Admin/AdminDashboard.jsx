import { API_BASE_URL, getImageUrl } from "../../services/api";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import AdminSidebar from "./AdminSidebar";
import AdminSiteAssets from "./AdminSiteAssets";
import AdminBlog from "./AdminBlog";
import AdminCustomers from "./AdminCustomers";
import AdminTestimonials from "./AdminTestimonials";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Persist activeTab across refresh via URL query parameter & localStorage
    const getInitialTab = () => {
        const tabFromUrl = searchParams.get("tab");
        if (tabFromUrl) return tabFromUrl;
        const storedTab = localStorage.getItem("admin_active_tab");
        if (storedTab) return storedTab;
        return "overview";
    };

    const [activeTab, setActiveTabState] = useState(getInitialTab);
    const [selectedAssetGroup, setSelectedAssetGroup] = useState("ALL");
    const [assetGroups, setAssetGroups] = useState(["GENERAL", "HERO_SLIDER", "PROMO_BANNER", "LABELS", "LOGO", "FOOTER", "PAYMENT"]);

    const setActiveTab = (tab) => {
        setActiveTabState(tab);
        localStorage.setItem("admin_active_tab", tab);
        setSearchParams({ tab }, { replace: true });
    };

    // Keep state in sync if browser back/forward or URL changes
    useEffect(() => {
        const tabFromUrl = searchParams.get("tab");
        if (tabFromUrl && tabFromUrl !== activeTab) {
            setActiveTabState(tabFromUrl);
            localStorage.setItem("admin_active_tab", tabFromUrl);
        }
    }, [searchParams, activeTab]);

    // Data States
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrderModal, setSelectedOrderModal] = useState(null);

    // Product Modal / Form State
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState(false);

    const [productForm, setProductForm] = useState({
        name: "",
        slug: "",
        categoryId: "",
        shortDescription: "",
        fullDescription: "",
        benefits: "",
        imageUrl: "",
        imageUrls: [],
        videoUrl: "",
        featured: false,
        active: true,
        variantName: "1 Liter",
        price: "",
        discountPrice: ""
    });

    // Category Form State
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [categoryForm, setCategoryForm] = useState({ name: "", description: "", imageUrl: "" });

    const checkAuth = () => {
        const token = localStorage.getItem("vinnavar_admin_token");
        if (!token) {
            navigate("/admin/login");
            return false;
        }
        return true;
    };

    const loadData = async () => {
        if (!checkAuth()) return;
        setLoading(true);
        try {
            const [prodRes, catRes, ordRes] = await Promise.all([
                fetch(`${API_BASE_URL}/products`),
                fetch(`${API_BASE_URL}/categories`),
                fetch(`${API_BASE_URL}/admin/orders`)
            ]);

            if (prodRes.ok) setProducts(await prodRes.json());
            if (catRes.ok) setCategories(await catRes.json());
            if (ordRes.ok) setOrders(await ordRes.json());
        } catch (err) {
            console.error("Failed to load admin dashboard data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("vinnavar_admin_token");
        localStorage.removeItem("vinnavar_admin_user");
        navigate("/admin/login");
    };

    // Multi-Image Upload Handler (<= 1MB per image)
    const handleMultiImageUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const maxImageSize = 1 * 1024 * 1024; // 1 MB
        const validFiles = [];
        const oversizedFiles = [];

        files.forEach((file) => {
            if (file.size > maxImageSize) {
                oversizedFiles.push(file.name);
            } else {
                validFiles.push(file);
            }
        });

        if (oversizedFiles.length > 0) {
            Swal.fire({
                icon: "warning",
                title: "File Limit Exceeded",
                html: `The following image(s) exceed the <b>1 MB</b> limit and were skipped:<br/><small>${oversizedFiles.join(", ")}</small>`
            });
        }

        if (validFiles.length === 0) return;

        const formData = new FormData();
        validFiles.forEach((file) => formData.append("files", file));

        setUploadingImage(true);
        try {
            const res = await fetch(`${API_BASE_URL}/admin/products/upload-images`, {
                method: "POST",
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                const uploadedUrls = data.imageUrls || [];
                setProductForm((prev) => {
                    const newImages = [...(prev.imageUrls || []), ...uploadedUrls];
                    const primary = prev.imageUrl || newImages[0] || "";
                    return {
                        ...prev,
                        imageUrl: primary,
                        imageUrls: newImages
                    };
                });
                Swal.fire({ icon: "success", title: `${uploadedUrls.length} Image(s) Uploaded`, timer: 1200, showConfirmButton: false });
            } else {
                const errData = await res.json().catch(() => ({}));
                Swal.fire({ icon: "error", title: "Upload Failed", text: errData.error || "Failed to upload images" });
            }
        } catch (err) {
            Swal.fire({ icon: "error", title: "Upload Error" });
        } finally {
            setUploadingImage(false);
        }
    };

    // Video Upload Handler (<= 10MB per video)
    const handleVideoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const maxVideoSize = 10 * 1024 * 1024; // 10 MB
        if (file.size > maxVideoSize) {
            Swal.fire({
                icon: "warning",
                title: "Video Too Large",
                text: `Video file '${file.name}' (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the 10 MB limit.`
            });
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setUploadingVideo(true);
        try {
            const res = await fetch(`${API_BASE_URL}/admin/products/upload-video`, {
                method: "POST",
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setProductForm((prev) => ({ ...prev, videoUrl: data.videoUrl }));
                Swal.fire({ icon: "success", title: "Video Uploaded", timer: 1200, showConfirmButton: false });
            } else {
                const errData = await res.json().catch(() => ({}));
                Swal.fire({ icon: "error", title: "Video Upload Failed", text: errData.error || "Failed to upload video" });
            }
        } catch (err) {
            Swal.fire({ icon: "error", title: "Video Upload Error" });
        } finally {
            setUploadingVideo(false);
        }
    };

    const handleSetPrimaryImage = (url) => {
        setProductForm((prev) => ({ ...prev, imageUrl: url }));
    };

    const handleRemoveImage = (index) => {
        setProductForm((prev) => {
            const currentList = (prev.imageUrls && prev.imageUrls.length > 0)
                ? prev.imageUrls
                : (prev.imageUrl ? [prev.imageUrl] : []);
            const updatedImages = currentList.filter((_, i) => i !== index);
            let updatedPrimary = prev.imageUrl;
            if (!updatedImages.includes(updatedPrimary)) {
                updatedPrimary = updatedImages[0] || "";
            }
            return {
                ...prev,
                imageUrl: updatedPrimary,
                imageUrls: updatedImages
            };
        });
    };

    const handleRemoveVideo = () => {
        setProductForm((prev) => ({ ...prev, videoUrl: "" }));
    };

    // Quick Image Change from Product Table Row
    const handleQuickImageUpload = async (productId, file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`${API_BASE_URL}/admin/products/upload-image`, {
                method: "POST",
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                const prod = products.find((p) => p.id === productId);
                if (prod) {
                    const payload = {
                        name: prod.name,
                        slug: prod.slug,
                        categoryId: prod.category?.id,
                        shortDescription: prod.shortDescription,
                        fullDescription: prod.fullDescription,
                        benefits: prod.benefits,
                        imageUrl: data.imageUrl,
                        featured: prod.featured,
                        active: prod.active,
                        variants: prod.variants
                    };
                    await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    });
                    Swal.fire({ icon: "success", title: "Product Photo Updated", timer: 1200, showConfirmButton: false });
                    loadData();
                }
            }
        } catch (err) {
            Swal.fire("Error", "Failed to update product photo", "error");
        }
    };

    // Product CRUD Actions
    const handleSaveProduct = async (e) => {
        e.preventDefault();

        const primaryImg = productForm.imageUrl || (productForm.imageUrls?.[0] || "");
        const payload = {
            name: productForm.name,
            slug: productForm.slug,
            categoryId: productForm.categoryId ? parseInt(productForm.categoryId) : null,
            shortDescription: productForm.shortDescription,
            fullDescription: productForm.fullDescription,
            benefits: productForm.benefits,
            imageUrl: primaryImg,
            imageUrls: productForm.imageUrls || [],
            videoUrl: productForm.videoUrl || "",
            featured: productForm.featured,
            active: productForm.active,
            variants: [
                {
                    variantName: productForm.variantName || "Standard",
                    price: parseFloat(productForm.price || "0"),
                    discountPrice: productForm.discountPrice ? parseFloat(productForm.discountPrice) : null,
                    isDefault: true
                }
            ]
        };

        const url = editingProductId
            ? `${API_BASE_URL}/admin/products/${editingProductId}`
            : `${API_BASE_URL}/admin/products`;

        const method = editingProductId ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                Swal.fire({
                    icon: "success",
                    title: editingProductId ? "Product Updated" : "Product Created",
                    timer: 1500,
                    showConfirmButton: false
                });
                setShowProductModal(false);
                resetProductForm();
                loadData();
            } else {
                Swal.fire({ icon: "error", title: "Save Failed" });
            }
        } catch (err) {
            Swal.fire({ icon: "error", title: "Server Error" });
        }
    };

    const handleEditProduct = (prod) => {
        setEditingProductId(prod.id);
        const defaultVar = prod.variants?.[0] || {};
        const initialImages = (Array.isArray(prod.imageUrls) && prod.imageUrls.length > 0)
            ? prod.imageUrls
            : (prod.imageUrl ? [prod.imageUrl] : []);

        setProductForm({
            name: prod.name || "",
            slug: prod.slug || "",
            categoryId: prod.category?.id || "",
            shortDescription: prod.shortDescription || "",
            fullDescription: prod.fullDescription || "",
            benefits: prod.benefits || "",
            imageUrl: prod.imageUrl || (initialImages[0] || ""),
            imageUrls: initialImages,
            videoUrl: prod.videoUrl || "",
            featured: prod.featured || false,
            active: prod.active || true,
            variantName: defaultVar.variantName || "1 Liter",
            price: defaultVar.price || "",
            discountPrice: defaultVar.discountPrice || ""
        });
        setShowProductModal(true);
    };

    const handleDeleteProduct = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This product will be removed from your catalog.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, { method: "DELETE" });
                if (res.ok) {
                    Swal.fire("Deleted!", "Product has been deleted.", "success");
                    loadData();
                }
            } catch (err) {
                Swal.fire("Error", "Failed to delete product.", "error");
            }
        }
    };

    const resetProductForm = () => {
        setEditingProductId(null);
        setProductForm({
            name: "",
            slug: "",
            categoryId: "",
            shortDescription: "",
            fullDescription: "",
            benefits: "",
            imageUrl: "",
            imageUrls: [],
            videoUrl: "",
            featured: false,
            active: true,
            variantName: "1 Liter",
            price: "",
            discountPrice: ""
        });
    };

    // Quick Category Image Upload Handler
    const handleQuickCategoryImageUpload = async (catId, file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`${API_BASE_URL}/admin/products/upload-image`, {
                method: "POST",
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                const cat = categories.find((c) => c.id === catId);
                if (cat) {
                    await fetch(`${API_BASE_URL}/admin/categories/${catId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            name: cat.name,
                            description: cat.description,
                            imageUrl: data.imageUrl
                        })
                    });
                    Swal.fire({ icon: "success", title: "Category Image Updated", timer: 1200, showConfirmButton: false });
                    loadData();
                }
            }
        } catch (err) {
            Swal.fire("Error", "Failed to upload category image", "error");
        }
    };

    // Modal Category Image File Upload
    const handleCategoryImageUploadInModal = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`${API_BASE_URL}/admin/products/upload-image`, {
                method: "POST",
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setCategoryForm((prev) => ({ ...prev, imageUrl: data.imageUrl }));
                Swal.fire({ icon: "success", title: "Image Uploaded", timer: 1200, showConfirmButton: false });
            }
        } catch (err) {
            Swal.fire("Error", "Image upload failed", "error");
        }
    };

    // Category Save & Edit Actions
    const handleSaveCategory = async (e) => {
        e.preventDefault();
        const url = editingCategoryId
            ? `${API_BASE_URL}/admin/categories/${editingCategoryId}`
            : `${API_BASE_URL}/admin/categories`;
        const method = editingCategoryId ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(categoryForm)
            });
            if (res.ok) {
                Swal.fire({ icon: "success", title: editingCategoryId ? "Category Updated" : "Category Created", timer: 1500, showConfirmButton: false });
                setShowCategoryModal(false);
                setEditingCategoryId(null);
                setCategoryForm({ name: "", description: "", imageUrl: "" });
                loadData();
            }
        } catch (err) {
            Swal.fire("Error", "Failed to save category", "error");
        }
    };

    const handleEditCategory = (cat) => {
        setEditingCategoryId(cat.id);
        setCategoryForm({
            name: cat.name || "",
            description: cat.description || "",
            imageUrl: cat.imageUrl || ""
        });
        setShowCategoryModal(true);
    };

    const handleDeleteCategory = async (id) => {
        const result = await Swal.fire({
            title: "Delete Category?",
            text: "Are you sure you want to delete this category?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete"
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`${API_BASE_URL}/admin/categories/${id}`, { method: "DELETE" });
                if (res.ok) {
                    Swal.fire("Deleted!", "Category has been removed.", "success");
                    loadData();
                }
            } catch (err) {
                Swal.fire("Error", "Failed to delete category.", "error");
            }
        }
    };

    // Order Status Update
    const handleOrderStatusChange = async (orderId, newStatus) => {
        try {
            const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status?status=${newStatus}`, {
                method: "PUT"
            });
            if (res.ok) {
                Swal.fire({ icon: "success", title: "Order Status Updated", timer: 1500, showConfirmButton: false });
                loadData();
            }
        } catch (err) {
            Swal.fire("Error", "Failed to update order status", "error");
        }
    };

    // Order Tracking Update
    const handleOrderTrackingUpdate = async (orderId, courierName, trackingNumber) => {
        try {
            const params = new URLSearchParams();
            if (courierName) params.append("courierName", courierName);
            if (trackingNumber) params.append("trackingNumber", trackingNumber);
            const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/tracking?${params.toString()}`, {
                method: "PUT"
            });
            if (res.ok) {
                Swal.fire({ icon: "success", title: "Logistics & Tracking Updated", timer: 1500, showConfirmButton: false });
                loadData();
            }
        } catch (err) {
            Swal.fire("Error", "Failed to update tracking info", "error");
        }
    };

    if (loading) return <div className="text-center my-5 fs-4">Loading Admin Dashboard...</div>;

    const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

    return (
        <div className="d-flex min-vh-100 bg-light">
            {/* Left Sidebar */}
            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                selectedAssetGroup={selectedAssetGroup}
                setSelectedAssetGroup={setSelectedAssetGroup}
                assetGroups={assetGroups}
                onLogout={handleLogout}
            />

            {/* Main Content Area */}
            <div className="flex-grow-1 p-4" style={{ overflowY: "auto" }}>

                {/* OVERVIEW SECTION */}
                {activeTab === "overview" && (
                    <div>
                        <h3 className="fw-bold text-success mb-4">📊 Dashboard Overview</h3>
                        <div className="row g-4 mb-4">
                            <div className="col-md-3">
                                <div className="card shadow-sm border-0 bg-success text-white p-3">
                                    <div className="small text-white-50 font-monospace">TOTAL REVENUE</div>
                                    <h2 className="fw-bold m-0 mt-2">₹{totalRevenue.toFixed(2)}</h2>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card shadow-sm border-0 bg-dark text-white p-3">
                                    <div className="small text-white-50 font-monospace">PRODUCTS IN STORE</div>
                                    <h2 className="fw-bold m-0 mt-2">{products.length}</h2>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card shadow-sm border-0 bg-primary text-white p-3">
                                    <div className="small text-white-50 font-monospace">CATEGORIES</div>
                                    <h2 className="fw-bold m-0 mt-2">{categories.length}</h2>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card shadow-sm border-0 bg-warning text-dark p-3">
                                    <div className="small text-dark-50 font-monospace">TOTAL ORDERS</div>
                                    <h2 className="fw-bold m-0 mt-2">{orders.length}</h2>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow-sm border-0 p-4">
                            <h5 className="fw-bold mb-3">Quick Management Links</h5>
                            <div className="d-flex gap-3">
                                <button className="btn btn-success" onClick={() => setActiveTab("products")}>Manage Products</button>
                                <button className="btn btn-outline-success" onClick={() => setActiveTab("assets")}>Manage Site Assets & Logos</button>
                                <button className="btn btn-outline-success" onClick={() => setActiveTab("blogs")}>Manage Blog Articles</button>
                                <button className="btn btn-outline-primary" onClick={() => setActiveTab("orders")}>Process Customer Orders</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* BLOGS SECTION */}
                {activeTab === "blogs" && <AdminBlog />}

                {/* CUSTOMERS SECTION */}
                {activeTab === "customers" && <AdminCustomers />}

                {/* TESTIMONIALS SECTION */}
                {activeTab === "testimonials" && <AdminTestimonials />}

                {/* PRODUCTS SECTION */}
                {activeTab === "products" && (
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3 className="fw-bold text-success m-0">📦 Product Catalog CRUD</h3>
                            <button
                                className="btn btn-success fw-bold"
                                onClick={() => {
                                    resetProductForm();
                                    setShowProductModal(true);
                                }}
                            >
                                + Add New Organic Product
                            </button>
                        </div>

                        <div className="table-responsive shadow-sm rounded">
                            <table className="table table-hover align-middle bg-white m-0">
                                <thead className="table-success">
                                    <tr>
                                        <th>Image</th>
                                        <th>Product Name</th>
                                        <th>Category</th>
                                        <th>Variant / Price</th>
                                        <th>Status</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((p) => {
                                        const defaultVar = p.variants?.[0] || {};
                                        const imgUrl = getImageUrl(p.imageUrl);

                                        return (
                                            <tr key={p.id}>
                                                <td>
                                                    <div className="d-flex flex-column align-items-center">
                                                        <img src={imgUrl} alt={p.name} style={{ width: "55px", height: "55px", objectFit: "cover" }} className="rounded border mb-1" />
                                                        <label className="btn btn-sm btn-link p-0 text-decoration-none small text-success" style={{ fontSize: "11px" }}>
                                                            Change Photo
                                                            <input type="file" accept="image/*" className="d-none" onChange={(e) => handleQuickImageUpload(p.id, e.target.files[0])} />
                                                        </label>
                                                    </div>
                                                </td>
                                                <td className="fw-bold">{p.name}</td>
                                                <td>{p.category?.name || "Unassigned"}</td>
                                                <td>
                                                    <span className="badge bg-light text-dark border">
                                                        {defaultVar.variantName || "Standard"}: ₹{defaultVar.discountPrice || defaultVar.price || 0}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${p.active ? "bg-success" : "bg-secondary"}`}>
                                                        {p.active ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="text-end">
                                                    <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleEditProduct(p)}>
                                                        Edit
                                                    </button>
                                                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteProduct(p.id)}>
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* CATEGORIES SECTION */}
                {activeTab === "categories" && (
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3 className="fw-bold text-success m-0">🗂️ Category Management</h3>
                            <button className="btn btn-success fw-bold" onClick={() => { setEditingCategoryId(null); setCategoryForm({ name: "", description: "", imageUrl: "" }); setShowCategoryModal(true); }}>
                                + Add New Category
                            </button>
                        </div>

                        <div className="row g-3">
                            {categories.map((c) => {
                                const catImgUrl = c.imageUrl ? getImageUrl(c.imageUrl) : null;
                                return (
                                    <div key={c.id} className="col-md-4">
                                        <div className="card shadow-sm border-0 h-100">
                                            {catImgUrl && (
                                                <div className="text-center bg-light p-2 border-bottom" style={{ height: "130px", overflow: "hidden" }}>
                                                    <img src={catImgUrl} alt={c.name} style={{ maxHeight: "115px", maxWidth: "100%", objectFit: "contain" }} className="rounded" />
                                                </div>
                                            )}
                                            <div className="card-body d-flex flex-column justify-content-between">
                                                <div>
                                                    <h5 className="fw-bold text-success mb-1">{c.name}</h5>
                                                    <p className="text-muted small mb-3">{c.description || "No description provided."}</p>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                                                    <label className="btn btn-sm btn-outline-secondary p-1 small text-decoration-none" style={{ fontSize: "11px" }}>
                                                        🖼️ Image
                                                        <input type="file" accept="image/*" className="d-none" onChange={(e) => handleQuickCategoryImageUpload(c.id, e.target.files[0])} />
                                                    </label>
                                                    <div className="d-flex gap-1">
                                                        <button className="btn btn-outline-primary btn-sm" onClick={() => handleEditCategory(c)}>
                                                            ✏️ Edit
                                                        </button>
                                                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteCategory(c.id)}>
                                                            🗑️ Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* SITE ASSETS MANAGER SECTION */}
                {activeTab === "assets" && (
                    <AdminSiteAssets
                        selectedAssetGroup={selectedAssetGroup}
                        onSettingsLoaded={(uniqueGroups) => {
                            if (uniqueGroups && uniqueGroups.length > 0) {
                                setAssetGroups((prev) => Array.from(new Set([...prev, ...uniqueGroups])));
                            }
                        }}
                    />
                )}

                {/* ORDERS SECTION */}
                {activeTab === "orders" && (
                    <div>
                        <h3 className="fw-bold text-success mb-3">🚚 Customer Order Processing</h3>
                        <div className="table-responsive shadow-sm rounded">
                            <table className="table table-hover align-middle bg-white m-0">
                                <thead className="table-success">
                                    <tr>
                                        <th>Order #</th>
                                        <th>Customer</th>
                                        <th>Items</th>
                                        <th>Logistics & Tracking</th>
                                        <th>Total Amount</th>
                                        <th>Payment</th>
                                        <th>Status</th>
                                        <th>Update Status</th>
                                        <th className="text-center">Full Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((o) => (
                                        <tr key={o.id}>
                                            <td className="fw-bold text-success">{o.orderNumber}</td>
                                            <td>
                                                <div className="fw-bold">{o.customerName}</div>
                                                <div className="small text-muted">{o.customerPhone} | {o.customerEmail}</div>
                                                <div className="small text-secondary">{o.shippingAddress?.streetAddress}, {o.shippingAddress?.city}</div>
                                            </td>
                                            <td>
                                                {o.items?.map((item, idx) => (
                                                    <div key={idx} className="small">
                                                        • {item.productName} ({item.variantName}) x{item.quantity} = ₹{item.totalPrice}
                                                    </div>
                                                ))}
                                            </td>
                                            <td>
                                                {o.courierName ? (
                                                    <div>
                                                        <span className="badge bg-success-subtle text-success border border-success mb-1">
                                                            📦 {o.courierName}
                                                        </span>
                                                        {o.trackingNumber && (
                                                            <div className="small font-monospace text-dark fw-bold">
                                                                AWB: {o.trackingNumber}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted small">Not assigned</span>
                                                )}
                                            </td>
                                            <td className="fw-bold fs-6">₹{o.totalAmount}</td>
                                            <td><span className="badge bg-info text-dark">{o.paymentMethod}</span></td>
                                            <td>
                                                <span className={`badge ${o.orderStatus === 'DELIVERED' ? 'bg-success' : 'bg-primary'}`}>
                                                    {o.orderStatus}
                                                </span>
                                            </td>
                                            <td>
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={o.orderStatus}
                                                    onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                                                >
                                                    <option value="CONFIRMED">CONFIRMED</option>
                                                    <option value="PROCESSING">PROCESSING</option>
                                                    <option value="SHIPPED">SHIPPED</option>
                                                    <option value="DELIVERED">DELIVERED</option>
                                                    <option value="CANCELLED">CANCELLED</option>
                                                </select>
                                            </td>
                                            <td className="text-center">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-success rounded-pill px-3 fw-bold d-inline-flex align-items-center gap-1 shadow-sm"
                                                    onClick={() => setSelectedOrderModal(o)}
                                                >
                                                    👁️ View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* MODAL: VIEW ORDER & CUSTOMER FULL DETAILS */}
                {selectedOrderModal && (
                    <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1" style={{ zIndex: 1055 }}>
                        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                                <div className="modal-header bg-success text-white py-3 px-4">
                                    <div>
                                        <h5 className="modal-title fw-bold mb-0 text-white d-flex align-items-center gap-2">
                                            📄 Order Details: <span className="font-monospace text-warning">{selectedOrderModal.orderNumber}</span>
                                        </h5>
                                        <small className="opacity-75">
                                            Placed on: {selectedOrderModal.createdAt ? new Date(selectedOrderModal.createdAt).toLocaleString("en-IN") : "N/A"}
                                        </small>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        onClick={() => setSelectedOrderModal(null)}
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body p-4 bg-light">
                                    {/* Order Status & Payment Banner */}
                                    <div className="card border-0 shadow-sm mb-4 bg-white rounded-3">
                                        <div className="card-body d-flex flex-wrap align-items-center justify-content-between gap-3 py-3">
                                            <div>
                                                <span className="text-muted small d-block">Order Status</span>
                                                <span className={`badge fs-6 ${selectedOrderModal.orderStatus === 'DELIVERED' ? 'bg-success' : 'bg-primary'}`}>
                                                    {selectedOrderModal.orderStatus}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-muted small d-block">Payment Method</span>
                                                <span className="badge bg-info text-dark fs-6">{selectedOrderModal.paymentMethod}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted small d-block">Total Amount</span>
                                                <span className="fw-bold fs-4 text-success">₹{selectedOrderModal.totalAmount}</span>
                                            </div>
                                            <div>
                                                <label className="form-label small fw-bold text-muted mb-1">Update Status</label>
                                                <select
                                                    className="form-select form-select-sm fw-bold border-success"
                                                    value={selectedOrderModal.orderStatus}
                                                    onChange={(e) => {
                                                        handleOrderStatusChange(selectedOrderModal.id, e.target.value);
                                                        setSelectedOrderModal({ ...selectedOrderModal, orderStatus: e.target.value });
                                                    }}
                                                >
                                                    <option value="CONFIRMED">CONFIRMED</option>
                                                    <option value="PROCESSING">PROCESSING</option>
                                                    <option value="SHIPPED">SHIPPED</option>
                                                    <option value="DELIVERED">DELIVERED</option>
                                                    <option value="CANCELLED">CANCELLED</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Logistics & Shipment Tracking */}
                                    <div className="card border-0 shadow-sm mb-4 bg-white rounded-3">
                                        <div className="card-header bg-white border-0 fw-bold text-success fs-6 py-3 border-bottom d-flex align-items-center justify-content-between">
                                            <span>🚚 Logistics & Shipment Tracking</span>
                                            {selectedOrderModal.courierName && (
                                                <span className="badge bg-success-subtle text-success border border-success">
                                                    {selectedOrderModal.courierName}
                                                </span>
                                            )}
                                        </div>
                                        <div className="card-body">
                                            <div className="row g-3 align-items-end">
                                                <div className="col-md-5">
                                                    <label className="form-label small fw-bold text-secondary mb-1">Logistics / Courier Partner</label>
                                                    <select
                                                        className="form-select border-success"
                                                        value={selectedOrderModal.courierName || ""}
                                                        onChange={(e) => setSelectedOrderModal({ ...selectedOrderModal, courierName: e.target.value })}
                                                    >
                                                        <option value="">Select Logistics Partner</option>
                                                        <option value="Amazon Shipping">Amazon Shipping</option>
                                                        <option value="Xpressbees Courier">Xpressbees Courier</option>
                                                        <option value="Delhivery Express">Delhivery Express</option>
                                                        <option value="DTDC Express">DTDC Express</option>
                                                        <option value="India Post">India Post</option>
                                                        <option value="Blue Dart">Blue Dart</option>
                                                        <option value="Other Courier">Other Courier</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-5">
                                                    <label className="form-label small fw-bold text-secondary mb-1">AWB / Tracking Number</label>
                                                    <input
                                                        type="text"
                                                        className="form-control border-success"
                                                        placeholder="e.g. SF123456789IN / 14002938102"
                                                        value={selectedOrderModal.trackingNumber || ""}
                                                        onChange={(e) => setSelectedOrderModal({ ...selectedOrderModal, trackingNumber: e.target.value })}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-success w-100 fw-bold shadow-sm"
                                                        onClick={() => handleOrderTrackingUpdate(selectedOrderModal.id, selectedOrderModal.courierName, selectedOrderModal.trackingNumber)}
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Customer Profile Information */}
                                    <div className="card border-0 shadow-sm mb-4 bg-white rounded-3">
                                        <div className="card-header bg-white border-0 fw-bold text-success fs-6 py-3">
                                            👤 Customer Profile Details
                                        </div>
                                        <div className="card-body pt-0">
                                            <div className="row g-3">
                                                <div className="col-md-4">
                                                    <span className="text-muted small d-block">Customer Name</span>
                                                    <strong className="text-dark fs-6">{selectedOrderModal.customerName}</strong>
                                                </div>
                                                <div className="col-md-4">
                                                    <span className="text-muted small d-block">Mobile Phone</span>
                                                    <strong className="text-dark">📞 {selectedOrderModal.customerPhone}</strong>
                                                </div>
                                                <div className="col-md-4">
                                                    <span className="text-muted small d-block">Email Address</span>
                                                    <strong className="text-dark">✉️ {selectedOrderModal.customerEmail || "N/A"}</strong>
                                                </div>
                                                {selectedOrderModal.gstin && (
                                                    <div className="col-md-12 mt-2">
                                                        <span className="text-muted small d-block">GSTIN Number</span>
                                                        <span className="font-monospace fw-bold text-dark bg-light px-2.5 py-1 border rounded d-inline-block">
                                                            🏢 {selectedOrderModal.gstin}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Addresses (Shipping & Billing) */}
                                    <div className="row g-3 mb-4">
                                        {/* Shipping Address */}
                                        <div className="col-md-6">
                                            <div className="card border-0 shadow-sm bg-white rounded-3 h-100">
                                                <div className="card-header bg-white border-0 fw-bold text-success fs-6 py-3">
                                                    🚚 Shipping Address
                                                </div>
                                                <div className="card-body pt-0 small">
                                                    {selectedOrderModal.shippingAddress ? (
                                                        <div>
                                                            <div className="fw-bold text-dark fs-6 mb-1">{selectedOrderModal.shippingAddress.fullName || selectedOrderModal.customerName}</div>
                                                            <div className="text-secondary mb-1">{selectedOrderModal.shippingAddress.streetAddress}</div>
                                                            <div className="text-secondary mb-1">{selectedOrderModal.shippingAddress.city}, {selectedOrderModal.shippingAddress.state} - {selectedOrderModal.shippingAddress.pincode}</div>
                                                            <div className="text-muted">📞 {selectedOrderModal.shippingAddress.phone || selectedOrderModal.customerPhone}</div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted">No shipping address recorded.</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Billing Address */}
                                        <div className="col-md-6">
                                            <div className="card border-0 shadow-sm bg-white rounded-3 h-100">
                                                <div className="card-header bg-white border-0 fw-bold text-success fs-6 py-3">
                                                    💳 Billing Address
                                                </div>
                                                <div className="card-body pt-0 small">
                                                    {selectedOrderModal.billingAddress ? (
                                                        <div>
                                                            <div className="fw-bold text-dark fs-6 mb-1">{selectedOrderModal.billingAddress.fullName || selectedOrderModal.customerName}</div>
                                                            <div className="text-secondary mb-1">{selectedOrderModal.billingAddress.streetAddress}</div>
                                                            <div className="text-secondary mb-1">{selectedOrderModal.billingAddress.city}, {selectedOrderModal.billingAddress.state} - {selectedOrderModal.billingAddress.pincode}</div>
                                                            <div className="text-muted">📞 {selectedOrderModal.billingAddress.phone || selectedOrderModal.customerPhone}</div>
                                                        </div>
                                                    ) : (
                                                        selectedOrderModal.shippingAddress ? (
                                                            <div>
                                                                <div className="fw-bold text-dark fs-6 mb-1">{selectedOrderModal.shippingAddress.fullName || selectedOrderModal.customerName}</div>
                                                                <div className="text-secondary mb-1">{selectedOrderModal.shippingAddress.streetAddress}</div>
                                                                <div className="text-secondary mb-1">{selectedOrderModal.shippingAddress.city}, {selectedOrderModal.shippingAddress.state} - {selectedOrderModal.shippingAddress.pincode}</div>
                                                                <div className="text-muted">📞 {selectedOrderModal.shippingAddress.phone || selectedOrderModal.customerPhone}</div>
                                                                <span className="badge bg-light text-muted mt-2">(Same as Shipping Address)</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted">No billing address recorded.</span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items Table */}
                                    <div className="card border-0 shadow-sm bg-white rounded-3">
                                        <div className="card-header bg-white border-0 fw-bold text-success fs-6 py-3">
                                            🌾 Ordered Products Breakdown
                                        </div>
                                        <div className="card-body pt-0 p-0">
                                            <div className="table-responsive">
                                                <table className="table align-middle m-0">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th>Product Name</th>
                                                            <th>Variant</th>
                                                            <th>Unit Price</th>
                                                            <th>Qty</th>
                                                            <th className="text-end">Line Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {selectedOrderModal.items?.map((item, idx) => (
                                                            <tr key={idx}>
                                                                <td className="fw-bold text-dark">{item.productName}</td>
                                                                <td><span className="badge bg-light text-dark border">{item.variantName}</span></td>
                                                                <td>₹{item.unitPrice}</td>
                                                                <td className="fw-bold">x{item.quantity}</td>
                                                                <td className="text-end fw-bold text-success">₹{item.totalPrice}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                    <tfoot className="table-light">
                                                        <tr>
                                                            <td colSpan="4" className="text-end fw-bold">Grand Total:</td>
                                                            <td className="text-end fw-bold text-success fs-5">₹{selectedOrderModal.totalAmount}</td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer bg-light border-0 py-3 px-4">
                                    <button type="button" className="btn btn-secondary rounded-pill px-4 fw-bold" onClick={() => setSelectedOrderModal(null)}>
                                        Close Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL: ADD / EDIT PRODUCT */}
            {showProductModal && (
                <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title fw-bold">
                                    {editingProductId ? "Edit Organic Product" : "Add New Organic Product"}
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowProductModal(false)}></button>
                            </div>
                            <form onSubmit={handleSaveProduct}>
                                <div className="modal-body">
                                    <div className="row g-3">
                                        <div className="col-md-8">
                                            <label className="form-label fw-bold">Product Name</label>
                                            <input type="text" className="form-control" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fw-bold">Category</label>
                                            <select className="form-select" value={productForm.categoryId} onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })} required>
                                                <option value="">Select Category</option>
                                                {categories.map((c) => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Variant Size / Volume</label>
                                            <input type="text" className="form-control" placeholder="e.g. 500 ml, 1 Liter, 1 kg" value={productForm.variantName} onChange={(e) => setProductForm({ ...productForm, variantName: e.target.value })} required />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label fw-bold">Price (₹)</label>
                                            <input type="number" step="0.01" className="form-control" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label fw-bold">Discount Price (₹)</label>
                                            <input type="number" step="0.01" className="form-control" value={productForm.discountPrice} onChange={(e) => setProductForm({ ...productForm, discountPrice: e.target.value })} />
                                        </div>
                                        {/* Multi-Image Upload (<= 1MB per image) */}
                                        <div className="col-12">
                                            <label className="form-label fw-bold">
                                                Upload Product Images <small className="text-muted fw-normal">(Max 1 MB per image)</small>
                                            </label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                accept="image/*"
                                                multiple
                                                onChange={handleMultiImageUpload}
                                            />
                                            {uploadingImage && <div className="small text-primary mt-1">Uploading image(s)...</div>}

                                            {/* Thumbnails preview */}
                                            {((productForm.imageUrls && productForm.imageUrls.length > 0) || productForm.imageUrl) && (
                                                <div className="d-flex flex-wrap gap-2 mt-2 align-items-center">
                                                    {((productForm.imageUrls && productForm.imageUrls.length > 0) ? productForm.imageUrls : [productForm.imageUrl]).map((url, idx) => {
                                                        if (!url) return null;
                                                        const isPrimary = (productForm.imageUrl === url) || (!productForm.imageUrl && idx === 0);
                                                        return (
                                                            <div key={idx} className="position-relative border rounded p-1 text-center bg-light" style={{ width: "90px" }}>
                                                                <img
                                                                    src={getImageUrl(url)}
                                                                    alt={`Preview ${idx + 1}`}
                                                                    style={{ width: "100%", height: "65px", objectFit: "cover" }}
                                                                    className="rounded"
                                                                />
                                                                {isPrimary ? (
                                                                    <span className="badge bg-success position-absolute top-0 start-0 m-1">Main</span>
                                                                ) : (
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-xs btn-outline-primary position-absolute top-0 start-0 m-1 p-0 px-1"
                                                                        style={{ fontSize: "10px" }}
                                                                        onClick={() => handleSetPrimaryImage(url)}
                                                                    >
                                                                        Set Main
                                                                    </button>
                                                                )}
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 py-0 px-1 rounded-circle"
                                                                    style={{ fontSize: "12px", lineHeight: "1" }}
                                                                    onClick={() => handleRemoveImage(idx)}
                                                                    title="Remove image"
                                                                >
                                                                    &times;
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        {/* Video Upload (<= 10MB per video) */}
                                        <div className="col-12">
                                            <label className="form-label fw-bold">
                                                Upload Product Video <small className="text-muted fw-normal">(Optional, Max 10 MB)</small>
                                            </label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                accept="video/*"
                                                onChange={handleVideoUpload}
                                            />
                                            {uploadingVideo && <div className="small text-primary mt-1">Uploading video...</div>}

                                            {productForm.videoUrl && (
                                                <div className="mt-2 d-flex align-items-center gap-2 p-2 border rounded bg-light">
                                                    <span className="badge bg-info text-dark">Video Attached</span>
                                                    <span className="small text-truncate" style={{ maxWidth: "300px" }}>{productForm.videoUrl}</span>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger btn-sm py-0 px-2 ms-auto"
                                                        onClick={handleRemoveVideo}
                                                    >
                                                        Remove Video
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label fw-bold">Short Description</label>
                                            <input type="text" className="form-control" value={productForm.shortDescription} onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })} />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label fw-bold">Health Benefits</label>
                                            <textarea className="form-control" rows="2" value={productForm.benefits} onChange={(e) => setProductForm({ ...productForm, benefits: e.target.value })}></textarea>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-check mt-2">
                                                <input className="form-check-input" type="checkbox" checked={productForm.featured} onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })} id="featCheck" />
                                                <label className="form-check-label fw-bold" htmlFor="featCheck">Mark as Featured Product</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowProductModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-success fw-bold">Save Product</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: ADD / EDIT CATEGORY */}
            {showCategoryModal && (
                <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title fw-bold">
                                    {editingCategoryId ? "Edit Organic Category" : "Add Organic Category"}
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => { setShowCategoryModal(false); setEditingCategoryId(null); }}></button>
                            </div>
                            <form onSubmit={handleSaveCategory}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Category Name</label>
                                        <input type="text" className="form-control" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Description</label>
                                        <textarea className="form-control" rows="2" value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Upload Category Image</label>
                                        <input type="file" className="form-control" accept="image/*" onChange={handleCategoryImageUploadInModal} />
                                        {categoryForm.imageUrl && <div className="small text-success mt-1">Selected Image: {categoryForm.imageUrl}</div>}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => { setShowCategoryModal(false); setEditingCategoryId(null); }}>Cancel</button>
                                    <button type="submit" className="btn btn-success fw-bold">Save Category</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
