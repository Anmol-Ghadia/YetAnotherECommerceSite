import { Route, Routes, Outlet } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import BrowsePage from './pages/BrowsePage';
import ProductPage from './pages/ProductPage';
import UserPage from './pages/UserPage';
import CartPage from './pages/CartPage';
import AuthPage from './pages/AuthPage';
import Footer from './components/general/Footer';
import Header from './components/general/Header';
import LoginPanel from './components/specific/LoginPanel';
import RegisterPanel from './components/specific/RegisterPanel';
import LoginPanelNew from './components/specific/LoginPanelNew';

function App() {
  const alwaysOnLayout = (
    <>
      <Outlet />
      <Footer />
    </>
  );

  const headerLayout = (
    <>
      <Header />
      <Outlet />
    </>
  );

  return (
    <Routes>
      {/* all have Footer */}
      <Route element={alwaysOnLayout}>
        {/* with Header */}
        <Route element={headerLayout}>
          <Route path="browse" element={<BrowsePage />} />
          <Route path="browse/product/:productId" element={<ProductPage />} />
          <Route path="user" element={<UserPage />} />
          <Route path="user/cart" element={<CartPage />} />
        </Route>
        {/* without Header */}
        <Route index element={<LandingPage />} />
        <Route path="auth" element={<AuthPage />}>
          <Route index element={<LoginPanel />} />
          <Route path="register" element={<RegisterPanel />} />
          <Route path="login-new" element={<LoginPanelNew />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
