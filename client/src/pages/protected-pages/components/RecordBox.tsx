import React from "react";
import type { IconType } from "react-icons/lib";
import { cn } from "../../../utils/cn";

export type RecordBoxProps = {
  label: string;
  value: string;
  className?: string;
  Icon: IconType;
};
function RecordBox({ label, value, className, Icon }: RecordBoxProps) {
  return (
    <div
      className={cn(
        "bg-secondary w-full border border-zinc-300 rounded-md h-full p-2 space-y-2 relative",
        className
      )}
    >
      <h1 className="text-[0.7rem] text-zinc-200">{label}</h1>
      <span className="text-zinc-300 poppins-extrabold text-3xl relative z-1">
        {value}
      </span>
      <span className="right-1 absolute bottom-1 text-6xl text-zinc-300/25">
        {" "}
        <Icon />
      </span>
    </div>
  );
}

export default RecordBox;
