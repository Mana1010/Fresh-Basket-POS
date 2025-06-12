import useAxiosInterceptor from "../../../../../../hooks/useAxiosInterceptor";
import { REPORT_URL } from "../../../../../../api/request-api";
import { formatToFormalNumber } from "../../../../../../utils/format-to-money";
import { useSuspenseQuery } from "@tanstack/react-query";
function LeastSellerProduct() {
  const axiosInstance = useAxiosInterceptor();
  const leastSellerProduct = useSuspenseQuery({
    queryKey: ["report-stats", "lesat-seller-product"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${REPORT_URL}/least-seller-product`
      );
      return response.data;
    },
  });
  console.log(leastSellerProduct);
  return (
    <div className="bg-zinc-100 w-full border border-zinc-300 rounded-md h-full p-2 space-y-2 relative">
      <div className="flex justify-between items-center">
        <h1 className={"text-[0.7rem] text-secondary poppins-semibold"}>
          Least Seller Product
        </h1>
        <span className="text-secondary text-[0.7rem] relative z-1">
          {formatToFormalNumber(leastSellerProduct.data?.stat.total_sold ?? 0)}{" "}
          sold
        </span>
      </div>
      <div className="flex flex-col space-y-1.5">
        <span className="text-secondary text-lg lg:text-xl relative z-1 poppins-bold">
          {leastSellerProduct.data?.stat.product_name ?? ""}
        </span>
        <span className="text-zinc-500 text-[0.7rem] relative z-1">
          {leastSellerProduct.data?.stat.sku ?? ""}
        </span>
      </div>
    </div>
  );
}

export default LeastSellerProduct;
