/**
 * CaloriTrack - Dashboard Goals Screen
 * Minimal. Cool. Aesthetic.
 */

import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextStyle,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const GoalsDashboardScreen = () => {
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

  // Goals data
  const activeGoals = [
    {
      id: '1',
      title: 'Kilo Verme',
      target: '70 kg',
      current: '72.5 kg',
      progress: 65,
      unit: 'kg',
      deadline: '15 Mart 2024',
      category: 'weight',
      icon: '⚖️',
      color: theme.colors.primary
    },
    {
      id: '2',
      title: 'Günlük Adım',
      target: '10.000',
      current: '7.500',
      progress: 75,
      unit: 'adım',
      deadline: 'Her gün',
      category: 'activity',
      icon: '👟',
      color: theme.colors.success
    },
    {
      id: '3',
      title: 'Su Tüketimi',
      target: '2.5',
      current: '1.8',
      progress: 72,
      unit: 'litre',
      deadline: 'Her gün',
      category: 'hydration',
      icon: '💧',
      color: theme.colors.warning
    },
    {
      id: '4',
      title: 'Protein Alımı',
      target: '150',
      current: '125',
      progress: 83,
      unit: 'gram',
      deadline: 'Her gün',
      category: 'nutrition',
      icon: '🥩',
      color: theme.colors.primary
    },
  ];

  const completedGoals = [
    {
      id: '5',
      title: 'Haftalık Egzersiz',
      description: '5 gün egzersiz yapma hedefi tamamlandı',
      completedDate: '10 Ocak 2024',
      icon: '🏃',
      points: 100
    },
    {
      id: '6',
      title: '30 Günlük Seri',
      description: '30 gün üst üste giriş yapıldı',
      completedDate: '5 Ocak 2024',
      icon: '🔥',
      points: 150
    },
  ];

  const goalSuggestions = [
    { title: 'Daha Fazla Sebze Tüketimi', difficulty: 'Kolay', icon: '🥬' },
    { title: 'Uyku Saatlerini Düzenleme', difficulty: 'Orta', icon: '😴' },
    { title: 'Meditasyon Pratiği', difficulty: 'Kolay', icon: '🧘' },
    { title: 'Haftalık 3 Gün Antrenman', difficulty: 'Zor', icon: '💪' },
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

    // Active Goals
    goalCard: {
      backgroundColor: theme.semanticColors.background.primary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    goalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    goalInfo: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    goalIcon: {
      fontSize: 20,
      marginRight: theme.spacing.md,
    },
    goalTitle: {
      fontSize: 16,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
    },
    goalDeadline: {
      fontSize: 10,
      color: theme.semanticColors.text.tertiary,
      backgroundColor: `${theme.semanticColors.border.primary}50`,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
    },
    progressInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    progressText: {
      fontSize: 14,
      color: theme.semanticColors.text.secondary,
    },
    progressPercent: {
      fontSize: 14,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
    },
    progressBar: {
      height: 8,
      backgroundColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.sm,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: theme.borderRadius.sm,
    },

    // Completed Goals
    completedCard: {
      backgroundColor: theme.semanticColors.background.primary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      ...theme.shadows.sm,
    },
    completedIcon: {
      fontSize: 20,
      marginRight: theme.spacing.md,
    },
    completedInfo: {
      flex: 1,
    },
    completedTitle: {
      fontSize: 14,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: 2,
    },
    completedDescription: {
      fontSize: 12,
      color: theme.semanticColors.text.secondary,
      marginBottom: 4,
    },
    completedDate: {
      fontSize: 10,
      color: theme.semanticColors.text.tertiary,
    },
    pointsBadge: {
      backgroundColor: `${theme.colors.success}20`,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.md,
    },
    pointsText: {
      fontSize: 10,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.colors.success,
    },

    // Suggestions
    suggestionGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    suggestionCard: {
      width: (width - theme.spacing['2xl'] * 2 - theme.spacing.md) / 2,
      backgroundColor: theme.semanticColors.background.primary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      padding: theme.spacing.lg,
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    suggestionIcon: {
      fontSize: 24,
      marginBottom: theme.spacing.sm,
    },
    suggestionTitle: {
      fontSize: 12,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: 4,
      textAlign: 'center',
    },
    difficultyBadge: {
      backgroundColor: `${theme.colors.warning}20`,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
    },
    difficultyText: {
      fontSize: 8,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.colors.warning,
    },

    // Action Buttons
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing['4xl'],
    },
    actionButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      minWidth: (width - theme.spacing['2xl'] * 2 - theme.spacing.md) / 2,
      alignItems: 'center',
      ...theme.shadows.md,
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.onPrimary,
    },
    secondaryButtonText: {
      color: theme.semanticColors.text.primary,
    },
  });

  const renderActiveGoal = ({ item }) => (
    <TouchableOpacity style={styles.goalCard} key={item.id}>
      <View style={styles.goalHeader}>
        <View style={styles.goalInfo}>
          <Text style={styles.goalIcon}>{item.icon}</Text>
          <Text style={styles.goalTitle}>{item.title}</Text>
        </View>
        <View style={styles.goalDeadline}>
          <Text>{item.deadline}</Text>
        </View>
      </View>
      <View style={styles.progressInfo}>
        <Text style={styles.progressText}>
          {item.current} / {item.target} {item.unit}
        </Text>
        <Text style={styles.progressPercent}>{item.progress}%</Text>
      </View>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${item.progress}%`,
              backgroundColor: item.color,
            }
          ]}
        />
      </View>
    </TouchableOpacity>
  );

  const renderCompletedGoal = ({ item }) => (
    <View style={styles.completedCard} key={item.id}>
      <Text style={styles.completedIcon}>{item.icon}</Text>
      <View style={styles.completedInfo}>
        <Text style={styles.completedTitle}>{item.title}</Text>
        <Text style={styles.completedDescription}>{item.description}</Text>
        <Text style={styles.completedDate}>Tamamlandı: {item.completedDate}</Text>
      </View>
      <View style={styles.pointsBadge}>
        <Text style={styles.pointsText}>+{item.points} puan</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Hedefler</Text>
          <Text style={styles.subtitle}>Kişisel hedeflerinizi belirleyin</Text>
        </View>

        <View style={styles.content}>
          {/* Active Goals */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Aktif Hedefler ({activeGoals.length})</Text>
            {activeGoals.map(goal => renderActiveGoal({ item: goal, key: goal.id }))}
          </View>

          {/* Completed Goals */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tamamlanan Hedefler ({completedGoals.length})</Text>
            {completedGoals.map(goal => renderCompletedGoal({ item: goal, key: goal.id }))}
          </View>

          {/* Goal Suggestions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Yeni Hedef Önerileri</Text>
            <View style={styles.suggestionGrid}>
              {goalSuggestions.map((suggestion, index) => (
                <TouchableOpacity key={index} style={styles.suggestionCard}>
                  <Text style={styles.suggestionIcon}>{suggestion.icon}</Text>
                  <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
                  <View style={styles.difficultyBadge}>
                    <Text style={styles.difficultyText}>{suggestion.difficulty}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>➕ Yeni Hedef Ekle</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
              <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>📊 İstatistikler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GoalsDashboardScreen;