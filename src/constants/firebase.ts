/**
 * CaloriTrack - Firebase Configuration Constants
 */

export const FIREBASE_CONFIG = {
  collections: {
    users: 'users',
    meals: 'meals',
    foodLogs: 'foodLogs',
    recipes: 'recipes',
  },
  storageKeys: {
    onboarding: '@caloriesApp:onboarding',
  },
} as const;

