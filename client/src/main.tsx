import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import QueryProvider from "./provider/QueryProvider.tsx";
import { Toaster } from "sonner";
import { HelmetProvider } from "react-helmet-async";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <QueryProvider>
        <Toaster
          toastOptions={{
            duration: 1500,
            style: { color: "#434343" },
          }}
        />
        <App />
      </QueryProvider>
    </HelmetProvider>
  </StrictMode>
);
