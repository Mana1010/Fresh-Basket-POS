import { createBrowserRouter, RouterProvider } from "react-router-dom";
import About from "./pages/About";
import Login from "./pages/Login";
import "./App.css";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Pos from "./pages/protected-pages/cashier/Pos";
import Reports from "./pages/protected-pages/shared/Reports";
import Products from "./pages/protected-pages/shared/Products";
import ProductPageLayout from "./layouts/ProductPageLayout";
import AddProduct from "./pages/protected-pages/shared/AddProduct";
import EditProduct from "./pages/protected-pages/shared/components/EditProduct";
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
        { path: "reports", element: <Reports /> },
        { path: "pos", element: <Pos /> },
        {
          path: "products",
          element: <ProductPageLayout />,
          children: [
            {
              index: true,
              element: <Products />,
            },
            {
              path: "add-product",
              element: <AddProduct />,
            },
            {
              path: "edit-product/:id",
              element: <EditProduct />,
            },
          ],
        },
        { path: "pos", element: <Pos /> },
        { path: "transaction", element: <Pos /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
