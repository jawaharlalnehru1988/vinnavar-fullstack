import { getImageUrl } from "../services/api";
import React from "react";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

const groceryshop = getImageUrl("/media/site/Grocerylogo.png");
const amazonpay = getImageUrl("/media/site/amazonpay.svg");
const gpay = getImageUrl("/media/site/gpay.svg");
const paytm = getImageUrl("/media/site/paytm.svg");

const Footer = () => {
  let date = new Date();
  let year = date.getFullYear();

  return (
    <div>
      <footer className="footer mt-8">
        <div className="overlay" />
        <div className="container">
          <div className="row footer-row justify-content-between align-items-start">
            {/* Column 1: Brand Logo + Registered Corporate Office Card */}
            <div className="col-12 col-md-7 col-lg-7 mb-30">
              <div className="footer-widget mb-4">
                <div className="company-details-card bg-white p-3.5 p-md-4 rounded-4 border shadow-sm mb-4">
                  {/* Horizontal Header with Logo and Brand Title */}
                  <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3 mb-3 pb-3 border-bottom">
                    <Link to="/">
                      <img
                        src={groceryshop}
                        style={{ maxHeight: 60, width: "auto", objectFit: "contain" }}
                        alt="Vinnavar Logo"
                      />
                    </Link>
                    <div>
                      <h5 className="fw-bold text-dark mb-1" style={{ fontSize: "1.2rem" }}>
                        Vinnavar Brand
                      </h5>
                      <p className="text-muted small fw-semibold mb-0">
                        Contact: <span className="text-dark">Mr. Lokesh Rajan Shah</span>
                      </p>
                    </div>
                  </div>

                  {/* Clean Formatted Address with Map Marker Icon */}
                  <div className="d-flex align-items-start mb-2.5 text-secondary small" style={{ lineHeight: "1.55" }}>
                    <i className="fa fa-map-marker-alt text-success me-2.5 mt-1 fs-6 flex-shrink-0" />
                    <span>#16, MS Nagar Phase 2, Kurumanthangal Road, Kunnathur, Arani, Tamil Nadu - 632314</span>
                  </div>

                  {/* Clean Formatted Email Icon & Link */}
                  <div className="d-flex align-items-center mb-3 text-secondary small">
                    <i className="fa fa-envelope text-success me-2.5 fs-6 flex-shrink-0" />
                    <a href="mailto:vinnavarbrand@gmail.com" className="text-dark text-decoration-none fw-semibold">
                      vinnavarbrand@gmail.com
                    </a>
                  </div>

                  {/* Registration Badges */}
                  <div className="d-flex flex-wrap gap-2 pt-2.5 border-top mt-2">
                    <span className="badge bg-light text-dark border px-2.5 py-1.5 font-monospace">
                      <span className="text-success fw-bold">GSTIN:</span> 33AFOPL7097M1ZN
                    </span>
                    <span className="badge bg-light text-dark border px-2.5 py-1.5 font-monospace">
                      <span className="text-success fw-bold">FSSAI:</span> 22425479000675
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Payment Partners: Only Amazon Pay, Google Pay, Paytm */}
              <div className="dimc-protect">
                <div>
                  <h6 className="fw-bold mb-2 text-dark">Payment Partners</h6>
                  <ul className="list-inline d-flex align-items-center mb-0 gap-3">
                    <li className="list-inline-item m-0">
                      <Link to="#!">
                        <img src={amazonpay} alt="Amazon Pay" style={{ height: "26px", objectFit: "contain" }} />
                      </Link>
                    </li>
                    <li className="list-inline-item m-0">
                      <Link to="#!">
                        <img src={gpay} alt="Google Pay" style={{ height: "26px", objectFit: "contain" }} />
                      </Link>
                    </li>
                    <li className="list-inline-item m-0">
                      <Link to="#!">
                        <img src={paytm} alt="Paytm" style={{ height: "26px", objectFit: "contain" }} />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Column 2: Get to Know Us */}
            <div className="col-12 col-md-5 col-lg-4 mb-30">
              <div className="footer-widget mb-0">
                <h4>Get to know us</h4>
                <div className="line-footer" />
                <ul className="footer-link mb-0">
                  <li>
                    <Link to="/AboutUs">
                      <span><i className="fa fa-angle-right" /></span> Company
                    </Link>
                  </li>
                  <li>
                    <Link to="/AboutUs">
                      <span><i className="fa fa-angle-right" /></span> About
                    </Link>
                  </li>
                  <li>
                    <Link to="/Blog">
                      <span><i className="fa fa-angle-right" /></span> Blog
                    </Link>
                  </li>
                  <li>
                    <Link to="/helpcenter">
                      <span><i className="fa fa-angle-right" /></span> Help Center
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bar mt-4">
          <div className="container text-center">
            <div className="footer-copy">
              <div className="copyright text-muted small">
                © {year} All Rights Reserved By <span className="fw-bold text-success">Vinnavar Brand</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
