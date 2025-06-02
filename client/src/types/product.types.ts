import type { ProductDetailsType } from "../validation/product.validation";

export type CategoryType = {
  id: number;
  category_name: string;
};

export type FullProductDetailsType = Omit<
  ProductDetailsType,
  "stock" | "price"
> & {
  inventories_sum_stock: string;
  id: number;
  price: number;
  created_at: Date;
  updated_at: Date;
  category: { category_name: string };
};
