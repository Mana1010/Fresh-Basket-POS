import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import SelectBox from "../../../components/SelectBox";
import { AnimatePresence } from "framer-motion";
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { useInfiniteQuery } from "@tanstack/react-query";
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
import { IoCube, IoFilter } from "react-icons/io5";
import TableLoading from "../loading/TableLoading";

type ProductListProps = {
  debouncedSearchedProduct: string;
  sortProduct: "asc" | "desc" | "";
  setSortProduct: Dispatch<SetStateAction<"asc" | "desc" | "">>;
};
function ProductList({
  debouncedSearchedProduct,
  sortProduct,
  setSortProduct,
}: ProductListProps) {
  const [openFilterProduct, setOpenFilterProduct] = useState(false);
  const [openFilterPrice, setOpenFilterPrice] = useState(false);
  const [filterPrice, setFilterPrice] = useState<"total_price" | "base_price">(
    "total_price"
  );
  const { toggleProductDetails, setProductDetails } = useModalStore();
  const { ref, inView } = useInView();
  const axiosInterceptor = useAxiosInterceptor();

  const { data, hasNextPage, isLoading, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [
        "products",
        "products_page",
        sortProduct,
        filterPrice,
        debouncedSearchedProduct,
      ],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await axiosInterceptor.get(
          `${PRODUCT_URL}/list?limit=10&page=${pageParam}&search=${debouncedSearchedProduct}&type=products_page&sort=${sortProduct}&filterPrice=${filterPrice}`
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
  const allProducts = data?.pages.flatMap((page) => page.data) || [];

  // Auto-fetch next page when scrolling into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  function handleSortProduct(value: string) {
    setSortProduct(value as "asc" | "desc" | "");
    setOpenFilterProduct(false);
  }

  function handleFilterPrice(value: string) {
    setFilterPrice(value as "total_price" | "base_price");
    setOpenFilterPrice(false);
  }

  console.log(allProducts);
  return (
    <div className="flex-grow w-auto lg:w-full h-auto lg:h-1 overflow-x-auto">
      <div className="w-auto lg:w-full h-full overflow-x-auto thin-scrollbar pr-1 flex flex-col">
        <table className="w-full table-fixed">
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
                        handleAction={handleSortProduct}
                        setOpenFilterProduct={setOpenFilterProduct}
                        values={["asc", "desc"]}
                        options={[
                          "Sort Product Name (A-Z)",
                          "Sort Product Name (Z-A)",
                        ]}
                        currentValue={sortProduct}
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
                    <IoFilter />
                  </button>
                  <AnimatePresence mode="wait">
                    {openFilterPrice && (
                      <SelectBox
                        handleAction={handleFilterPrice}
                        setOpenFilterProduct={setOpenFilterPrice}
                        values={["total_price", "base_price"]}
                        options={["Price (Total Price)", "Price (Base Price)"]}
                        currentValue={filterPrice}
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
                  (!Number(product.inventories_sum_stock) ||
                    !product.inventories_sum_stock) &&
                  "bg-red-500/35"
                }`}
              >
                <td>{product.product_name}</td>
                <td>{product.barcode}</td>
                <td>{product.sku}</td>

                <td>
                  <span className="px-3 py-0.5 bg-orange-300/35 border border-orange-400 rounded-3xl">
                    {product.category?.category_name ?? "Uncategorized"}
                  </span>
                </td>
                <td>
                  {!product.inventories_sum_stock ||
                  !Number(product.inventories_sum_stock) ? (
                    <span className="text-[0.7rem]">Out of Stock</span>
                  ) : (
                    formatToFormalNumber(product.inventories_sum_stock ?? "0")
                  )}
                </td>
                <td>
                  <span className="px-3 py-0.5 bg-green-300/35 border border-green-400 rounded-3xl">
                    {formatToPhpMoney(product.total_price ?? 0)}
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
        {isLoading && (
          <TableLoading
            totalBoxes={30}
            boxesClassName="min-h-10"
            className="grid-cols-10"
          />
        )}
        {allProducts.length === 0 && !isLoading && (
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
