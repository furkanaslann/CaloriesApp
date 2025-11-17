/**
 * CaloriTrack - Shadow System
 * Minimal. Cool. Aesthetic.
 */

import { Platform } from 'react-native';

// Shadow definitions for different platforms
export const Shadows = {
  // No shadow
  none: {
    ...Platform.select({
      ios: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
      },
      android: {
        elevation: 0,
      },
      web: {
        boxShadow: 'none',
      },
    }),
  },

  // Subtle shadow for small elements
  sm: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
    }),
  },

  // Medium shadow for cards
  md: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    }),
  },

  // Large shadow for modals
  lg: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    }),
  },

  // Extra large shadow for overlays
  xl: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.25,
        shadowRadius: 25,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    }),
  },

  // Inner shadow for pressed states
  inner: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
    }),
  },
} as const;

// Colored shadows for different states
export const ColoredShadows = {
  // Primary color shadow
  primary: {
    ...Platform.select({
      ios: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.2)',
      },
    }),
  },

  // Success color shadow
  success: {
    ...Platform.select({
      ios: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.2)',
      },
    }),
  },

  // Error color shadow
  error: {
    ...Platform.select({
      ios: {
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.2)',
      },
    }),
  },

  // Warning color shadow
  warning: {
    ...Platform.select({
      ios: {
        shadowColor: '#F59E0B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 14px 0 rgba(245, 158, 11, 0.2)',
      },
    }),
  },
} as const;

// Usage patterns
export const ShadowPatterns = {
  // Interactive elements
  button: Shadows.md,
  buttonPressed: Shadows.sm,
  buttonHover: Shadows.lg,

  // Card elements
  card: Shadows.sm,
  cardHover: Shadows.md,
  cardPressed: Shadows.sm,
  modal: Shadows.lg,
  sheet: Shadows.lg,

  // UI elements
  navigation: Shadows.md,
  dropdown: Shadows.lg,
  tooltip: Shadows.sm,
  badge: Shadows.none,

  // Special elements
  hero: Shadows.xl,
  featured: ColoredShadows.primary,
  floating: Shadows.lg,
} as const;