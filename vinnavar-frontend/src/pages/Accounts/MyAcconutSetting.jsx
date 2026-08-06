import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import Swal from "sweetalert2";
import ScrollToTop from "../ScrollToTop";
import { API_BASE_URL } from "../../services/api";

const MyAcconutSetting = () => {
  const [loaderStatus, setLoaderStatus] = useState(true);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("vinnavar_customer");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setEmail(currentUser.email || "");
      setMobileNumber(currentUser.mobileNumber || "");
    }
    setTimeout(() => {
      setLoaderStatus(false);
    }, 500);
  }, [currentUser]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!mobileNumber) {
      Swal.fire("Authentication Error", "Please sign in to update account settings", "warning");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/customer/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobileNumber,
          name,
          email
        })
      });

      if (res.ok) {
        const updated = await res.json();
        localStorage.setItem("vinnavar_customer", JSON.stringify(updated));
        setCurrentUser(updated);
        window.dispatchEvent(new Event("storage"));
        Swal.fire({
          icon: "success",
          title: "Profile Updated 🎉",
          text: "Your account details have been saved successfully.",
          timer: 1800,
          showConfirmButton: false
        });
      } else {
        const errData = await res.json();
        Swal.fire("Error", errData.message || "Failed to update profile", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Failed to connect to server", "error");
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      Swal.fire("Validation Error", "Please enter your new password", "warning");
      return;
    }
    if (newPassword !== confirmPassword) {
      Swal.fire("Password Mismatch", "New Password and Confirm Password do not match", "warning");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/customer/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobileNumber,
          currentPassword,
          newPassword
        })
      });

      if (res.ok) {
        const updated = await res.json();
        localStorage.setItem("vinnavar_customer", JSON.stringify(updated));
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        Swal.fire({
          icon: "success",
          title: "Password Changed 🔒",
          text: "Your password has been updated successfully.",
          timer: 1800,
          showConfirmButton: false
        });
      } else {
        const errData = await res.json();
        Swal.fire("Error", errData.message || "Failed to update password", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Failed to connect to server", "error");
    }
  };

  return (
    <div>
      <ScrollToTop />
      <section className="py-6">
        <div className="container">
          <div className="row">
            {/* Mobile Nav Header */}
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
                    <Link className="nav-link active bg-success text-white font-bold" to="/MyAccountSetting">
                      <i className="fas fa-cog me-2" /> Settings
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/MyAccountAddress">
                      <i className="fas fa-map-marker-alt me-2" /> Address Book
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/MyAcconutPaymentMethod">
                      <i className="fas fa-credit-card me-2" /> Payment Method
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
                {loaderStatus ? (
                  <div className="text-center py-5">
                    <MagnifyingGlass visible={true} height="80" width="80" glassColor="#c0efff" color="#0aad0a" />
                  </div>
                ) : (
                  <div>
                    <div className="mb-6">
                      <h2 className="mb-1 fw-bold text-dark">⚙️ Account Settings</h2>
                      <p className="text-muted small">Update your personal account details and password synced with your database profile.</p>
                    </div>

                    {/* Account Details Form */}
                    <div className="bg-white border shadow-sm rounded-4 p-4 mb-6">
                      <h5 className="mb-4 fw-bold text-dark">👤 Account Details</h5>
                      <form onSubmit={handleUpdateProfile}>
                        <div className="row g-3 max-w-xl">
                          <div className="col-md-6">
                            <label className="form-label small fw-bold text-muted mb-1">Full Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Your full name"
                              required
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label small fw-bold text-muted mb-1">Mobile Phone (Registered)</label>
                            <input
                              type="text"
                              className="form-control bg-light"
                              value={mobileNumber}
                              disabled
                              readOnly
                            />
                          </div>

                          <div className="col-12">
                            <label className="form-label small fw-bold text-muted mb-1">Email Address</label>
                            <input
                              type="email"
                              className="form-control"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="e.g. name@example.com"
                            />
                          </div>

                          <div className="col-12 pt-2">
                            <button type="submit" className="btn btn-success rounded-pill px-4 font-bold shadow-sm">
                              💾 Save Details
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>

                    {/* Password Form */}
                    <div className="bg-white border shadow-sm rounded-4 p-4">
                      <h5 className="mb-4 fw-bold text-dark">🔑 Change Password</h5>
                      <form onSubmit={handleUpdatePassword}>
                        <div className="row g-3 max-w-xl">
                          <div className="col-md-6">
                            <label className="form-label small fw-bold text-muted mb-1">Current Password</label>
                            <input
                              type="password"
                              className="form-control"
                              placeholder="••••••••"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label small fw-bold text-muted mb-1">New Password</label>
                            <input
                              type="password"
                              className="form-control"
                              placeholder="••••••••"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label small fw-bold text-muted mb-1">Confirm New Password</label>
                            <input
                              type="password"
                              className="form-control"
                              placeholder="••••••••"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                          </div>

                          <div className="col-12 pt-2">
                            <button type="submit" className="btn btn-outline-success rounded-pill px-4 font-bold">
                              🔒 Save Password
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyAcconutSetting;
