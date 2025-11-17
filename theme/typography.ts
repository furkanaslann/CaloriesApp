/**
 * CaloriTrack - Typography System
 * Minimal. Cool. Aesthetic.
 */

import { Platform } from 'react-native';

// Font Family
export const FontFamily = {
  primary: Platform.select({
    ios: 'system-ui',
    android: 'Roboto',
    web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    default: 'system-ui',
  }),
  monospace: Platform.select({
    ios: 'ui-monospace',
    android: 'monospace',
    web: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    default: 'monospace',
  }),
};

// Font Weights
export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// Font Sizes
export const FontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};

// Line Heights
export const LineHeight = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
};

// Letter Spacing
export const LetterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
};

// Typography Styles
export const Typography = {
  // Line heights for easy access
  lineHeight: LineHeight,

  // Heading styles
  heading1: {
    fontSize: FontSize['4xl'],
    fontWeight: FontWeight.bold,
    lineHeight: LineHeight.tight,
    letterSpacing: LetterSpacing.tight,
  },
  heading2: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    lineHeight: LineHeight.tight,
    letterSpacing: LetterSpacing.tight,
  },
  heading3: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.semibold,
    lineHeight: LineHeight.tight,
  },
  heading4: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    lineHeight: LineHeight.normal,
  },
  heading5: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    lineHeight: LineHeight.normal,
  },
  heading6: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    lineHeight: LineHeight.normal,
  },

  // Body text styles
  body1: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.regular,
    lineHeight: LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },
  body2: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    lineHeight: LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },
  body3: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    lineHeight: LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },

  // Button styles
  buttonLarge: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    lineHeight: LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },
  buttonMedium: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    lineHeight: LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },
  buttonSmall: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    lineHeight: LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },

  // Label styles
  labelLarge: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    lineHeight: LineHeight.normal,
    letterSpacing: LetterSpacing.wide,
  },
  labelMedium: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    lineHeight: LineHeight.normal,
    letterSpacing: LetterSpacing.wide,
  },
  labelSmall: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    lineHeight: LineHeight.normal,
    letterSpacing: LetterSpacing.wide,
  },

  // Caption styles
  caption: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    lineHeight: LineHeight.relaxed,
    letterSpacing: LetterSpacing.normal,
  },

  // Monospace styles
  code: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.monospace,
    fontWeight: FontWeight.regular,
    lineHeight: LineHeight.normal,
  },
  codeSmall: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.monospace,
    fontWeight: FontWeight.regular,
    lineHeight: LineHeight.normal,
  },
};

// Text styles for easy use in components
export const TextStyles = {
  // Display text
  display: Typography.heading1,
  heroTitle: Typography.heading2,
  sectionTitle: Typography.heading3,
  cardTitle: Typography.heading4,
  smallTitle: Typography.heading5,

  // Body text
  body: Typography.body1,
  bodySmall: Typography.body2,
  caption: Typography.body3,

  // UI text
  buttonText: Typography.buttonMedium,
  labelText: Typography.labelMedium,
  hintText: Typography.caption,
  codeText: Typography.code,
};