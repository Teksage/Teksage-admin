import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { CssBaseline, ThemeProvider } from "@mui/material";

import App from "./App";
import store from "./redux/store";
// import theme from "./theme";

// Mount the React App
const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <BrowserRouter>
          {/* <ThemeProvider theme={theme}> */}
            <CssBaseline />
            <App />
          {/* </ThemeProvider> */}
        </BrowserRouter>
      </HelmetProvider>
    </Provider>
  </StrictMode>
);
