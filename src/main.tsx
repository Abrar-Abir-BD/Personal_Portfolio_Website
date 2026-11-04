import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// Optional "glow" design; only active with data-design="glow" on <html>
import "./styles/glow.css";

// A tab left open across a deploy can ask for page code that no longer exists,
// which would blank the site. Reload once to pick up the new build
window.addEventListener("vite:preloadError", (event) => {
  try {
    if (sessionStorage.getItem("reloaded-for-update")) return;
    sessionStorage.setItem("reloaded-for-update", "1");
  } catch {
    return; // Storage blocked: can't guard against a reload loop
  }
  event.preventDefault();
  window.location.reload();
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
