import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { IoBarcode, IoCube } from "react-icons/io5";
import { transactionPanelValidation } from "../../../../../validation/order.validation";

function Transaction() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      quantity: 1,
      barcode: "",
    },
    resolver: zodResolver(transactionPanelValidation),
  });
  return (
    <div className="w-full h-full basis-[35%] border border-zinc-200 p-2 flex flex-col shrink-0 rounded-sm">
      <h1 className="text-sm text-secondary poppins-extrabold">
        Transaction{" "}
        <span className="text-primary  poppins-extrabold">Panel</span>
      </h1>
      <form
        onSubmit={handleSubmit((data) => {
          console.log("Submit");
        })}
        className="flex flex-col pt-2 px-1.5 space-y-2"
      >
        <div className="grid grid-cols-1 items-center justify-center gap-1.5">
          <div className="block space-y-0.5">
            <div className="flex items-center justify-between space-x-1 w-full border border-zinc-200">
              <label
                htmlFor="barcode"
                className="p-2 bg-primary text-white text-lg"
              >
                <IoBarcode />
              </label>
              <input
                {...register("barcode")}
                type="text"
                id="barcode"
                placeholder="Product Barcode"
                className=" text-[0.8rem] outline-none p-1.5 bg-transparent text-secondary flex-grow poppins-bold"
              />
            </div>
            {errors.barcode && (
              <p className="text-[0.65rem] text-red-500">
                {errors.barcode.message}
              </p>
            )}
          </div>
          <div className="block space-y-0.5">
            <div className="flex items-center justify-between space-x-1 w-full border border-zinc-200">
              <label
                htmlFor="quantity"
                className="p-2 bg-primary text-white text-lg"
              >
                <IoCube />
              </label>
              <input
                {...register("quantity")}
                name="quantity"
                type="number"
                id="quantity"
                placeholder="Product Quantity"
                className=" text-[0.8rem] outline-none p-1.5 bg-transparent text-secondary flex-grow poppins-bold"
              />
            </div>
            {errors.quantity && (
              <p className="text-[0.65rem] text-red-500">
                {errors.quantity.message}
              </p>
            )}
          </div>
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
