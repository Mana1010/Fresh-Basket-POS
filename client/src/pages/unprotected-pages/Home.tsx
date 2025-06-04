import { GiBasket, GiSlicedBread } from "react-icons/gi";
import LoginForm from "./components/LoginForm";
import { AnimatePresence, motion } from "framer-motion";
import { getTimeOfDay } from "../../utils/get-time-day";
import { useEffect, useState } from "react";
import { roleVariants } from "../../animation/auth.animation";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { AUTH_URL } from "../../api/request-api";

function Home() {
  const [roleIndex, setRoleIndex] = useState(0);
  const roles = ["Admin", "Manager", "Cashier"];
  const sessionToken = localStorage.getItem("session_token");
  const checkAuth: UseQueryResult<{ message: string }, AxiosError> = useQuery({
    queryKey: ["check-auth-home"],
    queryFn: async () => {
      const response = await axios.get(`${AUTH_URL}/check-auth`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
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

  console.log(sessionToken);
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
            <div className="text-primary">You are already authenticated</div>
          )}
        </div>
        <div className="rounded-md h-full bg-primary hidden md:flex pt-2"></div>
      </div>
    </div>
  );
}

export default Home;
