import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import InputBox from "../../../../../components/InputBox";
import {
  customerInfoValidation,
  type CustomerInfoTypes,
} from "../../../../../validation/order.validation";
import { formatToPhpMoney } from "../../../../../utils/format-to-money";
import { IoCash } from "react-icons/io5";
import { useProductStore } from "../../../../../store/product.store";
import { calculateTotalPrice } from "../../../../../utils/total-price";
import { useMemo } from "react";
import { useModalStore } from "../../../../../store/modal.store";
import { useMutation } from "@tanstack/react-query";
import useAxiosInterceptor from "../../../../../hooks/useAxiosInterceptor";
import { INVOICE_URL } from "../../../../../api/request-api";
import { useAuthStore } from "../../../../../store/auth.store";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import Button from "../../../../../components/Button";
function CustomerInformation() {
  const { orderProducts } = useProductStore();
  const { setCurrentPage, setInvoiceId } = useModalStore();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const axiosInstance = useAxiosInterceptor();

  const {
    register,
    reset,
    watch,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      customer_paid: "0",
    },
    resolver: zodResolver(customerInfoValidation),
  });
  const grand_total = useMemo(() => {
    return orderProducts.reduce(
      (
        total,
        { price, discount_rate = 0, tax_rate = 0, inventories_sum_stock }
      ) => {
        const quantity = Number(inventories_sum_stock ?? 0);
        const basePrice = Number(price ?? 0) * quantity;
        const calculation = calculateTotalPrice({
          orig_price: String(basePrice),
          discount_rate,
          tax_rate,
        });
        return total + calculation;
      },
      0
    );
  }, [orderProducts]);

  const printReceipt = useMutation({
    mutationFn: async (data: CustomerInfoTypes) => {
      const response = await axiosInstance.post(
        `${INVOICE_URL}/print-receipt`,
        {
          orders: orderProducts,
          customer_name: data.name,
          customer_email: data.email,
          customer_paid: data.customer_paid,
          cashier_id: user?.id,
        }
      );
      return response.data;
    },
    onSuccess: ({ message, invoice_id }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["products", "pos_page"] });
      setInvoiceId(invoice_id);
      reset();
      setCurrentPage("rate_us");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data.message);
    },
  });
  return (
    <div className="w-full h-full basis-[40%] border border-zinc-200 p-2 flex flex-col shrink-0 rounded-sm relative">
      <form
        onSubmit={handleSubmit((data) => {
          console.log(grand_total);
          if (Number(data.customer_paid) < grand_total) {
            setError("customer_paid", {
              message: `The customer is required to pay ${formatToPhpMoney(
                String(grand_total)
              )}.`,
            });
            return;
          }
          printReceipt.mutate(data);
        })}
        className="flex flex-col pt-2 px-1.5 space-y-2 h-full"
      >
        <div className="w-full basis-[30%] border border-zinc-200 p-2 flex shrink-0 rounded-sm gap-1.5 flex-col">
          <h1 className="text-[0.7rem] text-secondary poppins-extrabold text-start">
            Payment Summary
          </h1>
          <div className="flex flex-col gap-1.5 flex-grow justify-center items-center">
            <div className="flex justify-between items-center w-full">
              <h4 className="text-secondary text-[0.75rem] poppins-semibold">
                Total Amount
              </h4>
              <span className="text-primary text-[0.8rem] poppins-extrabold">
                {formatToPhpMoney(String(grand_total))}
              </span>
            </div>
            <div className="border-primary/70 border-b-2 border-dotted w-full" />
            <div className="flex justify-between items-center w-full">
              <h4 className="text-secondary text-[0.65rem] poppins-bold">
                Total Amount Paid
              </h4>
              <span className="text-secondary text-[0.7rem] poppins-extrabold">
                {formatToPhpMoney(String(watch("customer_paid")))}
              </span>
            </div>
            <div className="flex justify-between items-center w-full">
              <h4 className="text-secondary text-[0.65rem] poppins-bold">
                Change Due
              </h4>
              <span className="text-secondary text-[0.7rem] poppins-extrabold">
                {Number(watch("customer_paid")) > grand_total
                  ? formatToPhpMoney(
                      String(Number(watch("customer_paid")) - grand_total)
                    )
                  : formatToPhpMoney("0")}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full h-full basis-[38%] border border-zinc-200 p-2 flex flex-col shrink-0 rounded-sm gap-2">
          <h1 className="text-[0.7rem] text-secondary poppins-extrabold">
            Customer Information
          </h1>
          <InputBox
            tabIndex={1}
            register={register}
            name="name"
            id="name"
            disabled={false}
            type="text"
            label="Customer Name"
            placeholder="Enter Customer Name"
            errorMessage={errors.name?.message}
          />
          <InputBox
            tabIndex={2}
            register={register}
            name="email"
            id="email"
            disabled={false}
            type="text"
            label="Customer Email"
            isRequired
            placeholder="Enter Customer Email"
            errorMessage={errors.email?.message}
          />
        </div>
        <div className="w-full h-full flex-grow border border-zinc-200 p-2 flex flex-col rounded-sm gap-2">
          <h1 className="text-[0.7rem] text-secondary poppins-extrabold">
            Amount Tendered
          </h1>
          <div className="flex items-center justify-between space-x-1 w-full border border-zinc-200">
            <label
              htmlFor="customer_paid"
              className="p-2 bg-primary text-white text-lg"
            >
              <IoCash />
            </label>
            <input
              {...register("customer_paid")}
              type="number"
              id="customer_paid"
              placeholder="Enter Amount Tendered"
              className=" text-[0.8rem] outline-none py-2 px-1.5 bg-transparent text-secondary flex-grow poppins-bold"
            />
          </div>
          {errors.customer_paid && (
            <p className="text-[0.65rem] text-red-500">
              {errors.customer_paid.message}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 w-full">
          <button
            type="button"
            onClick={() => setCurrentPage("pos_page")}
            className="self-end px-2 py-1.5 text-sm bg-primary text-white rounded-sm w-1/2 cursor-pointer"
          >
            Back
          </button>
          <Button
            label="Print Receipt"
            labelWhileLoading="Processing..."
            spinnerClassName="border border-white size-4.5 border-t-transparent"
            disabled={printReceipt.isPending}
            isLoading={printReceipt.isPending}
            type="submit"
            className="self-end px-2 py-1.5 text-sm bg-primary text-white rounded-sm w-1/2 cursor-pointer"
          />
        </div>
      </form>
    </div>
  );
}

export default CustomerInformation;
