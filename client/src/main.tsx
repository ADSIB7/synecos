import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const analyticsEndpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT?.trim();
const analyticsWebsiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID?.trim();

if (analyticsEndpoint && analyticsWebsiteId) {
  try {
    const endpoint = new URL(analyticsEndpoint);
    const isLocalDevelopment =
      import.meta.env.DEV &&
      (endpoint.hostname === "localhost" || endpoint.hostname === "127.0.0.1");

    if (endpoint.protocol === "https:" || isLocalDevelopment) {
      const analyticsScript = document.createElement("script");
      analyticsScript.defer = true;
      analyticsScript.src = new URL(
        "umami",
        `${endpoint.href.replace(/\/$/, "")}/`
      ).href;
      analyticsScript.dataset.websiteId = analyticsWebsiteId;
      document.head.append(analyticsScript);
    }
  } catch {
    // Ignore invalid optional analytics configuration so it cannot block app startup.
  }
}

createRoot(document.getElementById("root")!).render(<App />);
