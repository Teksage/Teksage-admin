// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { Provider } from "react-redux";
// import { HelmetProvider } from "react-helmet-async";
// import { CssBaseline } from "@mui/material";
// import { RouterProvider } from "react-router-dom";
// import { router } from "./Routes";
// import store from "./redux/store";

// const root = createRoot(document.getElementById("root")!);
// root.render(
//   <StrictMode>
//     <Provider store={store}>
//       <HelmetProvider>
//         <CssBaseline />
//         <RouterProvider router={router} />
//       </HelmetProvider>
//     </Provider>
//   </StrictMode>
// );

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { CssBaseline } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import { router } from "./Routes";
import store from "./redux/store";
import './styles/fonts.css';

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <CssBaseline />
        <RouterProvider router={router} />
      </HelmetProvider>
    </Provider>
  </StrictMode>
);