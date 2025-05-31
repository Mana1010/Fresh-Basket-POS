export function dateFormat(date: Date) {
  const formatted = new Intl.DateTimeFormat("en-US", {
    month: "long", // May
    day: "numeric", // 31
    year: "numeric", // 2025
    hour: "numeric", // 3
    minute: "2-digit", // 24
    hour12: true, // PM/AM format
  }).format(date);
  return formatted;
}
