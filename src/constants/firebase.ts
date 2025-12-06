/**
 * CaloriTrack - Firebase Configuration Constants
 */

export const FIREBASE_CONFIG = {
  collections: {
    users: 'users',
    meals: 'meals',
    foodLogs: 'foodLogs',
  },
  storageKeys: {
    onboarding: '@caloriesApp:onboarding',
  },
} as const;

