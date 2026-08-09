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

                      {rev.imageUrl && (
                        <div className="flex items-center gap-2">
                          <img
                            src={getImageUrl(rev.imageUrl)}
                            alt="Customer upload"
                            className="w-16 h-14 object-cover rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setPreviewImage(getImageUrl(rev.imageUrl))}
                          />
                          <span className="text-[11px] text-emerald-700 font-bold">📸 Photo attached</span>
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
                      <button
                        type="button"
                        className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center font-bold text-xs transition-all mx-auto"
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
    </div>
  );
};

export default AdminReviews;
