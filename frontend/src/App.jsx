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

const UserContext = React.createContext();
function App() {

  const [state, setState] = React.useState({
    username: null,
    currentPageState: 0
  })

  const user = [state,setState];
  const generalLayout = (
    <>
    {/* Add Header Here */}
      <Outlet />
      <Footer />
    </>
  )
  const authLayout = (
    <>
      <Outlet />
      <Footer />
    </>
  )

  return (
    <UserContext.Provider value={user}>
      <Routes>
        <Route element={generalLayout}>
          <Route index element={<LandingPage />} />
          <Route path="browse" element={<BrowsePage />} />
          <Route path="browse/product/:id"
            
            element={<ProductPage />} />
          <Route path="user" element={<UserPage />} />
          <Route path="user/cart" element={<CartPage />} />
        </Route>
        <Route element={authLayout}>
          <Route path="auth" element={<AuthPage />}>
            <Route index element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
        </Route>
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
export {UserContext};
