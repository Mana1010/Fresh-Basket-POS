import React, { useEffect, useState } from "react";
import clock from "../../../assets/header-sticker/clock.svg";

function HeaderClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const time = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(time);
  }, []);

  const formatted = time.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  return (
    <div className="px-2 w-fit py-1.5 rounded-sm bg-secondary text-zinc-300 flex items-center space-x-2">
      <img src={clock} alt="clock" width={20} height={20} />
      <span className="text-[0.7rem]">{formatted}</span>
    </div>
  );
}

export default HeaderClock;
