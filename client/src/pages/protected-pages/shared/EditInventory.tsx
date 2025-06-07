import InputBox from "../../../components/InputBox";
import {
  useForm,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";

import useAxiosInterceptor from "../../../hooks/useAxiosInterceptor";
import { useMutation, useQuery } from "@tanstack/react-query";
import { INVENTORY_URL } from "../../../api/request-api";
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
import { IoSearch } from "react-icons/io5";
import useSearchDebounce from "../../../hooks/useSearchDebounce";
import { useParams } from "react-router-dom";
import type {
  EditInventoryDetailsType,
  ReasonType,
} from "../../../types/inventory.types";
const LazySelectProduct = lazy(
  () => import("./components/inventory-page/SelectProduct")
);
const DEFAULT_VALUES = {
  product_id: null,
  type: "" as "" | "in" | "out",
  reason: "" as "" | ReasonType,
  stock: 0,
} as InventoryValidationType;
function EditInventory() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchProduct, setSearchProduct] = useState("");
  const debounceSearchedProduct = useSearchDebounce(searchProduct);
  const [selectedProduct, setSelectedProduct] = useState<
    | (Pick<
        FullProductDetailsType,
        "id" | "product_name" | "sku" | "barcode"
      > & { stock: number })
    | null
  >(null);
  const axiosInstance = useAxiosInterceptor();
  const { id } = useParams();
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(
      inventoryValidation(selectedProduct?.stock as number)
    ),
  });
  const inventoryDetails = useQuery({
    queryKey: ["inventory-details", id],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${INVENTORY_URL}/inventory-details/${id}`
      );
      const data = response.data.data as EditInventoryDetailsType;
      setSelectedProduct({
        product_name: data.product.product_name,
        id: data.product.id,
        sku: data.product.sku,
        barcode: data.product.barcode,
        stock: Number(response.data.product_stock),
      });

      for (const [key, value] of Object.entries(data)) {
        if (key in DEFAULT_VALUES) {
          setValue(key as keyof typeof DEFAULT_VALUES, value as string | null);
        }
      }
    },
  });
  const editInventory = useMutation({
    mutationFn: async (data: InventoryValidationType) => {
      const response = await axiosInstance.patch(
        `${INVENTORY_URL}/edit-inventory/${id}`,
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
          editInventory.mutate(payload);
        })}
        className="flex flex-col h-full w-full"
      >
        <div className="flex flex-col space-y-1.5 w-full flex-grow overflow-y-auto thin-scrollbar min-h-[200px] max-h-[250px]">
          <div className="flex md:justify-between items-center space-x-2 pr-2">
            <div className="block flex-shrink-0">
              <h1 className="text-primary text-sm poppins-semibold">
                Select Product
              </h1>
              <span className="text-slate-400 text-[0.7rem]">
                Select only one <span className="text-red-500">*</span>
              </span>
            </div>
            <div className="custom-border rounded-3xl bg-zinc-100 px-1.5 py-1 flex justify-between items-center flex-grow lg:w-1/3">
              <label className="text-zinc-100 p-1 rounded-full bg-secondary ">
                <IoSearch />
              </label>
              <input
                onChange={(e) => setSearchProduct(e.target.value)}
                type="text"
                placeholder="Search product"
                className="text-sm outline-none text-secondary flex-grow bg-transparent px-2 truncate"
              />
            </div>
          </div>
          <Suspense
            fallback={
              <div className="flex-grow min-h-[200px] max-h-[250px]">
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
                <div className="flex-grow min-h-[200px] max-h-[250px]">
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
                debounceSearchedProduct={debounceSearchedProduct}
              />
            </ErrorBoundary>
          </Suspense>
        </div>
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
              disabled={inventoryDetails.isLoading || editInventory.isPending}
              isLoading={editInventory.isPending}
              label="Update Inventory"
              spinnerClassName="border-white size-5 border-t-transparent"
              labelWhileLoading="Updating..."
              className="col-span-full text-[0.8rem]"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditInventory;
