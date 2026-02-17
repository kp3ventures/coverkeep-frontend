import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useUserStore } from '../stores/userStore';
import { useUIStore } from '../stores/uiStore';
import { Header } from '../components/Header';
import { PremiumUpsell } from '../components/PremiumUpsell';

export const SettingsScreen = () => {
  const { user, logout } = useUserStore();
  const { modalVisible, modalType, showModal, hideModal, showToast } = useUIStore();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [remindersEnabled, setRemindersEnabled] = React.useState(true);

  const handleUpgrade = () => {
    hideModal();
    showToast('Redirecting to payment...', 'info');
    // TODO: Navigate to payment flow
  };

  return (
    <View className="flex-1 bg-dark-bg">
      <Header title="Settings" />

      <ScrollView className="flex-1">
        {/* Account Section */}
        <View className="px-4 py-6 border-b border-dark-border">
          <Text className="text-dark-muted text-sm font-semibold mb-4">ACCOUNT</Text>
          
          <View className="bg-dark-card rounded-xl p-4 mb-3 border border-dark-border">
            <Text className="text-dark-text text-lg font-semibold mb-1">{user?.name}</Text>
            <Text className="text-dark-muted text-sm">{user?.email}</Text>
          </View>

          {!user?.isPremium && (
            <TouchableOpacity
              onPress={() => showModal('premium-upsell')}
              className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-4 flex-row items-center justify-between border border-primary-400"
            >
              <View>
                <View className="flex-row items-center mb-1">
                  <Text className="text-white text-lg font-bold mr-2">Upgrade to Premium</Text>
                  <Text className="text-2xl">⭐</Text>
                </View>
                <Text className="text-white/80 text-sm">Unlock all features</Text>
              </View>
              <Text className="text-white text-2xl">→</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Notifications Section */}
        <View className="px-4 py-6 border-b border-dark-border">
          <Text className="text-dark-muted text-sm font-semibold mb-4">NOTIFICATIONS</Text>
          
          <SettingRow
            label="Push Notifications"
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
          <SettingRow
            label="Warranty Expiry Reminders"
            value={remindersEnabled}
            onValueChange={setRemindersEnabled}
          />
        </View>

        {/* Premium Features */}
        <View className="px-4 py-6 border-b border-dark-border">
          <Text className="text-dark-muted text-sm font-semibold mb-4">PREMIUM FEATURES</Text>
          
          <MenuButton
            label="AI Claim Assistant"
            icon="🤖"
            locked={!user?.isPremium}
            onPress={() => user?.isPremium ? showToast('AI Assistant', 'info') : showModal('premium-upsell')}
          />
          <MenuButton
            label="Advanced Analytics"
            icon="📊"
            locked={!user?.isPremium}
            onPress={() => user?.isPremium ? showToast('Analytics', 'info') : showModal('premium-upsell')}
          />
          <MenuButton
            label="Priority Support"
            icon="💬"
            locked={!user?.isPremium}
            onPress={() => user?.isPremium ? showToast('Support', 'info') : showModal('premium-upsell')}
          />
        </View>

        {/* General */}
        <View className="px-4 py-6 border-b border-dark-border">
          <Text className="text-dark-muted text-sm font-semibold mb-4">GENERAL</Text>
          
          <MenuButton
            label="Help & Support"
            icon="❓"
            onPress={() => showToast('Help coming soon', 'info')}
          />
          <MenuButton
            label="Privacy Policy"
            icon="🔒"
            onPress={() => showToast('Privacy Policy', 'info')}
          />
          <MenuButton
            label="Terms of Service"
            icon="📄"
            onPress={() => showToast('Terms of Service', 'info')}
          />
          <MenuButton
            label="About"
            icon="ℹ️"
            onPress={() => showToast('CoverKeep v1.0.0', 'info')}
          />
        </View>

        {/* Logout */}
        <View className="px-4 py-6">
          <TouchableOpacity
            onPress={() => {
              logout();
              showToast('Logged out successfully', 'success');
            }}
            className="bg-red-500/20 border border-red-500/30 rounded-xl py-4 active:opacity-70"
          >
            <Text className="text-red-400 text-center text-base font-semibold">
              Log Out
            </Text>
          </TouchableOpacity>
        </View>

        <View className="h-8" />
      </ScrollView>

      {/* Premium Upsell Modal */}
      <PremiumUpsell
        visible={modalVisible && modalType === 'premium-upsell'}
        onClose={hideModal}
        onUpgrade={handleUpgrade}
        feature="this feature"
      />
    </View>
  );
};

const SettingRow: React.FC<{
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}> = ({ label, value, onValueChange }) => (
  <View className="flex-row items-center justify-between py-3">
    <Text className="text-dark-text text-base">{label}</Text>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#334155', true: '#0ea5e9' }}
      thumbColor="#fff"
    />
  </View>
);

const MenuButton: React.FC<{
  label: string;
  icon: string;
  locked?: boolean;
  onPress: () => void;
}> = ({ label, icon, locked = false, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center py-4 border-b border-dark-border last:border-b-0 active:opacity-70"
  >
    <Text className="text-2xl mr-3">{icon}</Text>
    <Text className="text-dark-text text-base flex-1">{label}</Text>
    {locked && (
      <View className="bg-primary-500/20 px-2 py-1 rounded mr-2">
        <Text className="text-primary-400 text-xs font-semibold">PRO</Text>
      </View>
    )}
    <Text className="text-dark-muted text-xl">›</Text>
  </TouchableOpacity>
);
