import { API_BASE_URL, getImageUrl } from "../services/api";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Grocerylogo = getImageUrl("/media/site/Grocerylogo.png");
const menubanner = getImageUrl("/media/site/menu-banner.jpg");
const productimage1 = getImageUrl("/media/products/product-img-1.jpg");
const productimage2 = getImageUrl("/media/products/product-img-2.jpg");
const productimage3 = getImageUrl("/media/products/product-img-3.jpg");
const productimage4 = getImageUrl("/media/products/product-img-4.jpg");
const productimage5 = getImageUrl("/media/products/product-img-5.jpg");

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState(null);

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

  useEffect(() => {
    fetchCart();
    const interval = setInterval(fetchCart, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
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
                    {/* Wishlist Link */}
                    <Link
                      to="/ShopWishList"
                      className="btn btn-sm btn-light border shadow-sm d-flex align-items-center gap-1.5 fw-bold px-3 py-1.5 text-dark rounded-pill"
                      title="Wishlist"
                    >
                      <span style={{ fontSize: '16px', lineHeight: '1' }}>❤️</span>
                      <span className="small">Wishlist</span>
                      <span className="badge bg-danger rounded-pill ms-1" style={{ fontSize: '10px' }}>5</span>
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
                {/* Wishlist Link */}
                <Link
                  to="/ShopWishList"
                  className="btn btn-sm btn-light border shadow-sm d-flex align-items-center gap-1.5 fw-bold px-3 py-1.5 text-dark rounded-pill"
                  title="Wishlist"
                >
                  <span style={{ fontSize: '16px', lineHeight: '1' }}>❤️</span>
                  <span className="small">Wishlist</span>
                  <span className="badge bg-danger rounded-pill ms-1" style={{ fontSize: '10px' }}>5</span>
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
              src={Grocerylogo}
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
              <Link className="dropdown-item" to="/AboutUs">
                About us
              </Link>
              {/* <Link className="dropdown-item" to="pages/404error.html">
                    404 Error
                  </Link> */}
              <Link className="dropdown-item" to="/Contact">
                Contact
              </Link>
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
              Stores
            </Link>
            <div
              className="dropdown-menu sm-menu"
              aria-labelledby="navbarDropdown"
            >
              <Link className="dropdown-item" to="/StoreList">
                Store List
              </Link>
              {/* <Link className="dropdown-item" to="pages/store-grid.html">
                    Store Grid
                  </Link> */}
              <Link className="dropdown-item" to="/SingleShop">
                Single Store
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
      {/* <div className="col-md-2 col-xxl-1 text-end d-none d-lg-block">
            
          </div> */}
    </div>
      </nav >
  <>
    <div>
      {/* Modal */}
      <div
        className="modal fade"
        id="userModal"
        tabIndex={-1}
        aria-labelledby="userModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-4">
            <div className="modal-header border-0">
              <h5 className="modal-title fs-3 fw-bold" id="userModalLabel">
                Sign Up
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    placeholder="Enter Your Name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter Email address"
                    required
                  />
                </div>
                <div className="mb-5">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter Password"
                    required
                  />
                  <small className="form-text">
                    By Signup, you agree to our{" "}
                    <Link to="#!">Terms of Service</Link> &amp;{" "}
                    <Link to="#!">Privacy Policy</Link>
                  </small>
                </div>
                <button type="submit" className="btn btn-primary">
                  Sign Up
                </button>
              </form>
            </div>
            <div className="modal-footer border-0 justify-content-center">
              Already have an account? <Link to="/MyAccountSignIn">Sign in</Link>
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
            <small>Location in 382480</small>
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
              <Link to="/Shop" className="btn btn-sm btn-success fw-bold" data-bs-dismiss="offcanvas">
                Shop Products
              </Link>
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
                  <Link
                    to="/ShopCart"
                    className="btn btn-outline-success fw-bold"
                    data-bs-dismiss="offcanvas"
                  >
                    View Full Cart
                  </Link>
                  <Link
                    to="/ShopCheckOut"
                    className="btn btn-success btn-lg fw-bold d-flex justify-content-between align-items-center"
                    data-bs-dismiss="offcanvas"
                  >
                    <span>Proceed to Checkout</span>
                    <span>₹{(cart.subtotal || 0).toLocaleString('en-IN')} &rsaquo;</span>
                  </Link>
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
                      <span>Min:$20</span>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action"
                    >
                      <span>Alaska</span>
                      <span>Min:$30</span>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action"
                    >
                      <span>Arizona</span>
                      <span>Min:$50</span>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action"
                    >
                      <span>California</span>
                      <span>Min:$29</span>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action"
                    >
                      <span>Colorado</span>
                      <span>Min:$80</span>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action"
                    >
                      <span>Florida</span>
                      <span>Min:$90</span>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action"
                    >
                      <span>Arizona</span>
                      <span>Min:$50</span>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action"
                    >
                      <span>California</span>
                      <span>Min:$29</span>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action"
                    >
                      <span>Colorado</span>
                      <span>Min:$80</span>
                    </Link>
                    <Link
                      to="#"
                      className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action"
                    >
                      <span>Florida</span>
                      <span>Min:$90</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
    </div >
  );
};

export default Header;
