import printer from "../assets/navigation-sticker/printer.svg";
import profile from "../assets/navigation-sticker/profile.svg";
import reports from "../assets/navigation-sticker/reports.svg";
// import dashboard from '../assets/navigation-sticker/'
import inventory from "../assets/navigation-sticker/inventory.svg";
import products from "../assets/navigation-sticker/product.svg";
import chats from "../assets/navigation-sticker/chats.svg";
export const navigationList = [
  {
    name: "Reports",
    roles: ["cashier", "manager", "admin"],
    link: "/reports",
    path: ["reports"],
    icon: reports,
  },
  {
    name: "Pos",
    roles: ["cashier"],
    link: "/pos",
    path: ["pos"],
    icon: printer,
  },
  {
    name: "Profile",
    roles: ["cashier", "manager", "admin"],
    link: "/profile",
    path: ["profile"],
    icon: profile,
  },
  {
    name: "Products",
    roles: ["manager", "admin"],
    link: "/products",
    path: ["product"],
    icon: products,
  },
  {
    name: "Inventory",
    roles: ["manager", "admin"],
    link: "/inventory",
    path: ["inventory"],
    icon: inventory,
  },
  {
    name: "Accounts",
    roles: ["manager", "admin"],
    link: "/accounts",
    path: ["profile"],
    icon: profile,
  },
  {
    name: "My Performance",
    roles: ["cashier"],
    link: "/reports",
    path: ["reports"],
    icon: reports,
  },
  {
    name: "Chats",
    roles: ["cashier", "manager", "admin"],
    link: "/chats",
    path: "chats",
    icon: chats,
  },
];
