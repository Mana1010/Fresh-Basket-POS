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
import EditProduct from "./pages/protected-pages/shared/EditProduct";
import Inventory from "./pages/protected-pages/shared/Inventory";
import AddInventory from "./pages/protected-pages/shared/AddInventory";
import InventoryPageLayout from "./layouts/InventoryPageLayout";
import Accounts from "./pages/protected-pages/shared/Accounts";
import AccountPageLayout from "./layouts/AccountPageLayout";
import AddAccount from "./pages/protected-pages/shared/components/AddAccount";
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
        {
          path: "inventory",
          element: <InventoryPageLayout />,
          children: [
            {
              index: true,
              element: <Inventory />,
            },
            {
              path: "add-inventory",
              element: <AddInventory />,
            },
          ],
        },
        {
          path: "accounts",
          element: <AccountPageLayout />,
          children: [
            { index: true, element: <Accounts /> },
            {
              path: "add-account",
              element: <AddAccount />,
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
