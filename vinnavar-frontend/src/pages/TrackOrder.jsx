import React, { useState } from "react";
import { Link } from "react-router-dom";

const COURIER_PROVIDERS = [
  {
    id: "amazon",
    name: "Amazon Shipping",
    logoText: "📦 Amazon",
    badgeBg: "bg-warning text-dark",
    url: "https://track.amazon.in",
    searchUrl: (awb) => `https://track.amazon.in/tracking/${encodeURIComponent(awb)}`,
    description: "Track packages shipped via Amazon Shipping & Logistics network.",
  },
  {
    id: "xpressbees",
    name: "Xpressbees Courier",
    logoText: "🐝 Xpressbees",
    badgeBg: "bg-primary text-white",
    url: "https://www.xpressbees.com/track",
    searchUrl: (awb) => `https://www.xpressbees.com/shipment/tracking?awb=${encodeURIComponent(awb)}`,
    description: "Fast express delivery status tracking across India.",
  },
  {
    id: "delhivery",
    name: "Delhivery Express",
    logoText: "🚚 Delhivery",
    badgeBg: "bg-danger text-white",
    url: "https://www.delhivery.com/tracking",
    searchUrl: (awb) => `https://www.delhivery.com/track/package/${encodeURIComponent(awb)}`,
    description: "Real-time location updates for Delhivery courier services.",
  },
];

const TrackOrder = () => {
  const [selectedCourier, setSelectedCourier] = useState(COURIER_PROVIDERS[0]);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [activeUrl, setActiveUrl] = useState(COURIER_PROVIDERS[0].url);
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  const handleSelectProvider = (provider) => {
    setSelectedCourier(provider);
    setIsIframeLoading(true);
    if (trackingNumber.trim()) {
      setActiveUrl(provider.searchUrl(trackingNumber.trim()));
    } else {
      setActiveUrl(provider.url);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      setIsIframeLoading(true);
      setActiveUrl(selectedCourier.searchUrl(trackingNumber.trim()));
    } else {
      setActiveUrl(selectedCourier.url);
    }
  };

  return (
    <div className="bg-light min-vh-100 py-4 py-md-5">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-success font-monospace fw-bold">
                Home
              </Link>
            </li>
            <li className="breadcrumb-item active fw-semibold" aria-current="page">
              Track Order
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 mb-4 text-center border-start border-success border-5">
          <span className="badge bg-success-subtle text-success border border-success px-3 py-2 rounded-pill fw-bold mb-2">
            LIVE ORDER TRACKING
          </span>
          <h1 className="fw-bold text-dark display-6 mb-2">Track Your Package & Shipment</h1>
          <p className="text-muted fs-6 mx-auto mb-0" style={{ maxWidth: "680px" }}>
            Monitor your order status in real-time. Enter your AWB / Tracking number or select your courier partner below to view current location and delivery progress.
          </p>
        </div>

        {/* Search & Provider Selection Section */}
        <div className="row g-4 mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <form onSubmit={handleSearchSubmit} className="row g-3 align-items-center">
                <div className="col-md-7 col-lg-8">
                  <label htmlFor="trackingInput" className="form-label fw-bold text-secondary mb-1">
                    Enter AWB / Tracking ID / Order Number
                  </label>
                  <div className="input-group input-group-lg">
                    <span className="input-group-text bg-light text-muted border-end-0">
                      🔍
                    </span>
                    <input
                      type="text"
                      id="trackingInput"
                      className="form-control bg-light border-start-0 fs-6"
                      placeholder="e.g. SF123456789IN / 14002938102"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                    />
                    {trackingNumber && (
                      <button
                        type="button"
                        className="btn btn-light border-start-0 border text-muted"
                        onClick={() => {
                          setTrackingNumber("");
                          setActiveUrl(selectedCourier.url);
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                <div className="col-md-5 col-lg-4 d-flex align-items-end gap-2 mt-3 mt-md-0">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg w-100 fw-bold shadow-sm"
                    style={{ backgroundColor: "#2d6a4f", borderColor: "#2d6a4f" }}
                  >
                    Track Package
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Courier Provider Tabs */}
        <div className="mb-4">
          <h5 className="fw-bold mb-3 text-dark">Select Logistics / Courier Provider</h5>
          <div className="row g-3">
            {COURIER_PROVIDERS.map((provider) => {
              const isSelected = selectedCourier.id === provider.id;
              return (
                <div key={provider.id} className="col-md-4">
                  <div
                    className={`card h-100 rounded-4 border-2 transition-all cursor-pointer ${
                      isSelected
                        ? "border-success shadow bg-white"
                        : "border-light-subtle shadow-sm bg-white"
                    }`}
                    style={{
                      cursor: "pointer",
                      transition: "transform 0.2s ease, border-color 0.2s ease",
                      borderColor: isSelected ? "#2b9348" : "#e0e0e0",
                    }}
                    onClick={() => handleSelectProvider(provider)}
                  >
                    <div className="card-body p-3 d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
                          style={{
                            width: "48px",
                            height: "48px",
                            backgroundColor: isSelected ? "#e8f5e9" : "#f8f9fa",
                            fontSize: "20px",
                          }}
                        >
                          {provider.logoText.split(" ")[0]}
                        </div>
                        <div>
                          <h6 className="fw-bold text-dark mb-0">{provider.name}</h6>
                          <small className="text-muted" style={{ fontSize: "12px" }}>
                            {provider.description}
                          </small>
                        </div>
                      </div>
                      <span className={`badge ${provider.badgeBg} rounded-pill`}>
                        {isSelected ? "Active" : "Select"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Iframe View & External Link Action Bar */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
          <div className="card-header bg-dark text-white p-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="d-flex align-items-center gap-2">
              <span className="spinner-grow spinner-grow-sm text-success" role="status" />
              <span className="fw-bold">
                Embed Status: {selectedCourier.name} Portal
              </span>
              <span className="badge bg-secondary font-monospace ms-2 d-none d-sm-inline">
                {activeUrl}
              </span>
            </div>

            <div className="d-flex gap-2">
              <a
                href={activeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-light rounded-pill fw-semibold"
              >
                🔗 Open Provider Site in New Tab
              </a>
            </div>
          </div>

          <div className="position-relative bg-white" style={{ minHeight: "550px" }}>
            {isIframeLoading && (
              <div
                className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-white"
                style={{ zIndex: 5, opacity: 0.9 }}
              >
                <div className="spinner-border text-success mb-3" style={{ width: "3rem", height: "3rem" }} role="status">
                  <span className="visually-hidden">Loading tracking portal...</span>
                </div>
                <h6 className="fw-bold text-secondary">Loading {selectedCourier.name} tracking page...</h6>
                <p className="small text-muted mb-0">Please wait standard connection time.</p>
              </div>
            )}

            <iframe
              title={`Tracking - ${selectedCourier.name}`}
              src={activeUrl}
              className="w-100 border-0"
              style={{ height: "650px" }}
              onLoad={() => setIsIframeLoading(false)}
            />
          </div>

          {/* External Fallback Notification Banner */}
          <div className="card-footer bg-light p-3 text-muted border-top">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div className="small">
                <strong>Notice:</strong> If the iframe preview above appears blank due to third-party courier security policies, click 
                <a
                  href={activeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fw-bold text-success mx-1"
                >
                  Direct Tracking Portal Link ↗
                </a>
                to complete your query on their website.
              </div>
              <button
                type="button"
                className="btn btn-sm btn-light border text-dark fw-bold"
                onClick={() => setIsIframeLoading(true)}
              >
                🔄 Refresh Frame
              </button>
            </div>
          </div>
        </div>

        {/* FAQs & Quick Guide */}
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
              <div className="fs-3 mb-2">📩</div>
              <h6 className="fw-bold text-dark">Where is my AWB Number?</h6>
              <p className="text-muted small mb-0">
                Check your SMS or order confirmation email sent right after dispatch. The AWB / Tracking number is listed next to your delivery partner details.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
              <div className="fs-3 mb-2">⚡</div>
              <h6 className="fw-bold text-dark">Real-Time Transit Updates</h6>
              <p className="text-muted small mb-0">
                Logistics status updates automatically every few hours as your organic products move through regional fulfillment hubs.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
              <div className="fs-3 mb-2">🎧</div>
              <h6 className="fw-bold text-dark">Need Delivery Help?</h6>
              <p className="text-muted small mb-0">
                If your order status hasn't updated in 48 hours, reach out to our Vinnavar support desk or contact customer service via WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
