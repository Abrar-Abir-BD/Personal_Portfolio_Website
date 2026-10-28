import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// Optional "glow" design; only active with data-design="glow" on <html>
import "./styles/glow.css";
// Optional sky-blue palette on top of it; only active with data-palette="sky"
import "./styles/sky.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
