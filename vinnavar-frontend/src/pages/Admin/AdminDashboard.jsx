import { API_BASE_URL, getImageUrl } from "../../services/api";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import AdminSidebar from "./AdminSidebar";
import AdminSiteAssets from "./AdminSiteAssets";
import AdminBlog from "./AdminBlog";
import AdminCustomers from "./AdminCustomers";
import AdminTestimonials from "./AdminTestimonials";
import AdminComplaints from "./AdminComplaints";
import AdminShippingRates from "./AdminShippingRates";
import AdminReviews from "./AdminReviews";

const getOrderStatusBadge = (status) => {
    switch (status) {
        case "PENDING":
            return <span className="badge bg-warning text-dark fw-bold px-2 py-1 shadow-sm">⏳ PENDING</span>;
        case "CONFIRMED":
            return <span className="badge bg-primary text-white fw-bold px-2 py-1 shadow-sm">✅ CONFIRMED</span>;
        case "PROCESSING":
            return <span className="badge bg-info text-dark fw-bold px-2 py-1 shadow-sm">⚙️ PROCESSING</span>;
        case "SHIPPED":
            return <span className="badge text-white fw-bold px-2 py-1 shadow-sm" style={{ backgroundColor: "#8b5cf6" }}>🚚 SHIPPED</span>;
        case "OUT_FOR_DELIVERY":
            return <span className="badge text-white fw-bold px-2 py-1 shadow-sm" style={{ backgroundColor: "#f97316" }}>🛵 OUT FOR DELIVERY</span>;
        case "DELIVERED":
            return <span className="badge bg-success text-white fw-bold px-2 py-1 shadow-sm">🎉 DELIVERED</span>;
        case "CANCELLED":
        case "FAILED":
            return <span className="badge bg-danger text-white fw-bold px-2 py-1 shadow-sm">❌ CANCELLED</span>;
        default:
            return <span className="badge bg-secondary text-white fw-bold px-2 py-1 shadow-sm">{status}</span>;
    }
};

const getPaymentBadge = (method) => {
    switch (method) {
        case "ONLINE":
        case "CARD":
        case "NETBANKING":
            return <span className="badge bg-primary text-white font-monospace px-2 py-1 shadow-sm">💳 ONLINE</span>;
        case "COD":
            return <span className="badge bg-warning text-dark font-monospace px-2 py-1 shadow-sm">💵 COD</span>;
        case "UPI":
            return <span className="badge bg-success text-white font-monospace px-2 py-1 shadow-sm">📱 UPI</span>;
        default:
            return <span className="badge bg-secondary text-white font-monospace px-2 py-1 shadow-sm">{method || "ONLINE"}</span>;
    }
};

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
    const [editOrderModal, setEditOrderModal] = useState(null);
    const [editOrderForm, setEditOrderForm] = useState({
        orderStatus: "CONFIRMED",
        paymentMethod: "COD",
        paymentStatus: "PENDING",
        courierName: "",
        trackingNumber: "",
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        totalAmount: "",
        shippingFee: "",
        streetAddress: "",
        city: "",
        state: "",
        pincode: "",
        gstin: ""
    });
    const [shippingFeeInputs, setShippingFeeInputs] = useState({});

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
        variants: [
            { variantName: "500g", price: "", discountPrice: "" },
            { variantName: "2kg", price: "", discountPrice: "" },
            { variantName: "5kg", price: "", discountPrice: "" }
        ]
    });

    // Category Form & View State
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [categoryForm, setCategoryForm] = useState({ name: "", description: "", imageUrl: "" });
    const [categoryViewMode, setCategoryViewMode] = useState("list");
    const [categoryCurrentPage, setCategoryCurrentPage] = useState(1);

    // Offers & Discounts View State
    const [offerViewMode, setOfferViewMode] = useState("card");
    const [offerFilter, setOfferFilter] = useState("on_offer");
    const [offerSearch, setOfferSearch] = useState("");
    const [offerCurrentPage, setOfferCurrentPage] = useState(1);

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

    // Quick Discount Update Handler for Offers & Discounts Tab
    const handleQuickDiscountUpdate = async (product) => {
        const defaultVar = product.variants?.[0] || {};
        const currentDiscount = defaultVar.discountPrice || "";
        const currentPrice = defaultVar.price || 0;

        const { value: formValues } = await Swal.fire({
            title: `Set Offer Price for "${product.name}"`,
            html: `
                <div className="text-start mb-3">
                    <label className="form-label fw-bold">Original Price (₹):</label>
                    <input id="swal-price" type="number" class="form-control" value="${currentPrice}" readonly disabled />
                </div>
                <div className="text-start mb-2">
                    <label className="form-label fw-bold">Discount / Offer Price (₹):</label>
                    <input id="swal-discount" type="number" step="0.01" class="form-control" placeholder="Enter discount price or leave empty to clear offer" value="${currentDiscount}" />
                    <small className="text-muted">Must be less than original price ₹${currentPrice}</small>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Save Offer Price",
            confirmButtonColor: "#198754",
            preConfirm: () => {
                const discountInput = document.getElementById("swal-discount").value;
                if (discountInput !== "" && parseFloat(discountInput) >= currentPrice) {
                    Swal.showValidationMessage(`Offer price must be less than regular price (₹${currentPrice})`);
                    return false;
                }
                return discountInput;
            }
        });

        if (formValues !== undefined) {
            const newDiscount = formValues !== "" && parseFloat(formValues) > 0 ? parseFloat(formValues) : null;
            const updatedVariants = (product.variants && product.variants.length > 0)
                ? product.variants.map((v, idx) => idx === 0 ? { ...v, discountPrice: newDiscount } : v)
                : [{ variantName: "Standard", price: currentPrice, discountPrice: newDiscount, isDefault: true }];

            const payload = {
                name: product.name,
                slug: product.slug,
                categoryId: product.category?.id || null,
                shortDescription: product.shortDescription,
                fullDescription: product.fullDescription,
                benefits: product.benefits,
                imageUrl: product.imageUrl,
                imageUrls: product.imageUrls || [],
                videoUrl: product.videoUrl || "",
                featured: product.featured,
                active: product.active,
                variants: updatedVariants
            };

            try {
                const res = await fetch(`${API_BASE_URL}/admin/products/${product.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    Swal.fire({ icon: "success", title: "Offer Price Updated!", timer: 1200, showConfirmButton: false });
                    loadData();
                } else {
                    Swal.fire({ icon: "error", title: "Update Failed", text: "Could not update offer price." });
                }
            } catch (err) {
                Swal.fire({ icon: "error", title: "Server Error", text: "Could not connect to backend server." });
            }
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
            variants: (productForm.variants || [])
                .map((v, idx) => ({
                    variantName: v.variantName?.trim() || "",
                    price: v.price ? parseFloat(v.price) : null,
                    discountPrice: v.discountPrice ? parseFloat(v.discountPrice) : null,
                    isDefault: idx === 0
                }))
                .filter((v, idx) => idx === 0 || (v.variantName !== "" || v.price !== null))
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
                const errData = await res.json().catch(() => ({}));
                Swal.fire({ icon: "error", title: "Save Failed", text: errData.message || errData.error || "Failed to save product" });
            }
        } catch (err) {
            Swal.fire({ icon: "error", title: "Server Error", text: err.message || "Could not connect to backend server" });
        }
    };

    const handleEditProduct = (prod) => {
        setEditingProductId(prod.id);
        const initialImages = (Array.isArray(prod.imageUrls) && prod.imageUrls.length > 0)
            ? prod.imageUrls
            : (prod.imageUrl ? [prod.imageUrl] : []);

        const rawVariants = Array.isArray(prod.variants) && prod.variants.length > 0
            ? prod.variants.map((v) => ({
                variantName: v.variantName || "",
                price: v.price != null ? v.price.toString() : "",
                discountPrice: v.discountPrice != null ? v.discountPrice.toString() : ""
            }))
            : [];

        const defaultNames = ["500g", "2kg", "5kg"];
        while (rawVariants.length < 3) {
            const existingNames = rawVariants.map((v) => (v.variantName || "").toLowerCase().replace(/\s+/g, ""));
            const unusedDefault = defaultNames.find((d) => !existingNames.includes(d.toLowerCase().replace(/\s+/g, ""))) || defaultNames[rawVariants.length] || "";
            rawVariants.push({
                variantName: unusedDefault,
                price: "",
                discountPrice: ""
            });
        }

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
            variants: rawVariants
        });
        setShowProductModal(true);
    };

    const handleAddVariant = () => {
        setProductForm((prev) => ({
            ...prev,
            variants: [
                ...(prev.variants || []),
                { variantName: "", price: "", discountPrice: "" }
            ]
        }));
    };

    const handleRemoveVariant = (index) => {
        if ((productForm.variants || []).length <= 1) {
            Swal.fire({ icon: "info", title: "Minimum 1 Variant Required", text: "A product must have at least one variant size/price." });
            return;
        }
        setProductForm((prev) => ({
            ...prev,
            variants: (prev.variants || []).filter((_, i) => i !== index)
        }));
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
            variants: [
                { variantName: "500g", price: "", discountPrice: "" },
                { variantName: "2kg", price: "", discountPrice: "" },
                { variantName: "5kg", price: "", discountPrice: "" }
            ]
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

    // Order Shipping Fee Update
    const handleOrderShippingFeeUpdate = async (orderId, feeVal) => {
        if (feeVal === undefined || feeVal === null || feeVal === "") return;
        try {
            const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/shipping-fee?shippingFee=${feeVal}`, {
                method: "PUT"
            });
            if (res.ok) {
                Swal.fire({ icon: "success", title: "Shipping Charges Saved 🚚", timer: 1500, showConfirmButton: false });
                loadData();
            } else {
                Swal.fire("Error", "Failed to save shipping charges", "error");
            }
        } catch (err) {
            Swal.fire("Error", "Failed to connect to backend", "error");
        }
    };

    const handleOpenEditOrder = (order) => {
        setEditOrderModal(order);
        setEditOrderForm({
            orderStatus: order.orderStatus || "CONFIRMED",
            paymentMethod: order.paymentMethod || "COD",
            paymentStatus: order.paymentStatus || "PENDING",
            courierName: order.courierName || "",
            trackingNumber: order.trackingNumber || "",
            customerName: order.customerName || "",
            customerPhone: order.customerPhone || "",
            customerEmail: order.customerEmail || "",
            totalAmount: order.totalAmount || "",
            shippingFee: order.shippingFee != null ? order.shippingFee : "",
            streetAddress: order.shippingAddress?.streetAddress || "",
            city: order.shippingAddress?.city || "",
            state: order.shippingAddress?.state || "",
            pincode: order.shippingAddress?.pincode || "",
            gstin: order.gstin || ""
        });
    };

    const handleSaveOrderEdits = async (e) => {
        e.preventDefault();
        if (!editOrderModal) return;

        const payload = {
            orderStatus: editOrderForm.orderStatus,
            paymentMethod: editOrderForm.paymentMethod,
            paymentStatus: editOrderForm.paymentStatus,
            courierName: editOrderForm.courierName,
            trackingNumber: editOrderForm.trackingNumber,
            customerName: editOrderForm.customerName,
            customerPhone: editOrderForm.customerPhone,
            customerEmail: editOrderForm.customerEmail,
            totalAmount: editOrderForm.totalAmount ? parseFloat(editOrderForm.totalAmount) : null,
            shippingFee: editOrderForm.shippingFee ? parseFloat(editOrderForm.shippingFee) : null,
            shippingAddress: {
                fullName: editOrderForm.customerName,
                phone: editOrderForm.customerPhone,
                streetAddress: editOrderForm.streetAddress,
                city: editOrderForm.city,
                state: editOrderForm.state,
                pincode: editOrderForm.pincode
            },
            gstin: editOrderForm.gstin
        };

        try {
            const res = await fetch(`${API_BASE_URL}/admin/orders/${editOrderModal.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                Swal.fire({ icon: "success", title: "Order Details Updated!", timer: 1500, showConfirmButton: false });
                setEditOrderModal(null);
                loadData();
            } else {
                Swal.fire({ icon: "error", title: "Update Failed", text: "Could not update order details." });
            }
        } catch (err) {
            Swal.fire({ icon: "error", title: "Server Error", text: "Failed to connect to server." });
        }
    };

    const handleDownloadBill = async (orderNumber) => {
        try {
            const res = await fetch(`${API_BASE_URL}/orders/${orderNumber}/pdf`);
            if (!res.ok) {
                Swal.fire("Error", "Failed to generate PDF invoice", "error");
                return;
            }
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Bill-${orderNumber}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Error downloading bill PDF", err);
            Swal.fire("Error", "Failed to download bill PDF", "error");
        }
    };

    const handleDeleteOrder = async (orderId, orderNumber) => {
        const result = await Swal.fire({
            title: `Delete Order ${orderNumber}?`,
            text: "Are you sure you want to delete this order? This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
                    method: "DELETE"
                });
                if (res.ok) {
                    Swal.fire("Deleted!", `Order ${orderNumber} has been deleted.`, "success");
                    loadData();
                } else {
                    Swal.fire("Error", "Failed to delete order.", "error");
                }
            } catch (err) {
                console.error("Error deleting order:", err);
                Swal.fire("Error", "Failed to connect to server.", "error");
            }
        }
    };

    // Address Edit States
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [sameAsShippingEdit, setSameAsShippingEdit] = useState(true);
    const [editShippingAddress, setEditShippingAddress] = useState({ fullName: "", phone: "", streetAddress: "", city: "", state: "Tamil Nadu", pincode: "" });
    const [editBillingAddress, setEditBillingAddress] = useState({ fullName: "", phone: "", streetAddress: "", city: "", state: "Tamil Nadu", pincode: "" });
    const [editGstin, setEditGstin] = useState("");

    const openAddressEdit = (order) => {
        const ship = order.shippingAddress || {};
        const bill = order.billingAddress || {};
        setEditShippingAddress({
            fullName: ship.fullName || order.customerName || "",
            phone: ship.phone || order.customerPhone || "",
            streetAddress: ship.streetAddress || "",
            city: ship.city || "",
            state: ship.state || "Tamil Nadu",
            pincode: ship.pincode || ""
        });
        setEditBillingAddress({
            fullName: bill.fullName || ship.fullName || order.customerName || "",
            phone: bill.phone || ship.phone || order.customerPhone || "",
            streetAddress: bill.streetAddress || ship.streetAddress || "",
            city: bill.city || ship.city || "",
            state: bill.state || ship.state || "Tamil Nadu",
            pincode: bill.pincode || ship.pincode || ""
        });
        setEditGstin(order.gstin || "");
        setSameAsShippingEdit(true);
        setIsEditingAddress(true);
    };

    const handleSaveOrderAddress = async () => {
        if (!selectedOrderModal) return;
        const activeBilling = sameAsShippingEdit ? editShippingAddress : editBillingAddress;
        try {
            const res = await fetch(`${API_BASE_URL}/admin/orders/${selectedOrderModal.id}/address`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    shippingAddress: editShippingAddress,
                    billingAddress: activeBilling,
                    gstin: editGstin
                })
            });
            if (res.ok) {
                const updatedOrder = await res.json();
                setSelectedOrderModal(updatedOrder);
                setIsEditingAddress(false);
                Swal.fire({ icon: "success", title: "Address Details Saved 🎉", timer: 1500, showConfirmButton: false });
                loadData();
            } else {
                Swal.fire("Error", "Failed to save address details", "error");
            }
        } catch (err) {
            Swal.fire("Error", "Failed to update address", "error");
        }
    };

    if (loading) return <div className="text-center my-5 fs-4">Loading Admin Dashboard...</div>;

    const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

    return (
        <div className="min-vh-100 bg-light d-flex flex-column flex-md-row">
            {/* Left Sidebar Navigation */}
            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                selectedAssetGroup={selectedAssetGroup}
                setSelectedAssetGroup={setSelectedAssetGroup}
                assetGroups={assetGroups}
                onLogout={handleLogout}
            />

            {/* Main Content Area */}
            <div className="flex-grow-1 p-4" style={{ minWidth: 0 }}>

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

                {/* SHIPPING RATES SECTION */}
                {activeTab === "shipping" && <AdminShippingRates />}

                {/* CUSTOMERS SECTION */}
                {activeTab === "customers" && <AdminCustomers />}

                {/* COMPLAINTS SECTION */}
                {activeTab === "complaints" && <AdminComplaints />}

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

                {/* OFFERS & DISCOUNTS SECTION */}
                {activeTab === "offers" && (() => {
                    const allOfferProducts = products.filter((p) => {
                        const defaultVar = p.variants?.find((v) => v.default) || p.variants?.[0] || {};
                        const hasDiscount = defaultVar.discountPrice && defaultVar.discountPrice < defaultVar.price;
                        if (offerFilter === "on_offer") return hasDiscount;
                        return true;
                    }).filter((p) => {
                        if (!offerSearch.trim()) return true;
                        return p.name.toLowerCase().includes(offerSearch.toLowerCase()) ||
                            (p.category?.name && p.category.name.toLowerCase().includes(offerSearch.toLowerCase()));
                    });

                    const activeDealsCount = products.filter((p) => {
                        const defaultVar = p.variants?.find((v) => v.default) || p.variants?.[0] || {};
                        return defaultVar.discountPrice && defaultVar.discountPrice < defaultVar.price;
                    }).length;

                    const offersPerPage = 9;
                    const totalOfferPages = Math.ceil(allOfferProducts.length / offersPerPage) || 1;
                    const safeCurrentPage = Math.min(offerCurrentPage, totalOfferPages);
                    const indexOfLastOffer = safeCurrentPage * offersPerPage;
                    const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
                    const currentOfferProducts = allOfferProducts.slice(indexOfFirstOffer, indexOfLastOffer);

                    return (
                        <div>
                            {/* Header bar with Count, Filter, Search, and View Toggle */}
                            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                                <div className="d-flex align-items-center gap-3">
                                    <h3 className="fw-bold text-success m-0">🏷️ Offers & Discounts</h3>
                                    <span className="badge bg-danger-subtle text-danger fs-6 border border-danger px-3 py-2 rounded-pill">
                                        Active Deals: {activeDealsCount}
                                    </span>
                                </div>

                                <div className="d-flex flex-wrap align-items-center gap-3">
                                    {/* Search input */}
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Search offer products..."
                                        style={{ width: "200px" }}
                                        value={offerSearch}
                                        onChange={(e) => {
                                            setOfferSearch(e.target.value);
                                            setOfferCurrentPage(1);
                                        }}
                                    />

                                    {/* Filter dropdown */}
                                    <select
                                        className="form-select form-select-sm fw-bold border-secondary"
                                        style={{ width: "160px" }}
                                        value={offerFilter}
                                        onChange={(e) => {
                                            setOfferFilter(e.target.value);
                                            setOfferCurrentPage(1);
                                        }}
                                    >
                                        <option value="on_offer">🔥 On Offer Only</option>
                                        <option value="all">📦 All Products</option>
                                    </select>

                                    {/* View Toggle */}
                                    <div className="btn-group shadow-sm" role="group" aria-label="Offer view toggle">
                                        <button
                                            type="button"
                                            className={`btn btn-sm fw-bold px-3 py-1.5 ${offerViewMode === "card" ? "btn-success text-white" : "btn-outline-secondary bg-white text-dark"}`}
                                            onClick={() => setOfferViewMode("card")}
                                        >
                                            🎴 Card View
                                        </button>
                                        <button
                                            type="button"
                                            className={`btn btn-sm fw-bold px-3 py-1.5 ${offerViewMode === "list" ? "btn-success text-white" : "btn-outline-secondary bg-white text-dark"}`}
                                            onClick={() => setOfferViewMode("list")}
                                        >
                                            📋 List View
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* CARD VIEW */}
                            {offerViewMode === "card" ? (
                                <div className="row row-cols-1 row-cols-md-3 g-4">
                                    {currentOfferProducts.length === 0 ? (
                                        <div className="col-12 text-center py-5 bg-white rounded shadow-sm border">
                                            <h5 className="text-muted mb-2">No items found matching filter</h5>
                                            <small className="text-muted">Select 'All Products' to set new discounts.</small>
                                        </div>
                                    ) : (
                                        currentOfferProducts.map((p) => {
                                            const defaultVar = p.variants?.find((v) => v.default) || p.variants?.[0] || {};
                                            const originalPrice = defaultVar.price || 0;
                                            const discountPrice = defaultVar.discountPrice;
                                            const hasDiscount = discountPrice && discountPrice < originalPrice;
                                            const discountPercent = hasDiscount
                                                ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
                                                : 0;
                                            const prodImg = p.imageUrl ? getImageUrl(p.imageUrl) : null;

                                            return (
                                                <div key={p.id} className="col">
                                                    <div className="card shadow-sm border-0 rounded-3 h-100 position-relative">
                                                        {hasDiscount && (
                                                            <div className="position-absolute top-0 start-0 m-2 z-1 d-flex gap-1">
                                                                <span className="badge bg-danger rounded-pill px-2 py-1 shadow-sm">
                                                                    OFFER
                                                                </span>
                                                                <span className="badge bg-warning text-dark rounded-pill px-2 py-1 shadow-sm">
                                                                    {discountPercent}% OFF
                                                                </span>
                                                            </div>
                                                        )}

                                                        <div className="text-center bg-light p-3 border-bottom rounded-top" style={{ height: "160px", overflow: "hidden" }}>
                                                            {prodImg ? (
                                                                <img
                                                                    src={prodImg}
                                                                    alt={p.name}
                                                                    style={{ maxHeight: "135px", maxWidth: "100%", objectFit: "contain" }}
                                                                    className="rounded"
                                                                />
                                                            ) : (
                                                                <div className="h-100 d-flex align-items-center justify-content-center text-muted fs-1">
                                                                    📦
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="card-body d-flex flex-column justify-content-between">
                                                            <div>
                                                                <small className="text-muted text-uppercase font-monospace" style={{ fontSize: "11px" }}>
                                                                    {p.category?.name || "General"}
                                                                </small>
                                                                <h6 className="fw-bold text-dark mt-1 mb-2 text-truncate" title={p.name}>
                                                                    {p.name}
                                                                </h6>
                                                                <div className="d-flex align-items-baseline gap-2 mb-3">
                                                                    {hasDiscount ? (
                                                                        <>
                                                                            <span className="fs-5 fw-bold text-success">
                                                                                ₹{discountPrice}
                                                                            </span>
                                                                            <span className="text-muted text-decoration-line-through small">
                                                                                ₹{originalPrice}
                                                                            </span>
                                                                        </>
                                                                    ) : (
                                                                        <span className="fs-5 fw-bold text-dark">
                                                                            ₹{originalPrice}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="d-flex gap-2 pt-2 border-top">
                                                                <button
                                                                    className="btn btn-outline-success btn-sm w-100 fw-bold d-flex align-items-center justify-content-center gap-1"
                                                                    onClick={() => handleQuickDiscountUpdate(p)}
                                                                >
                                                                    🏷️ {hasDiscount ? "Edit Discount" : "Add Discount"}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            ) : (
                                /* LIST VIEW */
                                <div className="table-responsive shadow-sm rounded border bg-white">
                                    <table className="table table-hover align-middle m-0">
                                        <thead className="table-success text-dark">
                                            <tr>
                                                <th style={{ width: "50px" }}>#</th>
                                                <th style={{ width: "70px" }}>Image</th>
                                                <th>Product Name</th>
                                                <th>Category</th>
                                                <th className="text-end">Original Price</th>
                                                <th className="text-end">Offer Price</th>
                                                <th className="text-center">Savings</th>
                                                <th className="text-center">Status</th>
                                                <th className="text-end" style={{ width: "200px" }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentOfferProducts.length === 0 ? (
                                                <tr>
                                                    <td colSpan="9" className="text-center py-4 text-muted">
                                                        No offer products found matching your filter.
                                                    </td>
                                                </tr>
                                            ) : (
                                                currentOfferProducts.map((p, idx) => {
                                                    const defaultVar = p.variants?.find((v) => v.default) || p.variants?.[0] || {};
                                                    const originalPrice = defaultVar.price || 0;
                                                    const discountPrice = defaultVar.discountPrice;
                                                    const hasDiscount = discountPrice && discountPrice < originalPrice;
                                                    const discountPercent = hasDiscount
                                                        ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
                                                        : 0;
                                                    const prodImg = p.imageUrl ? getImageUrl(p.imageUrl) : null;

                                                    return (
                                                        <tr key={p.id}>
                                                            <td className="fw-bold text-muted">{indexOfFirstOffer + idx + 1}</td>
                                                            <td>
                                                                {prodImg ? (
                                                                    <img
                                                                        src={prodImg}
                                                                        alt={p.name}
                                                                        style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                                                        className="rounded border"
                                                                    />
                                                                ) : (
                                                                    <div className="bg-light rounded border d-flex align-items-center justify-content-center text-muted" style={{ width: "40px", height: "40px" }}>
                                                                        📦
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="fw-bold text-dark">{p.name}</td>
                                                            <td className="text-muted small">{p.category?.name || "Uncategorized"}</td>
                                                            <td className="text-end fw-semibold text-muted">₹{originalPrice}</td>
                                                            <td className="text-end fw-bold text-success">
                                                                {hasDiscount ? `₹${discountPrice}` : "-"}
                                                            </td>
                                                            <td className="text-center">
                                                                {hasDiscount ? (
                                                                    <span className="badge bg-warning text-dark border">
                                                                        {discountPercent}% OFF (Save ₹{(originalPrice - discountPrice).toFixed(2)})
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-muted small">No Discount</span>
                                                                )}
                                                            </td>
                                                            <td className="text-center">
                                                                {hasDiscount ? (
                                                                    <span className="badge bg-danger rounded-pill px-2 py-1">OFFER</span>
                                                                ) : (
                                                                    <span className="badge bg-secondary-subtle text-secondary border">Regular</span>
                                                                )}
                                                            </td>
                                                            <td className="text-end">
                                                                <button
                                                                    className="btn btn-outline-success btn-sm fw-bold"
                                                                    onClick={() => handleQuickDiscountUpdate(p)}
                                                                >
                                                                    🏷️ Set Offer
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* PAGINATION CONTROLS */}
                            {totalOfferPages > 1 && (
                                <div className="d-flex flex-wrap justify-content-between align-items-center mt-4 pt-3 border-top">
                                    <div className="text-muted small fw-medium">
                                        Showing {indexOfFirstOffer + 1} to {Math.min(indexOfLastOffer, allOfferProducts.length)} of {allOfferProducts.length} items
                                    </div>
                                    <nav aria-label="Offer pagination">
                                        <ul className="pagination pagination-sm m-0 gap-1">
                                            <li className={`page-item ${safeCurrentPage === 1 ? "disabled" : ""}`}>
                                                <button
                                                    className="page-link rounded"
                                                    onClick={() => setOfferCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                    disabled={safeCurrentPage === 1}
                                                >
                                                    &laquo; Previous
                                                </button>
                                            </li>
                                            {Array.from({ length: totalOfferPages }, (_, i) => i + 1).map((page) => (
                                                <li key={page} className={`page-item ${safeCurrentPage === page ? "active" : ""}`}>
                                                    <button
                                                        className={`page-link rounded ${safeCurrentPage === page ? "bg-success border-success text-white" : ""}`}
                                                        onClick={() => setOfferCurrentPage(page)}
                                                    >
                                                        {page}
                                                    </button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${safeCurrentPage === totalOfferPages ? "disabled" : ""}`}>
                                                <button
                                                    className="page-link rounded"
                                                    onClick={() => setOfferCurrentPage((prev) => Math.min(prev + 1, totalOfferPages))}
                                                    disabled={safeCurrentPage === totalOfferPages}
                                                >
                                                    Next &raquo;
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            )}
                        </div>
                    );
                })()}

                {/* CATEGORIES SECTION */}
                {activeTab === "categories" && (() => {
                    const categoriesPerPage = 10;
                    const totalCatPages = Math.ceil(categories.length / categoriesPerPage) || 1;
                    const safeCurrentPage = Math.min(categoryCurrentPage, totalCatPages);
                    const indexOfLastCat = safeCurrentPage * categoriesPerPage;
                    const indexOfFirstCat = indexOfLastCat - categoriesPerPage;
                    const currentCategories = categories.slice(indexOfFirstCat, indexOfLastCat);

                    return (
                        <div>
                            {/* Header bar with Count, View Toggle, and Add button */}
                            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                                <div className="d-flex align-items-center gap-3">
                                    <h3 className="fw-bold text-success m-0">🗂️ Category Management</h3>
                                    <span className="badge bg-success-subtle text-success fs-6 border border-success px-3 py-2 rounded-pill">
                                        Total Categories: {categories.length}
                                    </span>
                                </div>

                                <div className="d-flex align-items-center gap-3">
                                    <div className="btn-group shadow-sm" role="group" aria-label="Category view toggle">
                                        <button
                                            type="button"
                                            className={`btn btn-sm fw-bold px-3 py-1.5 ${categoryViewMode === "list" ? "btn-success text-white" : "btn-outline-secondary bg-white text-dark"}`}
                                            onClick={() => setCategoryViewMode("list")}
                                        >
                                            📋 List View
                                        </button>
                                        <button
                                            type="button"
                                            className={`btn btn-sm fw-bold px-3 py-1.5 ${categoryViewMode === "card" ? "btn-success text-white" : "btn-outline-secondary bg-white text-dark"}`}
                                            onClick={() => setCategoryViewMode("card")}
                                        >
                                            🎴 Card View
                                        </button>
                                    </div>

                                    <button
                                        className="btn btn-success fw-bold d-flex align-items-center gap-1 shadow-sm px-3 py-1.5"
                                        onClick={() => {
                                            setEditingCategoryId(null);
                                            setCategoryForm({ name: "", description: "", imageUrl: "" });
                                            setShowCategoryModal(true);
                                        }}
                                    >
                                        + Add New Category
                                    </button>
                                </div>
                            </div>

                            {/* LIST VIEW (Default) */}
                            {categoryViewMode === "list" ? (
                                <div className="table-responsive shadow-sm rounded border bg-white">
                                    <table className="table table-hover align-middle m-0">
                                        <thead className="table-success text-dark">
                                            <tr>
                                                <th style={{ width: "50px" }}>#</th>
                                                <th style={{ width: "80px" }}>Image</th>
                                                <th>Category Name</th>
                                                <th>Description</th>
                                                <th className="text-center" style={{ width: "130px" }}>Products</th>
                                                <th className="text-end" style={{ width: "240px" }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentCategories.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="text-center py-4 text-muted">
                                                        No categories found.
                                                    </td>
                                                </tr>
                                            ) : (
                                                currentCategories.map((c, idx) => {
                                                    const catImgUrl = c.imageUrl ? getImageUrl(c.imageUrl) : null;
                                                    const productCount = products.filter(
                                                        (p) => p.categoryId === c.id || (p.category && p.category.id === c.id)
                                                    ).length;
                                                    return (
                                                        <tr key={c.id}>
                                                            <td className="fw-bold text-muted">{indexOfFirstCat + idx + 1}</td>
                                                            <td>
                                                                {catImgUrl ? (
                                                                    <img
                                                                        src={catImgUrl}
                                                                        alt={c.name}
                                                                        style={{ width: "45px", height: "45px", objectFit: "cover" }}
                                                                        className="rounded border"
                                                                    />
                                                                ) : (
                                                                    <div
                                                                        className="bg-light rounded border d-flex align-items-center justify-content-center text-muted"
                                                                        style={{ width: "45px", height: "45px", fontSize: "18px" }}
                                                                    >
                                                                        📁
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="fw-bold text-success">{c.name}</td>
                                                            <td className="text-muted small" style={{ maxWidth: "300px" }}>
                                                                {c.description || "No description provided."}
                                                            </td>
                                                            <td className="text-center">
                                                                <span className="badge bg-secondary-subtle text-dark border px-2 py-1">
                                                                    📦 {productCount} items
                                                                </span>
                                                            </td>
                                                            <td className="text-end">
                                                                <div className="d-flex justify-content-end align-items-center gap-2">
                                                                    <label className="btn btn-sm btn-outline-secondary p-1 small mb-0" style={{ fontSize: "11px" }} title="Upload Image">
                                                                        🖼️ Image
                                                                        <input type="file" accept="image/*" className="d-none" onChange={(e) => handleQuickCategoryImageUpload(c.id, e.target.files[0])} />
                                                                    </label>
                                                                    <button className="btn btn-outline-primary btn-sm" onClick={() => handleEditCategory(c)}>
                                                                        ✏️ Edit
                                                                    </button>
                                                                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteCategory(c.id)}>
                                                                        🗑️ Delete
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
                            ) : (
                                /* CARD VIEW */
                                <div className="row g-3">
                                    {currentCategories.map((c) => {
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
                            )}

                            {/* PAGINATION CONTROLS */}
                            {totalCatPages > 1 && (
                                <div className="d-flex flex-wrap justify-content-between align-items-center mt-4 pt-3 border-top">
                                    <div className="text-muted small fw-medium">
                                        Showing {indexOfFirstCat + 1} to {Math.min(indexOfLastCat, categories.length)} of {categories.length} categories
                                    </div>
                                    <nav aria-label="Category pagination">
                                        <ul className="pagination pagination-sm m-0 gap-1">
                                            <li className={`page-item ${safeCurrentPage === 1 ? "disabled" : ""}`}>
                                                <button
                                                    className="page-link rounded"
                                                    onClick={() => setCategoryCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                    disabled={safeCurrentPage === 1}
                                                >
                                                    &laquo; Previous
                                                </button>
                                            </li>
                                            {Array.from({ length: totalCatPages }, (_, i) => i + 1).map((page) => (
                                                <li key={page} className={`page-item ${safeCurrentPage === page ? "active" : ""}`}>
                                                    <button
                                                        className={`page-link rounded ${safeCurrentPage === page ? "bg-success border-success text-white" : ""}`}
                                                        onClick={() => setCategoryCurrentPage(page)}
                                                    >
                                                        {page}
                                                    </button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${safeCurrentPage === totalCatPages ? "disabled" : ""}`}>
                                                <button
                                                    className="page-link rounded"
                                                    onClick={() => setCategoryCurrentPage((prev) => Math.min(prev + 1, totalCatPages))}
                                                    disabled={safeCurrentPage === totalCatPages}
                                                >
                                                    Next &raquo;
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            )}
                        </div>
                    );
                })()}

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
                        <div className="table-responsive shadow-sm rounded" style={{ overflowX: "auto" }}>
                            <table className="table table-hover align-middle bg-white m-0" style={{ minWidth: "1280px" }}>
                                <thead className="table-success text-nowrap">
                                    <tr>
                                        <th>Order #</th>
                                        <th>Customer</th>
                                        <th>Items</th>
                                        <th>Logistics & Tracking</th>
                                        <th>Shipping Fee</th>
                                        <th>Total Amount</th>
                                        <th>Payment</th>
                                        <th>Status</th>
                                        <th>Update Status</th>
                                        <th>Full Details</th>
                                        <th className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((o) => (
                                        <tr key={o.id}>
                                            <td className="fw-bold text-success text-nowrap">{o.orderNumber}</td>
                                            <td style={{ minWidth: "220px" }}>
                                                <div className="fw-bold">{o.customerName}</div>
                                                <div className="small text-muted">{o.customerPhone} | {o.customerEmail}</div>
                                                <div className="small text-secondary">{o.shippingAddress?.streetAddress}, {o.shippingAddress?.city}</div>
                                            </td>
                                            <td style={{ minWidth: "220px" }}>
                                                {o.items?.map((item, idx) => (
                                                    <div key={idx} className="small">
                                                        • {item.productName} ({item.variantName}) x{item.quantity} = ₹{item.totalPrice}
                                                    </div>
                                                ))}
                                            </td>
                                            <td style={{ minWidth: "170px" }}>
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
                                            <td className="text-nowrap" style={{ minWidth: "155px" }}>
                                                <div className="d-flex align-items-center gap-1">
                                                    <span className="small text-muted fw-bold">₹</span>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        className="form-control form-control-sm font-monospace fw-bold text-success border-success"
                                                        style={{ width: "80px" }}
                                                        value={shippingFeeInputs[o.id] !== undefined ? shippingFeeInputs[o.id] : (o.shippingFee != null ? o.shippingFee : "")}
                                                        onChange={(e) => setShippingFeeInputs({ ...shippingFeeInputs, [o.id]: e.target.value })}
                                                        placeholder="0.00"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-success py-1 px-2 fw-bold shadow-sm"
                                                        onClick={() => handleOrderShippingFeeUpdate(o.id, shippingFeeInputs[o.id] !== undefined ? shippingFeeInputs[o.id] : o.shippingFee)}
                                                        title="Save Shipping Charge"
                                                    >
                                                        💾
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="fw-bold fs-6 text-nowrap">₹{o.totalAmount}</td>
                                            <td className="text-nowrap">{getPaymentBadge(o.paymentMethod)}</td>
                                            <td className="text-nowrap">{getOrderStatusBadge(o.orderStatus)}</td>
                                            <td className="text-nowrap">
                                                <select
                                                    className="form-select form-select-sm fw-bold border-success"
                                                    value={o.orderStatus}
                                                    style={{ minWidth: "135px" }}
                                                    onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                                                >
                                                    <option value="CONFIRMED">CONFIRMED</option>
                                                    <option value="PROCESSING">PROCESSING</option>
                                                    <option value="SHIPPED">SHIPPED</option>
                                                    <option value="DELIVERED">DELIVERED</option>
                                                    <option value="CANCELLED">CANCELLED</option>
                                                </select>
                                            </td>
                                            <td className="text-nowrap">
                                                <div className="d-flex gap-1">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-success rounded-pill px-2.5 fw-bold d-inline-flex align-items-center gap-1 shadow-sm"
                                                        onClick={() => setSelectedOrderModal(o)}
                                                        title="View Details"
                                                    >
                                                        👁️ View Details
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-success rounded-pill px-2.5 fw-bold d-inline-flex align-items-center gap-1 shadow-sm"
                                                        onClick={() => handleDownloadBill(o.orderNumber)}
                                                        title="Download Invoice PDF"
                                                    >
                                                        📄 Bill PDF
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="text-center text-nowrap">
                                                <div className="d-flex justify-content-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-warning text-dark rounded-circle p-0 d-inline-flex align-items-center justify-content-center shadow-sm"
                                                        style={{ width: "34px", height: "34px" }}
                                                        onClick={() => handleOpenEditOrder(o)}
                                                        title="Edit Order Details"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger rounded-circle p-0 d-inline-flex align-items-center justify-content-center shadow-sm"
                                                        style={{ width: "34px", height: "34px" }}
                                                        onClick={() => handleDeleteOrder(o.id, o.orderNumber)}
                                                        title="Delete Order"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
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
                                                <span className="text-muted small d-block mb-1">Order Status</span>
                                                {getOrderStatusBadge(selectedOrderModal.orderStatus)}
                                            </div>
                                            <div>
                                                <span className="text-muted small d-block mb-1">Payment Method</span>
                                                {getPaymentBadge(selectedOrderModal.paymentMethod)}
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
                                    <div className="card border-0 shadow-sm mb-4 bg-white rounded-3">
                                        <div className="card-header bg-white border-0 fw-bold text-success fs-6 py-3 d-flex justify-content-between align-items-center">
                                            <span>📍 Order Shipping &amp; Billing Addresses</span>
                                            {!isEditingAddress ? (
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-success rounded-pill font-bold px-3 shadow-xs"
                                                    onClick={() => openAddressEdit(selectedOrderModal)}
                                                >
                                                    ✏️ Edit / Enter Addresses
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-secondary rounded-pill font-bold px-3"
                                                    onClick={() => setIsEditingAddress(false)}
                                                >
                                                    ❌ Cancel Edit
                                                </button>
                                            )}
                                        </div>

                                        <div className="card-body pt-0">
                                            {isEditingAddress ? (
                                                <form onSubmit={(e) => { e.preventDefault(); handleSaveOrderAddress(); }}>
                                                    <div className="p-3 bg-light rounded-3 border mb-3">
                                                        <h6 className="fw-bold text-success mb-3">🚚 Shipping Address</h6>
                                                        <div className="row g-2">
                                                            <div className="col-md-6">
                                                                <label className="form-label small fw-bold text-muted mb-1">Recipient Name *</label>
                                                                <input
                                                                    type="text" className="form-control form-control-sm" required
                                                                    value={editShippingAddress.fullName}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value;
                                                                        setEditShippingAddress(prev => ({ ...prev, fullName: val }));
                                                                        if (sameAsShippingEdit) setEditBillingAddress(prev => ({ ...prev, fullName: val }));
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="col-md-6">
                                                                <label className="form-label small fw-bold text-muted mb-1">Phone Number *</label>
                                                                <input
                                                                    type="text" className="form-control form-control-sm" required
                                                                    value={editShippingAddress.phone}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value;
                                                                        setEditShippingAddress(prev => ({ ...prev, phone: val }));
                                                                        if (sameAsShippingEdit) setEditBillingAddress(prev => ({ ...prev, phone: val }));
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="col-12">
                                                                <label className="form-label small fw-bold text-muted mb-1">Street Address *</label>
                                                                <textarea
                                                                    className="form-control form-control-sm" rows="2" required
                                                                    value={editShippingAddress.streetAddress}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value;
                                                                        setEditShippingAddress(prev => ({ ...prev, streetAddress: val }));
                                                                        if (sameAsShippingEdit) setEditBillingAddress(prev => ({ ...prev, streetAddress: val }));
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="col-md-4">
                                                                <label className="form-label small fw-bold text-muted mb-1">City *</label>
                                                                <input
                                                                    type="text" className="form-control form-control-sm" required
                                                                    value={editShippingAddress.city}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value;
                                                                        setEditShippingAddress(prev => ({ ...prev, city: val }));
                                                                        if (sameAsShippingEdit) setEditBillingAddress(prev => ({ ...prev, city: val }));
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="col-md-4">
                                                                <label className="form-label small fw-bold text-muted mb-1">State *</label>
                                                                <input
                                                                    type="text" className="form-control form-control-sm" required
                                                                    value={editShippingAddress.state}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value;
                                                                        setEditShippingAddress(prev => ({ ...prev, state: val }));
                                                                        if (sameAsShippingEdit) setEditBillingAddress(prev => ({ ...prev, state: val }));
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="col-md-4">
                                                                <label className="form-label small fw-bold text-muted mb-1">Pincode *</label>
                                                                <input
                                                                    type="text" className="form-control form-control-sm" required
                                                                    value={editShippingAddress.pincode}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value;
                                                                        setEditShippingAddress(prev => ({ ...prev, pincode: val }));
                                                                        if (sameAsShippingEdit) setEditBillingAddress(prev => ({ ...prev, pincode: val }));
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Toggle Checkbox: Billing Same As Shipping */}
                                                    <div className="form-check form-switch mb-3 p-2 bg-emerald-50 rounded border border-emerald-200">
                                                        <input
                                                            className="form-check-input ms-0 me-2"
                                                            type="checkbox"
                                                            id="sameAsShippingSwitch"
                                                            checked={sameAsShippingEdit}
                                                            onChange={(e) => {
                                                                const checked = e.target.checked;
                                                                setSameAsShippingEdit(checked);
                                                                if (checked) {
                                                                    setEditBillingAddress({ ...editShippingAddress });
                                                                }
                                                            }}
                                                        />
                                                        <label className="form-check-label fw-bold text-emerald-900 small" htmlFor="sameAsShippingSwitch">
                                                            ☑️ Billing address is same as shipping address (Autofilled)
                                                        </label>
                                                    </div>

                                                    {!sameAsShippingEdit && (
                                                        <div className="p-3 bg-light rounded-3 border mb-3">
                                                            <h6 className="fw-bold text-success mb-3">💳 Billing Address</h6>
                                                            <div className="row g-2">
                                                                <div className="col-md-6">
                                                                    <label className="form-label small fw-bold text-muted mb-1">Billing Name *</label>
                                                                    <input
                                                                        type="text" className="form-control form-control-sm" required
                                                                        value={editBillingAddress.fullName}
                                                                        onChange={(e) => setEditBillingAddress(prev => ({ ...prev, fullName: e.target.value }))}
                                                                    />
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <label className="form-label small fw-bold text-muted mb-1">Billing Phone *</label>
                                                                    <input
                                                                        type="text" className="form-control form-control-sm" required
                                                                        value={editBillingAddress.phone}
                                                                        onChange={(e) => setEditBillingAddress(prev => ({ ...prev, phone: e.target.value }))}
                                                                    />
                                                                </div>
                                                                <div className="col-12">
                                                                    <label className="form-label small fw-bold text-muted mb-1">Billing Address *</label>
                                                                    <textarea
                                                                        className="form-control form-control-sm" rows="2" required
                                                                        value={editBillingAddress.streetAddress}
                                                                        onChange={(e) => setEditBillingAddress(prev => ({ ...prev, streetAddress: e.target.value }))}
                                                                    />
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <label className="form-label small fw-bold text-muted mb-1">City *</label>
                                                                    <input
                                                                        type="text" className="form-control form-control-sm" required
                                                                        value={editBillingAddress.city}
                                                                        onChange={(e) => setEditBillingAddress(prev => ({ ...prev, city: e.target.value }))}
                                                                    />
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <label className="form-label small fw-bold text-muted mb-1">State *</label>
                                                                    <input
                                                                        type="text" className="form-control form-control-sm" required
                                                                        value={editBillingAddress.state}
                                                                        onChange={(e) => setEditBillingAddress(prev => ({ ...prev, state: e.target.value }))}
                                                                    />
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <label className="form-label small fw-bold text-muted mb-1">Pincode *</label>
                                                                    <input
                                                                        type="text" className="form-control form-control-sm" required
                                                                        value={editBillingAddress.pincode}
                                                                        onChange={(e) => setEditBillingAddress(prev => ({ ...prev, pincode: e.target.value }))}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* GSTIN optional field */}
                                                    <div className="mb-3">
                                                        <label className="form-label small fw-bold text-muted mb-1">GSTIN Number (Optional)</label>
                                                        <input
                                                            type="text" className="form-control form-control-sm font-monospace" placeholder="e.g. 33AAAAA0000A1Z5"
                                                            value={editGstin}
                                                            onChange={(e) => setEditGstin(e.target.value)}
                                                        />
                                                    </div>

                                                    <div className="d-flex justify-content-end gap-2 pt-2">
                                                        <button type="button" className="btn btn-sm btn-light border rounded-pill px-3" onClick={() => setIsEditingAddress(false)}>
                                                            Cancel
                                                        </button>
                                                        <button type="submit" className="btn btn-sm btn-success rounded-pill px-4 font-bold shadow-sm">
                                                            💾 Save Address Details
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <div className="row g-3">
                                                    {/* Shipping Address */}
                                                    <div className="col-md-6">
                                                        <div className="p-3 bg-light rounded-3 border h-100">
                                                            <div className="fw-bold text-success small mb-2">🚚 Shipping Address</div>
                                                            {selectedOrderModal.shippingAddress && selectedOrderModal.shippingAddress.streetAddress ? (
                                                                <div className="small">
                                                                    <div className="fw-bold text-dark mb-1">{selectedOrderModal.shippingAddress.fullName || selectedOrderModal.customerName}</div>
                                                                    <div className="text-secondary mb-1">{selectedOrderModal.shippingAddress.streetAddress}</div>
                                                                    <div className="text-secondary mb-1">{selectedOrderModal.shippingAddress.city}, {selectedOrderModal.shippingAddress.state} - {selectedOrderModal.shippingAddress.pincode}</div>
                                                                    <div className="text-muted">📞 {selectedOrderModal.shippingAddress.phone || selectedOrderModal.customerPhone}</div>
                                                                </div>
                                                            ) : (
                                                                <div className="text-muted small py-2">
                                                                    No shipping address recorded.<br />
                                                                    <button type="button" className="btn btn-sm btn-link p-0 text-success font-bold" onClick={() => openAddressEdit(selectedOrderModal)}>
                                                                        + Enter Shipping Address
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Billing Address */}
                                                    <div className="col-md-6">
                                                        <div className="p-3 bg-light rounded-3 border h-100">
                                                            <div className="fw-bold text-success small mb-2">💳 Billing Address</div>
                                                            {selectedOrderModal.billingAddress && selectedOrderModal.billingAddress.streetAddress ? (
                                                                <div className="small">
                                                                    <div className="fw-bold text-dark mb-1">{selectedOrderModal.billingAddress.fullName || selectedOrderModal.customerName}</div>
                                                                    <div className="text-secondary mb-1">{selectedOrderModal.billingAddress.streetAddress}</div>
                                                                    <div className="text-secondary mb-1">{selectedOrderModal.billingAddress.city}, {selectedOrderModal.billingAddress.state} - {selectedOrderModal.billingAddress.pincode}</div>
                                                                    <div className="text-muted">📞 {selectedOrderModal.billingAddress.phone || selectedOrderModal.customerPhone}</div>
                                                                </div>
                                                            ) : (
                                                                <div className="text-muted small py-2">
                                                                    Same as Shipping Address or Not Recorded.<br />
                                                                    <button type="button" className="btn btn-sm btn-link p-0 text-success font-bold" onClick={() => openAddressEdit(selectedOrderModal)}>
                                                                        + Enter Billing Address
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
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
                                                            <td colSpan="4" className="text-end text-muted small">Net Items Subtotal:</td>
                                                            <td className="text-end font-monospace fw-bold">₹{selectedOrderModal.subtotal || selectedOrderModal.items?.reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0) || 0}</td>
                                                        </tr>
                                                        <tr>
                                                            <td colSpan="4" className="text-end text-muted small">Shipping Charges:</td>
                                                            <td className="text-end font-monospace fw-bold text-success">+ ₹{selectedOrderModal.shippingFee || 0}</td>
                                                        </tr>
                                                        <tr>
                                                            <td colSpan="4" className="text-end fw-bold text-dark fs-6">Grand Total:</td>
                                                            <td className="text-end fw-bold text-success fs-5">₹{selectedOrderModal.totalAmount}</td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer bg-light border-0 py-3 px-4 justify-content-between">
                                    <button
                                        type="button"
                                        className="btn btn-success font-bold rounded-pill px-4 shadow-sm"
                                        onClick={() => handleDownloadBill(selectedOrderModal.orderNumber)}
                                    >
                                        📄 Download Official PDF Bill
                                    </button>
                                    <button type="button" className="btn btn-secondary rounded-pill px-4 fw-bold" onClick={() => setSelectedOrderModal(null)}>
                                        Close Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL: EDIT ANY ORDER DETAILS */}
                {editOrderModal && (
                    <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1" style={{ zIndex: 1060 }}>
                        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                                <div className="modal-header bg-warning text-dark py-3 px-4">
                                    <h5 className="modal-title fw-bold m-0 d-flex align-items-center gap-2">
                                        ✏️ Edit Order: <span className="font-monospace">{editOrderModal.orderNumber}</span>
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setEditOrderModal(null)}
                                    ></button>
                                </div>
                                <form onSubmit={handleSaveOrderEdits}>
                                    <div className="modal-body p-4 bg-light">
                                        {/* SECTION 1: STATUS & PAYMENT */}
                                        <div className="card border-0 shadow-sm mb-3 rounded-3">
                                            <div className="card-header bg-white fw-bold text-success border-0 pt-3">
                                                Status & Payment Configuration
                                            </div>
                                            <div className="card-body pt-0">
                                                <div className="row g-3">
                                                    <div className="col-md-6">
                                                        <label className="form-label small fw-bold text-muted mb-1">Order Status</label>
                                                        <select
                                                            className="form-select form-select-sm fw-bold"
                                                            value={editOrderForm.orderStatus}
                                                            onChange={(e) => setEditOrderForm({ ...editOrderForm, orderStatus: e.target.value })}
                                                        >
                                                            <option value="PENDING">PENDING</option>
                                                            <option value="CONFIRMED">CONFIRMED</option>
                                                            <option value="PROCESSING">PROCESSING</option>
                                                            <option value="SHIPPED">SHIPPED</option>
                                                            <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                                                            <option value="DELIVERED">DELIVERED</option>
                                                            <option value="CANCELLED">CANCELLED</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label small fw-bold text-muted mb-1">Payment Method</label>
                                                        <select
                                                            className="form-select form-select-sm fw-bold"
                                                            value={editOrderForm.paymentMethod}
                                                            onChange={(e) => setEditOrderForm({ ...editOrderForm, paymentMethod: e.target.value })}
                                                        >
                                                            <option value="ONLINE">ONLINE</option>
                                                            <option value="COD">COD</option>
                                                            <option value="UPI">UPI</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label small fw-bold text-muted mb-1">Payment Status</label>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm"
                                                            value={editOrderForm.paymentStatus}
                                                            onChange={(e) => setEditOrderForm({ ...editOrderForm, paymentStatus: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label small fw-bold text-muted mb-1">Shipping Fee (₹)</label>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            className="form-control form-control-sm fw-bold text-success"
                                                            value={editOrderForm.shippingFee}
                                                            onChange={(e) => setEditOrderForm({ ...editOrderForm, shippingFee: e.target.value })}
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label small fw-bold text-muted mb-1">Total Amount (₹)</label>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            className="form-control form-control-sm fw-bold text-success"
                                                            value={editOrderForm.totalAmount}
                                                            onChange={(e) => setEditOrderForm({ ...editOrderForm, totalAmount: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* SECTION 2: LOGISTICS & TRACKING */}
                                        <div className="card border-0 shadow-sm mb-3 rounded-3">
                                            <div className="card-header bg-white fw-bold text-success border-0 pt-3">
                                                Logistics & Courier Tracking
                                            </div>
                                            <div className="card-body pt-0">
                                                <div className="row g-3">
                                                    <div className="col-md-6">
                                                        <label className="form-label small fw-bold text-muted mb-1">Courier Partner Name</label>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm"
                                                            placeholder="e.g. Amazon Shipping, BlueDart, DTDC"
                                                            value={editOrderForm.courierName}
                                                            onChange={(e) => setEditOrderForm({ ...editOrderForm, courierName: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label small fw-bold text-muted mb-1">AWB / Tracking Number</label>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm font-monospace"
                                                            placeholder="e.g. 371366760861"
                                                            value={editOrderForm.trackingNumber}
                                                            onChange={(e) => setEditOrderForm({ ...editOrderForm, trackingNumber: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* SECTION 3: CUSTOMER & ADDRESS */}
                                        <div className="card border-0 shadow-sm mb-3 rounded-3">
                                            <div className="card-header bg-white fw-bold text-success border-0 pt-3">
                                                Customer Contact & Shipping Address
                                            </div>
                                            <div className="card-body pt-0">
                                                <div className="row g-3 mb-2">
                                                    <div className="col-md-4">
                                                        <label className="form-label small fw-bold text-muted mb-1">Customer Name</label>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm"
                                                            value={editOrderForm.customerName}
                                                            onChange={(e) => setEditOrderForm({ ...editOrderForm, customerName: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label small fw-bold text-muted mb-1">Phone Number</label>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm"
                                                            value={editOrderForm.customerPhone}
                                                            onChange={(e) => setEditOrderForm({ ...editOrderForm, customerPhone: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label small fw-bold text-muted mb-1">Email</label>
                                                        <input
                                                            type="email"
                                                            className="form-control form-control-sm"
                                                            value={editOrderForm.customerEmail}
                                                            onChange={(e) => setEditOrderForm({ ...editOrderForm, customerEmail: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="row g-3">
                                                    <div className="col-md-12">
                                                        <label className="form-label small fw-bold text-muted mb-1">Street Address</label>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm"
                                                            value={editOrderForm.streetAddress}
                                                            onChange={(e) => setEditOrderForm({ ...editOrderForm, streetAddress: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label small fw-bold text-muted mb-1">City</label>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm"
                                                            value={editOrderForm.city}
                                                            onChange={(e) => setEditOrderForm({ ...editOrderForm, city: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label small fw-bold text-muted mb-1">State</label>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm"
                                                            value={editOrderForm.state}
                                                            onChange={(e) => setEditOrderForm({ ...editOrderForm, state: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label small fw-bold text-muted mb-1">Pincode</label>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm"
                                                            value={editOrderForm.pincode}
                                                            onChange={(e) => setEditOrderForm({ ...editOrderForm, pincode: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label className="form-label small fw-bold text-muted mb-1">GSTIN (Optional)</label>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm font-monospace"
                                                            value={editOrderForm.gstin}
                                                            onChange={(e) => setEditOrderForm({ ...editOrderForm, gstin: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal-footer bg-white border-0 py-3 px-4">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-light border rounded-pill px-4"
                                            onClick={() => setEditOrderModal(null)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-sm btn-success fw-bold rounded-pill px-4 shadow-sm"
                                        >
                                            💾 Save Order Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* CUSTOMER REVIEWS & PHOTOS SECTION */}
                {activeTab === "reviews" && <AdminReviews />}
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
                                        {/* Dynamic Multi-Variant / Size, Price & Discount Bars */}
                                        <div className="col-12">
                                            <div className="card border-0 bg-light shadow-sm p-3 rounded-3">
                                                <div className="d-flex align-items-center justify-content-between mb-3">
                                                    <h6 className="fw-bold text-success m-0 d-flex align-items-center gap-2">
                                                        🏷️ Product Variants & Pricing
                                                    </h6>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-success rounded-pill px-3 fw-bold shadow-sm d-flex align-items-center gap-1"
                                                        onClick={handleAddVariant}
                                                    >
                                                        ➕ Add Variant
                                                    </button>
                                                </div>
                                                {(productForm.variants || []).map((variant, index) => (
                                                    <div key={index} className="row g-2 align-items-center mb-2 pb-2 border-bottom border-secondary border-opacity-25">
                                                        <div className="col-md-2 fw-bold small text-dark d-flex align-items-center gap-1">
                                                            <span>Variant #{index + 1}</span>
                                                            {index === 0 ? (
                                                                <span className="badge bg-success-subtle text-success">Main</span>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-danger border-0 p-0 px-1 rounded-circle"
                                                                    title="Remove Variant"
                                                                    onClick={() => handleRemoveVariant(index)}
                                                                >
                                                                    🗑️
                                                                </button>
                                                            )}
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label className="form-label small fw-bold text-secondary mb-1">
                                                                Weight {index === 0 && <span className="text-danger">*</span>}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-sm"
                                                                placeholder={index === 0 ? "e.g. 500g" : index === 1 ? "e.g. 2kg" : "e.g. 5kg"}
                                                                value={variant.variantName}
                                                                onChange={(e) => {
                                                                    const newVariants = [...(productForm.variants || [])];
                                                                    newVariants[index] = { ...newVariants[index], variantName: e.target.value };
                                                                    setProductForm({ ...productForm, variants: newVariants });
                                                                }}
                                                                required={index === 0}
                                                            />
                                                        </div>
                                                        <div className="col-md-3">
                                                            <label className="form-label small fw-bold text-secondary mb-1">
                                                                Price (₹) {index === 0 && <span className="text-danger">*</span>}
                                                            </label>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                className="form-control form-control-sm fw-bold"
                                                                placeholder="e.g. 250"
                                                                value={variant.price}
                                                                onChange={(e) => {
                                                                    const newVariants = [...(productForm.variants || [])];
                                                                    newVariants[index] = { ...newVariants[index], price: e.target.value };
                                                                    setProductForm({ ...productForm, variants: newVariants });
                                                                }}
                                                                required={index === 0}
                                                            />
                                                        </div>
                                                        <div className="col-md-3">
                                                            <label className="form-label small fw-bold text-secondary mb-1">
                                                                Discount Price (₹)
                                                            </label>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                className="form-control form-control-sm fw-bold text-success"
                                                                placeholder="e.g. 220"
                                                                value={variant.discountPrice}
                                                                onChange={(e) => {
                                                                    const newVariants = [...(productForm.variants || [])];
                                                                    newVariants[index] = { ...newVariants[index], discountPrice: e.target.value };
                                                                    setProductForm({ ...productForm, variants: newVariants });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
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
