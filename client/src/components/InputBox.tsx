import React, { useState } from "react";
import { type Path, type UseFormRegister } from "react-hook-form";
import { cn } from "../utils/cn";
import { FaEyeSlash, FaEye } from "react-icons/fa";
type InputBoxProps<T extends Record<string, unknown>> = {
  register: UseFormRegister<T>;
  className?: string;
  label: string;
  id: Path<T>;
  tabIndex: number;
  type: "text" | "email" | "password";
  name: Path<T>;
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
};

function PasswordInputBox<T extends Record<string, unknown>>({
  register,
  className,
  type,
  ...props
}: Omit<InputBoxProps<T>, "label" | "error">) {
  const [togglePassword, setTogglePassword] = useState(false);
  return (
    <div className={className}>
      <input
        type={togglePassword ? "text" : type}
        {...register}
        {...props}
        className="flex-grow outline-none text-sm bg-transparent p-1.5 poppins-bold text-secondary "
      />
      <button
        type="button"
        onClick={() => setTogglePassword((prev) => !prev)}
        className="text-secondary text-sm p-1.5 poppins-bold"
      >
        {togglePassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
}
function TextInputBox<T extends Record<string, unknown>>({
  register,
  className,
  ...props
}: Omit<InputBoxProps<T>, "label" | "error">) {
  return <input {...register} className={className} {...props} />;
}
function InputBox<T extends Record<string, unknown>>({
  register,
  className,
  id,
  label,
  type,
  ...props
}: InputBoxProps<T>) {
  return (
    <div className="flex w-full flex-col space-y-0.5">
      <label
        htmlFor={id}
        className="text-secondary text-[0.75rem] poppins-bold"
      >
        {label}
      </label>
      {type === "password" ? (
        <PasswordInputBox
          register={register}
          className={cn(
            "rounded-sm w-full bg-secondary/40 p-1 flex items-center disabled",
            className
          )}
          type={type}
          id={id}
          {...props}
        />
      ) : (
        <TextInputBox
          register={register}
          className={cn(
            "rounded-sm w-full text-secondary poppins-bold bg-secondary/40 p-2.5 text-sm disabled",
            className
          )}
          type={type}
          id={id}
          {...props}
        />
      )}
    </div>
  );
}

export default InputBox;
