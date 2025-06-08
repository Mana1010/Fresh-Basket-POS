/* eslint-disable @typescript-eslint/no-unused-vars */
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
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
import { useProductStore } from "../../../store/product.store";
import { IoCart } from "react-icons/io5";
import FirstPage from "./components/pos-page/FirstPage";
import SecondPage from "./components/pos-page/SecondPage";
import { useModalStore } from "../../../store/modal.store";
import Title from "../../../components/Title";

const LazyOrderCategories = lazy(
  () => import("./components/pos-page/pos-stats/OrderCategories")
);
function Pos() {
  const { productsMap } = useProductStore();
  const { currentPage } = useModalStore();
  const axiosInstance = useAxiosInterceptor();
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
    console.log(products.data);
    if (products.isSuccess) {
      for (let i = 0; i < products.data.length; i++) {
        const { category, ...data } = products.data[i]; //extract first the data that will be using
        productsMap.set(products.data[i].barcode, {
          ...data,
          category_name: products.data[i].category.category_name,
        });
      }
      // setProductMap(allProducts);
    }
  }, [productsMap, products.data, products.isSuccess]);
  return (
    <div className="w-full flex-grow lg:grid-cols-3 grid-cols-1 gap-2 grid justify-center items-center p-2 h-full bg-white rounded-xl border border-zinc-200">
      <Title title="Point of Sale" />
      <div className="h-full w-full col-span-full lg:col-span-2 flex flex-col gap-2">
        <div className="justify-between flex items-center">
          <h1 className=" text-primary flex items-center space-x-1">
            <span className="text-lg">
              <IoCart />
            </span>
            <span className="text-sm poppins-semibold">
              {" "}
              Order Details Section
            </span>
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
      {currentPage === "pos_page" ? <FirstPage /> : <SecondPage />}
    </div>
  );
}

export default Pos;
