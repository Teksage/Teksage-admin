import React from "react";
import { Outlet } from "react-router-dom";

const App: React.FC = () => {
  return (
    <div style={{backgroundColor: '#bfd9ff'}}>
      <Outlet />
    </div>
  );
};

export default App;