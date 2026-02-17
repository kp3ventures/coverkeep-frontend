import React from 'react';
import { View, Text } from 'react-native';

interface ExpirationBadgeProps {
  warrantyEndDate: Date;
  size?: 'small' | 'medium' | 'large';
}

export const ExpirationBadge: React.FC<ExpirationBadgeProps> = ({ 
  warrantyEndDate, 
  size = 'medium' 
}) => {
  const now = new Date();
  const daysRemaining = Math.ceil((warrantyEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  let status: 'active' | 'expiring-soon' | 'expired';
  let bgColor: string;
  let textColor: string;
  
  if (daysRemaining < 0) {
    status = 'expired';
    bgColor = 'bg-red-500/20';
    textColor = 'text-red-400';
  } else if (daysRemaining <= 30) {
    status = 'expiring-soon';
    bgColor = 'bg-yellow-500/20';
    textColor = 'text-yellow-400';
  } else {
    status = 'active';
    bgColor = 'bg-green-500/20';
    textColor = 'text-green-400';
  }
  
  const sizeClasses = {
    small: 'px-2 py-1',
    medium: 'px-3 py-1.5',
    large: 'px-4 py-2',
  };
  
  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  };
  
  const displayText = 
    status === 'expired' 
      ? 'Expired' 
      : status === 'expiring-soon'
        ? `${daysRemaining}d left`
        : `${daysRemaining}d left`;
  
  return (
    <View className={`${bgColor} ${sizeClasses[size]} rounded-full self-start`}>
      <Text className={`${textColor} ${textSizeClasses[size]} font-semibold`}>
        {displayText}
      </Text>
    </View>
  );
};
