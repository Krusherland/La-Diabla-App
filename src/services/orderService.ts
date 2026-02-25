import apiClient from './api';
import type { Order, CreateOrderData, OrderStatus, ApiResponse, PaginatedResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';

// Map frontend payment method values to backend values
const mapPaymentMethod = (method: string): string => {
  const mapping: Record<string, string> = {
    'cash': 'efectivo',
    'card': 'tarjeta',
    'transfer': 'transferencia',
    'mercadopago': 'mercadopago',
  };
  return mapping[method] || 'efectivo';
};

// Map backend order status to frontend status
const mapOrderStatusToFrontend = (backendStatus: string): OrderStatus => {
  const mapping: Record<string, OrderStatus> = {
    'pendiente': 'pending',
    'preparando': 'preparing',
    'enviado': 'ready',      // enviado (shipped) maps to ready
    'entregado': 'delivered',
    'cancelado': 'cancelled',
  };
  return mapping[backendStatus] || 'pending';
};

// Map frontend order status to backend status
const mapOrderStatusToBackend = (frontendStatus: OrderStatus): string => {
  const mapping: Record<OrderStatus, string> = {
    'pending': 'pendiente',
    'preparing': 'preparando',
    'ready': 'enviado',
    'delivered': 'entregado',
    'cancelled': 'cancelado',
  };
  return mapping[frontendStatus] || 'pendiente';
};

// Transform backend order to frontend order format
const transformOrder = (backendOrder: any): Order => {
  return {
    id: backendOrder.id,
    userId: backendOrder.user_id || 0,
    customerName: backendOrder.customer_name || backendOrder.customerName,
    customerEmail: backendOrder.customer_email || backendOrder.customerEmail,
    customerPhone: backendOrder.customer_phone || backendOrder.customerPhone,
    deliveryAddress: backendOrder.delivery_address || backendOrder.deliveryAddress,
    status: mapOrderStatusToFrontend(backendOrder.order_status || backendOrder.status),
    subtotal: parseFloat(backendOrder.subtotal),
    tax: parseFloat(backendOrder.tax || 0),
    total: parseFloat(backendOrder.total),
    notes: backendOrder.notes,
    createdAt: backendOrder.created_at || backendOrder.createdAt,
    updatedAt: backendOrder.updated_at || backendOrder.updatedAt,
    items: (backendOrder.order_items || backendOrder.orderItems || backendOrder.items || []).map((item: any) => {
      const productImage = item.product?.image || item.productImage || '';
      return {
        id: item.id,
        productId: item.product_id || item.productId,
        productName: item.product_name || item.productName,
        productImage: productImage ? `${API_BASE_URL}/storage/${productImage}` : '',
        quantity: item.quantity,
        price: parseFloat(item.product_price || item.price),
        subtotal: parseFloat(item.subtotal),
      };
    }),
  };
};

export const orderService = {
  // Create new order
  createOrder: async (orderData: CreateOrderData): Promise<Order> => {
    // Transform data from frontend camelCase to backend snake_case
    const backendData = {
      customer_name: orderData.customerName,
      customer_email: orderData.customerEmail,
      customer_phone: orderData.customerPhone,
      delivery_address: orderData.deliveryAddress,
      payment_method: mapPaymentMethod(orderData.paymentMethod),
      delivery_fee: orderData.deliveryFee || 0,
      notes: orderData.notes,
      items: orderData.items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
    };

    const response = await apiClient.post<ApiResponse<any>>('/orders', backendData);
    if (response.data.success && response.data.data) {
      return transformOrder(response.data.data);
    }
    throw new Error(response.data.message || 'Failed to create order');
  },

  // Get all orders (admin)
  getAllOrders: async (page: number = 1, limit: number = 20): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get<any>(`/admin/orders`);
    // Backend returns { status: 'success', orders: [...], statistics: {...} }
    if (response.data.status === 'success' && response.data.orders) {
      const total = response.data.statistics.total_orders || response.data.orders.length;
      return {
        data: response.data.orders.map(transformOrder),
        total: total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit),
      };
    }
    throw new Error('Failed to fetch orders');
  },

  // Get user's orders
  getUserOrders: async (userEmail: string): Promise<Order[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>(`/orders/user/${encodeURIComponent(userEmail)}`);
    if (response.data.success && response.data.data) {
      return response.data.data.map(transformOrder);
    }
    return [];
  },

  // Get order by ID
  getOrderById: async (id: number): Promise<Order> => {
    const response = await apiClient.get<any>(`/orders/${id}`);
    // Backend returns { success: true, data: {...} }
    if (response.data.success && response.data.data) {
      return transformOrder(response.data.data);
    }
    throw new Error('Order not found');
  },

  // Track order (public - by order ID and email)
  trackOrder: async (orderId: number, email: string): Promise<Order> => {
    const response = await apiClient.post<any>('/orders/track', {
      orderId,
      email,
    });
    // Backend returns { success: true, data: {...} }
    if (response.data.success && response.data.data) {
      return transformOrder(response.data.data);
    }
    throw new Error('Pedido no encontrado o el email no coincide');
  },

  // Update order status (admin)
  updateOrderStatus: async (id: number, status: OrderStatus): Promise<Order> => {
    const response = await apiClient.put<any>(`/admin/orders/${id}/status`, {
      order_status: mapOrderStatusToBackend(status),
    });
    // Backend returns { status: 'success', order: {...} }
    if (response.data.status === 'success' && response.data.order) {
      return transformOrder(response.data.order);
    }
    throw new Error(response.data.message || 'Failed to update order status');
  },

  // Cancel order
  cancelOrder: async (id: number): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<any>>(`/orders/${id}/cancel`);
    if (response.data.success && response.data.data) {
      return transformOrder(response.data.data);
    }
    throw new Error(response.data.message || 'Failed to cancel order');
  },

  // Get order statistics (admin)
  getOrderStats: async (): Promise<any> => {
    const response = await apiClient.get<any>('/admin/orders/statistics');
    // Backend returns { status: 'success', statistics: {...} }
    if (response.data.status === 'success' && response.data.statistics) {
      return response.data.statistics;
    }
    return null;
  },
};
