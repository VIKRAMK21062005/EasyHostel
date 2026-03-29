import { useState, useEffect } from 'react';
import { productService } from '../services/productService';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data.allProducts || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const createProduct = async (formData) => {
    try {
      const data = await productService.createProduct(formData);
      await fetchProducts();
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create product');
    }
  };

  const updateProduct = async (id, formData) => {
    try {
      const data = await productService.updateProduct(id, formData);
      await fetchProducts();
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update product');
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productService.deleteProduct(id);
      await fetchProducts();
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete product');
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};