import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL, getImageUrl, fetchUserReviews, updateProductReview, uploadReviewImages } from "../../services/api";
import Swal from "sweetalert2";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";

const MyAccountReviews = () => {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
      id: null,
      rating: 5,
      title: "",
      comment: "",
      imageFiles: [],
      imagePreviews: [],
      existingImageUrls: [],
      submitting: false
  });

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

  const openEditModal = (rev) => {
      setEditData({
          id: rev.id,
          rating: rev.rating || 5,
          title: rev.reviewTitle || "",
          comment: rev.reviewComment || "",
          existingImageUrls: rev.imageUrls && rev.imageUrls.length > 0 ? rev.imageUrls : (rev.imageUrl ? [rev.imageUrl] : []),
          imageFiles: [],
          imagePreviews: [],
          submitting: false
      });
      setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
      e.preventDefault();
      if (!editData.comment.trim()) {
          Swal.fire("Missing Field", "Please write your review comment", "warning");
          return;
      }

      setEditData(prev => ({ ...prev, submitting: true }));
      try {
          let finalImageUrls = [...editData.existingImageUrls];

          if (editData.imageFiles && editData.imageFiles.length > 0) {
              const uploadRes = await uploadReviewImages(editData.imageFiles);
              if (uploadRes.imageUrls && uploadRes.imageUrls.length > 0) {
                  finalImageUrls = [...finalImageUrls, ...uploadRes.imageUrls];
              }
          }

          await updateProductReview(editData.id, {
              rating: editData.rating,
              reviewTitle: editData.title,
              reviewComment: editData.comment,
              imageUrls: finalImageUrls,
              imageUrl: finalImageUrls.length > 0 ? finalImageUrls[0] : null
          });

          Swal.fire({
              title: "Review Updated! ⭐",
              icon: "success",
              confirmButtonColor: "#198754",
              timer: 1500,
              showConfirmButton: false
          });
          setShowEditModal(false);
          loadReviews();
      } catch (err) {
          console.error("Edit submission error:", err);
          Swal.fire("Error", err.message || "Failed to update review", "error");
      } finally {
          setEditData(prev => ({ ...prev, submitting: false }));
      }
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
                              <button onClick={() => openEditModal(rev)} className="btn btn-sm btn-outline-secondary rounded-pill ms-2">
                                <i className="fas fa-edit me-1"></i> Edit
                              </button>
                            </div>
                          </div>

                          {rev.reviewTitle && (
                            <h6 className="fw-bold text-emerald-800 mb-2">{rev.reviewTitle}</h6>
                          )}

                          <p className="text-secondary leading-relaxed mb-3">{rev.reviewComment}</p>

                          {/* Customer Uploaded Photos */}
                          {((rev.imageUrls && rev.imageUrls.length > 0) || rev.imageUrl) && (
                            <div className="mt-3">
                              <div className="small text-muted fw-bold mb-1">📸 Your Uploaded Photos:</div>
                              <div className="d-flex flex-wrap gap-2">
                                  {(rev.imageUrls && rev.imageUrls.length > 0 ? rev.imageUrls : [rev.imageUrl]).map((url, idx) => (
                                      <img
                                        key={idx}
                                        src={getImageUrl(url)}
                                        alt={`Product Customer Review ${idx+1}`}
                                        className="img-thumbnail rounded-3 shadow-xs cursor-pointer"
                                        style={{ maxHeight: "140px", maxWidth: "180px", objectFit: "cover" }}
                                        onClick={() => setPreviewImage(getImageUrl(url))}
                                      />
                                  ))}
                              </div>
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

      {/* Edit Review Modal */}
      {showEditModal && (
        <div className="modal d-block bg-dark bg-opacity-75" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header bg-success text-white border-0">
                <h5 className="modal-title fw-bold">✏️ Edit Your Review</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                  <div className="modal-body p-4">
                      {/* Rating */}
                      <div className="text-center mb-4">
                          <label className="form-label fw-bold small text-muted">Your Rating:</label>
                          <div className="d-flex justify-content-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                      key={star}
                                      type="button"
                                      className="btn btn-link text-decoration-none p-0 fs-3"
                                      onClick={() => setEditData(prev => ({ ...prev, rating: star }))}
                                  >
                                      <i className={`fas fa-star ${star <= editData.rating ? "text-warning" : "text-secondary opacity-25"}`} />
                                  </button>
                              ))}
                          </div>
                      </div>

                      <div className="mb-3">
                          <label className="form-label fw-bold small text-muted">Review Title:</label>
                          <input
                              type="text"
                              className="form-control rounded-3"
                              value={editData.title}
                              onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                          />
                      </div>

                      <div className="mb-3">
                          <label className="form-label fw-bold small text-muted">Detailed Review:</label>
                          <textarea
                              className="form-control rounded-3"
                              rows={3}
                              value={editData.comment}
                              onChange={(e) => setEditData(prev => ({ ...prev, comment: e.target.value }))}
                              required
                          ></textarea>
                      </div>

                      <div className="mb-3">
                          <label className="form-label fw-bold small text-muted">📸 Add More Photos (Optional):</label>
                          <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="form-control form-control-sm rounded-3"
                              onChange={(e) => {
                                  const files = Array.from(e.target.files).slice(0, 5);
                                  if (files.length > 0) {
                                      const previews = files.map(file => URL.createObjectURL(file));
                                      setEditData(prev => ({
                                          ...prev,
                                          imageFiles: files,
                                          imagePreviews: previews
                                      }));
                                  }
                              }}
                          />
                          
                          {/* Previews of newly added photos */}
                          {editData.imagePreviews.length > 0 && (
                              <div className="d-flex gap-2 mt-2 overflow-x-auto">
                                  {editData.imagePreviews.map((preview, idx) => (
                                      <img key={idx} src={preview} alt="New Preview" className="img-thumbnail" style={{ maxHeight: "60px" }} />
                                  ))}
                              </div>
                          )}

                          {/* Existing Photos */}
                          {editData.existingImageUrls.length > 0 && (
                              <div className="mt-2 pt-2 border-top">
                                  <div className="small text-muted mb-1">Existing Photos:</div>
                                  <div className="d-flex flex-wrap gap-2">
                                      {editData.existingImageUrls.map((url, idx) => (
                                          <div key={idx} className="position-relative">
                                            <img src={getImageUrl(url)} alt="Existing" className="img-thumbnail" style={{ maxHeight: "60px" }} />
                                            <button 
                                                type="button" 
                                                className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle py-0 px-1 m-1"
                                                onClick={() => setEditData(prev => ({
                                                    ...prev,
                                                    existingImageUrls: prev.existingImageUrls.filter((_, i) => i !== idx)
                                                }))}
                                            >
                                                &times;
                                            </button>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          )}
                      </div>
                  </div>
                  <div className="modal-footer border-0 pt-0">
                      <button type="button" className="btn btn-light fw-medium rounded-pill" onClick={() => setShowEditModal(false)}>Cancel</button>
                      <button type="submit" className="btn btn-success fw-bold rounded-pill px-4" disabled={editData.submitting}>
                          {editData.submitting ? "Saving..." : "Save Changes"}
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

export default MyAccountReviews;
