/**
 * CaloriTrack - Button Component
 * Minimal. Cool. Aesthetic.
 */

import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  // Button styles based on variant
  const getButtonStyle = (): ViewStyle => {
    const baseStyle = {
      borderRadius: BORDER_RADIUS.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    };

    // Size variations
    const sizeStyles = {
      small: {
        paddingVertical: SPACING[2],
        paddingHorizontal: SPACING[4],
      },
      medium: {
        paddingVertical: SPACING[3],
        paddingHorizontal: SPACING[6],
      },
      large: {
        paddingVertical: SPACING[4],
        paddingHorizontal: SPACING[8],
      },
    };

    // Variant styles
    const variantStyles = {
      primary: {
        backgroundColor: disabled ? COLORS.border : COLORS.primary,
        ...SHADOWS.md,
      },
      secondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.border,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...SHADOWS.sm,
      ...(fullWidth && { width: '100%' }),
      ...style,
    };
  };

  // Text styles based on variant and size
  const getTextStyle = (): TextStyle => {
    const baseStyle = {
      textAlign: 'center' as const,
    };

    // Size variations
    const sizeStyles = {
      small: {
        fontSize: TYPOGRAPHY.fontSizes.sm,
        fontWeight: TYPOGRAPHY.fontWeights.medium,
        lineHeight: TYPOGRAPHY.lineHeights.normal * TYPOGRAPHY.fontSizes.sm,
      },
      medium: {
        fontSize: TYPOGRAPHY.fontSizes.base,
        fontWeight: TYPOGRAPHY.fontWeights.medium,
        lineHeight: TYPOGRAPHY.lineHeights.normal * TYPOGRAPHY.fontSizes.base,
      },
      large: {
        fontSize: TYPOGRAPHY.fontSizes.lg,
        fontWeight: TYPOGRAPHY.fontWeights.semibold,
        lineHeight: TYPOGRAPHY.lineHeights.normal * TYPOGRAPHY.fontSizes.lg,
      },
    };

    // Variant styles
    const variantStyles = {
      primary: {
        color: disabled ? COLORS.textTertiary : '#FFFFFF',
      },
      secondary: {
        color: disabled ? COLORS.textTertiary : COLORS.textPrimary,
      },
      ghost: {
        color: disabled ? COLORS.textTertiary : COLORS.primary,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...textStyle,
    };
  };

  const styles = StyleSheet.create({
    button: getButtonStyle(),
    text: getTextStyle(),
  });

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === 'primary'
              ? '#FFFFFF'
              : COLORS.primary
          }
        />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;