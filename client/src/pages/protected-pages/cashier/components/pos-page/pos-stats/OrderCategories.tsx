import React from "react";
import RecordBox from "../../../../components/RecordBox";
import { useSuspenseQuery, type UseQueryResult } from "@tanstack/react-query";
import type { CategoryType } from "../../../../../../types/product.types";
import type { Axios } from "axios";
import useAxiosInterceptor from "../../../../../../hooks/useAxiosInterceptor";
import { PRODUCT_URL } from "../../../../../../api/request-api";
function OrderCategories() {
  const axiosInstance = useAxiosInterceptor();
  const allCategories: UseQueryResult<CategoryType[], Axios> = useSuspenseQuery(
    {
      queryKey: ["all-product-categories"],
      queryFn: async () => {
        const response = await axiosInstance.get(
          `${PRODUCT_URL}/all-categories`
        );

        return response.data.categories;
      },
      staleTime: Infinity,
    }
  );
  return (
    <div className="border border-zinc-200 p-2 h-full basis-1/3">
      <div className="grid items-center lg:grid-cols-2 gap-1.5 overflow-y-auto">
        {allCategories.data?.map((category) => (
          <RecordBox
            key={category.id}
            label={category.category_name}
            value="0"
            className="bg-transparent rounded-sm"
          />
        ))}
      </div>
    </div>
  );
}

export default OrderCategories;
