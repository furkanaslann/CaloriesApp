/**
 * CaloriTrack - Dashboard Service
 * Handles all dashboard data operations with Firestore
 * Minimal. Cool. Aesthetic.
 */

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserDocument,
  StreakData,
  DailyLog,
  MealLog,
  ActivityLog,
  Achievement,
  Notification,
  UserProgress,
  DashboardAnalytics,
  WeeklyStats,
  MonthlyStats,
  YearlyStats
} from '@/types/user';
import { FIREBASE_CONFIG } from '@/constants/firebase';
import { NutritionInfo } from '@/types/food';

class DashboardService {
  // Get current user ID
  private getCurrentUserId(): string {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('No authenticated user found');
    }
    return user.uid;
  }

  // Initialize user dashboard data (extends existing user document)
  async initializeDashboardData(userId: string, userData: Partial<UserDocument>): Promise<void> {
    try {
      console.log('Initializing dashboard data for user:', userId);

      const now = new Date();
      const today = this.formatDate(now);

      // Initialize dashboard-specific fields
      const dashboardUpdates: Partial<UserDocument> = {
        progress: userData.progress || {
          currentWeight: userData.profile?.currentWeight || 0,
          startingWeight: userData.profile?.currentWeight || 0,
          goalWeight: userData.goals?.targetWeight || userData.profile?.currentWeight || 0,
          weightLossTotal: 0,
          weightLossToGoal: 0,
          weeklyWeightChange: 0,
          averageWeeklyLoss: 0,
          timeOnApp: 0,
          lastWeightUpdate: today,
        },
        streaks: {
          currentStreak: 0,
          bestStreak: 0,
          weekDays: [false, false, false, false, false, false, false],
          lastActiveDate: undefined,
          streakHistory: [],
        },
        dailyLogs: {},
        achievements: [],
        notifications: [],
        analytics: this.initializeAnalytics(userData.calculatedValues),
        metadata: {
          lastLoginAt: now.toISOString(),
          appVersion: '1.0.0', // Should come from app config
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          locale: 'tr-TR', // Should come from app settings
        },
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      await firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(userId)
        .set(dashboardUpdates, { merge: true });

      console.log('Dashboard data initialized successfully for user:', userId);
    } catch (error) {
      console.error('Error initializing dashboard data:', error);
      throw error;
    }
  }

  // Initialize analytics structure
  private initializeAnalytics(calculatedValues?: any): DashboardAnalytics {
    return {
      weeklyStats: {
        weekStart: this.getWeekStart(new Date()),
        weekEnd: this.getWeekEnd(new Date()),
        totalCalories: 0,
        averageCalories: 0,
        goalAchievementDays: 0,
        streakMaintained: false,
        totalExerciseMinutes: 0,
        averageSteps: 0,
      },
      monthlyStats: {
        month: new Date().toISOString().slice(0, 7), // YYYY-MM
        totalDays: 30,
        activeDays: 0,
        totalCalories: 0,
        averageDailyCalories: 0,
        goalAchievementRate: 0,
        totalExerciseMinutes: 0,
        averageSteps: 0,
        achievementsUnlocked: 0,
      },
      yearlyStats: {
        year: new Date().getFullYear(),
        totalDays: 365,
        activeDays: 0,
        longestStreak: 0,
        totalWeightLoss: 0,
        totalExerciseMinutes: 0,
        averageDailyCalories: 0,
        goalsAchieved: 0,
      },
      progressTrends: [],
      insights: [],
    };
  }

  // Get complete user document with dashboard data
  async getUserDocument(): Promise<UserDocument | null> {
    try {
      const userId = this.getCurrentUserId();

      const doc = await firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(userId)
        .get();

      if (doc.exists) {
        const data = doc.data() as UserDocument;

        // Initialize dashboard data if not present
        if (!data.streaks || !data.dailyLogs) {
          await this.initializeDashboardData(userId, data);
          // Fetch the updated document
          const updatedDoc = await firestore()
            .collection(FIREBASE_CONFIG.collections.users)
            .doc(userId)
            .get();
          return updatedDoc.data() as UserDocument;
        }

        // Cache locally for offline access
        await this.cacheUserData(data);
        return data;
      }

      console.log('No user document found for user:', userId);
      return null;
    } catch (error) {
      console.error('Error getting user document:', error);
      // Try to get cached data
      return await this.getCachedUserData();
    }
  }

  // Update streak data
  async updateStreakData(dateLogged?: string): Promise<StreakData> {
    try {
      const userId = this.getCurrentUserId();
      const today = dateLogged || this.formatDate(new Date());

      const userDocument = await this.getUserDocument();
      if (!userDocument) {
        throw new Error('No user document found');
      }

      const currentStreakData = userDocument.streaks || {
        currentStreak: 0,
        bestStreak: 0,
        weekDays: [false, false, false, false, false, false, false],
        lastActiveDate: undefined,
        streakHistory: [],
      };

      const updatedStreakData = this.calculateStreak(currentStreakData, today);

      // Update Firestore
      await firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(userId)
        .update({
          'streaks': updatedStreakData,
          'metadata.lastLoginAt': new Date().toISOString(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      // Check for new achievements
      await this.checkStreakAchievements(userId, updatedStreakData);

      console.log('Streak data updated successfully:', updatedStreakData);
      return updatedStreakData;
    } catch (error) {
      console.error('Error updating streak data:', error);
      throw error;
    }
  }

  // Calculate streak logic
  private calculateStreak(currentStreakData: StreakData, today: string): StreakData {
    const newStreakData = { ...currentStreakData };
    const todayDate = new Date(today);
    const todayDayOfWeek = todayDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const mondayDayOfWeek = 1; // Monday

    // Convert to 0-6 (Monday = 0)
    const adjustedDayOfWeek = todayDayOfWeek === 0 ? 6 : todayDayOfWeek - 1;

    // Update week days array
    newStreakData.weekDays[adjustedDayOfWeek] = true;

    // Check if this is a consecutive day
    if (newStreakData.lastActiveDate) {
      const lastActive = new Date(newStreakData.lastActiveDate);
      const diffTime = todayDate.getTime() - lastActive.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day - increment streak
        newStreakData.currentStreak += 1;
      } else if (diffDays > 1) {
        // Streak broken - reset
        newStreakData.currentStreak = 1;
      }
      // If diffDays === 0, same day - don't change streak
    } else {
      // First activity - start streak
      newStreakData.currentStreak = 1;
    }

    // Update best streak if current is better
    if (newStreakData.currentStreak > newStreakData.bestStreak) {
      newStreakData.bestStreak = newStreakData.currentStreak;
    }

    // Update last active date
    newStreakData.lastActiveDate = today;

    // Add to streak history
    const streakDayIndex = newStreakData.streakHistory.findIndex(day => day.date === today);
    if (streakDayIndex >= 0) {
      newStreakData.streakHistory[streakDayIndex].completed = true;
    } else {
      newStreakData.streakHistory.push({
        date: today,
        completed: true,
        mealsLogged: 0,
        caloriesGoal: 2000,
        caloriesConsumed: 0,
        waterIntake: 0,
      });
    }

    // Keep only last 30 days in history
    if (newStreakData.streakHistory.length > 30) {
      newStreakData.streakHistory = newStreakData.streakHistory.slice(-30);
    }

    return newStreakData;
  }

  // Create empty daily log structure
  private createEmptyDailyLog(date: string, userDocument: UserDocument): DailyLog {
    return {
      date,
      calories: {
        consumed: 0,
        goal: userDocument.calculatedValues?.dailyCalorieGoal || 2000,
        remaining: userDocument.calculatedValues?.dailyCalorieGoal || 2000,
      },
      nutrition: {
        protein: { current: 0, goal: userDocument.calculatedValues?.macros?.protein || 120 },
        carbs: { current: 0, goal: userDocument.calculatedValues?.macros?.carbs || 250 },
        fats: { current: 0, goal: userDocument.calculatedValues?.macros?.fats || 65 },
      },
      water: {
        glasses: 0,
        goal: 8,
      },
      steps: {
        count: 0,
        goal: 10000,
      },
      meals: [],
      activities: [],
      completed: false,
    };
  }

  // Add meal entry to daily log
  async addMealEntry(mealData: Omit<MealLog, 'id' | 'createdAt'>): Promise<MealLog> {
    try {
      const userId = this.getCurrentUserId();
      const userDocument = await this.getUserDocument();

      if (!userDocument) {
        throw new Error('No user document found');
      }

      const newMeal: MealLog = {
        ...mealData,
        id: this.generateId(),
        createdAt: new Date().toISOString(),
      };

      const today = mealData.date || this.formatDate(new Date());

      // Get or create today's daily log
      const dailyLog = userDocument.dailyLogs?.[today] || this.createEmptyDailyLog(today, userDocument);

      // Add meal to daily log
      dailyLog.meals.push(newMeal);

      // Update nutrition totals
      dailyLog.calories.consumed += newMeal.calories;
      dailyLog.calories.remaining = Math.max(0, dailyLog.calories.goal - dailyLog.calories.consumed);

      dailyLog.nutrition.protein.current += newMeal.nutrition.protein;
      dailyLog.nutrition.carbs.current += newMeal.nutrition.carbohydrates;
      dailyLog.nutrition.fats.current += newMeal.nutrition.fats;

      // Update completion status
      dailyLog.completed = dailyLog.meals.length > 0;

      // Update Firestore
      await firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(userId)
        .update({
          [`dailyLogs.${today}`]: dailyLog,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      // Update streak (logging a meal counts as activity)
      await this.updateStreakData(today);

      console.log('Meal added successfully:', newMeal);
      return newMeal;
    } catch (error) {
      console.error('Error adding meal entry:', error);
      throw error;
    }
  }

  // Update daily statistics
  async updateDailyStats(stats: Partial<DailyStats>, date?: string): Promise<DailyStats> {
    try {
      const userId = this.getCurrentUserId();
      const targetDate = date || this.formatDate(new Date());

      const dashboardData = await this.getUserDashboardData();
      if (!dashboardData) {
        throw new Error('No dashboard data found');
      }

      const existingStats = dashboardData.dailyStats[targetDate] || this.getDefaultDailyStats();
      const updatedStats: DailyStats = { ...existingStats, ...stats, date: targetDate };

      // Update Firestore
      await firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(userId)
        .collection('dashboard')
        .doc('data')
        .update({
          [`dailyStats.${targetDate}`]: updatedStats,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      console.log('Daily stats updated successfully:', updatedStats);
      return updatedStats;
    } catch (error) {
      console.error('Error updating daily stats:', error);
      throw error;
    }
  }

  // Update daily stats when meal is added
  private async updateDailyStatsForMeal(meal: MealEntry): Promise<void> {
    try {
      const dashboardData = await this.getUserDashboardData();
      if (!dashboardData) return;

      const existingStats = dashboardData.dailyStats[meal.date] || this.getDefaultDailyStats();

      // Add meal nutrition to daily totals
      const updatedStats: DailyStats = {
        ...existingStats,
        calories: existingStats.calories + meal.calories,
        remaining: Math.max(0, existingStats.goal - (existingStats.calories + meal.calories)),
        macros: {
          carbs: {
            ...existingStats.macros.carbs,
            current: existingStats.macros.carbs.current + (meal.nutrition?.carbohydrates || 0),
          },
          protein: {
            ...existingStats.macros.protein,
            current: existingStats.macros.protein.current + (meal.nutrition?.protein || 0),
          },
          fat: {
            ...existingStats.macros.fat,
            current: existingStats.macros.fat.current + (meal.nutrition?.fats || 0),
          },
        },
      };

      // Calculate percentage
      updatedStats.percentage = Math.min(100, Math.round((updatedStats.calories / updatedStats.goal) * 100));

      await this.updateDailyStats(updatedStats, meal.date);
    } catch (error) {
      console.error('Error updating daily stats for meal:', error);
    }
  }

  // Get daily stats for a specific date
  async getDailyStats(date?: string): Promise<DailyLog | null> {
    try {
      const targetDate = date || this.formatDate(new Date());
      const userDocument = await this.getUserDocument();

      if (!userDocument || !userDocument.dailyLogs) {
        return null;
      }

      return userDocument.dailyLogs[targetDate] || null;
    } catch (error) {
      console.error('Error getting daily stats:', error);
      return null;
    }
  }

  // Get or create daily stats for a specific date
  async getOrCreateDailyStats(date?: string): Promise<DailyLog> {
    try {
      const targetDate = date || this.formatDate(new Date());
      const userDocument = await this.getUserDocument();

      if (!userDocument) {
        throw new Error('No user document found');
      }

      const existingLog = userDocument.dailyLogs?.[targetDate];
      if (existingLog) {
        return existingLog;
      }

      // Create new daily log
      const newDailyLog = this.createEmptyDailyLog(targetDate, userDocument);

      // Save to Firestore
      const userId = this.getCurrentUserId();
      await firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(userId)
        .update({
          [`dailyLogs.${targetDate}`]: newDailyLog,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      return newDailyLog;
    } catch (error) {
      console.error('Error getting daily stats:', error);
      throw error;
    }
  }

  // Get recent meals
  async getRecentMeals(limit: number = 10): Promise<any[]> {
    try {
      const userDocument = await this.getUserDocument();

      if (!userDocument || !userDocument.dailyLogs) {
        return [];
      }

      return this.extractRecentMeals(userDocument.dailyLogs, limit);
    } catch (error) {
      console.error('Error getting recent meals:', error);
      return [];
    }
  }

  // Check for new achievements based on streak
  private async checkStreakAchievements(userId: string, streakData: StreakData): Promise<void> {
    try {
      const userDocument = await this.getUserDocument();
      if (!userDocument) return;

      const existingAchievements = userDocument.achievements || [];
      const newAchievements: Achievement[] = [];

      // Check for streak milestones
      const streakMilestones = [
        { days: 3, title: 'İlk Adımlar', description: '3 günlük seri tamamlandı!' },
        { days: 7, title: 'Haftalık Başarı', description: '7 günlük seri tamamlandı!' },
        { days: 14, title: 'İki Haftalık İlerleme', description: '14 günlük seri tamamlandı!' },
        { days: 30, title: 'Aylık Zafer', description: '30 günlük seri tamamlandı!' },
      ];

      for (const milestone of streakMilestones) {
        if (streakData.currentStreak === milestone.days) {
          // Check if achievement already exists
          const achievementId = `streak_${milestone.days}`;
          const alreadyUnlocked = existingAchievements.some(a => a.id === achievementId);

          if (!alreadyUnlocked) {
            const achievement: Achievement = {
              id: achievementId,
              title: milestone.title,
              description: milestone.description,
              icon: '🔥',
              unlockedAt: new Date().toISOString(),
              category: 'streak',
              rarity: milestone.days >= 14 ? 'rare' : 'common',
            };

            newAchievements.push(achievement);
          }
        }
      }

      if (newAchievements.length > 0) {
        await this.addAchievements(userId, newAchievements);
      }
    } catch (error) {
      console.error('Error checking streak achievements:', error);
    }
  }

  // Add achievements to user document
  async addAchievements(userId: string, achievements: Achievement[]): Promise<void> {
    try {
      await firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(userId)
        .update({
          achievements: firestore.FieldValue.arrayUnion(...achievements),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      console.log('Achievements added successfully:', achievements);
    } catch (error) {
      console.error('Error adding achievements:', error);
      throw error;
    }
  }

  // Cache user data locally
  private async cacheUserData(data: UserDocument): Promise<void> {
    try {
      await AsyncStorage.setItem('@caloritrack_user_data', JSON.stringify(data));

      // Cache streak data separately for quick access
      if (data.streaks) {
        await AsyncStorage.setItem('@caloritrack_streak_data', JSON.stringify(data.streaks));
      }

      // Cache recent meals from daily logs
      const recentMeals = this.extractRecentMeals(data.dailyLogs);
      await AsyncStorage.setItem('@caloritrack_recent_meals', JSON.stringify(recentMeals));
    } catch (error) {
      console.error('Error caching user data:', error);
    }
  }

  // Get cached user data
  private async getCachedUserData(): Promise<UserDocument | null> {
    try {
      const cachedData = await AsyncStorage.getItem('@caloritrack_user_data');
      if (cachedData) {
        return JSON.parse(cachedData) as UserDocument;
      }
      return null;
    } catch (error) {
      console.error('Error getting cached user data:', error);
      return null;
    }
  }

  // Extract recent meals from daily logs
  private extractRecentMeals(dailyLogs: { [date: string]: DailyLog }, limit: number = 20): any[] {
    const allMeals: any[] = [];
    const sortedDates = Object.keys(dailyLogs).sort((a, b) => b.localeCompare(a)); // Most recent first

    for (const date of sortedDates) {
      const dailyLog = dailyLogs[date];
      if (dailyLog && dailyLog.meals) {
        for (const meal of dailyLog.meals) {
          allMeals.push({
            id: meal.id,
            name: meal.name,
            calories: meal.calories,
            time: meal.time,
            type: this.translateMealType(meal.type),
            date,
            confidence: meal.confidence,
          });
        }
      }
    }

    return allMeals.slice(0, limit);
  }

  // Translate meal type to Turkish
  private translateMealType(type: string): string {
    const translations: { [key: string]: string } = {
      breakfast: 'Kahvaltı',
      lunch: 'Öğle Yemeği',
      dinner: 'Akşam Yemeği',
      snack: 'Atıştırmalık',
    };
    return translations[type] || type;
  }

  // Utility functions
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  private getWeekStart(date: Date): string {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(d.setDate(diff));
    return this.formatDate(monday);
  }

  private getWeekEnd(date: Date): string {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? 0 : 7); // Adjust when day is Sunday
    const sunday = new Date(d.setDate(diff));
    return this.formatDate(sunday);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Export singleton instance
export const dashboardService = new DashboardService();
export default dashboardService;