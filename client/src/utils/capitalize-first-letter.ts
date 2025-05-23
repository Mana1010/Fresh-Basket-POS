export function capitalizeFirstLetter(word: string | null) {
  if (!word) return "Null";
  return word.charAt(0).toUpperCase() + word.slice(1);
}
