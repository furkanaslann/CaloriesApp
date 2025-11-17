/**
 * CaloriTrack - Spacing System
 * Minimal. Cool. Aesthetic.
 */

// Base spacing unit (4px scale)
const baseUnit = 4;

// Spacing scale
export const Spacing = {
  // Micro spacing
  micro: baseUnit * 0.5,     // 2px - Very small gaps
  xs: baseUnit,              // 4px - Tiny spacing, tags
  sm: baseUnit * 2,          // 8px - Small gaps
  md: baseUnit * 3,          // 12px - Moderate spacing
  lg: baseUnit * 4,          // 16px - Standard spacing
  xl: baseUnit * 5,          // 20px - Section separation
  '2xl': baseUnit * 6,       // 24px - Large spacing
  '3xl': baseUnit * 8,       // 32px - Component separation
  '4xl': baseUnit * 10,      // 40px - Page sections
  '5xl': baseUnit * 12,      // 48px - Major sections
  '6xl': baseUnit * 16,      // 64px - Page margins
  '7xl': baseUnit * 20,      // 80px - Hero sections
} as const;

// Common spacing patterns
export const SpacingPatterns = {
  // Component internal spacing
  padding: {
    xs: Spacing.sm,          // 8px
    sm: Spacing.md,          // 12px
    md: Spacing.lg,          // 16px
    lg: Spacing.xl,          // 20px
    xl: Spacing['2xl'],      // 24px
  },

  // Component external spacing (margin)
  margin: {
    xs: Spacing.xs,          // 4px
    sm: Spacing.sm,          // 8px
    md: Spacing.md,          // 12px
    lg: Spacing.lg,          // 16px
    xl: Spacing.xl,          // 20px
    '2xl': Spacing['2xl'],   // 24px
    '3xl': Spacing['3xl'],   // 32px
  },

  // Gap between elements
  gap: {
    xs: Spacing.xs,          // 4px
    sm: Spacing.sm,          // 8px
    md: Spacing.md,          // 12px
    lg: Spacing.lg,          // 16px
    xl: Spacing.xl,          // 20px
    '2xl': Spacing['2xl'],   // 24px
  },

  // Section spacing
  section: {
    xs: Spacing.xl,          // 20px
    sm: Spacing['2xl'],      // 24px
    md: Spacing['3xl'],      // 32px
    lg: Spacing['4xl'],      // 40px
    xl: Spacing['5xl'],      // 48px
  },

  // Container padding
  container: {
    xs: Spacing.lg,          // 16px
    sm: Spacing.xl,          // 20px
    md: Spacing['2xl'],      // 24px
    lg: Spacing['3xl'],      // 32px
  },

  // Screen specific margins
  screen: {
    mobile: Spacing.lg,      // 16px
    tablet: Spacing.xl,      // 20px
    desktop: Spacing['2xl'], // 24px
  },
} as const;

// Quick access for common values
export const spacing = {
  // Individual values
  0: 0,
  1: Spacing.xs,            // 4px
  2: Spacing.sm,            // 8px
  3: Spacing.md,            // 12px
  4: Spacing.lg,            // 16px
  5: Spacing.xl,            // 20px
  6: Spacing['2xl'],        // 24px
  8: Spacing['3xl'],        // 32px
  10: Spacing['4xl'],       // 40px
  12: Spacing['5xl'],       // 48px
  16: Spacing['6xl'],       // 64px
  20: Spacing['7xl'],       // 80px
} as const;

// Negative spacing for margins
export const NegativeSpacing = {
  xs: -Spacing.xs,          // -4px
  sm: -Spacing.sm,          // -8px
  md: -Spacing.md,          // -12px
  lg: -Spacing.lg,          // -16px
  xl: -Spacing.xl,          // -20px
  '2xl': -Spacing['2xl'],   // -24px
  '3xl': -Spacing['3xl'],   // -32px
} as const;