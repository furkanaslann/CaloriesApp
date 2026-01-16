/**
 * CaloriTrack - Onboarding Primary Goal Screen
 * Minimal. Cool. Aesthetic.
 */

import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/button';
import ProgressBar from '../../components/ui/progress-bar';
import { useOnboarding } from '../../context/onboarding-context';

const PrimaryGoalScreen = () => {
  // Modern theme system using constants
  const theme = {
    semanticColors: {
      background: { primary: '#FFFFFF', surface: '#F8FAFC', primarySurface: '#EDE9FE' },
      text: { primary: '#1E293B', secondary: '#475569', tertiary: '#64748B', onPrimary: '#FFFFFF' },
      border: { primary: '#E2E8F0', secondary: '#E2E8F0' },
    },
    colors: { primary: '#7C3AED', success: '#10B981', warning: '#F59E0B', error: '#EF4444', info: '#3B82F6' },
    textStyles: {
      onboardingTitle: { fontSize: 30, fontWeight: '600' },
      onboardingDescription: { fontSize: 16, fontWeight: '400' },
      heading3: { fontSize: 24, fontWeight: '600' },
      heading4: { fontSize: 20, fontWeight: '600' },
      body: { fontSize: 16, fontWeight: '400' },
      bodySmall: { fontSize: 14, fontWeight: '400' },
      labelLarge: { fontSize: 18, fontWeight: '500' },
      labelMedium: { fontSize: 15, fontWeight: '500' },
      caption: { fontSize: 12, fontWeight: '400' },
    },
    spacing: { lg: 24, md: 16, xl: 32, '4xl': 48, '3xl': 40, '2xl': 24, sm: 8 },
    borderRadius: { full: 9999, xl: 16, lg: 12, md: 10 },
    shadows: { sm: {}, md: {} },
    coloredShadows: { primary: {} },
  };
  const { goals, updateGoals, nextStep, previousStep, totalSteps, getCurrentStep } = useOnboarding();

  const [selectedGoal, setSelectedGoal] = useState(goals.primaryGoal || 'weight_loss');

  const currentStep = getCurrentStep('goals-primary');

  const goalOptions = [
    {
      value: 'weight_loss',
      label: 'Kilo Verme',
      description: 'Sağlıklı bir şekilde kilo verin',
      icon: '🎯',
      color: theme.colors.error,
    },
    {
      value: 'maintenance',
      label: 'Koruma',
      description: 'Mevcut kilonuzu koruyun',
      icon: '⚖️',
      color: theme.colors.primary,
    },
    {
      value: 'muscle_gain',
      label: 'Kas Kazanma',
      description: 'Kas kütlenizi artırın',
      icon: '💪',
      color: theme.colors.success,
    },
    {
      value: 'healthy_eating',
      label: 'Sağlıklı Beslenme',
      description: 'Beslenme alışkanlıklarınızı iyileştirin',
      icon: '🥗',
      color: theme.colors.info,
    },
  ];

  const handleNext = () => {
    updateGoals({ primaryGoal: selectedGoal as any });
    nextStep();
    router.push('/onboarding/goals-weight');
  };

  const handlePrevious = () => {
    previousStep();
    router.back();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.semanticColors.background.primary,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    content: {
      padding: theme.spacing.lg,
      paddingTop: theme.spacing['4xl'],
      paddingBottom: theme.spacing['4xl'],
    },
    header: {
      marginBottom: theme.spacing['3xl'],
      alignItems: 'center',
    },
    title: {
      ...theme.textStyles.onboardingTitle,
      fontSize: 32,
      fontWeight: '700',
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.md,
      marginTop: theme.spacing.sm,
      textAlign: 'center',
      lineHeight: 40,
    },
    subtitle: {
      ...theme.textStyles.body,
      color: theme.semanticColors.text.secondary,
      textAlign: 'center',
      lineHeight: 26,
      fontWeight: '400',
      fontSize: 16,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.xl,
    },
    goalGrid: {
      gap: theme.spacing.md,
    },
    goalOption: {
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.lg,
      backgroundColor: theme.semanticColors.background.primary,
      flexDirection: 'row',
      alignItems: 'center',
      ...theme.shadows.sm,
    },
    goalOptionSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: `${theme.colors.primary}10`,
    },
    goalIcon: {
      fontSize: 32,
      marginRight: theme.spacing.lg,
    },
    goalContent: {
      flex: 1,
    },
    goalLabel: {
      ...theme.textStyles.labelLarge,
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    goalLabelSelected: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    goalDescription: {
      ...theme.textStyles.bodySmall,
      color: theme.semanticColors.text.secondary,
      lineHeight: 20,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} onBack={handlePrevious} />

          <View style={styles.header}>
            <Text style={styles.title}>Ana Hedefiniz</Text>
            <Text style={styles.subtitle}>
              Ulaşmak istediğiniz ana hedefi seçin.
            </Text>
          </View>

          <View style={styles.goalGrid}>
            {goalOptions.map((goal) => (
              <TouchableOpacity
                key={goal.value}
                style={[
                  styles.goalOption,
                  selectedGoal === goal.value && styles.goalOptionSelected,
                ]}
                onPress={() => setSelectedGoal(goal.value)}
              >
                <Text style={styles.goalIcon}>{goal.icon}</Text>
                <View style={styles.goalContent}>
                  <Text
                    style={[
                      styles.goalLabel,
                      selectedGoal === goal.value && styles.goalLabelSelected,
                    ]}
                  >
                    {goal.label}
                  </Text>
                  <Text style={styles.goalDescription}>{goal.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Devam Et"
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
};

export default PrimaryGoalScreen;