import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL, getImageUrl } from "../../services/api";

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [status, setStatus] = useState("RESOLVED");
  const [adminNotes, setAdminNotes] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/complaints`);
      if (res.ok) {
        setComplaints(await res.json());
      }
    } catch (err) {
      console.error("Failed to load admin complaints", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const openActionModal = (c) => {
    setSelectedComplaint(c);
    setStatus(c.status || "RESOLVED");
    setAdminNotes(c.adminNotes || "");
    setShowModal(true);
  };

  const handleUpdateComplaint = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/admin/complaints/${selectedComplaint.id}/status?status=${status}&adminNotes=${encodeURIComponent(adminNotes)}`,
        { method: "PUT" }
      );

      if (res.ok) {
        setShowModal(false);
        Swal.fire({
          icon: "success",
          title: "Complaint Updated",
          text: "Status and resolution notes saved.",
          timer: 1500,
          showConfirmButton: false
        });
        fetchComplaints();
      } else {
        Swal.fire("Error", "Failed to update complaint status", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Failed to connect to server", "error");
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case "PENDING": return <span className="badge bg-warning text-dark px-3 py-1.5 rounded-pill">⏳ Pending</span>;
      case "IN_REVIEW": return <span className="badge bg-info text-dark px-3 py-1.5 rounded-pill">⚙️ In Review</span>;
      case "RESOLVED": return <span className="badge bg-success text-white px-3 py-1.5 rounded-pill">✅ Resolved</span>;
      case "REJECTED": return <span className="badge bg-danger text-white px-3 py-1.5 rounded-pill">❌ Rejected</span>;
      default: return <span className="badge bg-secondary px-3 py-1.5 rounded-pill">{st}</span>;
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-success m-0">📢 Customer Support &amp; Complaints Desk</h3>
          <p className="text-muted small m-0">Review product damage claims and post resolution notes to customers.</p>
        </div>
        <button className="btn btn-sm btn-outline-success font-bold rounded-pill px-3" onClick={fetchComplaints}>
          🔄 Refresh Complaints
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : complaints.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-light">
          <div className="fs-1 mb-2">🎉</div>
          <h5 className="fw-bold text-dark">No Customer Complaints</h5>
          <p className="text-muted small">All customers are currently satisfied with their orders!</p>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-muted">
                <tr>
                  <th>DATE &amp; ID</th>
                  <th>CUSTOMER</th>
                  <th>ORDER &amp; ITEM</th>
                  <th>ISSUE TYPE</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong className="text-dark d-block">#{c.id}</strong>
                      <span className="text-muted small">{new Date(c.createdAt).toLocaleDateString("en-IN")}</span>
                    </td>
                    <td>
                      <strong className="text-dark d-block">{c.customerName}</strong>
                      <span className="text-muted small">📱 {c.customerMobile}</span>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border me-1">#{c.orderNumber}</span>
                      <small className="text-muted d-block mt-1">{c.productName || "General Package"}</small>
                    </td>
                    <td>
                      <span className="fw-bold text-danger small">{c.issueType ? c.issueType.replace("_", " ") : "SUPPORT"}</span>
                      <p className="text-muted small m-0 text-truncate max-w-xs">{c.description}</p>
                      {c.imageUrl && (
                        <div className="mt-1">
                          <img
                            src={getImageUrl(c.imageUrl)}
                            alt="Complaint Attachment"
                            className="img-thumbnail rounded shadow-xs cursor-pointer"
                            style={{ height: "45px", width: "55px", objectFit: "cover" }}
                            onClick={() => setPreviewImage(getImageUrl(c.imageUrl))}
                          />
                        </div>
                      )}
                    </td>
                    <td>{getStatusBadge(c.status)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary rounded-pill px-3 font-bold"
                        onClick={() => openActionModal(c)}
                      >
                        ⚙️ Action
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {showModal && selectedComplaint && (
        <div className="modal show d-block bg-dark bg-opacity-50" tabIndex={-1} style={{ zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-success">⚙️ Process Complaint #{selectedComplaint.id}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleUpdateComplaint}>
                <div className="modal-body py-3">
                  <div className="bg-light p-3 rounded-3 mb-3 small">
                    <strong className="text-dark d-block">Customer: {selectedComplaint.customerName} ({selectedComplaint.customerMobile})</strong>
                    <span className="text-muted">Order #{selectedComplaint.orderNumber} • {selectedComplaint.issueType}</span>
                    <p className="mt-2 mb-2 text-dark italic">"{selectedComplaint.description}"</p>

                    {selectedComplaint.imageUrl && (
                      <div className="mt-2 pt-2 border-top">
                        <span className="small text-muted fw-bold d-block mb-1">📸 Customer Product Photo:</span>
                        <img
                          src={getImageUrl(selectedComplaint.imageUrl)}
                          alt="Customer Complaint Photo"
                          className="img-thumbnail rounded-3 shadow-xs cursor-pointer"
                          style={{ maxHeight: "140px", maxWidth: "180px", objectFit: "cover" }}
                          onClick={() => setPreviewImage(getImageUrl(selectedComplaint.imageUrl))}
                        />
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted mb-1">Update Status *</label>
                    <select className="form-select form-select-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option value="PENDING">⏳ Pending Review</option>
                      <option value="IN_REVIEW">⚙️ In Investigation</option>
                      <option value="RESOLVED">✅ Resolved / Refund Issued</option>
                      <option value="REJECTED">❌ Rejected</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted mb-1">Resolution Note for Customer</label>
                    <textarea
                      className="form-control form-control-sm"
                      rows="3"
                      placeholder="e.g. Refund of ₹350 initiated to original payment method. Reference #REF-9921"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                    />
                  </div>
                </div>

                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-sm btn-light border rounded-pill px-3" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-sm btn-success font-bold rounded-pill px-4 shadow-sm">
                    💾 Save Resolution
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* FULL IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div className="modal d-block bg-dark bg-opacity-75" tabIndex="-1" onClick={() => setPreviewImage(null)}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-black border-0 rounded-4 overflow-hidden">
              <div className="modal-header border-0 pb-0">
                <button type="button" className="btn-close btn-close-white" onClick={() => setPreviewImage(null)}></button>
              </div>
              <div className="modal-body text-center p-3">
                <img src={previewImage} alt="Complaint Attachment Full View" className="img-fluid rounded-3" style={{ maxHeight: "80vh" }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaints;
