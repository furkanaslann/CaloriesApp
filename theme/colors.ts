/**
 * CaloriTrack - Temel Renk Paleti
 * Minimal. Cool. Aesthetic.
 */

export const Colors = {
  // Primary Colors
  primary: '#6366F1',        // Indigo-500
  primaryDark: '#4F46E5',    // Indigo-600
  primaryLight: '#818CF8',   // Indigo-400

  // Neutral Colors
  background: '#FFFFFF',     // Pure white
  surface: '#FAFAFA',        // Gray-50
  border: '#E5E7EB',         // Gray-200
  textPrimary: '#111827',    // Gray-900
  textSecondary: '#6B7280',  // Gray-500
  textTertiary: '#9CA3AF',   // Gray-400

  // Success Colors
  success: '#10B981',        // Emerald-500
  successLight: '#D1FAE5',   // Emerald-100

  // Error Colors
  error: '#EF4444',          // Red-500
  errorLight: '#FEE2E2',     // Red-100

  // Warning Colors
  warning: '#F59E0B',        // Amber-500
  warningLight: '#FEF3C7',   // Amber-100

  // Info Colors
  info: '#3B82F6',           // Blue-500
  infoLight: '#DBEAFE',      // Blue-100
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
    inverse: DarkColors.textPrimary,
    onPrimary: '#FFFFFF',    // White text on primary colors
    onError: '#FFFFFF',      // White text on error colors
    onSuccess: '#FFFFFF',    // White text on success colors
  },

  // Background colors
  background: {
    primary: Colors.background,
    surface: Colors.surface,
    secondary: Colors.surface,
    tertiary: '#F9FAFB',     // Gray-50
    inverse: DarkColors.background,
    primarySurface: Colors.primaryLight,
    errorSurface: Colors.errorLight,
    successSurface: Colors.successLight,
  },

  // Border colors
  border: {
    primary: Colors.border,
    secondary: '#E5E7EB',
    tertiary: '#F3F4F6',
    focus: Colors.primary,
    error: Colors.error,
    success: Colors.success,
  },
};

// Dark mode semantic colors
export const DarkSemanticColors = {
  // Text colors
  text: {
    primary: DarkColors.textPrimary,
    secondary: DarkColors.textSecondary,
    tertiary: DarkColors.textTertiary,
    inverse: Colors.textPrimary,
    onPrimary: '#FFFFFF',
    onError: '#FFFFFF',
    onSuccess: '#FFFFFF',
  },

  // Background colors
  background: {
    primary: DarkColors.background,
    surface: DarkColors.surface,
    secondary: DarkColors.surface,
    tertiary: '#374151',     // Gray-700
    inverse: Colors.background,
    primarySurface: DarkColors.primaryLight,
    errorSurface: DarkColors.errorLight,
    successSurface: DarkColors.successLight,
  },

  // Border colors
  border: {
    primary: DarkColors.border,
    secondary: DarkColors.border,
    tertiary: '#4B5563',     // Gray-600
    focus: DarkColors.primary,
    error: DarkColors.error,
    success: DarkColors.success,
  },
};