import { apiClient } from './client';
import { Product } from '../types';

export const productApi = {
  // Get all products for user
  getProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get('/products');
    return response.data;
  },

  // Get single product
  getProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Create new product
  createProduct: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    const response = await apiClient.post('/products', product);
    return response.data;
  },

  // Update product
  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    const response = await apiClient.patch(`/products/${id}`, updates);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  // AI product identification from photo
  identifyProduct: async (imageData: string): Promise<{ name: string; brand: string; category: string }> => {
    const response = await apiClient.post('/ai/identify', { image: imageData });
    return response.data;
  },
};
