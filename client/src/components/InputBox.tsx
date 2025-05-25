import { useState } from "react";
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
  isRequired?: boolean;
  errorMessage?: string;
};

function PasswordInputBox<T extends Record<string, unknown>>({
  register,
  className,
  type,
  name,
  errorMessage,
  ...props
}: Omit<InputBoxProps<T>, "label" | "error">) {
  const [togglePassword, setTogglePassword] = useState(false);
  return (
    <div className="block space-y-0.5">
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
      {errorMessage && (
        <p className="text-[0.65rem] text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
function TextInputBox<T extends Record<string, unknown>>({
  register,
  className,
  name,
  errorMessage,
  ...props
}: Omit<InputBoxProps<T>, "label" | "error">) {
  return (
    <div className="block space-y-0.5">
      <input {...register(name)} className={className} {...props} />
      {errorMessage && (
        <p className="text-[0.65rem] text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
function InputBox<T extends Record<string, unknown>>({
  register,
  className,
  id,
  label,
  type,
  isRequired,
  errorMessage,
  ...props
}: InputBoxProps<T>) {
  return (
    <div className="flex w-full flex-col space-y-0.5">
      <label htmlFor={id} className="text-secondary text-[0.7rem] poppins-bold">
        {label} {isRequired ? <span className="text-red-400">*</span> : ""}
      </label>
      {type === "password" ? (
        <PasswordInputBox
          register={register}
          className={cn(
            `rounded-sm w-full p-1 flex items-center disabled  border border-zinc-300  ${
              errorMessage && "border-red-500/90"
            }`,
            className
          )}
          type={type}
          id={id}
          errorMessage={errorMessage}
          {...props}
        />
      ) : (
        <TextInputBox
          register={register}
          className={cn(
            `rounded-sm w-full text-secondary p-2 text-[0.85rem] disabled outline-primary  border border-zinc-300 ${
              errorMessage && "border-red-500/90"
            }`,
            className
          )}
          type={type}
          id={id}
          errorMessage={errorMessage}
          {...props}
        />
      )}
    </div>
  );
}

export default InputBox;
