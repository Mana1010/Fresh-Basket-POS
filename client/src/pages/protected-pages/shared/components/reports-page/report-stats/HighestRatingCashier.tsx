import useAxiosInterceptor from "../../../../../../hooks/useAxiosInterceptor";
import { REPORT_URL } from "../../../../../../api/request-api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { IoStar } from "react-icons/io5";
function HighestRatingCashier() {
  const axiosInstance = useAxiosInterceptor();
  const highestRatingCashier = useSuspenseQuery({
    queryKey: ["report-stats", "highest-rating-cashier"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${REPORT_URL}/highest-rating-cashier`
      );
      return response.data;
    },
  });

  console.log(highestRatingCashier.data);
  return (
    <div className="bg-zinc-100 w-full border border-zinc-300 rounded-md h-full p-2 space-y-2 relative">
      <h1 className={"text-[0.7rem] text-secondary poppins-semibold"}>
        Top 3 Highest Rating Cashier
      </h1>

      <div className="flex flex-col space-y-1.5">
        {[...(highestRatingCashier.data.stats ?? [])].map((rating) => (
          <div className="border-zinc-300 py-1.5 px-2 w-full rounded-sm flex items-center justify-between border">
            <span className="text-secondary text-lg relative z-1 poppins-bold">
              {rating.cashier_name}
            </span>
            <div className="flex items-center space-x-1.5">
              <span className="text-zinc-500 text-md relative z-1">
                {rating.total_stars}
              </span>
              <span className="text-yellow-400 text-lg">
                <IoStar />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HighestRatingCashier;
