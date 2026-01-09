/**
 * CaloriTrack - Feature Configuration
 * 
 * Defines feature access and limits for Free and Premium tiers.
 * This file is the single source of truth for feature gating.
 */

export type TierType = 'free' | 'premium';

export interface FeatureLimits {
  // AI & Scanning
  dailyScanLimit: number;
  scanAccuracy: 'standard' | 'enhanced';
  multiFoodDetection: boolean;
  portionAnalysis: boolean;
  offlineScanning: boolean;
  scanHistoryLimit: number | null; // null = unlimited

  // Data & History
  mealHistoryDays: number | null; // null = unlimited
  weightHistoryDays: number | null; // null = unlimited
  photoStorageLimit: number | null; // null = unlimited
  customFoodsLimit: number | null; // null = unlimited

  // Meal Planning
  activeMealPlans: number;
  monthlyRecipes: number | null; // null = unlimited
  aiMealSuggestions: boolean;
  customRecipeCreation: boolean;
  groceryListGeneration: boolean;
  mealPrepScheduling: boolean;

  // Analytics
  advancedAnalytics: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
  patternRecognition: boolean;
  detailedNutritionBreakdown: boolean;
  customDateRanges: boolean;
  comparativeAnalysis: boolean;

  // AI Insights
  aiMealSuggestions: boolean;
  nutritionalGapsDetection: boolean;
  smartMealTiming: boolean;
  personalizedTips: boolean;
  macroOptimization: boolean;
  habitFormation: boolean;

  // Export & Sharing
  pdfExport: boolean;
  csvExport: boolean;
  emailReports: boolean;
  dataPortability: boolean;

  // Additional Features
  offlineMode: boolean;
  prioritySupport: boolean;
  adFree: boolean;
  earlyAccess: boolean;
  betaFeatures: boolean;
}

/**
 * Feature limits for Free tier
 */
export const FREE_FEATURES: FeatureLimits = {
  // AI & Scanning
  dailyScanLimit: 10,
  scanAccuracy: 'standard',
  multiFoodDetection: false,
  portionAnalysis: false,
  offlineScanning: false,
  scanHistoryLimit: 20,

  // Data & History
  mealHistoryDays: 7,
  weightHistoryDays: 30,
  photoStorageLimit: 20,
  customFoodsLimit: 10,

  // Meal Planning
  activeMealPlans: 1,
  monthlyRecipes: 5,
  aiMealSuggestions: false,
  customRecipeCreation: false,
  groceryListGeneration: false,
  mealPrepScheduling: false,

  // Analytics
  advancedAnalytics: false,
  weeklyReports: false,
  monthlyReports: false,
  patternRecognition: false,
  detailedNutritionBreakdown: false,
  customDateRanges: false,
  comparativeAnalysis: false,

  // AI Insights
  nutritionalGapsDetection: false,
  smartMealTiming: false,
  personalizedTips: false,
  macroOptimization: false,
  habitFormation: false,

  // Export & Sharing
  pdfExport: false,
  csvExport: false,
  emailReports: false,
  dataPortability: false,

  // Additional Features
  offlineMode: false,
  prioritySupport: false,
  adFree: false,
  earlyAccess: false,
  betaFeatures: false,
};

/**
 * Feature limits for Premium tier
 */
export const PREMIUM_FEATURES: FeatureLimits = {
  // AI & Scanning
  dailyScanLimit: 50,
  scanAccuracy: 'enhanced',
  multiFoodDetection: true,
  portionAnalysis: true,
  offlineScanning: true,
  scanHistoryLimit: null, // unlimited

  // Data & History
  mealHistoryDays: null, // unlimited
  weightHistoryDays: null, // unlimited
  photoStorageLimit: null, // unlimited
  customFoodsLimit: null, // unlimited

  // Meal Planning
  activeMealPlans: 10,
  monthlyRecipes: null, // unlimited
  aiMealSuggestions: true,
  customRecipeCreation: true,
  groceryListGeneration: true,
  mealPrepScheduling: true,

  // Analytics
  advancedAnalytics: true,
  weeklyReports: true,
  monthlyReports: true,
  patternRecognition: true,
  detailedNutritionBreakdown: true,
  customDateRanges: true,
  comparativeAnalysis: true,

  // AI Insights
  nutritionalGapsDetection: true,
  smartMealTiming: true,
  personalizedTips: true,
  macroOptimization: true,
  habitFormation: true,

  // Export & Sharing
  pdfExport: true,
  csvExport: true,
  emailReports: true,
  dataPortability: true,

  // Additional Features
  offlineMode: true,
  prioritySupport: true,
  adFree: true,
  earlyAccess: true,
  betaFeatures: true,
};

/**
 * Get feature limits for a specific tier
 */
export function getFeatureLimits(tier: TierType): FeatureLimits {
  return tier === 'premium' ? PREMIUM_FEATURES : FREE_FEATURES;
}

/**
 * Check if a feature is available for a tier
 */
export function hasFeature(
  tier: TierType,
  feature: keyof FeatureLimits
): boolean {
  const limits = getFeatureLimits(tier);
  const value = limits[feature];

  // For numeric limits, check if > 0 or null (unlimited)
  if (typeof value === 'number') {
    return value > 0 || value === null;
  }

  // For boolean features
  return value === true;
}

/**
 * Check if user has reached a usage limit
 */
export function checkUsageLimit(
  tier: TierType,
  feature: keyof FeatureLimits,
  currentUsage: number
): { allowed: boolean; remaining: number | null } {
  const limits = getFeatureLimits(tier);
  const limit = limits[feature];

  if (typeof limit !== 'number') {
    return { allowed: true, remaining: null };
  }

  if (limit === null) {
    // Unlimited
    return { allowed: true, remaining: null };
  }

  const remaining = Math.max(0, limit - currentUsage);
  return {
    allowed: remaining > 0,
    remaining: remaining > 0 ? remaining : 0,
  };
}

/**
 * Get upgrade message for a feature
 */
export function getUpgradeMessage(feature: keyof FeatureLimits): string {
  const messages: Record<keyof FeatureLimits, string> = {
    dailyScanLimit: 'Upgrade to Premium for 50 scans/day',
    scanAccuracy: 'Enhanced AI accuracy with Premium',
    multiFoodDetection: 'Detect multiple foods with Premium',
    portionAnalysis: 'Advanced portion analysis with Premium',
    offlineScanning: 'Scan offline with Premium',
    scanHistoryLimit: 'Unlimited scan history with Premium',
    mealHistoryDays: 'Unlimited meal history with Premium',
    weightHistoryDays: 'Unlimited weight history with Premium',
    photoStorageLimit: 'Unlimited photo storage with Premium',
    customFoodsLimit: 'Unlimited custom foods with Premium',
    activeMealPlans: 'Create up to 10 meal plans with Premium',
    monthlyRecipes: 'Unlimited recipe access with Premium',
    aiMealSuggestions: 'AI meal suggestions with Premium',
    customRecipeCreation: 'Create custom recipes with Premium',
    groceryListGeneration: 'Auto-generate grocery lists with Premium',
    mealPrepScheduling: 'Schedule meal prep with Premium',
    advancedAnalytics: 'Advanced analytics with Premium',
    weeklyReports: 'Weekly reports with Premium',
    monthlyReports: 'Monthly reports with Premium',
    patternRecognition: 'AI pattern recognition with Premium',
    detailedNutritionBreakdown: 'Detailed nutrition breakdown with Premium',
    customDateRanges: 'Custom date range analysis with Premium',
    comparativeAnalysis: 'Comparative analysis with Premium',
    nutritionalGapsDetection: 'Nutritional gap detection with Premium',
    smartMealTiming: 'Smart meal timing with Premium',
    personalizedTips: 'Personalized AI tips with Premium',
    macroOptimization: 'AI macro optimization with Premium',
    habitFormation: 'Habit formation insights with Premium',
    pdfExport: 'Export PDF reports with Premium',
    csvExport: 'Export CSV data with Premium',
    emailReports: 'Email reports with Premium',
    dataPortability: 'Full data export with Premium',
    offlineMode: 'Offline mode with Premium',
    prioritySupport: 'Priority support with Premium',
    adFree: 'Ad-free experience with Premium',
    earlyAccess: 'Early access to features with Premium',
    betaFeatures: 'Beta features with Premium',
  };

  return messages[feature] || 'Upgrade to Premium for this feature';
}

/**
 * Feature configuration export
 */
export const FEATURE_CONFIG = {
  free: FREE_FEATURES,
  premium: PREMIUM_FEATURES,
  getFeatureLimits,
  hasFeature,
  checkUsageLimit,
  getUpgradeMessage,
} as const;

