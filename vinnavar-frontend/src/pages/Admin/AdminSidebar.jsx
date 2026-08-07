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
        { id: "overview", label: "📊 Dashboard", desc: "Store stats" },
        { id: "categories", label: "🗂️ Categories", desc: "Product categories" },
        { id: "products", label: "📦 Products", desc: "Manage catalog" },
        { id: "offers", label: "🏷️ Offers & Discounts", desc: "Deals & special prices" },
        { id: "orders", label: "🚚 Customer Orders", desc: "View & track orders" },
        { id: "shipping", label: "🚛 Shipping Rates", desc: "Weight & zone rates" },
        { id: "reviews", label: "⭐ Customer Reviews", desc: "Ratings & photo reviews" },
        { id: "customers", label: "👥 Customers", desc: "Customer profiles" },
        { id: "testimonials", label: "💬 Testimonials", desc: "Customer reviews" },
        { id: "assets", label: "🖼️ Site Assets", desc: "Banners & sliders", isDropdown: true },
        { id: "complaints", label: "📢 Complaints", desc: "Support tickets" },
        { id: "blogs", label: "📝 Blog Articles", desc: "Posts & recipes" }
    ];

    const primaryItems = navItems.slice(0, 9);
    const secondaryItems = navItems.slice(9);

    const allGroupsList = ["ALL", ...assetGroups.filter((g) => g !== "ALL")];

    return (
        <div
            className="bg-dark text-white shadow d-flex flex-column flex-shrink-0 p-3"
            style={{ width: "270px", height: "100vh", maxHeight: "100vh", position: "sticky", top: 0, zIndex: 1000 }}
        >
            {/* Top Brand Header */}
            <div className="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom border-secondary border-opacity-50">
                <img
                    src={getImageUrl("/media/site/vinnavar_logo.png")}
                    alt="Vinnavar Logo"
                    style={{ width: "42px", height: "42px", objectFit: "contain", borderRadius: "50%", backgroundColor: "#fff", padding: "2px" }}
                    className="shadow-sm"
                />
                <div>
                    <h6 className="m-0 fw-bold text-success d-flex align-items-center gap-1">
                        Vinnavar Admin <span className="badge bg-success-subtle text-success border border-success" style={{ fontSize: "10px" }}>Dashboard</span>
                    </h6>
                    <small className="text-white-50" style={{ fontSize: "11px" }}>Organic E-Commerce</small>
                </div>
            </div>

            {/* Vertical Navigation Links */}
            <div className="flex-grow-1 overflow-y-auto pe-1" style={{ scrollbarWidth: "thin" }}>
                <small className="text-uppercase text-white-50 fw-bold font-monospace px-2" style={{ fontSize: "11px" }}>Main Menu</small>
                <ul className="nav nav-pills flex-column gap-1 mt-2 mb-3">
                    {primaryItems.map((item) => {
                        const isTabActive = activeTab === item.id;
                        return (
                            <li key={item.id} className="nav-item">
                                <button
                                    type="button"
                                    className={`nav-link w-100 text-start rounded-3 py-2 px-3 fw-bold transition-all border-0 ${
                                        isTabActive
                                            ? "bg-success text-white shadow-sm"
                                            : "text-light hover-bg-secondary bg-transparent"
                                    }`}
                                    onClick={() => setActiveTab(item.id)}
                                    style={{ fontSize: "14px" }}
                                >
                                    <div>{item.label}</div>
                                    <div className="small fw-normal opacity-75" style={{ fontSize: "11px" }}>
                                        {item.desc}
                                    </div>
                                </button>
                            </li>
                        );
                    })}
                </ul>

                <hr className="border-secondary border-opacity-50 my-2" />

                <small className="text-uppercase text-white-50 fw-bold font-monospace px-2" style={{ fontSize: "11px" }}>Management & Content</small>
                <ul className="nav nav-pills flex-column gap-1 mt-2">
                    {secondaryItems.map((item) => {
                        const isTabActive = activeTab === item.id;
                        return (
                            <React.Fragment key={item.id}>
                                <li className="nav-item">
                                    <button
                                        type="button"
                                        className={`nav-link w-100 text-start rounded-3 py-2 px-3 fw-bold transition-all border-0 ${
                                            isTabActive
                                                ? "bg-success text-white shadow-sm"
                                                : "text-light hover-bg-secondary bg-transparent"
                                        }`}
                                        onClick={() => setActiveTab(item.id)}
                                        style={{ fontSize: "14px" }}
                                    >
                                        <div>{item.label}</div>
                                        <div className="small fw-normal opacity-75" style={{ fontSize: "11px" }}>
                                            {item.desc}
                                        </div>
                                    </button>
                                </li>

                                {/* Sub-menu for Site Assets */}
                                {item.id === "assets" && isTabActive && (
                                    <li className="ps-3 pe-2 py-2 my-1 rounded-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.35)", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
                                        <div className="small fw-bold font-monospace mb-2" style={{ color: "#4ade80", fontSize: "11px" }}>
                                            Asset Filter:
                                        </div>
                                        <div className="d-flex flex-wrap gap-1">
                                            {allGroupsList.map((group) => {
                                                const isGroupActive = selectedAssetGroup === group;
                                                return (
                                                    <button
                                                        key={group}
                                                        type="button"
                                                        className={`btn btn-sm rounded-pill px-2.5 py-1 fw-bold transition-all border ${
                                                            isGroupActive
                                                                ? "bg-warning text-dark border-warning shadow-sm"
                                                                : "bg-dark text-white border-secondary hover-bg-secondary"
                                                        }`}
                                                        onClick={() => {
                                                            if (setSelectedAssetGroup) setSelectedAssetGroup(group);
                                                        }}
                                                        style={{ fontSize: "11px" }}
                                                    >
                                                        {getGroupIcon(group)} {formatGroupLabel(group)}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </li>
                                )}
                            </React.Fragment>
                        );
                    })}
                </ul>
            </div>

            {/* Bottom User / Logout Section */}
            <div className="pt-3 mt-3 border-top border-secondary border-opacity-50 d-flex align-items-center justify-content-between">
                <div>
                    <div className="fw-bold text-light small">vinnavar_admin</div>
                    <small className="text-success" style={{ fontSize: "10px" }}>● Active Admin</small>
                </div>
                <button
                    className="btn btn-outline-danger btn-sm rounded-pill px-3 py-1 fw-bold d-flex align-items-center gap-1 shadow-sm"
                    onClick={onLogout}
                >
                    🚪 Logout
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;

