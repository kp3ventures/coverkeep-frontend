import './global.css';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { Toast } from './src/components/Toast';
import { LoadingOverlay } from './src/components/LoadingOverlay';
import { useUIStore } from './src/stores/uiStore';

export default function App() {
  const { isLoading } = useUIStore();

  return (
    <View className="flex-1 bg-dark-bg">
      <StatusBar style="light" />
      <AppNavigator />
      <Toast />
      <LoadingOverlay visible={isLoading} />
    </View>
  );
}
