/**
 * CaloriTrack - Dashboard Hook
 * Custom hook for dashboard data management
 * Minimal. Cool. Aesthetic.
 */

import { FIREBASE_CONFIG } from '@/constants/firebase';
import { useUser } from '@/context/user-context';
import {
  Achievement,
  DailyLog,
  MealLog,
  Notification,
  StreakData,
  UserDocument
} from '@/types/user';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
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
  getRecentMeals: (limit?: number, date?: string) => Promise<any[]>;

  // Actions
  addMeal: (mealData: Omit<MealLog, 'id' | 'createdAt'>) => Promise<MealLog>;
  deleteMeal: (mealId: string) => Promise<void>;
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

  // Real-time listener unsubscribe functions
  const [mealsUnsubscribe, setMealsUnsubscribe] = useState<(() => void) | null>(null);

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

      const userDocument = userDoc.exists() ? userDoc.data() as UserDocument : null;

      // Meals are now handled by real-time listener (setup below in useEffect)
      // We'll calculate todayLog from the current recentMeals state

      // Calculate today's nutrition totals from current recentMeals
      const totals = state.recentMeals.reduce((acc, meal) => ({
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
        meals: state.recentMeals,
        activities: [],
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Calculate streak data
      const streakData = await calculateStreakData(user.uid);

      updateState({
        userDocument,
        streakData,
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
  }, [user, state.recentMeals]); // Added state.recentMeals dependency

  // Refresh dashboard data
  const refreshDashboard = useCallback(async () => {
    if (!user) return;

    try {
      updateState({ isRefreshing: true });
      await initializeDashboard();
    } finally {
      updateState({ isRefreshing: false });
    }
  }, [user, initializeDashboard]);

  // Add meal entry
  const addMeal = useCallback(async (mealData: Omit<MealLog, 'id' | 'createdAt'>): Promise<MealLog> => {
    if (!user) {
      throw new Error('Kullanıcı giriş yapmamış');
    }

    try {
      // Clean undefined values from mealData before sending to Firestore
      const cleanedMealData = JSON.parse(JSON.stringify(mealData));

      const db = firestore();
      const docRef = await db
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(user.uid)
        .collection('meals')
        .add({
          ...cleanedMealData,
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

  // Delete meal entry
  const deleteMeal = useCallback(async (mealId: string): Promise<void> => {
    if (!user) {
      throw new Error('Kullanıcı giriş yapmamış');
    }

    try {
      const db = firestore();

      // Get the meal document before deleting to retrieve its nutrition data
      const mealDoc = await db
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(user.uid)
        .collection('meals')
        .doc(mealId)
        .get();

      if (!mealDoc.exists) {
        throw new Error('Yemek kaydı bulunamadı');
      }

      const mealData = mealDoc.data();

      // Delete the meal document
      await db
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(user.uid)
        .collection('meals')
        .doc(mealId)
        .delete();

      // Update local state - remove the deleted meal from the list
      updateState({
        recentMeals: (state.recentMeals || []).filter(meal => meal.id !== mealId),
      });

      // Refresh dashboard to recalculate daily totals
      await refreshDashboard();

      console.log('✅ Meal successfully deleted from Firebase:', mealId);
    } catch (error) {
      console.error('Error deleting meal from Firebase:', error);
      const errorMessage = error instanceof Error ? error.message : 'Öğün silinemedi';
      updateState({ error: errorMessage });
      throw error;
    }
  }, [user, state.recentMeals, refreshDashboard]);

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
        activities: [],
        water: {
          glasses: 0,
          goal: 8,
        },
        calories: {
          consumed: 0,
          goal: 2000,
          remaining: 2000,
        },
        nutrition: {
          protein: {
            current: 0,
            goal: 120,
          },
          carbs: {
            current: 0,
            goal: 250,
          },
          fats: {
            current: 0,
            goal: 65,
          },
          fiber: {
            current: 0,
            goal: 25,
          },
        },
        steps: {
          count: 0,
          goal: 10000,
        },
        completed: false,
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
        streakHistory: [],
      };
    } catch (error) {
      console.error('Error calculating streak data:', error);
      return {
        currentStreak: 0,
        bestStreak: 0,
        weekDays: [false, false, false, false, false, false, false],
        streakHistory: [],
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

  // Get recent meals - now with optional date filter
  // Note: For today's meals, the real-time listener provides automatic updates
  // This function is mainly for meals-list to get meals on specific dates
  const getRecentMeals = useCallback(async (limit: number = 10, date?: string): Promise<any[]> => {
    if (!user) return [];

    try {
      const db = firestore();
      let query: FirebaseFirestoreTypes.Query = db
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(user.uid)
        .collection('meals');

      // If date is provided, filter by date
      if (date) {
        query = query.where('date', '==', date);
      }

      const mealsSnapshot = await query
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      return mealsSnapshot.docs
        .map((doc: FirebaseFirestoreTypes.DocumentSnapshot) => {
          const data = doc.data();

          // Handle both Firestore Timestamp and regular Date objects for createdAt
          let createdAt: Date;
          if (data?.createdAt) {
            if (typeof data.createdAt.toDate === 'function') {
              createdAt = data.createdAt.toDate();
            } else if (data.createdAt instanceof Date) {
              createdAt = data.createdAt;
            } else if (typeof data.createdAt === 'string') {
              createdAt = new Date(data.createdAt);
            } else {
              createdAt = new Date();
            }
          } else {
            createdAt = new Date();
          }

          // Handle timestamp field as well
          let timestamp: Date | undefined;
          if (data?.timestamp) {
            if (typeof data.timestamp.toDate === 'function') {
              timestamp = data.timestamp.toDate();
            } else if (data.timestamp instanceof Date) {
              timestamp = data.timestamp;
            } else if (typeof data.timestamp === 'string') {
              timestamp = new Date(data.timestamp);
            }
          }

          return {
            id: doc.id,
            ...data,
            timestamp,
            date: createdAt.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
            time: createdAt.toTimeString().slice(0, 5) || new Date().toTimeString().slice(0, 5),
          };
        })
        .sort((a: any, b: any) => {
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

  // Setup real-time listener for today's meals
  useEffect(() => {
    if (!user) {
      // Clean up if user logs out
      if (mealsUnsubscribe) {
        mealsUnsubscribe();
        setMealsUnsubscribe(null);
      }
      updateState({ recentMeals: [] });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    console.log('🔄 Setting up real-time listener for today\'s meals:', today);

    // Clean up existing listener
    if (mealsUnsubscribe) {
      console.log('🧹 Cleaning up existing meals listener');
      mealsUnsubscribe();
    }

    // Setup new real-time listener
    const db = firestore();
    const unsubscribe = db
      .collection(FIREBASE_CONFIG.collections.users)
      .doc(user.uid)
      .collection('meals')
      .where('date', '==', today)
      .onSnapshot((snapshot) => {
        console.log('📡 Meals snapshot received:', snapshot.docs.length, 'meals');

        const meals = snapshot.docs.map(doc => {
          const data = doc.data();

          // Handle both Firestore Timestamp and regular Date objects
          let timestamp: Date | undefined;
          if (data?.timestamp) {
            if (typeof data.timestamp.toDate === 'function') {
              timestamp = data.timestamp.toDate();
            } else if (data.timestamp instanceof Date) {
              timestamp = data.timestamp;
            } else if (typeof data.timestamp === 'string') {
              timestamp = new Date(data.timestamp);
            }
          }

          return {
            id: doc.id,
            ...data,
            timestamp,
          };
        }).sort((a, b) => {
          // Client-side sorting by timestamp (most recent first)
          const timeA = a.timestamp ? a.timestamp.getTime() : 0;
          const timeB = b.timestamp ? b.timestamp.getTime() : 0;
          return timeB - timeA;
        });

        console.log('✅ Meals updated in state:', meals.length);
        updateState({ recentMeals: meals });
      }, (error) => {
        console.error('❌ Error in meals listener:', error);
      });

    // Store unsubscribe function
    setMealsUnsubscribe(() => unsubscribe);
    console.log('✅ Real-time meals listener setup complete');

    // Cleanup on unmount or user change
    return () => {
      console.log('🧹 Cleaning up meals listener');
      if (mealsUnsubscribe) {
        mealsUnsubscribe();
      }
    };
  }, [user]); // Only depend on user, so listener recreates when user changes

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
    deleteMeal,
    updateDailyLog,
    updateStreak,

    // Utilities
    refreshStreak,
    clearError,
    formatDateForDisplay,
    calculateProgressPercentage,
  };
}
export default useDashboard;