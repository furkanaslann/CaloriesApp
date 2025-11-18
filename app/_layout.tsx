import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { OnboardingProvider, useOnboarding } from '@/contexts/onboarding-context';
import { ThemeProvider as CustomThemeProvider } from '@/contexts/theme-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav({ initialRoute }: { initialRoute?: string }) {
  const colorScheme = useColorScheme();
  const { isCompleted, currentStep } = useOnboarding();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  // Handle navigation based on onboarding status
  useEffect(() => {
    if (isInitialized) {
      if (!isCompleted) {
        // If onboarding is not completed, redirect to onboarding
        router.replace('/onboarding/welcome');
      } else {
        // If onboarding is completed, redirect to main app
        router.replace('/(tabs)');
      }
    }
  }, [isCompleted, isInitialized, router]);

  // Wait for onboarding context to be initialized
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Show loading screen while checking onboarding status
  if (!isInitialized) {
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="loading"
            options={{ headerShown: false, presentation: 'modal' }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="onboarding"
          options={{ headerShown: false }}
          // Only show onboarding screen if not completed
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
      <OnboardingProvider>
        <RootLayoutNav />
      </OnboardingProvider>
    </CustomThemeProvider>
  );
}
