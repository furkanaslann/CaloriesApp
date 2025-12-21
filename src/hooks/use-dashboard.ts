/**
 * CaloriTrack - Dashboard Hook
 * Custom hook for dashboard data management
 * Minimal. Cool. Aesthetic.
 */

import { useUser } from '@/context/user-context';
import { FIREBASE_CONFIG } from '@/constants/firebase';
import {
  Achievement,
  DailyLog,
  MealLog,
  Notification,
  StreakData,
  UserDocument
} from '@/types/user';
import { useCallback, useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';

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

      // Get today's date
      const today = new Date().toISOString().split('T')[0];

      // Fetch user document
      const db = firestore();
      const userDoc = await db
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(user.uid)
        .get();

      const userDocument = userDoc.exists ? userDoc.data() as UserDocument : null;

      // Fetch today's meals - geçici çözüm: orderBy kaldırıldı
      const mealsSnapshot = await db
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(user.uid)
        .collection('meals')
        .where('date', '==', today)
        .get();

      const recentMeals = mealsSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate(),
        }))
        .sort((a, b) => {
          // Client-side sıralama: timestamp'e göre azalan sırada
          const timeA = a.timestamp ? a.timestamp.getTime() : 0;
          const timeB = b.timestamp ? b.timestamp.getTime() : 0;
          return timeB - timeA;
        });

      // Calculate today's nutrition totals
      const totals = recentMeals.reduce((acc, meal) => ({
        calories: acc.calories + (meal.calories || 0),
        protein: acc.protein + (meal.nutrition?.protein || 0),
        carbs: acc.carbs + (meal.nutrition?.carbohydrates || 0),
        fats: acc.fats + (meal.nutrition?.fats || 0),
        fiber: acc.fiber + (meal.nutrition?.fiber || 0),
        water: acc.water + 1, // Placeholder for water tracking
      }), {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        fiber: 0,
        water: 0,
      });

      // Create today log object
      const todayLog: DailyLog = {
        id: today,
        date: today,
        calories: {
          consumed: totals.calories,
          goal: userDocument?.calculatedValues?.dailyCalorieGoal || 2000,
          remaining: Math.max(0, (userDocument?.calculatedValues?.dailyCalorieGoal || 2000) - totals.calories),
        },
        nutrition: {
          protein: {
            current: totals.protein,
            goal: userDocument?.calculatedValues?.macros?.protein || 120,
          },
          carbs: {
            current: totals.carbs,
            goal: userDocument?.calculatedValues?.macros?.carbs || 250,
          },
          fats: {
            current: totals.fats,
            goal: userDocument?.calculatedValues?.macros?.fats || 65,
          },
          fiber: {
            current: totals.fiber,
            goal: 25,
          },
        },
        water: {
          glasses: totals.water,
          goal: 8,
        },
        steps: {
          count: 0,
          goal: 10000,
        },
        meals: recentMeals,
      };

      // Calculate streak data
      const streakData = await calculateStreakData(user.uid);

      updateState({
        userDocument,
        streakData,
        recentMeals,
        todayLog,
        achievements: [], // TODO: Implement achievements
        notifications: [], // TODO: Implement notifications
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
    if (!user) {
      throw new Error('Kullanıcı giriş yapmamış');
    }

    try {
      const db = firestore();
      const docRef = await db
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(user.uid)
        .collection('meals')
        .add({
          ...mealData,
          createdAt: firestore.FieldValue.serverTimestamp(),
          userId: user.uid,
        });

      // Get the created document
      const newDoc = await docRef.get();
      const newMeal: MealLog = {
        id: docRef.id,
        ...newDoc.data(),
        createdAt: new Date().toISOString(),
      } as MealLog;

      // Update local state
      updateState({
        recentMeals: [newMeal, ...(state.recentMeals || [])].slice(0, 20), // Keep last 20 meals
      });

      console.log('✅ Meal successfully added to Firebase:', newMeal.id);
      return newMeal;
    } catch (error) {
      console.error('Error adding meal to Firebase:', error);
      const errorMessage = error instanceof Error ? error.message : 'Öğün eklenemedi';
      updateState({ error: errorMessage });
      throw error;
    }
  }, [user, state.recentMeals]);

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

  // Calculate streak data
  const calculateStreakData = useCallback(async (userId: string): Promise<StreakData> => {
    try {
      const today = new Date();
      const weekDays = [false, false, false, false, false, false, false];

      // Check last 7 days for meal logging
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const db = firestore();
        const dayMeals = await db
          .collection(FIREBASE_CONFIG.collections.users)
          .doc(userId)
          .collection('meals')
          .where('date', '==', dateStr)
          .limit(1)
          .get();

        weekDays[6 - i] = !dayMeals.empty;
      }

      // Calculate current streak
      let currentStreak = 0;
      let checkDate = new Date(today);

      while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        const db = firestore();
        const dayMeals = await db
          .collection(FIREBASE_CONFIG.collections.users)
          .doc(userId)
          .collection('meals')
          .where('date', '==', dateStr)
          .limit(1)
          .get();

        if (!dayMeals.empty) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      return {
        currentStreak,
        bestStreak: currentStreak, // TODO: Calculate best streak from history
        weekDays,
      };
    } catch (error) {
      console.error('Error calculating streak data:', error);
      return {
        currentStreak: 0,
        bestStreak: 0,
        weekDays: [false, false, false, false, false, false, false],
      };
    }
  }, []);

  // Update streak data
  const updateStreak = useCallback(async (): Promise<StreakData> => {
    if (!user) throw new Error('User not found');
    return calculateStreakData(user.uid);
  }, [user, calculateStreakData]);

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
    if (!user) return [];

    try {
      const db = firestore();
      const mealsSnapshot = await db
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(user.uid)
        .collection('meals')
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      return mealsSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().createdAt?.toDate(),
          date: doc.data().createdAt?.toDate()?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
          time: doc.data().createdAt?.toDate()?.toTimeString().slice(0, 5) || new Date().toTimeString().slice(0, 5),
        }))
        .sort((a, b) => {
          // En son eklenenler üstte olacak
          const timeA = a.timestamp ? a.timestamp.getTime() : 0;
          const timeB = b.timestamp ? b.timestamp.getTime() : 0;
          return timeB - timeA;
        });
    } catch (error) {
      console.error('Error getting recent meals:', error);
      return [];
    }
  }, [user]);

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