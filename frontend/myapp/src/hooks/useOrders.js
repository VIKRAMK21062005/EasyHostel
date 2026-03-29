import { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import { useAuth } from './useAuth';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let data;
      if (user?.role === 'Admin') {
        data = await orderService.getAllOrders();
        setOrders(data.orders || []);
      } else {
        data = await orderService.getMyOrders();
        setOrders(data.orders || []);
      }
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const placeOrder = async (products) => {
    try {
      const data = await orderService.placeOrder({ products });
      await fetchOrders();
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to place order');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      await fetchOrders();
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update order');
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await orderService.cancelOrder(orderId);
      await fetchOrders();
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  return {
    orders,
    loading,
    error,
    fetchOrders,
    placeOrder,
    updateOrderStatus,
    cancelOrder,
  };
};
