import type { FullProductDetailsType } from "./product.types";

export type StockType = "in" | "out";
export type ReasonType =
  | "supplier_delivery"
  | "damaged_or_spoiled"
  | "customer_sale";
export interface FullInventoryDetails
  extends Pick<
    FullProductDetailsType,
    "id" | "product_name" | "sku" | "product_thumbnail" | "manufacturer"
  > {
  id: number;
  product_id: number;
  stock: number;
  type: StockType;
  reason: ReasonType;
  financial_impact: string;
  is_deleted: number;
  created_at: Date;
  updated_at: Date;
}
export interface EditInventoryDetailsType
  extends Omit<
    FullProductDetailsType,
    "id" | "product_name" | "sku" | "product_thumbnail" | "manufacturer"
  > {
  product: Pick<
    FullProductDetailsType,
    | "id"
    | "product_name"
    | "sku"
    | "product_thumbnail"
    | "manufacturer"
    | "barcode"
  >;
}
