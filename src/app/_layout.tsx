import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, LogBox, StyleSheet, Text, View } from 'react-native';
import 'react-native-reanimated';

import { OnboardingProvider } from '@/context/onboarding-context';
import { ThemeProvider as CustomThemeProvider } from '@/context/theme-context';
import { UserProvider, useUser } from '@/context/user-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { initializeFirebaseEmulators } from '@/utils/firebase';

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
  const [isRouting, setIsRouting] = useState(false);

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

        // Check if user has completed onboarding - with multiple checks for reliability
        let shouldShowDashboard = false;

        // Primary check: User context data
        if (userData?.onboardingCompleted === true) {
          console.log('✅ App: User context confirms onboarding completed');
          shouldShowDashboard = true;
        }
        // Secondary check: Direct Firestore verification
        else {
          try {
            console.log('🔎 App: Checking Firestore directly for onboarding status...');
            const doc = await firestore()
              .collection(FIREBASE_CONFIG.collections.users)
              .doc(user.uid)
              .get();

            if (doc.exists && doc.data()?.onboardingCompleted === true) {
              console.log('✅ App: Firestore confirms onboarding completed');
              shouldShowDashboard = true;
            } else {
              console.log('❌ App: No onboarding record found in Firestore');
            }
          } catch (error) {
            console.warn('⚠️ App: Error checking Firestore:', error);
          }
        }

        // Route based on onboarding status
        if (shouldShowDashboard) {
          console.log('🎯 App: ROUTING TO DASHBOARD - user has completed onboarding');
          router.replace('/dashboard');
        } else {
          console.log('🎯 App: ROUTING TO ONBOARDING - user needs to complete onboarding');
          router.replace('/onboarding/welcome');
        }

      } catch (error) {
        console.error('❌ App: Error during initialization:', error);
        // Safe fallback to onboarding
        router.replace('/onboarding/welcome');
      }
    };

    // Only run once when loading is complete and user is available
    if (isLoading === false && user !== null) {
      initializeApp();
    }
  }, [isLoading, user]); // Removed userData dependency to prevent multiple runs

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
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
      </Stack>
      <StatusBar style="auto" />

    </ThemeProvider>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Initialize Firebase Emulators immediately on app start (before UserProvider)
  initializeFirebaseEmulators();

  return (
    <CustomThemeProvider defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}>
      <UserProvider>
        <OnboardingProvider>
          <RootLayoutNav />
        </OnboardingProvider>
      </UserProvider>
    </CustomThemeProvider>
  );
}
