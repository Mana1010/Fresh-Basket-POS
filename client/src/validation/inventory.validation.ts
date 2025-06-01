import { z } from "zod";

const requiredValidation = (message: string) => {
  return z
    .preprocess((value) => {
      return value === "" ? undefined : Number(value);
    }, z.number())
    .refine((data) => {
      return data !== undefined;
    }, message);
};

export function inventoryValidation(stock: number) {
  return z
    .object({
      product_id: z
        .number()
        .nullable()
        .refine((data) => {
          if (data === null) return false;
          return true;
        }, "Product details are required."),
      type: z.enum(["in", "out", ""]).refine((data) => {
        return !!data;
      }, "Type is required"),
      reason: z
        .enum(["customer_sale", "supplier_delivery", "damaged_or_spoiled", ""])
        .refine((data) => {
          return !!data;
        }, "Reason is required"),
      stock: requiredValidation("Stock is required").refine((data) => {
        return data > 0;
      }, "Stock cannot be zero or negative."),
    })
    .refine(
      (value) => {
        return value.type !== "out" || value.stock <= stock;
      },
      {
        path: ["stock"],
        message: `Insufficient stock. ${
          stock
            ? `Only ${stock} item${stock > 1 ? "s" : ""} available.`
            : "No stock available."
        }`,
      }
    );
}

export type InventoryValidationType = z.infer<
  ReturnType<typeof inventoryValidation>
>;
