/**
 * CaloriTrack - Dashboard Hook
 * Custom hook for dashboard data management
 * Minimal. Cool. Aesthetic.
 */

import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  UserDocument,
  StreakData,
  DailyLog,
  MealLog,
  Achievement,
  Notification,
  UserProgress,
} from '@/types/user';
import { dashboardService } from '@/services/dashboard-service';
import { useUser } from '@/context/user-context';

// Redux actions (you'll need to create these)
const dashboardSlice = {
  setLoading: (isLoading: boolean) => ({ type: 'dashboard/setLoading', payload: isLoading }),
  setDashboardData: (data: UserDashboardDocument) => ({ type: 'dashboard/setData', payload: data }),
  updateStreak: (streakData: StreakData) => ({ type: 'dashboard/updateStreak', payload: streakData }),
  addMeal: (meal: MealEntry) => ({ type: 'dashboard/addMeal', payload: meal }),
  addAchievement: (achievement: Achievement) => ({ type: 'dashboard/addAchievement', payload: achievement }),
  addNotification: (notification: DashboardNotification) => ({ type: 'dashboard/addNotification', payload: notification }),
  setError: (error: string | null) => ({ type: 'dashboard/setError', payload: error }),
};

// Simplified selector types for now
interface DashboardState {
  isLoading: boolean;
  error: string | null;
  data: UserDashboardDocument | null;
  lastUpdated: string | null;
}

// Hook state interface
interface UseDashboardState {
  userDocument: UserDocument | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  streakData: StreakData | null;
  todayLog: DailyLog | null;
  recentMeals: any[];
  achievements: Achievement[];
  notifications: Notification[];
}

// Hook return interface
interface UseDashboardReturn extends UseDashboardState {
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
  const dispatch = useDispatch();

  // Local state (fallback if Redux is not set up)
  const [localState, setLocalState] = useState<UseDashboardState>({
    userDocument: null,
    isLoading: true,
    isRefreshing: false,
    error: null,
    streakData: null,
    todayLog: null,
    recentMeals: [],
    achievements: [],
    notifications: [],
  });

  // Try to get state from Redux, fallback to local state
  const getState = (): DashboardState => {
    try {
      // This would normally come from Redux store
      // For now, we'll use local state
      return {
        isLoading: localState.isLoading,
        error: localState.error,
        data: localState.dashboardData,
        lastUpdated: localState.dashboardData?.updatedAt || null,
      };
    } catch {
      return {
        isLoading: localState.isLoading,
        error: localState.error,
        data: localState.dashboardData,
        lastUpdated: null,
      };
    }
  };

  // Set state (Redux or local fallback)
  const setState = (updates: Partial<UseDashboardState>) => {
    try {
      // This would normally dispatch to Redux
      // For now, we'll update local state
      setLocalState(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error('Error setting dashboard state:', error);
      setLocalState(prev => ({ ...prev, ...updates }));
    }
  };

  // Initialize dashboard data
  const initializeDashboard = useCallback(async () => {
    if (!user) {
      setState({ isLoading: false, error: 'Kullanıcı giriş yapmamış' });
      return;
    }

    try {
      setState({ isLoading: true, error: null });

      const userDocument = await dashboardService.getUserDocument();

      if (userDocument) {
        setState({
          userDocument,
          streakData: userDocument.streaks,
          recentMeals: [], // Will be loaded separately
          achievements: userDocument.achievements || [],
          notifications: userDocument.notifications || [],
          isLoading: false,
          error: null,
        });

        // Get today's log
        const today = new Date().toISOString().split('T')[0];
        const todayLog = await dashboardService.getDailyStats(today);
        setState({ todayLog });

        // Get recent meals
        const recentMeals = await dashboardService.getRecentMeals(10);
        setState(prev => ({ ...prev, recentMeals }));
      } else {
        setState({
          isLoading: false,
          error: 'Kullanıcı verileri yüklenemedi'
        });
      }
    } catch (error) {
      console.error('Error initializing dashboard:', error);
      setState({
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
      const newMeal = await dashboardService.addMealEntry(mealData);

      // Update local state
      setState(prev => ({
        recentMeals: [newMeal, ...(prev.recentMeals || [])].slice(0, 20), // Keep last 20 meals
      }));

      // Refresh today's log after adding meal
      const today = new Date().toISOString().split('T')[0];
      const updatedLog = await dashboardService.getDailyStats(today);
      setState({ todayLog: updatedLog });

      return newMeal;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Öğün eklenemedi';
      setState({ error: errorMessage });
      throw error;
    }
  }, []);

  // Update daily log
  const updateDailyLog = useCallback(async (
    logData: Partial<DailyLog>,
    date?: string
  ): Promise<DailyLog> => {
    try {
      // This would need to be implemented in dashboardService
      // For now, return a mock implementation
      const targetDate = date || new Date().toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];

      const updatedLog = await dashboardService.getOrCreateDailyStats(targetDate);

      // Update local state if it's today's log
      if (targetDate === today) {
        setState({ todayLog: updatedLog });
      }

      return updatedLog;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Günlük güncellenemedi';
      setState({ error: errorMessage });
      throw error;
    }
  }, []);

  // Update streak data
  const updateStreak = useCallback(async (): Promise<StreakData> => {
    try {
      const updatedStreakData = await dashboardService.updateStreakData();
      setState({ streakData: updatedStreakData });
      return updatedStreakData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Seri güncellenemedi';
      setState({ error: errorMessage });
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
      return await dashboardService.getDailyStats(date);
    } catch (error) {
      console.error('Error getting daily log:', error);
      throw error;
    }
  }, []);

  // Get recent meals
  const getRecentMeals = useCallback(async (limit: number = 10): Promise<any[]> => {
    try {
      const meals = await dashboardService.getRecentMeals(limit);
      setState({ recentMeals: meals });
      return meals;
    } catch (error) {
      console.error('Error getting recent meals:', error);
      return [];
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState({ error: null });
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
      setState({
        dashboardData: null,
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
    userDocument: localState.userDocument,
    isLoading: localState.isLoading,
    isRefreshing: localState.isRefreshing,
    error: localState.error,
    streakData: localState.streakData,
    todayLog: localState.todayLog,
    recentMeals: localState.recentMeals,
    achievements: localState.achievements,
    notifications: localState.notifications,

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