/**
 * CaloriTrack - Onboarding Primary Goal Screen
 * Minimal. Cool. Aesthetic.
 */

import { LightTheme } from '@/constants';
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
  const { goals, updateGoals, nextStep, previousStep, totalSteps, getCurrentStep } = useOnboarding();

  const [selectedGoal, setSelectedGoal] = useState(goals.primaryGoal || 'weight_loss');

  const currentStep = getCurrentStep('goals-primary');

  const goalOptions = [
    {
      value: 'weight_loss',
      label: 'Kilo Verme',
      description: 'Sağlıklı bir şekilde kilo verin',
      icon: '🎯',
      color: LightTheme.colors.error,
    },
    {
      value: 'maintenance',
      label: 'Koruma',
      description: 'Mevcut kilonuzu koruyun',
      icon: '⚖️',
      color: LightTheme.colors.primary,
    },
    {
      value: 'muscle_gain',
      label: 'Kas Kazanma',
      description: 'Kas kütlenizi artırın',
      icon: '💪',
      color: LightTheme.colors.success,
    },
    {
      value: 'healthy_eating',
      label: 'Sağlıklı Beslenme',
      description: 'Beslenme alışkanlıklarınızı iyileştirin',
      icon: '🥗',
      color: LightTheme.colors.info || '#3B82F6',
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
      marginBottom: LightTheme.spacing['6xl'],
      alignItems: 'center',
    },
    title: {
      fontSize: LightTheme.typography['3xl'].fontSize,
      fontWeight: '700',
      color: LightTheme.semanticColors.text.primary,
      marginBottom: LightTheme.spacing.md,
      marginTop: LightTheme.spacing.sm,
      textAlign: 'center',
      lineHeight: LightTheme.typography['3xl'].lineHeight,
    },
    subtitle: {
      fontSize: LightTheme.typography.base.fontSize,
      fontWeight: '400',
      color: LightTheme.semanticColors.text.secondary,
      textAlign: 'center',
      lineHeight: LightTheme.typography.base.lineHeight,
      marginTop: LightTheme.spacing.md,
      marginBottom: LightTheme.spacing.xl,
    },
    goalGrid: {
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
      fontWeight: '500',
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
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
};

export default PrimaryGoalScreen;
