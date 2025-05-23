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
  type: "text" | "email" | "password" | "number" | "decimal";
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
  name,
  ...props
}: Omit<InputBoxProps<T>, "label" | "error">) {
  const [togglePassword, setTogglePassword] = useState(false);
  return (
    <div className={className}>
      <input
        type={togglePassword ? "text" : type}
        {...register(name)}
        {...props}
        className="flex-grow outline-none text-sm bg-transparent p-1.5 text-secondary "
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
  name,
  ...props
}: Omit<InputBoxProps<T>, "label" | "error">) {
  return <input {...register(name)} className={className} {...props} />;
}
function InputBox<T extends Record<string, unknown>>({
  register,
  className,
  id,
  label,
  type,
  required,
  ...props
}: InputBoxProps<T>) {
  return (
    <div className="flex w-full flex-col space-y-0.5">
      <label
        htmlFor={id}
        className="text-secondary text-[0.75rem] poppins-bold"
      >
        {label} {required ? <span className="text-red-400">*</span> : ""}
      </label>
      {type === "password" ? (
        <PasswordInputBox
          register={register}
          className={cn(
            "rounded-sm w-full bg-secondary/25 p-1 flex items-center disabled",
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
            "rounded-sm w-full text-secondary p-2 text-[0.85rem] disabled border border-zinc-200 outline-primary",
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
