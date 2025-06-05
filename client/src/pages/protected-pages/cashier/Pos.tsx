/* eslint-disable @typescript-eslint/no-unused-vars */
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import Invoice from "./components/pos-page/Invoice";
import Transaction from "./components/pos-page/Transaction";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { PRODUCT_URL } from "../../../api/request-api";
import useAxiosInterceptor from "../../../hooks/useAxiosInterceptor";
import type { FullProductDetailsType } from "../../../types/product.types";

import OrderTotalRecords from "./components/pos-page/pos-stats/OrderTotalRecords";
import Spinner from "../../../components/Spinner";
import OrderList from "./components/pos-page/OrderList";
import { ErrorBoundary } from "react-error-boundary";
import BoxesLoading from "../shared/components/loading/BoxesLoading";

const LazyOrderCategories = lazy(
  () => import("./components/pos-page/pos-stats/OrderCategories")
);
function Pos() {
  const [currentOrderProduct, setCurrentOrderProduct] = useState("");
  const axiosInstance = useAxiosInterceptor();
  const productMap = useMemo(() => {
    return new Map();
  }, []);
  const products: UseQueryResult<FullProductDetailsType[], AxiosError> =
    useQuery({
      queryKey: ["products", "pos_page"],
      queryFn: async () => {
        const response = await axiosInstance.get(
          `${PRODUCT_URL}/list?type=pos_page`
        );
        return response.data.data;
      },
    });

  useEffect(() => {
    if (products.isSuccess) {
      for (let i = 0; i < products.data.length; i++) {
        const { category, ...data } = products.data[i]; //extract first the data that will be using
        productMap.set(products.data[i].barcode, {
          ...data,
          category_name: products.data[i].category.category_name,
        });
      }
      // setProductMap(allProducts);
    }
  }, [productMap, products.data, products.isSuccess]);
  return (
    <div className="w-full flex-grow lg:grid-cols-3 grid-cols-1 gap-2 grid justify-center items-center p-2 h-full bg-white rounded-xl border border-zinc-200">
      <div className="h-full w-full col-span-full lg:col-span-2 flex flex-col gap-2">
        <div className="justify-between flex items-center">
          <h1 className="text-md">
            <span className="text-secondary poppins-extrabold">Your</span>{" "}
            <span className="text-primary poppins-extrabold">Orders</span>
          </h1>

          {products.isFetching && (
            <Spinner className="size-3 border-secondary border-t-transparent" />
          )}
        </div>
        <div className="flex items-center w-full gap-2 h-[170px] overflow-y-auto">
          <OrderTotalRecords />
          <Suspense
            fallback={
              <div className="border border-zinc-200 p-2 h-full basis-1/3">
                <BoxesLoading
                  totalBoxes={2}
                  className="basis-1/2 grid-cols-2"
                />
              </div>
            }
          >
            <ErrorBoundary
              fallback={
                <div className="border border-zinc-200 p-2 h-full basis-1/3">
                  <BoxesLoading
                    totalBoxes={2}
                    className="basis-1/2 grid-cols-2"
                  />
                </div>
              }
            >
              <LazyOrderCategories />
            </ErrorBoundary>
          </Suspense>
        </div>
        <OrderList />
      </div>
      <div className="flex lg:flex-col w-full h-full gap-2 px-2 border-l border-zinc-200">
        <div className="w-full h-full basis-[20%] border border-zinc-200 p-2 flex flex-col shrink-0 rounded-smy">
          <h1 className="text-sm text-secondary poppins-extrabold">
            Last Scanned Item{" "}
          </h1>
          <div className="flex-grow flex justify-center flex-col">
            <span className="text-secondary">No Item Yet</span>
          </div>
        </div>
        <Transaction />
        <Invoice />
      </div>
    </div>
  );
}

export default Pos;
