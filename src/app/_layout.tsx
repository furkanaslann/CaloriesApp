import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';

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

  // Create anonymous user if not authenticated
  useEffect(() => {
    const initializeUser = async () => {
      try {
        if (!user && !isLoading) {
          await createAnonymousUser();
        }
      } catch (error) {
        console.error('Error initializing user:', error);
      }
    };

    initializeUser();
  }, [user, isLoading, createAnonymousUser]);

  // Handle navigation based on onboarding status
  useEffect(() => {
    if (!isLoading) {
      if (!isOnboardingCompleted) {
        // If onboarding is not completed, redirect to onboarding
        router.replace('/onboarding/welcome');
      } else {
        // If onboarding is completed, redirect to main app
        router.replace('/(tabs)');
      }
    }
  }, [isOnboardingCompleted, isLoading, router]);

  // Show loading screen while checking authentication status
  if (isLoading) {
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
      <UserProvider>
        <OnboardingProvider>
          <RootLayoutNav />
        </OnboardingProvider>
      </UserProvider>
    </CustomThemeProvider>
  );
}
