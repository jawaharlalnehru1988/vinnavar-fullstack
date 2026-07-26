import React, { useState } from "react";
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
        default:
            return "📁";
    }
};

const AdminSidebar = ({
    activeTab,
    setActiveTab,
    selectedAssetGroup = "ALL",
    setSelectedAssetGroup,
    assetGroups = ["GENERAL", "HERO_SLIDER", "PROMO_BANNER", "LABELS", "LOGO", "FOOTER"],
    onLogout
}) => {
    const [assetsSubmenuOpen, setAssetsSubmenuOpen] = useState(true);

    const navItems = [
        { id: "overview", label: "📊 Overview", desc: "Store statistics & metrics" },
        { id: "products", label: "📦 Product Catalog", desc: "Add, edit, delete products & images" },
        { id: "categories", label: "🗂️ Categories", desc: "Manage product categories" },
        { id: "assets", label: "🖼️ Site Assets & Images", desc: "Manage store logo, hero sliders & banners", isDropdown: true },
        { id: "blogs", label: "📝 Blog Articles", desc: "Manage blog posts & recipes" },
        { id: "orders", label: "🚚 Customer Orders", desc: "View orders & update order statuses" }
    ];

    const allGroupsList = ["ALL", ...assetGroups.filter((g) => g !== "ALL")];

    return (
        <div className="d-flex flex-column bg-dark text-white p-3 min-vh-100 shadow" style={{ width: "290px", minWidth: "290px" }}>
            {/* Header Brand */}
            <div className="d-flex align-items-center mb-4 px-2 pb-3 border-bottom border-secondary">
                <img
                    src={getImageUrl("/media/site/vinnavar_logo.png")}
                    alt="Vinnavar Logo"
                    style={{ width: "45px", height: "45px", objectFit: "contain", borderRadius: "50%", backgroundColor: "#fff", padding: "2px" }}
                    className="me-2 shadow-sm"
                />
                <div>
                    <h5 className="m-0 fw-bold text-success">Vinnavar Admin</h5>
                    <small className="text-muted">E-Commerce Management</small>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="nav nav-pills flex-column mb-auto gap-2">
                {navItems.map((item) => {
                    const isAssetsTab = item.id === "assets";
                    const isTabActive = activeTab === item.id;

                    if (isAssetsTab) {
                        return (
                            <div key={item.id} className="rounded-3 border border-secondary border-opacity-25 overflow-hidden">
                                {/* Collapsible Header for Site Assets */}
                                <button
                                    className={`nav-link text-start w-100 py-3 px-3 fw-bold border-0 d-flex justify-content-between align-items-center ${
                                        isTabActive ? "bg-success text-white shadow-sm" : "text-light hover-bg-secondary"
                                    }`}
                                    onClick={() => {
                                        if (activeTab !== "assets") {
                                            setActiveTab("assets");
                                            setAssetsSubmenuOpen(true);
                                        } else {
                                            setAssetsSubmenuOpen(!assetsSubmenuOpen);
                                        }
                                    }}
                                    style={{ transition: "all 0.2s" }}
                                >
                                    <div>
                                        <div className="fs-6">{item.label}</div>
                                        <div className="small fw-normal text-white-50" style={{ fontSize: "11px" }}>
                                            {item.desc}
                                        </div>
                                    </div>
                                    <span className="fs-5 fw-bold ms-2">{assetsSubmenuOpen ? "—" : "+"}</span>
                                </button>

                                {/* Nested Categories Sub-Menu as in Image 2 */}
                                {assetsSubmenuOpen && (
                                    <div className="bg-secondary bg-opacity-25 py-2 px-2 border-top border-secondary border-opacity-25">
                                        <div className="px-2 py-1 small fw-bold text-uppercase text-success font-monospace" style={{ fontSize: "10px", letterSpacing: "1px" }}>
                                            Asset Categories
                                        </div>
                                        {allGroupsList.map((group) => {
                                            const isGroupActive = isTabActive && selectedAssetGroup === group;
                                            return (
                                                <button
                                                    key={group}
                                                    className={`btn btn-sm text-start w-100 py-2 px-3 my-1 rounded border-0 d-flex align-items-center justify-content-between ${
                                                        isGroupActive
                                                            ? "bg-warning text-dark fw-bold shadow-sm"
                                                            : "text-light hover-bg-secondary"
                                                    }`}
                                                    onClick={() => {
                                                        setActiveTab("assets");
                                                        if (setSelectedAssetGroup) {
                                                            setSelectedAssetGroup(group);
                                                        }
                                                    }}
                                                    style={{
                                                        transition: "all 0.15s",
                                                        fontSize: "13px",
                                                        backgroundColor: isGroupActive ? "#ffecb3" : "transparent"
                                                    }}
                                                >
                                                    <span className="d-flex align-items-center gap-2">
                                                        <span>{getGroupIcon(group)}</span>
                                                        <span>{formatGroupLabel(group)}</span>
                                                    </span>
                                                    {isGroupActive && <span className="badge bg-dark text-white rounded-pill ms-2" style={{ fontSize: "10px" }}>Active</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <button
                            key={item.id}
                            className={`nav-link text-start py-3 px-3 rounded-3 fw-bold border-0 ${
                                isTabActive ? "bg-success text-white shadow-sm" : "text-light hover-bg-secondary"
                            }`}
                            onClick={() => setActiveTab(item.id)}
                            style={{ transition: "all 0.2s" }}
                        >
                            <div className="fs-6">{item.label}</div>
                            <div className="small fw-normal text-muted" style={{ fontSize: "11px" }}>
                                {item.desc}
                            </div>
                        </button>
                    );
                })}
            </nav>

            {/* Logout section */}
            <div className="pt-3 border-top border-secondary">
                <div className="small text-muted mb-2 px-2">User: vinnavar (Admin)</div>
                <button className="btn btn-outline-danger w-100 fw-bold py-2" onClick={onLogout}>
                    🚪 Logout
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
