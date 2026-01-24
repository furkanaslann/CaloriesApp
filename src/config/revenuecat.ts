/**
 * RevenueCat Configuration
 *
 * API Keys - TODO: Replace with actual keys from RevenueCat dashboard
 * https://app.revenuecat.com/settings/api-keys
 */

export const REVENUECAT_CONFIG = {
  apiKeys: {
    // iOS API Key - starts with 'appl_'
    // Get from: https://app.revenuecat.com/settings/api-keys
    ios: 'appl_YOUR_IOS_KEY_HERE',

    // Android API Key - starts with 'goog_'
    // Get from: https://app.revenuecat.com/settings/api-keys
    android: 'goog_YOUR_ANDROID_KEY_HERE',
  },

  // Entitlement identifiers
  entitlements: {
    premium: 'premium',
  },

  // Product identifiers (must match exactly in App Store Connect and Google Play Console)
  products: {
    monthly: 'caloriesapp_premium_monthly',
    yearly: 'caloriesapp_premium_yearly',
    lifetime: 'caloriesapp_premium_lifetime',
  },
};

/**
 * Premium features list
 */
export const PREMIUM_FEATURES = [
  {
    icon: '🤖',
    title: 'AI Yemek Analizi',
    description: 'Sınırsız fotoğraf ile yemek analizi',
  },
  {
    icon: '📊',
    title: 'Detaylı Analitik',
    description: 'Besin değerleri ve kalori takibi',
  },
  {
    icon: '📱',
    title: 'Çoklu Cihaz Senkronizasyonu',
    description: 'Tüm cihazlarınızda erişim',
  },
  {
    icon: '📋',
    title: 'Özel Yemek Planları',
    description: 'Kişiselleştirilmiş beslenme planları',
  },
  {
    icon: '🎯',
    title: 'Hedef Takibi',
    description: 'İlerleme raporları ve istatistikler',
  },
  {
    icon: '🔓',
    title: 'Reklamsız Deneyim',
    description: 'Kesintisiz kullanım',
  },
];
