/**
 * CaloriTrack - Onboarding Context
 * Minimal. Cool. Aesthetic.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveOnboardingData, updateOnboardingData } from '@/utils/firebase';
import { auth } from '@/utils/firebase';
import {
  UserProfile,
  Goals,
  Activity,
  Diet,
  Preferences,
  Commitment,
  Account,
  CalculatedValues,
  OnboardingContextType,
  OnboardingStorage,
  ScreenName,
  ONBOARDING_SCREENS
} from '@/types';

// Storage keys configuration
const STORAGE_KEYS = {
  onboarding: '@caloritrack_onboarding'
};

// Calculate step number for each screen
const SCREEN_STEPS: Record<ScreenName, number> = ONBOARDING_SCREENS.reduce((acc, screen, index) => {
  acc[screen] = index;
  return acc;
}, {} as Record<ScreenName, number>);

// Total number of screens
const TOTAL_STEPS = ONBOARDING_SCREENS.length;

// Helper function for development - validates screen name
const validateScreenName = (screenName: string): screenName is ScreenName => {
  return ONBOARDING_SCREENS.includes(screenName as ScreenName);
};

// Development helper - get current progress percentage
const getProgressPercentage = (currentStep: number): number => {
  return Math.round((currentStep / (TOTAL_STEPS - 1)) * 100);
};

// Create context
const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Onboarding Provider Component
export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [goals, setGoals] = useState<Partial<Goals>>({});
  const [activity, setActivity] = useState<Partial<Activity>>({});
  const [diet, setDiet] = useState<Partial<Diet>>({});
  const [preferences, setPreferences] = useState<Partial<Preferences>>({});
  const [commitment, setCommitment] = useState<Partial<Commitment>>({});
  const [account, setAccount] = useState<Partial<Account>>({});

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const [calculatedValues, setCalculatedValues] = useState<CalculatedValues>({
    bmr: 0,
    tdee: 0,
    dailyCalorieGoal: 2000,
    macros: {
      protein: 150,
      carbs: 250,
      fats: 65,
    },
  });

  // Calculate BMR using Harris-Benedict equation
  const calculateBMR = () => {
    if (!profile.age || !profile.currentWeight || !profile.height || !profile.gender) return 0;

    const { age, gender } = profile;
    const weight = profile.currentWeight || 0;
    const height = profile.height;

    if (gender === 'male') {
      return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
  };

  // Calculate TDEE based on activity level
  const calculateTDEE = (bmr: number) => {
    if (!activity.level) return bmr * 1.2; // Default to sedentary

    const multipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9,
    };

    return bmr * multipliers[activity.level];
  };

  // Update calculated values when profile or activity changes
  useEffect(() => {
    const bmr = calculateBMR();
    const tdee = calculateTDEE(bmr);

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

    setCalculatedValues({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      dailyCalorieGoal: Math.round(dailyCalorieGoal),
      macros: {
        protein: Math.round(protein),
        carbs: Math.round(carbs),
        fats: Math.round(fats),
      },
    });
  }, [profile, activity, goals]);

  // Load progress from storage
  useEffect(() => {
    loadProgress();
  }, []);

  // Save progress functions
  const saveProgress = async () => {
    try {
      const onboardingData: OnboardingStorage = {
        profile,
        goals,
        activity,
        diet,
        preferences,
        commitment,
        account,
        currentStep,
        completedSteps,
        isCompleted,
        lastUpdated: new Date().toISOString(),
        version: '1.0.0',
      };

      await AsyncStorage.setItem(STORAGE_KEYS.onboarding, JSON.stringify(onboardingData));
    } catch (error) {
      console.error('Failed to save onboarding progress:', error);
    }
  };

  // Load progress from storage
  const loadProgress = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.onboarding);
      if (stored) {
        const data: OnboardingStorage = JSON.parse(stored);

        setProfile(data.profile || {});
        setGoals(data.goals || {});
        setActivity(data.activity || {});
        setDiet(data.diet || {});
        setPreferences(data.preferences || {});
        setCommitment(data.commitment || {});
        setAccount(data.account || {});
        setCurrentStep(data.currentStep || 0);
        setCompletedSteps(data.completedSteps || []);
        setIsCompleted(data.isCompleted || false);
      } else {
        // No stored data, start fresh
        setIsCompleted(false);
        setCurrentStep(0);
        setCompletedSteps([]);
      }
    } catch (error) {
      console.error('Failed to load onboarding progress:', error);
      // On error, start fresh
      setIsCompleted(false);
      setCurrentStep(0);
      setCompletedSteps([]);
    }
  };

  // Update functions
  const updateProfile = (data: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...data }));
  };

  const updateGoals = (data: Partial<Goals>) => {
    setGoals(prev => ({ ...prev, ...data }));
  };

  const updateActivity = (data: Partial<Activity>) => {
    setActivity(prev => ({ ...prev, ...data }));
  };

  const updateDiet = (data: Partial<Diet>) => {
    setDiet(prev => ({ ...prev, ...data }));
  };

  const updatePreferences = (data: Partial<Preferences>) => {
    setPreferences(prev => ({ ...prev, ...data }));
  };

  const updateCommitment = (data: Partial<Commitment>) => {
    setCommitment(prev => ({ ...prev, ...data }));
  };

  const updateAccount = (data: Partial<Account>) => {
    setAccount(prev => ({ ...prev, ...data }));
  };

  // Get current step for specific screen
  const getCurrentStep = (screenName: ScreenName): number => {
    return SCREEN_STEPS[screenName] || 0;
  };

  // Validate screen name (development helper)
  const validateScreenNameFn = (screenName: string): boolean => {
    return validateScreenName(screenName);
  };

  // Get progress percentage (development helper)
  const getProgressPercentageFn = (currentStep: number): number => {
    return getProgressPercentage(currentStep);
  };

  // Navigation functions
  const nextStep = () => {
    const newStep = Math.min(currentStep + 1, TOTAL_STEPS - 1);
    setCurrentStep(newStep);

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }

    saveProgress();
  };

  const previousStep = () => {
    const newStep = Math.max(currentStep - 1, 0);
    setCurrentStep(newStep);
    saveProgress();
  };

  const goToStep = (step: number) => {
    const validStep = Math.max(0, Math.min(step, TOTAL_STEPS - 1));
    setCurrentStep(validStep);

    if (validStep > 0 && !completedSteps.includes(validStep - 1)) {
      setCompletedSteps(prev => [...prev, validStep - 1]);
    }

    saveProgress();
  };

  const completeOnboarding = async () => {
    try {
      setIsCompleted(true);
      // Save to local storage first
      await saveProgress();

      // Then sync to Firestore
      await syncToFirestore();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Still set as completed locally even if Firestore sync fails
      setIsCompleted(true);
    }
  };

  // Sync onboarding data to Firestore
  const syncToFirestore = async () => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        console.log('No authenticated user, skipping Firestore sync');
        return;
      }

      // Validate required fields before saving
      if (!profile.name || !profile.lastName || !profile.age || !profile.currentWeight || !profile.height) {
        console.warn('Missing required profile fields, skipping Firestore sync');
        return;
      }

      // Helper function to remove undefined values recursively
      const removeUndefinedValues = (obj: any): any => {
        if (obj === null || obj === undefined) return null;
        if (typeof obj !== 'object') return obj;

        if (Array.isArray(obj)) {
          return obj.map(removeUndefinedValues);
        }

        const cleaned: any = {};
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const value = removeUndefinedValues(obj[key]);
            if (value !== undefined) {
              cleaned[key] = value;
            }
          }
        }
        return cleaned;
      };

      const onboardingData = {
        profile: {
          name: profile.name!,
          lastName: profile.lastName!,
          age: profile.age!,
          dateOfBirth: profile.dateOfBirth || '',
          gender: profile.gender || 'other',
          height: profile.height!,
          currentWeight: profile.currentWeight!,
          profilePhoto: profile.profilePhoto || null,
        },
        goals: {
          primaryGoal: goals.primaryGoal || 'maintenance',
          targetWeight: goals.targetWeight || null,
          timeline: goals.timeline || 12,
          weeklyGoal: goals.weeklyGoal || 0.5,
          motivation: goals.motivation || 5,
        },
        activity: {
          level: activity.level || 'sedentary',
          occupation: activity.occupation || 'office',
          exerciseTypes: activity.exerciseTypes || [],
          exerciseFrequency: activity.exerciseFrequency || 0,
          sleepHours: activity.sleepHours || 8,
        },
        diet: {
          type: diet.type || 'balanced',
          allergies: diet.allergies || [],
          intolerances: diet.intolerances || [],
          dislikedFoods: diet.dislikedFoods || [],
          culturalRestrictions: diet.culturalRestrictions || [],
        },
        preferences: {
          notifications: {
            mealReminders: preferences.notifications?.mealReminders ?? true,
            waterReminders: preferences.notifications?.waterReminders ?? true,
            exerciseReminders: preferences.notifications?.exerciseReminders ?? true,
            dailySummary: preferences.notifications?.dailySummary ?? true,
            achievements: preferences.notifications?.achievements ?? true,
          },
          privacy: {
            dataSharing: preferences.privacy?.dataSharing ?? false,
            analytics: preferences.privacy?.analytics ?? true,
            marketing: preferences.privacy?.marketing ?? false,
          },
        },
        calculatedValues: {
          bmr: calculatedValues.bmr || 0,
          tdee: calculatedValues.tdee || 0,
          dailyCalorieGoal: calculatedValues.dailyCalorieGoal || 2000,
          macros: {
            protein: calculatedValues.macros?.protein || 0,
            carbs: calculatedValues.macros?.carbs || 0,
            fats: calculatedValues.macros?.fats || 0,
          },
        },
        commitment: commitment.firstName ? {
          firstName: commitment.firstName!,
          lastName: commitment.lastName!,
          email: commitment.email!,
          phone: commitment.phone || null,
          commitmentStatement: commitment.commitmentStatement || '',
          timestamp: commitment.timestamp || new Date().toISOString(),
        } : null,
        account: account.username ? {
          username: account.username!,
          email: account.email!,
          createdAt: account.createdAt || new Date().toISOString(),
          preferences: {
            agreeToTerms: account.preferences?.agreeToTerms ?? false,
            agreeToPrivacy: account.preferences?.agreeToPrivacy ?? false,
            subscribeToNewsletter: account.preferences?.subscribeToNewsletter ?? false,
          },
        } : null,
      };

      // Clean the data to remove any remaining undefined values
      const cleanedOnboardingData = removeUndefinedValues(onboardingData);

      await saveOnboardingData(currentUser.uid, cleanedOnboardingData);
      console.log('Onboarding data successfully synced to Firestore');
    } catch (error) {
      console.error('Error syncing onboarding data to Firestore:', error);
      throw error;
    }
  };

  const resetOnboarding = () => {
    setProfile({});
    setGoals({});
    setActivity({});
    setDiet({});
    setPreferences({});
    setCommitment({});
    setAccount({});
    setCurrentStep(0);
    setCompletedSteps([]);
    setIsCompleted(false);
    saveProgress();
  };

  const contextValue: OnboardingContextType = {
    profile,
    goals,
    activity,
    diet,
    preferences,
    commitment,
    account,
    calculatedValues,
    currentStep,
    totalSteps: TOTAL_STEPS,
    completedSteps,
    isCompleted,
    updateProfile,
    updateGoals,
    updateActivity,
    updateDiet,
    updatePreferences,
    updateCommitment,
    updateAccount,
    getCurrentStep,
    getProgressPercentage: getProgressPercentageFn,
    validateScreenName: validateScreenNameFn,
    nextStep,
    previousStep,
    goToStep,
    completeOnboarding,
    resetOnboarding,
    saveProgress,
    loadProgress,
    syncToFirestore,
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
};

// Hook to use onboarding context
export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

// Export screen configuration for components
export { SCREEN_STEPS, ONBOARDING_SCREENS, TOTAL_STEPS };
export type { ScreenName };

// Export for convenience
export { OnboardingContext };