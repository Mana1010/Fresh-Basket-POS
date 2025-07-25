import { motion } from "framer-motion";
import { navigationList } from "../../../constant/navigation-list";
import { useAuthStore } from "../../../store/auth.store";
import { useNavigate } from "react-router-dom";
import type { UserRole } from "../../../types/user.types";
import brandLogo from "../../../assets/brand-logo.png";
import useLogout from "../../../hooks/useLogout";
import { IoLogOut } from "react-icons/io5";
import SidebarLoading from "./loading/SidebarLoading";
function Sidebar() {
  const { logout, isLogoutLoading } = useLogout();
  const navigate = useNavigate();
  const role = useAuthStore((user) => user.user?.role);

  return (
    <motion.header className="shrink-0 flex flex-col justify-between items-center h-full py-2 px-2.5 w-[85px] bg-white shadow-sm border border-zinc-400/35 rounded-md relative">
      <div className=" w-full flex-col flex items-center">
        <img src={brandLogo} alt="company-logo" width={65} height={65} />
        <div className="flex flex-col space-y-2 pt-3">
          <small className="text-primary text-[0.6rem] text-center poppins-extrabold">
            MENUS
          </small>
          {role ? (
            <ul className=" flex flex-col w-full">
              {navigationList.map((navigation) => {
                return (
                  <button
                    key={navigation.name}
                    onClick={() => navigate(navigation.link)}
                    className={`${
                      navigation.roles.includes(role as UserRole)
                        ? "block"
                        : "hidden"
                    } p-1.5 rounded-md group border-b-2 border-b-transparent group cursor-pointer transition-colors duration-100 ease-in`}
                  >
                    <li
                      className={`text-center ${
                        location.pathname.startsWith(navigation.link)
                          ? "text-primary"
                          : "text-secondary"
                      } flex space-y-1 items-center group-hover:text-primary poppins-medium flex-col`}
                    >
                      <span className=" text-lg">
                        <navigation.icon />
                      </span>
                      <span className="text-[0.6rem] poppins-semibold">
                        {navigation.name}
                      </span>
                    </li>
                  </button>
                );
              })}
            </ul>
          ) : (
            <SidebarLoading />
          )}
        </div>
      </div>{" "}
      <button
        disabled={isLogoutLoading}
        onClick={() => logout()}
        className="text-2xl cursor-pointer text-secondary"
      >
        <IoLogOut />
      </button>
    </motion.header>
  );
}

export default Sidebar;
