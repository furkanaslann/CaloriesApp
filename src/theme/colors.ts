/**
 * CaloriTrack - Temel Renk Paleti
 * Minimal. Cool. Aesthetic.
 */

export const Colors = {
  // Primary Colors - Figma design inspired
  primary: '#7C3AED',        // Purple-600 (modern purple from Figma)
  primaryDark: '#6D28D9',    // Purple-700
  primaryLight: '#A78BFA',   // Purple-400

  // Gradient colors for modern look
  gradientStart: '#7C3AED',  // Purple-600
  gradientEnd: '#EC4899',    // Pink-500
  gradientAccent: '#F59E0B', // Amber-500

  // Neutral Colors - warmer tones
  background: '#FFFFFF',     // Pure white
  surface: '#FEFEFE',        // Very light gray
  surfaceAlt: '#F8FAFC',     // Blue-50
  border: '#E2E8F0',         // Gray-200
  borderLight: '#F1F5F9',    // Gray-100
  textPrimary: '#1E293B',    // Slate-800
  textSecondary: '#64748B',  // Slate-500
  textTertiary: '#94A3B8',   // Slate-400
  textMuted: '#CBD5E1',      // Slate-300

  // Success Colors
  success: '#10B981',        // Emerald-500
  successLight: '#D1FAE5',   // Emerald-100
  successDark: '#047857',    // Emerald-700

  // Error Colors
  error: '#EF4444',          // Red-500
  errorLight: '#FEE2E2',     // Red-100
  errorDark: '#B91C1C',      // Red-700

  // Warning Colors
  warning: '#F59E0B',        // Amber-500
  warningLight: '#FEF3C7',   // Amber-100
  warningDark: '#D97706',    // Amber-600

  // Info Colors
  info: '#3B82F6',           // Blue-500
  infoLight: '#DBEAFE',      // Blue-100
  infoDark: '#2563EB',       // Blue-600

  // Onboarding specific colors
  onboardingAccent: '#7C3AED', // Purple-600 (matches primary color)
  onboardingText: '#334155',   // Slate-700
  onboardingSubtle: '#F1F5F9', // Slate-100
};

// Dark mode colors
export const DarkColors = {
  // Primary Colors
  primary: '#818CF8',        // Indigo-400
  primaryDark: '#6366F1',    // Indigo-500
  primaryLight: '#A5B4FC',   // Indigo-300

  // Neutral Colors
  background: '#111827',     // Gray-900
  surface: '#1F2937',        // Gray-800
  border: '#374151',         // Gray-700
  textPrimary: '#F9FAFB',    // Gray-50
  textSecondary: '#D1D5DB',  // Gray-300
  textTertiary: '#9CA3AF',   // Gray-400

  // Success Colors
  success: '#34D399',        // Emerald-400
  successLight: '#064E3B',   // Emerald-900

  // Error Colors
  error: '#F87171',          // Red-400
  errorLight: '#7F1D1D',     // Red-900

  // Warning Colors
  warning: '#FBBF24',        // Amber-400
  warningLight: '#78350F',   // Amber-900

  // Info Colors
  info: '#60A5FA',           // Blue-400
  infoLight: '#1E3A8A',      // Blue-900
};

// Semantic colors for easier usage
export const SemanticColors = {
  // Text colors
  text: {
    primary: Colors.textPrimary,
    secondary: Colors.textSecondary,
    tertiary: Colors.textTertiary,
    muted: Colors.textMuted,
    inverse: DarkColors.textPrimary,
    onPrimary: '#FFFFFF',    // White text on primary colors
    onError: '#FFFFFF',      // White text on error colors
    onSuccess: '#FFFFFF',    // White text on success colors
    onGradient: '#FFFFFF',   // White text on gradients
    onboarding: Colors.onboardingText,
  },

  // Background colors
  background: {
    primary: Colors.background,
    surface: Colors.surface,
    secondary: Colors.surfaceAlt,
    tertiary: Colors.onboardingSubtle,
    inverse: DarkColors.background,
    primarySurface: Colors.primaryLight,
    errorSurface: Colors.errorLight,
    successSurface: Colors.successLight,
    gradient: 'transparent', // Will be handled with gradients
    onboardingCard: Colors.surface,
  },

  // Border colors
  border: {
    primary: Colors.border,
    secondary: Colors.borderLight,
    tertiary: '#F8FAFC',
    focus: Colors.primary,
    error: Colors.error,
    success: Colors.success,
    onboarding: Colors.borderLight,
  },

  // Onboarding specific
  onboarding: {
    accent: Colors.onboardingAccent,
    background: Colors.background,
    card: Colors.onboardingSubtle,
    text: Colors.onboardingText,
    border: Colors.borderLight,
  },
};

// Dark mode semantic colors
export const DarkSemanticColors = {
  // Text colors
  text: {
    primary: DarkColors.textPrimary,
    secondary: DarkColors.textSecondary,
    tertiary: DarkColors.textTertiary,
    muted: DarkColors.textSecondary,
    inverse: Colors.textPrimary,
    onPrimary: '#FFFFFF',
    onError: '#FFFFFF',
    onSuccess: '#FFFFFF',
    onGradient: '#FFFFFF',
    onboarding: DarkColors.textSecondary,
  },

  // Background colors
  background: {
    primary: DarkColors.background,
    surface: DarkColors.surface,
    secondary: '#1F2937',     // Gray-800
    tertiary: '#374151',      // Gray-700
    inverse: Colors.background,
    primarySurface: DarkColors.primaryLight,
    errorSurface: DarkColors.errorLight,
    successSurface: DarkColors.successLight,
    gradient: 'transparent',
    onboardingCard: DarkColors.surface,
  },

  // Border colors
  border: {
    primary: DarkColors.border,
    secondary: DarkColors.border,
    tertiary: '#4B5563',      // Gray-600
    focus: DarkColors.primary,
    error: DarkColors.error,
    success: DarkColors.success,
    onboarding: DarkColors.border,
  },

  // Onboarding specific
  onboarding: {
    accent: Colors.onboardingAccent,
    background: DarkColors.background,
    card: DarkColors.surface,
    text: DarkColors.textSecondary,
    border: DarkColors.border,
  },
};