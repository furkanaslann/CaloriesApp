/**
 * CaloriTrack - Onboarding Exercise Types Screen
 * Minimal. Cool. Aesthetic.
 */

import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/button';
import ProgressBar from '../../components/ui/progress-bar';
import { useOnboarding } from '../../context/onboarding-context';

const ExerciseTypesScreen = () => {
  // Modern theme system using constants
  const theme = {
    semanticColors: {
      background: { primary: '#FFFFFF', surface: '#F8FAFC', primarySurface: '#EDE9FE' },
      text: { primary: '#1E293B', secondary: '#475569', tertiary: '#64748B', onPrimary: '#FFFFFF' },
      border: { primary: '#E2E8F0', secondary: '#E2E8F0' },
    },
    colors: { primary: '#7C3AED', success: '#10B981', warning: '#F59E0B', info: '#3B82F6' },
    textStyles: {
      heading2: { fontSize: 32, fontWeight: '700' },
      onboardingDescription: { fontSize: 16, fontWeight: '400' },
      heading4: { fontSize: 20, fontWeight: '600' },
      body: { fontSize: 16, fontWeight: '400' },
      bodySmall: { fontSize: 14, fontWeight: '400' },
      labelLarge: { fontSize: 18, fontWeight: '500' },
      labelSmall: { fontSize: 13, fontWeight: '500' },
    },
    typography: { lineHeight: { relaxed: 1.75 } },
    spacing: { lg: 24, md: 16, xl: 32, '4xl': 48, '3xl': 40, '2xl': 24, sm: 8, xs: 4 },
    borderRadius: { full: 9999, xl: 16, lg: 12, md: 10, sm: 8 },
    shadows: { lg: {}, md: {}, sm: {} },
  };
  const { activity, updateActivity, nextStep, previousStep, totalSteps, getCurrentStep } = useOnboarding();

  const [exerciseTypes, setExerciseTypes] = useState<string[]>(activity.exerciseTypes || []);

  const currentStep = getCurrentStep('exercise-types');

  const handleExerciseTypeToggle = (type: string) => {
    setExerciseTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleNext = () => {
    updateActivity({ exerciseTypes });
    nextStep();
    router.push('/onboarding/exercise-frequency');
  };

  const handlePrevious = () => {
    previousStep();
    router.back();
  };

  const exerciseTypeOptions = [
    { value: 'cardio', label: 'Kardiyo', icon: '🏃' },
    { value: 'strength', label: 'Kuvvet', icon: '🏋️' },
    { value: 'yoga', label: 'Yoga', icon: '🧘' },
    { value: 'sports', label: 'Spor', icon: '⚽' },
    { value: 'walking', label: 'Yürüme', icon: '🚶' },
    { value: 'cycling', label: 'Bisiklet', icon: '🚴' },
    { value: 'swimming', label: 'Yüzme', icon: '🏊' },
    { value: 'dancing', label: 'Dans', icon: '💃' },
    { value: 'pilates', label: 'Pilates', icon: '🤸' },
    { value: 'martial_arts', label: 'Dövüş Sanatları', icon: '🥋' },
    { value: 'crossfit', label: 'CrossFit', icon: '🏋️‍♂️' },
    { value: 'climbing', label: 'Tırmanış', icon: '🧗' },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.semanticColors.background.primary,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
      justifyContent: 'flex-start',
    },
    title: {
      ...theme.textStyles.heading2,
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.md,
      lineHeight: 40,
    },
    subtitle: {
      ...theme.textStyles.onboardingDescription,
      color: theme.semanticColors.text.secondary,
      lineHeight: theme.typography.lineHeight.relaxed,
    },
    section: {
      marginBottom: theme.spacing['3xl'],
    },
    sectionDescription: {
      ...theme.textStyles.bodySmall,
      color: theme.semanticColors.text.secondary,
      marginBottom: theme.spacing.lg,
      fontSize: 14,
      lineHeight: 20,
    },
    exerciseTypesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    exerciseTypeButton: {
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.semanticColors.background.primary,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    exerciseTypeButtonSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary,
    },
    exerciseTypeIcon: {
      fontSize: 16,
    },
    exerciseTypeText: {
      ...theme.textStyles.labelSmall,
      color: theme.semanticColors.text.primary,
    },
    exerciseTypeTextSelected: {
      color: theme.semanticColors.text.onPrimary,
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
            <Text style={styles.title}>Egzersiz Türleri</Text>
            <Text style={styles.subtitle}>
              Yaptığınız egzersiz türlerini seçin. Bu bilgiler antrenman programınızı kişiselleştirmemize yardımcı olacaktır.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionDescription}>
              Birden fazla egzersiz türü seçebilirsiniz (isteğe bağlı)
            </Text>
            <View style={styles.exerciseTypesContainer}>
              {exerciseTypeOptions.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.exerciseTypeButton,
                    exerciseTypes.includes(type.value) && styles.exerciseTypeButtonSelected,
                  ]}
                  onPress={() => handleExerciseTypeToggle(type.value)}
                >
                  <Text style={styles.exerciseTypeIcon}>{type.icon}</Text>
                  <Text
                    style={[
                      styles.exerciseTypeText,
                      exerciseTypes.includes(type.value) && styles.exerciseTypeTextSelected,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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

export default ExerciseTypesScreen;