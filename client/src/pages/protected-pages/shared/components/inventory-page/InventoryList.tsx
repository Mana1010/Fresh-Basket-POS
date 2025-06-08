import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { INVENTORY_URL } from "../../../../../api/request-api";
import useAxiosInterceptor from "../../../../../hooks/useAxiosInterceptor";
import { useInView } from "react-intersection-observer";
import type {
  FullInventoryDetails,
  ReasonType,
} from "../../../../../types/inventory.types";
import { dateFormat } from "../../../../../helper/dateFormat";
import { formatFinancialImpactNumber } from "../../../../../helper/formatFinancialImpactNumber";
import { formatToFormalNumber } from "../../../../../utils/format-to-money";
import {
  IoCaretDown,
  IoCaretUp,
  IoClipboard,
  IoFilter,
  IoTrendingDown,
  IoTrendingUp,
} from "react-icons/io5";
import { LuList } from "react-icons/lu";
import { useModalStore } from "../../../../../store/modal.store";
import SelectBox from "../../../components/SelectBox";
import { AnimatePresence } from "framer-motion";
import TableLoading from "../loading/TableLoading";

type InventoryListProps = {
  debouncedSearchResult: string;
  reasonFilter: ReasonType | "";
  setReasonFilter: (value: ReasonType | "") => void;
};
function InventoryList({
  debouncedSearchResult,
  reasonFilter,
  setReasonFilter,
}: InventoryListProps) {
  const { ref, inView } = useInView();
  const [openFilterInventory, setOpenFilterInventory] = useState(false);
  const axiosInterceptor = useAxiosInterceptor();
  const { toggleInventoryDetails, setInventoryDetails } = useModalStore();
  const { data, hasNextPage, isLoading, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["inventories", reasonFilter, debouncedSearchResult],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await axiosInterceptor.get(
          `${INVENTORY_URL}/list?limit=10&page=${pageParam}&search=${debouncedSearchResult}&reason=${reasonFilter}`
        );
        return response.data.data;
      },
      throwOnError: true,
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

  function handleFilterInventory(value: string) {
    setReasonFilter(value as ReasonType | "");
    setOpenFilterInventory(false);
  }
  return (
    <div className="flex-grow w-auto lg:w-full h-auto lg:h-1 overflow-x-auto">
      <div className="w-full h-full overflow-y-auto thin-scrollbar pr-1 flex flex-col">
        <table className="w-full table-fixed">
          <thead className="product-thead">
            <tr className="divide-x divide-zinc-300/70">
              <td className="w-20">Product Name</td>
              <td className="w-15">SKU</td>
              <td className="w-10">Quantity</td>
              <td className="w-10">Type</td>
              <td className="w-17">Financial Impact</td>
              <td className="relative w-20">
                <div className="flex items-center justify-center space-x-1">
                  <span>Reason</span>
                  <button
                    onClick={() => setOpenFilterInventory((prev) => !prev)}
                    className={`p-2 ring ring-zinc-200/5 rounded-full cursor-pointer text-lg ${
                      openFilterInventory &&
                      "bg-secondary/15 transition-colors duration-150"
                    }`}
                  >
                    <IoFilter />
                  </button>
                  <AnimatePresence mode="wait">
                    {openFilterInventory && (
                      <SelectBox
                        handleAction={handleFilterInventory}
                        setOpenFilterProduct={setOpenFilterInventory}
                        values={[
                          "",
                          "supplier_delivery",
                          "damaged_or_spoiled",
                          "customer_sale",
                        ]}
                        options={[
                          "All",
                          "Supplier Delivery",
                          "Damaged/Spoiled",
                          "Sold in Customer",
                        ]}
                        currentValue={reasonFilter}
                        className="top-[85%] right-[-55px] absolute origin-top-left"
                      />
                    )}
                  </AnimatePresence>
                </div>
              </td>
              <td className="w-15">Date</td>
              <td className="w-10">Action</td>
            </tr>
          </thead>
          {!isLoading && (
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
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {isLoading && (
          <TableLoading
            totalBoxes={24}
            className="grid-cols-8"
            boxesClassName="min-h-8"
          />
        )}
        {allInventories.length === 0 && !isLoading && (
          <div className="flex-grow justify-center items-center flex-col w-full flex gap-2">
            <span className="text-primary text-5xl">
              <IoClipboard />
            </span>
            <span className="text-zinc-800/60 text-xl poppins-semibold">
              {" "}
              No inventory available
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
