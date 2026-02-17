import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Product } from '../types';
import { ExpirationBadge } from './ExpirationBadge';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-dark-card rounded-xl p-4 mb-3 border border-dark-border active:opacity-70"
    >
      <View className="flex-row">
        {/* Product Image */}
        <View className="w-20 h-20 bg-dark-bg rounded-lg mr-3 overflow-hidden">
          {product.imageUrl ? (
            <Image 
              source={{ uri: product.imageUrl }} 
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <Text className="text-dark-muted text-2xl">📦</Text>
            </View>
          )}
        </View>
        
        {/* Product Info */}
        <View className="flex-1">
          <View className="flex-row items-start justify-between mb-1">
            <Text className="text-dark-text text-base font-semibold flex-1" numberOfLines={1}>
              {product.name}
            </Text>
            <ExpirationBadge warrantyEndDate={product.warrantyEndDate} size="small" />
          </View>
          
          <Text className="text-dark-muted text-sm mb-1">{product.brand}</Text>
          
          <View className="flex-row items-center">
            <Text className="text-dark-muted text-xs">
              Expires: {new Date(product.warrantyEndDate).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
