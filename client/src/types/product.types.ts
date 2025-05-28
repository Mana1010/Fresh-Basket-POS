import type { ProductDetailsType } from "../validation/product.validation";

export type CategoryType = {
  id: number;
  category_name: string;
};

export type FullProductDetailsType = ProductDetailsType & {
  category: { category_name: string };
};
