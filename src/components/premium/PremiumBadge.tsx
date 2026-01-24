/**
 * PremiumBadge Component
 *
 * Small badge to indicate premium features
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LightTheme } from '@/constants';

interface PremiumBadgeProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({
  size = 'small',
  text = 'PRO',
}) => {
  const sizeStyles = {
    small: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      fontSize: 10,
    },
    medium: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      fontSize: 12,
    },
    large: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      fontSize: 14,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <View
      style={[
        styles.badge,
        {
          paddingHorizontal: currentSize.paddingHorizontal,
          paddingVertical: currentSize.paddingVertical,
          borderRadius: currentSize.borderRadius,
        },
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          { fontSize: currentSize.fontSize },
        ]}
      >
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: `${LightTheme.colors.primary}15`,
    borderWidth: 1,
    borderColor: LightTheme.colors.primary,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: LightTheme.colors.primary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
