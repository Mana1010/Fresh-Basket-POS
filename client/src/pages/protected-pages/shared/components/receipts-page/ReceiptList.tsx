import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { INVOICE_URL } from "../../../../../api/request-api";
import useAxiosInterceptor from "../../../../../hooks/useAxiosInterceptor";
import { useInView } from "react-intersection-observer";

import { dateFormat } from "../../../../../helper/dateFormat";
import { IoClipboard, IoFilter, IoStar, IoSwapVertical } from "react-icons/io5";
import { LuList } from "react-icons/lu";

import SelectBox from "../../../components/SelectBox";
import { AnimatePresence } from "framer-motion";
import TableLoading from "../loading/TableLoading";
import type { ReceiptType } from "../../../../../types/invoice.types";
import { formatToPhpMoney } from "../../../../../utils/format-to-money";

type InventoryListProps = {
  debouncedSearchResult: string;
};
function ReceiptList({ debouncedSearchResult }: InventoryListProps) {
  const { ref, inView } = useInView();
  const [openSortCustomerName, setOpenSortCustomerName] = useState(false);
  const [sortByCustomerName, setSortByCustomerName] = useState<
    "all" | "asc" | "desc"
  >("all");
  const axiosInterceptor = useAxiosInterceptor();
  const { data, hasNextPage, isLoading, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["receipts", sortByCustomerName, debouncedSearchResult],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await axiosInterceptor.get(
          `${INVOICE_URL}/list?limit=10&page=${pageParam}&search=${debouncedSearchResult}&sort=${sortByCustomerName}&sort_total_amount=${""}`
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
  const allReceipts =
    data?.pages.flatMap((page) => page.data) || ([] as ReceiptType[]);

  // Auto-fetch next page when scrolling into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  function handleSortCustomerName(value: string) {
    setSortByCustomerName(value as "all" | "asc" | "desc");
    setOpenSortCustomerName(false);
  }
  console.log(data);
  return (
    <div className="flex-grow w-auto lg:w-full h-auto lg:h-1 overflow-x-auto">
      <div className="w-full h-full overflow-y-auto thin-scrollbar pr-1 flex flex-col">
        <table className="w-full table-fixed">
          <thead className="product-thead">
            <tr className="divide-x divide-zinc-300/70">
              <td className="relative">
                <div className="flex items-center justify-center space-x-1">
                  <span>Customer Name</span>
                  <button
                    onClick={() => setOpenSortCustomerName((prev) => !prev)}
                    className={`p-1.5 ring ring-zinc-200/5 rounded-full cursor-pointer text-sm ${
                      openSortCustomerName &&
                      "bg-secondary/15 transition-colors duration-150"
                    }`}
                  >
                    <IoSwapVertical />
                  </button>
                  <AnimatePresence mode="wait">
                    {openSortCustomerName && (
                      <SelectBox
                        handleAction={handleSortCustomerName}
                        setOpenFilterProduct={setOpenSortCustomerName}
                        values={["asc", "desc"]}
                        options={[
                          "Sort Customer Name (A-Z)",
                          "Sort Customer Name (Z-A)",
                        ]}
                        currentValue={sortByCustomerName}
                        className="top-[85%] right-[-55px] absolute origin-top-left"
                      />
                    )}
                  </AnimatePresence>
                </div>
              </td>
              <td>Receipt Code</td>
              <td>Customer Paid</td>
              <td>Total Amount</td>
              <td>Cashier</td>
              <td>Rating</td>
              <td>Date</td>
              <td>Action</td>
            </tr>
          </thead>
          {!isLoading && (
            <tbody className="product-tbody">
              {allReceipts.map((receipt: ReceiptType, i: number) => (
                <tr
                  key={`${receipt.id}`} // Better key using product ID
                  className="border-b border-zinc-200 hover:bg-secondary/85 group transition-opacity duration-75 ease-in-out"
                >
                  <td>
                    {receipt.customer ? receipt.customer.name : `Customer ${i}`}
                  </td>
                  <td>{receipt.invoice_code}</td>
                  <td>{formatToPhpMoney(receipt.customer_paid)}</td>
                  <td>{formatToPhpMoney(receipt.orders_sum_total_price)}</td>
                  <td>
                    {receipt.cashier
                      ? receipt.cashier.employer_name
                      : `Unamed Cashier`}
                  </td>
                  <td className="flex items-center justify-center">
                    {receipt.ratings !== null ? (
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 })
                          .fill(0)
                          .map((_, i) => (
                            <span
                              key={i}
                              className={`${
                                Number(receipt.ratings) > i
                                  ? "text-yellow-400"
                                  : "text-secondary/70"
                              }`}
                            >
                              <IoStar />
                            </span>
                          ))}
                      </div>
                    ) : (
                      "No rating"
                    )}
                  </td>
                  <td>{dateFormat(new Date(receipt.created_at as string))}</td>
                  <td className="flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
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
        {allReceipts.length === 0 && !isLoading && (
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
        {!hasNextPage && !isLoading && allReceipts.length > 5 && (
          <div className="text-center text-secondary text-[0.8rem] pt-2">
            End Result
          </div>
        )}
      </div>
    </div>
  );
}

export default ReceiptList;
