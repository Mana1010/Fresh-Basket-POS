import InputBox from "../../../../../components/InputBox";
import { useForm } from "react-hook-form";
import { productCategoryValidation } from "../../../../../validation/product.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaCircleXmark } from "react-icons/fa6";
import { addCategoryModalVariants } from "../../../../../animation/modal.animation";
import { motion } from "framer-motion";
import type { AxiosError, AxiosInstance } from "axios";
import { PRODUCT_URL } from "../../../../../api/request-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Button from "../../../../../components/Button";
import type { CategoryType } from "../../../../../types/product.types";
import { useEffect } from "react";
type AddCategoryFormProps = {
  allCategories: CategoryType[];
  selectedCategoryToEdit: string;
  setSelectedCategoryToEdit: (category: string) => void;
  axiosInstance: AxiosInstance;
};
function EditCategoryForm({
  allCategories,
  selectedCategoryToEdit,
  setSelectedCategoryToEdit,
  axiosInstance,
}: AddCategoryFormProps) {
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category_name: "",
    },
    resolver: zodResolver(productCategoryValidation(allCategories)),
  });
  const queryClient = useQueryClient();
  const editCategory = useMutation({
    mutationFn: async (data: { category_name: string }) => {
      const response = await axiosInstance.patch(
        `${PRODUCT_URL}/edit-category/${selectedCategoryToEdit}`,
        data
      );
      return response.data;
    },
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["product-details"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["all-product-categories"] });
      reset();
      setSelectedCategoryToEdit("");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      if (err.response?.status === 422) {
        toast.error("Some fields are invalid, please check your input");
      }
      toast.error(err.response?.data.message || "Something went wrong");
    },
  });
  useEffect(() => {
    setValue("category_name", selectedCategoryToEdit);
  }, [selectedCategoryToEdit, setValue]);
  return (
    <motion.form
      variants={addCategoryModalVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onSubmit={handleSubmit((data) => {
        editCategory.mutate(data);
      })}
      className="custom-border z-10 rounded-sm flex flex-col space-y-1 py-2.5 px-3 absolute lg:right-0 lg:top-0 bg-white min-w-[300px] origin-top-right"
    >
      <button
        onClick={() => setSelectedCategoryToEdit("")}
        type="button"
        aria-label="Remove the edit category form modal"
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
        label="Update Product Category"
        className="py-2 text-[0.7rem]"
      />
      <Button
        label="Update New Category"
        labelWhileLoading="Updating..."
        disabled={editCategory.isPending}
        type="submit"
        isLoading={editCategory.isPending}
        className="text-[0.7rem] hover:bg-primary/95"
        spinnerClassName=" size-3 border-zinc-200 border-t-transparent"
      />
    </motion.form>
  );
}

export default EditCategoryForm;
