import { motion } from "framer-motion";
import { navigationList } from "../../../constant/navigation-list";
import logout from "../../../assets/navigation-sticker/logout.svg";
function Sidebar() {
  return (
    <motion.header className="shrink-0 flex flex-col justify-between items-center h-full py-3 px-2.5 w-[80px] bg-white shadow-sm border border-zinc-400/35 rounded-md relative">
      <div className=" w-full flex-col flex">
        <div className="flex flex-col space-y-2 pt-5">
          <small className="text-primary text-[0.6rem] text-center poppins-extrabold">
            MENUS
          </small>
          <ul className=" flex flex-col w-full">
            {navigationList.map((navigation) => {
              return (
                <a
                  key={navigation.name}
                  href={navigation.link}
                  className={`${
                    navigation.roles.includes("cashier") ? "block" : "hidden"
                  } p-1.5 hover:bg-primary/10 rounded-md group border-b-2 border-b-transparent hover:border-b-primary`}
                >
                  <li className="text-center flex space-y-1.5 items-center text-[#F5F4F3] poppins-medium flex-col">
                    <img
                      src={navigation.icon}
                      width={20}
                      height={20}
                      alt="icon"
                    />
                    <span className="text-[0.65rem] text-secondary poppins-semibold">
                      {navigation.name}
                    </span>
                  </li>
                </a>
              );
            })}
          </ul>
        </div>
      </div>{" "}
      <button className="p-2 bg-secondary text-sm rounded-sm">
        <img src={logout} width={20} height={20} alt="logout" />
      </button>
    </motion.header>
  );
}

export default Sidebar;
