// Product Types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
  createdAt?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

// User & Auth Types
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'customer' | 'admin';
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

// Order Types
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  userId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'mercadopago';

export interface CreateOrderData {
  items: CartItem[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
  deliveryFee?: number;
  notes?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Form Types
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface Location {
  id: number;
  name: string;
  address: string;
  phone: string;
  hours: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}
