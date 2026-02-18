export function generateInvoiceNo() {
  const y = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `INV-${y}-${rand}`;
}

export function generateReceiptNo() {
  const y = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `REC-${y}-${rand}`;
}