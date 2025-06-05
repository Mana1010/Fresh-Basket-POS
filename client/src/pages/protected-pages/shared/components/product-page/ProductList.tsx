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
import {
  formatToFormalNumber,
  formatToPhpMoney,
} from "../../../../../utils/format-to-money";
import { LuList } from "react-icons/lu";
import { useModalStore } from "../../../../../store/modal.store";

type ProductListProps = {
  debouncedSearchedProduct: string;
};
function ProductList({ debouncedSearchedProduct }: ProductListProps) {
  const [openFilterProduct, setOpenFilterProduct] = useState(false);
  const [openFilterPrice, setOpenFilterPrice] = useState(false);
  const { toggleProductDetails, setProductDetails } = useModalStore();
  const { ref, inView } = useInView();
  const axiosInterceptor = useAxiosInterceptor();

  const { data, hasNextPage, isLoading, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ["products", "products_page", debouncedSearchedProduct],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await axiosInterceptor.get(
          `${PRODUCT_URL}/list?limit=10&page=${pageParam}&search=${debouncedSearchedProduct}&type=products_page`
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
      staleTime: 30 * 1000,
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
    <div className="flex-grow w-auto lg:w-full h-auto lg:h-1 overflow-x-auto">
      <div className="w-full h-full overflow-y-auto thin-scrollbar pr-1">
        <table className="w-full">
          <thead className="product-thead">
            <tr className="divide-x divide-zinc-300/70">
              <td className="relative">
                <div className="flex items-center justify-center space-x-1">
                  <span>Product</span>
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
                        handleAction={() => {}}
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
              <td>Barcode</td>
              <td>SKU</td>
              <td>Category</td>
              <td>Stock</td>
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
                        handleAction={() => {}}
                        setOpenFilterProduct={setOpenFilterPrice}
                        values={["asc", "desc"]}
                        options={["Price (With Tax)", "Price (Without Tax)"]}
                        currentValue={"asc"}
                        className="top-[85%] right-[-55px] absolute origin-top-left"
                      />
                    )}
                  </AnimatePresence>
                </div>
              </td>
              <td>Tax Rate</td>
              <td>Discount Rate</td>
              <td>Manufacturer</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody className="product-tbody">
            {allProducts.map((product: FullProductDetailsType, i) => (
              <tr
                key={`${product.barcode}-${i}`} // Better key using product ID
                className={`border-b border-zinc-200 hover:bg-secondary/85 group transition-opacity duration-75 ease-in-out ${
                  product.inventories_sum_stock === null && "bg-red-500/35"
                }`}
              >
                <td>{product.product_name}</td>
                <td>{product.barcode}</td>
                <td>{product.sku}</td>

                <td>
                  <span className="px-3 py-0.5 bg-orange-300/35 border border-orange-400 rounded-3xl">
                    {product.category.category_name}
                  </span>
                </td>
                <td>
                  {product.inventories_sum_stock === null ? (
                    <span className="text-[0.7rem]">Out of Stock</span>
                  ) : (
                    formatToFormalNumber(product.inventories_sum_stock ?? "0")
                  )}
                </td>
                <td>
                  <span className="px-3 py-0.5 bg-green-300/35 border border-green-400 rounded-3xl">
                    {formatToPhpMoney(String(product.price ?? 0))}
                  </span>
                </td>
                <td>{product.tax_rate}</td>
                <td>{product.discount_rate}</td>
                <td>{product.manufacturer ? product.manufacturer : "N/A"}</td>
                <td className="flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setProductDetails(product);
                      toggleProductDetails();
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
        </table>

        {/* Loading indicator */}
        {hasNextPage && (
          <div ref={ref} className="text-center py-4">
            {isFetchingNextPage ? "Loading more..." : "Load more data..."}
          </div>
        )}

        {/* End of results indicator */}
        {!hasNextPage && !isLoading && allProducts.length > 5 && (
          <div className="text-center text-secondary text-[0.8rem] pt-2">
            End Result
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductList;
