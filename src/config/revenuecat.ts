/**
 * CaloriTrack - RevenueCat Configuration
 * 
 * IMPORTANT: Replace the placeholder API keys with your actual keys from RevenueCat dashboard
 * 
 * Setup Instructions:
 * 1. Go to https://app.revenuecat.com/
 * 2. Navigate to your project
 * 3. Go to Settings > API Keys
 * 4. Copy the iOS and Android API keys
 * 5. Replace the placeholder values below
 * 
 * Security Note:
 * - For production apps, consider using environment variables
 * - Never commit actual API keys to version control if repository is public
 * - Use different API keys for development and production environments
 */

import { Platform } from 'react-native';

/**
 * RevenueCat API Keys
 * Get your keys from: https://app.revenuecat.com/settings/api-keys
 */
export const REVENUECAT_CONFIG = {
  apiKeys: {
    // iOS API Key (starts with "appl_")
    ios: process.env.REVENUECAT_IOS_API_KEY || 'appl_YOUR_IOS_API_KEY_HERE',
    
    // Android API Key (starts with "goog_")
    android: process.env.REVENUECAT_ANDROID_API_KEY || 'goog_HATHmNubOnCvJlcXLSNrPbQuelT',
  },
  
  /**
   * Get the appropriate API key for the current platform
   */
  getApiKey: () => {
    return Platform.select({
      ios: REVENUECAT_CONFIG.apiKeys.ios,
      android: REVENUECAT_CONFIG.apiKeys.android,
      default: REVENUECAT_CONFIG.apiKeys.ios,
    });
  },
  
  /**
   * Entitlement identifiers
   * Configure these in your RevenueCat dashboard under Entitlements
   */
  entitlements: {
    premium: 'premium', // Main premium entitlement
  },
  
  /**
   * Product identifiers (optional - only if you need direct product references)
   * Configure these in your RevenueCat dashboard under Products
   */
  products: {
    // Example product IDs - replace with your actual product IDs
    monthly: 'caloriesapp_premium_monthly',
    yearly: 'caloriesapp_premium_yearly',
    lifetime: 'caloriesapp_premium_lifetime',
  },
  
  /**
   * Offering identifiers (optional - only if you use multiple offerings)
   * Configure these in your RevenueCat dashboard under Offerings
   */
  offerings: {
    default: 'default', // Default offering (required)
    promotional: 'promotional', // Example promotional offering
  },
};

/**
 * Check if API keys are configured (not using placeholders)
 */
export const areApiKeysConfigured = (): boolean => {
  const apiKey = REVENUECAT_CONFIG.getApiKey();
  return apiKey !== undefined && !apiKey.includes('YOUR_') && apiKey.length > 10;
};

/**
 * Development mode configuration
 */
export const REVENUECAT_DEV_CONFIG = {
  // Enable debug logs in development
  enableDebugLogs: __DEV__,
  
  // Show detailed error messages
  showDetailedErrors: __DEV__,
  
  // Mock purchases in development (useful for testing without real purchases)
  mockPurchases: false, // Set to true to enable mock purchases
};

export default REVENUECAT_CONFIG;


