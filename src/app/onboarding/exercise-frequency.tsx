/**
 * CaloriTrack - Onboarding Exercise Frequency Screen
 * Minimal. Cool. Aesthetic.
 */

import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme';
import { Alert, router } from 'expo-router';
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

const ExerciseFrequencyScreen = () => {
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
      labelMedium: { fontSize: 15, fontWeight: '500' },
    },
    typography: { lineHeight: { relaxed: 1.75 } },
    spacing: { lg: 24, md: 16, xl: 32, '4xl': 48, '3xl': 40, '2xl': 24, sm: 8, xs: 4 },
    borderRadius: { full: 9999, xl: 16, lg: 12, md: 10, sm: 8 },
    shadows: { lg: {}, md: {}, sm: {} },
  };
  const { activity, updateActivity, nextStep, previousStep, totalSteps, getCurrentStep } = useOnboarding();

  const [exerciseFrequency, setExerciseFrequency] = useState<string>(
    activity.exerciseFrequency?.toString() || '3'
  );

  const currentStep = getCurrentStep('exercise-frequency');

  const frequencyOptions = [
    { value: '0', label: 'Hiç', description: 'Egzersiz yapmıyorum' },
    { value: '1', label: '1 gün', description: 'Haftada 1 gün' },
    { value: '2', label: '2 gün', description: 'Haftada 2 gün' },
    { value: '3', label: '3 gün', description: 'Haftada 3 gün' },
    { value: '4', label: '4 gün', description: 'Haftada 4 gün' },
    { value: '5', label: '5 gün', description: 'Haftada 5 gün' },
    { value: '6', label: '6 gün', description: 'Haftada 6 gün' },
    { value: '7', label: 'Her gün', description: 'Günde 1 veya daha fazla' },
  ];

  const validateForm = (): boolean => {
    const frequency = parseInt(exerciseFrequency);
    if (isNaN(frequency) || frequency < 0 || frequency > 7) {
      Alert.alert('Doğrulama Hatası', 'Egzersiz sıklığı 0-7 gün aralığında olmalıdır');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateForm()) return;

    updateActivity({ exerciseFrequency: parseInt(exerciseFrequency) });
    nextStep();
    router.push('/onboarding/sleep-hours');
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
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing['4xl'],
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
    inputContainer: {
      marginBottom: theme.spacing.lg,
    },
    optionGrid: {
      gap: theme.spacing.md,
    },
    optionCard: {
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.lg,
      backgroundColor: theme.semanticColors.background.primary,
      ...theme.shadows.sm,
    },
    optionCardSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: `${theme.colors.primary}10`,
    },
    optionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    optionLabel: {
      ...theme.textStyles.labelLarge,
      color: theme.semanticColors.text.primary,
      fontWeight: '600',
    },
    optionLabelSelected: {
      color: theme.colors.primary,
    },
    optionDescription: {
      ...theme.textStyles.bodySmall,
      color: theme.semanticColors.text.secondary,
      fontSize: 14,
      fontWeight: '400',
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
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} onBack={handlePrevious} />

          <View style={styles.header}>
              <Text style={styles.title}>Egzersiz Sıklığı</Text>
              <Text style={styles.subtitle}>
                Haftada kaç gün egzersiz yaptığınızı belirtin. Bu bilgiler antrenman programınızı ve kalori hedeflerinizi belirlememize yardımcı olacaktır.
              </Text>
            </View>

            <View style={styles.section}>
              <View style={styles.optionGrid}>
                {frequencyOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionCard,
                      exerciseFrequency === option.value && styles.optionCardSelected,
                    ]}
                    onPress={() => setExerciseFrequency(option.value)}
                  >
                    <View style={styles.optionHeader}>
                      <Text
                        style={[
                          styles.optionLabel,
                          exerciseFrequency === option.value && styles.optionLabelSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </View>
                    <Text style={styles.optionDescription}>{option.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
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

export default ExerciseFrequencyScreen;