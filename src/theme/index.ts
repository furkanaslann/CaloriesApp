/**
 * CaloriTrack - Complete Theme System
 * Minimal. Cool. Aesthetic.
 */

import { useColorScheme } from 'react-native';

// Import all theme modules
export * from './colors';
export * from './typography';
export * from './spacing';
export * from './border-radius';
export * from './shadows';
export * from './animations';

// Import specific values for themes
import {
  Colors,
  DarkColors,
  SemanticColors,
  DarkSemanticColors,
  ColoredShadows,
} from './colors';
import {
  Typography,
  TextStyles
} from './typography';
import {
  Spacing,
  SpacingPatterns
} from './spacing';
import {
  BorderRadius,
  BorderPatterns
} from './border-radius';
import {
  Shadows
} from './shadows';
import {
  Animations,
  PageTransitions,
  LoadingAnimations,
  SuccessAnimations
} from './animations';

// Combined theme interface
export interface Theme {
  colors: typeof Colors;
  semanticColors: typeof SemanticColors;
  typography: typeof Typography;
  textStyles: typeof TextStyles;
  spacing: typeof Spacing;
  spacingPatterns: typeof SpacingPatterns;
  borderRadius: typeof BorderRadius;
  borderPatterns: typeof BorderPatterns;
  shadows: typeof Shadows;
  coloredShadows: typeof ColoredShadows;
  animations: typeof Animations;
  pageTransitions: typeof PageTransitions;
  loadingAnimations: typeof LoadingAnimations;
  successAnimations: typeof SuccessAnimations;
}

// Light theme
export const LightTheme: Theme = {
  colors: Colors,
  semanticColors: SemanticColors,
  typography: Typography,
  textStyles: TextStyles,
  spacing: Spacing,
  spacingPatterns: SpacingPatterns,
  borderRadius: BorderRadius,
  borderPatterns: BorderPatterns,
  shadows: Shadows,
  coloredShadows: ColoredShadows,
  animations: Animations,
  pageTransitions: PageTransitions,
  loadingAnimations: LoadingAnimations,
  successAnimations: SuccessAnimations,
};

// Dark theme
export const DarkTheme: Theme = {
  colors: DarkColors,
  semanticColors: DarkSemanticColors,
  typography: Typography,
  textStyles: TextStyles,
  spacing: Spacing,
  spacingPatterns: SpacingPatterns,
  borderRadius: BorderRadius,
  borderPatterns: BorderPatterns,
  shadows: Shadows,
  coloredShadows: ColoredShadows,
  animations: Animations,
  pageTransitions: PageTransitions,
  loadingAnimations: LoadingAnimations,
  successAnimations: SuccessAnimations,
};

// Theme hook
export const useTheme = () => {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? DarkTheme : LightTheme;
};

// Theme provider type
export type ThemeContextType = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
};

// Utility functions
export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
};

export const rgba = (hex: string, alpha: number) => {
  const rgb = hexToRgb(hex);
  return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})` : hex;
};

export const getContrastColor = (hex: string) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#000000';

  // Calculate luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

  // Return black for light colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

// Default export
export default {
  LightTheme,
  DarkTheme,
  useTheme,
  hexToRgb,
  rgba,
  getContrastColor,
};