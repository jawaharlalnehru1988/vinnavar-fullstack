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
            password: "" // Blank by default, updated only if typed
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
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
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
        <div className="container-fluid p-4">
            {/* Header Section */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom gap-3">
                <div>
                    <h3 className="fw-bold mb-1 d-flex align-items-center gap-2 text-dark">
                        <span>👥 Registered Customers</span>
                        <span className="badge bg-success rounded-pill fs-6 px-3" style={{ backgroundColor: "#2d6a4f" }}>
                            {customers.length} Total
                        </span>
                    </h3>
                    <p className="text-muted mb-0 small">
                        Manage customer accounts, update profile information, or perform CRUD operations.
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-success fw-bold d-flex align-items-center gap-2 px-3 py-2 rounded-3 shadow-sm"
                        style={{ backgroundColor: "#2d6a4f", borderColor: "#2d6a4f" }}
                        onClick={handleOpenAddModal}
                    >
                        <span>➕</span>
                        <span>Add Customer</span>
                    </button>
                    <button
                        className="btn btn-outline-secondary fw-semibold d-flex align-items-center gap-2 px-3 py-2 rounded-3"
                        onClick={loadCustomers}
                    >
                        <span>🔄</span>
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Filter / Search Bar */}
            <div className="card border-0 shadow-sm mb-4 rounded-3">
                <div className="card-body p-3">
                    <div className="row g-3 align-items-center">
                        <div className="col-12 col-md-6">
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0 text-muted">🔍</span>
                                <input
                                    type="text"
                                    className="form-control border-start-0 ps-0"
                                    placeholder="Search customers by Name, Mobile Number, or Email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button
                                        className="btn btn-link text-muted text-decoration-none border-0"
                                        onClick={() => setSearchQuery("")}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="col-12 col-md-6 text-md-end text-muted small">
                            Showing <strong className="text-dark">{filteredCustomers.length}</strong> of <strong className="text-dark">{customers.length}</strong> customers
                        </div>
                    </div>
                </div>
            </div>

            {/* Customers Table */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light text-muted text-uppercase small" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                            <tr>
                                <th className="ps-4 py-3">Customer</th>
                                <th className="py-3">Mobile Number</th>
                                <th className="py-3">Email Address</th>
                                <th className="py-3">Joined Date</th>
                                <th className="text-end pe-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-5">
                                        <div className="spinner-border text-success" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <div className="mt-2 text-muted small">Fetching registered customers...</div>
                                    </td>
                                </tr>
                            ) : filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">
                                        <div className="fs-1 mb-2">👤</div>
                                        <div className="fw-bold">No customers found</div>
                                        <div className="small text-muted mt-1">
                                            {searchQuery ? "Try refining your search filter query." : "No registered customers yet."}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((cust) => (
                                    <tr key={cust.id}>
                                        <td className="ps-4 py-3">
                                            <div className="d-flex align-items-center gap-3">
                                                <span
                                                    className="d-inline-flex align-items-center justify-content-center rounded-circle text-white fw-bold shadow-sm"
                                                    style={{
                                                        width: "40px",
                                                        height: "40px",
                                                        fontSize: "14px",
                                                        backgroundColor: "#2d6a4f"
                                                    }}
                                                >
                                                    {getUserInitials(cust.name)}
                                                </span>
                                                <div>
                                                    <div className="fw-bold text-dark">{cust.name}</div>
                                                    <small className="text-muted">ID: #{cust.id}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 fw-semibold text-dark">
                                            📱 +91 {cust.mobileNumber}
                                        </td>
                                        <td className="py-3 text-muted">
                                            {cust.email ? <span>✉️ {cust.email}</span> : <span className="badge bg-light text-secondary">N/A</span>}
                                        </td>
                                        <td className="py-3 text-muted small">
                                            📅 {cust.createdAt ? new Date(cust.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Recent"}
                                        </td>
                                        <td className="text-end pe-4 py-3">
                                            <div className="d-flex justify-content-end gap-2">
                                                <button
                                                    className="btn btn-sm btn-outline-primary fw-semibold px-3 rounded-pill"
                                                    onClick={() => handleOpenEditModal(cust)}
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger fw-semibold px-3 rounded-pill"
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
                <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1055 }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content shadow-lg border-0 rounded-4">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold text-success">
                                    {modalMode === "ADD" ? "➕ Add New Customer" : `✏️ Edit Customer (${selectedCustomer?.name})`}
                                </h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <form onSubmit={handleSubmitForm}>
                                <div className="modal-body py-3">
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Full Name *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g. Jawaharlal Nehru"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Mobile Phone Number *</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light fw-bold text-muted">+91</span>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                placeholder="e.g. 9876543210"
                                                value={formData.mobileNumber}
                                                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Email Address (Optional)</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                     <div className="mb-3">
                                         <label className="form-label small fw-bold">
                                             {modalMode === "ADD" ? "Password *" : "Password (Leave blank to keep existing)"}
                                         </label>
                                         <div className="input-group">
                                             <input
                                                 type={showPassword ? "text" : "password"}
                                                 className="form-control"
                                                 placeholder={modalMode === "ADD" ? "Enter password" : "Enter new password if changing"}
                                                 value={formData.password}
                                                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                 required={modalMode === "ADD"}
                                             />
                                             <button
                                                 className="btn btn-outline-secondary bg-white text-muted border-start-0"
                                                 type="button"
                                                 onClick={() => setShowPassword(!showPassword)}
                                                 title={showPassword ? "Hide password" : "Show password"}
                                                 style={{ borderColor: "#ced4da" }}
                                             >
                                                 {showPassword ? "🙈" : "👁️"}
                                             </button>
                                         </div>
                                     </div>
                                </div>
                                <div className="modal-footer border-0 pt-0">
                                    <button type="button" className="btn btn-light fw-semibold px-4 rounded-3" onClick={handleCloseModal}>
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-success fw-bold px-4 rounded-3"
                                        style={{ backgroundColor: "#2d6a4f", borderColor: "#2d6a4f" }}
                                        disabled={submitting}
                                    >
                                        {submitting ? "Saving..." : modalMode === "ADD" ? "Create Customer" : "Update Customer"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCustomers;
