import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import About from "./pages/About.tsx";
import QueryProvider from "./provider/QueryProvider.tsx";
import { Toaster } from "sonner";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/about",
    element: <About />,
  },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <Toaster duration={1500} />
      <RouterProvider router={router} />
    </QueryProvider>
  </StrictMode>
);
