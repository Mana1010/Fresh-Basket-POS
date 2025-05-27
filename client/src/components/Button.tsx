import { cn } from "../utils/cn";
import Spinner from "./Spinner";
import type { IconType } from "react-icons/lib";
type ButtonProps = {
  className?: string;
  spinnerClassName?: string;
  isLoading?: boolean;
  onClick?: () => void;
  Icon?: IconType;
  label: string;
  labelWhileLoading: string;
  ariaLabel?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};
function Button({
  className,
  isLoading,
  disabled,
  onClick,
  label,
  spinnerClassName,
  labelWhileLoading,
  ariaLabel,
  type,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={cn(
        "flex space-x-1.5 items-center justify-center w-full bg-primary text-white rounded-sm disabled py-2 px-1.5 cursor-pointer",
        className
      )}
    >
      {isLoading ? <Spinner className={cn("", spinnerClassName)} /> : null}
      <span>{isLoading ? labelWhileLoading : label} </span>
    </button>
  );
}

export default Button;
