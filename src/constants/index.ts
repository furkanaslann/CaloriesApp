/**
 * CaloriTrack - Constants
 * Minimal. Cool. Aesthetic.
 */

import { TextStyle, ViewStyle } from 'react-native';
import { Theme, ThemeContextType } from '@/types/ui';

// Light Theme
export const LightTheme: Theme = {
  colors: {
    primary: '#7C3AED',
    primaryDark: '#6D28D9',
    primaryLight: '#A78BFA',
    background: '#FFFFFF',
    surface: '#FEFEFE',
    surfaceAlt: '#F8FAFC',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    textMuted: '#CBD5E1',
    success: '#10B981',
    successLight: '#D1FAE5',
    successDark: '#047857',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    errorDark: '#B91C1C',
    onboardingAccent: '#F97316',
    onboardingText: '#334155',
    onboardingSubtle: '#F1F5F9',
  },
  semanticColors: {
    background: {
      primary: '#FFFFFF',
      secondary: '#FEFEFE',
    },
    border: {
      primary: '#E2E8F0',
      secondary: '#F1F5F9',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
      tertiary: '#94A3B8',
      onPrimary: '#FFFFFF',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 40,
    '6xl': 48,
    '8xl': 32,
    '10xl': 40,
    '12xl': 48,
    '16xl': 64,
    '20xl': 80,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  typography: {
    xs: {
      fontSize: 12,
      lineHeight: 16,
    },
    sm: {
      fontSize: 14,
      lineHeight: 20,
    },
    base: {
      fontSize: 16,
      lineHeight: 24,
    },
    lg: {
      fontSize: 18,
      lineHeight: 28,
    },
    xl: {
      fontSize: 20,
      lineHeight: 30,
    },
    '2xl': {
      fontSize: 24,
      lineHeight: 32,
    },
    '3xl': {
      fontSize: 30,
      lineHeight: 38,
      letterSpacing: -0.5,
    },
    '4xl': {
      fontSize: 36,
      lineHeight: 44,
      letterSpacing: -1,
    },
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 15,
      elevation: 5,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.1,
      shadowRadius: 25,
      elevation: 8,
    },
  },
};

// Dark Theme
export const DarkTheme: Theme = {
  colors: {
    primary: '#7C3AED',
    primaryDark: '#6D28D9',
    primaryLight: '#A78BFA',
    background: '#0F172A',
    surface: '#1E293B',
    surfaceAlt: '#334155',
    border: '#475569',
    borderLight: '#475569',
    textPrimary: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textTertiary: '#94A3B8',
    textMuted: '#64748B',
    success: '#10B981',
    successLight: '#065F46',
    successDark: '#34D399',
    error: '#EF4444',
    errorLight: '#7F1D1D',
    errorDark: '#F87171',
    onboardingAccent: '#F97316',
    onboardingText: '#F8FAFC',
    onboardingSubtle: '#334155',
  },
  semanticColors: {
    background: {
      primary: '#0F172A',
      secondary: '#1E293B',
    },
    border: {
      primary: '#475569',
      secondary: '#475569',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#CBD5E1',
      tertiary: '#94A3B8',
      onPrimary: '#FFFFFF',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 40,
    '6xl': 48,
    '8xl': 32,
    '10xl': 40,
    '12xl': 48,
    '16xl': 64,
    '20xl': 80,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  typography: {
    xs: {
      fontSize: 12,
      lineHeight: 16,
    },
    sm: {
      fontSize: 14,
      lineHeight: 20,
    },
    base: {
      fontSize: 16,
      lineHeight: 24,
    },
    lg: {
      fontSize: 18,
      lineHeight: 28,
    },
    xl: {
      fontSize: 20,
      lineHeight: 30,
    },
    '2xl': {
      fontSize: 24,
      lineHeight: 32,
    },
    '3xl': {
      fontSize: 30,
      lineHeight: 38,
      letterSpacing: -0.5,
    },
    '4xl': {
      fontSize: 36,
      lineHeight: 44,
      letterSpacing: -1,
    },
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 15,
      elevation: 5,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.1,
      shadowRadius: 25,
      elevation: 8,
    },
  },
};


// Export theme hook (deprecated - use useThemeContext instead)
export const useTheme = () => {
  // This is a placeholder to prevent import errors
  // Components should use useThemeContext() from the theme context provider
  console.warn('useTheme is deprecated. Use useThemeContext() from theme context instead.');
  return LightTheme; // Default fallback
};