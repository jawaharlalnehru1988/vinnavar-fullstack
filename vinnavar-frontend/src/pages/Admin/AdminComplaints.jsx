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
      case "PENDING": return <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-800 border border-amber-500/20 px-2.5 py-1 text-xs font-bold rounded-full">⏳ Pending</span>;
      case "IN_REVIEW": return <span className="inline-flex items-center gap-1 bg-cyan-500/10 text-cyan-800 border border-cyan-500/20 px-2.5 py-1 text-xs font-bold rounded-full">⚙️ In Review</span>;
      case "RESOLVED": return <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 px-2.5 py-1 text-xs font-bold rounded-full">✅ Resolved</span>;
      case "REJECTED": return <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-800 border border-rose-500/20 px-2.5 py-1 text-xs font-bold rounded-full">❌ Rejected</span>;
      default: return <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 text-xs font-bold rounded-full">{st}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>📢</span> Customer Support & Desk
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Review product damage claims and post resolution notes to customers</p>
        </div>
        <button
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl border border-slate-200 transition-all flex items-center gap-1.5"
          onClick={fetchComplaints}
        >
          <span>🔄</span> Refresh Complaints
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-bold mt-2">Loading support desk tickets...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="text-4xl text-slate-300 mb-2">🎉</div>
          <h4 className="font-extrabold text-slate-900 text-base">No Customer Complaints</h4>
          <p className="text-xs text-slate-400 mt-1">All customers are currently satisfied with their orders!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs font-bold font-mono uppercase tracking-wider whitespace-nowrap">
                  <th className="py-3.5 px-4">DATE & ID</th>
                  <th className="py-3.5 px-4">CUSTOMER</th>
                  <th className="py-3.5 px-4">ORDER & ITEM</th>
                  <th className="py-3.5 px-4">ISSUE TYPE</th>
                  <th className="py-3.5 px-4">STATUS</th>
                  <th className="py-3.5 px-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">#{c.id}</div>
                      <div className="text-xs text-slate-400 font-mono">{new Date(c.createdAt).toLocaleDateString("en-IN")}</div>
                    </td>
                    <td className="py-3 px-4 min-w-[160px]">
                      <div className="font-bold text-slate-900">{c.customerName}</div>
                      <div className="text-xs text-slate-500 font-medium">📱 {c.customerMobile}</div>
                    </td>
                    <td className="py-3 px-4 min-w-[180px]">
                      <span className="inline-block bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                        #{c.orderNumber}
                      </span>
                      <div className="text-xs text-slate-500 mt-1 truncate">{c.productName || "General Package"}</div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <span className="font-extrabold text-rose-600 text-xs uppercase tracking-wider block">
                        {c.issueType ? c.issueType.replace("_", " ") : "SUPPORT"}
                      </span>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{c.description}</p>
                      {c.imageUrl && (
                        <div className="mt-1.5">
                          <img
                            src={getImageUrl(c.imageUrl)}
                            alt="Complaint Attachment"
                            className="w-14 h-11 object-cover rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setPreviewImage(getImageUrl(c.imageUrl))}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/media/placeholder.png";
                            }}
                          />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">{getStatusBadge(c.status)}</td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-300 transition-all shadow-xs"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-100 overflow-hidden">
            <div className="bg-emerald-700 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <span>⚙️</span> Process Complaint #{selectedComplaint.id}
              </h3>
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white font-bold transition-all"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleUpdateComplaint} className="p-6 space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900">Customer: {selectedComplaint.customerName} ({selectedComplaint.customerMobile})</div>
                <div className="text-slate-500">Order #{selectedComplaint.orderNumber} • {selectedComplaint.issueType}</div>
                <p className="text-slate-700 italic border-l-2 border-emerald-500 pl-2 py-0.5">"{selectedComplaint.description}"</p>

                {selectedComplaint.imageUrl && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="font-bold text-slate-500 block mb-1">📸 Customer Product Photo:</span>
                    <img
                      src={getImageUrl(selectedComplaint.imageUrl)}
                      alt="Customer Complaint Photo"
                      className="max-h-32 max-w-full object-cover rounded-xl border border-slate-200 shadow-xs cursor-pointer"
                      onClick={() => setPreviewImage(getImageUrl(selectedComplaint.imageUrl))}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Update Status *</label>
                <select
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="PENDING">⏳ Pending Review</option>
                  <option value="IN_REVIEW">⚙️ In Investigation</option>
                  <option value="RESOLVED">✅ Resolved / Refund Issued</option>
                  <option value="REJECTED">❌ Rejected</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Resolution Note for Customer</label>
                <textarea
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                  rows="3"
                  placeholder="e.g. Refund of ₹350 initiated to original payment method."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs">
                  💾 Save Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL IMAGE PREVIEW MODAL */}
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
            <img src={previewImage} alt="Complaint Attachment Full View" className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain mx-auto" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaints;
