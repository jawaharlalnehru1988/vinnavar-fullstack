import { fetchSettings, getImageUrl } from "../services/api";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useTranslation } from "react-i18next";



const Footer = () => {
  const { t } = useTranslation();
  let date = new Date();
  let year = date.getFullYear();
  const [logoUrl, setLogoUrl] = useState(getImageUrl("/media/site/logo_vinnavar.webp"));
  const [brandName, setBrandName] = useState("Vinnavar");

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const settings = await fetchSettings();
        const logo = settings?.footer_logo || settings?.store_logo;
        if (logo) {
          setLogoUrl(getImageUrl(logo));
        }
        if (settings?.store_name) {
          setBrandName(settings.store_name);
        }
      } catch (err) {
        console.error("Error fetching footer logo setting", err);
      }
    };
    loadLogo();
  }, []);

  return (
    <div>
      <footer id="footer" className="footer mt-4" style={{ padding: "2rem 0" }}>
        <div className="overlay" />
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="company-details-card bg-white p-4 p-md-5 rounded-4 border shadow-sm">
                
                {/* 3-column details row */}
                <div className="row g-4 align-items-start text-start">
                  
                  {/* Column 1: Brand details */}
                  <div className="col-12 col-md-4">
                    <Link to="/">
                      {logoUrl && (
                        <img
                          src={logoUrl}
                          style={{ height: "96px", width: "96px", objectFit: "contain" }}
                          alt="Vinnavar Logo"
                          className="mb-3"
                        />
                      )}
                    </Link>
                    <h4 className="fw-bold text-dark mb-1" style={{ fontSize: "1.3rem", letterSpacing: "-0.5px" }}>
                      {brandName}
                    </h4>
                    <p className="text-muted small fw-semibold mb-0">
                      Sole Proprietor: <span className="text-dark">Mr. Lokesh Rajan Shah</span>
                    </p>
                  </div>

                  {/* Column 2: Contact & Support */}
                  <div className="col-12 col-md-4 px-md-4" id="corporate-contact">
                    <h6 className="text-uppercase text-success fw-bold small mb-3" style={{ letterSpacing: "1px", fontSize: "0.8rem" }}>
                      Corporate Contact
                    </h6>
                    
                    {/* Address */}
                    <div className="mb-3 text-secondary small">
                      <div className="d-flex align-items-center mb-1.5">
                        <i className="fa fa-map-marker-alt text-success me-2 fs-6 flex-shrink-0" />
                        <span className="fw-bold text-dark">Office Address</span>
                      </div>
                      <div className="ps-4 text-muted" style={{ lineHeight: "1.6" }}>
                        #16, MS Nagar Phase 2, Kurumanthangal Road, Kunnathur, Arani, Tamil Nadu - 632314
                      </div>
                    </div>

                    {/* Email */}
                    <div className="mb-3 text-secondary small">
                      <div className="d-flex align-items-center mb-1.5">
                        <i className="fa fa-envelope text-success me-2 fs-6 flex-shrink-0" />
                        <span className="fw-bold text-dark">Email Support</span>
                      </div>
                      <div className="ps-4">
                        <a href="mailto:vinnavarbrand@gmail.com" className="text-success text-decoration-none fw-semibold">
                          vinnavarbrand@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Registrations */}
                  <div className="col-12 col-md-4 ps-md-4">
                    <h6 className="text-uppercase text-success fw-bold small mb-3" style={{ letterSpacing: "1px", fontSize: "0.8rem" }}>
                      Registrations & Licenses
                    </h6>
                    <div className="d-flex flex-column gap-3 text-secondary small">
                      <div>
                        <span className="fw-bold text-dark d-block mb-1">GSTIN ID</span>
                        <span className="font-monospace text-dark bg-light border rounded px-2.5 py-1.5 d-inline-block">
                          33AFOPL7097M1ZN
                        </span>
                      </div>
                      <div>
                        <span className="fw-bold text-dark d-block mb-1">FSSAI ID</span>
                        <span className="font-monospace text-dark bg-light border rounded px-2.5 py-1.5 d-inline-block">
                          22425479000675
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Payment Methods & Security Banner */}
                <div className="border-top mt-4 pt-4">
                  <div className="row g-4 align-items-center">
                    
                    {/* Left Column: Trusted & Secured by Razorpay */}
                    <div className="col-12 col-lg-4 text-center text-lg-start">
                      <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-3">
                        <div className="bg-success-subtle text-success p-2 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 44, height: 44 }}>
                          <i className="fa fa-shield-alt fs-4 text-success" />
                        </div>
                        <div>
                          <span className="fw-bold text-dark d-block" style={{ fontSize: "0.85rem" }}>
                            Trusted & 100% Secured Payment
                          </span>
                          <div className="d-flex align-items-center gap-1.5 mt-1 justify-content-center justify-content-lg-start">
                            <span className="small text-muted" style={{ fontSize: "0.75rem" }}>Powered by</span>
                            <img src={getImageUrl("/media/site/razorpay.svg")} alt="Razorpay" title="Razorpay Secure" style={{ height: "22px", width: "auto", objectFit: "contain" }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Official Payment Brand SVGs */}
                    <div className="col-12 col-lg-8">
                      <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-end gap-3">
                        
                        {/* UPI & Wallets */}
                        <div className="bg-light border rounded-3 p-2.5 px-3 d-flex align-items-center gap-2.5">
                          <span className="small fw-bold text-secondary text-uppercase me-1" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>UPI & Apps:</span>
                          <div className="d-flex align-items-center gap-2.5 flex-wrap justify-content-center">
                            <img src={getImageUrl("/media/site/paytm.svg")} alt="Paytm" title="Paytm" style={{ height: "20px", width: "auto", objectFit: "contain" }} />
                            <img src={getImageUrl("/media/site/phonepe.svg")} alt="PhonePe" title="PhonePe" style={{ height: "20px", width: "auto", objectFit: "contain" }} />
                            <img src={getImageUrl("/media/site/gpay.svg")} alt="Google Pay" title="Google Pay" style={{ height: "20px", width: "auto", objectFit: "contain" }} />
                            <img src={getImageUrl("/media/site/upi.svg")} alt="UPI" title="All UPI Payments" style={{ height: "20px", width: "auto", objectFit: "contain" }} />
                          </div>
                        </div>

                        {/* Debit / Credit Cards */}
                        <div className="bg-light border rounded-3 p-2.5 px-3 d-flex align-items-center gap-2.5">
                          <span className="small fw-bold text-secondary text-uppercase me-1" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>Cards:</span>
                          <div className="d-flex align-items-center gap-2.5 flex-wrap justify-content-center">
                            <img src={getImageUrl("/media/site/visa.svg")} alt="Visa" title="Visa Card" style={{ height: "20px", width: "auto", objectFit: "contain" }} />
                            <img src={getImageUrl("/media/site/mastercard.svg")} alt="Mastercard" title="Mastercard" style={{ height: "20px", width: "auto", objectFit: "contain" }} />
                            <img src={getImageUrl("/media/site/rupay.svg")} alt="RuPay" title="RuPay Card" style={{ height: "20px", width: "auto", objectFit: "contain" }} />
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>

                {/* Legal Policy Links — required by Consumer Protection (E-Commerce) Rules 2020 */}
                <div className="border-top mt-4 pt-4">
                  <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
                    <Link to="/terms-conditions" className="text-muted small text-decoration-none px-2 py-1 rounded hover-text-success" style={{ transition: "color 0.2s" }}>
                      Terms &amp; Conditions
                    </Link>
                    <span className="text-muted small">|</span>
                    <Link to="/privacy-policy" className="text-muted small text-decoration-none px-2 py-1 rounded">
                      Privacy Policy
                    </Link>
                    <span className="text-muted small">|</span>
                    <Link to="/return-policy" className="text-muted small text-decoration-none px-2 py-1 rounded">
                      Return Policy
                    </Link>
                    <span className="text-muted small">|</span>
                    <Link to="/refund-policy" className="text-muted small text-decoration-none px-2 py-1 rounded">
                      Refund Policy
                    </Link>
                  </div>
                </div>

                {/* Unified Footer Copyright line inside the same container */}
                <div className="border-top pt-3 text-center">
                  <div className="text-muted small">
                    © {year} {t("footer_rights")} <span className="fw-bold text-success">LP Traders</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
