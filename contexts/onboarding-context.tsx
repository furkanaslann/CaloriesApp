/**
 * CaloriTrack - Onboarding Context
 * Minimal. Cool. Aesthetic.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Onboarding storage key
const ONBOARDING_STORAGE_KEY = '@caloritrack_onboarding';

// User Profile Types
export interface UserProfile {
  name: string;
  lastName: string;
  age: number;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  currentWeight: number; // kg
  profilePhoto?: string;
}

// Goals Types
export interface Goals {
  primaryGoal: 'weight_loss' | 'maintenance' | 'muscle_gain' | 'healthy_eating';
  targetWeight?: number;
  timeline: number; // weeks
  weeklyGoal: number; // kg per week
  motivation: number; // 1-10 scale
}

// Activity Types
export interface Activity {
  level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  occupation: 'office' | 'physical' | 'mixed';
  exerciseTypes: string[];
  exerciseFrequency: number; // per week
  sleepHours: number;
}

// Diet Types
export interface Diet {
  type: string;
  allergies: string[];
  intolerances: string[];
  dislikedFoods: string[];
  culturalRestrictions: string[];
}

// Preferences Types
export interface Preferences {
  notifications: {
    mealReminders: boolean;
    waterReminders: boolean;
    exerciseReminders: boolean;
    dailySummary: boolean;
    achievements: boolean;
  };
  privacy: {
    dataSharing: boolean;
    analytics: boolean;
    marketing: boolean;
  };
}

// Commitment Types
export interface Commitment {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  commitmentStatement: string;
  timestamp: string;
}

// Account Types
export interface Account {
  username: string;
  email: string;
  passwordHash: string; // In real app, this should be hashed
  createdAt: string;
  preferences: {
    agreeToTerms: boolean;
    agreeToPrivacy: boolean;
    subscribeToNewsletter: boolean;
  };
}

// Calculated Values Types
export interface CalculatedValues {
  bmr: number; // Basal Metabolic Rate
  tdee: number; // Total Daily Energy Expenditure
  dailyCalorieGoal: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
}

// Onboarding Screen Configuration
const ONBOARDING_SCREENS = [
  'welcome',
  'name', 'last-name', 'date-of-birth', 'gender',
  'height', 'weight', 'profile-photo',
  'goals-primary', 'goals-weight', 'goals-weekly', 'goals-timeline', 'goals-motivation',
  'activity', 'occupation', 'exercise-types', 'exercise-frequency', 'sleep-hours',
  'diet', 'camera-tutorial', 'notifications', 'privacy', 'summary', 'commitment', 'account-creation', 'index'
] as const;

type ScreenName = typeof ONBOARDING_SCREENS[number];

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

// Onboarding Context Type
export interface OnboardingContextType {
  // User Data
  profile: Partial<UserProfile>;
  goals: Partial<Goals>;
  activity: Partial<Activity>;
  diet: Partial<Diet>;
  preferences: Partial<Preferences>;
  commitment: Partial<Commitment>;
  account: Partial<Account>;

  // Calculated values (computed)
  calculatedValues: CalculatedValues;

  // Navigation State
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  isCompleted: boolean;

  // Actions
  updateProfile: (data: Partial<UserProfile>) => void;
  updateGoals: (data: Partial<Goals>) => void;
  updateActivity: (data: Partial<Activity>) => void;
  updateDiet: (data: Partial<Diet>) => void;
  updatePreferences: (data: Partial<Preferences>) => void;
  updateCommitment: (data: Partial<Commitment>) => void;
  updateAccount: (data: Partial<Account>) => void;
  getCurrentStep: (screenName: ScreenName) => number;
  getProgressPercentage: (currentStep: number) => number;
  validateScreenName: (screenName: string) => boolean;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  saveProgress: () => Promise<void>;
  loadProgress: () => Promise<void>;
}

// Onboarding Storage Structure
interface OnboardingStorage {
  profile: Partial<UserProfile>;
  goals: Partial<Goals>;
  activity: Partial<Activity>;
  diet: Partial<Diet>;
  preferences: Partial<Preferences>;
  commitment: Partial<Commitment>;
  account: Partial<Account>;
  currentStep: number;
  completedSteps: number[];
  isCompleted: boolean;
  lastUpdated: string;
  version: string;
}

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

      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(onboardingData));
    } catch (error) {
      console.error('Failed to save onboarding progress:', error);
    }
  };

  // Load progress from storage
  const loadProgress = async () => {
    try {
      const stored = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
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

  const completeOnboarding = () => {
    setIsCompleted(true);
    saveProgress();
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