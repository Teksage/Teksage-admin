import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { CssBaseline } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import { router } from "./Routes";
import store from "./redux/store";

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

// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { Provider } from "react-redux";
// import { HelmetProvider } from "react-helmet-async";
// import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
// import { RouterProvider } from "react-router-dom";
// import { router } from "./Routes";
// import store from "./redux/store";
// import { ThemeProviderWrapper, ThemeContext } from "./ThemeContext"; // Adjust path as needed

// const MainApp = () => {
//   const { themeMode } = React.useContext(ThemeContext);

//   // Create a dynamic MUI theme based on themeMode
//   const theme = createTheme({
//     palette: {
//       mode: themeMode,
//       primary: {
//         main: "#10b100", // Matches your app's green color
//       },
//       background: {
//         default: themeMode === "light" ? "#bfd9ff" : "#1e1e1e", // Matches App.tsx background for light mode
//         paper: themeMode === "light" ? "#ffffff" : "#2e2e2e",
//       },
//       text: {
//         primary: themeMode === "light" ? "rgba(0, 0, 0, 0.87)" : "#ffffff",
//         secondary: themeMode === "light" ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.7)",
//       },
//     },
//     components: {
//       MuiAppBar: {
//         styleOverrides: {
//           root: {
//             background:
//               themeMode === "light"
//                 ? "linear-gradient(90deg, rgba(16, 177, 0, 0.4) -42.06%, rgba(255, 255, 255, 0.7) 100%)"
//                 : "linear-gradient(90deg, rgba(16, 177, 0, 0.4) -42.06%, rgba(30, 30, 30, 0.7) 100%)",
//           },
//         },
//       },
//     },
//   });

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <RouterProvider router={router} />
//     </ThemeProvider>
//   );
// };

// const root = createRoot(document.getElementById("root")!);
// root.render(
//   <StrictMode>
//     <Provider store={store}>
//       <HelmetProvider>
//         <ThemeProviderWrapper>
//           <MainApp />
//         </ThemeProviderWrapper>
//       </HelmetProvider>
//     </Provider>
//   </StrictMode>
// );