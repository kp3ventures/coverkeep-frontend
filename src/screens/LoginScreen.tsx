import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useUserStore } from '../stores/userStore';
import { useUIStore } from '../stores/uiStore';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  
  const { setUser, setLoading, setError } = useUserStore();
  const { showToast } = useUIStore();

  const handleAuth = async () => {
    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: Implement Firebase auth
      // const user = await (isSignup ? signUp(email, password) : signIn(email, password));
      
      // Mock user for development
      setTimeout(() => {
        setUser({
          id: '1',
          email,
          name: email.split('@')[0],
          isPremium: false,
          createdAt: new Date(),
        });
        showToast(`Welcome ${isSignup ? 'to' : 'back'}!`, 'success');
        setLoading(false);
      }, 1000);
    } catch (error: any) {
      setError(error.message);
      showToast(error.message, 'error');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-dark-bg"
    >
      <View className="flex-1 justify-center px-6">
        {/* Logo/Header */}
        <View className="items-center mb-12">
          <Text className="text-6xl mb-4">🛡️</Text>
          <Text className="text-dark-text text-4xl font-bold mb-2">CoverKeep</Text>
          <Text className="text-dark-muted text-base text-center">
            Never lose track of your warranties
          </Text>
        </View>

        {/* Form */}
        <View className="mb-6">
          <Text className="text-dark-text text-sm font-semibold mb-2">Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            placeholderTextColor="#94a3b8"
            keyboardType="email-address"
            autoCapitalize="none"
            className="bg-dark-card text-dark-text rounded-xl px-4 py-4 mb-4 border border-dark-border"
          />

          <Text className="text-dark-text text-sm font-semibold mb-2">Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            className="bg-dark-card text-dark-text rounded-xl px-4 py-4 border border-dark-border"
          />
        </View>

        {/* Auth Button */}
        <TouchableOpacity
          onPress={handleAuth}
          className="bg-primary-500 rounded-xl py-4 mb-4 active:opacity-70"
        >
          <Text className="text-white text-center text-base font-bold">
            {isSignup ? 'Sign Up' : 'Log In'}
          </Text>
        </TouchableOpacity>

        {/* Toggle Sign Up/Login */}
        <TouchableOpacity
          onPress={() => setIsSignup(!isSignup)}
          className="py-3"
        >
          <Text className="text-dark-muted text-center">
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            <Text className="text-primary-400 font-semibold">
              {isSignup ? 'Log In' : 'Sign Up'}
            </Text>
          </Text>
        </TouchableOpacity>

        {/* Forgot Password */}
        {!isSignup && (
          <TouchableOpacity className="py-2">
            <Text className="text-dark-muted text-center text-sm">
              Forgot password?
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};
