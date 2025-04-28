import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import OfflineNotification from "./components/Elements/OfflineNotification";

const App: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      // Dispatch action to restore auth state or set context
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div style={{ backgroundColor: '#bfd9ff', minHeight: '100vh', position: 'relative' }}>
      <Outlet />
      <OfflineNotification /> {/* Automatically handled */}
    </div>
  );
};

export default App;
