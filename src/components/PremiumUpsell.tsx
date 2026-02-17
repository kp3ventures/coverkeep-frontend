import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

interface PremiumUpsellProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  feature: string;
}

export const PremiumUpsell: React.FC<PremiumUpsellProps> = ({
  visible,
  onClose,
  onUpgrade,
  feature,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/70 items-center justify-center px-6">
        <View className="bg-dark-card rounded-2xl p-6 w-full max-w-md border-2 border-primary-500">
          {/* Premium Badge */}
          <View className="items-center mb-4">
            <Text className="text-5xl mb-2">⭐</Text>
            <Text className="text-dark-text text-2xl font-bold mb-1">Go Premium</Text>
            <Text className="text-dark-muted text-sm text-center">
              Unlock {feature} and more powerful features
            </Text>
          </View>
          
          {/* Features List */}
          <View className="mb-6">
            <FeatureItem text="Unlimited product tracking" />
            <FeatureItem text="AI-powered claim assistance" />
            <FeatureItem text="Priority customer support" />
            <FeatureItem text="Advanced analytics & insights" />
            <FeatureItem text="Automatic warranty reminders" />
          </View>
          
          {/* Pricing */}
          <View className="bg-primary-500/10 rounded-xl p-4 mb-4 border border-primary-500/30">
            <Text className="text-dark-text text-center text-lg font-bold">
              $4.99<Text className="text-dark-muted text-sm font-normal">/month</Text>
            </Text>
            <Text className="text-dark-muted text-xs text-center mt-1">
              or $49.99/year (save 17%)
            </Text>
          </View>
          
          {/* Actions */}
          <TouchableOpacity
            onPress={onUpgrade}
            className="bg-primary-500 rounded-xl py-4 mb-3 active:opacity-70"
          >
            <Text className="text-white text-center text-base font-bold">
              Upgrade Now
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={onClose}
            className="py-3 active:opacity-70"
          >
            <Text className="text-dark-muted text-center text-sm">
              Maybe Later
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const FeatureItem: React.FC<{ text: string }> = ({ text }) => (
  <View className="flex-row items-center mb-2">
    <Text className="text-primary-400 mr-2">✓</Text>
    <Text className="text-dark-text text-sm">{text}</Text>
  </View>
);
