import React from "react";
import ReactDOM from "react-dom/client";
import {initI18n} from "./app/i18n.js";
import Router from "./routes.jsx";
import "@fontsource/public-sans";
import CssBaseline from "@mui/joy/CssBaseline";
import {CssVarsProvider} from "@mui/joy/styles";
import theme from "./theme.js";
import {Provider} from "react-redux";
import {store} from "./app/store.js";
import {SnackbarProvider} from "./components/snackbar.jsx";

initI18n();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <SnackbarProvider>
          <Router />
        </SnackbarProvider>
      </Provider>
    </CssVarsProvider>
  </React.StrictMode>
);
