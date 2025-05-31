import { z } from "zod";

const requiredValidation = (message: string) => {
  return z
    .preprocess((value) => {
      if (value === "") {
        return undefined;
      }
      return Number(value);
    }, z.number())
    .refine((data) => {
      if (data === undefined) return false;
      return true;
    }, message);
};
export const inventoryValidation = z.object({
  product_id: z
    .number()
    .nullable()
    .refine((data) => {
      if (data === null) return false;
      return true;
    }, "Product details are required."),
  type: z.enum(["in", "out", ""]).refine((data) => {
    if (!data) return false;
    return true;
  }, "Type is required"),
  reason: z
    .enum(["customer_sale", "supplier_delivery", "damaged_or_spoiled", ""])
    .refine((data) => {
      if (!data) return false;
      return true;
    }, "Reason is required"),
  stock: requiredValidation("Stock is required").refine((data) => {
    if (data >= 0 && Number.isInteger(data)) return true;
    return false;
  }, "Stock must be a whole number"),
});

export type InventoryValidationType = z.infer<typeof inventoryValidation>;
