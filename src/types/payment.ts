export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface PaymentOrder {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  receipt: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId: string;
  orderId: string;
  signature: string;
  message: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
}
