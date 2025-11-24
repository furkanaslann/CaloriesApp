import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { OnboardingProvider, useOnboarding } from '@/context/onboarding-context';
import { UserProvider, useUser } from '@/context/user-context';
import { ThemeProvider as CustomThemeProvider } from '@/context/theme-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav({ initialRoute }: { initialRoute?: string }) {
  const colorScheme = useColorScheme();
  const { isLoading, isOnboardingCompleted, createAnonymousUser, user } = useUser();
  const router = useRouter();

  // Initialize user and handle routing - but don't interfere with ongoing onboarding
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // If still loading, wait
        if (isLoading) {
          console.log('Still loading user...');
          return;
        }

        // Create anonymous user if needed
        if (!user) {
          console.log('Creating anonymous user...');
          await createAnonymousUser();
          return;
        }

        console.log('User initialized:', user.uid);
        console.log('Onboarding completed:', isOnboardingCompleted);

        // Route based on onboarding status
        if (isOnboardingCompleted) {
          console.log('Routing to main app (tabs)');
          router.replace('/(tabs)');
        } else {
          console.log('Routing to onboarding welcome screen');
          router.replace('/onboarding/welcome');
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        // Only fallback to welcome screen on first load
        router.replace('/onboarding/welcome');
      }
    };

    // Only run this once on mount, or when loading/user state changes significantly
    if (isLoading === false) {
      initializeApp();
    }
  }, [isLoading, user, isOnboardingCompleted]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
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
