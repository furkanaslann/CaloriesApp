/**
 * CaloriTrack - Onboarding Exercise Types Screen
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

const ExerciseTypesScreen = () => {
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
      marginBottom: LightTheme.spacing.xl,
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
    section: {
      marginBottom: LightTheme.spacing['2xl'],
    },
    sectionDescription: {
      fontSize: LightTheme.typography.sm.fontSize,
      color: LightTheme.semanticColors.text.secondary,
      marginBottom: LightTheme.spacing.lg,
      lineHeight: 20,
    },
    exerciseTypesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: LightTheme.spacing.sm,
    },
    exerciseTypeButton: {
      borderWidth: 1,
      borderColor: LightTheme.semanticColors.border.primary,
      borderRadius: LightTheme.borderRadius.full,
      paddingHorizontal: LightTheme.spacing.md,
      paddingVertical: LightTheme.spacing.sm,
      backgroundColor: LightTheme.semanticColors.background.primary,
      flexDirection: 'row',
      alignItems: 'center',
      gap: LightTheme.spacing.xs,
    },
    exerciseTypeButtonSelected: {
      borderColor: LightTheme.colors.primary,
      backgroundColor: LightTheme.colors.primary,
    },
    exerciseTypeIcon: {
      fontSize: 16,
    },
    exerciseTypeText: {
      fontSize: LightTheme.typography.sm.fontSize,
      color: LightTheme.semanticColors.text.primary,
    },
    exerciseTypeTextSelected: {
      color: '#FFFFFF',
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

export default ExerciseTypesScreen;