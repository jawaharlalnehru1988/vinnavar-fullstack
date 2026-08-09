import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../../services/api";
import AdminSidebar from "./AdminSidebar";
import AdminSiteAssets from "./AdminSiteAssets";
import AdminBlog from "./AdminBlog";
import AdminCustomers from "./AdminCustomers";
import AdminTestimonials from "./AdminTestimonials";
import AdminComplaints from "./AdminComplaints";
import AdminShippingRates from "./AdminShippingRates";
import AdminReviews from "./AdminReviews";
import AdminProducts from "./AdminProducts";
import AdminCategories from "./AdminCategories";
import AdminOrders from "./AdminOrders";
import AdminOffers from "./AdminOffers";

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

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-slate-600 font-semibold text-sm">Loading Admin Dashboard...</span>
                </div>
            </div>
        );
    }

    const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
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
            <main className="flex-1 p-6 md:p-8 min-w-0 overflow-y-auto">

                {/* OVERVIEW SECTION */}
                {activeTab === "overview" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                            <div>
                                <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                                    <span>📊</span> Dashboard Overview
                                </h2>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time store performance & metrics summary</p>
                            </div>
                        </div>

                        {/* Top Metric Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {/* Revenue Card */}
                            <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white rounded-2xl p-5 shadow-lg shadow-emerald-950/10 relative overflow-hidden group">
                                <div className="absolute -right-4 -bottom-4 opacity-15 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-7xl">💰</span>
                                </div>
                                <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-200">
                                    TOTAL REVENUE
                                </div>
                                <div className="text-3xl font-black mt-2 font-mono">
                                    ₹{totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <div className="mt-2 text-[11px] text-emerald-100 font-medium">All completed & processing orders</div>
                            </div>

                            {/* Products Card */}
                            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg shadow-slate-950/10 relative overflow-hidden group">
                                <div className="absolute -right-4 -bottom-4 opacity-15 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-7xl">📦</span>
                                </div>
                                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                                    PRODUCTS IN STORE
                                </div>
                                <div className="text-3xl font-black mt-2 font-mono text-emerald-400">
                                    {products.length}
                                </div>
                                <div className="mt-2 text-[11px] text-slate-400 font-medium">Active organic catalog items</div>
                            </div>

                            {/* Categories Card */}
                            <div className="bg-gradient-to-br from-teal-700 to-cyan-900 text-white rounded-2xl p-5 shadow-lg shadow-cyan-950/10 relative overflow-hidden group">
                                <div className="absolute -right-4 -bottom-4 opacity-15 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-7xl">🗂️</span>
                                </div>
                                <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-200">
                                    CATEGORIES
                                </div>
                                <div className="text-3xl font-black mt-2 font-mono">
                                    {categories.length}
                                </div>
                                <div className="mt-2 text-[11px] text-cyan-100 font-medium">Organized product sections</div>
                            </div>

                            {/* Total Orders Card */}
                            <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl p-5 shadow-lg shadow-orange-950/10 relative overflow-hidden group">
                                <div className="absolute -right-4 -bottom-4 opacity-15 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-7xl">🚚</span>
                                </div>
                                <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-100">
                                    TOTAL ORDERS
                                </div>
                                <div className="text-3xl font-black mt-2 font-mono">
                                    {orders.length}
                                </div>
                                <div className="mt-2 text-[11px] text-amber-100 font-medium">Placed customer orders</div>
                            </div>
                        </div>

                        {/* Quick Action Hub */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
                            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span>⚡</span> Quick Management Actions
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => setActiveTab("products")}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all duration-150 flex items-center gap-2"
                                >
                                    <span>📦</span> Manage Products
                                </button>
                                <button
                                    onClick={() => setActiveTab("categories")}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm px-4 py-2.5 rounded-xl border border-slate-300 transition-all duration-150 flex items-center gap-2"
                                >
                                    <span>🗂️</span> Manage Categories
                                </button>
                                <button
                                    onClick={() => setActiveTab("offers")}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm px-4 py-2.5 rounded-xl border border-slate-300 transition-all duration-150 flex items-center gap-2"
                                >
                                    <span>🏷️</span> Offers & Discounts
                                </button>
                                <button
                                    onClick={() => setActiveTab("assets")}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm px-4 py-2.5 rounded-xl border border-slate-300 transition-all duration-150 flex items-center gap-2"
                                >
                                    <span>🖼️</span> Site Assets & Sliders
                                </button>
                                <button
                                    onClick={() => setActiveTab("blogs")}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm px-4 py-2.5 rounded-xl border border-slate-300 transition-all duration-150 flex items-center gap-2"
                                >
                                    <span>📝</span> Blog Articles
                                </button>
                                <button
                                    onClick={() => setActiveTab("orders")}
                                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all duration-150 flex items-center gap-2"
                                >
                                    <span>🚚</span> Process Customer Orders
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* PRODUCTS SECTION */}
                {activeTab === "products" && (
                    <AdminProducts
                        products={products}
                        categories={categories}
                        loadData={loadData}
                    />
                )}

                {/* CATEGORIES SECTION */}
                {activeTab === "categories" && (
                    <AdminCategories
                        categories={categories}
                        products={products}
                        loadData={loadData}
                    />
                )}

                {/* OFFERS & DISCOUNTS SECTION */}
                {activeTab === "offers" && (
                    <AdminOffers
                        products={products}
                        loadData={loadData}
                    />
                )}

                {/* ORDERS SECTION */}
                {activeTab === "orders" && (
                    <AdminOrders
                        orders={orders}
                        loadData={loadData}
                    />
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

                {/* CUSTOMER REVIEWS SECTION */}
                {activeTab === "reviews" && <AdminReviews />}
            </main>
        </div>
    );
};

export default AdminDashboard;
