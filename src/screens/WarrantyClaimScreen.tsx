import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList, AIMessage } from '../types';
import { useProductStore } from '../stores/productStore';
import { useClaimStore } from '../stores/claimStore';
import { useUserStore } from '../stores/userStore';
import { ClaimAssistant } from '../components/ClaimAssistant';
import { Header } from '../components/Header';

type WarrantyClaimRouteProp = RouteProp<RootStackParamList, 'WarrantyClaim'>;

export const WarrantyClaimScreen = () => {
  const route = useRoute<WarrantyClaimRouteProp>();
  const { productId } = route.params;
  
  const { getProductById } = useProductStore();
  const { user } = useUserStore();
  const { 
    currentClaim, 
    aiMessages, 
    setCurrentClaim, 
    updateCurrentClaim, 
    addAIMessage, 
    clearAIMessages,
    setLoading,
    isLoading 
  } = useClaimStore();
  
  const product = getProductById(productId);

  useEffect(() => {
    // Initialize claim
    if (!currentClaim) {
      setCurrentClaim({
        id: Date.now().toString(),
        productId,
        userId: user?.id || '1',
        status: 'draft',
        issueDescription: '',
        claimDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      // Add initial AI message
      addAIMessage({
        id: '1',
        role: 'assistant',
        content: `Hi! I'm here to help you file a warranty claim for your ${product?.name}. Please describe the issue you're experiencing with the product.`,
        timestamp: new Date(),
      });
    }

    return () => {
      // Clean up on unmount
      clearAIMessages();
      setCurrentClaim(null);
    };
  }, []);

  const handleSendMessage = async (message: string) => {
    // Add user message
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    addAIMessage(userMessage);
    
    // Update claim description
    updateCurrentClaim({ issueDescription: message });

    // Simulate AI response
    setLoading(true);
    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(message),
        timestamp: new Date(),
      };
      addAIMessage(aiResponse);
      setLoading(false);
    }, 1500);
  };

  return (
    <View className="flex-1 bg-dark-bg">
      <Header 
        title="File Claim" 
        showBack 
        rightAction={{ 
          label: 'Submit', 
          onPress: () => {
            // TODO: Submit claim
            alert('Claim submitted successfully!');
          }
        }}
      />
      
      <ClaimAssistant
        messages={aiMessages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </View>
  );
};

// Mock AI responses
const getAIResponse = (userMessage: string): string => {
  const lower = userMessage.toLowerCase();
  
  if (lower.includes('not working') || lower.includes('broken')) {
    return "I understand the product is not functioning properly. Can you provide more specific details about what happens when you try to use it? For example, does it not turn on, or is there a specific feature that's malfunctioning?";
  }
  
  if (lower.includes('screen') || lower.includes('display')) {
    return "Screen issues are commonly covered under warranty. I recommend:\n\n1. Take photos showing the screen problem\n2. Note when the issue first appeared\n3. Check if it happens constantly or intermittently\n\nShould I help you gather this documentation for your claim?";
  }
  
  if (lower.includes('battery') || lower.includes('charging')) {
    return "Battery and charging issues are typically covered. Here's what manufacturers usually need:\n\n• How long the battery lasts on full charge\n• Any error messages when charging\n• Whether you're using the original charger\n\nWould you like me to help you document these details?";
  }
  
  if (lower.includes('yes') || lower.includes('okay') || lower.includes('sure')) {
    return "Great! I'll help you compile all the necessary information for your warranty claim. Based on what you've told me, here are the next steps:\n\n1. Take clear photos of the issue\n2. Gather your receipt and warranty documentation\n3. Note the product's serial number\n\nOnce you have these ready, I can help you draft the claim letter. Sound good?";
  }
  
  return "Thank you for that information. To strengthen your warranty claim, I recommend documenting the issue thoroughly with photos and a detailed timeline. Would you like me to guide you through the specific documentation needed for this type of claim?";
};
