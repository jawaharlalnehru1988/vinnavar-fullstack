import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import Swal from "sweetalert2";
import ScrollToTop from "../ScrollToTop";
import { API_BASE_URL, getImageUrl, uploadComplaintImage } from "../../services/api";

const MyAccountComplaint = () => {
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1); // 1 = Refund Policy, 2 = Complaint Form
  const [refundPolicyAccepted, setRefundPolicyAccepted] = useState(false);
  const [refundPolicyText, setRefundPolicyText] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const currentUser = (() => {
    try {
      const saved = localStorage.getItem("vinnavar_customer");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  })();

  const [form, setForm] = useState({
    orderNumber: "",
    productName: "",
    issueType: "DAMAGED_PRODUCT",
    description: "",
    imageFile: null,
    imagePreview: "",
    submitting: false
  });

  const fetchData = async () => {
    if (!currentUser || !currentUser.mobileNumber) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [compRes, ordRes, setRes] = await Promise.all([
        fetch(`${API_BASE_URL}/customer/complaints?mobile=${currentUser.mobileNumber}`),
        fetch(`${API_BASE_URL}/orders/user?customerMobile=${currentUser.mobileNumber}`),
        fetch(`${API_BASE_URL}/settings`)
      ]);

      if (compRes.ok) setComplaints(await compRes.json());
      if (ordRes.ok) setUserOrders(await ordRes.json());
      if (setRes.ok) {
        const settings = await setRes.json();
        setRefundPolicyText(settings.refund_policy || "Standard Refund Policy applies.");
      }
    } catch (err) {
      console.error("Error loading complaints data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openNewComplaintModal = () => {
    setStep(1);
    setRefundPolicyAccepted(false);
    setForm({
      orderNumber: userOrders.length > 0 ? userOrders[0].orderNumber : "",
      productName: "",
      issueType: "DAMAGED_PRODUCT",
      description: "",
      imageFile: null,
      imagePreview: "",
      submitting: false
    });
    setShowModal(true);
  };

  const handleProceedToForm = () => {
    if (!refundPolicyAccepted) {
      Swal.fire("Refund Policy Agreement Required", "Please read and accept the Refund Policy before lodging your complaint.", "warning");
      return;
    }
    setStep(2);
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    if (!currentUser || !currentUser.mobileNumber) {
      Swal.fire("Authentication Required", "Please sign in to submit a complaint", "warning");
      return;
    }

    setForm(prev => ({ ...prev, submitting: true }));
    try {
      let uploadedUrl = null;
      if (form.imageFile) {
        const uploadRes = await uploadComplaintImage(form.imageFile);
        uploadedUrl = uploadRes.imageUrl;
      }

      const res = await fetch(`${API_BASE_URL}/customer/complaints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: form.orderNumber,
          productName: form.productName,
          issueType: form.issueType,
          description: form.description,
          imageUrl: uploadedUrl,
          customerMobile: currentUser.mobileNumber,
          customerName: currentUser.name || "Customer",
          refundPolicyAccepted: true
        })
      });

      if (res.ok) {
        setShowModal(false);
        Swal.fire({
          icon: "success",
          title: "Complaint Lodged 📢",
          text: "Your support ticket has been submitted. Our team will review and resolve it promptly.",
          timer: 2500,
          showConfirmButton: false
        });
        fetchData();
      } else {
        Swal.fire("Error", "Failed to submit complaint", "error");
      }
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to connect to server", "error");
    } finally {
      setForm(prev => ({ ...prev, submitting: false }));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING": return <span className="badge bg-warning text-dark font-monospace px-3 py-1.5 rounded-pill">⏳ Pending Review</span>;
      case "IN_REVIEW": return <span className="badge bg-info text-dark font-monospace px-3 py-1.5 rounded-pill">⚙️ In Investigation</span>;
      case "RESOLVED": return <span className="badge bg-success text-white font-monospace px-3 py-1.5 rounded-pill">✅ Resolved</span>;
      case "REJECTED": return <span className="badge bg-danger text-white font-monospace px-3 py-1.5 rounded-pill">❌ Rejected</span>;
      default: return <span className="badge bg-secondary text-white font-monospace px-3 py-1.5 rounded-pill">{status}</span>;
    }
  };

  return (
    <div>
      <ScrollToTop />
      <section className="py-6">
        <div className="container">
          <div className="row">
            {/* Account Sidebar Navigation */}
            <div className="col-lg-3 col-md-4 col-12 border-end d-none d-md-block">
              <div className="pt-6 pe-lg-6">
                <ul className="nav flex-column nav-pills nav-pills-dark gap-1">
                  <li className="nav-item">
                    <Link className="nav-link" to="/MyAccountOrder">
                      <i className="fas fa-shopping-bag me-2" /> Your Orders
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/MyAccountReviews">
                      <i className="fas fa-star me-2" /> My Reviews
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/MyAccountSetting">
                      <i className="fas fa-cog me-2" /> Settings
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/MyAccountAddress">
                      <i className="fas fa-map-marker-alt me-2" /> Address
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/MyAcconutPaymentMethod">
                      <i className="fas fa-credit-card me-2" /> Payment Method
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link active font-bold" to="/MyAccountComplaint">
                      <i className="fas fa-headset me-2" /> Help &amp; Complaints
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/MyAcconutNotification">
                      <i className="fas fa-bell me-2" /> Notification
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="col-lg-9 col-md-8 col-12">
              <div className="p-4 p-lg-8">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-6 gap-3">
                  <div>
                    <h2 className="mb-1 fw-bold text-dark">📢 Customer Support &amp; Complaints</h2>
                    <p className="text-muted small mb-0">Lodge product concerns, damaged package claims, or delivery issues.</p>
                  </div>
                  <button
                    className="btn btn-success font-bold px-4 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2"
                    onClick={openNewComplaintModal}
                  >
                    <span>➕</span> <span>Lodge New Complaint</span>
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-5">
                    <MagnifyingGlass visible={true} height="80" width="80" glassColor="#c0efff" color="#0aad0a" />
                  </div>
                ) : (
                  <div>
                    {complaints.length === 0 ? (
                      <div className="text-center py-5 bg-light rounded-4 border p-4">
                        <div className="fs-1 mb-2">📬</div>
                        <h5 className="fw-bold text-dark">No Active Complaints</h5>
                        <p className="text-muted small max-w-md mx-auto mb-3">
                          You currently have no open complaints or support tickets.
                        </p>
                        <button className="btn btn-outline-success rounded-pill px-4 fw-bold" onClick={openNewComplaintModal}>
                          + Lodge Complaint
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {complaints.map((c) => (
                          <div key={c.id} className="card border-0 shadow-sm rounded-4 p-4 mb-3 bg-white border-start border-4 border-emerald-600">
                            <div className="d-flex flex-wrap justify-content-between align-items-center mb-2 gap-2">
                              <div>
                                <span className="fw-bold text-dark me-2">Order #{c.orderNumber}</span>
                                {c.productName && <span className="badge bg-light text-muted border">{c.productName}</span>}
                              </div>
                              <div>{getStatusBadge(c.status)}</div>
                            </div>
                            <div className="small text-muted mb-2">
                              Issue Type: <strong className="text-dark">{c.issueType.replace("_", " ")}</strong> • Date: {new Date(c.createdAt).toLocaleDateString("en-IN")}
                            </div>
                            <p className="text-slate-700 bg-light p-3 rounded-3 small mb-2">{c.description}</p>

                            {c.imageUrl && (
                              <div className="mt-2 mb-2">
                                <span className="small text-muted fw-bold d-block mb-1">📸 Attached Product Photo:</span>
                                <img
                                  src={getImageUrl(c.imageUrl)}
                                  alt="Complaint Product Attachment"
                                  className="img-thumbnail rounded-3 shadow-xs cursor-pointer"
                                  style={{ maxHeight: "130px", maxWidth: "160px", objectFit: "cover" }}
                                  onClick={() => setPreviewImage(getImageUrl(c.imageUrl))}
                                />
                              </div>
                            )}

                            {c.adminNotes && (
                              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-3 text-emerald-900 small">
                                <strong>💬 Admin Resolution Note:</strong> {c.adminNotes}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lodge Complaint Wizard Modal */}
      {showModal && (
        <div className="modal show d-block bg-dark bg-opacity-50" tabIndex={-1} style={{ zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
              <div className="modal-header bg-emerald-700 text-white py-3 px-4">
                <h5 className="modal-title font-bold text-white mb-0">
                  {step === 1 ? "📜 Step 1: Read & Accept Refund Policy" : "📢 Step 2: Product Complaint Form"}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)} />
              </div>

              {step === 1 ? (
                <div className="modal-body p-4">
                  <div className="alert alert-success border-0 bg-emerald-50 text-emerald-900 mb-3 small fw-bold">
                    ⚠️ Please read our standard Refund &amp; Cancellation Policy before lodging your product complaint.
                  </div>
                  <div className="bg-light p-3 rounded-3 border mb-4 text-slate-700 text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {refundPolicyText}
                  </div>
                  <div className="form-check border-top pt-3">
                    <input
                      type="checkbox"
                      className="form-check-input cursor-pointer"
                      id="refundPolicyAcceptCheck"
                      checked={refundPolicyAccepted}
                      onChange={(e) => setRefundPolicyAccepted(e.target.checked)}
                    />
                    <label className="form-check-label fw-bold text-dark small" htmlFor="refundPolicyAcceptCheck">
                      I have read and agree to the Vinnavar Organics Refund &amp; Replacement Policy.
                    </label>
                  </div>
                  <div className="modal-footer border-0 pt-3 px-0 pb-0">
                    <button type="button" className="btn btn-sm btn-light border rounded-pill px-3" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-success font-bold rounded-pill px-4"
                      disabled={!refundPolicyAccepted}
                      onClick={handleProceedToForm}
                    >
                      Accept &amp; Continue to Complaint Form ➔
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitComplaint}>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted mb-1">Select Order Number *</label>
                        {userOrders.length > 0 ? (
                          <select
                            className="form-select form-select-sm"
                            value={form.orderNumber}
                            onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
                            required
                          >
                            {userOrders.map((o) => (
                              <option key={o.id} value={o.orderNumber}>
                                #{o.orderNumber} (₹{o.totalAmount}) - {o.status}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="e.g. ORD-1001"
                            value={form.orderNumber}
                            onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
                            required
                          />
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted mb-1">Issue Type *</label>
                        <select
                          className="form-select form-select-sm"
                          value={form.issueType}
                          onChange={(e) => setForm({ ...form, issueType: e.target.value })}
                        >
                          <option value="DAMAGED_PRODUCT">📦 Damaged / Broken Package</option>
                          <option value="EXPIRED_PRODUCT">⏳ Expired / Quality Issue</option>
                          <option value="WRONG_ITEM">❌ Wrong Item Delivered</option>
                          <option value="MISSING_ITEM">🔍 Missing Item from Order</option>
                          <option value="DELIVERY_DELAY">🚚 Delivery Delay Issue</option>
                          <option value="OTHER">❓ Other Support Enquiry</option>
                        </select>
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-bold text-muted mb-1">Product Name (Optional)</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="e.g. Traditional Seeraga Samba Rice 5kg"
                          value={form.productName}
                          onChange={(e) => setForm({ ...form, productName: e.target.value })}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-bold text-muted mb-1">Complaint Details &amp; Description *</label>
                        <textarea
                          className="form-control form-control-sm"
                          rows="4"
                          placeholder="Please describe the issue in detail so our team can resolve it immediately..."
                          required
                          value={form.description}
                          onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-bold text-muted mb-1">📸 Attach Product Photo (Optional)</label>
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control form-control-sm"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              if (file.size > 5 * 1024 * 1024) {
                                Swal.fire("File Too Large", "Photo must be less than 5 MB", "warning");
                                return;
                              }
                              setForm(prev => ({
                                ...prev,
                                imageFile: file,
                                imagePreview: URL.createObjectURL(file)
                              }));
                            }
                          }}
                        />
                        {form.imagePreview && (
                          <div className="mt-2 text-center p-2 border rounded bg-light">
                            <img src={form.imagePreview} alt="Complaint Preview" className="img-thumbnail" style={{ maxHeight: "120px" }} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer border-0 pt-0">
                    <button type="button" className="btn btn-sm btn-light border rounded-pill px-3" onClick={() => setStep(1)}>
                      ← Back to Policy
                    </button>
                    <button type="submit" className="btn btn-sm btn-success font-bold rounded-pill px-4 shadow-sm" disabled={form.submitting}>
                      {form.submitting ? "Submitting..." : "Submit Complaint ➔"}
                    </button>
                  </div>
                </form>
              )}
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
                <img src={previewImage} alt="Complaint Attachment Preview" className="img-fluid rounded-3" style={{ maxHeight: "80vh" }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAccountComplaint;
