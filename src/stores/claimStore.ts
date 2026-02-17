import { create } from 'zustand';
import { WarrantyClaim, AIMessage } from '../types';

interface ClaimState {
  currentClaim: WarrantyClaim | null;
  claims: WarrantyClaim[];
  aiMessages: AIMessage[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentClaim: (claim: WarrantyClaim | null) => void;
  updateCurrentClaim: (updates: Partial<WarrantyClaim>) => void;
  addAIMessage: (message: AIMessage) => void;
  clearAIMessages: () => void;
  setClaims: (claims: WarrantyClaim[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useClaimStore = create<ClaimState>((set) => ({
  currentClaim: null,
  claims: [],
  aiMessages: [],
  isLoading: false,
  error: null,
  
  setCurrentClaim: (claim) => set({ currentClaim: claim }),
  
  updateCurrentClaim: (updates) => set((state) => ({
    currentClaim: state.currentClaim 
      ? { ...state.currentClaim, ...updates }
      : null
  })),
  
  addAIMessage: (message) => set((state) => ({
    aiMessages: [...state.aiMessages, message]
  })),
  
  clearAIMessages: () => set({ aiMessages: [] }),
  
  setClaims: (claims) => set({ claims }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
