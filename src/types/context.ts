import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { OnboardingContextType } from "./onboarding";
import { ThemeContextType } from "./ui";
import { UserDocument } from "./user";

// User Context Type
export interface UserContextType {
  // Auth state
  user: FirebaseAuthTypes.User | null;
  userData: UserDocument | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOnboardingCompleted: boolean;

  // Actions
  createAnonymousUser: () => Promise<FirebaseAuthTypes.User>;
  updateUserProfile: (data: any) => Promise<void>;
  updateGoals: (data: any) => Promise<void>;
  updateActivity: (data: any) => Promise<void>;
  updateDiet: (data: any) => Promise<void>;
  updatePreferences: (data: any) => Promise<void>;
  updateCommitment: (data: any) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  signInAnonymously: () => Promise<FirebaseAuthTypes.User>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;

  // OTP & Social Auth
  signInWithGoogleFn: () => Promise<FirebaseAuthTypes.User>;
  signInWithAppleFn: () => Promise<FirebaseAuthTypes.User>;
  signInWithCustomTokenFn: (token: string) => Promise<FirebaseAuthTypes.User>;
}

// Re-export other context types for convenience
export { OnboardingContextType, ThemeContextType };

