/**
 * CaloriTrack - App Configuration
 *
 * Development mode configuration for using mock data
 */

/**
 * App configuration settings
 */
export const APP_CONFIG = {
  /**
   * Use mock recipes in development mode
   * Set to false to use real Firestore data
   */
  useMockRecipes: process.env.NODE_ENV === 'development',

  /**
   * Enable debug logging
   */
  debug: process.env.NODE_ENV === 'development',
} as const;
