import React from "react";
import InputBox from "../../../../../components/InputBox";
import { useForm } from "react-hook-form";
import { productCategoryValidation } from "../../../../../validation/product.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaCircleXmark } from "react-icons/fa6";
import { useModalStore } from "../../../../../store/modal.store";
type AddCategoryFormProps = {
  allCategories: string[];
};
function AddCategoryForm({ allCategories }: AddCategoryFormProps) {
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category_name: "",
    },
    resolver: zodResolver(productCategoryValidation(allCategories)),
  });
  const { toggleCategoryForm } = useModalStore();
  return (
    <form
      onSubmit={handleSubmit(() => {
        console.log("Submit");
      })}
      className="custom-border rounded-sm flex flex-col space-y-1 py-2.5 px-3 absolute lg:right-0 lg:top-0 bg-white min-w-[300px]"
    >
      <button
        onClick={() => toggleCategoryForm(false)}
        type="button"
        aria-label="Remove the add category form modal"
        className="absolute -top-2 -right-2 text-lg text-primary z-1 bg-white rounded-full cursor-pointer"
      >
        {" "}
        <FaCircleXmark />
      </button>
      <InputBox
        tabIndex={1}
        register={register}
        id="category_name"
        type="text"
        name="category_name"
        placeholder="Enter New Product Category"
        isRequired
        errorMessage={errors.category_name?.message}
        label="New Product Category"
        className="py-1.5 text-[0.7rem]"
      />
      <button
        type="submit"
        className="col-span-full bg-primary py-1.5 px-2 text-zinc-100 text-[0.7rem] rounded-sm custom-border"
      >
        Add New Category
      </button>
    </form>
  );
}

export default AddCategoryForm;
