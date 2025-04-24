import React, {useEffect} from "react";
import { Outlet } from "react-router-dom";

const App: React.FC = () => {
  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      // Dispatch action to restore auth state or set context
    }
  }, []);
  return (
    <div style={{backgroundColor: '#bfd9ff'}}>
      <Outlet />
    </div>
  );
};

export default App;