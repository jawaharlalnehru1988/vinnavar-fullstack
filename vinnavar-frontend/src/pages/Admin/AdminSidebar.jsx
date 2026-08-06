import React from "react";
import { getImageUrl } from "../../services/api";

const formatGroupLabel = (group) => {
    if (!group) return "General";
    if (group === "ALL") return "All Site Assets";
    if (group === "GENERAL") return "General Assets";
    if (group === "HERO_SLIDER") return "Hero Sliders";
    if (group === "PROMO_BANNER") return "Promo Banners";
    if (group === "LABELS") return "Labels & Banners";
    if (group === "LOGO") return "Store Logos";
    if (group === "FOOTER") return "Footer & Contact";
    if (group === "POLICIES") return "Store Policies";
    return group
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
};

const getGroupIcon = (group) => {
    switch (group) {
        case "ALL":
            return "📌";
        case "GENERAL":
            return "⚙️";
        case "HERO_SLIDER":
            return "🖼️";
        case "PROMO_BANNER":
            return "📢";
        case "LABELS":
            return "🏷️";
        case "LOGO":
            return "🎨";
        case "FOOTER":
            return "📞";
        case "POLICIES":
            return "📜";
        default:
            return "📁";
    }
};

const AdminSidebar = ({
    activeTab,
    setActiveTab,
    selectedAssetGroup = "ALL",
    setSelectedAssetGroup,
    assetGroups = ["GENERAL", "HERO_SLIDER", "PROMO_BANNER", "LABELS", "LOGO", "FOOTER", "POLICIES"],
    onLogout
}) => {
    const navItems = [
        { id: "overview", label: "📊 Overview", desc: "Store stats" },
        { id: "products", label: "📦 Products", desc: "Manage catalog" },
        { id: "categories", label: "🗂️ Categories", desc: "Product categories" },
        { id: "customers", label: "👥 Customers", desc: "Customer profiles" },
        { id: "testimonials", label: "💬 Testimonials", desc: "Customer reviews" },
        { id: "assets", label: "🖼️ Site Assets", desc: "Banners & sliders", isDropdown: true },
        { id: "complaints", label: "📢 Complaints", desc: "Support tickets" },
        { id: "blogs", label: "📝 Blog Articles", desc: "Posts & recipes" },
        { id: "orders", label: "🚚 Customer Orders", desc: "View & track orders" }
    ];

    const allGroupsList = ["ALL", ...assetGroups.filter((g) => g !== "ALL")];

    return (
        <div className="bg-dark text-white shadow-sm border-bottom border-secondary">
            {/* Top Header Bar */}
            <div className="container-fluid px-4 py-3 border-bottom border-secondary border-opacity-50 d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div className="d-flex align-items-center gap-3">
                    <img
                        src={getImageUrl("/media/site/vinnavar_logo.png")}
                        alt="Vinnavar Logo"
                        style={{ width: "42px", height: "42px", objectFit: "contain", borderRadius: "50%", backgroundColor: "#fff", padding: "2px" }}
                        className="shadow-sm"
                    />
                    <div>
                        <h5 className="m-0 fw-bold text-success d-flex align-items-center gap-2">
                            Vinnavar Admin <span className="badge bg-success-subtle text-success fs-6 border border-success">Dashboard</span>
                        </h5>
                        <small className="text-white-50">Organic E-Commerce Management Platform</small>
                    </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                    <div className="text-end d-none d-sm-block">
                        <div className="fw-bold text-light">vinnavar_admin</div>
                        <small className="text-success">● Active Administrator</small>
                    </div>
                    <button
                        className="btn btn-outline-danger btn-sm rounded-pill px-3 py-1.5 fw-bold d-flex align-items-center gap-1 shadow-sm"
                        onClick={onLogout}
                    >
                        🚪 Logout
                    </button>
                </div>
            </div>

            {/* Horizontal Top Navigation Tabs Bar */}
            <div className="container-fluid px-4 bg-dark bg-opacity-75 overflow-x-auto">
                <ul className="nav nav-tabs border-0 flex-nowrap py-2 gap-2">
                    {navItems.map((item) => {
                        const isTabActive = activeTab === item.id;
                        return (
                            <li key={item.id} className="nav-item">
                                <button
                                    type="button"
                                    className={`nav-link text-nowrap rounded-3 py-2 px-3 fw-bold border-0 transition-all ${
                                        isTabActive
                                            ? "bg-success text-white shadow-sm"
                                            : "text-light hover-bg-secondary bg-transparent"
                                    }`}
                                    onClick={() => setActiveTab(item.id)}
                                    style={{ fontSize: "14px" }}
                                >
                                    <div className="d-flex align-items-center gap-2">
                                        <span>{item.label}</span>
                                    </div>
                                    <div className="small fw-normal opacity-75 text-start" style={{ fontSize: "10px" }}>
                                        {item.desc}
                                    </div>
                                </button>
                            </li>
                        );
                    })}
                </ul>

                {/* Sub-menu bar for Site Assets group filtering if active */}
                {activeTab === "assets" && (
                    <div className="py-2 border-top border-secondary border-opacity-50 d-flex flex-wrap align-items-center gap-2">
                        <span className="small fw-bold text-success font-monospace me-2">Asset Group Filter:</span>
                        {allGroupsList.map((group) => {
                            const isGroupActive = selectedAssetGroup === group;
                            return (
                                <button
                                    key={group}
                                    type="button"
                                    className={`btn btn-sm rounded-pill px-3 py-1 fw-bold transition-all ${
                                        isGroupActive
                                            ? "bg-warning text-dark shadow-sm"
                                            : "btn-outline-secondary text-light"
                                    }`}
                                    onClick={() => {
                                        if (setSelectedAssetGroup) setSelectedAssetGroup(group);
                                    }}
                                    style={{ fontSize: "12px" }}
                                >
                                    {getGroupIcon(group)} {formatGroupLabel(group)}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSidebar;
