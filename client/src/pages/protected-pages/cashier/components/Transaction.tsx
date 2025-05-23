import React from "react";

function Transaction() {
  return (
    <div className="w-full h-full bg-white basis-[35%] shadow-sm border border-zinc-400/35 p-2 flex flex-col">
      <h1 className="text-md text-secondary poppins-extrabold">
        Sales <span className="text-primary  poppins-extrabold">Terminal</span>
      </h1>
      <form className="flex flex-col pt-2 px-1.5 space-y-2">
        <div className="grid grid-cols-2 items-center justify-center gap-1.5">
          <input
            type="text"
            placeholder="Product's Barcode"
            className="col-span-2 text-[0.75rem] rounded-sm bg-secondary/20 py-2 px-2 border border-zinc-400/35 outline-primary text-secondary"
          />
          <input
            type="number"
            placeholder="Total Quantity"
            className=" text-[0.75rem] rounded-sm bg-secondary/20 py-2 px-2 border border-zinc-400/35 outline-primary text-secondary"
          />
          <input
            type="text"
            placeholder="Total Kilo"
            className=" text-[0.75rem] rounded-sm bg-secondary/20 py-2 px-2 border border-zinc-400/35 outline-primary text-secondary"
          />
        </div>
        <button></button>
        <button
          type="submit"
          className="self-end px-2 py-1.5 text-sm bg-primary text-white rounded-sm w-1/2 cursor-pointer"
        >
          Enter
        </button>
      </form>
    </div>
  );
}

export default Transaction;
