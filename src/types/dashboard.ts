/**
 * CaloriTrack - Dashboard & Streak Types
 * Minimal. Cool. Aesthetic.
 */

import { NutritionInfo } from './food';

// Streak system types
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

// Dashboard stats types
export interface DailyStats {
  date: string; // YYYY-MM-DD format
  calories: number;
  goal: number;
  remaining: number;
  water: number; // glasses
  waterGoal: number;
  steps: number;
  stepsGoal: number;
  macros: {
    carbs: { current: number; goal: number; color: string };
    protein: { current: number; goal: number; color: string };
    fat: { current: number; goal: number; color: string };
  };
  percentage: number; // overall daily progress percentage
}

// Meal entry for dashboard
export interface MealEntry {
  id: string;
  name: string;
  calories: number;
  time: string; // HH:MM format
  type: 'Kahvaltı' | 'Öğle Yemeği' | 'Akşam Yemeği' | 'Atıştırmalık';
  date: string; // YYYY-MM-DD format
  nutrition?: NutritionInfo;
  confidence?: number; // For AI-recognized meals
  photoUrl?: string;
}

// Quick stat card data
export interface QuickStat {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  icon: string;
  color: string;
  backgroundColor: string;
  type: 'water' | 'steps' | 'calories' | 'weight' | 'exercise';
}

// Weekly progress data
export interface WeeklyProgress {
  weekStart: string; // YYYY-MM-DD format (Monday)
  weekEnd: string; // YYYY-MM-DD format (Sunday)
  dailyStats: DailyStats[];
  totalCalories: number;
  averageCalories: number;
  goalAchievementDays: number;
  streakMaintained: boolean;
}

// Monthly summary
export interface MonthlySummary {
  month: string; // YYYY-MM format
  totalDays: number;
  activeDays: number;
  totalCalories: number;
  averageDailyCalories: number;
  goalAchievementRate: number;
  bestStreak: number;
  currentStreak: number;
  weightChange?: number; // kg
}

// Achievement types
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'streak' | 'nutrition' | 'weight' | 'activity' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// Progress chart data
export interface ProgressChartData {
  period: 'week' | 'month' | 'year';
  data: ChartDataPoint[];
  goal: number;
  unit: string;
}

interface ChartDataPoint {
  date: string;
  value: number;
  goal?: number;
  label?: string;
}

// Dashboard notification
export interface DashboardNotification {
  id: string;
  type: 'achievement' | 'reminder' | 'milestone' | 'tip';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

// User progress snapshot
export interface UserProgress {
  currentWeight: number;
  startingWeight: number;
  goalWeight: number;
  weightLossTotal: number;
  weightLossToGoal: number;
  weeklyWeightChange: number;
  averageWeeklyLoss: number;
  timeOnApp: number; // days since onboarding completed
}

// Dashboard state
export interface DashboardState {
  isLoading: boolean;
  refreshing: boolean;
  lastUpdated: string;
  streakData: StreakData;
  dailyStats: DailyStats;
  recentMeals: MealEntry[];
  weeklyProgress: WeeklyProgress;
  notifications: DashboardNotification[];
  achievements: Achievement[];
  userProgress: UserProgress;
}

// Firestore document types
export interface UserDashboardDocument {
  uid: string;
  streakData: StreakData;
  dailyStats: { [date: string]: DailyStats }; // Keyed by YYYY-MM-DD
  meals: MealEntry[];
  weeklyProgress: { [weekStart: string]: WeeklyProgress }; // Keyed by week start date
  monthlySummaries: { [month: string]: MonthlySummary }; // Keyed by YYYY-MM
  achievements: Achievement[];
  notifications: DashboardNotification[];
  userProgress: UserProgress;
  createdAt: string;
  updatedAt: string;
}

// API response types for dashboard operations
export interface DashboardResponse {
  success: boolean;
  data?: UserDashboardDocument;
  error?: string;
}

export interface UpdateStreakResponse {
  success: boolean;
  streakData?: StreakData;
  newAchievement?: Achievement;
  error?: string;
}

export interface AddMealResponse {
  success: boolean;
  meal?: MealEntry;
  updatedDailyStats?: DailyStats;
  error?: string;
}

// Local storage keys
export const DASHBOARD_STORAGE_KEYS = {
  STREAK_DATA: '@caloritrack_streak_data',
  DAILY_STATS: '@caloritrack_daily_stats',
  RECENT_MEALS: '@caloritrack_recent_meals',
  LAST_ACTIVE_DATE: '@caloritrack_last_active_date',
  ACHIEVEMENTS: '@caloritrack_achievements',
} as const;