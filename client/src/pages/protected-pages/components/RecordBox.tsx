import React from "react";
import type { IconType } from "react-icons/lib";
import { cn } from "../../../utils/cn";

export type RecordBoxProps = {
  label: string;

  value: string;
  className?: string;
  textClassName?: string;
  isLoading?: boolean;
  Icon?: IconType;
};
function RecordBox({
  label,
  value,
  className,
  textClassName,
  Icon,
  isLoading,
}: RecordBoxProps) {
  return (
    <div
      className={cn(
        "bg-zinc-100 w-full border border-zinc-300 rounded-md h-full p-2 space-y-2 relative",
        className
      )}
    >
      <h1 className={"text-[0.7rem] text-secondary poppins-semibold"}>
        {label}
      </h1>

      {isLoading ? (
        <div className="h-4 w-24 rounded-3xl bg-secondary/80 animate-pulse"></div>
      ) : (
        <span
          className={cn(
            "text-secondary text-lg lg:text-xl relative z-1 poppins-bold",
            textClassName
          )}
        >
          {value}
        </span>
      )}

      {Icon && (
        <span className="right-1 absolute bottom-1 text-3xl md:text-5xl text-zinc-300">
          {" "}
          <Icon />
        </span>
      )}
    </div>
  );
}

export default RecordBox;
