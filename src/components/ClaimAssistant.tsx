import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { AIMessage } from '../types';

interface ClaimAssistantProps {
  messages: AIMessage[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export const ClaimAssistant: React.FC<ClaimAssistantProps> = ({
  messages,
  onSendMessage,
  isLoading = false,
}) => {
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
      keyboardVerticalOffset={100}
    >
      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4"
        contentContainerStyle={{ paddingVertical: 16 }}
      >
        {messages.length === 0 ? (
          <View className="flex-1 items-center justify-center py-12">
            <Text className="text-5xl mb-4">🤖</Text>
            <Text className="text-dark-text text-lg font-semibold mb-2">
              AI Claim Assistant
            </Text>
            <Text className="text-dark-muted text-center px-6">
              I'll help you file your warranty claim. Describe the issue with your product.
            </Text>
          </View>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        
        {isLoading && (
          <View className="flex-row items-center mb-4">
            <View className="bg-dark-card rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80%]">
              <Text className="text-dark-muted">Thinking...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View className="border-t border-dark-border bg-dark-bg px-4 py-3">
        <View className="flex-row items-center">
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Describe the issue..."
            placeholderTextColor="#94a3b8"
            className="flex-1 bg-dark-card text-dark-text rounded-xl px-4 py-3 mr-2"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
            className={`${
              inputText.trim() && !isLoading ? 'bg-primary-500' : 'bg-dark-border'
            } rounded-xl px-4 py-3`}
          >
            <Text className="text-white font-semibold">Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const MessageBubble: React.FC<{ message: AIMessage }> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <View className={`flex-row mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <View
        className={`${
          isUser ? 'bg-primary-500' : 'bg-dark-card'
        } rounded-2xl ${
          isUser ? 'rounded-br-sm' : 'rounded-bl-sm'
        } px-4 py-3 max-w-[80%]`}
      >
        <Text className={isUser ? 'text-white' : 'text-dark-text'}>
          {message.content}
        </Text>
        <Text className={`text-xs mt-1 ${isUser ? 'text-white/70' : 'text-dark-muted'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
    </View>
  );
};
