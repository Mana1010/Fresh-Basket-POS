import { motion } from "framer-motion";
import { navigationList } from "../../../constant/navigation-list";
import logoutSticker from "../../../assets/navigation-sticker/logout.svg";
import { useAuthStore } from "../../../store/auth.store";
import { useNavigate } from "react-router-dom";
import type { UserRole } from "../../../types/user.types";
import brandLogo from "../../../assets/brand-logo.png";
import useLogout from "../../../hooks/useLogout";
function Sidebar() {
  const { logout } = useLogout();
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
                  } p-1.5 hover:bg-primary/10 rounded-md group border-b-2 border-b-transparent hover:border-b-primary cursor-pointer`}
                >
                  <li className="text-center flex space-y-1.5 items-center text-[#F5F4F3] poppins-medium flex-col">
                    <span className="text-secondary text-xl">
                      <navigation.icon />
                    </span>
                    <span className="text-[0.65rem] text-secondary poppins-semibold">
                      {navigation.name}
                    </span>
                  </li>
                </button>
              );
            })}
          </ul>
        </div>
      </div>{" "}
      <button
        onClick={() => logout()}
        className="p-2 bg-secondary text-sm rounded-sm cursor-pointer"
      >
        <img src={logoutSticker} width={20} height={20} alt="logout" />
      </button>
    </motion.header>
  );
}

export default Sidebar;
