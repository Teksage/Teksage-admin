import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const OfflineNotification: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#ff4d4f',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '999px',
            boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
            zIndex: 9999,
            fontSize: '14px',
            fontWeight: 600,
            maxWidth: '90%',
            textAlign: 'center',
            wordBreak: 'break-word',
          }}
        >
          🌐 You seem offline. We’ll keep everything ready until you’re back.
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineNotification;
