import RecordBox from "../../../../components/RecordBox";
import {
  useSuspenseQuery,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";
import type { CategoryType } from "../../../../../../types/product.types";
import type { AxiosError } from "axios";
import useAxiosInterceptor from "../../../../../../hooks/useAxiosInterceptor";
import { PRODUCT_URL } from "../../../../../../api/request-api";
import { useProductStore } from "../../../../../../store/product.store";
function OrderCategories() {
  const axiosInstance = useAxiosInterceptor();
  const { orderProducts } = useProductStore();
  console.log(orderProducts);
  const allCategories: UseSuspenseQueryResult<CategoryType[], AxiosError> =
    useSuspenseQuery({
      queryKey: ["all-product-categories"],
      queryFn: async () => {
        const response = await axiosInstance.get(
          `${PRODUCT_URL}/all-categories`
        );

        return response.data.categories ?? [];
      },
      staleTime: Infinity,
    });
  const newField = allCategories.data.reduce((acc, category) => {
    acc[category.category_name] = 0;
    return acc;
  }, {} as Record<string, number>);
  const categories = orderProducts.reduce((acc, product) => {
    const productCategory = product.category_name;
    for (const key in acc) {
      if (key === productCategory) {
        acc[key] += Number(product.inventories_sum_stock);
      }
    }
    return acc;
  }, newField);
  return (
    <div className="border border-zinc-200 p-2 h-full basis-1/3">
      <div className="grid items-center lg:grid-cols-2 gap-1.5 overflow-y-auto">
        {Object.entries(categories).map(([key, value]) => (
          <RecordBox
            key={key}
            label={key}
            value={String(value)}
            className="bg-transparent rounded-sm"
          />
        ))}
      </div>
    </div>
  );
}

export default OrderCategories;
