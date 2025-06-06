import React from "react";
import { useProductStore } from "../../../../../store/product.store";
import { formatToPhpMoney } from "../../../../../utils/format-to-money";
import { calculateTotalPrice } from "../../../../../utils/total-price";

function LastScannedItem() {
  const { lastScannedItem } = useProductStore();
  //   const lastScannedItem = {
  //     id: 34,
  //     barcode: "09251865",
  //     product_name: "Grapes",
  //     sku: "Grapes-21",
  //     price: "2332.00",
  //     discount_rate: 25,
  //     tax_rate: 25,
  //     product_category_id: 3,
  //     category_name: "Chicken",
  //     manufacturer: "Vinland Company",
  //     product_thumbnail: null,
  //     inventories_sum_stock: "5",
  //     created_at: "2025-06-01T08:29:01.000000Z",
  //     updated_at: "2025-06-04T04:31:03.000000Z",
  //   };
  console.log(lastScannedItem);
  return (
    <div className="w-full h-full basis-[25%] border border-zinc-200 p-2 flex flex-col shrink-0 rounded-smy">
      <h1 className="text-[0.7rem] text-secondary poppins-extrabold">
        Last Scanned Item{" "}
      </h1>
      <div className="flex-grow flex items-center">
        {!lastScannedItem ? (
          <span className="text-secondary">No Item Yet</span>
        ) : (
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col">
              <h2 className=" poppins-semibold space-x-2 flex items-center">
                <span className="text-primary text-sm poppins-semibold">
                  {" "}
                  {lastScannedItem.product_name}
                </span>
                <span className="text-secondary text-[0.9rem] poppins-extrabold">
                  {lastScannedItem.inventories_sum_stock}x
                </span>
              </h2>
              <h4 className="text-zinc-400 text-[0.7rem]">
                {lastScannedItem.sku}
              </h4>
              <h4 className="text-zinc-400 text-[0.7rem]">
                {lastScannedItem.barcode}
              </h4>
            </div>
            <div className="flex flex-col space-y-0.5 justify-start items-end">
              <h5 className=" text-secondary/85 text-end text-[0.8rem]">
                <span className="text-[0.6rem]">Subtotal: </span>
                <span className="text-[0.75rem] poppins-semibold line-through">
                  {" "}
                  {formatToPhpMoney(
                    String(
                      Number(lastScannedItem?.price) *
                        Number(lastScannedItem.inventories_sum_stock)
                    )
                  )}
                </span>
              </h5>
              {lastScannedItem?.tax_rate === 0 ? (
                <h6 className="flex space-x-1.5 text-secondary/75 items-center">
                  <span className="text-[0.6rem]">No Tax Rate</span>
                </h6>
              ) : (
                <h6 className="flex space-x-1.5 text-secondary/75 items-center">
                  <span className="text-[0.6rem]">Tax Rate: </span>
                  <span className="text-[0.7em]">
                    {lastScannedItem?.tax_rate}%
                  </span>
                </h6>
              )}
              {lastScannedItem?.discount_rate === 0 ? (
                <h6 className="flex space-x-1.5 text-secondary/75 items-center">
                  <span className="text-[0.6rem]">No Discount Rate</span>
                </h6>
              ) : (
                <h6 className="flex space-x-1.5 text-secondary/75 items-center">
                  <span className="text-[0.6rem]">Discount Rate: </span>
                  <span className="text-[0.7rem]">
                    {lastScannedItem?.discount_rate}%
                  </span>
                </h6>
              )}
              <div className="h-[1.5px] w-[100px] bg-secondary/45" />
              <h6 className="flex space-x-1.5 text-secondary items-center">
                <span className="text-[0.6rem]">Total Price: </span>
                <span className="text-[0.75rem] poppins-semibold">
                  {formatToPhpMoney(
                    String(
                      calculateTotalPrice({
                        orig_price: lastScannedItem?.price as unknown as string,
                        discount_rate: lastScannedItem?.discount_rate as number,
                        tax_rate: lastScannedItem?.tax_rate as number,
                      }) * Number(lastScannedItem.inventories_sum_stock)
                    )
                  )}
                </span>
              </h6>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LastScannedItem;
