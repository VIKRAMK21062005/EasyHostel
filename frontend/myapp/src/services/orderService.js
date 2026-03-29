import api from './api';
import { API_ENDPOINTS } from '../utils/constant';

export const orderService = {
  // Regular product order
  placeOrder: async (orderData) => {
    const response = await api.post(API_ENDPOINTS.PLACE_ORDER, orderData);
    return response.data;
  },

  // Custom order
  placeCustomOrder: async (customOrderData) => {
    const response = await api.post('/orders/custom', customOrderData);
    return response.data;
  },

  // Parcel pickup request
  requestParcelPickup: async (parcelData) => {
    const response = await api.post('/orders/parcel-pickup', parcelData);
    return response.data;
  },

  // Get user orders
  getMyOrders: async () => {
    const response = await api.get(API_ENDPOINTS.MY_ORDERS);
    return response.data;
  },

  // Get all orders (admin)
  getAllOrders: async () => {
    const response = await api.get(API_ENDPOINTS.ALL_ORDERS);
    return response.data;
  },

  // Update order status (admin)
  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`${API_ENDPOINTS.UPDATE_ORDER}/${orderId}`, { status });
    return response.data;
  },

  // Update payment status (admin)
  updatePaymentStatus: async (orderId, paymentData) => {
    const response = await api.put(`/orders/payment/${orderId}`, paymentData);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    const response = await api.put(`${API_ENDPOINTS.CANCEL_ORDER}/${orderId}`);
    return response.data;
  },
};
