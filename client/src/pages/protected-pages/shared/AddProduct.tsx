import React, { useState, type ChangeEvent } from "react";
import InputBox from "../../../components/InputBox";
import { useForm } from "react-hook-form";
import { IoIosAddCircleOutline } from "react-icons/io";
import emptyThumbnail from "../../../assets/stickers/empty-product-thumbnail.svg";
import { toast } from "sonner";
import { productValidation } from "../../../validation/product.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaCircleXmark } from "react-icons/fa6";
import { CgArrowsExchange } from "react-icons/cg";
function AddProduct() {
  const {
    register,
    reset,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      product_name: "",
      barcode: "",
      product_category: "",
      price: 0,
      discount_rate: "",
      tax_rate: "",
      sku: "",
      stock: 0,
      product_image: null,
      manufacturer: "",
    },
    resolver: zodResolver(productValidation),
  });

  const [previewProductThumbnail, setPreviewProductThumbnail] = useState<
    string | null
  >(null);

  function uploadProductThumbnail(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const reader = new FileReader();
    if (!file) return "No File attach";
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === "string") {
        console.log(e.target.result);
        setPreviewProductThumbnail(e.target?.result);
        setValue("product_image", file);
      }
    };
    reader.onerror = () => {
      toast.error("Something went wrong while uploading the file");
    };

    reader.readAsDataURL(file);
  }
  return (
    <form
      onSubmit={handleSubmit()}
      className=" pt-3 bg-white/20 rounded-sm border border-zinc-800/15 p-2 flex flex-col h-full"
    >
      <div className="flex flex-col space-y-1.5">
        <div className="block">
          <h1 className="text-primary text-sm poppins-semibold">
            Select Product Category
          </h1>
          <span className="text-slate-400 text-[0.7rem]">
            Select only one <span className="text-red-500">*</span>
          </span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          <button
            type="button"
            className="custom-border rounded-md p-3 text-primary border border-primary bg-primary/10 min-h-10"
          >
            Bread
          </button>
          <button
            type="button"
            className="custom-border rounded-md p-3 text-secondary/55 min-h-10"
          >
            Vegetable
          </button>
          <button
            type="button"
            className="custom-border rounded-md p-3 text-secondary/55 min-h-10"
          >
            Fruit
          </button>
          <button
            type="button"
            className="custom-border rounded-md p-3 text-secondary/55 min-h-10"
          >
            Bundle
          </button>
          <button
            type="button"
            className="custom-border rounded-md p-3 text-primary min-h-10 flex items-center justify-center"
          >
            <IoIosAddCircleOutline />
          </button>
        </div>
      </div>
      <span className="w-full h-[1px] bg-zinc-800/25 my-4"></span>
      <div className="flex flex-col gap-2 flex-grow">
        <h1 className="text-primary text-sm poppins-semibold">
          Product Details
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 py-2 flex-grow h-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 justify-center overflow-y-auto pr-2">
            <InputBox
              register={register}
              tabIndex={1}
              id="product_name"
              name="product_name"
              label="Product Name"
              type="text"
              placeholder="Enter Product Name"
              errorMessage={errors.product_name?.message}
              required
            />

            <InputBox
              register={register}
              tabIndex={2}
              id="barcode"
              name="barcode"
              label="Barcode"
              type="text"
              placeholder="Enter Product Barcode"
              errorMessage={errors.barcode?.message}
              required
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
              required
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
              required
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
              required
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
              required
            />
            <InputBox
              register={register}
              tabIndex={6}
              id="stock"
              name="stock"
              label="Total Stock"
              type="number"
              placeholder="Enter Product Quantity"
              errorMessage={errors.stock?.message}
              required
            />
            <InputBox
              register={register}
              tabIndex={7}
              id="manufacturer"
              name="manufacturer"
              label="Manufacturer"
              type="text"
              placeholder="Enter Product Manufacturer"
              errorMessage={errors.manufacturer?.message}
            />

            <button className="col-span-full bg-primary py-1.5 px-2 text-zinc-100 text-sm rounded-sm custom-border">
              Upload New Product
            </button>
          </div>
          <div className="flex flex-col justify-center w-full items-center h-full p-3">
            <input
              {...register("product_image")}
              onChange={uploadProductThumbnail}
              type="file"
              id="upload-thumbnail"
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
            />
            {previewProductThumbnail === null ? (
              <div className="border-dotted border-2 border-zinc-300 bg-zinc-100 w-[80%] h-[200px] flex flex-col items-center justify-center space-y-2">
                <img src={emptyThumbnail} height={60} width={60} />
                <div className="block">
                  <h3 className="text-center text-zinc-400 text-[0.65rem]">
                    Want to add a product thumbnail?{" "}
                    <label
                      htmlFor="upload-thumbnail"
                      className="hover:text-primary underline-offset-2 underline decoration-zinc-400 hover:decoration-primary"
                    >
                      click here
                    </label>
                    .
                  </h3>
                  <h5 className="text-center text-zinc-400 text-[0.6rem]">
                    ( .jpg, .png, .jpeg )
                  </h5>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 items-center justify-center w-full">
                <div className="w-[60%] aspect-square relative bg-zinc-300 max-h-[230px] rounded-md flex items-center justify-center border border-zinc-300">
                  <img
                    src={previewProductThumbnail}
                    alt="product-thumbnail"
                    className="absolute inset-0 object-center w-full h-full object-cover rounded-md"
                  />
                  <button
                    onClick={() => {
                      setPreviewProductThumbnail(null);
                      setValue("product_image", null);
                    }}
                    type="button"
                    aria-label="Remove the attached Product Thumbnail"
                    className="absolute -top-2 -right-2 text-2xl text-primary z-[99] bg-white rounded-full"
                  >
                    {" "}
                    <FaCircleXmark />
                  </button>
                </div>
                <label
                  htmlFor="upload-thumbnail"
                  className="text-slate-200 bg-secondary custom-border py-2 px-4 rounded-sm flex space-x-1"
                >
                  <span className="text-lg">
                    <CgArrowsExchange />
                  </span>
                  <span className=" text-[0.8rem]">Change Thumbnail</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

export default AddProduct;
