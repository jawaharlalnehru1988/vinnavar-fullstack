import React, { useState, useEffect } from "react";
import { fetchAdminTestimonials, createAdminTestimonial, updateAdminTestimonial, deleteAdminTestimonial } from "../../services/api";
import Swal from "sweetalert2";

const AdminTestimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal state for Add/Edit
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("ADD"); // "ADD" | "EDIT"
    const [selectedTestimonial, setSelectedTestimonial] = useState(null);

    // Form inputs
    const [formData, setFormData] = useState({
        customerName: "",
        customerLocation: "",
        rating: 5,
        reviewText: "",
        productName: "",
        active: true
    });
    const [submitting, setSubmitting] = useState(false);

    const loadTestimonials = async () => {
        setLoading(true);
        try {
            const data = await fetchAdminTestimonials();
            setTestimonials(data);
        } catch (err) {
            console.error("Failed to fetch testimonials", err);
            Swal.fire("Error", "Failed to load testimonials list.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTestimonials();
    }, []);

    const handleOpenAddModal = () => {
        setModalMode("ADD");
        setSelectedTestimonial(null);
        setFormData({
            customerName: "",
            customerLocation: "",
            rating: 5,
            reviewText: "",
            productName: "",
            active: true
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item) => {
        setModalMode("EDIT");
        setSelectedTestimonial(item);
        setFormData({
            customerName: item.customerName || "",
            customerLocation: item.customerLocation || "",
            rating: item.rating || 5,
            reviewText: item.reviewText || "",
            productName: item.productName || "",
            active: item.active !== false
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
                await createAdminTestimonial(formData);
                Swal.fire({
                    icon: "success",
                    title: "Testimonial Created! 🎉",
                    text: `Testimonial from ${formData.customerName} added successfully.`,
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                await updateAdminTestimonial(selectedTestimonial.id, formData);
                Swal.fire({
                    icon: "success",
                    title: "Testimonial Updated! ✏️",
                    text: `Testimonial updated successfully.`,
                    timer: 2000,
                    showConfirmButton: false
                });
            }
            handleCloseModal();
            loadTestimonials();
        } catch (err) {
            Swal.fire("Error", err.message || "Failed to save testimonial.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleActive = async (item) => {
        try {
            await updateAdminTestimonial(item.id, { ...item, active: !item.active });
            loadTestimonials();
        } catch (err) {
            Swal.fire("Error", "Failed to update status.", "error");
        }
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: `Delete Review by ${item.customerName}?`,
            text: "This testimonial will be permanently deleted from the database.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, Delete"
        });

        if (result.isConfirmed) {
            try {
                await deleteAdminTestimonial(item.id);
                Swal.fire("Deleted!", "Testimonial has been removed.", "success");
                loadTestimonials();
            } catch (err) {
                Swal.fire("Error", err.message || "Failed to delete testimonial.", "error");
            }
        }
    };

    const filteredTestimonials = testimonials.filter((item) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        const name = (item.customerName || "").toLowerCase();
        const location = (item.customerLocation || "").toLowerCase();
        const text = (item.reviewText || "").toLowerCase();
        const product = (item.productName || "").toLowerCase();
        return name.includes(query) || location.includes(query) || text.includes(query) || product.includes(query);
    });

    return (
        <div className="container-fluid p-4">
            {/* Header Section */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom gap-3">
                <div>
                    <h3 className="fw-bold mb-1 d-flex align-items-center gap-2 text-dark">
                        <span>💬 Customer Testimonials</span>
                        <span className="badge bg-success rounded-pill fs-6 px-3" style={{ backgroundColor: "#2d6a4f" }}>
                            {testimonials.length} Total
                        </span>
                    </h3>
                    <p className="text-muted mb-0 small">
                        Manage customer reviews & testimonials displayed in the moving carousel on the Home page.
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-success fw-bold d-flex align-items-center gap-2 px-3 py-2 rounded-3 shadow-sm"
                        style={{ backgroundColor: "#2d6a4f", borderColor: "#2d6a4f" }}
                        onClick={handleOpenAddModal}
                    >
                        <span>➕</span>
                        <span>Add Testimonial</span>
                    </button>
                    <button
                        className="btn btn-outline-secondary fw-semibold d-flex align-items-center gap-2 px-3 py-2 rounded-3"
                        onClick={loadTestimonials}
                    >
                        <span>🔄</span>
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Search Filter */}
            <div className="card border-0 shadow-sm mb-4 rounded-3">
                <div className="card-body p-3">
                    <div className="row g-3 align-items-center">
                        <div className="col-12 col-md-6">
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0 text-muted">🔍</span>
                                <input
                                    type="text"
                                    className="form-control border-start-0 ps-0"
                                    placeholder="Search testimonials by Name, Location, Product, or Review..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button className="btn btn-link text-muted text-decoration-none border-0" onClick={() => setSearchQuery("")}>
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="col-12 col-md-6 text-md-end text-muted small">
                            Showing <strong className="text-dark">{filteredTestimonials.length}</strong> of <strong className="text-dark">{testimonials.length}</strong> testimonials
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials Table */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light text-muted text-uppercase small" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                            <tr>
                                <th className="ps-4 py-3">Customer</th>
                                <th className="py-3">Rating & Product</th>
                                <th className="py-3" style={{ width: "35%" }}>Review Content</th>
                                <th className="py-3">Status</th>
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
                                        <div className="mt-2 text-muted small">Fetching testimonials...</div>
                                    </td>
                                </tr>
                            ) : filteredTestimonials.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">
                                        <div className="fs-1 mb-2">💬</div>
                                        <div className="fw-bold">No testimonials found</div>
                                        <div className="small text-muted mt-1">
                                            {searchQuery ? "Try refining your search query." : "Click 'Add Testimonial' to create one."}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredTestimonials.map((item) => (
                                    <tr key={item.id}>
                                        <td className="ps-4 py-3">
                                            <div className="fw-bold text-dark">{item.customerName}</div>
                                            <small className="text-muted">📍 {item.customerLocation || "India"}</small>
                                        </td>
                                        <td className="py-3">
                                            <div className="text-warning fw-bold fs-6">
                                                {"★".repeat(item.rating || 5)}
                                            </div>
                                            {item.productName && (
                                                <span className="badge bg-light text-success border fw-semibold mt-1">
                                                    🌾 {item.productName}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 text-secondary small">
                                            "{item.reviewText}"
                                        </td>
                                        <td className="py-3">
                                            <button
                                                className={`btn btn-sm fw-semibold rounded-pill px-3 ${
                                                    item.active !== false ? "btn-success" : "btn-secondary"
                                                }`}
                                                style={{ fontSize: "11px" }}
                                                onClick={() => handleToggleActive(item)}
                                            >
                                                {item.active !== false ? "✓ Active" : "Hidden"}
                                            </button>
                                        </td>
                                        <td className="text-end pe-4 py-3">
                                            <div className="d-flex justify-content-end gap-2">
                                                <button
                                                    className="btn btn-sm btn-outline-primary fw-semibold px-3 rounded-pill"
                                                    onClick={() => handleOpenEditModal(item)}
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger fw-semibold px-3 rounded-pill"
                                                    onClick={() => handleDelete(item)}
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

            {/* Modal for Add / Edit */}
            {isModalOpen && (
                <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1055 }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content shadow-lg border-0 rounded-4">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold text-success">
                                    {modalMode === "ADD" ? "➕ Add New Testimonial" : `✏️ Edit Testimonial (#${selectedTestimonial?.id})`}
                                </h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <form onSubmit={handleSubmitForm}>
                                <div className="modal-body py-3">
                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Customer Name *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="e.g. Kavitha R."
                                                value={formData.customerName}
                                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Location (City, State)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="e.g. Chennai, Tamil Nadu"
                                                value={formData.customerLocation}
                                                onChange={(e) => setFormData({ ...formData, customerLocation: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Product Purchased</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="e.g. Traditional Poongar Rice"
                                                value={formData.productName}
                                                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Rating (1 to 5 Stars) *</label>
                                            <select
                                                className="form-select"
                                                value={formData.rating}
                                                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                                            >
                                                <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                                                <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                                                <option value={3}>⭐⭐⭐ (3 Stars)</option>
                                                <option value={2}>⭐⭐ (2 Stars)</option>
                                                <option value={1}>⭐ (1 Star)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Review Text *</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            placeholder="Enter customer review text..."
                                            value={formData.reviewText}
                                            onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-check form-switch mt-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="testimonialActive"
                                            checked={formData.active}
                                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                        />
                                        <label className="form-check-label fw-bold small" htmlFor="testimonialActive">
                                            Publish Testimonial to Home Page Carousel
                                        </label>
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
                                        {submitting ? "Saving..." : modalMode === "ADD" ? "Create Testimonial" : "Update Testimonial"}
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

export default AdminTestimonials;
