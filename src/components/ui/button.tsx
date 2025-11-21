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
import { useTheme } from '@/constants';

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
  const theme = useTheme();

  // Button styles based on variant
  const getButtonStyle = (): ViewStyle => {
    const baseStyle = {
      borderRadius: theme.borderRadius.sm,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    };

    // Size variations
    const sizeStyles = {
      small: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
      },
      medium: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xl,
      },
      large: {
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing['2xl'],
      },
    };

    // Variant styles
    const variantStyles = {
      primary: {
        backgroundColor: disabled
          ? theme.semanticColors.border.primary
          : theme.colors.primary,
        ...theme.shadows.md,
      },
      secondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.semanticColors.border.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...theme.shadows.sm,
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
      small: theme.textStyles.body,
      medium: theme.textStyles.labelLarge,
      large: theme.textStyles.heading4,
    };

    // Variant styles
    const variantStyles = {
      primary: {
        color: disabled
          ? theme.semanticColors.text.tertiary
          : theme.semanticColors.text.onPrimary,
      },
      secondary: {
        color: disabled
          ? theme.semanticColors.text.tertiary
          : theme.semanticColors.text.primary,
      },
      ghost: {
        color: disabled
          ? theme.semanticColors.text.tertiary
          : theme.colors.primary,
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
              ? theme.semanticColors.text.onPrimary
              : theme.colors.primary
          }
        />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;