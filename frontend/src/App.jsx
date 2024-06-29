import React from "react";

import {Route,Routes,Outlet} from "react-router-dom"; 
import './App.css';
import LandingPage from "./pages/LandingPage"
import BrowsePage from "./pages/BrowsePage"
import ProductPage from "./pages/ProductPage"
import UserPage from "./pages/UserPage"
import CartPage from "./pages/CartPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import AuthPage from "./pages/AuthPage";
import Footer from "./components/general/Footer";
import Header from "./components/general/Header";

function App() {

  const alwaysOnLayout = (
    <>
      <Outlet />
      <Footer />
    </>
  )

  const headerLayout = (
    <>
      <Header />
      <Outlet />
    </>
  )

  return (
    <Routes>
      {/* All have Footer */}
      <Route element={alwaysOnLayout}>
        {/* With Header */}
        <Route element={headerLayout}>
          <Route index element={<LandingPage />} />
          <Route path="browse" element={<BrowsePage />} />
          <Route path="browse/product/:productId"
            element={<ProductPage />} />
          <Route path="user" element={<UserPage />} />
          <Route path="user/cart" element={<CartPage />} />
        </Route>
        {/* Without Header */}
        <Route path="auth" element={<AuthPage />}>
          <Route index element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
