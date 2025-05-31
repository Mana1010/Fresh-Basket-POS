import InputBox from "../../../components/InputBox";
import {
  useForm,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";

import useAxiosInterceptor from "../../../hooks/useAxiosInterceptor";
import { useMutation } from "@tanstack/react-query";
import { INVENTORY_URL, PRODUCT_URL } from "../../../api/request-api";
import type { AxiosError } from "axios";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  inventoryValidation,
  type InventoryValidationType,
} from "../../../validation/inventory.validation";
import { lazy, Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { MdEditOff } from "react-icons/md";
import BoxesLoading from "./components/loading/BoxesLoading";
import type { FullProductDetailsType } from "../../../types/product.types";
const LazySelectProduct = lazy(
  () => import("./components/inventory-page/SelectProduct")
);
function AddInventory() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Pick<
    FullProductDetailsType,
    "id" | "product_name" | "sku" | "barcode"
  > | null>(null);
  const axiosInstance = useAxiosInterceptor();
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      product_id: null,
      type: "",
      reason: "",
      stock: 0,
    },
    resolver: zodResolver(inventoryValidation),
  });

  const addInventory = useMutation({
    mutationFn: async (data: InventoryValidationType) => {
      const response = await axiosInstance.post(
        `${INVENTORY_URL}/add-inventory`,
        data
      );
      return response.data;
    },
    onSuccess: ({ message }) => {
      toast.success(message);
      reset();
      navigate("/inventory");
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      console.log(err);
      toast.error(err.response?.data.message);
    },
  });

  return (
    <div className="pt-3 bg-white/20 rounded-sm border border-zinc-800/15 p-2 w-full h-auto lg:h-full relative overflow-visible lg:overflow-hidden">
      <form
        onSubmit={handleSubmit((data: InventoryValidationType) => {
          const payload = {
            ...data,
            stock:
              data.type === "in" ? Math.abs(data.stock) : -Math.abs(data.stock),
          };
          addInventory.mutate(payload);
        })}
        className="flex flex-col h-full w-full"
      >
        <Suspense
          fallback={
            <div className=" flex flex-col space-y-2 flex-grow min-h-[200px] max-h-[250px]">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col space-y-1 w-full">
                  <div className="rounded-3xl min-h-3 w-[15%] bg-zinc-400 animate-pulse" />
                  <div className="rounded-3xl min-h-2.5 w-[10%] bg-zinc-400 animate-pulse" />
                </div>
                <div className="rounded-3xl min-h-6 w-[40%] bg-zinc-400 animate-pulse" />
              </div>
              <BoxesLoading
                totalBoxes={6}
                className="overflow-y-auto grid-cols-2 lg:grid-cols-4"
                boxesClassName="min-h-20"
              />
            </div>
          }
        >
          <ErrorBoundary
            fallback={
              <div className="flex flex-col space-y-2 flex-grow min-h-[200px] max-h-[250px]">
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col space-y-1 w-full">
                    <div className="rounded-3xl min-h-3 w-[15%] bg-zinc-400 animate-pulse" />
                    <div className="rounded-3xl min-h-2.5 w-[10%] bg-zinc-400 animate-pulse" />
                  </div>
                  <div className="rounded-3xl min-h-6 w-[40%] bg-zinc-400 animate-pulse" />
                </div>
                <BoxesLoading
                  totalBoxes={6}
                  className="overflow-y-auto grid-cols-2 lg:grid-cols-4"
                  boxesClassName="min-h-20"
                />
              </div>
            }
          >
            <LazySelectProduct
              setSelectedProduct={setSelectedProduct}
              watch={watch as UseFormWatch<InventoryValidationType>}
              setValue={setValue as UseFormSetValue<InventoryValidationType>}
            />
          </ErrorBoundary>
        </Suspense>
        <span className="w-full h-[1px] bg-zinc-800/25 my-4"></span>
        <div className="flex flex-col gap-2">
          <h1 className="text-primary text-sm poppins-semibold">
            Inventory Details
          </h1>

          <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-2 justify-center overflow-y-auto pr-2 w-full items-center">
            <div className="flex w-full flex-col space-y-0.5">
              <label className="text-secondary text-[0.7rem] poppins-bold">
                Product Name <span className="text-red-400">*</span>
              </label>
              <div
                className={`rounded-sm w-full text-secondary p-2 text-[0.85rem] disabled outline-primary border border-zinc-300 flex justify-between items-center`}
              >
                {selectedProduct ? (
                  <span>{selectedProduct.product_name}</span>
                ) : (
                  <span className="text-secondary/60">Product Name Here</span>
                )}
                <span className="text-secondary/80 text-lg">
                  <MdEditOff />
                </span>
              </div>
            </div>
            <div className="flex w-full flex-col space-y-0.5">
              <label className="text-secondary text-[0.7rem] poppins-bold">
                Product Sku <span className="text-red-400">*</span>
              </label>
              <div
                className={`rounded-sm w-full text-secondary p-2 text-[0.85rem] disabled outline-primary border border-zinc-300 flex justify-between items-center`}
              >
                {selectedProduct ? (
                  <span>{selectedProduct.sku}</span>
                ) : (
                  <span className="text-secondary/60">Product Sku Here</span>
                )}
                <span className="text-secondary/80 text-lg">
                  <MdEditOff />
                </span>
              </div>
            </div>
            <div className="flex w-full flex-col space-y-0.5">
              <label className="text-secondary text-[0.7rem] poppins-bold">
                Product Barcode <span className="text-red-400">*</span>
              </label>
              <div
                className={`rounded-sm w-full text-secondary p-2 text-[0.85rem] disabled outline-primary border border-zinc-300 flex justify-between items-center`}
              >
                {selectedProduct ? (
                  <span>{selectedProduct.barcode}</span>
                ) : (
                  <span className="text-secondary/60">
                    Product Barcode Here
                  </span>
                )}
                <span className="text-secondary/80 text-lg">
                  <MdEditOff />
                </span>
              </div>
            </div>
            <div className="flex w-full flex-col space-y-0.5">
              <label
                htmlFor="type"
                className="text-secondary text-[0.7rem] poppins-bold"
              >
                Type <span className="text-red-400">*</span>
              </label>
              <select
                {...register("type")}
                name="type"
                id="type"
                className={`rounded-sm w-full text-secondary p-2 text-[0.85rem] disabled outline-primary  border  ${
                  errors.type ? "border-red-500/90" : "border-zinc-300"
                }`}
              >
                <option value="" disabled hidden>
                  Select an option
                </option>
                <option value="in" className="p-2">
                  Stock In
                </option>
                <option value="out" className="p-2">
                  Stock Out
                </option>
              </select>
              {errors.type && (
                <p className="text-[0.65rem] text-red-500">
                  {errors.type.message}
                </p>
              )}
            </div>
            {watch("type") === "" && (
              <InputBox
                register={register}
                tabIndex={2}
                id="stock"
                name="stock"
                label="Select type first"
                type="number"
                placeholder="₱ 1.00"
                errorMessage={errors.stock?.message}
                disabled
                isRequired
              />
            )}
            {watch("type") === "in" && (
              <InputBox
                register={register}
                tabIndex={2}
                id="stock"
                name="stock"
                label="Total Stock In"
                type="number"
                placeholder="Enter the total stock in"
                errorMessage={errors.stock?.message}
                disabled={watch("type") !== "in"}
                isRequired
              />
            )}
            {watch("type") === "out" && (
              <InputBox
                register={register}
                tabIndex={2}
                id="stock"
                name="stock"
                label="Total Stock Out"
                type="number"
                placeholder="Enter the total stock out"
                errorMessage={errors.stock?.message}
                isRequired
              />
            )}
            <div className="flex w-full flex-col space-y-0.5">
              <label
                htmlFor="reason"
                className="text-secondary text-[0.7rem] poppins-bold"
              >
                Reason <span className="text-red-400">*</span>
              </label>
              <select
                {...register("reason")}
                name="reason"
                id="reason"
                className={`rounded-sm w-full text-secondary p-2 text-[0.85rem] disabled outline-primary  border border-zinc-300 ${
                  errors.reason ? "border-red-500/90" : "border-zinc-300"
                }`}
              >
                <option value="" disabled hidden>
                  Select a reason
                </option>
                <option value="supplier_delivery" className="p-2">
                  Supplier Delivery
                </option>
                <option value="customer_sale" className="p-2">
                  Sold in Customer
                </option>
                <option value="damaged_or_spoiled" className="p-2">
                  Damaged/Spoiled
                </option>
              </select>
              {errors.reason && (
                <p className="text-[0.65rem] text-red-500">
                  {errors.reason.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={false}
              label="Upload Inventory"
              labelWhileLoading="Uploading..."
              className="col-span-full text-[0.8rem]"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddInventory;
