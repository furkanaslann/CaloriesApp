/**
 * CaloriTrack - Onboarding Exercise Frequency Screen
 * Minimal. Cool. Aesthetic.
 */

import { LightTheme } from '@/constants';
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
    title: {
      fontSize: LightTheme.typography['3xl'].fontSize,
      fontWeight: '700',
      color: LightTheme.semanticColors.text.primary,
      marginBottom: LightTheme.spacing.md,
      lineHeight: LightTheme.typography['3xl'].lineHeight,
    },
    subtitle: {
      fontSize: LightTheme.typography.base.fontSize,
      fontWeight: '400',
      color: LightTheme.semanticColors.text.secondary,
      lineHeight: LightTheme.typography.base.lineHeight,
    },
    header: {
      marginBottom: LightTheme.spacing.xl,
    },
    section: {
      marginBottom: LightTheme.spacing['2xl'],
    },
    inputContainer: {
      marginBottom: LightTheme.spacing.lg,
    },
    optionGrid: {
      gap: LightTheme.spacing.md,
    },
    optionCard: {
      borderWidth: 1,
      borderColor: LightTheme.semanticColors.border.primary,
      borderRadius: LightTheme.borderRadius.md,
      padding: LightTheme.spacing.lg,
      backgroundColor: LightTheme.semanticColors.background.primary,
      ...LightTheme.shadows.sm,
    },
    optionCardSelected: {
      borderColor: LightTheme.colors.primary,
    },
    optionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: LightTheme.spacing.sm,
    },
    optionLabel: {
      fontSize: LightTheme.typography.lg.fontSize,
      fontWeight: '600',
      color: LightTheme.semanticColors.text.primary,
    },
    optionLabelSelected: {
      color: LightTheme.colors.primary,
    },
    optionDescription: {
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