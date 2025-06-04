export function generateCode() {
  const timestamp = Date.now().toString().slice(-4); //4digits
  const random = Math.floor(1000 + Math.random() * 2000); //4digits
  const code = `${timestamp}${random}`;
  return code;
}
