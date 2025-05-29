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
export const inventoryValidation = z.object({
  product_id: z
    .number()
    .nullable()
    .refine((data) => {
      if (data === null) return false;
      return true;
    }, "Product details are required."),
  type: z.enum(["in", "out"]),
  reason: z.enum(["customer_sale", "supplier_delivery", "damaged_or_spoiled"]),
  stock: requiredValidation("Stock is required.").refine((data) => {
    if (Number.isInteger(data)) return true;
    else {
      return false;
    }
  }, "Stock must be a whole number"),
});
//   .refine(
//     (data) => {
//       if (data.stock === undefined) return false;
//       if (data["type"] === "in" && data.stock < 0) {
//         return false;
//       }
//       return true;
//     },
//     {
//       path: ["type"],
//       message: "Stock must not be negative.",
//     }
//   )
//   .refine(
//     (data) => {
//       if (data.stock === undefined) return false;
//       if (data["type"] === "out" && data.stock < 0) {
//         return false;
//       }
//       return true;
//     },
//     {
//       path: ["type"],
//       message: "Stock must be negative.",
//     }
//   );

export type InventoryValidationType = z.infer<typeof inventoryValidation>;
