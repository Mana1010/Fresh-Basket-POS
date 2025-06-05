import React from "react";
import { CgArrowsExchangeAltV } from "react-icons/cg";

function OrderList() {
  return (
    <div>
      <table className="w-full">
        <thead className="product-thead-orderlist">
          <tr>
            <td className="relative rounded-l-md">
              <div className="flex items-center justify-center space-x-1">
                <span>Product</span>
                <button
                  className={`p-2 ring ring-zinc-200/5 rounded-full cursor-pointer text-lg transition-colors duration-150"`}
                >
                  <CgArrowsExchangeAltV />
                </button>
              </div>
            </td>
            <td>Sku</td>
            <td>Barcode</td>
            <td>Quantity</td>
            <td className="rounded-r-md">Price</td>
          </tr>
        </thead>
        <tbody className="product-tbody">
          <tr>
            <td>Apple 3xl</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default OrderList;
