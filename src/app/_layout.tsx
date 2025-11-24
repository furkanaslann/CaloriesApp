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

  // Initialize user and handle routing
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // If still loading, wait
        if (isLoading) {
          return;
        }

        // Create anonymous user if needed
        if (!user) {
          await createAnonymousUser();
          return;
        }

        // Handle routing based on onboarding status
        if (isOnboardingCompleted) {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding/welcome');
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        // Fallback to onboarding screen on error
        router.replace('/onboarding/welcome');
      }
    };

    initializeApp();
  }, [isLoading, user, isOnboardingCompleted, createAnonymousUser, router]);

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
