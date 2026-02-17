import { apiClient } from './client';
import { Product, AIIdentificationResult } from '../types';

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
  identifyProduct: async (imageBase64: string, userId: string): Promise<AIIdentificationResult> => {
    console.log('[AI Scan] Calling API:', apiClient.defaults.baseURL + '/products/identify');
    console.log('[AI Scan] Image size:', imageBase64.length, 'characters');
    console.log('[AI Scan] User ID:', userId);
    
    const response = await apiClient.post('/products/identify', {
      image: imageBase64,
      userId: userId, // CRITICAL: Backend requires userId!
    }, {
      timeout: 30000, // 30 second timeout for AI processing
    });
    
    console.log('[AI Scan] API Response:', response.status, response.data);
    
    // Backend returns { success: true, product: {...}, error: null }
    // Extract the product object
    if (response.data.success && response.data.product) {
      return response.data.product as AIIdentificationResult;
    } else if (response.data.error) {
      throw new Error(response.data.error.message || 'Failed to identify product');
    } else {
      throw new Error('Invalid API response format');
    }
  },
};
