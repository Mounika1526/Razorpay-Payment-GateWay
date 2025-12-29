import { Product, PaymentOrder, PaymentResponse } from "@/types/payment";

// Dummy product data
const products: Product[] = [
  {
    id: "1",
    name: "Premium Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 2999,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    category: "Electronics",
  },
  {
    id: "2",
    name: "Smart Watch",
    description: "Feature-rich smartwatch with health tracking",
    price: 4999,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    category: "Electronics",
  },
  {
    id: "3",
    name: "Laptop Backpack",
    description: "Durable and spacious backpack for your laptop",
    price: 1499,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
    category: "Accessories",
  },
  {
    id: "4",
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with precision tracking",
    price: 899,
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80",
    category: "Electronics",
  },
  {
    id: "5",
    name: "USB-C Hub",
    description: "7-in-1 USB-C hub with multiple ports",
    price: 1999,
    image:
      "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&q=80",
    category: "Accessories",
  },
  {
    id: "6",
    name: "Mechanical Keyboard",
    description: "RGB mechanical keyboard with custom switches",
    price: 3499,
    image:
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80",
    category: "Electronics",
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  console.log("Fetching products...");
  await delay(500);
  return products;
};

// Get single product
export const getProduct = async (id: string): Promise<Product | undefined> => {
  console.log(`Fetching product with id: ${id}`);
  await delay(300);
  return products.find((p) => p.id === id);
};

// Create payment order (simulates backend API call to create Razorpay order)
export const createPaymentOrder = async (
  productId: string,
  amount: number
): Promise<PaymentOrder> => {
  console.log("Creating payment order...", { productId, amount });
  await delay(800);

  // In production, this would call your backend API which creates order via Razorpay API
  const orderId = `order_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  return {
    id: orderId,
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };
};

// Verify payment (simulates backend verification of Razorpay payment signature)
export const verifyPayment = async (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<PaymentResponse> => {
  console.log("Verifying payment...", {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  await delay(1000);

  // In production, this would call your backend API to verify the payment signature
  // Backend would use crypto to verify:
  // generated_signature = hmac_sha256(order_id + "|" + payment_id, secret)
  // if (generated_signature === razorpay_signature) then payment is authentic

  // For demo, we'll simulate successful verification
  return {
    success: true,
    paymentId: razorpayPaymentId,
    orderId: razorpayOrderId,
    signature: razorpaySignature,
    message: "Payment verified successfully! Your order has been confirmed.",
  };
};
