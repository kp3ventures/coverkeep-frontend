import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProductStore } from '../stores/productStore';
import { useUserStore } from '../stores/userStore';
import { useUIStore } from '../stores/uiStore';
import { BarcodeScanner } from '../components/BarcodeScanner';
import { AIProductScanner } from '../components/AIProductScanner';
import { AIIdentificationModal } from '../components/AIIdentificationModal';
import { Header } from '../components/Header';
import { productApi } from '../api/products';
import { AIIdentificationResult } from '../types';
import * as FileSystem from 'expo-file-system';

type InputMethod = 'manual' | 'barcode' | 'photo';

export const AddProductScreen = () => {
  const navigation = useNavigation();
  const { user } = useUserStore();
  const { addProduct } = useProductStore();
  const { showToast } = useUIStore();

  const [inputMethod, setInputMethod] = useState<InputMethod | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showAIScanner, setShowAIScanner] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState<string>('');
  const [isLookingUpProduct, setIsLookingUpProduct] = useState(false);
  
  // AI identification state
  const [aiResult, setAiResult] = useState<AIIdentificationResult | null>(null);
  const [showAIResultModal, setShowAIResultModal] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [warrantyMonths, setWarrantyMonths] = useState('12');
  const [price, setPrice] = useState('');
  const [retailer, setRetailer] = useState('');

  const handleBarcodeScan = async (barcode: string) => {
    setShowScanner(false);
    setScannedBarcode(barcode);
    setIsLookingUpProduct(true);
    
    showToast(`Barcode scanned: ${barcode}`, 'success');
    
    // Simulate API lookup (in real app, this would call backend)
    setTimeout(() => {
      setIsLookingUpProduct(false);
      // TODO: When backend API is ready, populate form fields here
      // For now, just show manual entry with barcode stored
      showToast('Enter product details manually', 'info');
      setInputMethod('manual');
    }, 2000);
  };

  const handlePhotoCapture = async (imageUri: string) => {
    console.log('[AI Scan] Photo captured:', imageUri);
    setShowAIScanner(false);
    setIsProcessingAI(true);
    setShowAIResultModal(true);
    setAiError(null);

    try {
      console.log('[AI Scan] Step 1: Converting image to base64...');
      
      // Convert image to base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log('[AI Scan] Step 2: Base64 conversion successful, size:', base64.length);
      console.log('[AI Scan] Step 3: Calling API with userId:', user?.id);

      // Call AI identification API (CRITICAL: Pass userId!)
      const result = await productApi.identifyProduct(base64, user?.id || 'guest');
      
      console.log('[AI Scan] Step 4: API response received:', result);
      
      setAiResult(result);
      setIsProcessingAI(false);
      showToast('✨ Product identified!', 'success');
    } catch (error: any) {
      console.error('[AI Scan] ERROR:', error);
      console.error('[AI Scan] Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        stack: error.stack
      });
      
      setIsProcessingAI(false);
      
      // Handle specific error types with user-friendly messages
      if (error.response?.status === 400) {
        const errorCode = error.response?.data?.error?.code;
        const errorMessage = error.response?.data?.error?.message;
        
        console.log('[AI Scan] 400 Error - Code:', errorCode, 'Message:', errorMessage);
        
        if (errorCode === 'LOW_CONFIDENCE' || errorCode === 'NO_PRODUCT') {
          setAiError('blur');
          showToast('Photo quality too low, try again', 'error');
        } else if (errorCode === 'INVALID_IMAGE' || errorCode === 'IMAGE_TOO_SMALL') {
          setAiError('blur');
          showToast('Invalid image, please try again', 'error');
        } else {
          setAiError('not-found');
          showToast('Could not identify product, try manual entry', 'error');
        }
      } else if (error.response?.status === 404) {
        setAiError('not-found');
        showToast('Could not identify product, try manual entry', 'error');
      } else if (error.response?.status === 500) {
        setAiError('connection');
        showToast('Server error, please try again', 'error');
      } else if (error.message?.includes('Network')) {
        setAiError('connection');
        showToast('Network error, check your connection', 'error');
      } else if (error.message?.includes('timeout')) {
        setAiError('connection');
        showToast('Request timed out, try again', 'error');
      } else {
        setAiError('connection');
        showToast(error.message || 'Could not identify product', 'error');
      }
    }
  };

  const handleAIConfirm = (result: AIIdentificationResult) => {
    // Auto-fill form with AI results
    setName(result.name);
    setBrand(result.brand);
    setCategory(result.category);
    if (result.suggestedWarranty) {
      setWarrantyMonths(result.suggestedWarranty.toString());
    }
    
    // Close modal and show form
    setShowAIResultModal(false);
    setInputMethod('manual');
    
    showToast('✓ Form auto-filled with AI data', 'success');
  };

  const handleAIEdit = (result: AIIdentificationResult) => {
    // Same as confirm but with edited data
    handleAIConfirm(result);
  };

  const handleAIRetake = () => {
    setShowAIResultModal(false);
    setAiResult(null);
    setAiError(null);
    setShowAIScanner(true);
  };

  const handleAIModalClose = () => {
    setShowAIResultModal(false);
    setAiResult(null);
    setAiError(null);
    setInputMethod('manual');
  };

  const handleStartAICapture = () => {
    setShowAIScanner(true);
  };

  const handleSubmit = () => {
    if (!name || !brand || !purchaseDate || !warrantyMonths) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    const purchaseDateObj = new Date(purchaseDate);
    const warrantyEndDate = new Date(purchaseDateObj);
    warrantyEndDate.setMonth(warrantyEndDate.getMonth() + parseInt(warrantyMonths));

    const newProduct = {
      id: Date.now().toString(),
      userId: user?.id || '1',
      name,
      brand,
      category: category || 'General',
      purchaseDate: purchaseDateObj,
      warrantyEndDate,
      warrantyLength: parseInt(warrantyMonths),
      price: price ? parseFloat(price) : undefined,
      retailer: retailer || undefined,
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addProduct(newProduct);
    showToast('Product added successfully!', 'success');
    navigation.goBack();
  };

  if (!inputMethod) {
    return (
      <View className="flex-1 bg-dark-bg">
        <Header title="Add Product" showBack />
        
        <View className="flex-1 justify-center px-6">
          <Text className="text-dark-text text-2xl font-bold text-center mb-8">
            How would you like to add your product?
          </Text>

          <MethodButton
            icon="📸"
            title="Identify with AI"
            description="AI will identify the product"
            badge="✨ NEW"
            onPress={handleStartAICapture}
          />

          <MethodButton
            icon="📱"
            title="Scan Barcode"
            description="Quick and accurate"
            onPress={() => setShowScanner(true)}
          />

          <MethodButton
            icon="✏️"
            title="Enter Manually"
            description="Add details yourself"
            onPress={() => setInputMethod('manual')}
          />
        </View>

        {/* Barcode Scanner Modal */}
        <Modal visible={showScanner} animationType="slide">
          <BarcodeScanner
            onScan={handleBarcodeScan}
            onClose={() => setShowScanner(false)}
          />
        </Modal>

        {/* AI Product Scanner Modal */}
        <Modal visible={showAIScanner} animationType="slide">
          <AIProductScanner
            onCapture={handlePhotoCapture}
            onClose={() => setShowAIScanner(false)}
          />
        </Modal>

        {/* AI Identification Result Modal */}
        <AIIdentificationModal
          visible={showAIResultModal}
          result={aiResult}
          isLoading={isProcessingAI}
          error={aiError}
          onConfirm={handleAIConfirm}
          onRetake={handleAIRetake}
          onEdit={handleAIEdit}
          onClose={handleAIModalClose}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dark-bg">
      <Header title="Product Details" showBack />

      {/* Loading overlay for product lookup */}
      {isLookingUpProduct && (
        <View className="absolute inset-0 bg-black/50 z-50 items-center justify-center">
          <View className="bg-dark-card rounded-2xl p-6 m-4">
            <Text className="text-dark-text text-lg font-semibold mb-2 text-center">
              Looking up product...
            </Text>
            <Text className="text-dark-muted text-center">
              Barcode: {scannedBarcode}
            </Text>
            <View className="mt-4 items-center">
              <Text className="text-4xl animate-pulse">🔍</Text>
            </View>
          </View>
        </View>
      )}

      <ScrollView className="flex-1 px-4 py-6">
        {/* AI Success Banner */}
        {aiResult && (
          <View className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-4 mb-4">
            <Text className="text-primary-400 font-semibold mb-1">✨ Identified with AI</Text>
            <Text className="text-dark-muted text-sm">
              {aiResult.confidence && `${aiResult.confidence}% confidence - `}
              Review and edit details below
            </Text>
          </View>
        )}

        {/* Scanned Barcode Info */}
        {scannedBarcode && (
          <View className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-4">
            <Text className="text-green-400 font-semibold mb-1">✓ Barcode Scanned</Text>
            <Text className="text-dark-muted text-sm font-mono">{scannedBarcode}</Text>
          </View>
        )}

        {/* Required Fields */}
        <Text className="text-dark-text text-lg font-bold mb-4">Required Information</Text>
        
        <InputField
          label="Product Name *"
          value={name}
          onChangeText={setName}
          placeholder="e.g., MacBook Pro 16-inch"
        />

        <InputField
          label="Brand *"
          value={brand}
          onChangeText={setBrand}
          placeholder="e.g., Apple"
        />

        <InputField
          label="Purchase Date *"
          value={purchaseDate}
          onChangeText={setPurchaseDate}
          placeholder="YYYY-MM-DD"
        />

        <InputField
          label="Warranty Length (months) *"
          value={warrantyMonths}
          onChangeText={setWarrantyMonths}
          placeholder="12"
          keyboardType="numeric"
        />

        {/* Optional Fields */}
        <Text className="text-dark-text text-lg font-bold mb-4 mt-6">Optional Information</Text>

        <InputField
          label="Category"
          value={category}
          onChangeText={setCategory}
          placeholder="e.g., Electronics"
        />

        <InputField
          label="Price"
          value={price}
          onChangeText={setPrice}
          placeholder="0.00"
          keyboardType="numeric"
        />

        <InputField
          label="Retailer"
          value={retailer}
          onChangeText={setRetailer}
          placeholder="e.g., Best Buy"
        />

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-primary-500 rounded-xl py-4 mt-6 mb-8 active:opacity-70"
        >
          <Text className="text-white text-center text-base font-bold">
            Add Product
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const MethodButton: React.FC<{
  icon: string;
  title: string;
  description: string;
  badge?: string;
  onPress: () => void;
}> = ({ icon, title, description, badge, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className="bg-dark-card border border-dark-border rounded-xl p-6 mb-4 active:opacity-70 relative"
  >
    {badge && (
      <View className="absolute top-3 right-3 bg-primary-500 px-3 py-1 rounded-full">
        <Text className="text-white text-xs font-bold">{badge}</Text>
      </View>
    )}
    <Text className="text-5xl mb-3">{icon}</Text>
    <Text className="text-dark-text text-xl font-bold mb-1">{title}</Text>
    <Text className="text-dark-muted text-sm">{description}</Text>
  </TouchableOpacity>
);

const InputField: React.FC<{
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'numeric';
}> = ({ label, value, onChangeText, placeholder, keyboardType = 'default' }) => (
  <View className="mb-4">
    <Text className="text-dark-text text-sm font-semibold mb-2">{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#94a3b8"
      keyboardType={keyboardType}
      className="bg-dark-card text-dark-text rounded-xl px-4 py-3 border border-dark-border"
    />
  </View>
);
