import React, {useEffect} from "react";
import { Outlet } from "react-router-dom";
import OfflineNotification from "./components/Elements/OfflineNotification";
import { useDispatch } from "react-redux";
import { fetchCountriesList, AppDispatch } from "./components/Auth/Login";

const App: React.FC = React.memo(() => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCountriesList());
  }, [dispatch]);
  
  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <Outlet />
      <OfflineNotification />
    </div>
  );
});

export default App;
