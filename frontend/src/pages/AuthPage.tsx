import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import '../scss/pages/AuthPage.scss';
import fetchAuthVerify from '../api/verifyToken.ts';

const AuthPage: React.FC = function _() {
  useEffect(() => {
    fetchAuthVerify().then((success) => {
      if (success) {
        window.location.href = '/user';
      }
    });
  }, []);

  return (
    <div id="main">
      <div id="auth-container">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthPage;
