export const API_BASE_URL = 'https://easyhostel-v1.onrender.com/api';

export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  
  // Products
  GET_PRODUCTS: '/products/get',
  CREATE_PRODUCT: '/products/create',
  UPDATE_PRODUCT: '/products/update',
  DELETE_PRODUCT: '/products/delete',
  
  // Orders
  PLACE_ORDER: '/orders/place',
  MY_ORDERS: '/orders/my-orders',
  ALL_ORDERS: '/orders/all',
  UPDATE_ORDER: '/orders/update',
  CANCEL_ORDER: '/orders/cancel',
};

export const ORDER_STATUS = {
  PENDING: 'Pending',
  ASSIGNED: 'Assigned',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export const USER_ROLES = {
  ADMIN: 'Admin',
  STUDENT: 'Student',
};