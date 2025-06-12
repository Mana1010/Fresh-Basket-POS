import { useEffect } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";
import useAxiosInterceptor from "../../../hooks/useAxiosInterceptor";

import { IoCube } from "react-icons/io5";
import TableLoading from "./components/loading/TableLoading";
import { USER_URL } from "../../../api/request-api";
import { useInView } from "react-intersection-observer";
import type { CashierMetricsType } from "../../../types/user.types";
import { capitalizeFirstLetter } from "../../../utils/capitalize-first-letter";
import {
  formatToFormalNumber,
  formatToPhpMoney,
} from "../../../utils/format-to-money";

function CashierMetrics() {
  const { ref, inView } = useInView();
  const axiosInterceptor = useAxiosInterceptor();

  const { data, hasNextPage, isLoading, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["cashier-metrics"],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await axiosInterceptor.get(
          `${USER_URL}/cashier-metrics?limit=10&page=${pageParam}`
        );
        return response.data.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        // Only return the next page number, not the entire response
        // Check if there's more data based on your API response structure
        if (lastPage.from === null || lastPage.data.length === 0) {
          return undefined; // No more pages
        }
        // Return the next page number
        return lastPage.current_page + 1;
      },
    });

  // Get all products from all pages
  const allCashier =
    data?.pages.flatMap((page) => page.data) || ([] as CashierMetricsType[]);

  // Auto-fetch next page when scrolling into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  console.log(allCashier);
  return (
    <div className="lg:h-full w-auto lg:w-full h-auto overflow-x-auto">
      <div className="w-auto lg:w-full overflow-x-auto overflow-y-auto thin-scrollbar pr-1 flex flex-col h-full p-2">
        <table className="w-full table-fixed">
          <thead className="product-thead">
            <tr className="divide-x divide-zinc-300/70">
              <td className="relative pt-1.5">Employee Name</td>
              <td className="relative pt-1.5">Status</td>
              <td className="relative pt-1.5">Total Sold Items</td>
              <td className="relative pt-1.5">Total Sales</td>
              <td className="relative pt-1.5">Total Ratings</td>
            </tr>
          </thead>
          <tbody className="product-tbody">
            {allCashier.map((cashier: CashierMetricsType) => (
              <tr
                key={cashier.id} // Better key using product ID
                className={`border-b border-zinc-200 hover:bg-secondary/85 group transition-opacity duration-75 ease-in-out `}
              >
                <td className="p-1.5">{cashier.employer_name}</td>
                <td className="p-1.5">
                  <span
                    className={`px-3 py-0.5 border ${
                      cashier.status === "active"
                        ? "bg-green-300/35 border-green-400"
                        : "bg-red-300/35 border-red-400"
                    } rounded-3xl`}
                  >
                    {capitalizeFirstLetter(cashier.status)}
                  </span>
                </td>
                <td className="p-1.5">
                  {formatToFormalNumber(cashier.total_quantity)}
                </td>
                <td className="p-1.5">
                  {formatToPhpMoney(cashier.total_sales)}
                </td>
                <td className="p-1.5">
                  {formatToFormalNumber(cashier.total_ratings)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && (
          <TableLoading
            totalBoxes={30}
            boxesClassName="min-h-10"
            className="grid-cols-10"
          />
        )}
        {allCashier.length === 0 && !isLoading && (
          <div className="flex-grow justify-center items-center flex-col w-full flex gap-2">
            <span className="text-primary text-5xl">
              <IoCube />
            </span>
            <span className="text-zinc-800/60 text-xl poppins-semibold">
              {" "}
              No products to display
            </span>
          </div>
        )}
        {/* Loading indicator */}
        {hasNextPage && (
          <div ref={ref} className="text-center py-4">
            {isFetchingNextPage ? "Loading more..." : "Load more data..."}
          </div>
        )}

        {/* End of results indicator */}
        {!hasNextPage && !isLoading && allCashier.length > 5 && (
          <div className="text-center text-secondary text-[0.8rem] pt-2">
            End Result
          </div>
        )}
      </div>
    </div>
  );
}

export default CashierMetrics;
