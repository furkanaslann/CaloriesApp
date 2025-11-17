/**
 * CaloriTrack - Legacy Theme (Deprecated)
 *
 * @deprecated Use new theme system from '../theme' instead.
 * Import: import { useTheme } from '../theme';
 *
 * The new theme system provides:
 * - Complete design system (colors, typography, spacing, shadows, animations)
 * - Dark mode support
 * - Consistent styling across all components
 * - Better developer experience
 */

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
