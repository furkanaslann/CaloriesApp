import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { OnboardingProvider } from '@/context/onboarding-context';
import { ThemeProvider as CustomThemeProvider } from '@/context/theme-context';
import { UserProvider, useUser } from '@/context/user-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: 'dashboard',
};

function RootLayoutNav({ initialRoute }: { initialRoute?: string }) {
  const colorScheme = useColorScheme();
  const { isLoading, isOnboardingCompleted, createAnonymousUser, user } = useUser();
  const router = useRouter();

  // Initialize user and always start with dashboard route
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

        // Always start with dashboard route - dashboard will handle onboarding check internally
        console.log('Routing to dashboard (will handle onboarding check internally)');
        router.replace('/dashboard');
      } catch (error) {
        console.error('Error initializing app:', error);
        // Fallback to welcome screen on error
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
