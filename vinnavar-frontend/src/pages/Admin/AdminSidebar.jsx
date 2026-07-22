import React from "react";

const AdminSidebar = ({ activeTab, setActiveTab, onLogout }) => {
    const navItems = [
        { id: "overview", label: "📊 Overview", desc: "Store statistics & metrics" },
        { id: "products", label: "📦 Product Catalog", desc: "Add, edit, delete products & images" },
        { id: "categories", label: "🗂️ Categories", desc: "Manage product categories" },
        { id: "assets", label: "🖼️ Site Assets & Images", desc: "Manage store logo, hero sliders & banners" },
        { id: "orders", label: "🚚 Customer Orders", desc: "View orders & update order statuses" }
    ];

    return (
        <div className="d-flex flex-column bg-dark text-white p-3 min-vh-100 shadow" style={{ width: "280px", minWidth: "280px" }}>
            <div className="d-flex align-items-center mb-4 px-2 pb-3 border-bottom border-secondary">
                <span className="fs-2 me-2">🌿</span>
                <div>
                    <h5 className="m-0 fw-bold text-success">Vinnavar Admin</h5>
                    <small className="text-muted">E-Commerce Management</small>
                </div>
            </div>

            <nav className="nav nav-pills flex-column mb-auto gap-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        className={`nav-link text-start py-3 px-3 rounded-3 fw-bold border-0 ${
                            activeTab === item.id ? "bg-success text-white shadow-sm" : "text-light hover-bg-secondary"
                        }`}
                        onClick={() => setActiveTab(item.id)}
                        style={{ transition: "all 0.2s" }}
                    >
                        <div className="fs-6">{item.label}</div>
                        <div className="small fw-normal text-muted" style={{ fontSize: "11px" }}>
                            {item.desc}
                        </div>
                    </button>
                ))}
            </nav>

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
