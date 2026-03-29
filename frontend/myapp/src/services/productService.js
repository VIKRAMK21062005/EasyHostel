import api from './api';
import { API_ENDPOINTS } from '../utils/constant';

export const productService = {
  getAllProducts: async () => {
    const response = await api.get(API_ENDPOINTS.GET_PRODUCTS);
    return response.data;
  },

  createProduct: async (formData) => {
    const response = await api.post(API_ENDPOINTS.CREATE_PRODUCT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateProduct: async (id, formData) => {
    const response = await api.put(`${API_ENDPOINTS.UPDATE_PRODUCT}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`${API_ENDPOINTS.DELETE_PRODUCT}/${id}`);
    return response.data;
  },
};