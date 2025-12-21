/**
 * CaloriTrack - User Context
 * Minimal. Cool. Aesthetic.
 */

import { FIREBASE_CONFIG } from '@/constants/firebase';
import {
  Activity,
  CalculatedValues,
  Commitment,
  Diet,
  Goals,
  Preferences,
  UserContextType,
  UserDocument,
  UserProfile,
  UserProgress,
} from '@/types';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

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

  const defaultProgress: UserProgress = {
    currentWeight: 0,
    startingWeight: 0,
    goalWeight: 0,
    weightLossTotal: 0,
    weightLossToGoal: 0,
    weeklyWeightChange: 0,
    averageWeeklyLoss: 0,
    timeOnApp: 0,
    lastWeightUpdate: '',
  };

  // Listen to auth state changes
  useEffect(() => {
    // Small delay to ensure Firebase emulators are initialized
    const initializeAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 100)); // Reduced from 500ms to 100ms

      // Check if Firebase is initialized before using auth
      try {
        const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
          console.log('Auth state changed. User:', firebaseUser?.uid);
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
      } catch (error) {
        console.error('Firebase initialization error:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Load user data from Firestore
  const loadUserData = async (userId: string) => {
    try {
      console.log('loadUserData: Loading data for user:', userId);

      // Add retry mechanism for emulator consistency
      let retryCount = 0;
      const maxRetries = 3;
      let userDoc;

      do {
        userDoc = await firestore()
          .collection(FIREBASE_CONFIG.collections.users)
          .doc(userId)
          .get();

        if ((userDoc as any).exists) {
          break;
        }

        if (retryCount < maxRetries - 1) {
          console.log(`loadUserData: Retry ${retryCount + 1}/${maxRetries} - waiting 500ms`);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        retryCount++;
      } while (retryCount < maxRetries);

      if ((userDoc as any).exists) {
        const rawData = userDoc.data();
        console.log('loadUserData: Raw data from Firestore:', rawData);

        // Safely handle the data with proper defaults
        const safeData: UserDocument = {
          uid: userId,
          email: rawData?.email,
          displayName: rawData?.displayName,
          isAnonymous: rawData?.isAnonymous !== false, // Default to true if not specified
          onboardingCompleted: rawData?.onboardingCompleted === true,
          onboardingCompletedAt: rawData?.onboardingCompletedAt,
          profile: rawData?.profile || {},
          goals: rawData?.goals || {},
          activity: rawData?.activity || {},
          diet: rawData?.diet || {},
          preferences: rawData?.preferences || {},
          commitment: rawData?.commitment || {},
          calculatedValues: rawData?.calculatedValues || defaultCalculatedValues,
          progress: rawData?.progress || defaultProgress,
          createdAt: rawData?.createdAt ?? firestore.FieldValue.serverTimestamp(),
          updatedAt: rawData?.updatedAt ?? firestore.FieldValue.serverTimestamp(),
          lastUpdated: rawData?.lastUpdated,
          version: rawData?.version,
        };

        console.log('loadUserData: Safe data created, onboardingCompleted:', safeData.onboardingCompleted);
        setUserData(safeData);
      } else {
        console.log('loadUserData: No document exists, creating initial document');
        // Create initial user document if it doesn't exist
        await createInitialUserDocument(userId);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // On error, create a minimal safe user data object
      const fallbackData: UserDocument = {
        uid: userId,
        email: undefined,
        displayName: undefined,
        isAnonymous: true,
        onboardingCompleted: false,
        onboardingCompletedAt: undefined,
        profile: {},
        goals: {},
        activity: {},
        diet: {},
        preferences: {},
        commitment: {},
        calculatedValues: defaultCalculatedValues,
        progress: defaultProgress,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
        lastUpdated: undefined,
        version: undefined,
      };
      console.log('loadUserData: Using fallback data due to error');
      setUserData(fallbackData);
    }
  };

  // Create initial user document
  const createInitialUserDocument = async (userId: string) => {
    try {
      console.log('createInitialUserDocument: Creating document for user:', userId);

      // Check if document already exists first
      const existingDoc = await firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(userId)
        .get();

      if ((existingDoc as any).exists) {
        console.log('createInitialUserDocument: Document already exists, loading it');
        const rawData = existingDoc.data();

        // Create safe data from existing document
        const safeData: UserDocument = {
          uid: userId,
          email: rawData?.email,
          displayName: rawData?.displayName,
          isAnonymous: rawData?.isAnonymous !== false,
          onboardingCompleted: rawData?.onboardingCompleted === true,
          onboardingCompletedAt: rawData?.onboardingCompletedAt,
          profile: rawData?.profile || {},
          goals: rawData?.goals || {},
          activity: rawData?.activity || {},
          diet: rawData?.diet || {},
          preferences: rawData?.preferences || {},
          commitment: rawData?.commitment || {},
          calculatedValues: rawData?.calculatedValues || defaultCalculatedValues,
          progress: rawData?.progress || defaultProgress,
          createdAt: rawData?.createdAt ?? firestore.FieldValue.serverTimestamp(),
          updatedAt: rawData?.updatedAt ?? firestore.FieldValue.serverTimestamp(),
          lastUpdated: rawData?.lastUpdated,
          version: rawData?.version,
        };

        setUserData(safeData);
        return safeData;
      }

      console.log('createInitialUserDocument: Creating new document');
      // Create new document if it doesn't exist
      const currentUser = auth().currentUser;
      const initialData: UserDocument = {
        uid: userId,
        email: currentUser?.email ?? undefined,
        displayName: currentUser?.displayName ?? undefined,
        isAnonymous: currentUser?.isAnonymous !== false,
        onboardingCompleted: false,
        onboardingCompletedAt: undefined,
        profile: {},
        goals: {},
        activity: {},
        diet: {},
        preferences: {},
        commitment: {},
        calculatedValues: defaultCalculatedValues,
        progress: defaultProgress,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
        lastUpdated: firestore.FieldValue.serverTimestamp(),
        version: '1.0.0',
      };

      await firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(userId)
        .set(initialData);

      console.log('createInitialUserDocument: Document created successfully');
      setUserData(initialData);
      return initialData;
    } catch (error) {
      console.error('Error creating initial user document:', error);
      // Even on error, set a minimal safe data object to prevent crashes
      const fallbackData: UserDocument = {
        uid: userId,
        email: undefined,
        displayName: undefined,
        isAnonymous: true,
        onboardingCompleted: false,
        onboardingCompletedAt: undefined,
        profile: {},
        goals: {},
        activity: {},
        diet: {},
        preferences: {},
        commitment: {},
        calculatedValues: defaultCalculatedValues,
        progress: defaultProgress,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
        lastUpdated: undefined,
        version: undefined,
      };
      setUserData(fallbackData);
      return fallbackData;
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
  const signInAnonymouslyFn = async (): Promise<FirebaseAuthTypes.User> => {
    return createAnonymousUser();
  };

  // Update user profile in Firestore
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('No user authenticated');

    try {
      // Use set with merge to create or update the document
      const updateData: any = {
        uid: user.uid,
        isAnonymous: user.isAnonymous ?? true,
        profile: { ...userData?.profile, ...data },
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      // Only add email and displayName if they exist
      if (user.email) updateData.email = user.email;
      if (user.displayName) updateData.displayName = user.displayName;

      await firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(user.uid)
        .set(updateData, { merge: true });

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

      await firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(user.uid)
        .set(updateData, { merge: true });

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

      await firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(user.uid)
        .set(updateData, { merge: true });

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

      await firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(user.uid)
        .set(updateData, { merge: true });

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

      await firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(user.uid)
        .set(updateData, { merge: true });

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

      await firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(user.uid)
        .set(updateData, { merge: true });

      await refreshUserData();
    } catch (error) {
      console.error('Error updating commitment:', error);
      throw error;
    }
  };

  // Calculate BMR, TDEE, and macros based on user data
  const calculateAndUpdateValues = async () => {
    if (!userData || !user) {
      console.log('calculateAndUpdateValues: Missing userData or user');
      return;
    }

    const { profile, activity, goals } = userData;

    // Check if we have required profile data
    if (!profile || profile === undefined) {
      console.log('calculateAndUpdateValues: Profile is undefined or missing');
      return;
    }

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
      console.log('BMR calculated:', bmr);
    } else {
      console.log('calculateAndUpdateValues: Missing required profile data', {
        age: profile.age,
        currentWeight: profile.currentWeight,
        height: profile.height,
        gender: profile.gender
      });
      return;
    }

    // Calculate TDEE based on activity level
    let tdee = bmr;
    if (activity && activity.level) {
      const multipliers = {
        sedentary: 1.2,
        lightly_active: 1.375,
        moderately_active: 1.55,
        very_active: 1.725,
        extremely_active: 1.9,
      };
      tdee = bmr * multipliers[activity.level];
      console.log('TDEE calculated:', tdee, 'with activity level:', activity.level);
    } else {
      console.log('calculateAndUpdateValues: No activity level found, using default TDEE');
    }

    // Adjust calories based on goals
    let dailyCalorieGoal = tdee;
    if (goals && goals.primaryGoal) {
      if (goals.primaryGoal === 'weight_loss') {
        dailyCalorieGoal = Math.max(1200, tdee - 500); // 500 calorie deficit
      } else if (goals.primaryGoal === 'muscle_gain') {
        dailyCalorieGoal = tdee + 300; // 300 calorie surplus
      }
      console.log('Daily calorie goal calculated:', dailyCalorieGoal, 'for goal:', goals.primaryGoal);
    } else {
      console.log('calculateAndUpdateValues: No primary goal found, using default TDEE as calorie goal');
    }

    // Calculate macros (40% carbs, 30% protein, 30% fats)
    const protein = (dailyCalorieGoal * 0.3) / 4; // 4 calories per gram
    const carbs = (dailyCalorieGoal * 0.4) / 4;
    const fats = (dailyCalorieGoal * 0.3) / 9; // 9 calories per gram

    const newCalculatedValues: CalculatedValues = {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      dailyCalorieGoal: Math.round(dailyCalorieGoal),
      macros: {
        protein: Math.round(protein),
        carbs: Math.round(carbs),
        fats: Math.round(fats),
      },
    };

    console.log('New calculated values:', newCalculatedValues);

    // Check if values changed significantly before updating Firestore
    const currentValues = userData.calculatedValues;
    const hasSignificantChange = !currentValues ||
      Math.abs((currentValues.bmr || 0) - newCalculatedValues.bmr) > 10 ||
      Math.abs((currentValues.tdee || 0) - newCalculatedValues.tdee) > 10 ||
      Math.abs((currentValues.dailyCalorieGoal || 0) - newCalculatedValues.dailyCalorieGoal) > 50 ||
      Math.abs((currentValues.macros?.protein || 0) - newCalculatedValues.macros.protein) > 5 ||
      Math.abs((currentValues.macros?.carbs || 0) - newCalculatedValues.macros.carbs) > 5 ||
      Math.abs((currentValues.macros?.fats || 0) - newCalculatedValues.macros.fats) > 3;

    if (hasSignificantChange) {
      console.log('Calculated values changed significantly, updating Firestore:', newCalculatedValues);
      try {
        const db = firestore();
        await db
          .collection(FIREBASE_CONFIG.collections.users)
          .doc(user.uid)
          .update({
            calculatedValues: newCalculatedValues,
            updatedAt: firestore.FieldValue.serverTimestamp(),
          });
        console.log('Calculated values updated in user context successfully');
      } catch (error) {
        console.error('Error updating calculated values:', error);
      }
    } else {
      console.log('Calculated values unchanged, skipping Firestore update');
    }
  };

  // Update calculated values when profile, activity, or goals change (with optimization)
  useEffect(() => {
    if (userData && user) {
      // Only calculate if we have the minimum required data
      const hasBasicData = userData.profile?.age &&
                          userData.profile?.currentWeight &&
                          userData.profile?.height &&
                          userData.profile?.gender;

      if (hasBasicData) {
        calculateAndUpdateValues();
      }
    }
  }, [userData?.profile?.age, userData?.profile?.currentWeight, userData?.profile?.height, userData?.profile?.gender, userData?.activity?.level, userData?.goals?.primaryGoal, user]);

  // Complete onboarding
  const completeOnboarding = async () => {
    if (!user) throw new Error('No user authenticated');

    try {
      console.log('completeOnboarding: Starting onboarding completion for user:', user.uid);

      // Try to calculate final values, but don't fail if data is missing
      try {
        await calculateAndUpdateValues();
      } catch (calcError) {
        console.warn('completeOnboarding: Could not calculate values, but continuing:', calcError);
      }

      // Use set with merge instead of update to ensure document exists
      const currentUser = auth().currentUser;
      await firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(user.uid)
        .set({
          uid: user.uid,
          isAnonymous: currentUser?.isAnonymous || true,
          email: user.email || currentUser?.email,
          displayName: user.displayName || currentUser?.displayName,
          onboardingCompleted: true,
          onboardingCompletedAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
          // Merge with existing data
          ...userData,
        }, { merge: true });

      console.log('completeOnboarding: Onboarding status updated to true');
      await refreshUserData();

      console.log('completeOnboarding: User data refreshed successfully');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  };

  // Sign out
  const signOutFn = async () => {
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
      console.log('refreshUserData: Refreshing data for user:', user.uid);
      await loadUserData(user.uid);
    } else {
      console.warn('refreshUserData: No user to refresh');
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
    signInAnonymously: signInAnonymouslyFn,
    signOut: signOutFn,
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
