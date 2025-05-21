import React from "react";

function Categories() {
  return (
    <div className="grid items-center grid-cols-3 gap-2 pt-1.5">
      <div className="border border-zinc-300 rounded-md p-3 flex items-center justify-between bg-white">
        <h1 className="text-primary poppins-extrabold text-lg">Bread</h1>
        <h3 className=" text-secondary/75 text-[0.9rem]">3 Items</h3>
      </div>
      <div className="border border-zinc-300 rounded-md p-3 flex items-center justify-between bg-white">
        <h1 className="text-primary poppins-extrabold text-lg">Bread</h1>
        <h3 className=" text-secondary/75 text-[0.9rem]">3 Items</h3>
      </div>
      <div className="border border-zinc-300 rounded-md p-3 flex items-center justify-between bg-white">
        <h1 className="text-primary poppins-extrabold text-lg">Bread</h1>
        <h3 className=" text-secondary/75 text-[0.9rem]">3 Items</h3>
      </div>
    </div>
  );
}

export default Categories;
