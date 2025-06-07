import RecordBox from "../../../../components/RecordBox";
import {
  formatToFormalNumber,
  formatToPhpMoney,
} from "../../../../../../utils/format-to-money";
import { useProductStore } from "../../../../../../store/product.store";
import { useMemo } from "react";
import { calculateTotalPrice } from "../../../../../../utils/total-price";
import { IoCash } from "react-icons/io5";
function OrderTotalRecords() {
  const { orderProducts } = useProductStore();

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
    const total_product = orderProducts.reduce(
      (total, { inventories_sum_stock }) => {
        total += Number(inventories_sum_stock);
        return total;
      },
      0
    );
    return { subtotal, grand_total, total_discount, total_tax, total_product };
  }, [orderProducts]);

  return (
    <div className="flex-grow grid grid-cols-3 items-center justify-center gap-2 h-full">
      <RecordBox
        label="Subtotal"
        value={formatToPhpMoney(String(orderStats.subtotal))}
        className="bg-transparent rounded-sm w-full truncate"
      />
      <RecordBox
        label="Total Discount"
        value={formatToPhpMoney(String(orderStats.total_discount))}
        className="bg-transparentrounded-sm w-full truncate"
      />
      <RecordBox
        label="Total Tax"
        value={formatToPhpMoney(String(orderStats.total_tax))}
        textClassName="text-red-400"
        className="bg-transparent rounded-sm w-full truncate"
      />

      <RecordBox
        label="Grand Total"
        value={formatToPhpMoney(String(orderStats.grand_total))}
        textClassName="text-green-400"
        Icon={IoCash}
        className="bg-transparent rounded-sm w-full truncate col-span-2"
      />

      <RecordBox
        label="Total Products"
        value={formatToFormalNumber(String(orderStats.total_product))}
        className="bg-transparent rounded-sm w-ful2"
      />
    </div>
  );
}

export default OrderTotalRecords;
