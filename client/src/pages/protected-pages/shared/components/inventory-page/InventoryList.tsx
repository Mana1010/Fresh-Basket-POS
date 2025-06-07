import { useEffect } from "react";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { INVENTORY_URL } from "../../../../../api/request-api";
import useAxiosInterceptor from "../../../../../hooks/useAxiosInterceptor";
import { useInView } from "react-intersection-observer";
import type { FullInventoryDetails } from "../../../../../types/inventory.types";
import { dateFormat } from "../../../../../helper/dateFormat";
import { formatFinancialImpactNumber } from "../../../../../helper/formatFinancialImpactNumber";
import { formatToFormalNumber } from "../../../../../utils/format-to-money";
import {
  IoCaretDown,
  IoCaretUp,
  IoClipboard,
  IoTrendingDown,
  IoTrendingUp,
} from "react-icons/io5";
import { LuList } from "react-icons/lu";
import { useModalStore } from "../../../../../store/modal.store";

type InventoryListProps = {
  debouncedSearchResult: string;
};
function InventoryList({ debouncedSearchResult }: InventoryListProps) {
  const { ref, inView } = useInView();
  const axiosInterceptor = useAxiosInterceptor();
  const { toggleInventoryDetails, setInventoryDetails } = useModalStore();
  const { data, hasNextPage, isLoading, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ["inventories", debouncedSearchResult],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await axiosInterceptor.get(
          `${INVENTORY_URL}/list?limit=10&page=${pageParam}&search=${debouncedSearchResult}`
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
  const allInventories =
    data?.pages.flatMap((page) => page.data) || ([] as FullInventoryDetails[]);

  // Auto-fetch next page when scrolling into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (allInventories.length === 0) {
    return (
      <div className="flex-grow justify-center items-center flex-col w-full flex gap-2">
        <span className="text-primary text-5xl">
          <IoClipboard />
        </span>
        <span className="text-zinc-800/60 text-xl poppins-semibold">
          {" "}
          No inventory available
        </span>
      </div>
    );
  }
  return (
    <div className="flex-grow w-auto lg:w-full h-auto lg:h-1 overflow-x-auto">
      <div className="w-full h-full overflow-y-auto thin-scrollbar pr-1">
        <table className="w-full">
          <thead className="product-thead">
            <tr className="divide-x divide-zinc-300/70">
              <td>Product Name</td>
              <td>SKU</td>
              <td>Quantity</td>
              <td>Type</td>
              <td>Financial Impact</td>
              <td>Reason</td>
              <td>Date</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody className="product-tbody">
            {allInventories.map((inventory: FullInventoryDetails) => (
              <tr
                key={`${inventory.id}`} // Better key using product ID
                className="border-b border-zinc-200 hover:bg-secondary/85 group transition-opacity duration-75 ease-in-out"
              >
                <td>{inventory.product_name}</td>
                <td>{inventory.sku}</td>
                <td>
                  <div
                    className={`px-3 py-0.5 rounded-3xl flex items-center justify-center space-x-1.5 `}
                  >
                    <span
                      className={`${
                        Number(inventory.stock) > 0
                          ? "text-green-500"
                          : "text-red-500"
                      } text-md`}
                    >
                      {Number(inventory.stock) > 0 ? (
                        <IoCaretUp />
                      ) : (
                        <IoCaretDown />
                      )}
                    </span>
                    <span>
                      {" "}
                      {formatToFormalNumber(inventory.stock.toString())}
                    </span>
                  </div>
                </td>

                <td>{inventory.type}</td>
                <td>
                  <div
                    className={`px-3 py-0.5 rounded-3xl flex items-center justify-center space-x-1.5  `}
                  >
                    <span
                      className={`${
                        inventory.reason === "customer_sale" &&
                        inventory.type === "out"
                          ? "text-green-500"
                          : inventory.reason === "supplier_delivery" &&
                            inventory.type === "in"
                          ? "text-yellow-500"
                          : "text-red-500"
                      } text-xl`}
                    >
                      {inventory.reason === "customer_sale" &&
                      inventory.type === "out" ? (
                        <IoTrendingUp />
                      ) : (
                        <IoTrendingDown />
                      )}
                    </span>
                    <span>
                      {formatFinancialImpactNumber(
                        inventory.financial_impact,
                        inventory.reason
                      )}
                    </span>
                  </div>
                </td>
                <td>
                  {inventory.reason === "supplier_delivery"
                    ? "Supplier Delivery"
                    : inventory.reason === "damaged_or_spoiled"
                    ? "Damaged/Spoiled"
                    : "Sold in Customer"}
                </td>
                <td>{dateFormat(new Date(inventory.created_at))}</td>
                <td className="flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setInventoryDetails(inventory);
                      toggleInventoryDetails();
                    }}
                    className="bg-secondary/90 cursor-pointer py-1.5 px-3 rounded-sm custom-border text-zinc-200 text-[0.7rem] flex space-x-1.5 items-center justify-center"
                  >
                    <span>
                      <LuList />
                    </span>
                    <span>View Details</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Loading indicator */}
        {hasNextPage && (
          <div ref={ref} className="text-center py-4">
            {isFetchingNextPage ? "Loading more..." : "Load more data..."}
          </div>
        )}

        {/* End of results indicator */}
        {!hasNextPage && !isLoading && allInventories.length > 5 && (
          <div className="text-center text-secondary text-[0.8rem] pt-2">
            End Result
          </div>
        )}
      </div>
    </div>
  );
}

export default InventoryList;
