import { API_BASE_URL, fetchSettings, getImageUrl, customerLogin, customerRegister, customerForgotPassword } from "../services/api";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Grocerylogo = getImageUrl("/media/site/Grocerylogo.png");

const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [logoUrl, setLogoUrl] = useState(Grocerylogo);

  // Authentication & User State
  const [authMode, setAuthMode] = useState("SIGN_IN"); // "SIGN_IN" | "SIGN_UP" | "FORGOT_PASSWORD"
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("vinnavar_customer");
    return saved ? JSON.parse(saved) : null;
  });

  const [loginMobile, setLoginMobile] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerMobile, setRegisterMobile] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [forgotMobile, setForgotMobile] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Password Visibility States
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);

  const getUserInitials = (name) => {
    if (!name || typeof name !== "string") return "VN";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "VN";
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    const single = parts[0];
    return single.length >= 2 ? single.substring(0, 2).toUpperCase() : single.toUpperCase();
  };

  const closeModal = () => {
    try {
      const modalElement = document.getElementById("userModal");
      if (modalElement) {
        const closeBtn = modalElement.querySelector(".btn-close");
        if (closeBtn && typeof closeBtn.click === "function") {
          closeBtn.click();
        } else {
          modalElement.classList.remove("show");
          modalElement.style.display = "none";
        }
      }
    } catch (e) {
      console.warn("Modal hide warning:", e);
    } finally {
      const backdrops = document.querySelectorAll(".modal-backdrop");
      backdrops.forEach((b) => b.remove());
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
  };

  const scrollToContact = (e) => {
    e.preventDefault();
    const contactElem = document.getElementById("corporate-contact") || document.querySelector("footer");
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  const handleCustomerLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const res = await customerLogin({ mobileNumber: loginMobile, password: loginPassword });
      localStorage.setItem("vinnavar_customer_token", res.token);
      localStorage.setItem("vinnavar_customer", JSON.stringify(res));
      setCurrentUser(res);
      closeModal();
      Swal.fire({
        icon: "success",
        title: `Welcome back, ${res.name || "Customer"}! 🎉`,
        text: "You have signed in successfully.",
        timer: 2000,
        showConfirmButton: false
      });
      setLoginMobile("");
      setLoginPassword("");
    } catch (err) {
      Swal.fire("Sign In Failed", err.message, "error");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleCustomerRegister = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const res = await customerRegister({
        name: registerName,
        mobileNumber: registerMobile,
        email: registerEmail,
        password: registerPassword
      });
      localStorage.setItem("vinnavar_customer_token", res.token);
      localStorage.setItem("vinnavar_customer", JSON.stringify(res));
      setCurrentUser(res);
      closeModal();
      Swal.fire({
        icon: "success",
        title: "Account Created! 🎉",
        text: `Welcome to Vinnavar Organics, ${res.name}!`,
        timer: 2500,
        showConfirmButton: false
      });
      setRegisterName("");
      setRegisterMobile("");
      setRegisterEmail("");
      setRegisterPassword("");
    } catch (err) {
      Swal.fire("Registration Failed", err.message, "error");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleCustomerForgotPassword = async (e) => {
    e.preventDefault();
    if (forgotNewPassword !== forgotConfirmPassword) {
      Swal.fire("Password Mismatch", "New Password and Confirm Password do not match.", "warning");
      return;
    }
    setAuthLoading(true);
    try {
      const res = await customerForgotPassword({
        mobileNumber: forgotMobile,
        newPassword: forgotNewPassword
      });
      localStorage.setItem("vinnavar_customer_token", res.token);
      localStorage.setItem("vinnavar_customer", JSON.stringify(res));
      setCurrentUser(res);
      closeModal();
      Swal.fire({
        icon: "success",
        title: "Password Reset Successful! 🎉",
        text: "Your password has been updated and you are now signed in.",
        timer: 2500,
        showConfirmButton: false
      });
      setForgotMobile("");
      setForgotNewPassword("");
      setForgotConfirmPassword("");
      setAuthMode("SIGN_IN");
    } catch (err) {
      Swal.fire("Reset Failed", err.message, "error");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("vinnavar_customer_token");
    localStorage.removeItem("vinnavar_customer");
    setCurrentUser(null);
    Swal.fire({
      icon: "info",
      title: "Signed Out",
      text: "You have logged out successfully.",
      timer: 1500,
      showConfirmButton: false
    });
  };

  const fetchCart = async () => {
    const cartId = localStorage.getItem("vinnavar_cart_id");
    if (!cartId) {
      setCart({ items: [], totalItemCount: 0, subtotal: 0 });
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/cart/${cartId}`);
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (err) {
      console.error("Error fetching cart in header", err);
    }
  };

  const fetchWishlistCount = async () => {
    const wishlistId = localStorage.getItem("vinnavar_wishlist_id");
    if (!wishlistId) {
      setWishlistCount(0);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/wishlist/${wishlistId}`);
      if (res.ok) {
        const data = await res.json();
        setWishlistCount(data.totalItemCount || (data.items ? data.items.length : 0));
      }
    } catch (err) {
      console.error("Error fetching wishlist in header", err);
    }
  };

  const fetchLogoSetting = async () => {
    try {
      const settings = await fetchSettings();
      if (settings && settings.store_logo) {
        setLogoUrl(getImageUrl(settings.store_logo));
      }
    } catch (err) {
      console.error("Error fetching logo in header", err);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchWishlistCount();
    fetchLogoSetting();

    const handleCartUpdated = () => {
      fetchCart();
      fetchWishlistCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdated);
    const interval = setInterval(handleCartUpdated, 3000);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
      clearInterval(interval);
    };
  }, []);

  const handleNavigateFromCart = (path) => {
    const offcanvasElement = document.getElementById("offcanvasRight");
    if (offcanvasElement) {
      const bsOffcanvas = window.bootstrap?.Offcanvas?.getInstance(offcanvasElement);
      if (bsOffcanvas) {
        bsOffcanvas.hide();
      } else {
        offcanvasElement.classList.remove("show");
      }
    }
    const backdrops = document.querySelectorAll(".offcanvas-backdrop, .modal-backdrop");
    backdrops.forEach((b) => b.remove());
    document.body.classList.remove("offcanvas-open", "modal-open");
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";

    navigate(path);
  };

  const handleRemoveCartItem = async (itemId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchCart();
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (err) {
      console.error("Error removing item from cart", err);
    }
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <header className="sticky-top bg-white shadow-sm" style={{ position: "sticky", top: 0, zIndex: 1040 }}>
      <div className="w-100 py-1" style={{ background: "#2b9348", fontSize: "13px", fontWeight: "600", letterSpacing: "0.5px", overflow: "hidden" }}>
        {/* eslint-disable-next-line jsx-a11y/no-distracting-elements */}
        <marquee behavior="scroll" direction="left" scrollamount="6" style={{ verticalAlign: "middle", margin: 0, color: "#fff" }}>
          🌱 Our product is 100 percent natural and available at your doorstep within prescribed time. 🚚
        </marquee>
      </div>
      <>
        <div className="border-bottom">
          <div className="bg-light py-2">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-md-7 col-12 d-flex align-items-center mb-2 mb-md-0">
                  <span className="badge bg-success font-monospace px-2 py-1 me-2" style={{ fontSize: '11px' }}>DEALS</span>
                  <span className="small text-secondary fw-semibold">Super Value Deals - Save more with 100% Pure Organic Staples</span>
                </div>
                <div className="col-md-5 col-12 text-end d-flex justify-content-end align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    {/* Track Order Link */}
                    <Link
                      to="/TrackOrder"
                      className="btn btn-sm btn-outline-success fw-bold d-flex align-items-center gap-1.5 px-3 py-1.5 rounded-pill shadow-sm"
                      title="Track Order"
                    >
                      <span style={{ fontSize: '16px', lineHeight: '1' }}>🚚</span>
                      <span className="small">Track</span>
                    </Link>

                    {/* Wishlist Link */}
                    <Link
                      to="/ShopWishList"
                      className="btn btn-sm btn-light border shadow-sm d-flex align-items-center gap-1.5 fw-bold px-3 py-1.5 text-dark rounded-pill"
                      title="Wishlist"
                    >
                      <span style={{ fontSize: '16px', lineHeight: '1' }}>❤️</span>
                      <span className="small">Wishlist</span>
                      <span className="badge bg-danger rounded-pill ms-1" style={{ fontSize: '10px' }}>{wishlistCount}</span>
                    </Link>

                    {/* Account / Login Button */}
                    {currentUser ? (
                      <div className="dropdown">
                        <button
                          className="btn btn-sm btn-success fw-bold dropdown-toggle d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill shadow-sm"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          style={{ backgroundColor: '#2d6a4f', borderColor: '#2d6a4f' }}
                        >
                          <span
                            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white text-success fw-bold shadow-sm"
                            style={{
                              width: '26px',
                              height: '26px',
                              fontSize: '11px',
                              letterSpacing: '0.5px',
                              lineHeight: 1,
                              color: '#2d6a4f'
                            }}
                          >
                            {getUserInitials(currentUser.name)}
                          </span>
                          <span className="small">Hi, {currentUser.name ? currentUser.name.split(" ")[0] : "Account"}</span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-1" style={{ fontSize: '14px', zIndex: 1060 }}>
                          <li className="px-3 py-2 border-bottom bg-light d-flex align-items-center gap-2.5">
                            <span
                              className="d-inline-flex align-items-center justify-content-center rounded-circle text-white fw-bold shadow-sm me-2"
                              style={{
                                width: '36px',
                                height: '36px',
                                fontSize: '14px',
                                backgroundColor: '#2d6a4f'
                              }}
                            >
                              {getUserInitials(currentUser.name)}
                            </span>
                            <div>
                              <div className="fw-bold text-dark">{currentUser.name}</div>
                              <div className="text-muted small">📱 +91 {currentUser.mobileNumber}</div>
                            </div>
                          </li>
                          <li>
                            <Link className="dropdown-item fw-semibold py-2" to="/MyAccountOrder">
                              📦 My Orders
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item fw-semibold py-2" to="/MyAccountSetting">
                              ⚙️ Account Settings
                            </Link>
                          </li>
                          <li><hr className="dropdown-divider my-1" /></li>
                          <li>
                            <button className="dropdown-item text-danger fw-bold py-2" onClick={handleLogout}>
                              🚪 Sign Out
                            </button>
                          </li>
                        </ul>
                      </div>
                    ) : (
                      <Link
                        to="#!"
                        className="btn btn-sm btn-success fw-bold d-flex align-items-center gap-1.5 px-3.5 py-1.5 text-white shadow rounded-pill"
                        data-bs-toggle="modal"
                        data-bs-target="#userModal"
                        onClick={() => setAuthMode("SIGN_IN")}
                        style={{ backgroundColor: '#2d6a4f', borderColor: '#2d6a4f' }}
                      >
                        <span style={{ fontSize: '16px', lineHeight: '1' }}>👤</span>
                        <span className="small">Login</span>
                      </Link>
                    )}

                    {/* Cart Button */}
                    <Link
                      className="btn btn-sm btn-light border shadow-sm d-flex align-items-center gap-1.5 fw-bold px-3 py-1.5 text-dark rounded-pill"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasRight"
                      to="#offcanvasExample"
                      role="button"
                      aria-controls="offcanvasRight"
                      title="Shopping Cart"
                    >
                      <span style={{ fontSize: '16px', lineHeight: '1' }}>🛒</span>
                      <span className="small">Cart</span>
                      <span className="badge bg-success rounded-pill ms-1" style={{ fontSize: '10px' }}>
                        {cart?.totalItemCount || cart?.items?.length || 0}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
      <>
        <div className="container  displaydesign">
          <div className="row g-4">
            <div className="col-8 col-sm-4 col-lg-9 py-2 ">
              <input
                className="form-control "
                style={{ width: "100%" }}
                list="datalistOptions"
                id="exampleDataList"
                placeholder="Type to search..."
              />
            </div>
            <div className="col-4 col-sm-4 col-lg-3 py-2 d-flex" style={{ justifyContent: 'center' }}>
              {/* Button trigger modal */}
              {/* <button
            type="button"
            className="btn btn-primary "
            data-bs-toggle="modal"
            data-bs-target="/ShoplocationModal"
          >
            <i className="feather-icon icon-map-pin me-2" />
            Location
          </button> */}
              <div className="d-flex align-items-center gap-2">
                {/* Track Order Link */}
                <Link
                  to="/TrackOrder"
                  className="btn btn-sm btn-outline-success fw-bold d-flex align-items-center gap-1.5 px-3 py-1.5 rounded-pill shadow-sm"
                  title="Track Order"
                >
                  <span style={{ fontSize: '16px', lineHeight: '1' }}>🚚</span>
                  <span className="small">Track</span>
                </Link>

                {/* Wishlist Link */}
                <Link
                  to="/ShopWishList"
                  className="btn btn-sm btn-light border shadow-sm d-flex align-items-center gap-1.5 fw-bold px-3 py-1.5 text-dark rounded-pill"
                  title="Wishlist"
                >
                  <span style={{ fontSize: '16px', lineHeight: '1' }}>❤️</span>
                  <span className="small">Wishlist</span>
                  <span className="badge bg-danger rounded-pill ms-1" style={{ fontSize: '10px' }}>{wishlistCount}</span>
                </Link>

                {/* Account / Login Button */}
                <Link
                  to="#!"
                  className="btn btn-sm btn-success fw-bold d-flex align-items-center gap-1.5 px-3.5 py-1.5 text-white shadow rounded-pill"
                  data-bs-toggle="modal"
                  data-bs-target="#userModal"
                  style={{ backgroundColor: '#2d6a4f', borderColor: '#2d6a4f' }}
                >
                  <span style={{ fontSize: '16px', lineHeight: '1' }}>👤</span>
                  <span className="small">Login</span>
                </Link>

                {/* Cart Button */}
                <Link
                  className="btn btn-sm btn-light border shadow-sm d-flex align-items-center gap-1.5 fw-bold px-3 py-1.5 text-dark rounded-pill"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasRight"
                  to="#offcanvasExample"
                  role="button"
                  aria-controls="offcanvasRight"
                  title="Shopping Cart"
                >
                  <span style={{ fontSize: '16px', lineHeight: '1' }}>🛒</span>
                  <span className="small">Cart</span>
                  <span className="badge bg-success rounded-pill ms-1" style={{ fontSize: '10px' }}>
                    {cart?.totalItemCount || cart?.items?.length || 0}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
      <nav className="navbar navbar-expand-lg navbar-light sticky-top">
        <div className="container">
          <Link className="navbar-brand py-1 d-flex align-items-center" to="/">
            <img
              src={logoUrl}
              style={{ maxHeight: 50, width: "auto", objectFit: "contain" }}
              alt="Vinnavar Logo"
            />
          </Link>
          <input
            className="form-control responsivesearch "
            list="datalistOptions"
            id="exampleDataList"
            placeholder="Type to search..."
            fdprocessedid="9icrif"
            style={{ width: "35%" }}
          />

          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile_nav"
            aria-controls="mobile_nav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <div className={`containerr ${isOpen ? 'change' : ''}`} onClick={handleClick}>
              <div className="bar1"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
            </div>
      </button>

      <div className="collapse navbar-collapse" id="mobile_nav">
        <ul className="navbar-nav mr-auto mt-2 mt-lg-0 float-md-right"></ul>
        <ul className="navbar-nav navbar-light">

          <li className="nav-item">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link fw-semibold text-success" to="/TrackOrder">
              🚚 Track Order
            </Link>
          </li>
          <li className="nav-item dmenu dropdown">
            <Link
              className="nav-link dropdown-toggle"
              to="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              About
            </Link>
            <div
              className="dropdown-menu sm-menu"
              aria-labelledby="navbarDropdown"
            >
              <Link class="dropdown-item" to="/Blog">
                Blog
              </Link>
              {/* <Link className="dropdown-item" to="pages/blog-single.html">
                    Blog Single
                  </Link> */}
              <Link className="dropdown-item" to="/BlogCategory">
                Blog Category
              </Link>
              <a className="dropdown-item" href="#corporate-contact" onClick={scrollToContact}>
                Contact Corporate Admin
              </a>
            </div>
          </li>

          <li className="nav-item dmenu dropdown">
            <Link
              className="nav-link dropdown-toggle"
              to="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Shop
            </Link>
            <div
              className="dropdown-menu sm-menu"
              aria-labelledby="navbarDropdown"
            >
              <Link className="dropdown-item" to="/Shop">
                Shop
              </Link>
              <Link className="dropdown-item" to="/ShopWishList">
                Shop Wishlist
              </Link>
              <Link className="dropdown-item" to="/ShopCart">
                Shop Cart
              </Link>
              <Link className="dropdown-item" to="/ShopCheckOut">
                Shop Checkout
              </Link>
            </div>
          </li>


          {/* <li className="nav-item dmenu dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Pages
                </Link>
                <div
                  className="dropdown-menu sm-menu"
                  aria-labelledby="navbarDropdown"
                >
                  <Link class="dropdown-item" to="pages/blog.html">
                    Blog
                  </Link>
                  <div>
                    <Link className="dropdown-item" to="pages/blog-single.html">
                      Blog Single
                    </Link>
                    <Link
                      className="dropdown-item"
                      to="pages/blog-category.html"
                    >
                      Blog Category
                    </Link>
                    <Link className="dropdown-item" to="pages/about.html">
                      About us
                    </Link>
                    <Link className="dropdown-item" to="pages/404error.html">
                      404 Error
                    </Link>
                    <Link className="dropdown-item" to="pages/contact.html">
                      Contact
                    </Link>
                  </div>
                </div>
              </li> */}



          <li className="nav-item dmenu dropdown">
            <Link
              className="nav-link dropdown-toggle"
              to=""
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Account
            </Link>
            <div
              className="dropdown-menu sm-menu"
              aria-labelledby="navbarDropdown"
            >
              <div>
                <div>
                  <Link className="dropdown-item" to="/MyAccountSignIn">
                    Sign in
                  </Link>
                  <Link className="dropdown-item" to="/MyAccountSignUp">
                    Signup
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/MyAccountForgetPassword"
                  >
                    Forgot Password
                  </Link>
                  <Link className="dropdown-item" to="/MyAccountOrder">
                    Orders
                  </Link>
                  <Link className="dropdown-item" to="/MyAccountSetting">
                    Settings
                  </Link>
                  <Link className="dropdown-item" to="/MyAccountAddress">
                    Address
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/MyAcconutPaymentMethod"
                  >
                    Payment Method
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/MyAcconutNotification"
                  >
                    Notification
                  </Link>
                </div>
              </div>
            </div>
          </li>
          {/* <li className="nav-item">
                <Link className="nav-link" to="">
                  Contact us
                </Link>
              </li> */}
        </ul>
      </div>
    </div>
  </nav>
</header>
      {/* Customer User Authentication Modal */}
      <div
        className="modal fade"
        id="userModal"
        tabIndex={-1}
        aria-labelledby="userModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-4 shadow-lg border-0 rounded-4">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fs-3 fw-bold text-success" id="userModalLabel">
                {authMode === "SIGN_IN" && "🔑 Sign In"}
                {authMode === "SIGN_UP" && "✨ Create Account"}
                {authMode === "FORGOT_PASSWORD" && "🔒 Password Recovery"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            <div className="modal-body pt-3">
              {/* MODE 1: SIGN IN */}
              {authMode === "SIGN_IN" && (
                <form onSubmit={handleCustomerLogin}>
                  <p className="text-muted small mb-4">
                    Sign in with your registered mobile phone number &amp; password.
                  </p>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Mobile Phone Number *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light fw-bold text-muted">+91</span>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="e.g. 9876543210"
                        value={loginMobile}
                        onChange={(e) => setLoginMobile(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="form-label small fw-bold mb-0">Password *</label>
                      <button
                        type="button"
                        className="btn btn-link p-0 text-success text-decoration-none fw-bold small"
                        style={{ fontSize: "12px" }}
                        onClick={() => setAuthMode("FORGOT_PASSWORD")}
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="input-group">
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                      <button
                        className="btn btn-outline-secondary bg-white text-muted border-start-0"
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        title={showLoginPassword ? "Hide password" : "Show password"}
                        style={{ borderColor: "#ced4da" }}
                      >
                        {showLoginPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success w-100 fw-bold py-2.5 mt-2 rounded-3 shadow-sm"
                    style={{ backgroundColor: "#2d6a4f", borderColor: "#2d6a4f" }}
                    disabled={authLoading}
                  >
                    {authLoading ? "Signing In..." : "Sign In"}
                  </button>
                </form>
              )}

              {/* MODE 2: SIGN UP */}
              {authMode === "SIGN_UP" && (
                <form onSubmit={handleCustomerRegister}>
                  <p className="text-muted small mb-4">
                    Join Vinnavar Organics for 100% natural, farm-fresh staples.
                  </p>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Jawaharlal Nehru"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Mobile Phone Number *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light fw-bold text-muted">+91</span>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="e.g. 9876543210"
                        value={registerMobile}
                        onChange={(e) => setRegisterMobile(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Email Address (Optional)</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="you@example.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-bold">Password *</label>
                    <div className="input-group">
                      <input
                        type={showRegisterPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Create a strong password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                      />
                      <button
                        className="btn btn-outline-secondary bg-white text-muted border-start-0"
                        type="button"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        title={showRegisterPassword ? "Hide password" : "Show password"}
                        style={{ borderColor: "#ced4da" }}
                      >
                        {showRegisterPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success w-100 fw-bold py-2.5 rounded-3 shadow-sm"
                    style={{ backgroundColor: "#2d6a4f", borderColor: "#2d6a4f" }}
                    disabled={authLoading}
                  >
                    {authLoading ? "Creating Account..." : "Create Account & Sign In"}
                  </button>
                </form>
              )}

              {/* MODE 3: FORGOT PASSWORD */}
              {authMode === "FORGOT_PASSWORD" && (
                <form onSubmit={handleCustomerForgotPassword}>
                  <p className="text-muted small mb-4">
                    Enter your registered mobile phone number to set a new password.
                  </p>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Registered Mobile Phone Number *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light fw-bold text-muted">+91</span>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="e.g. 9876543210"
                        value={forgotMobile}
                        onChange={(e) => setForgotMobile(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">New Password *</label>
                    <div className="input-group">
                      <input
                        type={showForgotNewPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Enter new password"
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        required
                      />
                      <button
                        className="btn btn-outline-secondary bg-white text-muted border-start-0"
                        type="button"
                        onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                        title={showForgotNewPassword ? "Hide password" : "Show password"}
                        style={{ borderColor: "#ced4da" }}
                      >
                        {showForgotNewPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-bold">Confirm New Password *</label>
                    <div className="input-group">
                      <input
                        type={showForgotConfirmPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Confirm new password"
                        value={forgotConfirmPassword}
                        onChange={(e) => setForgotConfirmPassword(e.target.value)}
                        required
                      />
                      <button
                        className="btn btn-outline-secondary bg-white text-muted border-start-0"
                        type="button"
                        onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)}
                        title={showForgotConfirmPassword ? "Hide password" : "Show password"}
                        style={{ borderColor: "#ced4da" }}
                      >
                        {showForgotConfirmPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success w-100 fw-bold py-2.5 rounded-3 shadow-sm"
                    style={{ backgroundColor: "#2d6a4f", borderColor: "#2d6a4f" }}
                    disabled={authLoading}
                  >
                    {authLoading ? "Updating..." : "Reset Password & Sign In"}
                  </button>
                </form>
              )}
            </div>

            <div className="modal-footer border-0 justify-content-center pt-0">
              {authMode === "SIGN_IN" && (
                <div className="small text-muted">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="btn btn-link text-success fw-bold p-0 ms-1 text-decoration-none"
                    onClick={() => setAuthMode("SIGN_UP")}
                  >
                    Sign Up Now
                  </button>
                </div>
              )}
              {authMode === "SIGN_UP" && (
                <div className="small text-muted">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="btn btn-link text-success fw-bold p-0 ms-1 text-decoration-none"
                    onClick={() => setAuthMode("SIGN_IN")}
                  >
                    Sign In
                  </button>
                </div>
              )}
              {authMode === "FORGOT_PASSWORD" && (
                <div className="small text-muted">
                  Remembered your password?{" "}
                  <button
                    type="button"
                    className="btn btn-link text-success fw-bold p-0 ms-1 text-decoration-none"
                    onClick={() => setAuthMode("SIGN_IN")}
                  >
                    Back to Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Shop Cart */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex={-1}
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header border-bottom">
          <div className="text-start">
            <h5 id="offcanvasRightLabel" className="mb-0 fs-4">
              Shop Cart
            </h5>
            <small className="text-muted fw-bold">
              {cart?.items?.length || 0} Unique Products ({cart?.totalItemCount || 0} Items Total)
            </small>
          </div>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="offcanvas-body">
          <div className="alert alert-success p-2 small mb-3" role="alert">
            🌱 <strong>Free Delivery:</strong> All prices inclusive of shipping & taxes!
          </div>

          {(!cart || !cart.items || cart.items.length === 0) ? (
            <div className="text-center py-5">
              <div className="fs-1 mb-2">🛒</div>
              <h6>Your Organic Cart is empty</h6>
              <p className="text-muted small">Add your favorite traditional rice & organic staples.</p>
              <button
                type="button"
                className="btn btn-sm btn-success fw-bold"
                onClick={() => handleNavigateFromCart("/Shop")}
              >
                Shop Products
              </button>
            </div>
          ) : (
            <div>
              <div className="py-2">
                <ul className="list-group list-group-flush">
                  {cart.items.map((item) => {
                    const product = item.product || {};
                    const variant = item.variant || {};
                    const imgUrl = getImageUrl(product.imageUrl || product.imageUrls?.[0]);
                    const itemTotal = item.unitPrice ? (item.unitPrice * item.quantity) : 0;

                    return (
                      <li key={item.id} className="list-group-item py-3 px-0 border-top">
                        <div className="row align-items-center g-2">
                          <div className="col-3">
                            <img
                              src={imgUrl}
                              alt={product.name}
                              className="img-fluid rounded border p-1"
                              style={{ maxHeight: "60px", objectFit: "contain" }}
                            />
                          </div>
                          <div className="col-5">
                            <h6 className="mb-0 text-truncate" style={{ fontSize: "14px" }}>
                              {product.name}
                            </h6>
                            <span className="badge bg-light text-success border">
                              {variant.variantName}
                            </span>
                            <div className="text-muted small mt-1">
                              ₹{item.unitPrice} x {item.quantity}
                            </div>
                          </div>
                          <div className="col-4 text-end">
                            <div className="fw-bold text-dark fs-6">
                              ₹{itemTotal.toLocaleString('en-IN')}
                            </div>
                            <button
                              type="button"
                              className="btn btn-link text-danger p-0 mt-1 border-0 small text-decoration-none"
                              onClick={() => handleRemoveCartItem(item.id)}
                              title="Remove item"
                              style={{ fontSize: "12px" }}
                            >
                              🗑️ Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="border-top pt-3 mt-2">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-bold fs-6">Total Amount:</span>
                  <span className="fw-bold fs-5 text-success">
                    ₹{(cart.subtotal || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="d-grid gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-success fw-bold py-2"
                    onClick={() => handleNavigateFromCart("/ShopCart")}
                  >
                    View Full Cart
                  </button>
                  <button
                    type="button"
                    className="btn btn-success btn-lg fw-bold d-flex justify-content-between align-items-center py-2.5 px-3"
                    onClick={() => handleNavigateFromCart("/ShopCheckOut")}
                  >
                    <span>Proceed to Checkout</span>
                    <span>₹{(cart.subtotal || 0).toLocaleString('en-IN')} &rsaquo;</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Modal */}
      <div
        className="modal fade"
        id="locationModal"
        tabIndex={-1}
        aria-labelledby="locationModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-sm modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body p-6">
              <div className="d-flex justify-content-between align-items-start ">
                <div>
                  <h5 className="mb-1" id="locationModalLabel">
                    Choose your Delivery Location
                  </h5>
                  <p className="mb-0 small">
                    Enter your address and we will specify the offer you
                    area.{" "}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="my-5">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search your area"
                />
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">Select Location</h6>
                <Link
                  to="#"
                  className="btn btn-outline-gray-400 text-muted btn-sm"
                >
                  Clear All
                </Link>
              </div>
              <div>
                <div data-simplebar style={{ height: 300 }}>
                  <div className="list-group list-group-flush">
                    <Link
                      to="#"
                      className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action active"
                    >
                      <span>Alabama</span>
                      <span>Min:₹20</span>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action"
                    >
                      <span>Alaska</span>
                      <span>Min:₹30</span>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action"
                    >
                      <span>Arizona</span>
                      <span>Min:₹50</span>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action"
                    >
                      <span>California</span>
                      <span>Min:₹29</span>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action"
                    >
                      <span>Colorado</span>
                      <span>Min:₹80</span>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action"
                    >
                      <span>Florida</span>
                      <span>Min:₹90</span>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action"
                    >
                      <span>Arizona</span>
                      <span>Min:₹50</span>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action"
                    >
                      <span>California</span>
                      <span>Min:₹29</span>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action"
                    >
                      <span>Colorado</span>
                      <span>Min:₹80</span>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action"
                    >
                      <span>Florida</span>
                      <span>Min:₹90</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
