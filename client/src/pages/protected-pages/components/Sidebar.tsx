import { motion } from "framer-motion";
import { navigationList } from "../../../constant/navigation-list";
import logoutSticker from "../../../assets/navigation-sticker/logout.svg";
import { useMutation } from "@tanstack/react-query";
import useAxiosInterceptor from "../../../hooks/useAxiosInterceptor";
import { AUTH_URL } from "../../../api/request-api";
import { toast } from "sonner";
import { useAuthStore } from "../../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import type { UserRole } from "../../../types/user.types";
import brandLogo from "../../../assets/brand-logo.png";
function Sidebar() {
  const navigate = useNavigate();
  const axiosInterceptor = useAxiosInterceptor();
  const role = useAuthStore((user) => user.user?.role);
  const { setUser } = useAuthStore();
  const logout = useMutation({
    mutationFn: async () => {
      const response = await axiosInterceptor.post(`${AUTH_URL}/logout`);
      return response.data;
    },
    onSuccess: ({ message }) => {
      toast.success(message);
      localStorage.removeItem("session_token");
      setUser(null);
      navigate("/");
    },
    onError: ({ message }) => {
      console.log(message);
      toast.success("Something went wrong, please try again");
    },
  });
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
                <a
                  key={navigation.name}
                  href={navigation.link}
                  className={`${
                    navigation.roles.includes(role as UserRole)
                      ? "block"
                      : "hidden"
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
      <button
        onClick={() => logout.mutate()}
        className="p-2 bg-secondary text-sm rounded-sm cursor-pointer"
      >
        <img src={logoutSticker} width={20} height={20} alt="logout" />
      </button>
    </motion.header>
  );
}

export default Sidebar;
