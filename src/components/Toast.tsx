import React, { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { useUIStore } from '../stores/uiStore';

export const Toast = () => {
  const { toast, hideToast } = useUIStore();
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (toast) {
      // Slide in
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          hideToast();
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!toast) return null;

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-primary-500',
  }[toast.type];

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  }[toast.type];

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
      }}
      className="absolute top-12 left-4 right-4 z-50"
    >
      <View className={`${bgColor} rounded-xl px-4 py-3 flex-row items-center shadow-lg`}>
        <Text className="text-white text-lg font-bold mr-2">{icon}</Text>
        <Text className="text-white flex-1 font-semibold">{toast.message}</Text>
      </View>
    </Animated.View>
  );
};
