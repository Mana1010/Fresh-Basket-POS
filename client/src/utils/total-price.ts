type CalculateTotalPriceProps = {
  orig_price: string;
  discount_rate: number;
  tax_rate: number;
};

export function calculateTotalPrice({
  orig_price,
  discount_rate,
  tax_rate,
}: CalculateTotalPriceProps) {
  const discountRate = Number(discount_rate) / 100;
  const taxRate = Number(tax_rate) / 100;
  const price = Number(orig_price);
  const discountedPrice = price * (1 - discountRate);
  return discountedPrice * (1 + taxRate);
}
