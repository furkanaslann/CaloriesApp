import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, LogBox, StyleSheet, Text, View } from 'react-native';
import 'react-native-reanimated';

import { FIREBASE_CONFIG } from '@/constants/firebase';
import { OnboardingProvider } from '@/context/onboarding-context';
import { RevenueCatProvider } from '@/context/revenuecat-context';
import { ThemeProvider as CustomThemeProvider } from '@/context/theme-context';
import { UserProvider, useUser } from '@/context/user-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { initializeFirebaseEmulators } from '@/utils/firebase';
import firestore from '@react-native-firebase/firestore';

export const unstable_settings = {
  anchor: 'dashboard',
};

// Loading overlay component
const LoadingOverlay = ({ message }: { message: string }) => {
  return (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color="#7C3AED" />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    textAlign: 'center',
  },
});

// Ignore Firebase deprecated API warnings for MVP
// TODO: Migrate to Firebase v22 modular SDK in separate task after MVP

// Completely disable all console warnings for now
const originalWarn = console.warn;
console.warn = (...args) => {
  // Filter out Firebase deprecated warnings
  const message = args.join(' ');
  if (
    message.includes('This method is deprecated') &&
    message.includes('React Native Firebase namespaced API')
  ) {
    return; // Suppress Firebase deprecation warnings
  }
  originalWarn(...args);
};

// Filter all deprecated Firebase warnings
LogBox.ignoreLogs([
  /This method is deprecated.*React Native Firebase namespaced API/,
  /Method called was/,
  /Please use.*instead/,
  /rnfirebase\.io\/migrating-to-v22/,
  /deprecated/,
  'deprecated',
]);

function RootLayoutNav({ initialRoute }: { initialRoute?: string }) {
  const colorScheme = useColorScheme();
  const { isLoading, user, createAnonymousUser, userData } = useUser();
  const router = useRouter();
  const [hasInitialized, setHasInitialized] = useState(false);
  const [hasShownPaywall, setHasShownPaywall] = useState(false);

  // Initialize user and check onboarding status - determine initial routing
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // If still loading, wait
        if (isLoading) {
          console.log('⏳ App: Still loading user data...');
          return;
        }

        // Create anonymous user if no user exists
        if (!user) {
          console.log('👤 App: No user found, creating anonymous user...');
          await createAnonymousUser();
          return;
        }

        console.log('🚀 App: User authenticated - checking onboarding status:', user.uid);
        console.log('📊 App: userData state:', { 
          exists: !!userData, 
          onboardingCompleted: userData?.onboardingCompleted,
          hasInitialized 
        });

        // Check if user has completed onboarding
        let shouldShowDashboard = false;

        // Primary check: User context data (this should be reliable once loaded)
        if (userData?.onboardingCompleted === true) {
          console.log('✅ App: User context confirms onboarding completed');
          shouldShowDashboard = true;
        }
        // If userData doesn't show onboarding completed, do a direct Firestore check as fallback
        // This helps with emulator timing issues
        else if (!shouldShowDashboard && !hasInitialized) {
          try {
            console.log('🔎 App: Doing direct Firestore check for onboarding status...');
            const doc = await firestore()
              .collection(FIREBASE_CONFIG.collections.users)
              .doc(user.uid)
              .get();

            if (doc.exists()) {
              const data = doc.data();
              console.log('📄 App: Firestore data:', { 
                onboardingCompleted: data?.onboardingCompleted,
                hasProfile: !!data?.profile,
                hasGoals: !!data?.goals 
              });
              
              if (data?.onboardingCompleted === true) {
                console.log('✅ App: Firestore confirms onboarding completed');
                shouldShowDashboard = true;
              } else {
                console.log('❌ App: Onboarding not completed in Firestore');
              }
            } else {
              console.log('⚠️ App: No user document found in Firestore yet - routing to paywall');
            }
          } catch (error) {
            console.warn('⚠️ App: Error checking Firestore:', error);
          }
        }

        // Route based on onboarding status - only if not already initialized
        if (!hasInitialized) {
          if (shouldShowDashboard) {
            console.log('🎯 App: ROUTING TO DASHBOARD - user has completed onboarding');
            router.replace('/dashboard');
          } else {
            // Show paywall before onboarding for new users
            console.log('🎯 App: ROUTING TO PAYWALL - new user flow');
            router.replace('/paywall');
            setHasShownPaywall(true);
          }
          setHasInitialized(true);
        }

      } catch (error) {
        console.error('❌ App: Error during initialization:', error);
        // Safe fallback to paywall
        if (!hasInitialized) {
          router.replace('/paywall');
          setHasInitialized(true);
        }
      }
    };

    // Run when loading is complete and we haven't initialized yet
    // This will create anonymous user if needed or route based on existing user
    if (isLoading === false && !hasInitialized) {
      initializeApp();
    }
  }, [isLoading, user, userData, hasInitialized]); // Added hasInitialized to dependencies

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="paywall" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen
          name="onboarding"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen
          name="loading"
          options={{ headerShown: false, presentation: 'modal' }}
        />
        <Stack.Screen name="recipes" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />

    </ThemeProvider>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [firebaseReady, setFirebaseReady] = useState(false);

  // Initialize Firebase Emulators before rendering providers
  useEffect(() => {
    const initializeFirebase = async () => {
      await initializeFirebaseEmulators();
      setFirebaseReady(true);
    };
    
    initializeFirebase();
  }, []);

  // Wait for Firebase to be ready before rendering providers
  if (!firebaseReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#64748B' }}>
          Firebase Başlatılıyor...
        </Text>
      </View>
    );
  }

  return (
    <CustomThemeProvider defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}>
      <UserProvider>
        <RevenueCatProvider>
          <OnboardingProvider>
            <RootLayoutNav />
          </OnboardingProvider>
        </RevenueCatProvider>
      </UserProvider>
    </CustomThemeProvider>
  );
}
