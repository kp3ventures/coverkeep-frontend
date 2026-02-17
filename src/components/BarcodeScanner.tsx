import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera, CameraView } from 'expo-camera';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (!scanned && !isProcessing) {
      setScanned(true);
      setScannedBarcode(data);
      setIsProcessing(true);
      
      // Show feedback for 1.5 seconds, then send barcode and close
      setTimeout(() => {
        onScan(data);
        // Auto-close after showing success
        setTimeout(onClose, 800);
      }, 1500);
    }
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
          Camera permission is required to scan barcodes
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

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'qr', 'code128'],
        }}
      />
      
      {/* Overlay */}
      <View className="flex-1 justify-center items-center">
        <View 
          className={`border-2 ${
            scanned ? 'border-green-400' : 'border-primary-400'
          } w-64 h-64 rounded-2xl`} 
        />
        
        {!scanned ? (
          <Text className="text-white text-center mt-6 px-6">
            Position the barcode within the frame
          </Text>
        ) : (
          <View className="mt-6 bg-black/70 px-6 py-4 rounded-xl mx-6">
            <Text className="text-green-400 text-center text-lg font-semibold mb-2">
              ✓ Scanned Successfully!
            </Text>
            <Text className="text-white text-center font-mono">
              {scannedBarcode}
            </Text>
            <Text className="text-gray-400 text-center mt-2 text-sm">
              Looking up product...
            </Text>
          </View>
        )}
      </View>
      
      {/* Close Button */}
      <View className="absolute top-12 right-4">
        <TouchableOpacity
          onPress={onClose}
          className="bg-black/50 rounded-full p-3"
          disabled={isProcessing}
        >
          <Text className="text-white text-xl font-bold">✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
