import { z } from "zod";

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
  product_category: z.string().min(1),
  price: requiredValidation("Price is required.").transform((price) => {
    if (price !== undefined) return parseFloat(price.toFixed(2));
  }),
  discount_rate: requiredValidation("Discount Rate is required.")
    .refine((value) => {
      if (value) return true;
    }, "Discount Rate is required.")
    .refine((data) => {
      if (data !== undefined && (data < 0 || data > 100)) {
        return false;
      }
      return true;
    }, "Discount rate must be between 0 and 100"),
  tax_rate: requiredValidation("Tax Rate is required.").refine((data) => {
    if (data !== undefined && (data < 0 || data > 100)) {
      return false;
    }
    return true;
  }, "Tax rate must be between 0 and 100"),
  stock: requiredValidation("Stock is required.").refine((data) => {
    if (data !== undefined && data < 0) {
      return false;
    }
    return true;
  }, "Stock must not be negative."),
  product_image: z.instanceof(File).nullable(),
  manufacturer: z.string().max(1000),
});

export type ProductDetailsType = z.infer<typeof productValidation>;
