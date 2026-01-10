/**
 * CaloriTrack - Onboarding Weekly Goal Screen
 * Minimal. Cool. Aesthetic.
 */

import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/button';
import ProgressBar from '../../components/ui/progress-bar';
import { useOnboarding } from '../../context/onboarding-context';

const WeeklyGoalScreen = () => {
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

  const [weeklyGoal, setWeeklyGoal] = useState(goals.weeklyGoal?.toString() || '0.5');

  const currentStep = getCurrentStep('goals-weekly');

  useEffect(() => {
    // Set sensible defaults based on goal type
    if (goals.primaryGoal) {
      switch (goals.primaryGoal) {
        case 'weight_loss':
          setWeeklyGoal('0.5');
          break;
        case 'maintenance':
          setWeeklyGoal('0');
          break;
        case 'muscle_gain':
          setWeeklyGoal('0.25');
          break;
        default:
          setWeeklyGoal('0.5');
          break;
      }
    }
  }, [goals.primaryGoal]);

  const validateForm = (): boolean => {
    const errors: string[] = [];

    const goal = parseFloat(weeklyGoal);
    if (isNaN(goal) || goal < -2 || goal > 2) {
      errors.push('Haftalık hedef -2 ila +2 kg aralığında olmalıdır');
    }

    if (errors.length > 0) {
      Alert.alert('Doğrulama Hatası', errors.join('\n'));
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateForm()) return;

    updateGoals({ weeklyGoal: parseFloat(weeklyGoal) });
    nextStep();
    router.push('/onboarding/goals-timeline');
  };

  const handlePrevious = () => {
    previousStep();
    router.back();
  };

  const weeklyGoalOptions = [
    {
      value: '0.25',
      label: 'Yavaş',
      description: 'Haftada 0.25 kg - Sürdürülebilir ve sağlıklı ilerleme',
      icon: '🐢',
      color: theme.colors.info,
    },
    {
      value: '0.5',
      label: 'Orta',
      description: 'Haftada 0.5 kg - Dengeli ve etkili ilerleme',
      icon: '🚶',
      color: theme.colors.primary,
    },
    {
      value: '1',
      label: 'Hızlı',
      description: 'Haftada 1 kg - Hızlı sonuçlar için',
      icon: '🏃',
      color: theme.colors.warning,
    },
  ];

  const getGoalDescription = () => {
    const goal = parseFloat(weeklyGoal);
    if (goals.primaryGoal === 'weight_loss') {
      return `Haftada ${goal} kg kilo verme hedefi`;
    } else if (goals.primaryGoal === 'muscle_gain') {
      return `Haftada ${goal} kg kas kazanma hedefi`;
    } else if (goals.primaryGoal === 'maintenance') {
      return 'Mevcut kiloyu koruma hedefi';
    }
    return `Haftalık ${goal} kg hedef`;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.semanticColors.background.primary,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
      justifyContent: 'flex-start',
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
    section: {
      marginBottom: theme.spacing['3xl'],
    },
    sectionTitle: {
      ...theme.textStyles.heading4,
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.lg,
    },
    goalContainer: {
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
    infoCard: {
      backgroundColor: theme.semanticColors.background.surface,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginTop: theme.spacing.lg,
      ...theme.shadows.sm,
    },
    infoText: {
      ...theme.textStyles.body,
      color: theme.semanticColors.text.primary,
      textAlign: 'center',
      fontWeight: '500',
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
      <View style={styles.content}>
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} onBack={handlePrevious} />

        <View style={styles.header}>
          <Text style={styles.title}>Haftalık Hedef</Text>
          <Text style={styles.subtitle}>
            Haftalık ilerleme hedefinizi belirleyin.
          </Text>
        </View>

        <View style={styles.goalContainer}>
          {weeklyGoalOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.goalOption,
                weeklyGoal === option.value && styles.goalOptionSelected,
              ]}
              onPress={() => setWeeklyGoal(option.value)}
            >
              <Text style={styles.goalIcon}>{option.icon}</Text>
              <View style={styles.goalContent}>
                <Text
                  style={[
                    styles.goalLabel,
                    weeklyGoal === option.value && styles.goalLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
                <Text style={styles.goalDescription}>{option.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Devam Et"
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
};

export default WeeklyGoalScreen;