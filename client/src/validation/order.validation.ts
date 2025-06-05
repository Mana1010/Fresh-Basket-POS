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
