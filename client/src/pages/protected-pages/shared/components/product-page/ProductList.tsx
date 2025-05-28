import { useEffect, useRef, useState } from "react";
import SelectBox from "../../../components/SelectBox";
import { AnimatePresence } from "framer-motion";
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { MdOutlineFilterList } from "react-icons/md";
import { PRODUCT_URL } from "../../../../../api/request-api";
import useAxiosInterceptor from "../../../../../hooks/useAxiosInterceptor";
import { useInView } from "react-intersection-observer";
import type { FullProductDetailsType } from "../../../../../types/product.types";
import { useQueryClient } from "@tanstack/react-query";
function ProductList() {
  const [openFilterProduct, setOpenFilterProduct] = useState(false);
  const [openFilterPrice, setOpenFilterPrice] = useState(false);
  const { ref, inView } = useInView();
  const axiosInterceptor = useAxiosInterceptor();
  const [hasNextProducts, setHasNextProducts] = useState(true);
  const [products, setProducts] = useState<FullProductDetailsType[]>([]);
  const currentPageRef = useRef(0);
  const queryClient = useQueryClient();
  const { data, isSuccess, hasNextPage, isLoading, refetch } =
    useSuspenseInfiniteQuery({
      queryKey: ["products"],
      queryFn: async () => {
        const response = await axiosInterceptor.get(
          `${PRODUCT_URL}/list?limit=10&page=${currentPageRef.current + 1}`
        );
        return response.data.data;
      },
      initialPageParam: 1,
      getNextPageParam: (getNextProducts) => {
        currentPageRef.current = getNextProducts.current_page;
        if (getNextProducts.from === null && hasNextProducts) {
          setHasNextProducts(false);
        } else {
          return getNextProducts;
        }
      },
    });
  // useEffect(() => {
  //   return () => {
  //     alert("Running");
  //     queryClient.resetQueries({ queryKey: ["products"] });
  //   };
  // }, [queryClient]);
  useEffect(() => {
    if (isSuccess && !isLoading && hasNextProducts) {
      alert("Sakses");
      const newData = data?.pages[0].data;
      setProducts((prevData: FullProductDetailsType[]) => {
        return [...prevData, ...newData];
      });
    }
  }, [data.pages, hasNextProducts, isLoading, isSuccess]);

  useEffect(() => {
    if (inView && hasNextPage) {
      refetch();
    }
  }, [hasNextPage, inView, refetch]);

  return (
    <div className="flex-grow w-full h-1">
      <div className="w-full h-full overflow-y-auto thin-scrollbar pr-1">
        <table className="w-full h-full ">
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
                        mutate={() => {}}
                        setOpenFilterProduct={setOpenFilterProduct}
                        values={["asc", "desc"]}
                        options={[
                          "Sort Product Name (A-Z)",
                          "Sort Product Name (Z-A)",
                        ]}
                        currentValue={"asc"}
                        className="top-[85%] right-[-55px] absolute origin-top-left
                      "
                      />
                    )}
                  </AnimatePresence>
                </div>
              </td>
              <td> Barcode</td>
              <td> SKU</td>

              <td> Category</td>
              <td className="relative">
                <div className="flex items-center justify-center space-x-1">
                  <span>Price</span>
                  <button
                    onClick={() => setOpenFilterPrice((prev) => !prev)}
                    className={`p-2 ring ring-zinc-200/5 rounded-full cursor-pointer text-lg ${
                      openFilterPrice &&
                      "bg-secondary/15 transition-colors duration-150 "
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
                        className="top-[85%] right-[-55px] absolute origin-top-left
                      "
                      />
                    )}
                  </AnimatePresence>
                </div>
              </td>
              <td>Tax Rate</td>
              <td>Discount Rate</td>
              <td>Manufacturer</td>
            </tr>
          </thead>
          <tbody className="product-tbody">
            {products.map((product: FullProductDetailsType, i) => (
              <tr
                key={i}
                className=" border-b border-zinc-200 hover:bg-secondary/85 group transition-opacity duration-75 ease-in-out"
              >
                <td>{product.product_name}</td>
                <td>{product.barcode.slice(0, 8)}</td>
                <td>{product.sku}</td>
                <td>
                  <span className="px-3 py-0.5 bg-orange-300/35 border border-orange-400 rounded-3xl">
                    {product.category.category_name}
                  </span>
                </td>
                <td>
                  <span className="px-3 py-0.5 bg-green-300/35 border border-green-400 rounded-3xl">
                    ₱ {product.price}
                  </span>
                </td>
                <td>{product.tax_rate}</td>
                <td>{product.discount_rate}</td>
                <td>{product.manufacturer}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {hasNextProducts && <div ref={ref}>Load more data...</div>}
        {!hasNextProducts && !isLoading && products.length > 10 && (
          <div className="text-center text-secondary text-[0.8rem] pt-2">
            End Result
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductList;
