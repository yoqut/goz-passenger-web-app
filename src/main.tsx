import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/app";
import "./index.css";
import { init } from "@telegram-apps/sdk-react";

init();

createRoot(document.querySelector("#root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
