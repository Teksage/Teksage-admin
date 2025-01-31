import React from "react";
import AppRoutes from "./AppRoutes";
// import Notification from "./components/common/Notification";

const App: React.FC = () => {
  return (
    <div style={{backgroundColor: '#bfd9ff'}}>
      {/* <Notification /> */}
      <AppRoutes />
    </div>
  );
};

export default App;