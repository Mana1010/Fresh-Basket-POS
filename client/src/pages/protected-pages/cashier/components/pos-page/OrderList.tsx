import { useProductStore } from "../../../../../store/product.store";
import { formatToPhpMoney } from "../../../../../utils/format-to-money";
import { calculateTotalPrice } from "../../../../../utils/total-price";
import { IoCartOutline, IoTrash } from "react-icons/io5";

function OrderList() {
  const { orderProducts, removeOrderProduct } = useProductStore();
  return (
    <div className="flex-grow h-1 w-full flex flex-col overflow-y-auto">
      <table className="w-full">
        <thead className="product-thead-orderlist">
          <tr>
            <td className=" rounded-l-sm">Product</td>
            <td>Category</td>
            <td>Quantity</td>
            <td>Price</td>
            <td>Total Price</td>
            <td className="rounded-r-sm">Action</td>
          </tr>
        </thead>
        <tbody className="product-tbody">
          {orderProducts.map((product, i) => (
            <tr key={i} className="border-b border-zinc-200">
              <td>{product.product_name}</td>
              <td>{product.category_name}</td>
              <td>{product.inventories_sum_stock}</td>

              <td>{formatToPhpMoney(String(product.price))}</td>
              <td>
                {formatToPhpMoney(
                  String(
                    calculateTotalPrice({
                      orig_price: String(
                        product.price * Number(product.inventories_sum_stock)
                      ),
                      discount_rate: product.discount_rate as number,
                      tax_rate: product.tax_rate as number,
                    })
                  )
                )}
              </td>
              <td className="flex items-center justify-center">
                <button
                  onClick={() => removeOrderProduct(product.id)}
                  className="flex space-x-1 py-1.5 px-2.5 text-white bg-red-500 items-center justify-center rounded-sm"
                >
                  <span>
                    {" "}
                    <IoTrash />
                  </span>
                  <span className="text-[0.65rem]">Remove</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orderProducts.length === 0 && (
        <div className="flex-grow justify-center items-center flex-col w-full flex gap-2">
          <span className="text-primary text-4xl">
            <IoCartOutline />
          </span>
          <span className="text-zinc-800/60 text-md poppins-semibold">
            {" "}
            No orders have been made.
          </span>
        </div>
      )}
    </div>
  );
}

export default OrderList;
