import { useState } from "react";
import Button from "../../../../../components/Button";
import { useModalStore } from "../../../../../store/modal.store";
import { IoClose } from "react-icons/io5";
import { useMutation } from "@tanstack/react-query";
import useAxiosInterceptor from "../../../../../hooks/useAxiosInterceptor";
import { PRODUCT_URL } from "../../../../../api/request-api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
function RemoveCategoryConfirmation() {
  const [confirmation, setConfirmation] = useState("");
  const { categoryToRemove, setCategoryToRemove } = useModalStore();
  const axiosInstance = useAxiosInterceptor();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.delete(
        `${PRODUCT_URL}/delete-category/${categoryToRemove}`
      );
      return response.data;
    },
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["product-details"] });
      queryClient.invalidateQueries({ queryKey: ["all-product-categories"] });
      setCategoryToRemove("");
      setConfirmation("");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data.message);
    },
  });
  return (
    <div
      onClick={() => setCategoryToRemove(null)}
      className="bg-black/35 flex absolute inset-0 items-center justify-center z-[999] p-3"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="bg-white p-3 flex flex-col gap-5 border-zinc-300 rounded-sm relative"
      >
        <button
          onClick={() => setCategoryToRemove(null)}
          type="button"
          className="absolute -top-2 -right-1 rounded-full bg-secondary p-1.5 text-white"
        >
          <IoClose />
        </button>
        <div className="flex space-y-1.5 flex-col">
          <h1 className="text-secondary poppins-semibold text-lg">
            Confirm Deletion
          </h1>
          <p className="text-[0.75rem] text-zinc-700/80">
            Deleting this category will move all associated products to{" "}
            <span className="text-primary">“Uncategorized”</span>.
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex space-y-1 flex-col"
        >
          <label
            htmlFor="confirmation"
            className="text-secondary text-[0.8rem]"
          >
            To confirm, type “
            <span className="text-primary">{`Category/${categoryToRemove}`}</span>{" "}
            ”.
          </label>
          <input
            tabIndex={1}
            onChange={(e) => setConfirmation(e.target.value)}
            name="confirmation"
            id="confirmation"
            type="text"
            className="w-full border border-zinc-300 py-1.5 text-primary px-3 text-sm poppins-bold outline-primary"
          />

          <Button
            disabled={
              confirmation !== `Category/${categoryToRemove}` || isPending
            }
            label="Delete"
            isLoading={isPending}
            labelWhileLoading="Deleting..."
            spinnerClassName="border-zinc-100 size-4 border-t-transparent"
            className="py-2 text-sm px-5 bg-primary text-white disabled:text-zinc-200 disabled:bg-secondary/75 disabled:cursor-default"
          />
        </form>
      </div>
    </div>
  );
}

export default RemoveCategoryConfirmation;
