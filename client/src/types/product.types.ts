import type { ProductDetailsType } from "../validation/product.validation";

export type CategoryType = {
  id: number;
  category_name: string;
};

export type FullProductDetailsType = Omit<ProductDetailsType, "stock"> & {
  inventories_sum_stock: string;
  id: number;
  category: { category_name: string };
};
