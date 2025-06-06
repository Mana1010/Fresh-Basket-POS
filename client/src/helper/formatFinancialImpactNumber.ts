import type { ReasonType } from "../types/inventory.types";
import { formatToPhpMoney } from "../utils/format-to-money";
export function formatFinancialImpactNumber(value: string, reason: ReasonType) {
  const isNegative = value.startsWith("-");
  const parsedValue = parseFloat(value).toFixed(2);

  return isNegative && reason === "customer_sale"
    ? `+${formatToPhpMoney(parsedValue.toString().slice(1))}`
    : isNegative
    ? `-${formatToPhpMoney(parsedValue.toString().slice(1))}`
    : `-${formatToPhpMoney(parsedValue.toString())}`;
}
