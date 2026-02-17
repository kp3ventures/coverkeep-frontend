import { apiClient } from './client';
import { WarrantyClaim } from '../types';

export const claimApi = {
  // Get all claims for user
  getClaims: async (): Promise<WarrantyClaim[]> => {
    const response = await apiClient.get('/claims');
    return response.data;
  },

  // Get single claim
  getClaim: async (id: string): Promise<WarrantyClaim> => {
    const response = await apiClient.get(`/claims/${id}`);
    return response.data;
  },

  // Create draft claim
  createDraft: async (claim: Partial<WarrantyClaim>): Promise<WarrantyClaim> => {
    const response = await apiClient.post('/claims/draft', claim);
    return response.data;
  },

  // Submit claim
  submitClaim: async (id: string): Promise<WarrantyClaim> => {
    const response = await apiClient.post(`/claims/${id}/submit`);
    return response.data;
  },

  // Update claim
  updateClaim: async (id: string, updates: Partial<WarrantyClaim>): Promise<WarrantyClaim> => {
    const response = await apiClient.patch(`/claims/${id}`, updates);
    return response.data;
  },

  // AI assistance for claim
  getAIAssistance: async (productId: string, issue: string): Promise<{ suggestions: string[] }> => {
    const response = await apiClient.post('/claims/ai-assist', { productId, issue });
    return response.data;
  },
};
