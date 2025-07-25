import { useMemo, useRef, useState, type ChangeEvent } from "react";
import InputBox from "../../../components/InputBox";
import { useForm } from "react-hook-form";
import { IoIosAddCircleOutline } from "react-icons/io";
import { toast } from "sonner";
import {
  productValidation,
  type ProductDetailsType,
} from "../../../validation/product.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import AddCategoryForm from "./components/product-page/AddCategoryForm";
import PreviewProductThumbnail from "./components/product-page/PreviewProductThumbnail";
import { useModalStore } from "../../../store/modal.store";
import { AnimatePresence } from "framer-motion";
import useAxiosInterceptor from "../../../hooks/useAxiosInterceptor";
import {
  useMutation,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";
import { PRODUCT_URL } from "../../../api/request-api";
import type { AxiosError } from "axios";
import BoxesLoading from "./components/loading/BoxesLoading";
import type {
  CategoryType,
  FullProductDetailsType,
} from "../../../types/product.types";
import Button from "../../../components/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import EditCategoryForm from "./components/product-page/EditCategoryForm";
import { IoCreate, IoTrash } from "react-icons/io5";
const DEFAULT_VALUES = {
  product_name: "",
  barcode: "",
  product_category_id: null,
  price: "",
  discount_rate: 0,
  tax_rate: 0,
  sku: "",
  product_thumbnail: null,
  manufacturer: "",
};
function EditProduct() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedCategoryToEdit, setSelectedCategoryToEdit] =
    useState<string>("");
  const PREVIOUS_DATAREF =
    useRef<Record<keyof typeof DEFAULT_VALUES, unknown>>(DEFAULT_VALUES);
  const axiosInstance = useAxiosInterceptor();
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(productValidation),
  });
  const { isOpenAddCategoryForm, toggleCategoryForm, setCategoryToRemove } =
    useModalStore();
  const [previewProductThumbnail, setPreviewProductThumbnail] = useState<
    string | null
  >(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const productDetails: UseQueryResult<
    {
      product: FullProductDetailsType;
      categories: CategoryType[];
    },
    AxiosError
  > = useQuery({
    queryKey: ["product-details", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`${PRODUCT_URL}/details/${id}`);
      const data = response.data.data as {
        product: FullProductDetailsType;
        categories: CategoryType[];
      };

      for (const [key, value] of Object.entries(data.product)) {
        if (key in DEFAULT_VALUES) {
          PREVIOUS_DATAREF.current[key as keyof typeof DEFAULT_VALUES] = value;
          setValue(key as keyof typeof DEFAULT_VALUES, value);
        }
      }
      return data;
    },
  });

  const editProduct = useMutation({
    mutationFn: async (data: ProductDetailsType) => {
      const response = await axiosInstance.patch(
        `${PRODUCT_URL}/edit-product/${id}`,
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

  const uploadProductThumbnail = useMutation({
    mutationFn: async (data: File) => {
      const thumbnail = new FormData();
      thumbnail.set("project-thumbnail", data);

      const response = await axios.post(
        `${PRODUCT_URL}/upload-thumbnail`,
        thumbnail,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("session_token")}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (data) => {
            console.log(data);
          },
        }
      );
      return response.data;
    },
    onSuccess: ({ data }) => {
      setValue("product_thumbnail", data.secure_url);
    },
    onError: () => {
      setPreviewProductThumbnail(null);
    },
  });

  const values = watch();
  const isChanged = useMemo(() => {
    return JSON.stringify(values) === JSON.stringify(getValues());
  }, [getValues, values]);
  function handleUploadProductThumbnail(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const reader = new FileReader();
    if (!file) return "No File attach";
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === "string") {
        setPreviewProductThumbnail(e.target?.result);
        uploadProductThumbnail.mutate(file);
      }
    };
    reader.onerror = () => {
      toast.error("Something went wrong while uploading the file");
    };

    reader.readAsDataURL(file);
  }

  return (
    <div className="pt-3 bg-white/20 rounded-sm border border-zinc-800/15 p-2 w-full h-full relative">
      <AnimatePresence mode="wait">
        {" "}
        {isOpenAddCategoryForm && (
          <AddCategoryForm
            allCategories={productDetails.data?.categories ?? []}
            axiosInstance={axiosInstance}
          />
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {selectedCategoryToEdit && (
          <EditCategoryForm
            selectedCategoryToEdit={selectedCategoryToEdit}
            setSelectedCategoryToEdit={setSelectedCategoryToEdit}
            allCategories={productDetails.data?.categories ?? []}
            axiosInstance={axiosInstance}
          />
        )}
      </AnimatePresence>
      <form
        onSubmit={handleSubmit((data: ProductDetailsType) => {
          editProduct.mutate(data);
        })}
        className=" flex flex-col h-full w-full"
      >
        <div className="flex flex-col space-y-1.5 w-full">
          <div className="block">
            <h1 className="text-primary text-sm poppins-semibold">
              Select Product Category
            </h1>
            {errors.product_category_id ? (
              <span className="text-red-500 text-[0.7rem]">
                {errors.product_category_id.message}
              </span>
            ) : (
              <span className="text-slate-400 text-[0.7rem]">
                Select only one <span className="text-red-500">*</span>
              </span>
            )}
          </div>
          <div className="pb-1 thin-scrollbar w-full">
            {productDetails.isLoading || !productDetails.data ? (
              <BoxesLoading totalBoxes={3} />
            ) : (
              <div className="flex gap-1.5 overflow-x-auto items-center w-full">
                {productDetails?.data?.categories.map((name, i) => (
                  <button
                    key={i}
                    onClick={() => setValue("product_category_id", name.id)}
                    type="button"
                    className={` custom-border rounded-md p-3  min-h-10 flex items-center group justify-center basis-[50%] lg:basis-[30%] xl:basis-[20%] flex-shrink-0 text-sm relative ${
                      watch("product_category_id") === name.id
                        ? "border-primary text-primary bg-primary/15"
                        : "text-secondary/75"
                    }`}
                  >
                    <span>{name.category_name}</span>
                    <div className="group-hover:flex hidden absolute gap-2 items-center right-2 ">
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategoryToEdit(name.category_name);
                        }}
                        className="text-xl"
                      >
                        <IoCreate />
                      </span>
                      {watch("product_category_id") !== name.id && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setCategoryToRemove(name.category_name);
                          }}
                          className="text-xl"
                        >
                          <IoTrash />
                        </span>
                      )}
                    </div>
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
        <div className="flex flex-col gap-2 flex-grow">
          <h1 className="text-primary text-sm poppins-semibold">
            Product Details
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 py-2 flex-grow lg:h-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 justify-center overflow-y-auto pr-2">
              <InputBox
                register={register}
                tabIndex={1}
                id="product_name"
                name="product_name"
                label="Product Name"
                type="text"
                disabled={productDetails.isLoading}
                placeholder="Enter Product Name"
                errorMessage={errors.product_name?.message}
                isRequired
              />

              <InputBox
                register={register}
                tabIndex={2}
                id="barcode"
                name="barcode"
                label="Barcode"
                type="text"
                disabled={productDetails.isLoading}
                placeholder="Enter Product Barcode"
                errorMessage={errors.barcode?.message}
                isRequired
              />
              <InputBox
                register={register}
                tabIndex={4}
                id="sku"
                name="sku"
                label="Product Sku"
                type="text"
                placeholder="Enter Product Sku"
                errorMessage={errors.sku?.message}
                isRequired
              />
              <InputBox
                register={register}
                tabIndex={4}
                id="price"
                name="price"
                label="Product Price"
                type="decimal"
                placeholder="₱ 1.00"
                errorMessage={errors.price?.message}
                isRequired
              />
              <InputBox
                register={register}
                tabIndex={4}
                id="discount_rate"
                name="discount_rate"
                label="Discount Rate (%)"
                type="number"
                placeholder="Enter Discount Rate"
                errorMessage={errors.discount_rate?.message}
                isRequired
              />
              <InputBox
                register={register}
                tabIndex={5}
                id="tax_rate"
                name="tax_rate"
                label="Tax Rate (%)"
                type="number"
                placeholder="Enter Tax Rate"
                errorMessage={errors.tax_rate?.message}
                isRequired
              />
              <div className="col-span-2">
                <InputBox
                  register={register}
                  tabIndex={6}
                  id="manufacturer"
                  name="manufacturer"
                  label="Manufacturer"
                  type="text"
                  placeholder="Enter Product Manufacturer"
                  errorMessage={errors.manufacturer?.message}
                />
              </div>

              <Button
                type="submit"
                disabled={editProduct.isPending}
                isLoading={editProduct.isPending}
                label="Upload Product"
                labelWhileLoading="Uploading..."
                className="col-span-2 text-[0.8rem] disabled"
                spinnerClassName="border-white border-t-transparent border"
              />
            </div>
            <div className="flex flex-col justify-center w-full items-center h-full p-3">
              <input
                {...register("product_thumbnail")}
                onChange={handleUploadProductThumbnail}
                type="file"
                id="upload-thumbnail"
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
              />
              <PreviewProductThumbnail
                previewProductThumbnail={previewProductThumbnail}
                onClick={() => {
                  setPreviewProductThumbnail(null);
                  setValue("product_thumbnail", null);
                }}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;
