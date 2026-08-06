import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import Swal from "sweetalert2";
import ScrollToTop from "../ScrollToTop";

const MyAcconutNotification = () => {
  const [loaderStatus, setLoaderStatus] = useState(true);

  const currentUser = (() => {
    try {
      const saved = localStorage.getItem("vinnavar_customer");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  })();

  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem("vinnavar_notification_prefs");
      return saved ? JSON.parse(saved) : {
        orderUpdatesSms: true,
        orderUpdatesWhatsapp: true,
        promotionalEmail: false,
        accountSummary: true
      };
    } catch (e) {
      return {
        orderUpdatesSms: true,
        orderUpdatesWhatsapp: true,
        promotionalEmail: false,
        accountSummary: true
      };
    }
  });

  useEffect(() => {
    setTimeout(() => {
      setLoaderStatus(false);
    }, 400);
  }, []);

  const handleToggle = (key) => {
    const updated = { ...preferences, [key]: !preferences[key] };
    setPreferences(updated);
    localStorage.setItem("vinnavar_notification_prefs", JSON.stringify(updated));
    Swal.fire({
      icon: "success",
      title: "Preference Updated 🔔",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500
    });
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
                    <Link className="nav-link" to="/MyAccountSetting">
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
                    <Link className="nav-link active bg-success text-white font-bold" to="/MyAcconutNotification">
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
                      <h2 className="mb-1 fw-bold text-dark">🔔 Notification Settings</h2>
                      <p className="text-muted small">Manage your SMS, WhatsApp, and Email notification preferences for orders and updates.</p>
                    </div>

                    <div className="bg-white border shadow-sm rounded-4 p-4 mb-6">
                      <h5 className="mb-4 fw-bold text-dark border-bottom pb-3">📦 Order Status Notifications</h5>

                      <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                        <div>
                          <h6 className="mb-1 fw-bold text-dark">📱 Order SMS Alerts</h6>
                          <p className="mb-0 text-muted small">Receive instant SMS messages for order confirmations, dispatch, and delivery status updates.</p>
                        </div>
                        <div className="form-check form-switch fs-4">
                          <input
                            className="form-check-input cursor-pointer"
                            type="checkbox"
                            role="switch"
                            checked={preferences.orderUpdatesSms}
                            onChange={() => handleToggle("orderUpdatesSms")}
                          />
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                        <div>
                          <h6 className="mb-1 fw-bold text-dark">💬 WhatsApp Order Updates</h6>
                          <p className="mb-0 text-muted small">Get digital invoice copies and live tracking links sent directly to your mobile number.</p>
                        </div>
                        <div className="form-check form-switch fs-4">
                          <input
                            className="form-check-input cursor-pointer"
                            type="checkbox"
                            role="switch"
                            checked={preferences.orderUpdatesWhatsapp}
                            onChange={() => handleToggle("orderUpdatesWhatsapp")}
                          />
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center py-3">
                        <div>
                          <h6 className="mb-1 fw-bold text-dark">📋 Monthly Account Summary</h6>
                          <p className="mb-0 text-muted small">Receive periodic purchase history summaries and loyalty reward statements.</p>
                        </div>
                        <div className="form-check form-switch fs-4">
                          <input
                            className="form-check-input cursor-pointer"
                            type="checkbox"
                            role="switch"
                            checked={preferences.accountSummary}
                            onChange={() => handleToggle("accountSummary")}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border shadow-sm rounded-4 p-4">
                      <h5 className="mb-4 fw-bold text-dark border-bottom pb-3">🎁 Promotional &amp; Seasonal Offers</h5>

                      <div className="d-flex justify-content-between align-items-center py-3">
                        <div>
                          <h6 className="mb-1 fw-bold text-dark">📧 Organic Rice &amp; Oil Festival Discounts</h6>
                          <p className="mb-0 text-muted small">Receive exclusive discount coupons and seasonal organic harvest notifications.</p>
                        </div>
                        <div className="form-check form-switch fs-4">
                          <input
                            className="form-check-input cursor-pointer"
                            type="checkbox"
                            role="switch"
                            checked={preferences.promotionalEmail}
                            onChange={() => handleToggle("promotionalEmail")}
                          />
                        </div>
                      </div>
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

export default MyAcconutNotification;
