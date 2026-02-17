import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Modal } from 'react-native';
import { AIIdentificationResult } from '../types';

interface AIIdentificationModalProps {
  visible: boolean;
  result: AIIdentificationResult | null;
  isLoading: boolean;
  error: string | null;
  onConfirm: (result: AIIdentificationResult) => void;
  onRetake: () => void;
  onEdit: (result: AIIdentificationResult) => void;
  onClose: () => void;
}

export const AIIdentificationModal: React.FC<AIIdentificationModalProps> = ({
  visible,
  result,
  isLoading,
  error,
  onConfirm,
  onRetake,
  onEdit,
  onClose,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedResult, setEditedResult] = useState<AIIdentificationResult | null>(null);

  React.useEffect(() => {
    if (result) {
      setEditedResult(result);
    }
  }, [result]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editedResult) {
      onEdit(editedResult);
      setIsEditing(false);
    }
  };

  const handleConfirm = () => {
    if (editedResult) {
      onConfirm(editedResult);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View className="flex-1 bg-black/70 items-center justify-center">
          <View className="bg-dark-card rounded-2xl p-8 m-6 items-center min-w-[300px]">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-dark-text text-lg font-semibold mt-4 text-center">
              Processing with AI...
            </Text>
            <Text className="text-dark-muted text-sm mt-2 text-center">
              Analyzing your product photo
            </Text>
            <View className="mt-4 flex-row space-x-2">
              <View className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
              <View className="w-2 h-2 bg-primary-500 rounded-full animate-pulse delay-100" />
              <View className="w-2 h-2 bg-primary-500 rounded-full animate-pulse delay-200" />
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  // Error state
  if (error) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View className="flex-1 bg-black/70 items-center justify-center px-6">
          <View className="bg-dark-card rounded-2xl p-6 w-full max-w-md">
            <Text className="text-red-400 text-3xl text-center mb-4">⚠️</Text>
            <Text className="text-dark-text text-xl font-bold text-center mb-2">
              {error === 'blur' ? 'Photo Too Blurry' : 'Could Not Identify'}
            </Text>
            <Text className="text-dark-muted text-center mb-6">
              {error === 'blur' 
                ? 'Please retake the photo with the product in focus'
                : 'AI could not identify this product. Please enter details manually or try again with a clearer photo.'}
            </Text>

            <View className="space-y-3">
              <TouchableOpacity
                onPress={onRetake}
                className="bg-primary-500 rounded-xl py-4 active:opacity-70"
              >
                <Text className="text-white text-center font-bold text-base">
                  Retake Photo
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                className="bg-dark-bg border border-dark-border rounded-xl py-4 active:opacity-70"
              >
                <Text className="text-dark-text text-center font-semibold text-base">
                  Enter Manually
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  // Success state - Show results
  if (!result) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/70">
        <View className="flex-1 mt-20 bg-dark-bg rounded-t-3xl">
          {/* Header */}
          <View className="px-6 py-4 border-b border-dark-border">
            <View className="flex-row items-center justify-between">
              <Text className="text-dark-text text-xl font-bold">
                {isEditing ? 'Edit Product Details' : 'Product Identified'}
              </Text>
              <TouchableOpacity onPress={onClose} className="p-2">
                <Text className="text-dark-muted text-2xl">×</Text>
              </TouchableOpacity>
            </View>
            {!isEditing && result.confidence && (
              <View className="mt-2 flex-row items-center">
                <View className={`px-3 py-1 rounded-full ${
                  result.confidence >= 90 ? 'bg-green-500/20' :
                  result.confidence >= 70 ? 'bg-yellow-500/20' :
                  'bg-red-500/20'
                }`}>
                  <Text className={`text-sm font-semibold ${
                    result.confidence >= 90 ? 'text-green-400' :
                    result.confidence >= 70 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {result.confidence}% Confidence
                  </Text>
                </View>
                {result.confidence >= 90 && (
                  <Text className="text-green-400 ml-2">✓</Text>
                )}
              </View>
            )}
          </View>

          <ScrollView className="flex-1 px-6 py-4">
            {!isEditing ? (
              // View mode
              <View className="space-y-4">
                <InfoRow label="Product Name" value={result.name} />
                <InfoRow label="Brand" value={result.brand} />
                <InfoRow label="Category" value={result.category} />
                {result.model && <InfoRow label="Model" value={result.model} />}
                {result.color && <InfoRow label="Color" value={result.color} />}
                {result.suggestedWarranty && (
                  <InfoRow 
                    label="Suggested Warranty" 
                    value={`${result.suggestedWarranty} months`} 
                  />
                )}
                {result.description && (
                  <View className="mt-2">
                    <Text className="text-dark-muted text-sm font-semibold mb-1">
                      Additional Info
                    </Text>
                    <Text className="text-dark-text">{result.description}</Text>
                  </View>
                )}
              </View>
            ) : (
              // Edit mode
              <View className="space-y-4">
                <EditField
                  label="Product Name *"
                  value={editedResult?.name || ''}
                  onChangeText={(text) =>
                    setEditedResult((prev) => (prev ? { ...prev, name: text } : null))
                  }
                />
                <EditField
                  label="Brand *"
                  value={editedResult?.brand || ''}
                  onChangeText={(text) =>
                    setEditedResult((prev) => (prev ? { ...prev, brand: text } : null))
                  }
                />
                <EditField
                  label="Category *"
                  value={editedResult?.category || ''}
                  onChangeText={(text) =>
                    setEditedResult((prev) => (prev ? { ...prev, category: text } : null))
                  }
                />
                <EditField
                  label="Model"
                  value={editedResult?.model || ''}
                  onChangeText={(text) =>
                    setEditedResult((prev) => (prev ? { ...prev, model: text } : null))
                  }
                />
                <EditField
                  label="Color"
                  value={editedResult?.color || ''}
                  onChangeText={(text) =>
                    setEditedResult((prev) => (prev ? { ...prev, color: text } : null))
                  }
                />
              </View>
            )}
          </ScrollView>

          {/* Action buttons */}
          <View className="px-6 py-4 border-t border-dark-border space-y-3">
            {!isEditing ? (
              <>
                <TouchableOpacity
                  onPress={handleConfirm}
                  className="bg-primary-500 rounded-xl py-4 active:opacity-70"
                >
                  <Text className="text-white text-center font-bold text-base">
                    ✓ Looks Good
                  </Text>
                </TouchableOpacity>

                <View className="flex-row space-x-3">
                  <TouchableOpacity
                    onPress={handleEdit}
                    className="flex-1 bg-dark-card border border-dark-border rounded-xl py-3 active:opacity-70"
                  >
                    <Text className="text-dark-text text-center font-semibold">
                      Edit
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={onRetake}
                    className="flex-1 bg-dark-card border border-dark-border rounded-xl py-3 active:opacity-70"
                  >
                    <Text className="text-dark-text text-center font-semibold">
                      Retake
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  onPress={() => setIsEditing(false)}
                  className="flex-1 bg-dark-card border border-dark-border rounded-xl py-4 active:opacity-70"
                >
                  <Text className="text-dark-text text-center font-semibold">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSaveEdit}
                  className="flex-1 bg-primary-500 rounded-xl py-4 active:opacity-70"
                >
                  <Text className="text-white text-center font-bold">
                    Save Changes
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View className="bg-dark-card border border-dark-border rounded-xl p-4">
    <Text className="text-dark-muted text-sm font-semibold mb-1">{label}</Text>
    <Text className="text-dark-text text-base">{value}</Text>
  </View>
);

const EditField: React.FC<{
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}> = ({ label, value, onChangeText }) => (
  <View>
    <Text className="text-dark-muted text-sm font-semibold mb-2">{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={`Enter ${label.toLowerCase()}`}
      placeholderTextColor="#94a3b8"
      className="bg-dark-card text-dark-text rounded-xl px-4 py-3 border border-dark-border"
    />
  </View>
);
