import { useEffect, useRef, useState } from "react";
import "./App.css";
import { getTimeOfDay } from "./utils/get-time-day";
import { GiSlicedBread, GiBasket } from "react-icons/gi";
import { AnimatePresence, motion } from "framer-motion";
import { roleVariants } from "./animation/auth.animation";
import { useForm } from "react-hook-form";
import InputBox from "./components/InputBox";
import { useMutation } from "@tanstack/react-query";

import { AUTH_URL } from "./environment";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

type LoginMutationType = {
  type: "credential-based" | "passcode-based";
  data: { passcode: string } | { username: string; password: string };
};
function App() {
  const roles = ["Admin", "Manager", "Cashier"];
  const [index, setIndex] = useState(0);
  const [passcode, setPasscode] = useState(["", "", "", "", "", ""]);
  const [passcodeIndex, setPasscodeIndex] = useState(0);
  const passcodeRef = useRef<Array<HTMLInputElement | null>>([]);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async ({ type, data }: LoginMutationType) => {
      const response = await axios.post(`${AUTH_URL}/login?type=${type}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success("Successfully login");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      console.log(err);
      toast.error(err.response?.data.message);
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length);
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [roles.length]);

  useEffect(() => {
    passcodeRef.current[passcodeIndex]?.focus();
    const allPasscodeAreFilledUp = passcode.every(
      (passcode) => passcode !== ""
    );
    if (allPasscodeAreFilledUp) {
      loginMutation.mutate({
        type: "passcode-based",
        data: { passcode: passcode.join("") },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passcode, passcodeIndex]);

  // function handleTriggerEmptyPasscode() {
  //   const findEmptyPasscodeElseOne = passcode.find((code, index) => {
  //     return code === "" ? index : passcode.length - 1;
  //   });
  //   alert(findEmptyPasscodeElseOne);
  //   return findEmptyPasscodeElseOne;
  // }

  return (
    <div className=" poppins-regular w-full h-screen home-background flex justify-center items-center p-3">
      <div className="w-full lg:w-2/3 bg-white/80 rounded-sm p-2.5 h-full lg:min-h-[300px] md:h-[80%] grid grid-cols-1 md:grid-cols-2 relative gap-0 md:gap-2">
        {/* Login Form */}

        <div className=" flex h-full w-full p-3 relative">
          <span className="text-zinc-500/65 text-[4.5rem] absolute bottom-2 left-2">
            <GiSlicedBread />
          </span>
          <span className="text-zinc-500/65 text-[4.5rem] absolute right-2 top-2">
            <GiBasket />
          </span>
          <div className="flex flex-col w-full">
            <div className=" flex flex-col w-full poppins-extrabold relative">
              <span className="text-secondary text-2xl">{getTimeOfDay()},</span>{" "}
              <AnimatePresence mode="wait">
                <motion.span
                  key={roles[index]} // important: unique key for re-renders
                  variants={roleVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-primary text-xl"
                >
                  {roles[index]}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="w-full flex flex-col gap-2 flex-grow pt-5 justify-center">
              <h5 className="text-primary text-xl poppins-extrabold">
                Welcome <span className="text-secondary">Back!</span>
              </h5>
              <form
                id="credential-based-form"
                className="w-full flex flex-col gap-2"
              >
                <InputBox
                  tabIndex={1}
                  register={register}
                  id="username"
                  type="text"
                  disabled={loginMutation.isPending}
                  required={true}
                  placeholder="Enter your username"
                  name="username"
                  label="Username"
                />
                <InputBox
                  tabIndex={2}
                  register={register}
                  id="password"
                  type="password"
                  disabled={loginMutation.isPending}
                  required={true}
                  placeholder="••••••••••"
                  name="password"
                  label="Password"
                />

                <button className="w-1/2 rounded-sm bg-primary text-white py-2 text-[0.85rem] poppins-bold mx-auto">
                  Continue
                </button>
              </form>
              <span className="text-center text-secondary/35 py-3">
                ------------ OR -------------
              </span>
              <form id="passcode-based-form" className="w-full flex flex-col">
                <div className="flex items-center w-full flex-col space-y-0.5">
                  <label
                    // htmlFor={`passcode-${handleTriggerEmptyPasscode()}`}
                    className="text-secondary text-[0.75rem] poppins-bold text-start"
                  >
                    Passcode
                  </label>
                  <div className="flex items-center justify-center gap-1.5 w-fit">
                    {passcode.map((code, index) => (
                      <input
                        key={index}
                        className="border border-secondary/50 text-secondary text-sm poppins-bold p-2 w-10 rounded-sm text-center disabled"
                        value={code}
                        disabled={loginMutation.isPending}
                        onChange={(e) => {
                          const letter = e.target.value.charAt(
                            e.target.value.length - 1
                          );
                          setPasscode((pass) => {
                            return pass.map((data, i) => {
                              if (i === index) {
                                return letter;
                              } else {
                                return data;
                              }
                            });
                          });
                          if (letter !== "") {
                            setPasscodeIndex(index + 1);
                          }
                        }}
                        ref={(el) => {
                          if (el) passcodeRef.current[index] = el;
                        }}
                        id={`passcode-${index}`}
                        placeholder="•"
                      />
                    ))}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="rounded-md h-full bg-primary hidden md:flex pt-2"></div>
      </div>
    </div>
  );
}

export default App;
