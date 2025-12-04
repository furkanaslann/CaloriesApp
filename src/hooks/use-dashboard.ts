/**
 * CaloriTrack - Dashboard Hook
 * Custom hook for dashboard data management
 * Minimal. Cool. Aesthetic.
 */

import { useUser } from '@/context/user-context';
import {
  Achievement,
  DailyLog,
  MealLog,
  Notification,
  StreakData,
  UserDocument
} from '@/types/user';
import { useCallback, useEffect, useState } from 'react';

// Hook return interface
interface UseDashboardReturn {
  userDocument: UserDocument | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  streakData: StreakData | null;
  todayLog: DailyLog | null;
  recentMeals: any[];
  achievements: Achievement[];
  notifications: Notification[];

  // Data fetching
  refreshDashboard: () => Promise<void>;
  getDailyLog: (date?: string) => Promise<DailyLog | null>;
  getRecentMeals: (limit?: number) => Promise<any[]>;

  // Actions
  addMeal: (mealData: Omit<MealLog, 'id' | 'createdAt'>) => Promise<MealLog>;
  updateDailyLog: (logData: Partial<DailyLog>, date?: string) => Promise<DailyLog>;
  updateStreak: () => Promise<StreakData>;

  // Utilities
  refreshStreak: () => Promise<void>;
  clearError: () => void;
  formatDateForDisplay: (date: string) => string;
  calculateProgressPercentage: (current: number, goal: number) => number;
}

export const useDashboard = (): UseDashboardReturn => {
  const { user } = useUser();

  // Local state
  const [state, setState] = useState({
    userDocument: null as UserDocument | null,
    isLoading: true,
    isRefreshing: false,
    error: null as string | null,
    streakData: null as StreakData | null,
    todayLog: null as DailyLog | null,
    recentMeals: [] as any[],
    achievements: [] as Achievement[],
    notifications: [] as Notification[],
  });

  const updateState = (updates: Partial<typeof state>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Initialize dashboard data
  const initializeDashboard = useCallback(async () => {
    if (!user) {
      updateState({ isLoading: false, error: 'Kullanıcı giriş yapmamış' });
      return;
    }

    try {
      updateState({ isLoading: true, error: null });

      // TODO: Implement dashboard data loading when service is ready
      updateState({
        userDocument: null,
        streakData: null,
        recentMeals: [],
        achievements: [],
        notifications: [],
        todayLog: null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error initializing dashboard:', error);
      updateState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Dashboard yüklenirken hata oluştu'
      });
    }
  }, [user]);

  // Refresh dashboard data
  const refreshDashboard = useCallback(async () => {
    if (!user) return;

    try {
      setState({ isRefreshing: true });
      await initializeDashboard();
    } finally {
      setState({ isRefreshing: false });
    }
  }, [user, initializeDashboard]);

  // Add meal entry
  const addMeal = useCallback(async (mealData: Omit<MealLog, 'id' | 'createdAt'>): Promise<MealLog> => {
    try {
      // TODO: Implement meal addition when service is ready
      const newMeal: MealLog = {
        id: Date.now().toString(),
        ...mealData,
        createdAt: new Date().toISOString(),
      };

      // Update local state
      updateState({
        recentMeals: [newMeal, ...(state.recentMeals || [])].slice(0, 20), // Keep last 20 meals
      });

      return newMeal;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Öğün eklenemedi';
      updateState({ error: errorMessage });
      throw error;
    }
  }, [state.recentMeals]);

  // Update daily log
  const updateDailyLog = useCallback(async (
    logData: Partial<DailyLog>,
    date?: string
  ): Promise<DailyLog> => {
    try {
      // TODO: Implement daily log update when service is ready
      const mockLog: DailyLog = {
        id: Date.now().toString(),
        date: date || new Date().toISOString().split('T')[0],
        meals: [],
        water: 0,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return mockLog;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Günlük güncellenemedi';
      updateState({ error: errorMessage });
      throw error;
    }
  }, []);

  // Update streak data
  const updateStreak = useCallback(async (): Promise<StreakData> => {
    try {
      // TODO: Implement streak update when service is ready
      const mockStreak: StreakData = {
        current: 0,
        longest: 0,
        lastLogDate: null,
      };

      updateState({ streakData: mockStreak });
      return mockStreak;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Seri güncellenemedi';
      updateState({ error: errorMessage });
      throw error;
    }
  }, []);

  // Refresh streak specifically
  const refreshStreak = useCallback(async () => {
    try {
      await updateStreak();
    } catch (error) {
      console.error('Error refreshing streak:', error);
    }
  }, [updateStreak]);

  // Get daily log for any date
  const getDailyLog = useCallback(async (date?: string): Promise<DailyLog | null> => {
    try {
      // TODO: Implement daily log retrieval when service is ready
      return null;
    } catch (error) {
      console.error('Error getting daily log:', error);
      throw error;
    }
  }, []);

  // Get recent meals
  const getRecentMeals = useCallback(async (limit: number = 10): Promise<any[]> => {
    try {
      // TODO: Implement recent meals retrieval when service is ready
      return [];
    } catch (error) {
      console.error('Error getting recent meals:', error);
      return [];
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, []);

  // Utility: Format date for display
  const formatDateForDisplay = useCallback((date: string): string => {
    try {
      const dateObj = new Date(date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date === today.toISOString().split('T')[0]) {
        return 'Bugün';
      } else if (date === yesterday.toISOString().split('T')[0]) {
        return 'Dün';
      } else {
        return dateObj.toLocaleDateString('tr-TR', {
          day: 'numeric',
          month: 'short'
        });
      }
    } catch {
      return date;
    }
  }, []);

  // Utility: Calculate progress percentage
  const calculateProgressPercentage = useCallback((current: number, goal: number): number => {
    if (goal === 0) return 0;
    return Math.min(100, Math.round((current / goal) * 100));
  }, []);

  // Initialize dashboard on mount and when user changes
  useEffect(() => {
    if (user) {
      initializeDashboard();
    } else {
      updateState({
        userDocument: null,
        isLoading: false,
        error: 'Kullanıcı giriş yapmamış'
      });
    }
  }, [user, initializeDashboard]);

  // Check for daily streak update on app focus/foreground
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active' && user) {
        refreshStreak();
      }
    };

    // This would require importing AppState from React Native
    // For now, we'll just check on mount
    if (user) {
      refreshStreak();
    }
  }, [user, refreshStreak]);

  return {
    // State
    userDocument: state.userDocument,
    isLoading: state.isLoading,
    isRefreshing: state.isRefreshing,
    error: state.error,
    streakData: state.streakData,
    todayLog: state.todayLog,
    recentMeals: state.recentMeals,
    achievements: state.achievements,
    notifications: state.notifications,

    // Data fetching
    refreshDashboard,
    getDailyLog,
    getRecentMeals,

    // Actions
    addMeal,
    updateDailyLog,
    updateStreak,

    // Utilities
    refreshStreak,
    clearError,
    formatDateForDisplay,
    calculateProgressPercentage,
  };
};

export default useDashboard;