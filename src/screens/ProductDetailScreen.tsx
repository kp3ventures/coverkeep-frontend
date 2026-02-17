import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useProductStore } from '../stores/productStore';
import { useUIStore } from '../stores/uiStore';
import { ExpirationBadge } from '../components/ExpirationBadge';
import { Header } from '../components/Header';

type ProductDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductDetail'>;
type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

export const ProductDetailScreen = () => {
  const navigation = useNavigation<ProductDetailNavigationProp>();
  const route = useRoute<ProductDetailRouteProp>();
  const { productId } = route.params;
  
  const { getProductById, deleteProduct } = useProductStore();
  const { showToast } = useUIStore();
  
  const product = getProductById(productId);

  if (!product) {
    return (
      <View className="flex-1 bg-dark-bg items-center justify-center">
        <Text className="text-dark-text text-lg">Product not found</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteProduct(productId);
            showToast('Product deleted', 'success');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleFileClaim = () => {
    navigation.navigate('WarrantyClaim', { productId });
  };

  return (
    <View className="flex-1 bg-dark-bg">
      <Header 
        title="Product Details" 
        showBack 
        rightAction={{ label: 'Edit', onPress: () => showToast('Edit coming soon', 'info') }}
      />

      <ScrollView className="flex-1">
        {/* Product Image */}
        <View className="w-full h-64 bg-dark-card items-center justify-center border-b border-dark-border">
          {product.imageUrl ? (
            <Image 
              source={{ uri: product.imageUrl }} 
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <Text className="text-8xl">📦</Text>
          )}
        </View>

        {/* Product Info */}
        <View className="p-6">
          {/* Name & Brand */}
          <View className="mb-6">
            <Text className="text-dark-text text-3xl font-bold mb-2">{product.name}</Text>
            <Text className="text-dark-muted text-xl">{product.brand}</Text>
          </View>

          {/* Warranty Status */}
          <View className="bg-dark-card rounded-xl p-4 mb-6 border border-dark-border">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-dark-text text-lg font-semibold">Warranty Status</Text>
              <ExpirationBadge warrantyEndDate={product.warrantyEndDate} size="medium" />
            </View>
            <View className="flex-row justify-between">
              <InfoItem label="Purchased" value={new Date(product.purchaseDate).toLocaleDateString()} />
              <InfoItem label="Expires" value={new Date(product.warrantyEndDate).toLocaleDateString()} />
            </View>
          </View>

          {/* Details */}
          <View className="bg-dark-card rounded-xl p-4 mb-6 border border-dark-border">
            <Text className="text-dark-text text-lg font-semibold mb-3">Details</Text>
            <DetailRow label="Category" value={product.category} />
            <DetailRow label="Warranty Length" value={`${product.warrantyLength} months`} />
            {product.price && <DetailRow label="Price" value={`$${product.price.toFixed(2)}`} />}
            {product.retailer && <DetailRow label="Retailer" value={product.retailer} />}
            {product.barcode && <DetailRow label="Barcode" value={product.barcode} />}
          </View>

          {/* Actions */}
          <TouchableOpacity
            onPress={handleFileClaim}
            className="bg-primary-500 rounded-xl py-4 mb-3 active:opacity-70"
          >
            <Text className="text-white text-center text-base font-bold">
              File Warranty Claim
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => showToast('Upload receipt coming soon', 'info')}
            className="bg-dark-card border border-dark-border rounded-xl py-4 mb-3 active:opacity-70"
          >
            <Text className="text-dark-text text-center text-base font-semibold">
              Upload Receipt
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            className="bg-red-500/20 border border-red-500/30 rounded-xl py-4 mb-8 active:opacity-70"
          >
            <Text className="text-red-400 text-center text-base font-semibold">
              Delete Product
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View>
    <Text className="text-dark-muted text-xs mb-1">{label}</Text>
    <Text className="text-dark-text text-base font-semibold">{value}</Text>
  </View>
);

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View className="flex-row justify-between py-2 border-b border-dark-border last:border-b-0">
    <Text className="text-dark-muted">{label}</Text>
    <Text className="text-dark-text font-semibold">{value}</Text>
  </View>
);
