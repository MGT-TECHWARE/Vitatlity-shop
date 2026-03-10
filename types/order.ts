export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "unpaid" | "paid" | "failed" | "refunded";

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: string;
  user_id: string | null;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  stripe_payment_intent_id: string | null;
  shipping_address: ShippingAddress;
  tracking_number: string | null;
  customer_email: string;
  customer_name: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}
