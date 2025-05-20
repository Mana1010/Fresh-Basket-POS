import { LuComputer, LuLayoutDashboard, LuUser } from "react-icons/lu";

import { HiPrinter, HiUser } from "react-icons/hi2";
import { MdDashboard } from "react-icons/md";
import { SlGraph } from "react-icons/sl";
export const navigationList = [
  {
    name: "Dashboard",
    roles: ["manager", "admin"],
    link: "/dashboard",
    path: ["dashboard"],
    icon: MdDashboard,
  },
  {
    name: "Pos",
    roles: ["cashier"],
    link: "/pos",
    path: ["pos"],
    icon: HiPrinter,
  },
  {
    name: "Profile",
    roles: ["cashier", "manager", "admin"],
    link: "/profile",
    path: ["profile"],
    icon: HiUser,
  },

  {
    name: "Reports",
    roles: ["cashier", "manager", "admin"],
    link: "/reports",
    path: ["reports"],
    icon: SlGraph,
  },
];
