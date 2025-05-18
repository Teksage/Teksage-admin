import React from "react";
import { Outlet } from "react-router-dom";
import OfflineNotification from "./components/Elements/OfflineNotification";

const App: React.FC = React.memo(() => {
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Outlet />
      <OfflineNotification />
    </div>
  );
});

export default App;