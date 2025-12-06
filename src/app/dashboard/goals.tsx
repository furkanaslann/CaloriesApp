/**
 * CaloriTrack - Dashboard Goals Screen
 * Minimal. Cool. Aesthetic.
 */

import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme';
import { useUser } from '@/context/user-context';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextStyle,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const GoalsDashboardScreen = () => {
  const { userData, user, updateUserGoals } = useUser();
  const [loading, setLoading] = useState(false);
  const [activeGoals, setActiveGoals] = useState([]);

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

  // Calculate goals progress from user data
  useEffect(() => {
    const calculateGoalsProgress = () => {
      if (!userData) return;

      const goals = [];

      // Weight goal
      if (userData.goals?.targetWeight && userData.profile?.currentWeight) {
        const targetWeight = userData.goals.targetWeight;
        const currentWeight = userData.profile.currentWeight;
        const startingWeight = userData.progress?.startingWeight || currentWeight;

        let progress = 0;
        const totalGoal = Math.abs(startingWeight - targetWeight);
        const currentProgress = Math.abs(startingWeight - currentWeight);

        if (totalGoal > 0) {
          progress = Math.min((currentProgress / totalGoal) * 100, 100);
        }

        goals.push({
          id: 'weight',
          title: userData.goals.primaryGoal === 'weight_loss' ? 'Kilo Verme' :
                 userData.goals.primaryGoal === 'muscle_gain' ? 'Kilo Alma' : 'Kilo Koruma',
          target: `${targetWeight} kg`,
          current: `${currentWeight} kg`,
          progress: Math.round(progress),
          unit: 'kg',
          deadline: userData.goals?.timeline || 'Hedeflenen Tarih',
          category: 'weight',
          icon: '⚖️',
          color: userData.goals.primaryGoal === 'weight_loss' ? theme.colors.danger :
                 userData.goals.primaryGoal === 'muscle_gain' ? theme.colors.success : theme.colors.primary
        });
      }

      // Daily calorie goal
      if (userData.calculatedValues?.dailyCalorieGoal) {
        const dailyGoal = userData.calculatedValues.dailyCalorieGoal;
        // Assume consumed calories for demo (in real app, get from today's food logs)
        const consumed = 0; // This would come from today's logs
        const progress = Math.min((consumed / dailyGoal) * 100, 100);

        goals.push({
          id: 'calories',
          title: 'Günlük Kalori',
          target: `${dailyGoal}`,
          current: `${consumed}`,
          progress: Math.round(progress),
          unit: 'kcal',
          deadline: 'Her gün',
          category: 'nutrition',
          icon: '🔥',
          color: theme.colors.warning
        });
      }

      // Water goal
      goals.push({
        id: 'water',
        title: 'Su Tüketimi',
        target: '8',
        current: '0',
        progress: 0,
        unit: 'bardak',
        deadline: 'Her gün',
        category: 'hydration',
        icon: '💧',
        color: theme.colors.primary
      });

      // Steps goal
      goals.push({
        id: 'steps',
        title: 'Günlük Adım',
        target: '10.000',
        current: '0',
        progress: 0,
        unit: 'adım',
        deadline: 'Her gün',
        category: 'activity',
        icon: '👟',
        color: theme.colors.success
      });

      setActiveGoals(goals);
    };

    calculateGoalsProgress();
  }, [userData]);

  const completedGoals = [];
  const goalSuggestions = [];

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
      fontSize: theme.textStyles.onboardingSubtitle?.fontSize || 20,
      fontWeight: (theme.textStyles.onboardingSubtitle?.fontWeight || '600') as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.lg,
    },
    goalCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    goalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    goalLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    goalIcon: {
      fontSize: 24,
      marginRight: theme.spacing.md,
    },
    goalInfo: {
      flex: 1,
    },
    goalTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    goalDeadline: {
      fontSize: 14,
      color: theme.semanticColors.text.secondary,
    },
    goalProgress: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.semanticColors.text.primary,
    },
    progressBarContainer: {
      height: 8,
      backgroundColor: theme.semanticColors.border.primary,
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: theme.spacing.md,
    },
    progressBarFill: {
      height: '100%',
      borderRadius: 4,
    },
    goalMetrics: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    goalMetric: {
      fontSize: 14,
      color: theme.semanticColors.text.secondary,
    },
    goalMetricValue: {
      fontWeight: '600',
      color: theme.semanticColors.text.primary,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: theme.spacing['4xl'],
    },
    emptyStateIcon: {
      fontSize: 64,
      marginBottom: theme.spacing.lg,
    },
    emptyStateTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.sm,
    },
    emptyStateSubtitle: {
      fontSize: 14,
      color: theme.semanticColors.text.secondary,
      textAlign: 'center',
      maxWidth: width * 0.7,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      marginTop: theme.spacing.md,
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: theme.spacing.sm,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: theme.spacing.md,
      fontSize: 16,
      color: theme.semanticColors.text.secondary,
    },
  });

  // Loading state
  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Hedeflerim</Text>
            <Text style={styles.subtitle}>Kişisel hedeflerinizi takip edin</Text>
          </View>

          <View style={styles.content}>
            {/* Active Goals */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Aktif Hedefler</Text>
              {activeGoals.length > 0 ? (
                activeGoals.map((goal) => (
                  <View key={goal.id} style={styles.goalCard}>
                    <View style={styles.goalHeader}>
                      <View style={styles.goalLeft}>
                        <Text style={styles.goalIcon}>{goal.icon}</Text>
                        <View style={styles.goalInfo}>
                          <Text style={styles.goalTitle}>{goal.title}</Text>
                          <Text style={styles.goalDeadline}>{goal.deadline}</Text>
                        </View>
                      </View>
                      <Text style={styles.goalProgress}>{goal.progress}%</Text>
                    </View>

                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${goal.progress}%`,
                            backgroundColor: goal.color,
                          }
                        ]}
                      />
                    </View>

                    <View style={styles.goalMetrics}>
                      <Text style={styles.goalMetric}>
                        Mevcut: <Text style={styles.goalMetricValue}>{goal.current} {goal.unit}</Text>
                      </Text>
                      <Text style={styles.goalMetric}>
                        Hedef: <Text style={styles.goalMetricValue}>{goal.target} {goal.unit}</Text>
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateIcon}>🎯</Text>
                  <Text style={styles.emptyStateTitle}>Henüz hedef belirlemediniz</Text>
                  <Text style={styles.emptyStateSubtitle}>
                    Sağlık hedeflerinizi belirleyerek ilerlemenizi takip edebilirsiniz
                  </Text>
                </View>
              )}
            </View>

            {/* Goal Suggestions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Hedef Önerileri</Text>
              {goalSuggestions.length > 0 ? (
                goalSuggestions.map((suggestion, index) => (
                  <View key={index} style={styles.goalCard}>
                    <Text>Öneri: {suggestion.title}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateIcon}>💡</Text>
                  <Text style={styles.emptyStateTitle}>Öneriler yükleniyor...</Text>
                  <Text style={styles.emptyStateSubtitle}>
                    Yakında size özel hedef önerileri sunacağız
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GoalsDashboardScreen;