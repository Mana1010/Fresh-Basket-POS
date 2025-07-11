import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import About from "./pages/About";
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
import AddAccount from "./pages/protected-pages/shared/components/AddAccount";
import EditAccount from "./pages/protected-pages/shared/EditAccount";
import Home from "./pages/unprotected-pages/Home";
import Profile from "./pages/protected-pages/shared/Profile";
import EditInventory from "./pages/protected-pages/shared/EditInventory";
import RoleAccessCheckPoint from "./pages/protected-pages/components/RoleAccessCheckPoint";
import AccountPageLayout from "./layouts/AccountPageLayout";
import ReceiptHistory from "./pages/protected-pages/shared/ReceiptHistory";
import CashierMetrics from "./pages/protected-pages/shared/CashierMetrics";
import NotFound from "./pages/NotFound";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
    {
      path: "/",
      element: <ProtectedLayout />,
      children: [
        { path: "reports", element: <Reports /> },
        {
          path: "pos",
          element: (
            <RoleAccessCheckPoint
              allowedRoles={["cashier"]}
              navigateTo="/reports"
            >
              <Pos />
            </RoleAccessCheckPoint>
          ),
        },
        { path: "profile", element: <Profile /> },
        {
          path: "products",
          element: (
            <RoleAccessCheckPoint
              allowedRoles={["admin", "manager"]}
              navigateTo="/pos"
            >
              <ProductPageLayout />
            </RoleAccessCheckPoint>
          ),
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
          element: (
            <RoleAccessCheckPoint
              allowedRoles={["admin", "manager"]}
              navigateTo="/pos"
            >
              <InventoryPageLayout />
            </RoleAccessCheckPoint>
          ),
          children: [
            {
              index: true,
              element: <Inventory />,
            },
            {
              path: "add-inventory",
              element: <AddInventory />,
            },
            {
              path: "edit-inventory/:id",
              element: <EditInventory />,
            },
          ],
        },
        {
          path: "accounts",
          element: (
            <RoleAccessCheckPoint allowedRoles={["admin"]} navigateTo="/">
              <AccountPageLayout />
            </RoleAccessCheckPoint>
          ),
          children: [
            { index: true, element: <Accounts /> },
            {
              path: "add-account",
              element: <AddAccount />,
            },
            {
              path: "edit-account/:id",
              element: <EditAccount />,
            },
          ],
        },
        {
          path: "receipts",
          element: (
            <RoleAccessCheckPoint
              allowedRoles={["admin", "manager"]}
              navigateTo="/pos"
            >
              <>
                <Outlet />
              </>
            </RoleAccessCheckPoint>
          ),
          children: [{ index: true, element: <ReceiptHistory /> }],
        },
        {
          path: "reports",
          element: (
            <RoleAccessCheckPoint
              allowedRoles={["admin", "manager"]}
              navigateTo="/pos"
            >
              <>
                <Outlet />
              </>
            </RoleAccessCheckPoint>
          ),
          children: [{ index: true, element: <Reports /> }],
        },
        {
          path: "cashier-metrics",
          element: (
            <RoleAccessCheckPoint
              allowedRoles={["admin", "manager"]}
              navigateTo="/pos"
            >
              <>
                <Outlet />
              </>
            </RoleAccessCheckPoint>
          ),
          children: [{ index: true, element: <CashierMetrics /> }],
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
