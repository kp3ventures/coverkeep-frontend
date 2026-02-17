import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProductStore } from '../stores/productStore';
import { useUserStore } from '../stores/userStore';
import { useUIStore } from '../stores/uiStore';
import { BarcodeScanner } from '../components/BarcodeScanner';
import { Header } from '../components/Header';

type InputMethod = 'manual' | 'barcode' | 'photo';

export const AddProductScreen = () => {
  const navigation = useNavigation();
  const { user } = useUserStore();
  const { addProduct } = useProductStore();
  const { showToast } = useUIStore();

  const [inputMethod, setInputMethod] = useState<InputMethod | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [warrantyMonths, setWarrantyMonths] = useState('12');
  const [price, setPrice] = useState('');
  const [retailer, setRetailer] = useState('');

  const handleBarcodeScan = (barcode: string) => {
    setShowScanner(false);
    showToast(`Barcode scanned: ${barcode}`, 'success');
    // TODO: Fetch product info from barcode API
    setInputMethod('manual');
  };

  const handlePhotoCapture = async () => {
    // TODO: Implement camera + AI identification
    showToast('AI identification coming soon!', 'info');
    setInputMethod('manual');
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
            title="Take a Photo"
            description="AI will identify the product"
            onPress={handlePhotoCapture}
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
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dark-bg">
      <Header title="Product Details" showBack />

      <ScrollView className="flex-1 px-4 py-6">
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
  onPress: () => void;
}> = ({ icon, title, description, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className="bg-dark-card border border-dark-border rounded-xl p-6 mb-4 active:opacity-70"
  >
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
