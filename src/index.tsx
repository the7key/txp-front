import { StrictMode } from "react";
import { render } from "react-dom";
import { HashRouter } from "react-router-dom";
import App from "./App";

import "./index.css";
import "fomantic-ui-css/semantic.min.css";

render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
  document.getElementById("root")
);
