import React from "react";

function SidebarLoading() {
  const TOTAL_NAV = 4;
  return (
    <div className=" flex flex-col w-full space-y-3">
      {new Array(TOTAL_NAV).fill(null).map((_, i) => {
        return (
          <div
            className={`space-y-1.5 items-center flex flex-col animate-pulse w-full`}
            key={i}
          >
            <div className=" p-2.5 w-1/2 rounded-3xl bg-zinc-300"></div>
            <div className="text-[0.6rem] py-1 rounded-3xl w-full bg-zinc-300"></div>
          </div>
        );
      })}
    </div>
  );
}

export default SidebarLoading;
