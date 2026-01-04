/**
 * CaloriTrack - Dashboard Progress Screen
 * Minimal. Cool. Aesthetic.
 */

import BottomNavigation from '@/components/navigation/BottomNavigation';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDashboard } from '@/hooks/use-dashboard';

const { width } = Dimensions.get('window');

const ProgressDashboardScreen = () => {
  // Use dashboard hook for data management
  const {
    dashboardData,
    isLoading,
    isRefreshing,
    error,
    streakData,
    todayStats,
    achievements,
    refreshDashboard,
  } = useDashboard();

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
      danger: '#EF4444',
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

  // Generate weekly stats from dashboard data
  const generateWeeklyStats = () => {
    const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    const today = new Date();
    const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1; // Monday = 0

    return days.map((day, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - currentDayIndex + index);
      const dateStr = date.toISOString().split('T')[0];

      // Get data from dashboard if available
      const dayData = dashboardData?.dailyStats?.[dateStr];
      return {
        day,
        calories: dayData?.calories || 0,
        goal: dayData?.goal || 2000,
      };
    });
  };

  const weeklyStats = generateWeeklyStats();

  // Get streak-related achievements
  const streakAchievements = achievements?.filter(a => a.category === 'streak') || [];

  const monthlyGoals = [
    {
      title: 'Mevcut Seri',
      current: streakData?.currentStreak || 0,
      goal: Math.max((streakData?.bestStreak || 0) + 1, 7),
      unit: 'gün',
      color: theme.colors.primary
    },
    {
      title: 'En İyi Seri',
      current: streakData?.bestStreak || 0,
      goal: 30,
      unit: 'gün',
      color: theme.colors.success
    },
    {
      title: 'Bu Hafta Aktif Gün',
      current: weeklyStats.filter(d => d.calories > 0).length,
      goal: 7,
      unit: 'gün',
      color: theme.colors.warning
    },
  ];

  // Dynamic styles using updated theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.semanticColors.background.primary,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: theme.spacing['2xl'],
    },
    header: {
      paddingHorizontal: theme.spacing['2xl'],
      paddingTop: theme.spacing['4xl'],
      paddingBottom: theme.spacing['2xl'],
    },
    title: {
      fontSize: theme.textStyles.onboardingTitle?.fontSize || 30,
      fontWeight: (theme.textStyles.onboardingTitle?.fontWeight || '600') as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: theme.textStyles.onboardingSubtitle?.fontSize || 18,
      fontWeight: (theme.textStyles.onboardingSubtitle?.fontWeight || '400') as TextStyle['fontWeight'],
      color: theme.semanticColors.text.secondary,
    },
    content: {
      paddingHorizontal: theme.spacing['2xl'],
    },
    section: {
      marginBottom: theme.spacing['2xl'],
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.lg,
    },
    statsCard: {
      backgroundColor: theme.semanticColors.background.primary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    weeklyChartContainer: {
      marginBottom: theme.spacing.lg,
    },
    chartHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    chartTitle: {
      fontSize: 16,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
    },
    chartSubtitle: {
      fontSize: 14,
      color: theme.semanticColors.text.secondary,
    },
    weeklyChart: {
      height: 120,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    dayBar: {
      flex: 1,
      alignItems: 'center',
      marginHorizontal: 2,
    },
    bar: {
      width: 20,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.sm,
      marginBottom: theme.spacing.sm,
    },
    barGoal: {
      width: 20,
      height: 2,
      backgroundColor: theme.colors.warning,
      marginBottom: theme.spacing.sm,
    },
    dayLabel: {
      fontSize: 10,
      color: theme.semanticColors.text.tertiary,
    },
    goalProgress: {
      marginBottom: theme.spacing.md,
    },
    goalCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.semanticColors.background.primary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    goalInfo: {
      flex: 1,
    },
    goalTitle: {
      fontSize: 16,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.sm,
    },
    goalDescription: {
      fontSize: 14,
      color: theme.semanticColors.text.secondary,
    },
    progressBar: {
      height: 8,
      backgroundColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.sm,
      overflow: 'hidden',
      marginBottom: theme.spacing.sm,
    },
    progressFill: {
      height: '100%',
      borderRadius: theme.borderRadius.sm,
    },
    progressText: {
      fontSize: 12,
      color: theme.semanticColors.text.secondary,
      textAlign: 'right',
    },
    achievementCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.semanticColors.background.primary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    achievementIcon: {
      fontSize: 24,
      marginRight: theme.spacing.md,
    },
    achievementInfo: {
      flex: 1,
    },
    achievementTitle: {
      fontSize: 14,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: 2,
    },
    achievementDescription: {
      fontSize: 12,
      color: theme.semanticColors.text.secondary,
    },

    // Loading styles
    loadingContainer: {
      flex: 1,
      backgroundColor: theme.semanticColors.background.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: theme.semanticColors.text.secondary,
      fontWeight: '500',
    },
  });

  const renderWeeklyChart = () => {
    const maxCalories = Math.max(...weeklyStats.map(day => Math.max(day.calories, day.goal)));

    return (
      <View style={styles.weeklyChart}>
        {weeklyStats.map((day, index) => {
          const height = (day.calories / maxCalories) * 100;
          const goalHeight = (day.goal / maxCalories) * 100;
          const isOverGoal = day.calories > day.goal;

          return (
            <View key={index} style={styles.dayBar}>
              <View
                style={[
                  styles.bar,
                  {
                    height: height,
                    backgroundColor: isOverGoal ? theme.colors.warning : theme.colors.success,
                  }
                ]}
              />
              <View style={[styles.barGoal, { marginTop: -height - 4 }]} />
              <Text style={styles.dayLabel}>{day.day}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  // Show loading screen
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>İlerleme verileri yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshDashboard}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Detaylı Analiz</Text>
          <Text style={styles.subtitle}>İlerlemenizi takip edin</Text>
        </View>

        <View style={styles.content}>
          {/* Weekly Calorie Chart */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Haftalık Kalori Grafiği</Text>
            <View style={styles.statsCard}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Bu Hafta</Text>
                <Text style={styles.chartSubtitle}>Hedef: 2000 kcal/gün</Text>
              </View>
              {renderWeeklyChart()}
            </View>
          </View>

          {/* Monthly Goals */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Aylık Hedefler</Text>
            {monthlyGoals.map((goal, index) => (
              <View key={index} style={styles.goalCard}>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalDescription}>
                    {goal.current} / {goal.goal} {goal.unit}
                  </Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${(goal.current / goal.goal) * 100}%`,
                          backgroundColor: goal.color,
                        }
                      ]}
                    />
                  </View>
                </View>
                <Text style={styles.progressText}>
                  {Math.round((goal.current / goal.goal) * 100)}%
                </Text>
              </View>
            ))}
          </View>

          {/* Achievements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Başarılar</Text>
            {streakAchievements.length > 0 ? (
              streakAchievements.map((achievement, index) => (
                <TouchableOpacity key={index} style={styles.achievementCard}>
                  <Text style={styles.achievementIcon}>
                    {achievement.category === 'streak' ? '🔥' : '🏆'}
                  </Text>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementDescription}>{achievement.description}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.statsCard}>
                <Text style={styles.chartSubtitle}>Henüz bir kazanım bulunmuyor. İlk başarıyı kazanmak için yemek kaydetmeye başla!</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeRoute="/dashboard/progress" />
    </SafeAreaView>
  );
};

export default ProgressDashboardScreen;