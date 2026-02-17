import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useProductStore } from '../stores/productStore';
import { useUserStore } from '../stores/userStore';
import { useUIStore } from '../stores/uiStore';
import { ProductCard } from '../components/ProductCard';
import { productApi } from '../api/products';

type DashboardNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

export const DashboardScreen = () => {
  const navigation = useNavigation<DashboardNavigationProp>();
  const { user } = useUserStore();
  const { filter, setFilter, setProducts, getFilteredProducts, setLoading, isLoading } = useProductStore();
  const { showToast } = useUIStore();
  const [refreshing, setRefreshing] = useState(false);

  const filteredProducts = getFilteredProducts();

  const loadProducts = async () => {
    setLoading(true);
    try {
      // const products = await productApi.getProducts();
      // setProducts(products);
      
      // Mock data for development
      const mockProducts = [
        {
          id: '1',
          userId: user?.id || '1',
          name: 'MacBook Pro 16"',
          brand: 'Apple',
          category: 'Electronics',
          purchaseDate: new Date('2024-01-15'),
          warrantyEndDate: new Date('2025-01-15'),
          warrantyLength: 12,
          price: 2499,
          status: 'active' as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          userId: user?.id || '1',
          name: 'Dyson V15 Vacuum',
          brand: 'Dyson',
          category: 'Home Appliances',
          purchaseDate: new Date('2025-11-01'),
          warrantyEndDate: new Date('2026-03-01'),
          warrantyLength: 24,
          price: 649,
          status: 'expiring-soon' as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      setProducts(mockProducts);
    } catch (error: any) {
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  return (
    <View className="flex-1 bg-dark-bg">
      {/* Header */}
      <View className="pt-12 pb-4 px-4 border-b border-dark-border">
        <Text className="text-dark-text text-2xl font-bold mb-1">
          Welcome back, {user?.name || 'User'}!
        </Text>
        <Text className="text-dark-muted text-sm">
          {filteredProducts.length} {filter === 'all' ? 'total' : filter} products
        </Text>
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 py-3">
        <FilterTab label="All" active={filter === 'all'} onPress={() => setFilter('all')} />
        <FilterTab label="Active" active={filter === 'active'} onPress={() => setFilter('active')} />
        <FilterTab label="Expiring Soon" active={filter === 'expiring-soon'} onPress={() => setFilter('expiring-soon')} />
        <FilterTab label="Expired" active={filter === 'expired'} onPress={() => setFilter('expired')} />
      </ScrollView>

      {/* Products List */}
      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0ea5e9" />
        }
      >
        {filteredProducts.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-6xl mb-4">📦</Text>
            <Text className="text-dark-text text-lg font-semibold mb-2">No products yet</Text>
            <Text className="text-dark-muted text-center px-6 mb-6">
              Start tracking your warranties by adding your first product
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddProduct')}
              className="bg-primary-500 px-6 py-3 rounded-xl"
            >
              <Text className="text-white font-semibold">Add Product</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="py-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        onPress={() => navigation.navigate('AddProduct')}
        className="absolute bottom-6 right-6 bg-primary-500 w-16 h-16 rounded-full items-center justify-center shadow-lg"
      >
        <Text className="text-white text-3xl">+</Text>
      </TouchableOpacity>
    </View>
  );
};

const FilterTab: React.FC<{ label: string; active: boolean; onPress: () => void }> = ({
  label,
  active,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`${
      active ? 'bg-primary-500' : 'bg-dark-card border border-dark-border'
    } px-4 py-2 rounded-full mr-2`}
  >
    <Text className={`${active ? 'text-white' : 'text-dark-muted'} font-semibold`}>
      {label}
    </Text>
  </TouchableOpacity>
);
