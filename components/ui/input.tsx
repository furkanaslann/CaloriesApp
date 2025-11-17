/**
 * CaloriTrack - Input Component
 * Minimal. Cool. Aesthetic.
 */

import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { useThemeContext } from '../../contexts/theme-context';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  containerStyle,
  inputStyle,
  leftIcon,
  rightIcon,
  ...textInputProps
}) => {
  const { theme } = useThemeContext();
  const [isFocused, setIsFocused] = useState(false);

  const getInputStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      borderWidth: 1,
      borderColor: error
        ? theme.colors.error
        : isFocused
        ? theme.colors.primary
        : theme.semanticColors.border.primary,
      backgroundColor: theme.semanticColors.background.primary,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      fontSize: theme.typography.fontSize.base,
      color: theme.semanticColors.text.primary,
      fontFamily: theme.typography.fontFamily.primary,
    };

    if (leftIcon || rightIcon) {
      baseStyle.paddingHorizontal = theme.spacing.lg;
    }

    return {
      ...baseStyle,
      ...inputStyle,
    };
  };

  const getContainerStyle = (): ViewStyle => ({
    marginBottom: theme.spacing.md,
    ...containerStyle,
  });

  const getLabelStyle = (): TextStyle => ({
    ...theme.textStyles.labelMedium,
    color: error
      ? theme.colors.error
      : theme.semanticColors.text.primary,
    marginBottom: theme.spacing.sm,
  });

  const getHelperTextStyle = (): TextStyle => ({
    ...theme.textStyles.caption,
    color: error
      ? theme.colors.error
      : theme.semanticColors.text.secondary,
    marginTop: theme.spacing.sm,
  });

  const styles = StyleSheet.create({
    container: getContainerStyle(),
    inputContainer: {
      position: 'relative',
    },
    input: getInputStyle(),
    label: getLabelStyle(),
    helperText: getHelperTextStyle(),
    leftIcon: {
      position: 'absolute',
      left: theme.spacing.md,
      top: '50%',
      transform: [{ translateY: -12 }],
      zIndex: 1,
    },
    rightIcon: {
      position: 'absolute',
      right: theme.spacing.md,
      top: '50%',
      transform: [{ translateY: -12 }],
      zIndex: 1,
    },
    inputWithLeftIcon: {
      paddingLeft: theme.spacing['3xl'],
    },
    inputWithRightIcon: {
      paddingRight: theme.spacing['3xl'],
    },
  });

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.inputContainer}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
          ]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={theme.semanticColors.text.tertiary}
          {...textInputProps}
        />

        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>

      {(error || helperText) && (
        <Text style={styles.helperText}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

export default Input;