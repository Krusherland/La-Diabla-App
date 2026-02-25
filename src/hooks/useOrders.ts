import { useState, useEffect } from 'react';
import type { Order, OrderStatus } from '../types';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      if (user.role === 'admin') {
        const response = await orderService.getAllOrders();
        setOrders(response.data);
      } else {
        const data = await orderService.getUserOrders(user.email);
        setOrders(data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const refetch = () => {
    fetchOrders();
  };

  return {
    orders,
    loading,
    error,
    refetch,
  };
};

export const useOrder = (id: number) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getOrderById(id);
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const updateStatus = async (status: OrderStatus) => {
    try {
      const updatedOrder = await orderService.updateOrderStatus(id, status);
      setOrder(updatedOrder);
      return updatedOrder;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update order status');
    }
  };

  return {
    order,
    loading,
    error,
    updateStatus,
    refetch: fetchOrder,
  };
};
