import { create } from 'zustand';

interface UIState {
  isLoading: boolean;
  modalVisible: boolean;
  modalType: 'premium-upsell' | 'confirm' | null;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  
  // Actions
  setLoading: (loading: boolean) => void;
  showModal: (type: UIState['modalType']) => void;
  hideModal: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  modalVisible: false,
  modalType: null,
  toast: null,
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  showModal: (type) => set({ modalVisible: true, modalType: type }),
  hideModal: () => set({ modalVisible: false, modalType: null }),
  
  showToast: (message, type) => set({ toast: { message, type } }),
  hideToast: () => set({ toast: null }),
}));
