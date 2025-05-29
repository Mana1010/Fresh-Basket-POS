import { useEffect, useState } from "react";
import SelectBox from "../../../components/SelectBox";
import { AnimatePresence } from "framer-motion";
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { MdOutlineFilterList } from "react-icons/md";
import { PRODUCT_URL } from "../../../../../api/request-api";
import useAxiosInterceptor from "../../../../../hooks/useAxiosInterceptor";
import { useInView } from "react-intersection-observer";
import type { FullProductDetailsType } from "../../../../../types/product.types";
import { formatToPhpMoney } from "../../../../../utils/format-to-money";

function InventoryList() {
  const [openFilterProduct, setOpenFilterProduct] = useState(false);
  const [openFilterPrice, setOpenFilterPrice] = useState(false);
  const { ref, inView } = useInView();
  const axiosInterceptor = useAxiosInterceptor();

  const { data, hasNextPage, isLoading, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ["products"],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await axiosInterceptor.get(
          `${PRODUCT_URL}/list?limit=10&page=${pageParam}`
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
  const allProducts = data?.pages.flatMap((page) => page.data) || [];

  // Auto-fetch next page when scrolling into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
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
              <td>Stock</td>
              <td>Type</td>
              <td>Reason</td>
              <td className="relative">
                <div className="flex items-center justify-center space-x-1">
                  <span>Price</span>
                  <button
                    onClick={() => setOpenFilterPrice((prev) => !prev)}
                    className={`p-2 ring ring-zinc-200/5 rounded-full cursor-pointer text-lg ${
                      openFilterPrice &&
                      "bg-secondary/15 transition-colors duration-150"
                    }`}
                  >
                    <MdOutlineFilterList />
                  </button>
                  <AnimatePresence mode="wait">
                    {openFilterPrice && (
                      <SelectBox
                        setOpenFilterProduct={setOpenFilterPrice}
                        mutate={() => {}}
                        values={["asc", "desc"]}
                        options={["Price (With Tax)", "Price (Without Tax)"]}
                        currentValue={"asc"}
                        className="top-[85%] right-[-55px] absolute origin-top-left"
                      />
                    )}
                  </AnimatePresence>
                </div>
              </td>
              <td>Date</td>
            </tr>
          </thead>
          <tbody className="product-tbody">
            {allProducts.map((product: FullProductDetailsType, i) => (
              <tr
                key={`${product.barcode}-${i}`} // Better key using product ID
                className="border-b border-zinc-200 hover:bg-secondary/85 group transition-opacity duration-75 ease-in-out"
              >
                <td>{product.product_name}</td>
                <td>{product.barcode.slice(0, 8)}</td>
                <td>{product.sku}</td>

                <td>
                  <span className="px-3 py-0.5 bg-orange-300/35 border border-orange-400 rounded-3xl">
                    {product.category.category_name}
                  </span>
                </td>
                <td>{25}</td>
                <td>
                  <span className="px-3 py-0.5 bg-green-300/35 border border-green-400 rounded-3xl">
                    {formatToPhpMoney(String(product.price ?? 0))}
                  </span>
                </td>
                <td>{product.manufacturer}</td>
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
        {!hasNextPage && !isLoading && allProducts.length > 0 && (
          <div className="text-center text-secondary text-[0.8rem] pt-2">
            End Result
          </div>
        )}
      </div>
    </div>
  );
}

export default InventoryList;
