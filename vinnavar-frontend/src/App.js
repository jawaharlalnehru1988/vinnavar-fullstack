import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";
import Header from './Component/Header';
import Footer from "./Component/Footer";
import Home from "./pages/Home";
import Blog from "./pages/About/Blog";
import BlogCategory from "./pages/About/BlogCategory";
import BlogSingle from "./pages/About/BlogSingle";
import Shop from "./pages/Shop/Shop";
import ShopGridCol3 from "./pages/Shop/ShopGridCol3";
import ShopListCol from "./pages/Shop/ShopListCol";
import ShopCart from "./pages/Shop/ShopCart";
import ShopCheckOut from "./pages/Shop/ShopCheckOut";
import ShopWishList from "./pages/Shop/ShopWishList";
import MyAccountOrder from "./pages/Accounts/MyAccountOrder";
import MyAccountSetting from "./pages/Accounts/MyAcconutSetting";
import MyAcconutNotification from "./pages/Accounts/MyAcconutNotification";
import MyAcconutPaymentMethod from "./pages/Accounts/MyAcconutPaymentMethod";
import MyAccountAddress from "./pages/Accounts/MyAccountAddress";
import MyAccountForgetPassword from "./pages/Accounts/MyAccountForgetPassword";
import MyAccountSignIn from "./pages/Accounts/MyAccountSignIn";
import MyAccountSignUp from "./pages/Accounts/MyAccountSignUp";
import FAQ from "./pages/FooterElements/Faq";
import Coupons from "./pages/FooterElements/Coupons";
import Careers from "./pages/FooterElements/Careers";
import HelpCenter from "./pages/FooterElements/HelpCenter";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
// react 
// css
// browserrouter 
// Components
// pages
// About pages
// Shop pages
// Store pages
// Account pages

import ProductDetails from "./pages/Shop/ProductDetails";
import FloatingWhatsApp from "./Component/FloatingWhatsApp";
import TrackOrder from "./pages/TrackOrder";

const ScrollToTopOnNavigation = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
};

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div>
      <ScrollToTopOnNavigation />
      {!isAdminRoute && <Header />}
      {!isAdminRoute && <FloatingWhatsApp />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/TrackOrder" element={<TrackOrder />} />
        <Route path="/track" element={<TrackOrder />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/Grocery-react" element={<Home />} />
        <Route path="/Grocery-react/" element={<Home />} />
        {/* Product Details page */}
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/product/id/:id" element={<ProductDetails />} />
        <Route path="/ProductDetails" element={<ProductDetails />} />
        {/* Shop pages */}
        <Route path="/Shop" element={<Shop />} />
        <Route path="/ShopGridCol3" element={<ShopGridCol3 />} />
        <Route path="/ShopListCol" element={<ShopListCol />} />
        <Route path="/ShopWishList" element={<ShopWishList />} />
        <Route path="/ShopCheckOut" element={<ShopCheckOut />} />
        <Route path="/ShopCart" element={<ShopCart />} />
        {/* Accounts pages */}
        <Route path="/MyAccountOrder" element={<MyAccountOrder />} />
        <Route path="/MyAccountSetting" element={<MyAccountSetting />} />
        <Route path="/MyAcconutNotification" element={<MyAcconutNotification />} />
        <Route path="/MyAcconutPaymentMethod" element={<MyAcconutPaymentMethod />} />
        <Route path="/MyAccountAddress" element={<MyAccountAddress />} />
        <Route path="/MyAccountForgetPassword" element={<MyAccountForgetPassword />} />
        <Route path="/MyAccountSignIn" element={<MyAccountSignIn />} />
        <Route path="/MyAccountSignUp" element={<MyAccountSignUp />} />
        {/* About pages */}
        <Route path="/Blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogSingle />} />
        <Route path="/BlogSingle" element={<BlogSingle />} />
        <Route path="/BlogCategory" element={<BlogCategory />} />
        <Route path="/Contact" element={<Navigate to="/" replace />} />
        <Route path="/AboutUs" element={<Navigate to="/" replace />} />
        {/* Footer Elements */}
        <Route path="/Faq" element={<FAQ />} />
        <Route path="/Coupons" element={<Coupons />} />
        <Route path="/Careers" element={<Careers />} />
        <Route path="/helpcenter" element={<HelpCenter />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
