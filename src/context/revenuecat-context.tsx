/**
 * CaloriTrack - RevenueCat Context
 * Manages subscription state and in-app purchases
 */

import REVENUECAT_CONFIG, { areApiKeysConfigured } from '@/config/revenuecat';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, {
    CustomerInfo,
    ENTITLEMENT_VERIFICATION_MODE,
    LOG_LEVEL,
    PurchasesOffering,
    STOREKIT_VERSION
} from 'react-native-purchases';

// Entitlement identifiers from config
const ENTITLEMENTS = REVENUECAT_CONFIG.entitlements;

interface RevenueCatContextType {
  isInitialized: boolean;
  isPremium: boolean;
  customerInfo: CustomerInfo | null;
  currentOffering: PurchasesOffering | null;
  isLoading: boolean;
  checkSubscriptionStatus: () => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
}

const RevenueCatContext = createContext<RevenueCatContextType | undefined>(undefined);

export const RevenueCatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize RevenueCat SDK
  useEffect(() => {
    const initializeRevenueCat = async () => {
      try {
        console.log('🚀 RevenueCat: Initializing SDK...');
        
        // Enable debug logs in development
        if (__DEV__) {
          Purchases.setLogLevel(LOG_LEVEL.DEBUG);
        }

        // Get the appropriate API key based on platform
        const apiKey = REVENUECAT_CONFIG.getApiKey();

        if (!apiKey) {
          console.error('❌ RevenueCat: No API key found for platform:', Platform.OS);
          setIsLoading(false);
          return;
        }

        // Check if API keys are configured
        if (!areApiKeysConfigured()) {
          console.warn('⚠️ RevenueCat: Using placeholder API key. Please replace with actual keys from RevenueCat dashboard.');
          console.warn('⚠️ Configuration file: src/config/revenuecat.ts');
          console.warn('⚠️ Get your keys from: https://app.revenuecat.com/settings/api-keys');
        }

        // Configure the SDK
        await Purchases.configure({
          apiKey,
          appUserID: undefined, // Let RevenueCat generate an anonymous user ID
          // iOS specific configuration
          ...(Platform.OS === 'ios' && {
            storeKitVersion: STOREKIT_VERSION.STOREKIT_2,
          }),
          // Security configuration
          entitlementVerificationMode: ENTITLEMENT_VERIFICATION_MODE.DISABLED, // Enable in production
          // Auto-collection
          automaticDeviceIdentifierCollectionEnabled: true,
        });

        console.log('✅ RevenueCat: SDK configured successfully');
        setIsInitialized(true);

        // Load customer info and check subscription status
        await checkSubscriptionStatus();

        // Load current offering
        await loadOfferings();

      } catch (error) {
        console.error('❌ RevenueCat: Error initializing SDK:', error);
        setIsLoading(false);
      }
    };

    initializeRevenueCat();
  }, []);

  // Check if user has premium subscription
  const checkSubscriptionStatus = async (): Promise<boolean> => {
    try {
      console.log('🔍 RevenueCat: Checking subscription status...');
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);

      // Check if user has active premium entitlement
      const hasPremium = typeof info.entitlements.active[ENTITLEMENTS.premium] !== 'undefined';
      setIsPremium(hasPremium);
      setIsLoading(false);

      console.log('📊 RevenueCat: Subscription status -', hasPremium ? 'Premium ✅' : 'Free ❌');
      return hasPremium;
    } catch (error) {
      console.error('❌ RevenueCat: Error checking subscription:', error);
      setIsLoading(false);
      return false;
    }
  };

  // Load available offerings
  const loadOfferings = async () => {
    try {
      console.log('🛒 RevenueCat: Loading offerings...');
      const offerings = await Purchases.getOfferings();

      if (offerings.current && offerings.current.availablePackages.length > 0) {
        setCurrentOffering(offerings.current);
        console.log('✅ RevenueCat: Loaded offering:', offerings.current.identifier);
        console.log('📦 RevenueCat: Available packages:', offerings.current.availablePackages.length);
      } else {
        console.warn('⚠️ RevenueCat: No offerings available. Configure offerings in RevenueCat dashboard.');
      }
    } catch (error) {
      console.error('❌ RevenueCat: Error loading offerings:', error);
    }
  };

  // Restore previous purchases
  const restorePurchases = async (): Promise<boolean> => {
    try {
      console.log('🔄 RevenueCat: Restoring purchases...');
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);

      const hasPremium = typeof info.entitlements.active[ENTITLEMENTS.premium] !== 'undefined';
      setIsPremium(hasPremium);

      console.log('✅ RevenueCat: Restore complete -', hasPremium ? 'Premium found ✅' : 'No subscription ❌');
      return hasPremium;
    } catch (error) {
      console.error('❌ RevenueCat: Error restoring purchases:', error);
      return false;
    }
  };

  const contextValue: RevenueCatContextType = {
    isInitialized,
    isPremium,
    customerInfo,
    currentOffering,
    isLoading,
    checkSubscriptionStatus,
    restorePurchases,
  };

  return (
    <RevenueCatContext.Provider value={contextValue}>
      {children}
    </RevenueCatContext.Provider>
  );
};

// Hook to use RevenueCat context
export const useRevenueCat = (): RevenueCatContextType => {
  const context = useContext(RevenueCatContext);
  if (context === undefined) {
    throw new Error('useRevenueCat must be used within a RevenueCatProvider');
  }
  return context;
};

// Export entitlement identifiers for use in components
export { ENTITLEMENTS };

