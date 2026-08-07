import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getImageUrl, fetchAdminReviews, updateAdminReviewStatus, deleteAdminReview } from "../../services/api";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [previewImage, setPreviewImage] = useState(null);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminReviews();
      setReviews(data || []);
    } catch (err) {
      console.error("Failed to load admin reviews", err);
      Swal.fire("Error", "Could not load customer reviews", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateAdminReviewStatus(id, status);
      Swal.fire({
        title: "Status Updated!",
        text: `Review has been marked as ${status}`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
      loadReviews();
    } catch (err) {
      console.error("Failed to update status", err);
      Swal.fire("Error", err.message || "Failed to update status", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Review?",
      text: "Are you sure you want to delete this customer review? This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });

    if (confirm.isConfirmed) {
      try {
        await deleteAdminReview(id);
        Swal.fire("Deleted!", "Review has been removed.", "success");
        loadReviews();
      } catch (err) {
        console.error("Failed to delete review", err);
        Swal.fire("Error", err.message || "Failed to delete review", "error");
      }
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filterStatus === "ALL") return true;
    return r.status === filterStatus;
  });

  return (
    <div className="p-3">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h3 className="fw-bold text-success m-0">⭐ Customer Reviews & Photo Management</h3>
          <p className="text-muted small m-0 mt-1">
            Review customer feedback, ratings, and uploaded product images. Moderate or delete reviews.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <label className="small fw-bold text-muted mb-0">Status Filter:</label>
          <select
            className="form-select form-select-sm border-success fw-bold"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All Reviews ({reviews.length})</option>
            <option value="APPROVED">Approved ({reviews.filter(r => r.status === "APPROVED").length})</option>
            <option value="PENDING">Pending ({reviews.filter(r => r.status === "PENDING").length})</option>
            <option value="HIDDEN">Hidden ({reviews.filter(r => r.status === "HIDDEN").length})</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
          <p className="text-muted small mt-2">Loading customer reviews...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4 border p-4">
          <div className="fs-1 text-muted mb-2">⭐</div>
          <h5 className="fw-bold text-dark">No Customer Reviews Found</h5>
          <p className="text-muted small mb-0">No customer reviews match the selected filter status.</p>
        </div>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-hover align-middle bg-white m-0">
            <thead className="table-success text-nowrap">
              <tr>
                <th>Customer</th>
                <th>Product & Order</th>
                <th>Rating</th>
                <th>Review & Photo</th>
                <th>Status</th>
                <th className="text-center">Moderate</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((rev) => (
                <tr key={rev.id}>
                  <td style={{ minWidth: "180px" }}>
                    <div className="fw-bold text-dark">{rev.customerName || "Anonymous"}</div>
                    <div className="small text-muted">{rev.customerPhone || "No Phone"}</div>
                    <div className="small text-secondary">{rev.customerEmail || ""}</div>
                  </td>
                  <td style={{ minWidth: "200px" }}>
                    <div className="fw-bold text-success">{rev.productName || "Product #" + rev.productId}</div>
                    {rev.orderNumber && (
                      <span className="badge bg-light text-dark border">
                        Order #{rev.orderNumber}
                      </span>
                    )}
                  </td>
                  <td className="text-nowrap">
                    <span className="badge bg-warning text-dark fw-bold px-2 py-1 fs-6">
                      {"★".repeat(rev.rating || 5)}
                    </span>
                  </td>
                  <td style={{ minWidth: "280px" }}>
                    {rev.reviewTitle && <div className="fw-bold text-dark mb-1">{rev.reviewTitle}</div>}
                    <div className="small text-secondary mb-2">{rev.reviewComment}</div>

                    {rev.imageUrl && (
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={getImageUrl(rev.imageUrl)}
                          alt="Customer Photo"
                          className="img-thumbnail rounded shadow-xs cursor-pointer"
                          style={{ height: "60px", width: "75px", objectFit: "cover" }}
                          onClick={() => setPreviewImage(getImageUrl(rev.imageUrl))}
                        />
                        <span className="small text-success fw-bold">📸 Photo attached</span>
                      </div>
                    )}
                  </td>
                  <td className="text-nowrap">
                    <span className={`badge ${rev.status === "APPROVED" ? "bg-success" : rev.status === "PENDING" ? "bg-warning text-dark" : "bg-secondary"}`}>
                      {rev.status}
                    </span>
                  </td>
                  <td className="text-nowrap text-center">
                    <select
                      className="form-select form-select-sm fw-bold border-success"
                      value={rev.status}
                      style={{ minWidth: "120px" }}
                      onChange={(e) => handleStatusChange(rev.id, e.target.value)}
                    >
                      <option value="APPROVED">APPROVED</option>
                      <option value="PENDING">PENDING</option>
                      <option value="HIDDEN">HIDDEN</option>
                    </select>
                  </td>
                  <td className="text-center text-nowrap">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger rounded-circle p-0 d-inline-flex align-items-center justify-content-center shadow-sm"
                      style={{ width: "34px", height: "34px" }}
                      onClick={() => handleDelete(rev.id)}
                      title="Delete Review"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PHOTO PREVIEW MODAL */}
      {previewImage && (
        <div className="modal d-block bg-dark bg-opacity-75" tabIndex="-1" onClick={() => setPreviewImage(null)}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-black border-0 rounded-4 overflow-hidden">
              <div className="modal-header border-0 pb-0">
                <button type="button" className="btn-close btn-close-white" onClick={() => setPreviewImage(null)}></button>
              </div>
              <div className="modal-body text-center p-3">
                <img src={previewImage} alt="Customer Uploaded Review Photo" className="img-fluid rounded-3" style={{ maxHeight: "80vh" }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
