import { getImageUrl } from "../services/api";
import React from "react";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

const groceryshop = getImageUrl("/media/site/Grocerylogo.png");

const Footer = () => {
  let date = new Date();
  let year = date.getFullYear();

  return (
    <div>
      <footer className="footer mt-4" style={{ padding: "2rem 0" }}>
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
                      <img
                        src={groceryshop}
                        style={{ maxHeight: 60, width: "auto", objectFit: "contain" }}
                        alt="Vinnavar Logo"
                        className="mb-3"
                      />
                    </Link>
                    <h4 className="fw-bold text-dark mb-1" style={{ fontSize: "1.3rem", letterSpacing: "-0.5px" }}>
                      LP Traders
                    </h4>
                    <p className="text-muted small fw-semibold mb-0">
                      Authorized Partner: <span className="text-dark">Mr. Lokesh Rajan Shah</span>
                    </p>
                  </div>

                  {/* Column 2: Contact & Support */}
                  <div className="col-12 col-md-4 px-md-4">
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

                {/* Unified Footer Copyright line inside the same container */}
                <div className="border-top mt-4 pt-4 text-center">
                  <div className="text-muted small">
                    © {year} All Rights Reserved By <span className="fw-bold text-success">LP Traders</span>
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
