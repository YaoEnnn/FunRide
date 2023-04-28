import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GlobalStyle from "./Components";
import { BrowserRouter as Router } from "react-router-dom";
import AuthContext, { AuthProvider } from "./context/AuthProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GlobalStyle>
    <Router>
      <App />
    </Router>
  </GlobalStyle>
);
