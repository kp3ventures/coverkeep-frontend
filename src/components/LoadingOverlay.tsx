import React from 'react';
import { View, ActivityIndicator, Modal } from 'react-native';

interface LoadingOverlayProps {
  visible: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-black/50 items-center justify-center">
        <View className="bg-dark-card rounded-2xl p-6">
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      </View>
    </Modal>
  );
};
