import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import useAxiosInterceptor from "../../../../../hooks/useAxiosInterceptor";
import { PRODUCT_URL } from "../../../../../api/request-api";
import type { UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { InventoryValidationType } from "../../../../../validation/inventory.validation";

import { useInView } from "react-intersection-observer";
import noThumbnail from "../../../../../assets/stickers/no-thumbnail.svg";
import { IoCube, IoShapes } from "react-icons/io5"; // Import Ionicons cube icon from react-icons
import { formatToFormalNumber } from "../../../../../utils/format-to-money";
import type { FullProductDetailsType } from "../../../../../types/product.types";

type SelectProductProps = {
  errorMessage?: string;
  setValue: UseFormSetValue<InventoryValidationType>;
  watch: UseFormWatch<InventoryValidationType>;
  setSelectedProduct: Dispatch<
    SetStateAction<
      | (Pick<
          FullProductDetailsType,
          "id" | "product_name" | "sku" | "barcode"
        > & { stock: number })
      | null
    >
  >;
  debounceSearchedProduct: string;
};

function SelectProduct({
  setValue,
  watch,
  setSelectedProduct,
  debounceSearchedProduct,
}: SelectProductProps) {
  const { ref, inView } = useInView();
  const axiosInstance = useAxiosInterceptor();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ["products", "select-product", debounceSearchedProduct],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await axiosInstance.get(
          `${PRODUCT_URL}/list?limit=10&page=${pageParam}&search=${debounceSearchedProduct}`
        );
        return response.data.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (lastPage.from === null || lastPage.data.length === 0) {
          return undefined;
        }
        return lastPage.current_page + 1;
      },
      // enabled: false,
      staleTime: Infinity,
    });
  const allProducts =
    data?.pages.flatMap((page) => page.data) ||
    ([] as FullProductDetailsType[]);

  console.log(inView);
  useEffect(() => {
    if (hasNextPage && inView && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

  return (
    <div className="pb-1  w-full flex-grow">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1.5 items-center w-full">
        {allProducts.map((product: FullProductDetailsType, i) => (
          <button
            type="button"
            key={i}
            onClick={() => {
              setValue("product_id", product.id);
              setSelectedProduct({
                product_name: product.product_name,
                barcode: product.barcode,
                id: product.id,
                sku: product.sku,
                stock: parseInt(product.inventories_sum_stock ?? 0), //Convert the stock to number
              });
            }}
            className={` custom-border rounded-md p-2 flex items-center text-sm relative gap-1.5 cursor-pointer ${
              watch("product_id") === product.id
                ? "border-primary bg-primary/15"
                : "text-secondary/75"
            }`}
          >
            <div className="border-zinc-300 relative rounded-md flex-shrink-0 w-1/4 aspect-square border">
              <img
                src={noThumbnail}
                className="inset-1 object-center object-cover rounded-md"
                alt="product-thumbnail"
              />
            </div>
            <div className="flex flex-col space-y-1 justify-start items-start flex-grow w-1">
              <h1 className="text-[0.8rem] poppins-semibold text-primary line-clamp-1 text-start">
                {product.product_name}
              </h1>

              <h5 className="text-secondary/80 text-[0.65rem]">
                {product.sku}
              </h5>
              <h5 className="text-secondary/80 text-[0.65rem]">
                {product.barcode}
              </h5>
            </div>

            <div className="flex justify-end items-end absolute bottom-1 right-1 gap-1 flex-col">
              <div className="flex items-center space-x-1 rounded-3xl bg-primary/35 py-0.5 text-secondary px-2 border border-orange-200 ">
                <IoShapes size={11} />
                <span className="text-[0.7rem] leading-none">
                  {product.category.category_name}
                </span>
              </div>
              <div className="flex items-center space-x-1 rounded-3xl bg-secondary/5 py-0.5 text-secondary px-2 custom-border ">
                <IoCube size={11} />
                <span className="text-[0.7rem] leading-none">
                  {formatToFormalNumber(product.inventories_sum_stock)}
                </span>
              </div>
            </div>
          </button>
        ))}
        {hasNextPage && (
          <div
            ref={ref}
            className="min-h-20 custom-border rounded-md bg-zinc-400 animate-pulse"
          />
        )}
      </div>
    </div>
  );
}
export default SelectProduct;
