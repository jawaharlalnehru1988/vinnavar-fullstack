import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import Swal from "sweetalert2";
import ScrollToTop from "../ScrollToTop";
import { API_BASE_URL, submitProductReview } from "../../services/api";

const MyAccountReview = () => {
  const [loading, setLoading] = useState(true);
  const [userOrders, setUserOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [location, setLocation] = useState("");

  const currentUser = (() => {
    try {
      const saved = localStorage.getItem("vinnavar_customer");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  })();

  const fetchUserOrders = async () => {
    if (!currentUser || !currentUser.mobileNumber) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/orders/user?customerMobile=${currentUser.mobileNumber}`);
      if (res.ok) {
        setUserOrders(await res.json());
      }
    } catch (err) {
      console.error("Error fetching user orders for reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenReviewModal = (item) => {
    setSelectedProduct(item);
    setRating(5);
    setComment("");
    setLocation(currentUser?.city ? `${currentUser.city}, ${currentUser.state || ""}` : "");
    setShowModal(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await submitProductReview({
        productId: selectedProduct?.productId || selectedProduct?.id || 1,
        productName: selectedProduct?.productName || "Organic Product",
        customerName: currentUser?.fullName || currentUser?.name || "Verified Customer",
        customerLocation: location.trim() || "India",
        customerPhone: currentUser?.mobileNumber || "",
        customerEmail: currentUser?.email || "",
        orderNumber: selectedProduct?.orderNumber || "",
        rating: rating,
        reviewTitle: `${rating} Star Rating`,
        reviewComment: comment,
        verifiedPurchase: true,
        status: "APPROVED"
      });

      setShowModal(false);
      Swal.fire({
        icon: "success",
        title: "Review Submitted! ⭐",
        text: `Thank you for rating ${selectedProduct?.productName || "our product"} ${rating} stars! Your feedback helps organic farmers.`,
        timer: 2500,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to submit review.", "error");
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
                    <Link className="nav-link active font-bold" to="/MyAccountReviews">
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
                <div className="mb-6">
                  <h2 className="mb-1 fw-bold text-dark">⭐ Product Reviews &amp; Ratings</h2>
                  <p className="text-muted small">Rate and review products from your delivered orders.</p>
                </div>

                {loading ? (
                  <div className="text-center py-5">
                    <MagnifyingGlass visible={true} height="80" width="80" glassColor="#c0efff" color="#0aad0a" />
                  </div>
                ) : (
                  <div>
                    {userOrders.length === 0 ? (
                      <div className="text-center py-5 bg-light rounded-4 border p-4">
                        <div className="fs-1 mb-2">📦</div>
                        <h5 className="fw-bold text-dark">No Ordered Products Yet</h5>
                        <p className="text-muted small max-w-md mx-auto mb-3">
                          Once you place orders and receive products, you can write reviews and rate items here.
                        </p>
                        <Link to="/Product" className="btn btn-outline-success rounded-pill px-4 fw-bold">
                          Explore Organic Catalog
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userOrders.map((order) => (
                          <div key={order.id} className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                              <div>
                                <span className="fw-bold text-dark me-2">Order #{order.orderNumber}</span>
                                <span className="text-muted small">• {new Date(order.createdAt).toLocaleDateString("en-IN")}</span>
                              </div>
                              <span className="badge bg-success font-monospace px-3 py-1 rounded-pill">{order.status}</span>
                            </div>

                            <div className="divide-y">
                              {(order.items || []).map((item) => (
                                <div key={item.id} className="py-3 d-flex flex-wrap align-items-center justify-content-between gap-3">
                                  <div className="d-flex align-items-center gap-3">
                                    <div className="w-12 h-12 rounded-3 bg-light border p-1 d-flex items-center justify-center fs-3">
                                      🌾
                                    </div>
                                    <div>
                                      <strong className="text-dark d-block text-sm">{item.productName}</strong>
                                      <span className="text-muted small">{item.variantName || "Standard"} • Qty: {item.quantity}</span>
                                    </div>
                                  </div>

                                  <button
                                    className="btn btn-sm btn-outline-success font-bold rounded-pill px-4 shadow-sm"
                                    onClick={() => handleOpenReviewModal(item)}
                                  >
                                    ⭐ Write Review
                                  </button>
                                </div>
                              ))}
                            </div>
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

      {/* Review Modal */}
      {showModal && (
        <div className="modal show d-block bg-dark bg-opacity-50" tabIndex={-1} style={{ zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-success">⭐ Write Product Review</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmitReview}>
                <div className="modal-body py-3">
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted mb-1">Product</label>
                    <input type="text" className="form-control form-control-sm bg-light" readOnly value={selectedProduct?.productName || ""} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted mb-1">Your City / Location (Place)</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g., Chennai, Tamil Nadu"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted mb-1">Rating (1 to 5 Stars) *</label>
                    <select
                      className="form-select form-select-sm"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ 5 Stars - Outstanding Quality</option>
                      <option value={4}>⭐⭐⭐⭐ 4 Stars - Very Good</option>
                      <option value={3}>⭐⭐⭐ 3 Stars - Average</option>
                      <option value={2}>⭐⭐ 2 Stars - Below Expectation</option>
                      <option value={1}>⭐ 1 Star - Poor</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted mb-1">Your Feedback &amp; Comments *</label>
                    <textarea
                      className="form-control form-control-sm"
                      rows="4"
                      placeholder="Share your experience regarding aroma, taste, freshness, or packaging..."
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>
                </div>

                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-sm btn-light border rounded-pill px-3" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-sm btn-success font-bold rounded-pill px-4 shadow-sm">
                    ⭐ Submit Review
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

export default MyAccountReview;
