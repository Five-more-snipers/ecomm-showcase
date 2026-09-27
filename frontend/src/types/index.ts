export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  iconName: string;
}

export interface Product {
  id: number;
  sku: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  isFeatured: boolean;
  isActive: boolean;
  category: Category;
  stockAvailable: number;
}

export interface CartItem {
  id: number;
  productId: number;
  title: string;
  sku: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Cart {
  cartId: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

export type PaymentMethod = 'MOCK_CREDIT_CARD' | 'MOCK_BANK_TRANSFER' | 'MOCK_CASH_ON_DELIVERY';
export type SimulationMode = 'AUTO' | 'FORCE_SUCCESS' | 'FORCE_DECLINE' | 'FORCE_TIMEOUT';

export interface PaymentRequest {
  paymentMethod: PaymentMethod;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  simulationMode?: SimulationMode;
}

export interface CheckoutRequest {
  cartId: string;
  customerEmail: string;
  customerName: string;
  phone?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  payment: PaymentRequest;
}

export type OrderStatus =
  | 'PENDING'
  | 'PAYMENT_CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'PAYMENT_FAILED'
  | 'CANCELLED';

export interface OrderItem {
  id: number;
  productId: number;
  title: string;
  sku: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  orderId: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  paymentMethod?: string;
  paymentStatus?: string;
  transactionRef?: string;
  createdAt: string;
  items: OrderItem[];
}

export interface StatusStep {
  status: OrderStatus;
  label: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface OrderTracking {
  orderNumber: string;
  currentStatus: OrderStatus;
  currentStepIndex: number;
  steps: StatusStep[];
}

export type UserRole = 'CUSTOMER' | 'MODERATOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  createdAt: string;
}

export interface StoredUserRecord extends User {
  passwordHash: string;
  salt: string;
}

