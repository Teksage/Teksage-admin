// import React, {useEffect, useRef} from "react";
// import { Outlet } from "react-router-dom";
// import OfflineNotification from "./components/Elements/OfflineNotification";
// import { useDispatch } from "react-redux";
// import { fetchCountriesList, AppDispatch } from "./components/Elements/CommonFunctions";

// const App: React.FC = React.memo(() => {
//   const dispatch = useDispatch<AppDispatch>();
//   const hasFetched = useRef(false);

//   useEffect(() => {
//     dispatch(fetchCountriesList());
//     hasFetched.current = true;
//   }, [dispatch]);

//   return (
//     <div style={{ minHeight: "100vh", position: "relative" }}>
//       <Outlet />
//       <OfflineNotification />
//     </div>
//   );
// });

// export default App;

import React, { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import OfflineNotification from "./components/Elements/OfflineNotification";
import { useDispatch } from "react-redux";
import { fetchCountriesList, AppDispatch } from "./components/Elements/CommonFunctions";

const App: React.FC = React.memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const hasFetchedCountries = useRef(false);
  useEffect(() => {
    if (!hasFetchedCountries.current) {
      dispatch(fetchCountriesList());
      hasFetchedCountries.current = true;
    }
  }, [dispatch]);

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <Outlet />
      <OfflineNotification />
    </div>
  );
})

export default App;