import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL, getImageUrl, fetchUserReviews } from "../../services/api";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";

const MyAccountReviews = () => {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const currentUser = (() => {
    try {
      const saved = localStorage.getItem("vinnavar_customer");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  })();

  const loadReviews = async () => {
    if (!currentUser || !currentUser.mobileNumber) {
      setLoading(false);
      return;
    }

    try {
      const userMobile = String(currentUser.mobileNumber).trim();
      const data = await fetchUserReviews(userMobile);
      setReviews(data || []);
    } catch (err) {
      console.error("Failed to fetch user reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`fas fa-star ${i <= rating ? "text-warning" : "text-secondary opacity-25"}`}
        />
      );
    }
    return stars;
  };

  return (
    <div>
      <ScrollToTop />
      <section className="py-6">
        <div className="container">
          <div className="row">
            {/* Header Mobile */}
            <div className="col-12 d-md-none mb-3">
              <div className="p-3 bg-light rounded d-flex justify-content-between align-items-center">
                <h3 className="fs-5 mb-0 fw-bold text-success">⭐ My Product Reviews</h3>
                <button
                  className="btn btn-outline-success btn-sm"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasAccount"
                >
                  <i className="fas fa-bars"></i>
                </button>
              </div>
            </div>

            {/* Account Sidebar Navigation */}
            <div className="col-lg-3 col-md-4 col-12 border-end d-none d-md-block">
              <div className="pt-2 pe-lg-4">
                <ul className="nav flex-column nav-pills gap-1">
                  <li className="nav-item">
                    <Link className="nav-link text-dark fw-medium" to="/MyAccountOrder">
                      <i className="fas fa-shopping-bag me-2" /> Your Orders
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link active bg-success fw-bold text-white shadow-xs" to="/MyAccountReviews">
                      <i className="fas fa-star me-2" /> My Reviews
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-dark fw-medium" to="/MyAccountSetting">
                      <i className="fas fa-cog me-2" /> Settings
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-dark fw-medium" to="/MyAccountAddress">
                      <i className="fas fa-map-marker-alt me-2" /> Address
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-dark fw-medium" to="/MyAccountComplaint">
                      <i className="fas fa-headset me-2" /> Help &amp; Complaints
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Reviews Main Section */}
            <div className="col-lg-9 col-md-8 col-12">
              <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
                <div>
                  <h3 className="fw-bold text-success m-0">⭐ My Ratings & Product Photos</h3>
                  <p className="text-muted small mb-0 mt-1">
                    Manage all your submitted reviews and photos of organic products.
                  </p>
                </div>
                <span className="badge bg-success-subtle text-success fs-6 px-3 py-2 rounded-pill border border-success">
                  Total Reviews: {reviews.length}
                </span>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <MagnifyingGlass visible={true} height="60" width="60" color="#047857" />
                  <p className="text-muted small mt-2">Loading your reviews...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-5 bg-light rounded-4 border border-dashed p-4">
                  <div className="fs-1 text-muted mb-2">⭐</div>
                  <h5 className="fw-bold text-dark">No Product Reviews Yet</h5>
                  <p className="text-muted small max-w-md mx-auto mb-3">
                    You haven't submitted any product ratings or photos yet. Go to your delivered orders and click "Write Review" to share your feedback!
                  </p>
                  <Link to="/MyAccountOrder" className="btn btn-success fw-bold rounded-pill px-4 shadow-sm">
                    📦 View Delivered Orders
                  </Link>
                </div>
              ) : (
                <div className="row g-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="col-12">
                      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                        <div className="card-body p-4">
                          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                            <div>
                              <h5 className="fw-bold text-dark mb-1">
                                {rev.productName || "Organic Product"}
                              </h5>
                              {rev.orderNumber && (
                                <span className="badge bg-light text-secondary border me-2">
                                  Order #{rev.orderNumber}
                                </span>
                              )}
                              <span className="text-muted small">
                                {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric"
                                })}
                              </span>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                              <div className="d-flex gap-1">{renderStars(rev.rating)}</div>
                              <span className={`badge ${rev.status === "APPROVED" ? "bg-success" : rev.status === "PENDING" ? "bg-warning text-dark" : "bg-secondary"}`}>
                                {rev.status}
                              </span>
                            </div>
                          </div>

                          {rev.reviewTitle && (
                            <h6 className="fw-bold text-emerald-800 mb-2">{rev.reviewTitle}</h6>
                          )}

                          <p className="text-secondary leading-relaxed mb-3">{rev.reviewComment}</p>

                          {/* Customer Uploaded Photo */}
                          {rev.imageUrl && (
                            <div className="mt-3">
                              <div className="small text-muted fw-bold mb-1">📸 Your Uploaded Photo:</div>
                              <img
                                src={getImageUrl(rev.imageUrl)}
                                alt="Product Customer Review"
                                className="img-thumbnail rounded-3 shadow-xs cursor-pointer"
                                style={{ maxHeight: "140px", maxWidth: "180px", objectFit: "cover" }}
                                onClick={() => setPreviewImage(getImageUrl(rev.imageUrl))}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal Preview */}
      {previewImage && (
        <div className="modal d-block bg-dark bg-opacity-75" tabIndex="-1" onClick={() => setPreviewImage(null)}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-black border-0 rounded-4 overflow-hidden">
              <div className="modal-header border-0 pb-0">
                <button type="button" className="btn-close btn-close-white" onClick={() => setPreviewImage(null)}></button>
              </div>
              <div className="modal-body text-center p-3">
                <img src={previewImage} alt="Review Preview" className="img-fluid rounded-3" style={{ maxHeight: "80vh" }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAccountReviews;
