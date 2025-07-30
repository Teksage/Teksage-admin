import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { tokenService } from './utils/tokenService';

interface SessionManagerProps {
  children: React.ReactNode;
}

export const SessionManager: React.FC<SessionManagerProps> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = () => {
      const hasValidSession = tokenService.hasValidSession();
      const isLoginPage = location.pathname === '/auth/login';

      if (hasValidSession && isLoginPage) {
        // User has valid session but is on login page, redirect to dashboard
        navigate('/dashboard/users', { replace: true });
      } else if (!hasValidSession && !isLoginPage) {
        // User doesn't have valid session and is not on login page, redirect to login
        tokenService.clearTokens();
        navigate('/auth/login', { replace: true });
      } else if (hasValidSession) {
        // Set auth state if user has valid session
        dispatch({ type: 'setAuth', payload: true });
      }
    };

    checkSession();

    // Check session every 5 minutes
    const sessionCheckInterval = setInterval(checkSession, 5 * 60 * 1000);

    return () => {
      clearInterval(sessionCheckInterval);
    };
  }, [dispatch, navigate, location.pathname]);

  return React.createElement(React.Fragment, null, children);
};