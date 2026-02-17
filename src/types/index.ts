// Core Types for CoverKeep App

export interface User {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
  createdAt: Date;
}

export interface Product {
  id: string;
  userId: string;
  name: string;
  brand: string;
  category: string;
  purchaseDate: Date;
  warrantyEndDate: Date;
  warrantyLength: number; // in months
  price?: number;
  retailer?: string;
  imageUrl?: string;
  receiptImageUrl?: string;
  barcode?: string;
  status: 'active' | 'expired' | 'expiring-soon';
  createdAt: Date;
  updatedAt: Date;
}

export interface WarrantyClaim {
  id: string;
  productId: string;
  userId: string;
  status: 'draft' | 'submitted' | 'in-progress' | 'approved' | 'rejected';
  issueDescription: string;
  claimDate: Date;
  aiSuggestions?: string[];
  documents?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  AddProduct: undefined;
  ProductDetail: { productId: string };
  WarrantyClaim: { productId: string };
  Settings: undefined;
};
