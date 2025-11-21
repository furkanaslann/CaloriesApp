/**
 * CaloriTrack - Theme Constants
 * Design system and theme constants
 */

// Color Palette
export const COLORS = {
  // Primary Colors (Modern Purple Theme)
  primary: '#7C3AED',
  primaryDark: '#6D28D9',
  primaryLight: '#A78BFA',

  // Gradient Colors
  gradientStart: '#7C3AED',
  gradientEnd: '#EC4899',
  gradientAccent: '#F59E0B',

  // Neutral Colors
  background: '#FFFFFF',
  surface: '#FEFEFE',
  surfaceAlt: '#F8FAFC',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  textMuted: '#CBD5E1',

  // Success Colors
  success: '#10B981',
  successLight: '#D1FAE5',
  successDark: '#047857',

  // Error Colors
  error: '#EF4444',
  errorLight: '#FEE2E2',
  errorDark: '#B91C1C',

  // Onboarding Colors
  onboardingAccent: '#F97316',
  onboardingText: '#334155',
  onboardingSubtle: '#F1F5F9',
} as const;

// Typography
export const TYPOGRAPHY = {
  fontFamilies: {
    primary: 'Inter',
    system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
    monospace: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono"',
  },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// Spacing
export const SPACING = {
  // Scale: 4px base unit
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
} as const;

// Border Radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// Shadows
export const SHADOWS = {
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
    elevation: 10,
  },
} as const;

// Animation
export const ANIMATION = {
  durations: {
    fast: 150,
    standard: 200,
    slow: 300,
  },
  easings: {
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// Breakpoints
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200,
} as const;

// Component-specific constants
export const COMPONENTS = {
  button: {
    paddingVertical: SPACING[3],
    paddingHorizontal: SPACING[6],
    borderRadius: BORDER_RADIUS.md,
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
  },
  input: {
    paddingVertical: SPACING[3],
    paddingHorizontal: SPACING[4],
    borderRadius: BORDER_RADIUS.md,
    fontSize: TYPOGRAPHY.fontSizes.base,
    borderWidth: 1,
  },
  card: {
    padding: SPACING[6],
    borderRadius: BORDER_RADIUS.lg,
    shadow: SHADOWS.sm,
  },
} as const;

// Legacy exports for backward compatibility
export const Colors = {
  light: {
    text: '#111827',
    background: '#FFFFFF',
    tint: '#6366F1',
    icon: '#6B7280',
    tabIconDefault: '#6B7280',
    tabIconSelected: '#6366F1',
  },
  dark: {
    text: '#F9FAFB',
    background: '#111827',
    tint: '#818CF8',
    icon: '#9CA3AF',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: '#818CF8',
  },
};

export const Fonts = {
  sans: 'system-ui',
  serif: 'serif',
  rounded: 'system-ui',
  mono: 'monospace',
};