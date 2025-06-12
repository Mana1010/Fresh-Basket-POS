import useAxiosInterceptor from "../../../../../../hooks/useAxiosInterceptor";
import { REPORT_URL } from "../../../../../../api/request-api";
import { formatToFormalNumber } from "../../../../../../utils/format-to-money";
import { useSuspenseQuery } from "@tanstack/react-query";
function BestSellerProduct() {
  const axiosInstance = useAxiosInterceptor();
  const bestSellerProduct = useSuspenseQuery({
    queryKey: ["report-stats", "best-seller-product"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${REPORT_URL}/best-seller-product`
      );
      return response.data;
    },
  });
  return (
    <div className="bg-zinc-100 w-full border border-zinc-300 rounded-md h-full p-2 space-y-2 relative">
      <div className="flex justify-between items-center">
        <h1 className={"text-[0.7rem] text-secondary poppins-semibold"}>
          Best Seller Product
        </h1>
        <span className="text-secondary text-[0.7rem] relative z-1">
          {formatToFormalNumber(bestSellerProduct.data?.stat.total_sold ?? 0)}{" "}
          sold
        </span>
      </div>
      <div className="flex flex-col space-y-1.5">
        <span className="text-secondary text-lg lg:text-xl relative z-1 poppins-bold">
          {bestSellerProduct.data?.stat.product_name ?? ""}
        </span>
        <span className="text-zinc-500 text-[0.7rem] relative z-1">
          {bestSellerProduct.data?.stat.sku ?? ""}
        </span>
      </div>
    </div>
  );
}

export default BestSellerProduct;
