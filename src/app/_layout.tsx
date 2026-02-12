import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    LogBox,
    StyleSheet,
    Text,
    View
} from "react-native";
import "react-native-reanimated";

import { FIREBASE_CONFIG } from "@/constants/firebase";
import { OnboardingProvider } from "@/context/onboarding-context";
import { RevenueCatProvider } from "@/context/revenuecat-context";
import { ThemeProvider as CustomThemeProvider } from "@/context/theme-context";
import { UserProvider, useUser } from "@/context/user-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
    initializeFirebaseEmulators,
    retryWithBackoff,
} from "@/utils/firebase";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export const unstable_settings = {
  anchor: "dashboard",
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
    color: "#1E293B",
    textAlign: "center",
  },
});

// Ignore Firebase deprecated API warnings for MVP
// TODO: Migrate to Firebase v22 modular SDK in separate task after MVP

// Completely disable all console warnings for now
const originalWarn = console.warn;
console.warn = (...args) => {
  // Filter out Firebase deprecated warnings
  const message = args.join(" ");
  if (
    message.includes("This method is deprecated") &&
    message.includes("React Native Firebase namespaced API")
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
  "deprecated",
]);

/**
 * Auto-login with test user in development mode (emulator only)
 * This allows seamless testing with pre-seeded data
 */
const autoLoginInDev = async (): Promise<boolean> => {
  if (!__DEV__) return false;

  const currentUser = auth().currentUser;
  
  // Already logged in with a permanent account, skip
  if (currentUser && !currentUser.isAnonymous) {
    console.log("🔧 DEV: Already logged in with permanent account, skipping auto-login");
    return false;
  }

  // Sign out anonymous user first
  if (currentUser && currentUser.isAnonymous) {
    console.log("🔧 DEV: Signing out anonymous user for auto-login...");
    try {
      await auth().signOut();
    } catch (error) {
      console.warn("⚠️ DEV: Error signing out anonymous user:", error);
    }
  }

  try {
    console.log("🔧 DEV: Auto-login with test user...");
    await auth().signInWithEmailAndPassword(
      "test@example.com",
      "DevTest123!"
    );
    console.log("✅ DEV: Auto-login successful");
    return true;
  } catch (error: any) {
    console.warn("⚠️ DEV: Auto-login failed:", error.message);
    console.warn("   Make sure you've run: npm run seed:emulator");
    return false;
  }
};

function RootLayoutNav({ initialRoute }: { initialRoute?: string }) {
  const colorScheme = useColorScheme();
  const { isLoading, user, createAnonymousUser, userData } = useUser();
  const router = useRouter();
  const [hasInitialized, setHasInitialized] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<string | null>(null);

  // Initialize user and check onboarding status - determine initial routing
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // If still loading, wait
        if (isLoading) {
          console.log("⏳ App: Still loading user data...");
          return;
        }

        // DEV MODE: Auto-login with test user if no user or anonymous user
        if (__DEV__ && (!user || user.isAnonymous)) {
          console.log("🔧 DEV: Attempting auto-login with test user...");
          const didLogin = await autoLoginInDev();
          if (didLogin) {
            console.log("✅ DEV: Auto-login completed, waiting for user context to update...");
            // UserProvider will pick up the new user via onAuthStateChanged
            // Don't continue routing - let the next useEffect handle it
            return;
          } else if (!user) {
            console.log("⚠️ DEV: Auto-login failed, creating anonymous user as fallback...");
            // Continue with anonymous user creation below
          }
        }

        // No user at all → auto-create anonymous user and go to onboarding
        if (!user) {
          console.log("👤 App: No user found - auto-creating anonymous user...");
          try {
            await createAnonymousUser();
            console.log("✅ App: Anonymous user created, routing to onboarding");
            router.replace("/onboarding/welcome");
            setCurrentRoute("/onboarding/welcome");
            setHasInitialized(true);
            return;
          } catch (error) {
            console.error("❌ App: Failed to create anonymous user:", error);
            // Fallback to sign-in if auto-creation fails
            router.replace("/auth/sign-in");
            setHasInitialized(true);
            return;
          }
        }

        console.log(
          "🚀 App: User authenticated - checking onboarding status:",
          user.uid,
        );
        console.log("📊 App: userData state:", {
          exists: !!userData,
          isAnonymous: user.isAnonymous,
          onboardingCompleted: userData?.onboardingCompleted,
          hasInitialized,
        });

        // Anonymous user → route to onboarding (they are in the middle of onboarding flow)
        if (user.isAnonymous) {
          if (!hasInitialized) {
            console.log("🎯 App: Anonymous user - routing to onboarding");
            router.replace("/onboarding/welcome");
            setCurrentRoute("/onboarding/welcome");
            setHasInitialized(true);
          }
          return;
        }

        // Non-anonymous user → check onboarding status
        let shouldShowDashboard = false;

        // Primary check: User context data (this should be reliable once loaded)
        if (userData?.onboardingCompleted === true) {
          console.log("✅ App: User context confirms onboarding completed");
          shouldShowDashboard = true;
        }
        // If userData doesn't show onboarding completed, do a direct Firestore check as fallback
        // This helps with emulator timing issues
        else if (!shouldShowDashboard && !hasInitialized) {
          try {
            console.log(
              "🔎 App: Doing direct Firestore check for onboarding status...",
            );
            const doc = await retryWithBackoff(
              async () => {
                return await firestore()
                  .collection(FIREBASE_CONFIG.collections.users)
                  .doc(user.uid)
                  .get();
              },
              5,
              2000,
            ); // 5 retries with exponential backoff starting at 2s

            if (doc.exists()) {
              const data = doc.data();
              console.log("📄 App: Firestore data:", {
                onboardingCompleted: data?.onboardingCompleted,
                hasProfile: !!data?.profile,
                hasGoals: !!data?.goals,
              });

              if (data?.onboardingCompleted === true) {
                console.log("✅ App: Firestore confirms onboarding completed");
                shouldShowDashboard = true;
              } else {
                console.log("❌ App: Onboarding not completed in Firestore");
              }
            } else {
              console.log("⚠️ App: No user document found in Firestore yet");
            }
          } catch (error) {
            console.warn(
              "⚠️ App: Error checking Firestore after retries:",
              error,
            );
          }
        }

        // Route based on onboarding status
        const isOnOnboarding = currentRoute?.startsWith("/onboarding");
        const isOnAuth = currentRoute?.startsWith("/auth");
        const isOnPaywall = currentRoute === "/paywall";
        const isOnDashboard =
          currentRoute === "/dashboard" || currentRoute === "/(tabs)";

        // Route if: not initialized OR user just completed onboarding and still on onboarding/auth screens
        const shouldRoute =
          !hasInitialized ||
          (shouldShowDashboard && (isOnOnboarding || isOnAuth));

        if (shouldRoute) {
          if (shouldShowDashboard) {
            console.log("🎯 App: ROUTING TO PAYWALL - onboarding completed");
            router.replace("/paywall");
            setCurrentRoute("/paywall");
          } else {
            // Non-anonymous user without completed onboarding
            // This could be a user who signed in via Google/Apple but hasn't done onboarding
            console.log(
              "🎯 App: ROUTING TO ONBOARDING - user needs to complete onboarding",
            );
            router.replace("/onboarding/welcome");
            setCurrentRoute("/onboarding/welcome");
          }
          setHasInitialized(true);
        }
      } catch (error) {
        console.error("❌ App: Error during initialization:", error);
        // Safe fallback to sign-in
        if (!hasInitialized) {
          router.replace("/auth/sign-in");
          setHasInitialized(true);
        }
      }
    };

    // Run when loading is complete and we haven't initialized yet
    if (isLoading === false && !hasInitialized) {
      initializeApp();
    }
  }, [isLoading, user, userData, hasInitialized, currentRoute]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="paywall" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
        <Stack.Screen
          name="loading"
          options={{ headerShown: false, presentation: "modal" }}
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

  // Suppress Firebase emulator "already initialized" errors in development
  useEffect(() => {
    if (__DEV__) {
      const defaultHandler = ErrorUtils.getGlobalHandler?.();
      ErrorUtils.setGlobalHandler((error: any, isFatal?: boolean) => {
        const errorStr = String(error?.message || error).toLowerCase();
        // Suppress Firebase emulator re-initialization errors
        if (
          errorStr.includes("firestore") &&
          (errorStr.includes("already") ||
            errorStr.includes("initialized") ||
            errorStr.includes("unknown"))
        ) {
          console.log(
            "🔧 Suppressed Firebase emulator error (already initialized)",
          );
          return;
        }
        // Use default handler for other errors
        defaultHandler?.(error, isFatal);
      });
    }
  }, []);

  // Initialize Firebase Emulators before rendering providers
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        await initializeFirebaseEmulators();
      } catch (error) {
        console.warn("Firebase emulator initialization note:", error);
        // Continue even if emulator setup fails - app will use production config
      }
      setFirebaseReady(true);
    };

    initializeFirebase();
  }, []);

  // Wait for Firebase to be ready before rendering providers
  if (!firebaseReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
        }}
      >
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={{ marginTop: 16, fontSize: 16, color: "#64748B" }}>
          Firebase Başlatılıyor...
        </Text>
      </View>
    );
  }

  return (
    <CustomThemeProvider
      defaultTheme={colorScheme === "dark" ? "dark" : "light"}
    >
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
