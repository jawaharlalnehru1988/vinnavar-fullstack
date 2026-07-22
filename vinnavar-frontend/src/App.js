import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Header from './Component/Header';
import Footer from "./Component/Footer";
import Home from "./pages/Home";
import AboutUs from "./pages/About/AboutUs";
import Blog from "./pages/About/Blog";
import BlogCategory from "./pages/About/BlogCategory";
import Contact from "./pages/About/Contact";
import Shop from "./pages/Shop/Shop";
import ShopGridCol3 from "./pages/Shop/ShopGridCol3";
import ShopListCol from "./pages/Shop/ShopListCol";
import ShopCart from "./pages/Shop/ShopCart";
import ShopCheckOut from "./pages/Shop/ShopCheckOut";
import ShopWishList from "./pages/Shop/ShopWishList";
import StoreList from "./pages/store/StoreList";
import SingleShop from "./pages/store/SingleShop";
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

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div>
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/Grocery-react" element={<Home />} />
        <Route path="/Grocery-react/" element={<Home />} />
        {/* Shop pages */}
        <Route path="/Shop" element={<Shop />} />
        <Route path="/ShopGridCol3" element={<ShopGridCol3 />} />
        <Route path="/ShopListCol" element={<ShopListCol />} />
        <Route path="/ShopWishList" element={<ShopWishList />} />
        <Route path="/ShopCheckOut" element={<ShopCheckOut />} />
        <Route path="/ShopCart" element={<ShopCart />} />
        {/* Store pages */}
        <Route path="/StoreList" element={<StoreList />} />
        <Route path="/SingleShop" element={<SingleShop />} />
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
        <Route path="/BlogCategory" element={<BlogCategory />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/AboutUs" element={<AboutUs />} />
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
