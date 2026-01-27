/**
 * RevenueCat Context Provider
 *
 * Manages RevenueCat SDK initialization and subscription state
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Platform } from 'react-native';
import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  PurchasesOffering,
} from 'react-native-purchases';
import auth from '@react-native-firebase/auth';
import { REVENUECAT_CONFIG } from '@/config/revenuecat';

// Types
interface RevenueCatContextType {
  isPremium: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  customerInfo: CustomerInfo | null;
  currentOffering: PurchasesOffering | null;
  checkSubscriptionStatus: () => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
}

// Create context
const RevenueCatContext = createContext<RevenueCatContextType | undefined>(undefined);

// Props
interface RevenueCatProviderProps {
  children: ReactNode;
}

// Provider Component
export const RevenueCatProvider: React.FC<RevenueCatProviderProps> = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);

  // Initialize RevenueCat SDK
  useEffect(() => {
    let isMounted = true;

    const initializeRevenueCat = async () => {
      try {
        console.log('💰 RevenueCat: Waiting for Firebase auth state...');

        // Wait for Firebase auth state
        const unsubscribeAuth = auth().onAuthStateChanged(async (firebaseUser) => {
          if (!isMounted) return;

          try {
            console.log('💰 RevenueCat: Firebase auth state changed:', firebaseUser?.uid || 'no user');

            if (!firebaseUser) {
              console.log('⏳ RevenueCat: No Firebase user yet, waiting...');
              setIsLoading(false);
              return;
            }

            console.log('💰 RevenueCat: Initializing with Firebase user ID:', firebaseUser.uid);

            // Get API key based on platform
            const apiKey = Platform.OS === 'ios'
              ? REVENUECAT_CONFIG.apiKeys.ios
              : REVENUECAT_CONFIG.apiKeys.android;

            // Check if using placeholder keys
            if (apiKey.includes('YOUR_')) {
              console.warn('⚠️ RevenueCat: Using placeholder API keys. Please add actual keys to src/config/revenuecat.ts');
            }

            // Configure Purchases with Firebase user ID
            Purchases.setLogLevel(LOG_LEVEL.DEBUG);
            await Purchases.configure({
              apiKey,
              appUserID: firebaseUser.uid, // ✅ Use Firebase ID to prevent ID mismatch
            });

            console.log('✅ RevenueCat: SDK initialized successfully with Firebase ID:', firebaseUser.uid);

            // Get customer info (this works even without billing)
            const info = await Purchases.getCustomerInfo();
            setCustomerInfo(info);
            updatePremiumStatus(info);

            // Try to get offerings - may fail in emulator without billing
            try {
              const offerings = await Purchases.getOfferings();
              if (offerings.current) {
                console.log('✅ RevenueCat: Current offering loaded', offerings.current.identifier);
                setCurrentOffering(offerings.current);
              } else {
                console.warn('⚠️ RevenueCat: No current offering available');
              }
            } catch (offeringsError) {
              // Billing unavailable is expected in emulator
              console.warn('⚠️ RevenueCat: Could not fetch offerings (expected in emulator)', offeringsError);
            }

            setIsInitialized(true);
            setIsLoading(false);

          } catch (error) {
            console.error('❌ RevenueCat: Initialization failed', error);
            // Still mark as initialized to prevent blocking the app
            setIsInitialized(true);
            setIsLoading(false);
          }
        });

        // Store auth unsubscribe for cleanup
        return () => {
          if (unsubscribeAuth) {
            unsubscribeAuth();
          }
        };

      } catch (error) {
        console.error('❌ RevenueCat: Auth listener setup failed', error);
        setIsLoading(false);
      }
    };

    initializeRevenueCat();

    // Listen for customer info updates
    const customerInfoListener = Purchases.addCustomerInfoUpdateListener((info) => {
      console.log('🔄 RevenueCat: Customer info updated');
      setCustomerInfo(info);
      updatePremiumStatus(info);
    });

    return () => {
      isMounted = false;
      // Only call remove if listener exists
      if (customerInfoListener) {
        customerInfoListener.remove();
      }
    };
  }, []);

  // Update premium status based on customer info
  const updatePremiumStatus = (info: CustomerInfo) => {
    const hasPremium = info.entitlements.active[REVENUECAT_CONFIG.entitlements.premium] !== undefined;
    console.log(`💎 RevenueCat: Premium status: ${hasPremium ? 'ACTIVE' : 'INACTIVE'}`);
    setIsPremium(hasPremium);
  };

  // Check subscription status
  const checkSubscriptionStatus = async (): Promise<boolean> => {
    try {
      console.log('🔍 RevenueCat: Checking subscription status...');
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
      updatePremiumStatus(info);
      return isPremium;
    } catch (error) {
      console.error('❌ RevenueCat: Failed to check subscription status', error);
      return false;
    }
  };

  // Restore purchases
  const restorePurchases = async (): Promise<boolean> => {
    try {
      console.log('🔄 RevenueCat: Restoring purchases...');
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);
      updatePremiumStatus(info);

      const hasPremium = info.entitlements.active[REVENUECAT_CONFIG.entitlements.premium] !== undefined;

      if (hasPremium) {
        console.log('✅ RevenueCat: Purchases restored successfully');
      } else {
        console.log('ℹ️ RevenueCat: No active purchases found');
      }

      return hasPremium;
    } catch (error) {
      console.error('❌ RevenueCat: Failed to restore purchases', error);
      return false;
    }
  };

  const value: RevenueCatContextType = {
    isPremium,
    isLoading,
    isInitialized,
    customerInfo,
    currentOffering,
    checkSubscriptionStatus,
    restorePurchases,
  };

  return (
    <RevenueCatContext.Provider value={value}>
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
