import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getImageUrl, fetchAdminReviews, updateAdminReviewStatus, deleteAdminReview, updateProductReview, uploadReviewImages } from "../../services/api";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [previewImage, setPreviewImage] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
      id: null,
      rating: 5,
      title: "",
      comment: "",
      customerName: "",
      customerLocation: "",
      customerPhone: "",
      imageFiles: [],
      imagePreviews: [],
      existingImageUrls: [],
      submitting: false
  });

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
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
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

  const openEditModal = (rev) => {
      setEditData({
          id: rev.id,
          rating: rev.rating || 5,
          title: rev.reviewTitle || "",
          comment: rev.reviewComment || "",
          customerName: rev.customerName || "",
          customerLocation: rev.customerLocation || "",
          customerPhone: rev.customerPhone || "",
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
          Swal.fire("Missing Field", "Review comment cannot be empty", "warning");
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
              customerName: editData.customerName,
              customerLocation: editData.customerLocation,
              customerPhone: editData.customerPhone,
              imageUrls: finalImageUrls,
              imageUrl: finalImageUrls.length > 0 ? finalImageUrls[0] : null
          });

          Swal.fire({
              title: "Review Updated! ⭐",
              icon: "success",
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

  const filteredReviews = reviews.filter((r) => {
    if (filterStatus === "ALL") return true;
    return r.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>⭐</span> Customer Reviews & Photo Management
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Review customer feedback, ratings, and uploaded product images. Moderate or delete reviews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500">Status Filter:</label>
          <select
            className="px-3.5 py-1.5 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
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
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-bold mt-2">Loading customer reviews...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="text-4xl text-slate-300 mb-2">⭐</div>
          <h4 className="font-extrabold text-slate-900 text-base">No Customer Reviews Found</h4>
          <p className="text-xs text-slate-400 mt-1">No customer reviews match the selected filter status.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs font-bold font-mono uppercase tracking-wider whitespace-nowrap">
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Product & Order</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Review & Photo</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Moderate</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredReviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 min-w-[180px]">
                      <div className="font-bold text-slate-900">{rev.customerName || "Anonymous"}</div>
                      <div className="text-xs text-slate-500">{rev.customerPhone || "No Phone"}</div>
                      <div className="text-xs text-slate-400">{rev.customerEmail || ""}</div>
                    </td>
                    <td className="py-3 px-4 min-w-[200px]">
                      <div className="font-bold text-emerald-700">{rev.productName || "Product #" + rev.productId}</div>
                      {rev.orderNumber && (
                        <span className="inline-block bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-md mt-0.5">
                          Order #{rev.orderNumber}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-0.5 bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-xs px-2.5 py-1 rounded-lg">
                        {"★".repeat(rev.rating || 5)}
                      </span>
                    </td>
                    <td className="py-3 px-4 min-w-[280px]">
                      {rev.reviewTitle && <div className="font-bold text-slate-900 text-xs mb-0.5">{rev.reviewTitle}</div>}
                      <div className="text-xs text-slate-600 mb-2">{rev.reviewComment}</div>

                      {((rev.imageUrls && rev.imageUrls.length > 0) || rev.imageUrl) && (
                        <div className="flex flex-wrap items-center gap-2">
                          {(rev.imageUrls && rev.imageUrls.length > 0 ? rev.imageUrls : [rev.imageUrl]).map((url, idx) => (
                              <img
                                key={idx}
                                src={getImageUrl(url)}
                                alt="Customer upload"
                                className="w-12 h-10 object-cover rounded-md border border-slate-200 shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => setPreviewImage(getImageUrl(url))}
                              />
                          ))}
                          <span className="text-[11px] text-emerald-700 font-bold ml-1">📸 Photo attached</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-bold rounded-full ${
                        rev.status === "APPROVED"
                          ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"
                          : rev.status === "PENDING"
                          ? "bg-amber-500/10 text-amber-700 border border-amber-500/20"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}>
                        {rev.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <select
                        className="px-2.5 py-1 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                        value={rev.status}
                        onChange={(e) => handleStatusChange(rev.id, e.target.value)}
                      >
                        <option value="APPROVED">APPROVED</option>
                        <option value="PENDING">PENDING</option>
                        <option value="HIDDEN">HIDDEN</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-xs transition-all"
                            onClick={() => openEditModal(rev)}
                            title="Edit Review"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center font-bold text-xs transition-all"
                            onClick={() => handleDelete(rev.id)}
                            title="Delete Review"
                          >
                            🗑️
                          </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PHOTO PREVIEW MODAL */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4" onClick={() => setPreviewImage(null)}>
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-3 shadow-2xl max-w-3xl max-h-[85vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center transition-all z-10"
              onClick={() => setPreviewImage(null)}
            >
              &times;
            </button>
            <img src={previewImage} alt="Customer Uploaded Review" className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain mx-auto" />
          </div>
        </div>
      )}

      {/* EDIT REVIEW MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto" onClick={() => setShowEditModal(false)}>
          <div className="relative bg-white rounded-3xl w-full max-w-2xl my-8 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-emerald-700 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <span>✏️</span> Edit Review
              </h3>
              <button type="button" className="text-white hover:text-slate-200 text-2xl font-bold transition-colors" onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Customer Name:</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
                            value={editData.customerName}
                            onChange={(e) => setEditData(prev => ({ ...prev, customerName: e.target.value }))}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Location:</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
                            value={editData.customerLocation}
                            onChange={(e) => setEditData(prev => ({ ...prev, customerLocation: e.target.value }))}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Rating (1-5):</label>
                    <select
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600 outline-none cursor-pointer"
                        value={editData.rating}
                        onChange={(e) => setEditData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                    >
                        {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Star{r !== 1 ? 's' : ''}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Review Title:</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
                        value={editData.title}
                        onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Review Comment:</label>
                    <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
                        value={editData.comment}
                        onChange={(e) => setEditData(prev => ({ ...prev, comment: e.target.value }))}
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">📸 Add More Photos (Optional):</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
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
                    
                    {editData.imagePreviews.length > 0 && (
                        <div className="mt-2 flex gap-2 overflow-x-auto p-2 border border-slate-200 rounded-lg bg-slate-50">
                            {editData.imagePreviews.map((preview, idx) => (
                                <img key={idx} src={preview} alt="New Preview" className="h-16 rounded-md object-cover" />
                            ))}
                        </div>
                    )}

                    {editData.existingImageUrls.length > 0 && (
                        <div className="mt-3">
                            <label className="block text-[11px] font-bold text-slate-500 mb-1">Existing Photos:</label>
                            <div className="flex flex-wrap gap-2 p-2 border border-slate-200 rounded-lg bg-slate-50">
                                {editData.existingImageUrls.map((url, idx) => (
                                    <div key={idx} className="relative">
                                      <img src={getImageUrl(url)} alt="Existing" className="h-16 w-16 object-cover rounded-md border border-slate-300" />
                                      <button 
                                          type="button" 
                                          className="absolute -top-1 -right-1 bg-rose-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md hover:bg-rose-600 transition-colors"
                                          onClick={() => setEditData(prev => ({
                                              ...prev,
                                              existingImageUrls: prev.existingImageUrls.filter((_, i) => i !== idx)
                                          }))}
                                      >
                                          ✕
                                      </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                    <button type="button" className="px-5 py-2 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </button>
                    <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md text-sm transition-colors" disabled={editData.submitting}>
                        {editData.submitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
