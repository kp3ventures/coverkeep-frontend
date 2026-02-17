import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: {
    label: string;
    onPress: () => void;
  };
}

export const Header: React.FC<HeaderProps> = ({ title, showBack, rightAction }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="bg-dark-bg">
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-dark-border">
        {showBack ? (
          <TouchableOpacity onPress={() => navigation.goBack()} className="py-2">
            <Text className="text-primary-400 text-base font-semibold">← Back</Text>
          </TouchableOpacity>
        ) : (
          <View className="w-16" />
        )}
        
        <Text className="text-dark-text text-xl font-bold">{title}</Text>
        
        {rightAction ? (
          <TouchableOpacity onPress={rightAction.onPress} className="py-2">
            <Text className="text-primary-400 text-base font-semibold">{rightAction.label}</Text>
          </TouchableOpacity>
        ) : (
          <View className="w-16" />
        )}
      </View>
    </SafeAreaView>
  );
};
