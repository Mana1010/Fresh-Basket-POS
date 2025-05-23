import React from "react";
import InputBox from "../../../components/InputBox";
import { useForm } from "react-hook-form";
import { IoIosAddCircleOutline } from "react-icons/io";
function AddProduct() {
  const { register, reset, handleSubmit } = useForm({
    defaultValues: {
      product_name: "",
      barcode: "",
      product_category: "",
      price: 0,
      sku: "",
      stock: 0,
      product_image: null,
      manufacturer: "",
    },
  });
  return (
    <div className="flex flex-col w-full gap-2 h-full">
      <h1 className="text-secondary text-md poppins-semibold">Add Product</h1>
      <form className=" pt-3 bg-white/20 rounded-sm border border-zinc-800/15 p-2 flex flex-col">
        <div className="flex flex-col space-y-1.5">
          <h1 className="text-primary text-sm poppins-semibold">
            Select Product Category
          </h1>
          <div className="grid grid-cols-5 gap-2">
            <button
              type="button"
              className="custom-border rounded-md p-3 text-primary border border-primary bg-primary/10 min-h-16"
            >
              Bread
            </button>
            <button
              type="button"
              className="custom-border rounded-md p-3 text-primary min-h-20"
            >
              Fruit
            </button>
            <button
              type="button"
              className="custom-border rounded-md p-3 text-primary min-h-20"
            >
              Vegetable
            </button>
            <button
              type="button"
              className="custom-border rounded-md p-3 text-primary min-h-20"
            >
              Bundle
            </button>
            <button
              type="button"
              className="custom-border rounded-md p-3 text-primary min-h-20 flex items-center justify-center"
            >
              <IoIosAddCircleOutline />
            </button>
          </div>
        </div>
        <span className="w-full h-[1px] bg-zinc-800/25 my-2"></span>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 pt-2">
          <InputBox
            register={register}
            tabIndex={1}
            id="product_name"
            name="product_name"
            label="Product Name"
            type="text"
            placeholder="Enter Product Name"
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
            required
          />
          <InputBox
            register={register}
            tabIndex={4}
            id="price"
            name="price"
            label="Product Price"
            type="decimal"
            placeholder="₱ 0.0"
            required
          />

          <InputBox
            register={register}
            tabIndex={5}
            id="product_name"
            name="product_name"
            label="Total Stock"
            type="number"
            placeholder="Enter Product Quantity"
            required
          />
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
