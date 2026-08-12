import { API_BASE_URL, fetchSettings, getImageUrl, customerLogin, customerRegister, customerForgotPassword, customerGoogleLogin, getCartId, getWishlistId, mergeCart, mergeWishlist, fetchProducts, fetchCategories } from "../services/api";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../i18n";



const Header = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const languages = LANGUAGES;
  const setLanguage = (lng) => i18n.changeLanguage(lng);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [allSearchProducts, setAllSearchProducts] = useState([]);
  const [allSearchCategories, setAllSearchCategories] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchDropdownRef = useRef(null);

  useEffect(() => {
    const loadSearchData = async () => {
      try {
        const [cats, prods] = await Promise.all([fetchCategories(), fetchProducts()]);
        setAllSearchCategories(cats || []);
        setAllSearchProducts(prods || []);
      } catch (err) {
        console.error("Error loading search data", err);
      }
    };
    loadSearchData();
  }, []);

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) return;
    setAuthLoading(true);
    try {
      const res = await customerGoogleLogin(credentialResponse.credential);
      localStorage.setItem("vinnavar_customer_token", res.token);
      localStorage.setItem("vinnavar_customer", JSON.stringify(res));
      setCurrentUser(res);
      await processPostLoginSync(res);
      closeModal();
      Swal.fire({
        icon: "success",
        title: `Welcome, ${res.name || "Customer"}! 🎉`,
        text: "You have signed in with Google successfully.",
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire("Google Sign In Failed", err.message, "error");
    } finally {
      setAuthLoading(false);
    }
  };
  const [cart, setCart] = useState(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [logoUrl, setLogoUrl] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

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
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [policyModalHeader, setPolicyModalHeader] = useState(null); // { title, content }

  const openPolicyHeader = async (type) => {
    try {
      const res = await fetch(`${API_BASE_URL}/settings`);
      const map = res.ok ? await res.json() : {};
      if (type === "TERMS") {
        setPolicyModalHeader({
          title: "📋 Terms & Conditions",
          content: map.terms_conditions || "Terms & Conditions loading..."
        });
      } else if (type === "PRIVACY") {
        setPolicyModalHeader({
          title: "🔒 Privacy Policy",
          content: map.privacy_policy || "Privacy Policy loading..."
        });
      } else if (type === "REFUND") {
        setPolicyModalHeader({
          title: "📜 Refund & Cancellation Policy",
          content: map.refund_policy || "Refund Policy loading..."
        });
      }
    } catch (e) {
      console.error("Error loading policy", e);
    }
  };

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

  const processPostLoginSync = async (userRes) => {
    try {
      const userIdentifier = userRes.id || userRes.mobileNumber || userRes.username;
      if (!userIdentifier) return;

      const guestCartId = localStorage.getItem("vinnavar_cart_id");
      const guestWishlistId = localStorage.getItem("vinnavar_wishlist_id");

      const userCartId = `user_cart_${userIdentifier}`;
      const userWishlistId = `user_wishlist_${userIdentifier}`;

      if (guestCartId && guestCartId !== userCartId) {
        await mergeCart(guestCartId, userCartId);
      }
      if (guestWishlistId && guestWishlistId !== userWishlistId) {
        await mergeWishlist(guestWishlistId, userWishlistId);
      }

      localStorage.setItem("vinnavar_cart_id", userCartId);
      localStorage.setItem("vinnavar_wishlist_id", userWishlistId);

      window.dispatchEvent(new Event("cartUpdated"));
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (e) {
      console.error("Error merging cart/wishlist post login", e);
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
      await processPostLoginSync(res);
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
    if (!agreeTerms) {
      Swal.fire("Terms Required", "You must accept the Terms & Conditions and Privacy Policy to create an account.", "warning");
      return;
    }
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
      await processPostLoginSync(res);
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
      await processPostLoginSync(res);
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
    localStorage.removeItem("vinnavar_cart_id");
    localStorage.removeItem("vinnavar_wishlist_id");
    setCurrentUser(null);
    setCart({ items: [], totalItemCount: 0, subtotal: 0 });
    setWishlistCount(0);
    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("wishlistUpdated"));
    Swal.fire({
      icon: "info",
      title: "Signed Out",
      text: "You have logged out successfully.",
      timer: 1500,
      showConfirmButton: false
    });
  };

  const fetchCart = async () => {
    const cartId = getCartId();
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
    const wishlistId = getWishlistId();
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
  const filteredProducts = allSearchProducts.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const filteredCategories = allSearchCategories.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 3);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
        {/* Top Marquee Bar */}
        <div className="w-full py-1.5 bg-emerald-800 text-white font-medium text-xs tracking-wide overflow-hidden">
          {/* eslint-disable-next-line jsx-a11y/no-distracting-elements */}
          <marquee behavior="scroll" direction="left" scrollamount="6" className="m-0 align-middle">
            {t("header_marquee")}
          </marquee>
        </div>

        {/* Main Header Single Row Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between gap-3 flex-wrap lg:flex-nowrap">
            
            {/* Left: Enlarged 1x1 inch Logo & Nav Links */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center flex-shrink-0 group">
                {logoUrl && (
                  <img
                    src={logoUrl}
                    style={{ height: "96px", width: "96px", objectFit: "contain" }}
                    className="transition-transform group-hover:scale-105"
                    alt="Vinnavar Logo"
                  />
                )}
              </Link>

              {/* Primary Navigation Links (Single Row) */}
              <nav className="hidden md:flex items-center gap-6 text-xs font-bold tracking-wide uppercase">
                {/* Home */}
                <Link
                  to="/"
                  className={`transition-colors py-1 ${
                    isActive("/") ? "text-emerald-700 font-black border-b-2 border-emerald-600" : "text-slate-700 hover:text-emerald-600 font-semibold"
                  }`}
                >
                  {t("nav_home")}
                </Link>

                {/* Shop Dropdown */}
                <div className="group relative py-1">
                  <Link
                    to="/Product"
                    className={`inline-flex items-center gap-1 transition-colors ${
                      isActive("/Product") ? "text-emerald-700 font-black border-b-2 border-emerald-600" : "text-slate-700 hover:text-emerald-600 font-semibold"
                    }`}
                  >
                    <span>{t("nav_shop")}</span>
                    <span className="text-[10px]">▼</span>
                  </Link>
                  <div className="absolute left-0 top-full hidden group-hover:block w-48 bg-white border border-slate-100 shadow-xl rounded-2xl p-2 z-50 normal-case">
                    <Link to="/Product" className="block px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl">
                      {t("nav_shop_catalog")}
                    </Link>
                    <Link to="/ProductWishList" className="block px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl">
                      {t("nav_wishlist")} ({wishlistCount})
                    </Link>
                    <Link to="/ProductCart" className="block px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl">
                      {t("nav_cart")}
                    </Link>
                    <Link to="/ProductCheckOut" className="block px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl">
                      {t("nav_checkout")}
                    </Link>
                  </div>
                </div>

                {/* About Dropdown */}
                <div className="group relative py-1">
                  <span
                    className={`inline-flex items-center gap-1 cursor-pointer transition-colors ${
                      isActive("/Blog") || isActive("/BlogCategory")
                        ? "text-emerald-700 font-black border-b-2 border-emerald-600"
                        : "text-slate-700 hover:text-emerald-600 font-semibold"
                    }`}
                  >
                    <span>{t("nav_about")}</span>
                    <span className="text-[10px]">▼</span>
                  </span>
                  <div className="absolute left-0 top-full hidden group-hover:block w-52 bg-white border border-slate-100 shadow-xl rounded-2xl p-2 z-50 normal-case">
                    <Link to="/Blog" className="block px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl">
                      {t("nav_blog")}
                    </Link>
                    <Link to="/BlogCategory" className="block px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl">
                      {t("nav_categories")}
                    </Link>
                    <a
                      href="#corporate-contact"
                      onClick={scrollToContact}
                      className="block px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl"
                    >
                      {t("nav_contact")}
                    </a>
                  </div>
                </div>
              </nav>
            </div>

            {/* Middle: Search Input */}
            <div className="hidden lg:flex flex-1 max-w-sm mx-2" ref={searchDropdownRef}>
              <div className="relative w-full">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 border border-slate-200 rounded-full text-slate-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                  placeholder={t("search_placeholder")}
                  value={searchQuery}
                  onFocus={() => setShowSearchDropdown(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setShowSearchDropdown(false);
                      if (searchQuery.trim()) {
                        navigate(`/Product?search=${encodeURIComponent(searchQuery.trim())}`);
                      } else {
                        navigate("/Product");
                      }
                    }
                  }}
                />

                {/* Auto Suggestion Dropdown */}
                {showSearchDropdown && searchQuery.trim().length > 0 && (filteredProducts.length > 0 || filteredCategories.length > 0) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                    <div className="max-h-[60vh] overflow-y-auto py-2">
                      {filteredCategories.length > 0 && (
                        <div className="mb-2">
                          <div className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                            Categories
                          </div>
                          {filteredCategories.map(cat => (
                            <button
                              key={cat.id}
                              onClick={() => {
                                setShowSearchDropdown(false);
                                setSearchQuery("");
                                navigate(`/Product?category=${cat.id}`);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-2"
                            >
                              <span className="text-emerald-600">📁</span>
                              <span className="font-medium">{cat.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {filteredProducts.length > 0 && (
                        <div>
                          <div className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                            Products
                          </div>
                          {filteredProducts.map(prod => (
                            <button
                              key={prod.id}
                              onClick={() => {
                                setShowSearchDropdown(false);
                                setSearchQuery("");
                                navigate(`/product/${prod.slug}`);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 transition-colors flex items-center gap-3"
                            >
                              <img src={getImageUrl(prod.imageUrl)} alt={prod.name} className="w-8 h-8 rounded object-cover border border-slate-200" />
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-slate-800 truncate">{prod.name}</div>
                                {prod.shortDescription && (
                                  <div className="text-[10px] text-slate-500 truncate">{prod.shortDescription}</div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Language Selector Dropdown */}
              <div className="relative" ref={langMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsLangMenuOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition-all shadow-xs cursor-pointer"
                  title="Change Language"
                >
                  <span className="text-sm">🌐</span>
                  <span>{languages.find((l) => l.code === currentLang)?.nativeName || "English"}</span>
                  <span className="text-[10px]">▼</span>
                </button>
                {isLangMenuOpen && (
                  <ul
                    className="dropdown-menu shadow-2xl border border-slate-100 rounded-2xl p-2 mt-2 font-sans text-xs w-48 d-block show"
                    style={{ position: "absolute", right: 0, top: "100%", zIndex: 1000, backgroundColor: "#ffffff" }}
                  >
                    {languages.map((lang) => (
                      <li key={lang.code}>
                        <button
                          type="button"
                          className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl flex items-center justify-between transition-colors ${
                            currentLang === lang.code
                              ? "bg-emerald-100 text-emerald-800 font-bold"
                              : "text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
                          }`}
                          onClick={() => {
                            setLanguage(lang.code);
                            setIsLangMenuOpen(false);
                          }}
                        >
                          <span className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.nativeName}</span>
                          </span>
                          <span className="text-[11px] text-slate-400">({lang.name})</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Track Order */}
              <Link
                to="/TrackOrder"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 transition-all shadow-xs"
                title="Track Order"
              >
                <span className="text-sm">🚚</span>
                <span className="hidden sm:inline">{t("nav_track")}</span>
              </Link>

              {/* Wishlist */}
              <Link
                to="/ProductWishList"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all shadow-xs"
                title="Wishlist"
              >
                <span className="text-sm">❤️</span>
                <span className="hidden sm:inline">Wishlist</span>
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-500 text-white">
                  {wishlistCount}
                </span>
              </Link>

              {/* Account / User Menu */}
              {currentUser ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    className="btn btn-sm btn-success fw-bold inline-flex items-center gap-1.5 p-1 rounded-full shadow-xs bg-emerald-700 hover:bg-emerald-800 border-none text-white text-xs cursor-pointer"
                    type="button"
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    title={currentUser.name}
                  >
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-emerald-800 font-black text-xs shadow-xs">
                      {getUserInitials(currentUser.name)}
                    </span>
                    <span className="text-[10px] me-1">▼</span>
                  </button>
                  {isUserMenuOpen && (
                    <ul
                      className="dropdown-menu shadow-2xl border border-slate-100 rounded-2xl p-2 mt-2 font-sans text-xs w-56 d-block show"
                      style={{ position: "absolute", right: 0, top: "100%", zIndex: 1000 }}
                    >
                      <li className="px-3 py-2.5 border-b border-slate-100 bg-slate-50 rounded-xl mb-1 flex items-center gap-2.5">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-700 text-white font-extrabold text-xs">
                          {getUserInitials(currentUser.name)}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{currentUser.name}</div>
                          <div className="text-slate-500 text-[11px]">📱 +91 {currentUser.mobileNumber}</div>
                        </div>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item rounded-lg py-2 font-medium hover:bg-emerald-50 hover:text-emerald-700 d-flex align-items-center gap-2"
                          to="/MyAccountOrder"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <span>📦</span> <span>{t("my_orders")}</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item rounded-lg py-2 font-medium hover:bg-emerald-50 hover:text-emerald-700 d-flex align-items-center gap-2"
                          to="/MyAccountSetting"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <span>⚙️</span> <span>{t("acc_settings")}</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item rounded-lg py-2 font-medium hover:bg-emerald-50 hover:text-emerald-700 d-flex align-items-center gap-2"
                          to="/MyAccountAddress"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <span>📍</span> <span>{t("saved_addresses")}</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item rounded-lg py-2 font-medium hover:bg-emerald-50 hover:text-emerald-700 d-flex align-items-center gap-2"
                          to="/MyAcconutPaymentMethod"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <span>💳</span> <span>{t("payment_methods")}</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item rounded-lg py-2 font-medium hover:bg-emerald-50 hover:text-emerald-700 d-flex align-items-center gap-2"
                          to="/MyAccountComplaint"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <span>📢</span> <span>{t("complaints")}</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item rounded-lg py-2 font-medium hover:bg-emerald-50 hover:text-emerald-700 d-flex align-items-center gap-2"
                          to="/MyAccountReview"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <span>⭐</span> <span>{t("reviews_feedback")}</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item rounded-lg py-2 font-medium hover:bg-emerald-50 hover:text-emerald-700 d-flex align-items-center gap-2"
                          to="/MyAcconutNotification"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <span>🔔</span> <span>{t("notifications")}</span>
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider my-1" /></li>
                      <li>
                        <button
                          className="dropdown-item rounded-lg py-2 font-bold text-red-600 hover:bg-red-50 d-flex align-items-center gap-2 w-100 border-0 bg-transparent text-start"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            handleLogout();
                          }}
                        >
                          <span>🚪</span> <span>{t("logout")}</span>
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md shadow-emerald-700/20 transition-all active:scale-95 border-none"
                  data-bs-toggle="modal"
                  data-bs-target="#userModal"
                  onClick={() => setAuthMode("SIGN_IN")}
                >
                  <span className="text-sm">👤</span>
                  <span>{t("sign_in")}</span>
                </button>
              )}

              {/* Shopping Cart */}
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-all active:scale-95"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasRight"
                title="Shopping Cart"
              >
                <span className="text-sm">🛒</span>
                <span className="hidden sm:inline">{t("sliding_cart_btn_label")}</span>
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white">
                  {cart?.totalItemCount || cart?.items?.length || 0}
                </span>
              </button>


            </div>
          </div>
        </div>

        {/* Mobile Second-Row Navigation — always visible on mobile/tablet */}
        <div className="md:hidden border-t border-slate-100 bg-white/98 shadow-sm">
          <div
            className="flex items-center gap-2 px-3 py-2 overflow-x-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <Link
              to="/"
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isActive("/") ? "bg-emerald-700 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              🏠 Home
            </Link>
            <Link
              to="/Product"
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isActive("/Product") ? "bg-emerald-700 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              🛒 Shop
            </Link>
            <Link
              to="/TrackOrder"
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isActive("/TrackOrder") ? "bg-emerald-700 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              🚚 Track Order
            </Link>
            <Link
              to="/Blog"
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isActive("/Blog") ? "bg-emerald-700 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              📰 Blog
            </Link>
            <Link
              to="/ProductWishList"
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isActive("/ProductWishList") ? "bg-emerald-700 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              ❤️ Wishlist
            </Link>
            <Link
              to="/ProductCart"
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isActive("/ProductCart") ? "bg-emerald-700 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              🛍️ Cart
            </Link>
            <a
              href="#corporate-contact"
              onClick={scrollToContact}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all"
            >
              📞 Contact
            </a>
          </div>
        </div>
      </header>

      {/* Sub-Header Brand Bar */}
      <div
        className="w-full sticky top-0 z-40"
        style={{
          background: "linear-gradient(90deg, #064e3b 0%, #065f46 40%, #047857 70%, #059669 100%)",
          boxShadow: "0 2px 8px rgba(6,78,59,0.18)"
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 py-1.5">
            <span style={{ fontSize: "15px" }}>🌿</span>
            <span
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: "13px",
                fontWeight: "600",
                letterSpacing: "0.08em",
                color: "#d1fae5",
                textTransform: "none"
              }}
            >
              Vinnavar
            </span>
            <span
              style={{
                fontSize: "11px",
                color: "#6ee7b7",
                fontWeight: "400",
                letterSpacing: "0.04em"
              }}
            >
              —
            </span>
            <span
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: "13px",
                fontWeight: "400",
                letterSpacing: "0.06em",
                color: "#a7f3d0",
                fontStyle: "italic"
              }}
            >
              Organic E-Commerce
            </span>
            <span style={{ fontSize: "15px" }}>🌿</span>
          </div>
        </div>
      </div>

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
                    {authLoading ? "Signing In..." : t("sign_in")}
                  </button>
                </form>
              )}

              {(authMode === "SIGN_IN" || authMode === "SIGN_UP") && (
                <div className="mt-4">
                  <div className="text-center position-relative mb-3">
                    <hr className="my-0" />
                    <span className="position-absolute top-50 start-50 translate-middle bg-white px-2 text-muted small fw-semibold">
                      OR CONTINUE WITH
                    </span>
                  </div>
                  <div className="d-flex justify-content-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => {
                        Swal.fire("Google Sign In", "Google Sign In popup was closed or cancelled.", "info");
                      }}
                      useOneTap={!currentUser && !localStorage.getItem("vinnavar_customer_token")}
                      shape="pill"
                      theme="outline"
                      size="large"
                      width="100%"
                    />
                  </div>
                </div>
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

                  <div className="mb-4 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input cursor-pointer"
                      id="agreeTermsCheck"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      required
                    />
                    <label className="form-check-label small text-muted font-medium" htmlFor="agreeTermsCheck">
                      I agree to the{" "}
                      <span className="text-emerald-700 font-bold cursor-pointer underline" onClick={() => openPolicyHeader("TERMS")}>
                        Terms &amp; Conditions
                      </span>{" "}
                      and{" "}
                      <span className="text-emerald-700 font-bold cursor-pointer underline" onClick={() => openPolicyHeader("PRIVACY")}>
                        Privacy Policy
                      </span>.
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success w-100 fw-bold py-2.5 rounded-3 shadow-sm"
                    style={{ backgroundColor: "#2d6a4f", borderColor: "#2d6a4f" }}
                    disabled={authLoading}
                  >
                    {authLoading ? "Creating Account..." : t("sign_up")}
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
              {t("sliding_cart_title")}
            </h5>
            <small className="text-muted fw-bold">
              {t("sliding_cart_unique_products", { count: cart?.items?.length || 0, total: cart?.totalItemCount || 0 })}
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
            🌱 <strong>{t("sliding_cart_free_delivery_label")}</strong> {t("sliding_cart_free_delivery_desc")}
          </div>

          {(!cart || !cart.items || cart.items.length === 0) ? (
            <div className="text-center py-5">
              <div className="fs-1 mb-2">🛒</div>
              <h6>{t("sliding_cart_empty_title")}</h6>
              <p className="text-muted small">{t("sliding_cart_empty_desc")}</p>
              <button
                type="button"
                className="btn btn-sm btn-success fw-bold"
                onClick={() => handleNavigateFromCart("/Product")}
              >
                {t("sliding_cart_shop_products")}
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
                        <div 
                          className="row align-items-center g-2" 
                          style={{ cursor: "pointer" }}
                          onClick={() => handleNavigateFromCart(`/product/${product.slug || product.id}`)}
                        >
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
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveCartItem(item.id);
                              }}
                              title="Remove item"
                              style={{ fontSize: "12px" }}
                            >
                              🗑️ {t("sliding_cart_remove")}
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="border-top pt-3 mt-2">
                <details className="mb-3">
                  <summary className="fw-bold text-muted cursor-pointer" style={{ listStyle: "none", fontSize: "14px" }}>
                    Price Breakup <span className="float-end">▼</span>
                  </summary>
                  <div className="mt-2 small text-muted ps-2 pe-2">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Base Price</span>
                      <span>₹{(cart.subtotal || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span>Shipping Fee</span>
                      <span>₹{(cart.shippingFee ?? 48).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span>GST Tax</span>
                      <span>₹{(cart.gstTax ?? 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </details>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-bold fs-6">Total Payable <br/><span className="text-muted" style={{fontSize: "12px"}}>(Inclusive of all)</span></span>
                  <span className="fw-bold fs-5 text-success">
                    ₹{(cart.totalAmount ?? ((cart.subtotal || 0) + (cart.shippingFee ?? 48) + ((cart.subtotal || 0) * 0.05))).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="d-grid gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-success fw-bold py-2"
                    onClick={() => handleNavigateFromCart("/ProductCart")}
                  >
                    {t("sliding_cart_view_full")}
                  </button>
                  <button
                    type="button"
                    className="btn btn-success btn-lg fw-bold d-flex justify-content-between align-items-center py-2.5 px-3"
                    onClick={() => handleNavigateFromCart("/ProductCheckOut")}
                  >
                    <span>{t("sliding_cart_proceed_checkout")}</span>
                    <span>₹{(cart.totalAmount ?? ((cart.subtotal || 0) + (cart.shippingFee ?? 48) + ((cart.subtotal || 0) * 0.05))).toLocaleString('en-IN')} &rsaquo;</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Customer Support & Policy Links */}
          <div className="border-top pt-3 mt-4 text-center">
            <div className="small text-muted fw-semibold mb-2">{t("sliding_cart_guarantees")}</div>
            <div className="d-flex justify-content-center gap-2 small font-semibold">
              <button type="button" className="btn btn-link text-success text-decoration-none fw-bold p-0 border-0" onClick={() => openPolicyHeader("REFUND")}>
                {t("sliding_cart_refund")}
              </button>
              <span className="text-muted">•</span>
              <button type="button" className="btn btn-link text-success text-decoration-none fw-bold p-0 border-0" onClick={() => openPolicyHeader("PRIVACY")}>
                {t("sliding_cart_privacy")}
              </button>
              <span className="text-muted">•</span>
              <button type="button" className="btn btn-link text-success text-decoration-none fw-bold p-0 border-0" onClick={() => openPolicyHeader("TERMS")}>
                {t("sliding_cart_terms")}
              </button>
            </div>
          </div>
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

      {/* Policy Modal in Header */}
      {policyModalHeader && (
        <div className="modal show d-block bg-dark bg-opacity-50" tabIndex={-1} style={{ zIndex: 2000 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
              <div className="modal-header bg-emerald-700 text-white py-3 px-4">
                <h5 className="modal-title font-bold text-white mb-0">{policyModalHeader.title}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setPolicyModalHeader(null)} />
              </div>
              <div className="modal-body p-4 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-sans max-h-96 overflow-y-auto">
                {policyModalHeader.content}
              </div>
              <div className="modal-footer border-0 pt-0">
                <button type="button" className="btn btn-sm btn-success font-bold rounded-pill px-4" onClick={() => setPolicyModalHeader(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
