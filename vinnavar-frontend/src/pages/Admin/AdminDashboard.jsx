import { API_BASE_URL, getImageUrl } from "../../services/api";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AdminSidebar from "./AdminSidebar";
import AdminSiteAssets from "./AdminSiteAssets";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");

    // Data States
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Product Modal / Form State
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [productForm, setProductForm] = useState({
        name: "",
        slug: "",
        categoryId: "",
        shortDescription: "",
        fullDescription: "",
        benefits: "",
        imageUrl: "",
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
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("vinnavar_admin_token");
        localStorage.removeItem("vinnavar_admin_user");
        navigate("/admin/login");
    };

    // Product Image Upload Handler
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setUploadingImage(true);
        try {
            const res = await fetch(`${API_BASE_URL}/admin/products/upload-image`, {
                method: "POST",
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setProductForm((prev) => ({ ...prev, imageUrl: data.imageUrl }));
                Swal.fire({ icon: "success", title: "Image Uploaded", timer: 1200, showConfirmButton: false });
            } else {
                Swal.fire({ icon: "error", title: "Upload Failed" });
            }
        } catch (err) {
            Swal.fire({ icon: "error", title: "Upload Error" });
        } finally {
            setUploadingImage(false);
        }
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

        const payload = {
            name: productForm.name,
            slug: productForm.slug,
            categoryId: productForm.categoryId ? parseInt(productForm.categoryId) : null,
            shortDescription: productForm.shortDescription,
            fullDescription: productForm.fullDescription,
            benefits: productForm.benefits,
            imageUrl: productForm.imageUrl,
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
        setProductForm({
            name: prod.name || "",
            slug: prod.slug || "",
            categoryId: prod.category?.id || "",
            shortDescription: prod.shortDescription || "",
            fullDescription: prod.fullDescription || "",
            benefits: prod.benefits || "",
            imageUrl: prod.imageUrl || "",
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

    if (loading) return <div className="text-center my-5 fs-4">Loading Admin Dashboard...</div>;

    const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

    return (
        <div className="d-flex min-vh-100 bg-light">
            {/* Left Sidebar */}
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

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
                                <button className="btn btn-outline-primary" onClick={() => setActiveTab("orders")}>Process Customer Orders</button>
                            </div>
                        </div>
                    </div>
                )}

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
                                        <th>Featured</th>
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
                                                <td>{p.featured ? <span className="badge bg-warning text-dark">Featured</span> : "No"}</td>
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
                {activeTab === "assets" && <AdminSiteAssets />}

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
                                        <th>Total Amount</th>
                                        <th>Payment</th>
                                        <th>Status</th>
                                        <th>Update Status</th>
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                                        <div className="col-12">
                                            <label className="form-label fw-bold">Upload Product Image</label>
                                            <input type="file" className="form-control" accept="image/*" onChange={handleImageUpload} />
                                            {uploadingImage && <div className="small text-primary mt-1">Uploading image...</div>}
                                            {productForm.imageUrl && <div className="small text-success mt-1">Image URL: {productForm.imageUrl}</div>}
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
