/**
 * CaloriTrack - Onboarding Weekly Goal Screen
 * Minimal. Cool. Aesthetic.
 */

import { LightTheme } from '@/constants';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
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

const WeeklyGoalScreen = () => {
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
      color: LightTheme.colors.info,
    },
    {
      value: '0.5',
      label: 'Orta',
      description: 'Haftada 0.5 kg - Dengeli ve etkili ilerleme',
      icon: '🚶',
      color: LightTheme.colors.primary,
    },
    {
      value: '1',
      label: 'Hızlı',
      description: 'Haftada 1 kg - Hızlı sonuçlar için',
      icon: '🏃',
      color: LightTheme.colors.warning,
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
      backgroundColor: LightTheme.semanticColors.background.primary,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    content: {
      padding: LightTheme.spacing.lg,
      paddingTop: LightTheme.spacing.lg,
      paddingBottom: LightTheme.spacing['4xl'],
    },
    header: {
      marginBottom: LightTheme.spacing['3xl'],
      alignItems: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      color: LightTheme.semanticColors.text.primary,
      marginBottom: LightTheme.spacing.md,
      marginTop: LightTheme.spacing.sm,
      textAlign: 'center',
      lineHeight: 40,
    },
    subtitle: {
      fontSize: LightTheme.typography.base.fontSize,
      color: LightTheme.semanticColors.text.secondary,
      textAlign: 'center',
      lineHeight: 26,
      fontWeight: '400',
      marginTop: LightTheme.spacing.md,
      marginBottom: LightTheme.spacing.xl,
    },
    section: {
      marginBottom: LightTheme.spacing['2xl'],
    },
    sectionTitle: {
      fontSize: LightTheme.typography.xl.fontSize,
      color: LightTheme.semanticColors.text.primary,
      marginBottom: LightTheme.spacing.lg,
    },
    goalContainer: {
      gap: LightTheme.spacing.md,
    },
    goalOption: {
      borderWidth: 1,
      borderColor: LightTheme.semanticColors.border.primary,
      borderRadius: LightTheme.borderRadius.md,
      padding: LightTheme.spacing.lg,
      backgroundColor: LightTheme.semanticColors.background.primary,
      flexDirection: 'row',
      alignItems: 'center',
      ...LightTheme.shadows.sm,
    },
    goalOptionSelected: {
      borderColor: LightTheme.colors.primary,
      backgroundColor: `${LightTheme.colors.primary}10`,
    },
    goalIcon: {
      fontSize: 32,
      marginRight: LightTheme.spacing.lg,
    },
    goalContent: {
      flex: 1,
    },
    goalLabel: {
      fontSize: LightTheme.typography.lg.fontSize,
      color: LightTheme.semanticColors.text.primary,
      marginBottom: LightTheme.spacing.xs,
    },
    goalLabelSelected: {
      color: LightTheme.colors.primary,
      fontWeight: '600',
    },
    goalDescription: {
      fontSize: LightTheme.typography.sm.fontSize,
      color: LightTheme.semanticColors.text.secondary,
      lineHeight: 20,
    },
    infoCard: {
      backgroundColor: LightTheme.semanticColors.background.secondary,
      borderWidth: 1,
      borderColor: LightTheme.semanticColors.border.primary,
      borderRadius: LightTheme.borderRadius.lg,
      padding: LightTheme.spacing.lg,
      marginTop: LightTheme.spacing.lg,
      ...LightTheme.shadows.sm,
    },
    infoText: {
      fontSize: LightTheme.typography.base.fontSize,
      color: LightTheme.semanticColors.text.primary,
      textAlign: 'center',
      fontWeight: '500',
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: LightTheme.spacing.md,
      paddingHorizontal: LightTheme.spacing.lg,
      paddingBottom: LightTheme.spacing.xl,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Devam Et"
          onPress={handleNext}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
};

export default WeeklyGoalScreen;