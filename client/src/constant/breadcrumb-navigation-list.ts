import printer from "../assets/navigation-sticker/printer.svg";
import profile from "../assets/navigation-sticker/profile.svg";
import reports from "../assets/navigation-sticker/reports.svg";
// import dashboard from '../assets/navigation-sticker/'
import inventory from "../assets/navigation-sticker/inventory.svg";
import products from "../assets/navigation-sticker/product.svg";
import chats from "../assets/navigation-sticker/chats.svg";
export const BREADCRUMB_NAVIGATION_LIST = [
  {
    path: "/pos",
    breadcrumb: "Pos",
    icon: printer,
  },
  {
    path: "/products",
    breadcrumb: "Products",
    icon: products,
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
    icon: inventory,
  },
  {
    path: "inventory/add-inventory",
    breadcrumb: "Add Inventory",
    icon: "",
  },
];
