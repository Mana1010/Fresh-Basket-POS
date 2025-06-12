import {
  IoAnalytics,
  IoBarChart,
  IoChatbubbles,
  IoClipboard,
  IoCube,
  IoPeopleCircle,
  IoPersonCircle,
  IoPrint,
  IoReceipt,
} from "react-icons/io5";
export const BREADCRUMB_NAVIGATION_LIST = [
  {
    path: "/pos",
    breadcrumb: "Pos",
    icon: IoPrint,
  },
  {
    path: "/products",
    breadcrumb: "Products",
    icon: IoCube,
  },
  {
    path: "/products/add-product",
    breadcrumb: "Add Product",
    icon: "",
  },
  {
    path: "/products/edit-product/:id",
    breadcrumb: "",
    icon: "",
  },
  {
    path: "/inventory",
    breadcrumb: "Inventory",
    icon: IoClipboard,
  },
  {
    path: "/inventory/add-inventory",
    breadcrumb: "Add Inventory",
    icon: "",
  },
  {
    path: "/inventory/edit-inventory/:id",
    breadcrumb: "Edit Inventory",
    icon: "",
  },
  {
    path: "/accounts",
    breadcrumb: "Accounts",
    icon: IoPeopleCircle,
  },
  {
    path: "/accounts/add-account",
    breadcrumb: "Add Account",
    icon: "",
  },
  {
    path: "/receipts",
    breadcrumb: "Receipts",
    icon: IoReceipt,
  },
  {
    path: "/reports",
    breadcrumb: "Reports",
    icon: IoBarChart,
  },
  {
    path: "/cashier-metrics",
    breadcrumb: "Cashier Metrics",
    icon: IoAnalytics,
  },
];
