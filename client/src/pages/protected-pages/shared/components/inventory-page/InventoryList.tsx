import { useEffect, useState } from "react";
import SelectBox from "../../../components/SelectBox";
import { AnimatePresence } from "framer-motion";
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { INVENTORY_URL } from "../../../../../api/request-api";
import useAxiosInterceptor from "../../../../../hooks/useAxiosInterceptor";
import { useInView } from "react-intersection-observer";
import type { FullInventoryDetails } from "../../../../../types/inventory.types";
import { dateFormat } from "../../../../../helper/dateFormat";
import { formatFinancialImpactNumber } from "../../../../../helper/formatFinancialImpactNumber";
import {
  formatToFormalNumber,
  formatToPhpMoney,
} from "../../../../../utils/format-to-money";
import { IoAdd, IoRemove, IoTrendingDown, IoTrendingUp } from "react-icons/io5";

function InventoryList() {
  const [openFilterProduct, setOpenFilterProduct] = useState(false);
  const [openFilterPrice, setOpenFilterPrice] = useState(false);
  const { ref, inView } = useInView();
  const axiosInterceptor = useAxiosInterceptor();

  const { data, hasNextPage, isLoading, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ["inventories"],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await axiosInterceptor.get(
          `${INVENTORY_URL}/list?limit=10&page=${pageParam}`
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
      staleTime: 5 * 60 * 1000,
      refetchOnMount: false, // Don't refetch if data is still fresh
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

  console.log(allInventories);
  return (
    <div className="flex-grow w-full h-1">
      <div className="w-full h-full overflow-y-auto thin-scrollbar pr-1">
        <table className="w-full h-full">
          <thead className="product-thead">
            <tr className="divide-x divide-zinc-300/70">
              <td className="relative">
                <div className="flex items-center justify-center space-x-1">
                  <span>Product Name</span>
                  <button
                    onClick={() => setOpenFilterProduct((prev) => !prev)}
                    className={`p-2 ring ring-zinc-200/5 rounded-full cursor-pointer text-lg ${
                      openFilterProduct &&
                      "bg-secondary/15 transition-colors duration-150"
                    }`}
                  >
                    <CgArrowsExchangeAltV />
                  </button>
                  <AnimatePresence mode="wait">
                    {openFilterProduct && (
                      <SelectBox
                        mutate={() => {}}
                        setOpenFilterProduct={setOpenFilterProduct}
                        values={["asc", "desc"]}
                        options={[
                          "Sort Product Name (A-Z)",
                          "Sort Product Name (Z-A)",
                        ]}
                        currentValue={"asc"}
                        className="top-[85%] right-[-55px] absolute origin-top-left"
                      />
                    )}
                  </AnimatePresence>
                </div>
              </td>
              <td>SKU</td>
              <td>Quantity</td>
              <td>Type</td>
              <td>Financial Impact</td>
              <td>Reason</td>
              <td>Date</td>
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
                <td>{formatToFormalNumber(inventory.stock.toString())}</td>

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
        {!hasNextPage && !isLoading && allInventories.length > 0 && (
          <div className="text-center text-secondary text-[0.8rem] pt-2">
            End Result
          </div>
        )}
      </div>
    </div>
  );
}

export default InventoryList;
