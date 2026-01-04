/**
 * CaloriTrack - Dashboard Index Screen
 * Minimal. Cool. Aesthetic.
 * Figma Design: https://www.figma.com/design/V4OjFZYz1hhZdeWSgZyYtu/Calories-Pages
 */

import StreakCard from '@/components/dashboard/streak-card';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import { FIREBASE_CONFIG } from '@/constants/firebase';
import { BORDER_RADIUS, COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useUser } from '@/context/user-context';
import { useDashboard } from '@/hooks/use-dashboard';
import { Ionicons } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const FIGMA_IMAGES = {
  dashboard1: "https://www.figma.com/api/mcp/asset/5e0fd8f8-d3ba-4525-a279-ebf1876e3af1",
  dashboard2: "https://www.figma.com/api/mcp/asset/68ec4c2b-71d3-4d5a-b883-6ff06dc92303",
};

const DashboardIndexScreen = () => {
  const router = useRouter();
  const { userData, user, isLoading: userLoading, isOnboardingCompleted, refreshUserData } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [waterCount, setWaterCount] = useState(0); // Su sayacı için state

  // Function to get fresh user data directly from Firestore
  const getUserData = async () => {
    if (!user) return null;
    try {
      const doc = await firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(user.uid)
        .get();

      if (doc.exists()) {
        return doc.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  };

  // Use dashboard hook for data management
  const {
    userDocument,
    isLoading: dashboardLoading,
    isRefreshing,
    error,
    streakData,
    todayLog,
    recentMeals = [],
    refreshDashboard,
    clearError,
    formatDateForDisplay,
  } = useDashboard();

  const [isChecking, setIsChecking] = useState(true);
  const [hasCheckedOnce, setHasCheckedOnce] = useState(false);

  // Dashboard access verification - simplified (routing is handled by _layout.tsx)
  useEffect(() => {
    const verifyDashboardAccess = async () => {
      // Wait for user data to be available
      if (userLoading) {
        console.log('⏳ Dashboard: User data still loading...');
        return;
      }

      // _layout.tsx handles routing, so we just wait for user to be authenticated
      if (!user) {
        console.log('⏳ Dashboard: Waiting for user authentication...');
        return;
      }

      console.log('🔍 Dashboard: Verifying user access for:', user.uid);

      // Check if user has completed onboarding
      if (userData?.onboardingCompleted === true) {
        console.log('✅ Dashboard: User has completed onboarding - access granted');
        console.log('👋 Welcome back:', userData.profile?.name || 'User');
        setIsLoading(false);
        setHasCheckedOnce(true);
        setIsChecking(false);
        return;
      }

      // If userData hasn't loaded yet, wait a bit more
      if (!userData) {
        console.log('⏳ Dashboard: Waiting for userData to load...');
        return;
      }

      // If we reach here, user is authenticated but onboarding not completed
      // _layout.tsx will handle the redirect
      console.log('⚠️ Dashboard: Onboarding not completed, _layout will handle redirect');
      setIsLoading(false);
      setIsChecking(false);
    };

    verifyDashboardAccess();
  }, [userLoading, user, userData]); // Added userData to dependencies

  // Get user display name with fallback
  const getUserDisplayName = () => {
    if (userData?.profile?.name) {
      return userData.profile.name;
    }
    if (user?.displayName) {
      return user.displayName;
    }
    if (user?.email) {
      return user.email.split('@')[0]; // Use email prefix as fallback
    }
    return 'Kullanıcı'; // Final fallback
  };

  const userName = getUserDisplayName();
  const userInitial = userName.charAt(0).toUpperCase();

  // Create theme object that matches expected structure
  const theme = {
    semanticColors: {
      background: { primary: COLORS.background },
      text: {
        primary: COLORS.textPrimary,
        secondary: COLORS.textSecondary,
        tertiary: COLORS.textTertiary,
        onPrimary: '#FFFFFF'
      },
      border: { primary: COLORS.border },
      onPrimary: '#FFFFFF',
    },
    colors: {
      primary: COLORS.primary,
      gradientStart: COLORS.primary,
      gradientEnd: '#EC4899',
      success: '#10B981',
      warning: '#F59E0B',
      info: '#3B82F6',
    },
    textStyles: {
      onboardingHero: { fontSize: TYPOGRAPHY.fontSizes['4xl'] },
      onboardingTitle: { fontSize: TYPOGRAPHY.fontSizes['3xl'], fontWeight: '600' },
      onboardingSubtitle: { fontSize: TYPOGRAPHY.fontSizes['xl'], fontWeight: '500' },
      onboardingDescription: { fontSize: TYPOGRAPHY.fontSizes.base },
    },
    spacing: {
      ...SPACING,
      sm: SPACING[2],
      md: SPACING[3],
      lg: SPACING[4],
      xl: SPACING[5],
      '2xl': SPACING[6],
      '4xl': SPACING[12],
    },
    borderRadius: BORDER_RADIUS,
    shadows: SHADOWS,
    coloredShadows: { gradient: SHADOWS.lg },
  };

  // Get data from dashboard hook or use defaults
  const dailyStats = todayLog || {
    calories: {
      consumed: 0,
      goal: userData?.calculatedValues?.dailyCalorieGoal || 2000,
      remaining: userData?.calculatedValues?.dailyCalorieGoal || 2000,
    },
    nutrition: {
      protein: { current: 0, goal: userData?.calculatedValues?.macros?.protein || 120 },
      carbs: { current: 0, goal: userData?.calculatedValues?.macros?.carbs || 250 },
      fats: { current: 0, goal: userData?.calculatedValues?.macros?.fats || 65 },
    },
    water: {
      glasses: 0,
      goal: 8,
    },
    steps: {
      count: 0,
      goal: 10000,
    },
  };

  // Dynamic styles using updated theme - Figma Design inspired
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    scrollView: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    content: {
      paddingBottom: 120, // Space for bottom nav
    },

    // Streak Card Container
    streakContainer: {
      paddingHorizontal: 24,
      marginTop: 24,
      marginBottom: 8,
    },

    // Header Section - Figma style
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 24,
      backgroundColor: '#FFFFFF',
    },
    greetingSection: {
      flex: 1,
    },
    greetingText: {
      fontSize: 16,
      color: '#64748B',
      marginBottom: 4,
    },
    userName: {
      fontSize: 32,
      fontWeight: '700',
      color: '#1E293B',
      lineHeight: 38,
    },
    headerActions: {
      flexDirection: 'row',
      gap: 12,
    },
    notificationButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#F1F5F9',
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      overflow: 'hidden',
      backgroundColor: '#7C3AED',
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileInitial: {
      fontSize: 18,
      fontWeight: '700',
      color: '#FFFFFF',
    },

    
    // Summary Card Section - Modern progress card
    summarySection: {
      paddingHorizontal: 24,
      marginBottom: 32,
    },
    summaryCard: {
      borderRadius: 20,
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
      minHeight: 200,
    },
    summaryBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 20,
    },
    summaryContent: {
      flex: 1,
      zIndex: 2,
    },
    summaryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    summaryTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    summarySubtitle: {
      fontSize: 14,
      color: '#FFFFFF',
      opacity: 0.8,
      marginBottom: 20,
      lineHeight: 20,
    },
    summaryProgress: {
      marginBottom: 20,
    },
    progressText: {
      fontSize: 32,
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: 8,
    },
    progressLabel: {
      fontSize: 14,
      color: '#FFFFFF',
      opacity: 0.8,
    },
    progressBarContainer: {
      height: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: 16,
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: '#FFFFFF',
      borderRadius: 4,
    },

    // Macro Progress Bars
    macroProgressSection: {
      marginTop: 20,
      marginBottom: 16,
    },
    macroItem: {
      marginBottom: 16,
    },
    macroHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    macroName: {
      fontSize: 14,
      fontWeight: '500',
      color: '#FFFFFF',
      opacity: 0.9,
    },
    macroValues: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    macroProgressBar: {
      height: 6,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 3,
      overflow: 'hidden',
    },
    macroProgressFill: {
      height: '100%',
      borderRadius: 3,
    },

    // Quick Stats Section - Horizontal scroll cards
    quickStatsSection: {
      marginBottom: 32,
    },
    quickStatsTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#1E293B',
      paddingHorizontal: 24,
      marginBottom: 16,
    },
    quickStatsContainer: {
      paddingLeft: 24,
    },
    quickStatsScroll: {
      flexDirection: 'row',
      gap: 16,
    },
    quickStatCard: {
      width: 160,
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: '#E2E8F0',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    quickStatIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    quickStatValue: {
      fontSize: 24,
      fontWeight: '700',
      color: '#1E293B',
      marginBottom: 4,
    },
    quickStatLabel: {
      fontSize: 14,
      color: '#64748B',
      textAlign: 'center',
    },

    // Detailed Stats Section - Full width cards
    detailedStatsSection: {
      paddingHorizontal: 24,
      marginBottom: 32,
    },
    detailedStatsTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#1E293B',
      marginBottom: 16,
    },
    detailedStatCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#E2E8F0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    detailedStatHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    detailedStatLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    detailedStatIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    detailedStatInfo: {
      flex: 1,
    },
    detailedStatTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1E293B',
      marginBottom: 2,
    },
    detailedStatSubtitle: {
      fontSize: 14,
      color: '#64748B',
    },
    detailedStatAction: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    waterControls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    waterButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#EBF8FF',
    },
    waterButtonPlus: {
      backgroundColor: '#EBF8FF',
    },
    waterButtonMinus: {
      backgroundColor: '#EBF8FF',
    },
    detailedStatProgress: {
      marginBottom: 12,
    },
    detailedStatNumbers: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    detailedStatCurrent: {
      fontSize: 20,
      fontWeight: '700',
      color: '#1E293B',
    },
    detailedStatGoal: {
      fontSize: 14,
      color: '#64748B',
    },
    progressBar: {
      height: 8,
      backgroundColor: '#F1F5F9',
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
    },

    // Recent Meals Section - Modern list
    recentMealsSection: {
      paddingHorizontal: 24,
      marginBottom: 32,
    },
    recentMealsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    recentMealsTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#1E293B',
    },
    seeAllButton: {
      fontSize: 14,
      color: '#7C3AED',
      fontWeight: '500',
    },
    mealCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#E2E8F0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03,
      shadowRadius: 4,
      elevation: 1,
    },
    mealIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: '#FEF3C7',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    mealContent: {
      flex: 1,
    },
    mealName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1E293B',
      marginBottom: 4,
    },
    mealMeta: {
      fontSize: 14,
      color: '#64748B',
    },
    mealCalories: {
      fontSize: 16,
      fontWeight: '700',
      color: '#7C3AED',
    },
    mealNutrition: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 4,
    },
    nutritionText: {
      fontSize: 12,
      color: '#64748B',
      backgroundColor: '#F1F5F9',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },

    // Empty State
    emptyState: {
      alignItems: 'center',
      paddingVertical: 40,
      paddingHorizontal: 24,
    },
    emptyStateTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1E293B',
      marginTop: 16,
      marginBottom: 8,
    },
    emptyStateSubtitle: {
      fontSize: 14,
      color: '#64748B',
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 20,
    },
    addFirstMealButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#7C3AED',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 12,
      gap: 8,
    },
    addFirstMealText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#FFFFFF',
    },

    // Quick Add Section
    quickAddSection: {
      paddingHorizontal: 24,
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#1E293B',
      marginBottom: 16,
    },
    quickAddContainer: {
      flexDirection: 'row',
      gap: 12,
      paddingRight: 24,
    },
    quickAddItem: {
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: '#E2E8F0',
      minWidth: 80,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
    quickAddEmoji: {
      fontSize: 24,
      marginBottom: 8,
    },
    quickAddName: {
      fontSize: 12,
      fontWeight: '500',
      color: '#1E293B',
      textAlign: 'center',
    },

    // Loading screen styles
    loadingContainer: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingContent: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: COLORS.textSecondary,
      fontWeight: '500',
    },
  });

  // Show error if any
  if (error && !isLoading && !isChecking) {
    Alert.alert('Hata', error, [
      { text: 'Yeniden Dene', onPress: refreshDashboard },
      { text: 'İptal', onPress: clearError },
    ]);
  }

  // Show loading screen only during initial check or when actually loading dashboard data
  if ((isChecking && !hasCheckedOnce) || (isLoading && !hasCheckedOnce)) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>
            {isChecking ? 'Giriş Kontrol Ediliyor...' : 'Dashboard Yükleniyor...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshDashboard}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        <View style={styles.content}>
          {/* Header Section - Figma style */}
          <View style={styles.header}>
            <View style={styles.greetingSection}>
              <Text style={styles.greetingText}>Merhaba 👋</Text>
              <Text style={styles.userName}>{userName}</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications-outline" size={22} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileButton}>
                <Text style={styles.profileInitial}>{userInitial}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Minimalist Streak Card - Below Header */}
          <View style={styles.streakContainer}>
            <StreakCard
              currentStreak={streakData?.currentStreak || 0}
              bestStreak={streakData?.bestStreak || 0}
              weekDays={streakData?.weekDays || [false, false, false, false, false, false, false]}
              onPress={() => router.push('/dashboard/progress')}
            />
          </View>

          {/* Summary Card - Modern progress card */}
          <View style={styles.summarySection}>
            <View style={styles.summaryCard}>
              {/* Gradient Background */}
              <View
                style={[
                  styles.summaryBackground,
                  {
                    backgroundColor: '#7C3AED',
                    shadowColor: '#7C3AED',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 12,
                    elevation: 8,
                  }
                ]}
              />

              <View style={styles.summaryContent}>
                <View style={styles.summaryHeader}>
                  <View>
                    <Text style={styles.summaryTitle}>Günlük Özet</Text>
                  </View>
                  <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal" size={20} color="#FFFFFF" opacity={0.8} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.summarySubtitle}>
                  Bugünkü kalori hedefine ulaşmaya yakınsın!
                </Text>

                <View style={styles.summaryProgress}>
                  <Text style={styles.progressText}>
                    {Math.round((dailyStats.calories.consumed / dailyStats.calories.goal) * 100)}%
                  </Text>
                  <Text style={styles.progressLabel}>
                    {dailyStats.calories.consumed} / {dailyStats.calories.goal} kalori
                  </Text>

                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${Math.min((dailyStats.calories.consumed / dailyStats.calories.goal) * 100, 100)}%`
                        }
                      ]}
                    />
                  </View>
                </View>

                {/* Macro Progress Bars */}
                <View style={styles.macroProgressSection}>
                  {/* Karbonhidrat */}
                  <View style={styles.macroItem}>
                    <View style={styles.macroHeader}>
                      <Text style={styles.macroName}>Karbonhidrat</Text>
                      <Text style={styles.macroValues}>{dailyStats.nutrition.carbs.current}g / {dailyStats.nutrition.carbs.goal}g</Text>
                    </View>
                    <View style={styles.macroProgressBar}>
                      <View
                        style={[
                          styles.macroProgressFill,
                          {
                            width: `${Math.min((dailyStats.nutrition.carbs.current / dailyStats.nutrition.carbs.goal) * 100, 100)}%`,
                            backgroundColor: '#F59E0B'
                          }
                        ]}
                      />
                    </View>
                  </View>

                  {/* Protein */}
                  <View style={styles.macroItem}>
                    <View style={styles.macroHeader}>
                      <Text style={styles.macroName}>Protein</Text>
                      <Text style={styles.macroValues}>{dailyStats.nutrition.protein.current}g / {dailyStats.nutrition.protein.goal}g</Text>
                    </View>
                    <View style={styles.macroProgressBar}>
                      <View
                        style={[
                          styles.macroProgressFill,
                          {
                            width: `${Math.min((dailyStats.nutrition.protein.current / dailyStats.nutrition.protein.goal) * 100, 100)}%`,
                            backgroundColor: '#10B981'
                          }
                        ]}
                      />
                    </View>
                  </View>

                  {/* Yağ */}
                  <View style={styles.macroItem}>
                    <View style={styles.macroHeader}>
                      <Text style={styles.macroName}>Yağ</Text>
                      <Text style={styles.macroValues}>{dailyStats.nutrition.fats.current}g / {dailyStats.nutrition.fats.goal}g</Text>
                    </View>
                    <View style={styles.macroProgressBar}>
                      <View
                        style={[
                          styles.macroProgressFill,
                          {
                            width: `${Math.min((dailyStats.nutrition.fats.current / dailyStats.nutrition.fats.goal) * 100, 100)}%`,
                            backgroundColor: '#EF4444'
                          }
                        ]}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Stats Section - Horizontal scroll */}
          <View style={styles.quickStatsSection}>
            <Text style={styles.quickStatsTitle}>Hızlı İstatistikler</Text>
            <View style={styles.quickStatsContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.quickStatsScroll}
              >
                {/* Water Quick Stat */}
                <View style={styles.quickStatCard}>
                  <View style={[styles.quickStatIcon, { backgroundColor: '#EBF8FF' }]}>
                    <Ionicons name="water" size={24} color="#3B82F6" />
                  </View>
                  <Text style={styles.quickStatValue}>{dailyStats.water.glasses}</Text>
                  <Text style={styles.quickStatLabel}>Bardak Su</Text>
                </View>

                {/* Steps Quick Stat */}
                <View style={styles.quickStatCard}>
                  <View style={[styles.quickStatIcon, { backgroundColor: '#ECFDF5' }]}>
                    <Ionicons name="walk" size={24} color="#10B981" />
                  </View>
                  <Text style={styles.quickStatValue}>{(dailyStats.steps.count / 1000).toFixed(1)}k</Text>
                  <Text style={styles.quickStatLabel}>Adım</Text>
                </View>

                {/* Remaining Calories Quick Stat */}
                <View style={styles.quickStatCard}>
                  <View style={[styles.quickStatIcon, { backgroundColor: '#FEF3C7' }]}>
                    <Ionicons name="time" size={24} color="#F59E0B" />
                  </View>
                  <Text style={styles.quickStatValue}>{dailyStats.calories.remaining}</Text>
                  <Text style={styles.quickStatLabel}>Kalan Kalori</Text>
                </View>
              </ScrollView>
            </View>
          </View>

          {/* Detailed Stats Section */}
          <View style={styles.detailedStatsSection}>
            <Text style={styles.detailedStatsTitle}>Detaylı İstatistikler</Text>

            {/* Calories Card */}
            <View style={styles.detailedStatCard}>
              <View style={styles.detailedStatHeader}>
                <View style={styles.detailedStatLeft}>
                  <View style={[styles.detailedStatIcon, { backgroundColor: '#F3E8FF' }]}>
                    <Ionicons name="flame" size={20} color="#7C3AED" />
                  </View>
                  <View style={styles.detailedStatInfo}>
                    <Text style={styles.detailedStatTitle}>Kalori Hedefi</Text>
                    <Text style={styles.detailedStatSubtitle}>Günlük hedefin</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.detailedStatAction, { backgroundColor: '#F3E8FF' }]}
                  onPress={() => router.push('/dashboard/camera')}
                >
                  <Ionicons name="add" size={18} color="#7C3AED" />
                </TouchableOpacity>
              </View>

              <View style={styles.detailedStatProgress}>
                <View style={styles.detailedStatNumbers}>
                  <Text style={styles.detailedStatCurrent}>{dailyStats.calories.consumed}</Text>
                  <Text style={styles.detailedStatGoal}>/ {dailyStats.calories.goal} kcal</Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${(dailyStats.calories.consumed / dailyStats.calories.goal) * 100}%`,
                        backgroundColor: '#7C3AED'
                      }
                    ]}
                  />
                </View>
              </View>
            </View>

            {/* Water Card */}
            <View style={styles.detailedStatCard}>
              <View style={styles.detailedStatHeader}>
                <View style={styles.detailedStatLeft}>
                  <View style={[styles.detailedStatIcon, { backgroundColor: '#EBF8FF' }]}>
                    <Ionicons name="water" size={20} color="#3B82F6" />
                  </View>
                  <View style={styles.detailedStatInfo}>
                    <Text style={styles.detailedStatTitle}>Su Tüketimi</Text>
                    <Text style={styles.detailedStatSubtitle}>Hidrasyon takibi</Text>
                  </View>
                </View>
                <View style={styles.waterControls}>
                  {waterCount > 0 && (
                    <TouchableOpacity
                      style={[styles.waterButton, styles.waterButtonMinus]}
                      onPress={() => setWaterCount(waterCount - 1)}
                    >
                      <Ionicons name="remove" size={16} color="#3B82F6" />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.waterButton, styles.waterButtonPlus]}
                    onPress={() => setWaterCount(waterCount + 1)}
                  >
                    <Ionicons name="add" size={18} color="#3B82F6" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.detailedStatProgress}>
                <View style={styles.detailedStatNumbers}>
                  <Text style={styles.detailedStatCurrent}>{waterCount}</Text>
                  <Text style={styles.detailedStatGoal}>/ {dailyStats.water.goal} bardak</Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${(waterCount / dailyStats.water.goal) * 100}%`,
                        backgroundColor: '#3B82F6'
                      }
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Food Logging Section */}
          <View style={styles.recentMealsSection}>
            <View style={styles.recentMealsHeader}>
              <Text style={styles.recentMealsTitle}>Bugünün Yiyecekleri</Text>
              <TouchableOpacity onPress={() => router.push('/dashboard/meals-list')}>
                <Text style={styles.seeAllButton}>Tümünü Gör</Text>
              </TouchableOpacity>
            </View>

            {recentMeals.length > 0 ? (
              recentMeals.map((meal) => (
                <TouchableOpacity key={meal.id} style={styles.mealCard}>
                  <View style={styles.mealIconContainer}>
                    <Ionicons
                      name={meal.type === 'Kahvaltı' ? 'sunny-outline' : meal.type === 'Öğle Yemeği' ? 'partly-sunny-outline' : meal.type === 'Akşam Yemeği' ? 'moon-outline' : 'nutrition-outline'}
                      size={24}
                      color="#F59E0B"
                    />
                  </View>
                  <View style={styles.mealContent}>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <Text style={styles.mealMeta}>{meal.time} • {meal.type}</Text>
                    {meal.nutrition && (
                      <View style={styles.mealNutrition}>
                        <Text style={styles.nutritionText}>P: {meal.nutrition.protein}g</Text>
                        <Text style={styles.nutritionText}>K: {meal.nutrition.carbohydrates}g</Text>
                        <Text style={styles.nutritionText}>Y: {meal.nutrition.fats}g</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="restaurant-outline" size={48} color="#CBD5E1" />
                <Text style={styles.emptyStateTitle}>Henüz yiyecek eklenmedi</Text>
                <Text style={styles.emptyStateSubtitle}>
                  Fotoğraf çekerek veya manuel ekleyerek başlayın
                </Text>
                <TouchableOpacity
                  style={styles.addFirstMealButton}
                  onPress={() => router.push('/dashboard/camera')}
                >
                  <Ionicons name="camera" size={20} color="#FFFFFF" />
                  <Text style={styles.addFirstMealText}>İlk Yiyeceği Ekle</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Quick Add Food Section */}
          <View style={styles.quickAddSection}>
            <Text style={styles.sectionTitle}>Hızlı Ekle</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.quickAddContainer}>
                {['🍎 Elma', '🥗 Salata', '🍗 Tavuk', '🥛 Yoğurt', '🍌 Muz'].map((food, index) => (
                  <TouchableOpacity key={index} style={styles.quickAddItem}>
                    <Text style={styles.quickAddEmoji}>{food.split(' ')[0]}</Text>
                    <Text style={styles.quickAddName}>{food.split(' ')[1]}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeRoute="/dashboard" />
    </SafeAreaView>
  );
};

export default DashboardIndexScreen;