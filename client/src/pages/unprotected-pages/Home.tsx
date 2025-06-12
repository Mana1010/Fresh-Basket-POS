import { GiBasket, GiSlicedBread } from "react-icons/gi";
import LoginForm from "./components/LoginForm";
import { AnimatePresence, motion } from "framer-motion";
import { getTimeOfDay } from "../../utils/get-time-day";
import { useEffect, useState } from "react";
import { roleVariants } from "../../animation/auth.animation";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { AUTH_URL } from "../../api/request-api";
import { useNavigate } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
import useAxiosInterceptor from "../../hooks/useAxiosInterceptor";
import Button from "../../components/Button";
import { useAuthStore } from "../../store/auth.store";
import brandLogo from "../../assets/brand-logo.png";
function Home() {
  const navigate = useNavigate();
  const { logout, isLogoutLoading } = useLogout();
  const axiosInstance = useAxiosInterceptor();
  const [roleIndex, setRoleIndex] = useState(0);
  const { user } = useAuthStore();
  const roles = ["Admin", "Manager", "Cashier"];
  const sessionToken = localStorage.getItem("session_token");
  const checkAuth: UseQueryResult<{ message: string }, AxiosError> = useQuery({
    queryKey: ["check-auth-home"],
    queryFn: async () => {
      const response = await axiosInstance.get(`${AUTH_URL}/check-auth`);
      return response.data;
    },
    enabled: !!sessionToken,
    refetchOnMount: true,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [roles.length]);

  return (
    <div className=" poppins-regular w-full h-screen home-background flex justify-center items-center p-3">
      <div className="w-full lg:w-2/3 bg-white/80 rounded-sm p-2.5 h-full lg:min-h-[300px] md:h-[80%] grid grid-cols-1 md:grid-cols-2 relative gap-0 md:gap-2">
        <div className=" flex h-full w-full p-3 relative flex-col">
          <span className="text-zinc-500/65 text-[4.5rem] absolute bottom-2 left-2">
            <GiSlicedBread />
          </span>
          <span className="text-zinc-500/65 text-[4.5rem] absolute right-2 top-2">
            <GiBasket />
          </span>
          <div className=" flex flex-col w-full poppins-extrabold relative">
            <span className="text-secondary text-2xl">{getTimeOfDay()},</span>{" "}
            <AnimatePresence mode="wait">
              <motion.span
                key={roles[roleIndex]} // important: unique key for re-renders
                variants={roleVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-primary text-xl"
              >
                {roles[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
          {(checkAuth.isError && checkAuth.error.response?.status === 401) ||
          !sessionToken ? (
            <LoginForm />
          ) : (
            <div className="flex-grow flex items-center justify-center flex-col space-y-1.5">
              <h1 className="text-secondary text-lg text-center poppins-extrabold">
                You are aleady authenticated.
              </h1>
              <button
                onClick={() =>
                  navigate(user?.role === "cashier" ? "/pos" : "/reports")
                }
                className="w-1/2 py-2 text-[0.8rem] bg-primary rounded-sm text-white cursor-pointer"
              >
                Continue
              </button>
              {/* <span className="text-center text-secondary/45 py-2">
                ------------ OR -------------
              </span> */}
              <Button
                onClick={() => logout()}
                label="Logout"
                labelWhileLoading="Logging out..."
                isLoading={isLogoutLoading}
                disabled={isLogoutLoading}
                spinnerClassName="border border-white size-4 border-t-transparent"
                className="w-1/2 bg-secondary/70 text-[0.8rem]"
              />
            </div>
          )}
        </div>
        <div className="rounded-md h-full hidden md:flex pt-2 w-full items-center justify-center">
          <img src={brandLogo} width={400} height={400} />
        </div>
      </div>
    </div>
  );
}

export default Home;
