/**
 * CaloriTrack - Border Radius System
 * Minimal. Cool. Aesthetic.
 */

// Border radius scale
export const BorderRadius = {
  none: 0,                  // No border radius
  xs: 4,                    // Small elements, tags
  sm: 8,                    // Buttons, input fields
  md: 12,                   // Cards, larger elements
  lg: 16,                   // Modals, special containers
  xl: 20,                   // Hero elements
  '2xl': 24,                // Extra large elements
  '3xl': 32,                // Full cards
  full: 9999,               // Pills, avatars, circles
} as const;

// Common usage patterns
export const BorderPatterns = {
  // Interactive elements
  button: BorderRadius.sm,
  input: BorderRadius.sm,
  chip: BorderRadius.xs,
  pill: BorderRadius.full,
  avatar: BorderRadius.full,

  // Card elements
  card: BorderRadius.md,
  modal: BorderRadius.lg,
  sheet: BorderRadius.xl,
  cardHeader: BorderRadius.md,

  // UI elements
  badge: BorderRadius.xs,
  tooltip: BorderRadius.sm,
  dropdown: BorderRadius.sm,
  navigation: BorderRadius.lg,

  // Special elements
  hero: BorderRadius.xl,
  featured: BorderRadius['2xl'],
  image: BorderRadius.md,
  thumbnail: BorderRadius.sm,
} as const;

// Quick access for common values
export const borderRadius = {
  none: BorderRadius.none,
  sm: BorderRadius.sm,
  md: BorderRadius.md,
  lg: BorderRadius.lg,
  xl: BorderRadius.xl,
  full: BorderRadius.full,
} as const;