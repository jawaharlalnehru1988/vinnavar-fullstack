import { API_BASE_URL, submitProductReview, uploadReviewImage } from "../../services/api";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";

const MyAccountOrder = () => {
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Review Modal States
  const [reviewOrderModal, setReviewOrderModal] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    comment: "",
    imageFile: null,
    imagePreview: "",
    submitting: false
  });

  const openReviewModalForOrder = (order) => {
    const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
    setReviewOrderModal({
      orderNumber: order.orderNumber,
      productId: firstItem ? firstItem.productId : 1,
      productName: firstItem ? firstItem.productName : "Organic Product",
      items: order.items || []
    });
    setReviewForm({
      rating: 5,
      title: "",
      comment: "",
      imageFile: null,
      imagePreview: "",
      submitting: false
    });
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire("File Too Large", "Review image must be less than 5 MB", "warning");
        return;
      }
      setReviewForm(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleReviewFormSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) {
      Swal.fire("Missing Field", "Please write a brief review comment", "warning");
      return;
    }

    setReviewForm(prev => ({ ...prev, submitting: true }));
    try {
      let uploadedImageUrl = null;
      if (reviewForm.imageFile) {
        const uploadRes = await uploadReviewImage(reviewForm.imageFile);
        uploadedImageUrl = uploadRes.imageUrl;
      }

      await submitProductReview({
        productId: reviewOrderModal.productId,
        productName: reviewOrderModal.productName,
        customerName: currentUser?.fullName || currentUser?.name || "Verified Customer",
        customerPhone: currentUser?.mobileNumber || "",
        customerEmail: currentUser?.email || "",
        orderNumber: reviewOrderModal.orderNumber,
        rating: reviewForm.rating,
        reviewTitle: reviewForm.title,
        reviewComment: reviewForm.comment,
        imageUrl: uploadedImageUrl,
        verifiedPurchase: true,
        status: "APPROVED"
      });

      Swal.fire({
        title: "Review Submitted! ⭐",
        text: "Thank you for sharing your feedback and product photo!",
        icon: "success",
        confirmButtonColor: "#047857"
      });
      setReviewOrderModal(null);
    } catch (err) {
      console.error("Failed to submit review:", err);
      Swal.fire("Submission Failed", err.message || "Could not submit review", "error");
    } finally {
      setReviewForm(prev => ({ ...prev, submitting: false }));
    }
  };

  const currentUser = (() => {
    try {
      const saved = localStorage.getItem("vinnavar_customer");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  })();

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <span className="badge bg-warning text-dark fw-bold px-3 py-1.5 rounded-pill shadow-xs">⏳ PENDING</span>;
      case "CONFIRMED":
        return <span className="badge bg-primary text-white fw-bold px-3 py-1.5 rounded-pill shadow-xs">✅ CONFIRMED</span>;
      case "PROCESSING":
        return <span className="badge bg-info text-dark fw-bold px-3 py-1.5 rounded-pill shadow-xs">⚙️ PROCESSING</span>;
      case "SHIPPED":
        return <span className="badge bg-purple-600 text-white fw-bold px-3 py-1.5 rounded-pill shadow-xs" style={{ backgroundColor: "#8b5cf6" }}>🚚 SHIPPED</span>;
      case "OUT_FOR_DELIVERY":
        return <span className="badge bg-orange-600 text-white fw-bold px-3 py-1.5 rounded-pill shadow-xs" style={{ backgroundColor: "#f97316" }}>🛵 OUT FOR DELIVERY</span>;
      case "DELIVERED":
        return <span className="badge bg-success text-white fw-bold px-3 py-1.5 rounded-pill shadow-xs">🎉 DELIVERED</span>;
      case "CANCELLED":
      case "FAILED":
        return <span className="badge bg-danger text-white fw-bold px-3 py-1.5 rounded-pill shadow-xs">❌ CANCELLED</span>;
      default:
        return <span className="badge bg-secondary text-white fw-bold px-3 py-1.5 rounded-pill shadow-xs">{status}</span>;
    }
  };

  const fetchUserOrders = async () => {
    setLoaderStatus(true);
    try {
      const res = await fetch(`${API_BASE_URL}/orders`);
      if (res.ok) {
        let data = await res.json();
        if (currentUser && currentUser.mobileNumber) {
          const userMobile = String(currentUser.mobileNumber).trim();
          const filtered = data.filter(o => o.customerPhone && String(o.customerPhone).trim().endsWith(userMobile.slice(-10)));
          if (filtered.length > 0) {
            data = filtered;
          }
        }
        setOrders(data || []);
      }
    } catch (err) {
      console.error("Failed to load user orders", err);
    } finally {
      setLoaderStatus(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const handleDownloadBill = async (orderNumber) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderNumber}/pdf`);
      if (!res.ok) return;
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Bill-${orderNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download PDF bill", err);
    }
  };

  return (
    <div>
      <ScrollToTop />
      <section className="py-6">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="p-6 d-flex justify-content-between align-items-center d-md-none">
                <h3 className="fs-5 mb-0">Account Setting</h3>
                <button
                  className="btn btn-outline-gray-400 text-muted d-md-none"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasAccount"
                  aria-controls="offcanvasAccount"
                >
                  <i className="fas fa-bars"></i>
                </button>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <div className="col-lg-3 col-md-4 col-12 border-end d-none d-md-block">
              <div className="pt-6 pe-lg-6">
                <ul className="nav flex-column nav-pills nav-pills-dark gap-1">
                  <li className="nav-item">
                    <Link className="nav-link active font-bold" to="/MyAccountOrder">
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
                    <Link className="nav-link" to="/MyAccountComplaint">
                      <i className="fas fa-headset me-2" /> Help &amp; Complaints
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Main Orders View */}
            <div className="col-lg-9 col-md-8 col-12">
              {loaderStatus ? (
                <div className="loader-container text-center py-10">
                  <MagnifyingGlass
                    visible={true}
                    height="80"
                    width="80"
                    glassColor="#c0efff"
                    color="#0aad0a"
                  />
                  <p className="mt-2 text-muted">Loading your orders...</p>
                </div>
              ) : (
                <div className="p-4 p-lg-8 bg-white rounded-3 shadow-sm border">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0 fw-black text-dark">📦 Your Order History</h2>
                    <span className="badge bg-success-subtle text-success border border-success px-3 py-2 rounded-pill fw-bold">
                      {orders.length} Order(s)
                    </span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-12 space-y-3">
                      <div className="fs-1">🛍️</div>
                      <h4 className="fw-bold text-slate-800">No Orders Found</h4>
                      <p className="text-muted small">You haven't placed any organic orders yet.</p>
                      <Link to="/Shop" className="btn btn-success rounded-pill px-4 font-bold shadow-sm">
                        Start Shopping ➔
                      </Link>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table align-middle table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Order #</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                            <th className="text-end">Invoice / Bill</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((o) => (
                            <tr key={o.id}>
                              <td>
                                <span className="fw-bold text-success font-monospace">{o.orderNumber}</span>
                                <div className="small text-muted">{o.paymentMethod}</div>
                              </td>
                              <td className="small">
                                {o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                              </td>
                              <td className="small">
                                {o.items && o.items.length > 0 ? (
                                  <div>
                                    <strong>{o.items[0].productName}</strong> {o.items.length > 1 ? `+ ${o.items.length - 1} more` : ''}
                                  </div>
                                ) : (
                                  <span className="text-muted">Standard items</span>
                                )}
                              </td>
                              <td className="fw-bold text-slate-900">
                                ₹{o.totalAmount}
                              </td>
                              <td>
                                {getStatusBadge(o.orderStatus)}
                              </td>
                              <td className="text-end">
                                <div className="d-flex justify-content-end gap-2">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-success rounded-pill font-bold px-3 d-inline-flex align-items-center gap-1 shadow-xs"
                                    onClick={() => handleDownloadBill(o.orderNumber)}
                                  >
                                    📄 Download Bill (PDF)
                                  </button>
                                  {(o.orderStatus === "DELIVERED" || o.orderStatus === "SHIPPED") && (
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-warning text-dark font-bold rounded-pill px-3 d-inline-flex align-items-center gap-1 shadow-xs"
                                      onClick={() => openReviewModalForOrder(o)}
                                    >
                                      ⭐ Review
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-light border rounded-circle text-muted"
                                    onClick={() => setSelectedOrder(o)}
                                    title="View Details"
                                  >
                                    <i className="fas fa-eye" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Order Details Modal */}
                  {selectedOrder && (
                    <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1" style={{ zIndex: 1050 }}>
                      <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content rounded-4 border-0 shadow-lg">
                          <div className="modal-header bg-success text-white py-3 px-4">
                            <h5 className="modal-title font-bold text-white mb-0">
                              📄 Order Breakdown: {selectedOrder.orderNumber}
                            </h5>
                            <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedOrder(null)}></button>
                          </div>
                          <div className="modal-body p-4">
                            <div className="row g-3 mb-4">
                              <div className="col-md-6">
                                <div className="p-3 bg-light rounded-3 border">
                                  <h6 className="fw-bold text-success mb-2">🚚 Delivery Address</h6>
                                  <div className="small">
                                    <strong>{selectedOrder.customerName}</strong><br />
                                    Phone: {selectedOrder.customerPhone}<br />
                                    {selectedOrder.shippingAddress?.streetAddress}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="p-3 bg-light rounded-3 border">
                                  <h6 className="fw-bold text-success mb-2">💳 Payment &amp; Status</h6>
                                  <div className="small">
                                    Status: <span className="badge bg-success">{selectedOrder.orderStatus}</span><br />
                                    Payment Method: {selectedOrder.paymentMethod}<br />
                                    GSTIN: {selectedOrder.gstin || "N/A"}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Item breakdown table */}
                            <h6 className="fw-bold text-slate-800 mb-2">Items Purchased</h6>
                            <div className="table-responsive mb-3 border rounded">
                              <table className="table table-sm align-middle m-0">
                                <thead className="table-light">
                                  <tr>
                                    <th>Item</th>
                                    <th>Variant</th>
                                    <th>Qty</th>
                                    <th className="text-end">Price</th>
                                    <th className="text-end">Subtotal</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectedOrder.items?.map((it, idx) => (
                                    <tr key={idx}>
                                      <td>{it.productName}</td>
                                      <td><span className="badge bg-secondary-subtle text-dark">{it.variantName}</span></td>
                                      <td>{it.quantity}</td>
                                      <td className="text-end">₹{it.unitPrice}</td>
                                      <td className="text-end font-bold">₹{it.totalPrice}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Price Breakdown Card */}
                            <div className="p-3 bg-emerald-50 rounded-3 border border-emerald-200 ms-auto max-w-sm text-xs font-medium space-y-1">
                              <div className="d-flex justify-content-between text-slate-700">
                                <span>Base Price (Subtotal):</span>
                                <span className="font-bold">₹{selectedOrder.subtotal || selectedOrder.totalAmount}</span>
                              </div>
                              <div className="d-flex justify-content-between text-slate-700">
                                <span>Weight Based Shipping:</span>
                                <span className="font-bold text-emerald-700">₹{selectedOrder.shippingFee || "48.00"}</span>
                              </div>
                              <div className="d-flex justify-content-between text-slate-700">
                                <span>GST Tax (5%):</span>
                                <span className="font-bold text-emerald-700">₹{selectedOrder.gstTax || "0.00"}</span>
                              </div>
                              <div className="d-flex justify-content-between text-slate-900 font-bold fs-6 pt-2 border-top border-emerald-200">
                                <span>Total Amount:</span>
                                <span className="text-emerald-800 fs-5">₹{selectedOrder.totalAmount}</span>
                              </div>
                            </div>
                          </div>
                          <div className="modal-footer bg-light py-2 px-4 justify-content-between">
                            <button
                              type="button"
                              className="btn btn-success font-bold rounded-pill px-4 shadow-sm"
                              onClick={() => handleDownloadBill(selectedOrder.orderNumber)}
                            >
                              📄 Download Official PDF Bill
                            </button>
                            <button type="button" className="btn btn-secondary rounded-pill" onClick={() => setSelectedOrder(null)}>
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Review Submission Modal */}
      {reviewOrderModal && (
        <div className="modal d-block bg-dark bg-opacity-60" tabIndex="-1" style={{ zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
              <div className="modal-header bg-success text-white py-3 px-4">
                <h5 className="modal-title font-bold text-white mb-0">
                  ⭐ Write a Product Review & Upload Photo
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setReviewOrderModal(null)}></button>
              </div>

              <form onSubmit={handleReviewFormSubmit}>
                <div className="modal-body p-4">
                  <div className="p-3 bg-light rounded-3 mb-3 border">
                    <div className="small text-muted fw-bold">Reviewing Product for Order: #{reviewOrderModal.orderNumber}</div>
                    <h6 className="fw-bold text-success mb-0">{reviewOrderModal.productName}</h6>
                  </div>

                  {/* Rating Selector */}
                  <div className="mb-4 text-center">
                    <label className="form-label fw-bold text-dark d-block mb-2">Overall Rating:</label>
                    <div className="d-inline-flex gap-2 p-2 bg-light rounded-pill border">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="btn btn-link p-1 text-decoration-none fs-3 transition-transform"
                          onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                        >
                          <i className={`fas fa-star ${star <= reviewForm.rating ? "text-warning" : "text-secondary opacity-25"}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="mb-3">
                    <label className="form-label fw-bold text-dark mb-1">Review Headline / Summary:</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., Authentic quality and very fresh!"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  {/* Comment */}
                  <div className="mb-3">
                    <label className="form-label fw-bold text-dark mb-1">Detailed Feedback:</label>
                    <textarea
                      rows={3}
                      className="form-control"
                      placeholder="Share your experience regarding texture, taste, packaging, delivery speed, etc."
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                      required
                    />
                  </div>

                  {/* Photo Upload */}
                  <div className="mb-3">
                    <label className="form-label fw-bold text-dark mb-1">📸 Upload Product Photo (Optional):</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={handleImageFileChange}
                    />
                    <div className="form-text small text-muted">Upload a photo of the received package/product (Max 5 MB).</div>

                    {reviewForm.imagePreview && (
                      <div className="mt-3 text-center p-2 border rounded bg-light">
                        <img
                          src={reviewForm.imagePreview}
                          alt="Review Preview"
                          className="img-thumbnail rounded"
                          style={{ maxHeight: "150px", objectFit: "contain" }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="modal-footer bg-light py-3 px-4 justify-content-between">
                  <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setReviewOrderModal(null)}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success fw-bold rounded-pill px-5 shadow-sm d-flex align-items-center gap-2"
                    disabled={reviewForm.submitting}
                  >
                    {reviewForm.submitting ? "Submitting..." : "Submit Review ⭐"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Offcanvas Drawer for Mobile */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex={-1}
        id="offcanvasAccount"
        aria-labelledby="offcanvasAccountLabel"
      >
          {/* offcanvas header */}
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasAccountLabel">
              My Account
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            />
          </div>
          {/* offcanvas body */}
          <div className="offcanvas-body">
            <ul className="nav flex-column nav-pills nav-pills-dark">
              {/* nav item */}
              <li className="nav-item">
                <a
                  className="nav-link active"
                  aria-current="page"
                  href="/MyAccountOrder"
                >
                  <i className="fas fa-shopping-bag me-2" />
                  Your Orders
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/MyAccountReviews">
                  <i className="fas fa-star me-2" />
                  My Reviews
                </a>
              </li>
              {/* nav item */}
              <li className="nav-item">
                <a className="nav-link " href="/MyAccountSetting">
                  <i className="fas fa-cog me-2" />
                  Settings
                </a>
              </li>
              {/* nav item */}
              <li className="nav-item">
                <a className="nav-link" href="/MyAccountAddress">
                  <i className="fas fa-map-marker-alt me-2" />
                  Address
                </a>
              </li>
            </ul>
          </div>
        </div>
    </div>
  );
};

export default MyAccountOrder;
