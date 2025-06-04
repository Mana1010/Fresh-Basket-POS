import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import InputBox from "../../../components/InputBox";
import { useMutation } from "@tanstack/react-query";
import { AUTH_URL } from "../../../api/request-api";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import { useAuthStore } from "../../../store/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginValidation } from "../../../validation/auth.validation";
type FormData = {
  username: string;
  password: string;
};
type LoginMutationType = {
  type: "credential-based" | "passcode-based";
  data: { passcode: string } | FormData;
};
function LoginForm() {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const [passcode, setPasscode] = useState(["", "", "", "", "", ""]);
  const [passcodeIndex, setPasscodeIndex] = useState(0);
  const [typeForm, setTypeForm] = useState<
    "passcode-based" | "credential-based"
  >("credential-based");
  const passcodeRef = useRef<Array<HTMLInputElement | null>>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(loginValidation),
  });

  const loginMutation = useMutation({
    mutationFn: async ({ type, data }: LoginMutationType) => {
      const response = await axios.post(`${AUTH_URL}/login?type=${type}`, data);
      return response.data;
    },
    onSuccess: async ({ message, token, role, user }) => {
      setUser(user);
      reset();
      setPasscode(["", "", "", "", "", ""]);
      localStorage.setItem("session_token", token);
      toast.success(message);
      if (role === "cashier") {
        navigate("/checkout");
      } else {
        navigate("/reports");
      }
    },
    onError: (err: AxiosError<{ message: string }>) => {
      if (err.response?.status === 429) {
        toast.error("You’ve made too many requests. Try again in 1 minute.");
        return;
      }

      toast.error(err.response?.data.message);
    },
  });

  useEffect(() => {
    passcodeRef.current[passcodeIndex]?.focus();
    const allPasscodeAreFilledUp = passcode.every(
      (passcode) => passcode !== ""
    );
    if (allPasscodeAreFilledUp) {
      setTypeForm("passcode-based");
      loginMutation.mutate({
        type: "passcode-based",
        data: { passcode: passcode.join("") },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passcode, passcodeIndex]);
  return (
    <div className="flex-grow flex flex-col w-full h-full">
      <div className="w-full flex flex-col gap-2 flex-grow pt-5 justify-center">
        <h5 className="text-primary text-xl poppins-extrabold">
          Welcome <span className="text-secondary">Back!</span>
        </h5>
        <form
          onSubmit={handleSubmit(async (data: FormData) => {
            setTypeForm("credential-based");
            loginMutation.mutate({ type: "credential-based", data });
          })}
          id="credential-based-form"
          className="w-full flex flex-col gap-2"
        >
          <InputBox
            tabIndex={1}
            register={register}
            id="username"
            type="text"
            disabled={loginMutation.isPending}
            isRequired
            placeholder="Enter your username"
            name="username"
            label="Username"
            className="bg-secondary/25"
            errorMessage={errors.username?.message}
          />
          <InputBox
            tabIndex={2}
            register={register}
            id="password"
            type="password"
            disabled={loginMutation.isPending}
            isRequired
            placeholder="••••••••••"
            name="password"
            label="Password"
            className="bg-secondary/25"
            errorMessage={errors.password?.message}
          />

          <button
            disabled={loginMutation.isPending}
            className="w-1/2 rounded-sm not-disabled:bg-primary text-white py-2 text-[0.85rem] poppins-bold mx-auto disabled"
          >
            {loginMutation.isPending && typeForm === "credential-based" ? (
              <div className="flex items-center space-x-1.5 justify-center w-full">
                <Spinner className="border-secondary border-t-transparent" />
                <span className="text-white">Authenticating</span>
              </div>
            ) : (
              "Continue"
            )}
          </button>
        </form>
        <span className="text-center text-secondary/45 py-3">
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
  );
}

export default LoginForm;
