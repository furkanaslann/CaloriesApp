/**
 * CaloriTrack - Animation System
 * Minimal. Cool. Aesthetic.
 */

import { Easing } from 'react-native';

// Timing functions
export const EasingFunctions = {
  // Standard easing
  ease: Easing.ease,
  easeOut: Easing.out(Easing.quad),
  easeIn: Easing.in(Easing.quad),
  easeInOut: Easing.inOut(Easing.quad),

  // Bezier curves for smooth animations
  smooth: Easing.bezier(0.4, 0, 0.2, 1),
  entrance: Easing.bezier(0, 0, 0.2, 1),
  exit: Easing.bezier(0.4, 0, 1, 1),
  bounce: Easing.bezier(0.68, -0.55, 0.265, 1.55),
  elastic: Easing.elastic(1),
} as const;

// Animation durations
export const Durations = {
  instant: 0,
  fast: 150,           // Micro-interactions
  standard: 200,       // UI transitions
  slow: 300,           // Page transitions, complex animations
  slower: 500,         // Loading states
  slowest: 1000,       // Special animations
} as const;

// Common animations
export const Animations = {
  // Fade animations
  fadeIn: {
    duration: Durations.standard,
    easing: EasingFunctions.entrance,
    property: 'opacity',
    from: 0,
    to: 1,
  },
  fadeOut: {
    duration: Durations.standard,
    easing: EasingFunctions.exit,
    property: 'opacity',
    from: 1,
    to: 0,
  },

  // Scale animations
  scaleIn: {
    duration: Durations.standard,
    easing: EasingFunctions.entrance,
    property: 'scale',
    from: 0.9,
    to: 1,
  },
  scaleOut: {
    duration: Durations.fast,
    easing: EasingFunctions.exit,
    property: 'scale',
    from: 1,
    to: 0.95,
  },

  // Button press animation
  buttonPress: {
    duration: Durations.instant,
    easing: EasingFunctions.easeOut,
    property: 'scale',
    from: 1,
    to: 0.95,
  },
  buttonRelease: {
    duration: Durations.fast,
    easing: EasingFunctions.elastic,
    property: 'scale',
    from: 0.95,
    to: 1,
  },

  // Card hover animation
  cardHover: {
    duration: Durations.standard,
    easing: EasingFunctions.smooth,
    property: 'scale',
    from: 1,
    to: 1.02,
  },

  // Slide animations
  slideIn: {
    duration: Durations.standard,
    easing: EasingFunctions.entrance,
    property: 'translateX',
    from: 20,
    to: 0,
  },
  slideOut: {
    duration: Durations.standard,
    easing: EasingFunctions.exit,
    property: 'translateX',
    from: 0,
    to: -20,
  },

  // Slide up animation
  slideUp: {
    duration: Durations.standard,
    easing: EasingFunctions.entrance,
    property: 'translateY',
    from: 20,
    to: 0,
  },
  slideDown: {
    duration: Durations.standard,
    easing: EasingFunctions.exit,
    property: 'translateY',
    from: 0,
    to: 20,
  },

  // Shake animation for errors
  shake: {
    duration: Durations.fast,
    easing: EasingFunctions.easeInOut,
    property: 'translateX',
    sequence: [0, -10, 10, -10, 10, 0],
  },

  // Pulse animation
  pulse: {
    duration: Durations.slow,
    easing: EasingFunctions.easeInOut,
    property: 'scale',
    sequence: [1, 1.05, 1],
  },

  // Loading animation
  loading: {
    duration: Durations.slower,
    easing: EasingFunctions.easeInOut,
    property: 'rotate',
    from: 0,
    to: 360,
  },
} as const;

// Page transitions
export const PageTransitions = {
  // Slide transition
  slideIn: {
    duration: Durations.slow,
    easing: EasingFunctions.smooth,
    animation: [
      { property: 'translateX', from: 300, to: 0 },
      { property: 'opacity', from: 0, to: 1 },
    ],
  },
  slideOut: {
    duration: Durations.slow,
    easing: EasingFunctions.smooth,
    animation: [
      { property: 'translateX', from: 0, to: -300 },
      { property: 'opacity', from: 1, to: 0 },
    ],
  },

  // Fade transition
  fadeIn: {
    duration: Durations.standard,
    easing: EasingFunctions.entrance,
    animation: [
      { property: 'opacity', from: 0, to: 1 },
      { property: 'scale', from: 0.95, to: 1 },
    ],
  },
  fadeOut: {
    duration: Durations.standard,
    easing: EasingFunctions.exit,
    animation: [
      { property: 'opacity', from: 1, to: 0 },
      { property: 'scale', from: 1, to: 0.95 },
    ],
  },

  // Modal transition
  modalIn: {
    duration: Durations.slow,
    easing: EasingFunctions.bounce,
    animation: [
      { property: 'opacity', from: 0, to: 1 },
      { property: 'scale', from: 0.8, to: 1 },
    ],
  },
  modalOut: {
    duration: Durations.standard,
    easing: EasingFunctions.exit,
    animation: [
      { property: 'opacity', from: 1, to: 0 },
      { property: 'scale', from: 1, to: 0.8 },
    ],
  },
} as const;

// Loading states
export const LoadingAnimations = {
  skeleton: {
    duration: Durations.slower,
    easing: EasingFunctions.easeInOut,
    property: 'opacity',
    sequence: [0.3, 0.7, 0.3],
  },
  shimmer: {
    duration: Durations.slower,
    easing: EasingFunctions.easeInOut,
    property: 'translateX',
    from: -100,
    to: 100,
  },
  spinner: {
    duration: Durations.slower,
    easing: EasingFunctions.easeInOut,
    property: 'rotate',
    from: 0,
    to: 360,
    repeat: true,
  },
} as const;

// Success animations
export const SuccessAnimations = {
  checkmark: {
    duration: Durations.standard,
    easing: EasingFunctions.elastic,
    property: 'scale',
    sequence: [0, 1.2, 1],
  },
  confetti: {
    duration: Durations.slowest,
    easing: EasingFunctions.bounce,
    property: 'translateY',
    from: 0,
    to: -100,
  },
  celebration: {
    duration: Durations.slow,
    easing: EasingFunctions.bounce,
    animation: [
      { property: 'scale', sequence: [1, 1.1, 1] },
      { property: 'rotate', sequence: [0, 5, -5, 0] },
    ],
  },
} as const;