import { z } from "zod";
import type { CategoryType } from "../types/product.types";

const requiredValidation = (message: string) => {
  return z
    .preprocess((value) => {
      if (value === "") {
        return undefined;
      }
      return Number(value);
    }, z.union([z.number(), z.undefined()]))
    .refine((data) => {
      if (data === undefined) {
        return false;
      }
      return true;
    }, message);
};

export const productValidation = z.object({
  product_name: z.string().min(1, "Product Name is required").max(1000),
  barcode: z.string().min(1, "Product Barcode is required").max(100),
  sku: z.string().min(1, "Product Sku is required").max(1000),
  product_category_id: z.number(),
  price: requiredValidation("Price is required.").transform((price) => {
    if (price !== undefined) return parseFloat(price.toFixed(2));
  }),
  discount_rate: requiredValidation("Discount Rate is required.")
    .refine((data) => {
      if (data !== undefined && (data < 0 || data > 100)) {
        return false;
      }
      return true;
    }, "Discount rate must be between 0 and 100")
    .refine((data) => {
      if (Number.isInteger(data)) return true;
      else {
        return false;
      }
    }, "Discount rate must be a whole number"),
  tax_rate: requiredValidation("Tax Rate is required.")
    .refine((data) => {
      if (data !== undefined && (data < 0 || data > 100)) {
        return false;
      }
      return true;
    }, "Tax rate must be between 0 and 100")
    .refine((data) => {
      if (Number.isInteger(data)) return true;
      else {
        return false;
      }
    }, "Tax rate must be a whole number"),
  stock: requiredValidation("Stock is required.")
    .refine((data) => {
      if (data !== undefined && data < 0) {
        return false;
      }
      return true;
    }, "Stock must not be negative.")
    .refine((data) => {
      if (Number.isInteger(data)) return true;
      else {
        return false;
      }
    }, "Stock must be a whole number"),
  product_image: z.instanceof(File).nullable(),
  manufacturer: z.string().max(1000),
});

export function productCategoryValidation(
  all_existing_categories: CategoryType[]
) {
  const transformToLowerCase = all_existing_categories.map((category) =>
    category.category_name.toLowerCase().replace(/\s+/g, "")
  );

  return z.object({
    category_name: z
      .string()
      .min(1, "Product Category is required.")
      .max(20, "Product Category should be less than to 20 characters only.")
      .refine((category) => {
        //Is new category already exist?
        if (
          transformToLowerCase.includes(
            category.toLowerCase().replace(/\s+/g, "")
          )
        ) {
          return false;
        }
        return true;
      }, "Category already exist"),
  });
}
export type ProductDetailsType = z.infer<typeof productValidation>;
