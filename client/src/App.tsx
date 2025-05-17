import { useEffect, useState } from "react";
import "./App.css";
import { getTimeOfDay } from "./utils/get-time-day";
import { GiSlicedBread, GiBasket } from "react-icons/gi";
import { AnimatePresence, type Variants, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import InputBox from "./components/InputBox";
function App() {
  const roles = ["Admin", "Manager", "Cashier"];
  const [index, setIndex] = useState(0);
  const [passcode, setPasscode] = useState(["", "", "", "", "", ""]);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      username: "",
      password: "",
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

  const roleVariants: Variants = {
    hidden: {
      opacity: 0,
      y: -10,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
    exit: {
      y: 10,
      opacity: 0,
    },
  };
  function handleTriggerEmptyPasscode() {
    const findEmptyPasscodeElseOne = passcode.find((code, index) => {
      return code === "" ? index : passcode.length - 1;
    });
    alert(findEmptyPasscodeElseOne);
    return findEmptyPasscodeElseOne;
  }
  return (
    <div className=" poppins-regular w-full h-screen home-background flex justify-center items-center p-3">
      <div className="w-full md:w-2/3 bg-white/80 rounded-sm p-2.5 h-full md:min-h-[300px] md:h-[80%] grid grid-cols-1 md:grid-cols-2 relative gap-0 md:gap-2">
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
                {roles.map((role, i) => (
                  <>
                    {i === index && (
                      <motion.span
                        variants={roleVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-primary text-xl"
                      >
                        {role}
                      </motion.span>
                    )}
                  </>
                ))}
              </AnimatePresence>
            </div>
            <div className="w-full flex flex-col gap-2 flex-grow pt-5">
              <h5 className="text-primary text-xl poppins-extrabold">
                Welcome <span className="text-secondary">Back!</span>
              </h5>
              <form
                id="credential-based-form"
                className="w-full flex flex-col gap-2"
              >
                <InputBox
                  register={register}
                  id="username"
                  type="text"
                  disabled={false}
                  required={true}
                  placeholder="Enter your username"
                  name="username"
                  label="Username"
                />
                <InputBox
                  register={register}
                  id="password"
                  type="password"
                  disabled={false}
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
                        className="border border-secondary/50 text-secondary text-sm poppins-bold p-2 w-10 rounded-sm text-center"
                        value={code}
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
