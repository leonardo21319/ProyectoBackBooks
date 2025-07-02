// ============================================
// 📁 CREAR: src/app/models/Payment.model.ts
// ============================================

export interface PaymentData {
  cardNumber: string;
  expirationMonth: string;
  expirationYear: string;
  cvc: string;
  country: string;
  postalCode: string;
  email: string;
  name: string;
  address: string;
  city: string;
  state: string;
}

export interface OrderItem {
  id: number;
  title: string;
  author: string;
  price: number;
  quantity: number;
  image: string;
  isbn?: string;
  editorial?: string;
}

export interface OrderSummary {
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number; // ✨ SIN IMPUESTOS - total = subtotal + shipping
}

export interface PaymentRequest {
  paymentData: PaymentData;
  orderSummary: OrderSummary;
  userId: number;
  paymentMethod: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  orderId?: string;
  transactionId?: string;
  pdfUrl?: string;
  error?: string;
}

export interface Order {
  id: string;
  userId: number;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  billingAddress: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  createdAt: Date;
  updatedAt: Date;
  transactionId?: string;
  pdfTicketUrl?: string;
}