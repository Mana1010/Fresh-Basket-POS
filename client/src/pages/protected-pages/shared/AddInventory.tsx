import InputBox from "../../../components/InputBox";
import { useForm } from "react-hook-form";
import { IoIosAddCircleOutline } from "react-icons/io";
import { toast } from "sonner";
import { type ProductDetailsType } from "../../../validation/product.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModalStore } from "../../../store/modal.store";
import useAxiosInterceptor from "../../../hooks/useAxiosInterceptor";
import {
  useMutation,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";
import { PRODUCT_URL } from "../../../api/request-api";
import type { AxiosError } from "axios";
import ProductCategoryLoading from "./components/loading/ProductCategoryLoading";
import type { CategoryType } from "../../../types/product.types";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  inventoryValidation,
  type InventoryValidationType,
} from "../../../validation/inventory.validation";
function AddInventory() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
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
      type: "in",
      reason: "supplier_delivery",
      stock: 0,
    },
    resolver: zodResolver(inventoryValidation),
  });
  const { isOpenAddCategoryForm, toggleCategoryForm } = useModalStore();

  const allCategories: UseQueryResult<CategoryType[], AxiosError> = useQuery({
    queryKey: ["all-product-categories"],
    queryFn: async () => {
      const response = await axiosInstance.get(`${PRODUCT_URL}/all-categories`);

      return response.data.categories;
    },
    staleTime: Infinity,
  });

  const addInventory = useMutation({
    mutationFn: async (data: InventoryValidationType) => {
      const response = await axiosInstance.post(
        `${PRODUCT_URL}/create-product`,
        data
      );
      return response.data;
    },
    onSuccess: ({ message }) => {
      toast.success(message);
      reset();
      navigate("/products");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      console.log(err);
      toast.error(err.response?.data.message);
    },
  });

  return (
    <div className="pt-3 bg-white/20 rounded-sm border border-zinc-800/15 p-2 w-full h-full relative">
      <form
        // onSubmit={handleSubmit((data: InventoryValidationType) => {
        //   addProduct.mutate(data);
        // })}
        className=" flex flex-col h-full w-full"
      >
        <div className="flex flex-col space-y-1.5 w-full basis-[40%]">
          <div className="block">
            <h1 className="text-primary text-sm poppins-semibold">
              Select Product Category
            </h1>
            {errors.product_id ? (
              <span className="text-red-500 text-[0.7rem]">
                {errors.product_id.message}
              </span>
            ) : (
              <span className="text-slate-400 text-[0.7rem]">
                Select only one <span className="text-red-500">*</span>
              </span>
            )}
          </div>
          <div className="pb-1 thin-scrollbar w-full">
            {allCategories.isLoading || !allCategories.data ? (
              <ProductCategoryLoading />
            ) : (
              <div className="flex gap-1.5 overflow-x-auto items-center w-full">
                {allCategories?.data.map((name, i) => (
                  <button
                    key={i}
                    onClick={() => setValue("product_id", name.id)}
                    type="button"
                    className={` custom-border rounded-md p-3  min-h-10 flex items-center justify-center basis-[20%] flex-shrink-0 text-sm relative ${
                      watch("product_id") === name.id
                        ? "border-primary text-primary bg-primary/15"
                        : "text-secondary/75"
                    }`}
                  >
                    {name.category_name}
                  </button>
                ))}
                <button
                  onClick={() => toggleCategoryForm(true)}
                  type="button"
                  className="custom-border rounded-md p-3 text-primary min-h-10 flex items-center justify-center basis-[20%] flex-shrink-0 text-xl cursor-pointer"
                >
                  <IoIosAddCircleOutline />
                </button>
              </div>
            )}
          </div>
        </div>
        <span className="w-full h-[1px] bg-zinc-800/25 my-4"></span>
        <div className="flex flex-col gap-2 basis-[60%]">
          <h1 className="text-primary text-sm poppins-semibold">
            Product Details
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 py-2 flex-grow lg:h-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 justify-center overflow-y-auto pr-2">
              <div className="flex w-full flex-col space-y-0.5">
                <h5 className="text-secondary text-[0.7rem] poppins-bold">
                  Product Name
                </h5>
                <div></div>
              </div>
              <InputBox
                register={register}
                tabIndex={1}
                id="type"
                name="type"
                label="Discount Rate (%)"
                type="number"
                placeholder="Enter Discount Rate"
                errorMessage={errors.type?.message}
                isRequired
              />
              <InputBox
                register={register}
                tabIndex={2}
                id="stock"
                name="stock"
                label="Stock"
                type="number"
                placeholder="₱ 1.00"
                errorMessage={errors.stock?.message}
                isRequired
              />

              <InputBox
                register={register}
                tabIndex={5}
                id="reason"
                name="reason"
                label="Tax Rate (%)"
                type="number"
                placeholder="Enter Tax Rate"
                errorMessage={errors.reason?.message}
                isRequired
              />
              <Button
                type="submit"
                disabled={false}
                label="Upload Product"
                labelWhileLoading="Uploading..."
                className="col-span-2 text-[0.8rem]"
              />
            </div>
            <div className="flex flex-col justify-center w-full items-center h-full p-3"></div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddInventory;
