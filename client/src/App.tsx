import { createBrowserRouter, RouterProvider } from "react-router-dom";
import About from "./pages/About";
import Login from "./pages/Login";
import "./App.css";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Checkout from "./pages/protected-pages/cashier/Checkout";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/about",
      element: <About />,
    },
    {
      path: "/",
      element: <ProtectedLayout />,
      children: [
        { path: "dashboard", element: <Checkout /> },
        { path: "pos", element: <Checkout /> },
        { path: "transaction", element: <Checkout /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
