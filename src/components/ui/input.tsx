/**
 * CaloriTrack - Input Component
 * Minimal. Cool. Aesthetic.
 */

import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '@/constants/theme';
import { InputProps } from '@/types/ui';

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
  const [isFocused, setIsFocused] = useState(false);

  const getInputStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      borderWidth: 1,
      borderColor: error
        ? COLORS.error
        : isFocused
        ? COLORS.primary
        : COLORS.border,
      backgroundColor: COLORS.background,
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SPACING[4],
      paddingVertical: SPACING[3],
      fontSize: TYPOGRAPHY.fontSizes.base,
      color: COLORS.textPrimary,
    };

    if (leftIcon || rightIcon) {
      baseStyle.paddingHorizontal = SPACING[6];
    }

    return {
      ...baseStyle,
      ...inputStyle,
    };
  };

  const getContainerStyle = (): ViewStyle => ({
    marginBottom: SPACING[4],
    ...containerStyle,
  });

  const getLabelStyle = (): TextStyle => ({
    fontSize: TYPOGRAPHY.fontSizes.sm,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    color: error
      ? COLORS.error
      : COLORS.textPrimary,
    marginBottom: SPACING[2],
  });

  const getHelperTextStyle = (): TextStyle => ({
    fontSize: TYPOGRAPHY.fontSizes.xs,
    color: error
      ? COLORS.error
      : COLORS.textSecondary,
    marginTop: SPACING[2],
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
      left: SPACING[4],
      top: '50%',
      transform: [{ translateY: -12 }],
      zIndex: 1,
    },
    rightIcon: {
      position: 'absolute',
      right: SPACING[4],
      top: '50%',
      transform: [{ translateY: -12 }],
      zIndex: 1,
    },
    inputWithLeftIcon: {
      paddingLeft: SPACING[8],
    },
    inputWithRightIcon: {
      paddingRight: SPACING[8],
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
          placeholderTextColor={COLORS.textTertiary}
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