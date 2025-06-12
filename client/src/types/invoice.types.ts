export type ReceiptType = {
  id: number;
  invoice_code: string;
  customer_id: number;
  customer_paid: string;
  is_deleted: number;
  user_id: number;
  orders_sum_total_price: string;
  created_at: string; // ISO date string
  updated_at: string;
  customer: {
    id: number;
    name: string;
  } | null;
  cashier: {
    id: number;
    employer_name: string;
  };
  ratings: {
    id: number;
    rating: number;
  } | null;
};

export type ReceiptMail = {
  invoice_code: string;
  createdAt: Date;
  cashier: string;
  subtotal: string;
  customer_paid: string;
  customer_name: string;
  customer_email: string;
  total_amount: string;
  amount_change: string;
};
