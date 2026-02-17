import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Camera, CameraView, FlashMode } from 'expo-camera';
import { useUIStore } from '../stores/uiStore';

interface AIProductScannerProps {
  onCapture: (imageUri: string) => void;
  onClose: () => void;
}

export const AIProductScanner: React.FC<AIProductScannerProps> = ({ onCapture, onClose }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [flash, setFlash] = useState<FlashMode>('off');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const { showToast } = useUIStore();

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });

      if (photo?.uri) {
        setCapturedPhoto(photo.uri);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      showToast('Failed to capture photo', 'error');
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
  };

  const handleConfirmCapture = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
    }
  };

  const toggleFlash = () => {
    setFlash((current) => (current === 'off' ? 'on' : 'off'));
  };

  if (hasPermission === null) {
    return (
      <View className="flex-1 bg-dark-bg items-center justify-center">
        <Text className="text-dark-text">Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View className="flex-1 bg-dark-bg items-center justify-center px-6">
        <Text className="text-dark-text text-lg text-center mb-4">
          Camera permission is required to identify products
        </Text>
        <TouchableOpacity
          onPress={onClose}
          className="bg-primary-500 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Preview captured photo
  if (capturedPhoto) {
    return (
      <View className="flex-1 bg-black">
        <Image source={{ uri: capturedPhoto }} style={StyleSheet.absoluteFillObject} resizeMode="contain" />
        
        <View className="absolute top-12 left-4 right-4 flex-row justify-between">
          <TouchableOpacity
            onPress={handleRetake}
            className="bg-black/50 rounded-full px-6 py-3"
          >
            <Text className="text-white font-semibold">Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleConfirmCapture}
            className="bg-primary-500 rounded-full px-6 py-3"
          >
            <Text className="text-white font-semibold">Use Photo</Text>
          </TouchableOpacity>
        </View>

        <View className="absolute bottom-12 left-0 right-0 items-center">
          <Text className="text-white text-center px-6 bg-black/50 py-3 rounded-xl">
            Does the product look clear in the photo?
          </Text>
        </View>
      </View>
    );
  }

  // Camera view
  return (
    <View className="flex-1 bg-black">
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        flash={flash}
      />
      
      {/* Overlay with instructions */}
      <View className="flex-1 justify-between">
        {/* Top controls */}
        <View className="pt-12 px-4 flex-row justify-between items-start">
          {/* Cancel button */}
          <TouchableOpacity
            onPress={onClose}
            className="bg-black/50 rounded-full p-3"
          >
            <Text className="text-white text-xl font-bold">✕</Text>
          </TouchableOpacity>

          {/* Flash toggle */}
          <TouchableOpacity
            onPress={toggleFlash}
            className="bg-black/50 rounded-full p-3"
          >
            <Text className="text-white text-xl">
              {flash === 'on' ? '⚡' : '⚡️'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Center instruction */}
        <View className="items-center">
          <View className="border-2 border-primary-400 border-dashed w-64 h-64 rounded-2xl" />
          <Text className="text-white text-center mt-6 px-6 text-lg font-semibold bg-black/50 py-3 rounded-xl">
            Point camera at product
          </Text>
          <Text className="text-gray-300 text-center mt-2 px-6">
            Make sure the product name and brand are visible
          </Text>
        </View>

        {/* Bottom capture button */}
        <View className="pb-12 items-center">
          <TouchableOpacity
            onPress={handleCapture}
            className="bg-white rounded-full w-20 h-20 items-center justify-center border-4 border-primary-500"
          >
            <View className="bg-white rounded-full w-16 h-16" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
