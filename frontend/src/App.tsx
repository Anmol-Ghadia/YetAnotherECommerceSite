import { Route, Routes, Outlet } from 'react-router-dom';
import LandingPage from './components/pages/LandingPage';
import BrowsePage from './components/pages/BrowsePage';
import ProductPage from './components/pages/ProductPage';
import UserPage from './components/pages/UserPage';
import CartPage from './components/pages/CartPage';
import AuthPage from './components/pages/AuthPage/AuthPage.tsx';
import Footer from './components/general/Footer';
import Header from './components/general/Header';
import LoginPanelNew from './components/pages/AuthPage/LoginPanel';
import RegisterPanel from './components/pages/AuthPage/RegisterPanel';

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
          <Route index element={<LoginPanelNew />} />
          <Route path="register" element={<RegisterPanel />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
