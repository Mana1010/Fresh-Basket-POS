import printer from "../assets/navigation-sticker/printer.svg";
import profile from "../assets/navigation-sticker/profile.svg";
import reports from "../assets/navigation-sticker/reports.svg";
import dashboard from "../assets/navigation-sticker/dashboard.svg";
// import dashboard from '../assets/navigation-sticker/'
export const navigationList = [
  {
    name: "Dashboard",
    roles: ["manager", "admin"],
    link: "/dashboard",
    path: ["dashboard"],
    icon: dashboard,
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
    name: "Reports",
    roles: ["cashier", "manager", "admin"],
    link: "/reports",
    path: ["reports"],
    icon: reports,
  },
];
