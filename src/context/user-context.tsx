/**
 * CaloriTrack - User Context
 * Minimal. Cool. Aesthetic.
 */

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { FIREBASE_CONFIG } from '@/constants';

// Import existing onboarding types
import {
  Activity,
  CalculatedValues,
  Commitment,
  Diet,
  Goals,
  Preferences,
  UserProfile
} from './onboarding-context';

// User data structure for Firestore
export interface UserDocument {
  uid: string;
  email?: string;
  displayName?: string;
  isAnonymous: boolean;
  onboardingCompleted: boolean;
  profile: Partial<UserProfile>;
  goals: Partial<Goals>;
  activity: Partial<Activity>;
  diet: Partial<Diet>;
  preferences: Partial<Preferences>;
  commitment: Partial<Commitment>;
  calculatedValues: CalculatedValues;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  updatedAt: FirebaseFirestoreTypes.Timestamp;
}

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
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateGoals: (data: Partial<Goals>) => Promise<void>;
  updateActivity: (data: Partial<Activity>) => Promise<void>;
  updateDiet: (data: Partial<Diet>) => Promise<void>;
  updatePreferences: (data: Partial<Preferences>) => Promise<void>;
  updateCommitment: (data: Partial<Commitment>) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  signInAnonymously: () => Promise<FirebaseAuthTypes.User>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// User Provider Component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [userData, setUserData] = useState<UserDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Default calculated values
  const defaultCalculatedValues: CalculatedValues = {
    bmr: 0,
    tdee: 0,
    dailyCalorieGoal: 2000,
    macros: {
      protein: 150,
      carbs: 250,
      fats: 65,
    },
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Load user data from Firestore
        await loadUserData(firebaseUser.uid);
      } else {
        setUserData(null);
      }

      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Load user data from Firestore
  const loadUserData = async (userId: string) => {
    try {
      const userDoc = await firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(userId)
        .get();

      if (userDoc.exists()) {
        const data = userDoc.data() as UserDocument;
        setUserData(data);
      } else {
        // Create initial user document if it doesn't exist
        await createInitialUserDocument(userId);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Create initial user document
  const createInitialUserDocument = async (userId: string) => {
    try {
      // Check if document already exists first
      const existingDoc = await firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(userId)
        .get();

      if (existingDoc.exists()) {
        const data = existingDoc.data() as UserDocument;
        setUserData(data);
        return data;
      }

      // Create new document if it doesn't exist
      const currentUser = auth().currentUser;
      const initialData: any = {
        uid: userId,
        isAnonymous: currentUser?.isAnonymous || true,
        onboardingCompleted: false,
        profile: {},
        goals: {},
        activity: {},
        diet: {},
        preferences: {},
        commitment: {},
        calculatedValues: defaultCalculatedValues,
        createdAt: firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
        updatedAt: firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
      };

      // Only add email and displayName if they exist
      if (currentUser?.email) {
        initialData.email = currentUser.email;
      }
      if (currentUser?.displayName) {
        initialData.displayName = currentUser.displayName;
      }

      await firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(userId)
        .set(initialData);

      setUserData(initialData as UserDocument);
      return initialData;
    } catch (error) {
      console.error('Error creating initial user document:', error);
      throw error;
    }
  };

  // Create anonymous user
  const createAnonymousUser = async (): Promise<FirebaseAuthTypes.User> => {
    try {
      setIsLoading(true);

      // Check if user is already signed in anonymously
      const currentUser = auth().currentUser;
      if (currentUser && currentUser.isAnonymous) {
        return currentUser;
      }

      // Sign in anonymously
      const userCredential = await auth().signInAnonymously();
      return userCredential.user;
    } catch (error) {
      console.error('Error creating anonymous user:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in anonymously (alias for createAnonymousUser)
  const signInAnonymously = async (): Promise<FirebaseAuthTypes.User> => {
    return createAnonymousUser();
  };

  // Update user profile in Firestore
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('No user authenticated');

    try {
      const userDocRef = firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(user.uid);

      // Use set with merge to create or update the document
      const updateData: any = {
        uid: user.uid,
        isAnonymous: user.isAnonymous || true,
        profile: { ...userData?.profile, ...data },
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      // Only add email and displayName if they exist
      if (user.email) updateData.email = user.email;
      if (user.displayName) updateData.displayName = user.displayName;

      await userDocRef.set(updateData, { merge: true });

      // Refresh user data
      await refreshUserData();
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  // Update goals in Firestore
  const updateGoals = async (data: Partial<Goals>) => {
    if (!user) throw new Error('No user authenticated');

    try {
      const userDocRef = firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(user.uid);

      // Use set with merge to create or update the document
      const updateData: any = {
        uid: user.uid,
        isAnonymous: user.isAnonymous || true,
        goals: { ...userData?.goals, ...data },
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      // Only add email and displayName if they exist
      if (user.email) updateData.email = user.email;
      if (user.displayName) updateData.displayName = user.displayName;

      await userDocRef.set(updateData, { merge: true });

      await refreshUserData();
    } catch (error) {
      console.error('Error updating goals:', error);
      throw error;
    }
  };

  // Update activity in Firestore
  const updateActivity = async (data: Partial<Activity>) => {
    if (!user) throw new Error('No user authenticated');

    try {
      const userDocRef = firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(user.uid);

      // Use set with merge to create or update the document
      const updateData: any = {
        uid: user.uid,
        isAnonymous: user.isAnonymous || true,
        activity: { ...userData?.activity, ...data },
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      // Only add email and displayName if they exist
      if (user.email) updateData.email = user.email;
      if (user.displayName) updateData.displayName = user.displayName;

      await userDocRef.set(updateData, { merge: true });

      await refreshUserData();
    } catch (error) {
      console.error('Error updating activity:', error);
      throw error;
    }
  };

  // Update diet in Firestore
  const updateDiet = async (data: Partial<Diet>) => {
    if (!user) throw new Error('No user authenticated');

    try {
      const userDocRef = firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(user.uid);

      // Use set with merge to create or update the document
      const updateData: any = {
        uid: user.uid,
        isAnonymous: user.isAnonymous || true,
        diet: { ...userData?.diet, ...data },
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      // Only add email and displayName if they exist
      if (user.email) updateData.email = user.email;
      if (user.displayName) updateData.displayName = user.displayName;

      await userDocRef.set(updateData, { merge: true });

      await refreshUserData();
    } catch (error) {
      console.error('Error updating diet:', error);
      throw error;
    }
  };

  // Update preferences in Firestore
  const updatePreferences = async (data: Partial<Preferences>) => {
    if (!user) throw new Error('No user authenticated');

    try {
      const userDocRef = firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(user.uid);

      // Use set with merge to create or update the document
      const updateData: any = {
        uid: user.uid,
        isAnonymous: user.isAnonymous || true,
        preferences: { ...userData?.preferences, ...data },
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      // Only add email and displayName if they exist
      if (user.email) updateData.email = user.email;
      if (user.displayName) updateData.displayName = user.displayName;

      await userDocRef.set(updateData, { merge: true });

      await refreshUserData();
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  };

  // Update commitment in Firestore
  const updateCommitment = async (data: Partial<Commitment>) => {
    if (!user) throw new Error('No user authenticated');

    try {
      const userDocRef = firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(user.uid);

      // Use set with merge to create or update the document
      const updateData: any = {
        uid: user.uid,
        isAnonymous: user.isAnonymous || true,
        commitment: { ...userData?.commitment, ...data },
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      // Only add email and displayName if they exist
      if (user.email) updateData.email = user.email;
      if (user.displayName) updateData.displayName = user.displayName;

      await userDocRef.set(updateData, { merge: true });

      await refreshUserData();
    } catch (error) {
      console.error('Error updating commitment:', error);
      throw error;
    }
  };

  // Calculate BMR, TDEE, and macros based on user data
  const calculateAndUpdateValues = async () => {
    if (!userData || !user) return;

    const { profile, activity, goals } = userData;

    // Calculate BMR using Harris-Benedict equation
    let bmr = 0;
    if (profile.age && profile.currentWeight && profile.height && profile.gender) {
      const weight = profile.currentWeight || 0;
      const height = profile.height;

      if (profile.gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * profile.age);
      } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * profile.age);
      }
    }

    // Calculate TDEE based on activity level
    let tdee = bmr;
    if (activity.level) {
      const multipliers = {
        sedentary: 1.2,
        lightly_active: 1.375,
        moderately_active: 1.55,
        very_active: 1.725,
        extremely_active: 1.9,
      };
      tdee = bmr * multipliers[activity.level];
    }

    // Adjust calories based on goals
    let dailyCalorieGoal = tdee;
    if (goals.primaryGoal === 'weight_loss') {
      dailyCalorieGoal = Math.max(1200, tdee - 500); // 500 calorie deficit
    } else if (goals.primaryGoal === 'muscle_gain') {
      dailyCalorieGoal = tdee + 300; // 300 calorie surplus
    }

    // Calculate macros (40% carbs, 30% protein, 30% fats)
    const protein = (dailyCalorieGoal * 0.3) / 4; // 4 calories per gram
    const carbs = (dailyCalorieGoal * 0.4) / 4;
    const fats = (dailyCalorieGoal * 0.3) / 9; // 9 calories per gram

    const calculatedValues: CalculatedValues = {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      dailyCalorieGoal: Math.round(dailyCalorieGoal),
      macros: {
        protein: Math.round(protein),
        carbs: Math.round(carbs),
        fats: Math.round(fats),
      },
    };

    // Update calculated values in Firestore
    try {
      await firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(user.uid)
        .update({
          calculatedValues,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      console.error('Error updating calculated values:', error);
    }
  };

  // Update calculated values when profile, activity, or goals change
  useEffect(() => {
    if (userData) {
      calculateAndUpdateValues();
    }
  }, [userData?.profile, userData?.activity, userData?.goals]);

  // Complete onboarding
  const completeOnboarding = async () => {
    if (!user) throw new Error('No user authenticated');

    try {
      // Calculate final values before completing onboarding
      await calculateAndUpdateValues();

      // Update onboarding status
      await firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(user.uid)
        .update({
          onboardingCompleted: true,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      await refreshUserData();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Refresh user data from Firestore
  const refreshUserData = async () => {
    if (user) {
      await loadUserData(user.uid);
    }
  };

  // Computed values
  const isAuthenticated = !!user;
  const isOnboardingCompleted = userData?.onboardingCompleted || false;

  const contextValue: UserContextType = {
    user,
    userData,
    isLoading,
    isAuthenticated,
    isOnboardingCompleted,
    createAnonymousUser,
    updateUserProfile,
    updateGoals,
    updateActivity,
    updateDiet,
    updatePreferences,
    updateCommitment,
    completeOnboarding,
    signInAnonymously,
    signOut,
    refreshUserData,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// Hook to use user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Export for convenience
export { UserContext };
