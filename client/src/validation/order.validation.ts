import { z } from "zod";
import { requiredValidation } from "./inventory.validation";

export const transactionPanelValidation = z.object({
  barcode: z.string().min(1, "Barcode is required."),
  quantity: requiredValidation("Product Quantity is required.").refine(
    (data) => {
      return data > 0;
    },
    "Product Quantity cannot be zero or negative."
  ),
});

export const customerInfoValidation = z.object({
  name: z
    .string()
    .max(255, "Customer name must be no longer than 255 characters."),
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Invalid email format.")
    .max(255, "Email must be no longer than 255 characters."),
  customer_paid: z.string().refine((data) => {
    return Number(data) > 0;
  }, "Amount tendered must be greater than zero."),
});

export type CustomerInfoTypes = z.infer<typeof customerInfoValidation>;
