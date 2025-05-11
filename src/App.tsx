// import React from "react";
// import { Outlet } from "react-router-dom";
// import OfflineNotification from "./components/Elements/OfflineNotification";

// const App: React.FC = () => {
//   return (
//     <div style={{ backgroundColor: '#bfd9ff', minHeight: '100vh', position: 'relative' }}>
//       <Outlet />
//       <OfflineNotification /> {/* Automatically handled */}
//     </div>
//   );
// };

// export default App;

import React from "react";
import { Outlet } from "react-router-dom";
import OfflineNotification from "./components/Elements/OfflineNotification";

const App: React.FC = React.memo(() => {
  return (
    <div style={{ backgroundColor: '#bfd9ff', minHeight: '100vh', position: 'relative' }}>
      <Outlet />
      <OfflineNotification />
    </div>
  );
});

export default App;