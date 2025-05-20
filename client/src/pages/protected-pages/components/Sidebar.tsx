import { motion } from "framer-motion";
import { navigationList } from "../../../constant/navigation-list";
import { getTimeOfDay } from "../../../utils/get-time-day";
function Sidebar() {
  return (
    <motion.header className="shrink-0 flex flex-col justify-between items-center h-full py-3 px-2.5 w-[230px] bg-secondary shadow-md border-r border-r-white/35">
      <div className=" w-full flex-col flex">
        <div className="flex py-2 poppins-semibold text-md text-white flex-col">
          <h1>{getTimeOfDay()},</h1>{" "}
          <span className="text-orange-300">Cashier</span>
        </div>
        <div className="flex flex-col space-y-2 pt-5">
          <small className="text-[#F5F4F3] text-[0.6rem] poppins-extrabold">
            <span className="text-primary">MAIN </span> MENU
          </small>
          <ul className=" flex flex-col w-full">
            {navigationList.map((navigation) => {
              const Icon = navigation.icon;

              return (
                <a
                  key={navigation.name}
                  href={navigation.link}
                  className={`${
                    navigation.roles.includes("cashier") ? "inline" : "hidden"
                  } p-1.5 hover:bg-zinc-200/25 group hover:border-r-2 hover:border-r-primary`}
                >
                  <li className="text-center flex space-x-2 items-center text-[#F5F4F3] poppins-medium">
                    <span className="text-gray-200 poppins-semibold group-hover:text-orange-300">
                      <Icon />
                    </span>
                    <span className="text-[0.8rem]">{navigation.name}</span>
                  </li>
                </a>
              );
            })}
          </ul>
        </div>
      </div>
    </motion.header>
  );
}

export default Sidebar;
