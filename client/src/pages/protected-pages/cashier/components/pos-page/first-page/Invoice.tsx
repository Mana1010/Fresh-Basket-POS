import { useMemo } from "react";
import { useProductStore } from "../../../../../../store/product.store";
import { calculateTotalPrice } from "../../../../../../utils/total-price";
import { formatToPhpMoney } from "../../../../../../utils/format-to-money";
import { useModalStore } from "../../../../../../store/modal.store";

function Invoice() {
  const { orderProducts } = useProductStore();
  const { setCurrentPage } = useModalStore();
  const orderStats = useMemo(() => {
    const subtotal = orderProducts.reduce(
      (total_price, { price, inventories_sum_stock }) => {
        const total =
          total_price + Number(price ?? 0) * Number(inventories_sum_stock ?? 0);
        return total;
      },
      0
    );
    const total_discount = orderProducts.reduce(
      (acc, { price, discount_rate = 0, inventories_sum_stock }) => {
        const discount = Number(discount_rate) / 100;
        const subtotal = Number(price) * Number(inventories_sum_stock); /// total price before discount
        const total = subtotal * discount;
        return acc + total;
      },
      0
    );

    const total_tax = orderProducts.reduce(
      (acc, { price, tax_rate = 0, inventories_sum_stock }) => {
        const tax = Number(tax_rate) / 100;
        const subtotal = Number(price) * Number(inventories_sum_stock); // total price before tax
        const total = subtotal * tax;

        return acc + total;
      },
      0
    );
    const grand_total = orderProducts.reduce(
      (
        total,
        { price, discount_rate = 0, tax_rate = 0, inventories_sum_stock }
      ) => {
        const quantity = Number(inventories_sum_stock ?? 0);
        const basePrice = Number(price ?? 0) * quantity;
        const calculation = calculateTotalPrice({
          orig_price: String(basePrice),
          discount_rate,
          tax_rate,
        });
        return total + calculation;
      },
      0
    );
    return { subtotal, grand_total, total_discount, total_tax };
  }, [orderProducts]);
  return (
    <div className="flex-grow w-full flex flex-col bg-white shadow-sm border border-zinc-400/35 p-2 gap-2">
      <h1 className="text-[0.7rem] text-secondary poppins-extrabold">
        Order Summary
      </h1>
      <div className="flex-grow w-full flex flex-col gap-1.5 h-1 overflow-y-auto">
        <div className="flex justify-between items-center">
          <h4 className="text-secondary text-[0.65rem] poppins-bold">
            Subtotal
          </h4>
          <span className="text-secondary text-[0.7rem] poppins-semibold">
            {formatToPhpMoney(String(orderStats.subtotal))}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <h4 className="text-secondary text-[0.65rem] poppins-bold">
            Total Discount
          </h4>
          <span className="text-secondary text-[0.7rem] poppins-semibold">
            {formatToPhpMoney(String(orderStats.total_discount))}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <h4 className="text-secondary text-[0.65rem] poppins-bold">
            Total Tax
          </h4>
          <span className="text-secondary text-[0.7rem] poppins-semibold">
            {formatToPhpMoney(String(orderStats.total_tax))}
          </span>
        </div>

        <div className="border-primary/70 border-b-2 border-dotted" />
        <div className="flex justify-between items-center">
          <h4 className="text-secondary text-[0.65rem] poppins-semibold">
            Total Amount
          </h4>
          <span className="text-primary text-[0.8rem] poppins-extrabold">
            {formatToPhpMoney(String(orderStats.grand_total))}
          </span>
        </div>
      </div>

      <button
        disabled={orderProducts.length === 0}
        onClick={() => setCurrentPage("proceed_to_payment")}
        className="self-end justify-self-end w-1/2 cursor-pointer bg-primary text-white disabled:cursor-default disabled:text-zinc-200 py-1.5 text-sm rounded-sm hover:bg-primary/90 transition-colors duration-200 disabled:bg-zinc-700/60"
      >
        <span className="text-[0.8rem] poppins-bold">Proceed to Pay</span>
      </button>
    </div>
  );
}

export default Invoice;
