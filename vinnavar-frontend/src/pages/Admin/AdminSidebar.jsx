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
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);

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

    // Find current active item label for mobile header
    const currentNavItem = navItems.find((item) => item.id === activeTab) || navItems[0];

    const handleSelectTab = (tabId) => {
        setActiveTab(tabId);
        setIsMobileOpen(false);
    };

    return (
        <>
            {/* Mobile Top Header (Sticky on small screens) */}
            <header className="md:hidden sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2.5 min-w-0">
                    <img
                        src={getImageUrl("/logo_vinnavar.webp")}
                        alt="Vinnavar Logo"
                        className="w-8 h-8 object-contain rounded-full bg-white p-0.5 shadow-sm ring-1 ring-emerald-500/30 flex-shrink-0"
                    />
                    <div className="truncate">
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-emerald-400 truncate">Vinnavar Admin</span>
                        </div>
                        <div className="text-[11px] text-slate-300 font-medium truncate flex items-center gap-1">
                            <span>Active:</span>
                            <span className="text-emerald-300 font-semibold">{currentNavItem.label}</span>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setIsMobileOpen((prev) => !prev)}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs px-3 py-2 rounded-xl shadow-md transition-all duration-200 flex-shrink-0 border border-emerald-400/30"
                    aria-expanded={isMobileOpen}
                    aria-label="Toggle admin sidebar menu"
                >
                    {isMobileOpen ? (
                        <>
                            <span className="text-sm leading-none">✕</span>
                            <span>Close Menu</span>
                        </>
                    ) : (
                        <>
                            <span className="text-sm leading-none">☰</span>
                            <span>Expand Menu</span>
                        </>
                    )}
                </button>
            </header>

            {/* Backdrop Overlay for Mobile Drawer */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
                    onClick={() => setIsMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar Component */}
            <aside
                className={`bg-slate-900 text-white shadow-2xl flex flex-col p-4 border-r border-slate-800/80 flex-shrink-0 transition-all duration-300 ${
                    isMobileOpen
                        ? "fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] h-full"
                        : "hidden md:flex md:w-72 md:h-screen md:max-h-screen md:sticky md:top-0 md:z-30"
                }`}
            >
                {/* Top Brand Header inside Sidebar */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <img
                            src={getImageUrl("/logo_vinnavar.webp")}
                            alt="Vinnavar Logo"
                            className="w-11 h-11 object-contain rounded-full bg-white p-1 shadow-md ring-2 ring-emerald-500/30"
                        />
                        <div>
                            <h1 className="text-base font-bold text-emerald-400 flex items-center gap-1.5 leading-snug">
                                Vinnavar Admin
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                    Dashboard
                                </span>
                            </h1>
                            <p className="text-xs text-slate-400 font-medium">Organic E-Commerce</p>
                        </div>
                    </div>

                    {/* Close button inside sidebar for mobile */}
                    <button
                        type="button"
                        onClick={() => setIsMobileOpen(false)}
                        className="md:hidden text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg border border-slate-700 transition-all text-xs font-bold"
                        aria-label="Close sidebar menu"
                    >
                        ✕
                    </button>
                </div>

                {/* Vertical Navigation Links */}
                <div className="flex-grow overflow-y-auto pr-1 space-y-4 custom-scrollbar">
                    <div>
                        <span className="uppercase text-slate-400 text-[10px] font-bold tracking-wider px-2 font-mono">
                            Main Menu
                        </span>
                        <ul className="mt-2 space-y-1">
                            {primaryItems.map((item) => {
                                const isTabActive = activeTab === item.id;
                                return (
                                    <li key={item.id}>
                                        <button
                                            type="button"
                                            className={`w-full text-left rounded-xl py-2.5 px-3.5 font-semibold text-sm transition-all duration-200 flex flex-col ${
                                                isTabActive
                                                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-400/40"
                                                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                                            }`}
                                            onClick={() => handleSelectTab(item.id)}
                                        >
                                            <span className="flex items-center gap-2">{item.label}</span>
                                            <span className={`text-xs font-normal mt-0.5 ${isTabActive ? "text-emerald-100" : "text-slate-400"}`}>
                                                {item.desc}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="border-t border-slate-800 my-3"></div>

                    <div>
                        <span className="uppercase text-slate-400 text-[10px] font-bold tracking-wider px-2 font-mono">
                            Management & Content
                        </span>
                        <ul className="mt-2 space-y-1">
                            {secondaryItems.map((item) => {
                                const isTabActive = activeTab === item.id;
                                return (
                                    <React.Fragment key={item.id}>
                                        <li>
                                            <button
                                                type="button"
                                                className={`w-full text-left rounded-xl py-2.5 px-3.5 font-semibold text-sm transition-all duration-200 flex flex-col ${
                                                    isTabActive
                                                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-400/40"
                                                        : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                                                }`}
                                                onClick={() => handleSelectTab(item.id)}
                                            >
                                                <span className="flex items-center gap-2">{item.label}</span>
                                                <span className={`text-xs font-normal mt-0.5 ${isTabActive ? "text-emerald-100" : "text-slate-400"}`}>
                                                    {item.desc}
                                                </span>
                                            </button>
                                        </li>

                                        {/* Sub-menu for Site Assets */}
                                        {item.id === "assets" && isTabActive && (
                                            <li className="pl-3 pr-2 py-2.5 my-1.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                                                <div className="text-[11px] font-bold font-mono text-emerald-400 mb-2">
                                                    Asset Filter:
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {allGroupsList.map((group) => {
                                                        const isGroupActive = selectedAssetGroup === group;
                                                        return (
                                                            <button
                                                                key={group}
                                                                type="button"
                                                                className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition-all duration-150 border ${
                                                                    isGroupActive
                                                                        ? "bg-amber-400 text-slate-950 border-amber-300 shadow-sm"
                                                                        : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white"
                                                                }`}
                                                                onClick={() => {
                                                                    if (setSelectedAssetGroup) setSelectedAssetGroup(group);
                                                                    setIsMobileOpen(false);
                                                                }}
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
                </div>

                {/* Mobile View explicit collapse button at bottom */}
                <div className="md:hidden mt-3 mb-2">
                    <button
                        type="button"
                        onClick={() => setIsMobileOpen(false)}
                        className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                        <span>✕</span> Close Menu & View Content
                    </button>
                </div>

                {/* Bottom User / Logout Section */}
                <div className="pt-3 mt-1 border-t border-slate-800 flex items-center justify-between">
                    <div>
                        <div className="font-bold text-slate-200 text-xs">vinnavar_admin</div>
                        <div className="text-emerald-400 text-[10px] font-medium flex items-center gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active Admin
                        </div>
                    </div>
                    <button
                        type="button"
                        className="text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-600 hover:text-white border border-rose-500/30 px-3 py-1.5 rounded-full transition-all duration-200 shadow-sm flex items-center gap-1"
                        onClick={onLogout}
                    >
                        🚪 Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
