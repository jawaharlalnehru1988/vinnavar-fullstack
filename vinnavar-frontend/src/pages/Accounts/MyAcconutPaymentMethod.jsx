import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import Swal from "sweetalert2";
import ScrollToTop from "../ScrollToTop";
import { API_BASE_URL } from "../../services/api";

const MyAcconutPaymentMethod = () => {
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const currentUser = (() => {
    try {
      const saved = localStorage.getItem("vinnavar_customer");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  })();

  const [form, setForm] = useState({
    paymentType: "CARD",
    providerName: "HDFC Visa",
    accountIdentifier: "",
    expiryInfo: "",
    isDefault: false
  });

  const fetchPaymentMethods = async () => {
    if (!currentUser || !currentUser.mobileNumber) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/customer/payment-methods?mobile=${currentUser.mobileNumber}`);
      if (res.ok) {
        const data = await res.json();
        setPaymentMethods(data || []);
      }
    } catch (err) {
      console.error("Failed to load payment methods", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddModal = () => {
    setForm({
      paymentType: "CARD",
      providerName: "",
      accountIdentifier: "",
      expiryInfo: "",
      isDefault: paymentMethods.length === 0
    });
    setShowModal(true);
  };

  const handleSavePaymentMethod = async (e) => {
    e.preventDefault();
    if (!currentUser || !currentUser.mobileNumber) {
      Swal.fire("Authentication Required", "Please sign in to manage payment methods", "warning");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/customer/payment-methods`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          customerMobile: currentUser.mobileNumber
        })
      });

      if (res.ok) {
        setShowModal(false);
        Swal.fire({
          icon: "success",
          title: "Payment Method Saved 🎉",
          timer: 1500,
          showConfirmButton: false
        });
        fetchPaymentMethods();
      } else {
        Swal.fire("Error", "Failed to save payment method", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Failed to connect to server", "error");
    }
  };

  const handleDeletePaymentMethod = async (id) => {
    const result = await Swal.fire({
      title: "Remove Payment Method?",
      text: "Are you sure you want to remove this saved payment method?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Remove",
      confirmButtonColor: "#dc3545"
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_BASE_URL}/customer/payment-methods/${id}`, { method: "DELETE" });
        if (res.ok) {
          Swal.fire({ icon: "success", title: "Payment Method Removed", timer: 1200, showConfirmButton: false });
          fetchPaymentMethods();
        }
      } catch (err) {
        Swal.fire("Error", "Failed to delete payment method", "error");
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/customer/payment-methods/${id}/default`, { method: "PUT" });
      if (res.ok) {
        Swal.fire({ icon: "success", title: "Set as Default Payment Method", timer: 1200, showConfirmButton: false });
        fetchPaymentMethods();
      }
    } catch (err) {
      Swal.fire("Error", "Failed to set default payment method", "error");
    }
  };

  const getProviderIcon = (type) => {
    switch (type) {
      case "CARD": return "💳";
      case "UPI": return "📲";
      case "NET_BANKING": return "🏦";
      default: return "💵";
    }
  };

  return (
    <div>
      <ScrollToTop />
      <section className="py-6">
        <div className="container">
          <div className="row">
            {/* Mobile Header Nav */}
            <div className="col-12">
              <div className="p-6 d-flex justify-content-between align-items-center d-md-none">
                <h3 className="fs-5 mb-0">Account Settings</h3>
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
                    <Link className="nav-link active font-bold" to="/MyAcconutPaymentMethod">
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

            {/* Main Content Area */}
            <div className="col-lg-9 col-md-8 col-12">
              <div className="p-4 p-lg-8">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-6 gap-3">
                  <div>
                    <h2 className="mb-1 fw-bold text-dark">💳 Saved Payment Methods</h2>
                    <p className="text-muted small mb-0">Manage your saved cards, UPI IDs, and preferred payment preferences.</p>
                  </div>
                  <button
                    className="btn btn-success font-bold px-4 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2"
                    onClick={openAddModal}
                  >
                    <span>➕</span> <span>Add Payment Method</span>
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-5">
                    <MagnifyingGlass visible={true} height="80" width="80" glassColor="#c0efff" color="#0aad0a" />
                  </div>
                ) : (
                  <div>
                    {paymentMethods.length === 0 ? (
                      <div className="text-center py-5 bg-light rounded-4 border p-4">
                        <div className="fs-1 mb-2">💳</div>
                        <h5 className="fw-bold text-dark">No Saved Payment Methods</h5>
                        <p className="text-muted small max-w-md mx-auto mb-3">
                          You haven't saved any custom cards or UPI handles yet. Razorpay Online Payment &amp; Cash on Delivery options are always enabled for quick checkout.
                        </p>
                        <button className="btn btn-outline-success rounded-pill px-4 fw-bold" onClick={openAddModal}>
                          + Add New Payment Method
                        </button>
                      </div>
                    ) : (
                      <div className="row g-4">
                        {paymentMethods.map((pm) => (
                          <div className="col-lg-6 col-12" key={pm.id}>
                            <div className={`card h-100 border-0 shadow-sm rounded-4 p-4 ${pm.isDefault ? "border-start border-4 border-success bg-white" : "bg-white"}`}>
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="d-flex align-items-center gap-2">
                                  <span className="fs-4">{getProviderIcon(pm.paymentType)}</span>
                                  <div>
                                    <strong className="text-dark fs-6 d-block">{pm.providerName}</strong>
                                    <span className="text-muted font-monospace small">{pm.accountIdentifier}</span>
                                  </div>
                                </div>
                                {pm.isDefault ? (
                                  <span className="badge bg-success text-white px-3 py-1.5 rounded-pill small font-monospace">Default</span>
                                ) : (
                                  <button
                                    className="btn btn-sm btn-link text-decoration-none text-success small font-bold p-0"
                                    onClick={() => handleSetDefault(pm.id)}
                                  >
                                    Set as Default
                                  </button>
                                )}
                              </div>

                              {pm.expiryInfo && (
                                <div className="text-muted small mb-3">
                                  Expiry: <strong className="text-dark">{pm.expiryInfo}</strong>
                                </div>
                              )}

                              <div className="d-flex align-items-center justify-content-end pt-2 border-top mt-auto">
                                <button className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-bold" onClick={() => handleDeletePaymentMethod(pm.id)}>
                                  🗑️ Remove
                                </button>
                              </div>
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

      {/* Add Payment Method Modal */}
      {showModal && (
        <div className="modal show d-block bg-dark bg-opacity-50" tabIndex={-1} style={{ zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-success">➕ Add Saved Payment Method</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSavePaymentMethod}>
                <div className="modal-body py-3">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted mb-1">Payment Method Type *</label>
                      <select
                        className="form-select form-select-sm"
                        value={form.paymentType}
                        onChange={(e) => setForm({ ...form, paymentType: e.target.value })}
                      >
                        <option value="CARD">💳 Credit / Debit Card</option>
                        <option value="UPI">📲 UPI ID (GPay / PhonePe / PayTM)</option>
                        <option value="NET_BANKING">🏦 Net Banking</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted mb-1">Bank / Provider Name *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. HDFC Visa, GPay UPI"
                        required
                        value={form.providerName}
                        onChange={(e) => setForm({ ...form, providerName: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted mb-1">
                        {form.paymentType === "UPI" ? "UPI Handle / VPA *" : "Masked Card / Account Number *"}
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder={form.paymentType === "UPI" ? "username@okicici" : "**** **** **** 4321"}
                        required
                        value={form.accountIdentifier}
                        onChange={(e) => setForm({ ...form, accountIdentifier: e.target.value })}
                      />
                    </div>

                    {form.paymentType === "CARD" && (
                      <div className="col-12">
                        <label className="form-label small fw-bold text-muted mb-1">Expiry Date (MM/YYYY)</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="e.g. 10/2028"
                          value={form.expiryInfo}
                          onChange={(e) => setForm({ ...form, expiryInfo: e.target.value })}
                        />
                      </div>
                    )}

                    <div className="col-12">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="isDefaultPmCheck"
                          checked={form.isDefault}
                          onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                        />
                        <label className="form-check-label small font-bold text-dark" htmlFor="isDefaultPmCheck">
                          Set as Default Payment Method
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-sm btn-light border rounded-pill px-3" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-sm btn-success font-bold rounded-pill px-4 shadow-sm">
                    💾 Save Method
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

export default MyAcconutPaymentMethod;
