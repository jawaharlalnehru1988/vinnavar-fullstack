import React, { useState, useEffect } from "react";
import { fetchAdminCustomers, createAdminCustomer, updateAdminCustomer, deleteAdminCustomer } from "../../services/api";
import Swal from "sweetalert2";

const AdminCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal state for Add/Edit
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("ADD"); // "ADD" | "EDIT"
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Form inputs
    const [formData, setFormData] = useState({
        name: "",
        mobileNumber: "",
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const loadCustomers = async () => {
        setLoading(true);
        try {
            const data = await fetchAdminCustomers();
            setCustomers(data);
        } catch (err) {
            console.error("Failed to fetch customers", err);
            Swal.fire("Error", "Failed to load customer list.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCustomers();
    }, []);

    const getUserInitials = (name) => {
        if (!name || typeof name !== "string") return "CU";
        const parts = name.trim().split(/\s+/).filter(Boolean);
        if (parts.length === 0) return "CU";
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        const single = parts[0];
        return single.length >= 2 ? single.substring(0, 2).toUpperCase() : single.toUpperCase();
    };

    const handleOpenAddModal = () => {
        setModalMode("ADD");
        setSelectedCustomer(null);
        setFormData({ name: "", mobileNumber: "", email: "", password: "" });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (cust) => {
        setModalMode("EDIT");
        setSelectedCustomer(cust);
        setFormData({
            name: cust.name || "",
            mobileNumber: cust.mobileNumber || "",
            email: cust.email || "",
            password: ""
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (modalMode === "ADD") {
                await createAdminCustomer(formData);
                Swal.fire({
                    icon: "success",
                    title: "Customer Created! 🎉",
                    text: `Customer ${formData.name} added successfully.`,
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                await updateAdminCustomer(selectedCustomer.id, formData);
                Swal.fire({
                    icon: "success",
                    title: "Customer Updated! ✏️",
                    text: `Customer profile updated successfully.`,
                    timer: 2000,
                    showConfirmButton: false
                });
            }
            handleCloseModal();
            loadCustomers();
        } catch (err) {
            Swal.fire("Error", err.message || "Failed to save customer.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (cust) => {
        const result = await Swal.fire({
            title: `Delete ${cust.name}?`,
            text: "This customer profile will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e11d48",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Yes, Delete Profile"
        });

        if (result.isConfirmed) {
            try {
                await deleteAdminCustomer(cust.id);
                Swal.fire("Deleted!", `${cust.name} has been removed.`, "success");
                loadCustomers();
            } catch (err) {
                Swal.fire("Error", err.message || "Failed to delete customer.", "error");
            }
        }
    };

    const filteredCustomers = customers.filter((cust) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        const name = (cust.name || "").toLowerCase();
        const mobile = (cust.mobileNumber || "").toLowerCase();
        const email = (cust.email || "").toLowerCase();
        return name.includes(query) || mobile.includes(query) || email.includes(query);
    });

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <span>👥</span> Registered Customers
                        <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-xs font-bold px-3 py-1 rounded-full font-mono">
                            {customers.length} Total
                        </span>
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Manage customer accounts, update profile information, or perform CRUD operations
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                        onClick={handleOpenAddModal}
                    >
                        <span>➕</span> Add Customer
                    </button>
                    <button
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 transition-all flex items-center gap-1.5"
                        onClick={loadCustomers}
                    >
                        <span>🔄</span> Refresh
                    </button>
                </div>
            </div>

            {/* Filter / Search Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
                <div className="relative w-full max-w-md">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs text-slate-400">🔍</span>
                    <input
                        type="text"
                        className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
                        placeholder="Search customers by Name, Mobile Number, or Email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 font-bold"
                            onClick={() => setSearchQuery("")}
                        >
                            ✕
                        </button>
                    )}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                    Showing <strong className="text-slate-800">{filteredCustomers.length}</strong> of <strong className="text-slate-800">{customers.length}</strong> customers
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs font-bold font-mono uppercase tracking-wider">
                                <th className="py-3.5 px-4">Customer</th>
                                <th className="py-3.5 px-4">Mobile Number</th>
                                <th className="py-3.5 px-4">Email Address</th>
                                <th className="py-3.5 px-4">Joined Date</th>
                                <th className="py-3.5 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center">
                                        <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-xs text-slate-500 font-bold mt-2">Fetching registered customers...</p>
                                    </td>
                                </tr>
                            ) : filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-slate-500 font-medium">
                                        <div className="text-4xl mb-2 opacity-40">👤</div>
                                        <div className="font-bold text-slate-800">No customers found</div>
                                        <div className="text-xs text-slate-400 mt-1">
                                            {searchQuery ? "Try refining your search filter query." : "No registered customers yet."}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((cust) => (
                                    <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                                                    {getUserInitials(cust.name)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{cust.name}</div>
                                                    <div className="text-xs font-mono text-slate-400">ID: #{cust.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 font-semibold text-slate-800">
                                            📱 +91 {cust.mobileNumber}
                                        </td>
                                        <td className="py-3 px-4 text-slate-500 text-xs">
                                            {cust.email ? (
                                                <span>✉️ {cust.email}</span>
                                            ) : (
                                                <span className="bg-slate-100 text-slate-400 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-md">N/A</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-slate-400 text-xs">
                                            📅 {cust.createdAt ? new Date(cust.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Recent"}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-300 transition-all shadow-xs"
                                                    onClick={() => handleOpenEditModal(cust)}
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-rose-200 transition-all shadow-xs"
                                                    onClick={() => handleDelete(cust)}
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Custom Modal for Add / Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-100 overflow-hidden">
                        <div className="bg-emerald-700 text-white px-6 py-4 flex items-center justify-between">
                            <h3 className="text-base font-extrabold flex items-center gap-2">
                                <span>👤</span> {modalMode === "ADD" ? "Add New Customer" : `Edit Customer (${selectedCustomer?.name})`}
                            </h3>
                            <button
                                type="button"
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white font-bold transition-all"
                                onClick={handleCloseModal}
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                                    placeholder="e.g. Jawaharlal Nehru"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Mobile Phone Number *</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-slate-400">+91</span>
                                    <input
                                        type="tel"
                                        className="w-full pl-11 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                                        placeholder="e.g. 9876543210"
                                        value={formData.mobileNumber}
                                        onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address (Optional)</label>
                                <input
                                    type="email"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    {modalMode === "ADD" ? "Password *" : "Password (Leave blank to keep existing)"}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                                        placeholder={modalMode === "ADD" ? "Enter password" : "Enter new password if changing"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required={modalMode === "ADD"}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl"
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs disabled:opacity-50"
                                    disabled={submitting}
                                >
                                    {submitting ? "Saving..." : modalMode === "ADD" ? "Create Customer" : "Update Customer"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCustomers;
