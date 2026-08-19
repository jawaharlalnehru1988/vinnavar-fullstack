import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import Swal from "sweetalert2";
import ScrollToTop from "../ScrollToTop";
import { API_BASE_URL } from "../../services/api";

const MyAccountAddress = () => {
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState("DELIVERY"); // "DELIVERY" or "BILLING"

  const currentUser = (() => {
    try {
      const saved = localStorage.getItem("vinnavar_customer");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  })();

  // Modal / Form States
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    addressType: "DELIVERY",
    title: "Home",
    fullName: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "Tamil Nadu",
    pincode: "",
    isDefault: false
  });

  const fetchAddresses = async () => {
    if (!currentUser || !currentUser.mobileNumber) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/customer/addresses?mobile=${encodeURIComponent(currentUser.mobileNumber)}`);
      if (res.ok) {
        const data = await res.json();
        setAddresses(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch customer addresses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddModal = (type = "DELIVERY") => {
    setEditingId(null);
    setAddressForm({
      addressType: type,
      title: type === "DELIVERY" ? "Home Delivery" : "Main Billing",
      fullName: currentUser?.name || "",
      phone: currentUser?.mobileNumber || "",
      streetAddress: "",
      city: "",
      state: "Tamil Nadu",
      pincode: "",
      isDefault: true,
      saveBoth: true
    });
    setShowModal(true);
  };

  const openEditModal = (addr) => {
    setEditingId(addr.id);
    setAddressForm({
      addressType: addr.addressType || "DELIVERY",
      title: addr.title || "Home",
      fullName: addr.fullName || "",
      phone: addr.phone || "",
      streetAddress: addr.streetAddress || "",
      city: addr.city || "",
      state: addr.state || "Tamil Nadu",
      pincode: addr.pincode || "",
      isDefault: Boolean(addr.isDefault),
      saveBoth: false
    });
    setShowModal(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!currentUser || !currentUser.mobileNumber) {
      Swal.fire("Authentication Required", "Please sign in to manage your addresses", "warning");
      return;
    }

    const { saveBoth, ...primaryPayload } = addressForm;
    const mainAddressData = {
      ...primaryPayload,
      customerMobile: currentUser.mobileNumber
    };

    try {
      const url = editingId
        ? `${API_BASE_URL}/customer/addresses/${editingId}`
        : `${API_BASE_URL}/customer/addresses`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mainAddressData)
      });

      if (res.ok) {
        // If saveBoth is checked, also save the opposite address type (BILLING if DELIVERY, or DELIVERY if BILLING)
        if (saveBoth && !editingId) {
          const oppositeType = mainAddressData.addressType === "DELIVERY" ? "BILLING" : "DELIVERY";
          const oppositeTitle = oppositeType === "BILLING" ? "Main Billing" : "Home Delivery";
          await fetch(`${API_BASE_URL}/customer/addresses`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...mainAddressData,
              addressType: oppositeType,
              title: oppositeTitle
            })
          });
        }

        setShowModal(false);
        Swal.fire({
          icon: "success",
          title: editingId ? "Address Updated 🎉" : (saveBoth ? "Delivery & Billing Addresses Synced 🎉" : "New Address Added 🎉"),
          timer: 1800,
          showConfirmButton: false
        });
        fetchAddresses();
      } else {
        Swal.fire("Error", "Failed to save address details", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Failed to save address", "error");
    }
  };

  const handleDeleteAddress = async (id) => {
    const result = await Swal.fire({
      title: "Delete Address?",
      text: "Are you sure you want to remove this saved address?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      confirmButtonColor: "#dc3545"
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_BASE_URL}/customer/addresses/${id}`, { method: "DELETE" });
        if (res.ok) {
          Swal.fire({ icon: "success", title: "Address Removed", timer: 1200, showConfirmButton: false });
          fetchAddresses();
        }
      } catch (err) {
        Swal.fire("Error", "Failed to delete address", "error");
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/customer/addresses/${id}/default`, { method: "PUT" });
      if (res.ok) {
        Swal.fire({ icon: "success", title: "Set as Default Address", timer: 1200, showConfirmButton: false });
        fetchAddresses();
      }
    } catch (err) {
      Swal.fire("Error", "Failed to set default address", "error");
    }
  };

  const deliveryAddresses = addresses.filter((a) => a.addressType === "DELIVERY");
  const billingAddresses = addresses.filter((a) => a.addressType === "BILLING");

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
              <div className="pt-10 pe-lg-10">
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
                    <Link className="nav-link active font-bold" to="/MyAccountAddress">
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

            {/* Main Content Area */}
            <div className="col-lg-9 col-md-8 col-12">
              <div className="p-4 p-lg-8">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                  <div>
                    <h2 className="mb-1 fw-bold text-dark">📍 Saved Addresses</h2>
                    <p className="text-muted small mb-0">Manage your Delivery &amp; Billing address details synchronized with your account.</p>
                  </div>
                  <button
                    className="btn btn-success font-bold px-4 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2"
                    onClick={() => openAddModal(activeTab)}
                  >
                    <span>➕</span> <span>Add New Address</span>
                  </button>
                </div>

                {/* Section Filter Tabs (Delivery vs Billing) */}
                <div className="d-flex gap-2 mb-4 border-bottom pb-2">
                  <button
                    className={`btn btn-sm rounded-pill px-4 py-2 font-bold ${
                      activeTab === "DELIVERY" ? "btn-success text-white shadow-sm" : "btn-outline-secondary"
                    }`}
                    onClick={() => setActiveTab("DELIVERY")}
                  >
                    🚚 Delivery Addresses ({deliveryAddresses.length})
                  </button>
                  <button
                    className={`btn btn-sm rounded-pill px-4 py-2 font-bold ${
                      activeTab === "BILLING" ? "btn-success text-white shadow-sm" : "btn-outline-secondary"
                    }`}
                    onClick={() => setActiveTab("BILLING")}
                  >
                    💳 Billing Addresses ({billingAddresses.length})
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-5">
                    <MagnifyingGlass visible={true} height="80" width="80" glassColor="#c0efff" color="#0aad0a" />
                  </div>
                ) : (
                  <div>
                    {/* Active Address List */}
                    {((activeTab === "DELIVERY" ? deliveryAddresses : billingAddresses).length === 0) ? (
                      <div className="text-center py-5 bg-light rounded-4 border p-4">
                        <div className="fs-1 mb-2">{activeTab === "DELIVERY" ? "🚚" : "💳"}</div>
                        <h5 className="fw-bold text-dark">No {activeTab.toLowerCase()} addresses saved yet</h5>
                        <p className="text-muted small">Add your preferred {activeTab.toLowerCase()} address for faster checkout.</p>
                        <button className="btn btn-outline-success rounded-pill px-4 fw-bold" onClick={() => openAddModal(activeTab)}>
                          + Add {activeTab === "DELIVERY" ? "Delivery" : "Billing"} Address
                        </button>
                      </div>
                    ) : (
                      <div className="row g-4">
                        {(activeTab === "DELIVERY" ? deliveryAddresses : billingAddresses).map((addr) => (
                          <div className="col-lg-6 col-12" key={addr.id}>
                            <div className={`card h-100 border-0 shadow-sm rounded-4 p-4 ${addr.isDefault ? "border-start border-4 border-success bg-white" : "bg-white"}`}>
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="badge bg-success-subtle text-success border border-success fw-bold px-3 py-1.5 rounded-pill fs-6">
                                  {addr.title || "Address"}
                                </span>
                                {addr.isDefault ? (
                                  <span className="badge bg-success text-white px-3 py-1 rounded-pill small font-monospace">Default</span>
                                ) : (
                                  <button
                                    className="btn btn-sm btn-link text-decoration-none text-success small font-bold p-0"
                                    onClick={() => handleSetDefault(addr.id)}
                                  >
                                    Set as Default
                                  </button>
                                )}
                              </div>

                              <div className="small mb-4">
                                <strong className="text-dark fs-6 d-block mb-1">{addr.fullName}</strong>
                                <div className="text-secondary mb-1">{addr.streetAddress}</div>
                                <div className="text-secondary mb-1">{addr.city}, {addr.state} - {addr.pincode}</div>
                                <div className="text-muted fw-bold">📞 +91 {addr.phone}</div>
                              </div>

                              <div className="d-flex align-items-center gap-3 pt-2 border-top mt-auto">
                                <button className="btn btn-sm btn-outline-secondary rounded-pill px-3 fw-bold" onClick={() => openEditModal(addr)}>
                                  ✏️ Edit
                                </button>
                                <button className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-bold" onClick={() => handleDeleteAddress(addr.id)}>
                                  🗑️ Delete
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

      {/* Address Edit / Add Modal */}
      {showModal && (
        <div className="modal show d-block bg-dark bg-opacity-50" tabIndex={-1} style={{ zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-success">
                  {editingId ? "✏️ Edit Address Details" : "➕ Add New Address"}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSaveAddress}>
                <div className="modal-body py-3">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted mb-1">Address Category *</label>
                      <select
                        className="form-select form-select-sm"
                        value={addressForm.addressType}
                        onChange={(e) => setAddressForm({ ...addressForm, addressType: e.target.value })}
                      >
                        <option value="DELIVERY">🚚 Delivery Address</option>
                        <option value="BILLING">💳 Billing Address</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted mb-1">Address Tag / Label *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. Home, Office, Main Billing"
                        required
                        value={addressForm.title}
                        onChange={(e) => setAddressForm({ ...addressForm, title: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted mb-1">Full Name *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        required
                        value={addressForm.fullName}
                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted mb-1">Mobile Phone *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        required
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted mb-1">Street Address *</label>
                      <textarea
                        className="form-control form-control-sm"
                        rows="2"
                        required
                        value={addressForm.streetAddress}
                        onChange={(e) => setAddressForm({ ...addressForm, streetAddress: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-muted mb-1">City *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        required
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-muted mb-1">State *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        required
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-muted mb-1">Pincode *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        required
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      {!editingId && (
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="saveBothCheck"
                            checked={addressForm.saveBoth}
                            onChange={(e) => setAddressForm({ ...addressForm, saveBoth: e.target.checked })}
                          />
                          <label className="form-check-label small font-bold text-success" htmlFor="saveBothCheck">
                            ☑️ Save as both Delivery Address and Billing Address (Sync both)
                          </label>
                        </div>
                      )}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="isDefaultCheck"
                          checked={addressForm.isDefault}
                          onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                        />
                        <label className="form-check-label small font-bold text-dark" htmlFor="isDefaultCheck">
                          Set as Default {addressForm.addressType === "DELIVERY" ? "Delivery" : "Billing"} Address
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
                    💾 Save Address
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

export default MyAccountAddress;
