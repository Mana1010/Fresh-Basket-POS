import { useState } from "react";
import Button from "../../../../../components/Button";
import { useMutation } from "@tanstack/react-query";
import useAxiosInterceptor from "../../../../../hooks/useAxiosInterceptor";
import { INVOICE_URL } from "../../../../../api/request-api";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { useModalStore } from "../../../../../store/modal.store";
import starRating from "../../../../../assets/star-rating.png";
import { GiRoundStar } from "react-icons/gi";
function Rating() {
  const { setCurrentPage, invoiceId, setInvoiceId } = useModalStore();

  const axiosInstance = useAxiosInterceptor();
  const [rating, setRating] = useState(0);
  const rateMe = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(`${INVOICE_URL}/rate`, {
        rating,
        invoice_id: invoiceId,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Thank you for your rating!");
      setCurrentPage("pos_page");
      setInvoiceId(null);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data.message);
    },
  });
  return (
    <div className="w-full h-full basis-[40%] border border-zinc-200 p-2 flex flex-col shrink-0 rounded-sm relative justify-center items-center">
      <div className="flex flex-col gap-2 items-center justify-center w-full bg-white">
        <img src={starRating} alt="Star rating" width={100} height={100} />
        <h3 className="text-primary text-2xl poppins-semibold">
          Tell us what you think
        </h3>
        <p className="text-[0.75rem] text-zinc-500 text-center">
          Please take a moment to rate the service you received. Your input
          helps us improve and serve you better.
        </p>
        <div className="flex items-center gap-2 ">
          {new Array(5).fill(0).map((_, i) => (
            <button
              key={i}
              onClick={() => setRating(i + 1)}
              className={`${
                rating > i ? "text-yellow-500" : "text-secondary/70"
              } text-4xl`}
            >
              <GiRoundStar />
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 items-center justify-end flex-col w-full lg:w-2/3 mt-3">
          <Button
            onClick={() => rateMe.mutate()}
            label="Rate"
            isLoading={rateMe.isPending}
            labelWhileLoading="Rating..."
            spinnerClassName="size-5"
            disabled={rating <= 0 || rateMe.isPending}
            className="py-1.5 disabled:bg-zinc-500/90 disabled:text-zinc-200 text-white disabled:cursor-default"
          />
          <Button
            onClick={() => {
              setCurrentPage("pos_page");
            }}
            label="I don't want to rate"
            labelWhileLoading=""
            disabled={rateMe.isPending}
            className="py-1.5 bg-secondary text-zinc-200 text-sm"
          />
        </div>
      </div>
    </div>
  );
}

export default Rating;
