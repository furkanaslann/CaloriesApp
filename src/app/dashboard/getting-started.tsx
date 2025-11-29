/**
 * CaloriTrack - Dashboard Getting Started Screen
 * Minimal. Cool. Aesthetic.
 */

import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme';
import { router } from 'expo-router';
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

const GettingStartedDashboardScreen = () => {
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

  // Getting started steps
  const gettingStartedSteps = [
    {
      id: '1',
      title: 'Profilinizi Oluşturun',
      description: 'Kişisel bilgilerinizi, hedeflerinizi ve sağlık durumunuzu girin',
      icon: '👤',
      completed: true,
      route: '/dashboard/profile'
    },
    {
      id: '2',
      title: 'Hedeflerinizi Belirleyin',
      description: 'Kilo verme, kas kazanma veya sağlıklı beslenme hedeflerinizi seçin',
      icon: '🎯',
      completed: true,
      route: '/dashboard/goals'
    },
    {
      id: '3',
      title: 'Beslenme Planı',
      description: 'Size özel beslenme planını oluşturun ve takibine başlayın',
      icon: '📋',
      completed: false,
      route: '/dashboard/plan'
    },
    {
      id: '4',
      title: 'İlk Yemeği Kaydedin',
      description: 'Yemeklerinizi fotoğraf çekerek veya manuel olarak kaydedin',
      icon: '📸',
      completed: false,
      route: '/dashboard/camera'
    },
    {
      id: '5',
      title: 'İlerlemeyi Takip Edin',
      description: 'Günlük, haftalık ve aylık ilerlemenizi grafiklerle görün',
      icon: '📊',
      completed: false,
      route: '/dashboard/progress'
    },
    {
      id: '6',
      title: 'Topluluğa Katılın',
      description: 'Diğer kullanıcılarla deneyimlerinizi paylaşın',
      icon: '👥',
      completed: false,
      route: '/dashboard/community'
    },
  ];

  // Quick tips
  const quickTips = [
    {
      title: 'Her gün giriş yapın',
      description: 'Günlük seri kazanmak ve motivasyonunuzu yüksek tutmak için',
      icon: '📅'
    },
    {
      title: 'Yemek fotoğrafları çekin',
      description: 'AI destekli kalori analizi için yemeklerinizi fotoğraflayın',
      icon: '📸'
    },
    {
      title: 'Hedeflerinizi güncelleyin',
      description: 'İlerlemenize göre hedeflerinizi düzenlemeyi unutmayın',
      icon: '🎯'
    },
    {
      title: 'Su tüketimini takip edin',
      description: 'Günlük su hedeflerinizi düzenli olarak takip edin',
      icon: '💧'
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

    // Progress Overview
    progressCard: {
      backgroundColor: theme.semanticColors.background.primary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      padding: theme.spacing['2xl'],
      alignItems: 'center',
      marginBottom: theme.spacing['2xl'],
      ...theme.shadows.sm,
    },
    progressCircle: {
      width: 120,
      height: 120,
      borderRadius: theme.borderRadius.full,
      borderWidth: 8,
      borderColor: theme.semanticColors.border.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    progressCircleFill: {
      position: 'absolute',
      top: -8,
      left: -8,
      width: 120,
      height: 120,
      borderRadius: theme.borderRadius.full,
      borderWidth: 8,
      borderTopColor: 'transparent',
      borderRightColor: theme.colors.success,
      borderBottomColor: theme.colors.success,
      borderLeftColor: theme.colors.success,
      transform: [{ rotate: '-90deg' }],
    },
    progressText: {
      fontSize: 24,
      fontWeight: '700' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
    },
    progressLabel: {
      fontSize: 14,
      color: theme.semanticColors.text.secondary,
    },

    // Steps
    stepCard: {
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
    completedStep: {
      borderColor: theme.colors.success,
      backgroundColor: `${theme.colors.success}10`,
    },
    stepNumber: {
      width: 32,
      height: 32,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.semanticColors.border.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    completedNumber: {
      backgroundColor: theme.colors.success,
    },
    stepNumberText: {
      fontSize: 14,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
    },
    completedNumberText: {
      color: theme.semanticColors.onPrimary,
    },
    stepInfo: {
      flex: 1,
    },
    stepTitle: {
      fontSize: 14,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: 2,
    },
    stepDescription: {
      fontSize: 12,
      color: theme.semanticColors.text.secondary,
      lineHeight: 16,
    },
    stepIcon: {
      fontSize: 20,
    },

    // Quick Tips
    tipCard: {
      backgroundColor: theme.semanticColors.background.primary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    tipHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    tipIcon: {
      fontSize: 16,
      marginRight: theme.spacing.md,
    },
    tipTitle: {
      fontSize: 14,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      flex: 1,
    },
    tipDescription: {
      fontSize: 12,
      color: theme.semanticColors.text.secondary,
      lineHeight: 16,
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

  const completedSteps = gettingStartedSteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / gettingStartedSteps.length) * 100;

  const renderStep = ({ item }) => (
    <TouchableOpacity
      style={[styles.stepCard, item.completed && styles.completedStep]}
      onPress={() => router.push(item.route)}
    >
      <View style={[styles.stepNumber, item.completed && styles.completedNumber]}>
        <Text style={[styles.stepNumberText, item.completed && styles.completedNumberText]}>
          {item.completed ? '✓' : item.id}
        </Text>
      </View>
      <View style={styles.stepInfo}>
        <Text style={styles.stepTitle}>{item.title}</Text>
        <Text style={styles.stepDescription}>{item.description}</Text>
      </View>
      <Text style={styles.stepIcon}>{item.icon}</Text>
    </TouchableOpacity>
  );

  const renderTip = ({ item }) => (
    <View style={styles.tipCard}>
      <View style={styles.tipHeader}>
        <Text style={styles.tipIcon}>{item.icon}</Text>
        <Text style={styles.tipTitle}>{item.title}</Text>
      </View>
      <Text style={styles.tipDescription}>{item.description}</Text>
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
          <Text style={styles.title}>Başlayalım!</Text>
          <Text style={styles.subtitle}>CaloriTrack'e hoş geldiniz</Text>
        </View>

        <View style={styles.content}>
          {/* Progress Overview */}
          <View style={styles.section}>
            <View style={styles.progressCard}>
              <View style={styles.progressCircle}>
                <View style={styles.progressCircleFill} />
                <Text style={styles.progressText}>{completedSteps}/{gettingStartedSteps.length}</Text>
              </View>
              <Text style={styles.progressLabel}>Başlangıç adımları tamamlandı</Text>
            </View>
          </View>

          {/* Getting Started Steps */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Başlangıç Adımları</Text>
            {gettingStartedSteps.map(step => renderStep({ item: step }))}
          </View>

          {/* Quick Tips */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hızlı İpuçları</Text>
            {quickTips.map(tip => renderTip({ item: tip }))}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>🚀 Başla</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
              <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>❓ Yardım</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GettingStartedDashboardScreen;