import React from "react";
import ReactDOM from "react-dom/client";
import {initI18n} from "./utils/i18n.js";
import routes from "./routes.jsx";
import {RouterProvider} from "react-router-dom";
import "@fontsource/public-sans";
import CssBaseline from "@mui/joy/CssBaseline";
import {CssVarsProvider} from "@mui/joy/styles";
import theme from "./theme.js";

initI18n();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={routes} />
    </CssVarsProvider>
  </React.StrictMode>
);
