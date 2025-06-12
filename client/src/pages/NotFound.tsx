import React from "react";
import notfound from "../assets/404-page.svg";
function NotFound() {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <img src={notfound} width={300} height={300} />
    </div>
  );
}

export default NotFound;
