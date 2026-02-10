import {
  UserProfile,
  Goals,
  Activity,
  Diet,
  Preferences,
  Commitment,
  Account,
  CalculatedValues
} from './user';

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

  // Unit preferences
  heightUnit: 'cm' | 'inches';
  weightUnit: 'kg' | 'lbs';

  // Actions
  updateProfile: (data: Partial<UserProfile>) => void;
  updateGoals: (data: Partial<Goals>) => void;
  updateActivity: (data: Partial<Activity>) => void;
  updateDiet: (data: Partial<Diet>) => void;
  updatePreferences: (data: Partial<Preferences>) => void;
  updateCommitment: (data: Partial<Commitment>) => void;
  updateAccount: (data: Partial<Account>) => void;
  setHeightUnit: (unit: 'cm' | 'inches') => void;
  setWeightUnit: (unit: 'kg' | 'lbs') => void;
  getCurrentStep: (screenName: ScreenName) => number;
  getProgressPercentage: (currentStep: number) => number;
  validateScreenName: (screenName: string) => boolean;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => void;
  saveProgress: () => Promise<void>;
  loadProgress: () => Promise<void>;
  syncToFirestore: () => Promise<void>;
}

// Onboarding Storage Structure
export interface OnboardingStorage {
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
  heightUnit?: 'cm' | 'inches';
  weightUnit?: 'kg' | 'lbs';
}

// Screen navigation types
export type ScreenName = string;

// Onboarding Screens Configuration
export const ONBOARDING_SCREENS = [
  'welcome',
  'name',
  'last-name',
  'gender',
  'date-of-birth',
  'height',
  'weight',
  'profile-photo',
  'profile',
  'goals-primary',
  'goals-motivation',
  'goals-weight',
  'goals-timeline',
  'goals-weekly',
  'activity',
  'occupation',
  'exercise-types',
  'exercise-frequency',
  'sleep-hours',
  'diet',
  'allergies',
  'intolerances',
  'disliked-foods',
  'cultural-restrictions',
  'notifications',
  'privacy',
  'camera-tutorial',
  'commitment',
  'account-creation',
  'summary'
] as const;