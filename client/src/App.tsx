import { createBrowserRouter, RouterProvider } from "react-router-dom";
import About from "./pages/About";
import Login from "./pages/Login";
import "./App.css";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Pos from "./pages/protected-pages/cashier/Pos";
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
        { path: "dashboard", element: <Pos /> },
        { path: "pos", element: <Pos /> },
        { path: "transaction", element: <Pos /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
