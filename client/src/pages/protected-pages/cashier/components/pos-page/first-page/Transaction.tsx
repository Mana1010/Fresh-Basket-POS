import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IoBarcode, IoCube } from "react-icons/io5";
import { transactionPanelValidation } from "../../../../../../validation/order.validation";
import { useProductStore } from "../../../../../../store/product.store";
import type { FullProductDetailsTypePos } from "../../../../../../types/product.types";
function Transaction() {
  const {
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      quantity: 1,
      barcode: "50012500",
    },
    resolver: zodResolver(transactionPanelValidation),
  });
  const {
    productsMap,
    setOrderProducts,
    setLastScannedItem,
    orderProducts,
    updateOrderProduct,
  } = useProductStore();
  return (
    <div className="w-full h-full basis-[35%] border border-zinc-200 p-2 flex flex-col shrink-0 rounded-sm">
      <h1 className="text-[0.7rem] text-secondary poppins-extrabold">
        Transaction Panel
      </h1>
      <form
        onSubmit={handleSubmit((data) => {
          const newOrder = productsMap.get(data.barcode);
          if (!newOrder) {
            setError("barcode", {
              message: "Product Barcode not found",
            });
            return;
          }
          if (data.quantity > Number(newOrder.inventories_sum_stock)) {
            setError("quantity", {
              message:
                Number(newOrder.inventories_sum_stock) === 0
                  ? "No stock left."
                  : `Not enough stock. Only ${newOrder.inventories_sum_stock} left.`,
            });
            return;
          }
          const isProductAlreadyOrdered = orderProducts.find(
            (order) => order.id === newOrder.id
          );
          if (isProductAlreadyOrdered) {
            updateOrderProduct(newOrder.id, {
              ...newOrder,
              inventories_sum_stock: String(
                Number(data.quantity) +
                  Number(isProductAlreadyOrdered.inventories_sum_stock)
              ),
            });
          } else if (!isProductAlreadyOrdered) {
            setOrderProducts({
              ...newOrder,
              inventories_sum_stock: String(data.quantity),
            } as FullProductDetailsTypePos);
          }
          setLastScannedItem({
            ...newOrder,
            inventories_sum_stock: String(data.quantity),
          } as FullProductDetailsTypePos);
          // const findOrderedProducts = orderProducts.find(
          //   (product) => product.barcode === newOrder.barcode
          // );
          //We are overwriting the products map to change or update the stock
          productsMap.set(newOrder.barcode, {
            ...newOrder,
            inventories_sum_stock: String(
              Number(newOrder.inventories_sum_stock) - Number(data.quantity)
            ),
          });
          reset();
        })}
        className="flex flex-col pt-2 px-1.5 space-y-2"
      >
        <div className="grid grid-cols-1 items-center justify-center gap-1.5">
          <div className="block space-y-0.5">
            <div className="flex items-center justify-between space-x-1 w-full border border-zinc-200">
              <label
                htmlFor="barcode"
                className="p-2 bg-primary text-white text-lg"
              >
                <IoBarcode />
              </label>
              <input
                {...register("barcode")}
                type="text"
                id="barcode"
                placeholder="Product Barcode"
                className=" text-[0.8rem] outline-none p-1.5 bg-transparent text-secondary flex-grow poppins-bold"
              />
            </div>
            {errors.barcode && (
              <p className="text-[0.65rem] text-red-500">
                {errors.barcode.message}
              </p>
            )}
          </div>
          <div className="block space-y-0.5">
            <div className="flex items-center justify-between space-x-1 w-full border border-zinc-200">
              <label
                htmlFor="quantity"
                className="p-2 bg-primary text-white text-lg"
              >
                <IoCube />
              </label>
              <input
                {...register("quantity")}
                name="quantity"
                type="number"
                id="quantity"
                placeholder="Product Quantity"
                className=" text-[0.8rem] outline-none p-1.5 bg-transparent text-secondary flex-grow poppins-bold"
              />
            </div>
            {errors.quantity && (
              <p className="text-[0.65rem] text-red-500">
                {errors.quantity.message}
              </p>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="self-end px-2 py-1.5 text-sm bg-primary text-white rounded-sm w-1/2 cursor-pointer"
        >
          Enter
        </button>
      </form>
    </div>
  );
}

export default Transaction;
