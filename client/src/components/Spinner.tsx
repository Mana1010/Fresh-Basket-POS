import React from "react";
import { cn } from "../utils/cn";

type SpinnerProps = {
  className?: string;
};
function Spinner({ className }: SpinnerProps) {
  return (
    <div
      className={cn(
        "size-5 border-2 border-primary border-t-transparent rounded-full animate-spin",
        className
      )}
    ></div>
  );
}

export default Spinner;
