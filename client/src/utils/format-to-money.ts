export function formatToPhpMoney(value: string) {
  const format = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(Number(value ?? 0));
  return format;
}

export function formatToFormalNumber(value: string) {
  const format = new Intl.NumberFormat().format(Number(value ?? 0));

  return format;
}
