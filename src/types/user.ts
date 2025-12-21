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

// User Progress Tracking
export interface UserProgress {
  currentWeight: number;
  startingWeight: number;
  goalWeight: number;
  weightLossTotal: number;
  weightLossToGoal: number;
  weeklyWeightChange: number;
  averageWeeklyLoss: number;
  timeOnApp: number; // days since onboarding completed
  lastWeightUpdate: string; // YYYY-MM-DD format
}

// Achievement System
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'streak' | 'nutrition' | 'weight' | 'activity' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress?: {
    current: number;
    goal: number;
  };
}

// Streak Tracking System
export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  weekDays: boolean[]; // 7 days - Monday to Sunday
  lastActiveDate?: string; // YYYY-MM-DD format
  streakHistory: StreakDay[];
}

export interface StreakDay {
  date: string; // YYYY-MM-DD format
  completed: boolean;
  mealsLogged: number;
  caloriesGoal: number;
  caloriesConsumed: number;
  waterIntake: number;
  stepsCount?: number;
}

// Daily Activity Logging
export interface DailyLog {
  date: string; // YYYY-MM-DD format
  calories: {
    consumed: number;
    goal: number;
    remaining: number;
  };
  nutrition: {
    protein: { current: number; goal: number };
    carbs: { current: number; goal: number };
    fats: { current: number; goal: number };
  };
  water: {
    glasses: number;
    goal: number;
    lastGlassTime?: string;
  };
  steps: {
    count: number;
    goal: number;
  };
  meals: MealLog[];
  activities: ActivityLog[];
  weight?: {
    value: number;
    unit: 'kg' | 'lbs';
  };
  notes?: string;
  completed: boolean;
}

export interface MealLog {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string; // HH:MM format
  calories: number;
  nutrition: {
    protein: number;
    carbohydrates: number;
    fats: number;
  };
  portion: {
    amount: number;
    unit: string;
  };
  photo?: string;
  confidence?: number; // AI recognition confidence
  method: 'camera' | 'manual' | 'barcode' | 'quickadd';
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  type: 'exercise' | 'water' | 'weight' | 'custom';
  name: string;
  duration?: number; // minutes
  calories?: number;
  intensity?: 'low' | 'medium' | 'high';
  value?: number; // for water glasses, weight, etc.
  unit?: string;
  notes?: string;
  completedAt: string;
}

// Notification System
export interface Notification {
  id: string;
  type: 'achievement' | 'reminder' | 'milestone' | 'tip' | 'warning';
  title: string;
  message: string;
  data?: any; // Additional data for the notification
  read: boolean;
  createdAt: string;
  scheduledAt?: string;
  priority: 'low' | 'medium' | 'high';
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: string;
  data?: any;
}

// Dashboard Analytics
export interface DashboardAnalytics {
  weeklyStats: WeeklyStats;
  monthlyStats: MonthlyStats;
  yearlyStats: YearlyStats;
  progressTrends: ProgressTrend[];
  insights: UserInsight[];
}

export interface WeeklyStats {
  weekStart: string; // YYYY-MM-DD format (Monday)
  weekEnd: string; // YYYY-MM-DD format (Sunday)
  totalCalories: number;
  averageCalories: number;
  goalAchievementDays: number;
  streakMaintained: boolean;
  totalExerciseMinutes: number;
  averageSteps: number;
  weightChange?: number;
}

export interface MonthlyStats {
  month: string; // YYYY-MM format
  totalDays: number;
  activeDays: number;
  totalCalories: number;
  averageDailyCalories: number;
  goalAchievementRate: number;
  totalExerciseMinutes: number;
  averageSteps: number;
  weightChange?: number;
  achievementsUnlocked: number;
}

export interface YearlyStats {
  year: number;
  totalDays: number;
  activeDays: number;
  longestStreak: number;
  totalWeightLoss: number;
  totalExerciseMinutes: number;
  averageDailyCalories: number;
  goalsAchieved: number;
}

export interface ProgressTrend {
  period: 'week' | 'month' | 'year';
  metric: 'weight' | 'calories' | 'steps' | 'exercise';
  data: Array<{
    date: string;
    value: number;
    goal?: number;
  }>;
}

export interface UserInsight {
  id: string;
  type: 'positive' | 'warning' | 'tip' | 'milestone';
  title: string;
  description: string;
  data?: any;
  createdAt: string;
  acknowledged: boolean;
}

// User data structure for Firestore - Complete integration
export interface UserDocument {
  // Basic user info
  uid: string;
  email?: string;
  displayName?: string;
  isAnonymous: boolean;

  // Onboarding completion status
  onboardingCompleted: boolean;
  onboardingCompletedAt?: string;

  // Profile information (from onboarding)
  profile: Partial<UserProfile>;

  // Goals and targets (from onboarding)
  goals: Partial<Goals>;

  // Activity level (from onboarding)
  activity: Partial<Activity>;

  // Diet preferences (from onboarding)
  diet: Partial<Diet>;

  // App preferences (from onboarding)
  preferences: Partial<Preferences>;

  // Commitment data (from onboarding)
  commitment: Partial<Commitment>;

  // Calculated nutritional values (from onboarding)
  calculatedValues: CalculatedValues;

  // Progress tracking (updated over time)
  progress?: UserProgress;

  // Streak system
  streaks?: StreakData;

  // Daily logs (keyed by date YYYY-MM-DD)
  dailyLogs?: { [date: string]: DailyLog };

  // Achievements unlocked
  achievements?: Achievement[];

  // User notifications
  notifications?: Notification[];

  // Dashboard analytics
  analytics?: DashboardAnalytics;

  // App usage metadata
  metadata?: {
    lastLoginAt: string;
    appVersion: string;
    deviceInfo?: string;
    timezone: string;
    locale: string;
  };

  // Additional metadata
  lastUpdated?: any; // Firestore Timestamp
  version?: string;

  // Timestamps
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
}

// User preferences for dashboard and notifications
export interface UserDashboardPreferences {
  theme: 'light' | 'dark' | 'auto';
  units: {
    weight: 'kg' | 'lbs';
    distance: 'km' | 'miles';
    temperature: 'celsius' | 'fahrenheit';
  };
  dashboard: {
    showStreakCard: boolean;
    showProgressChart: boolean;
    showQuickStats: boolean;
    defaultView: 'overview' | 'nutrition' | 'activity';
  };
  privacy: {
    showAchievements: boolean;
    showProgressCharts: boolean;
    dataRetention: '30days' | '90days' | '1year' | 'forever';
  };
}

// Export for use in other files