import React from "react";
import type { IconType } from "react-icons/lib";
import { cn } from "../../../utils/cn";

export type RecordBoxProps = {
  label: string;
  value: string;
  className?: string;
  isLoading?: boolean;
  Icon?: IconType;
};
function RecordBox({
  label,
  value,
  className,
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
      <h1 className="text-[0.7rem] text-secondary poppins-semibold">{label}</h1>

      {isLoading ? (
        <div className="h-4 w-24 rounded-3xl bg-secondary/80 animate-pulse"></div>
      ) : (
        <span className="text-secondary text-lg lg:text-2xl relative z-1 poppins-semibold">
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
