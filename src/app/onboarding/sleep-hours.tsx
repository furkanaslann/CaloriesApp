/**
 * CaloriTrack - Onboarding Sleep Hours Screen
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

const SleepHoursScreen = () => {
  const { activity, updateActivity, nextStep, previousStep, totalSteps, getCurrentStep } = useOnboarding();

  const [sleepHours, setSleepHours] = useState<string>(activity.sleepHours?.toString() || '7');

  const currentStep = getCurrentStep('sleep-hours');

  const sleepOptions = [
    { value: '4', label: '4 saat', description: 'Yetersiz uyku', icon: '😴' },
    { value: '5', label: '5 saat', description: 'Yetersiz uyku', icon: '😴' },
    { value: '6', label: '6 saat', description: 'Biraz kısa', icon: '😐' },
    { value: '7', label: '7 saat', description: 'İdeal süresine yakın', icon: '😊' },
    { value: '8', label: '8 saat', description: 'İdeal süre', icon: '😌' },
    { value: '9', label: '9 saat', description: 'İyi', icon: '🌙' },
    { value: '10', label: '10+ saat', description: 'Uzun süre', icon: '💤' },
  ];

  const validateForm = (): boolean => {
    const hours = parseFloat(sleepHours);
    if (isNaN(hours) || hours < 4 || hours > 12) {
      Alert.alert('Doğrulama Hatası', 'Uyku süresi 4-12 saat aralığında olmalıdır');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateForm()) return;

    updateActivity({ sleepHours: parseFloat(sleepHours) });
    nextStep();
    router.push('/onboarding/diet');
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
    optionIcon: {
      fontSize: 24,
      marginRight: LightTheme.spacing.md,
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
    noteContainer: {
      backgroundColor: LightTheme.semanticColors.background.secondary,
      borderRadius: LightTheme.borderRadius.md,
      padding: LightTheme.spacing.md,
      marginTop: LightTheme.spacing.md,
      borderLeftWidth: 4,
      borderLeftColor: LightTheme.colors.info,
    },
    noteText: {
      fontSize: LightTheme.typography.sm.fontSize,
      color: LightTheme.semanticColors.text.secondary,
      lineHeight: 18,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} onBack={handlePrevious} />

          <View style={styles.header}>
              <Text style={styles.title}>Uyku Süresi</Text>
              <Text style={styles.subtitle}>
                Günde ortalama kaç saat uyuduğunuzu belirtin. Uyku süresi metabolizma hızınızı ve genel sağlık durumunuzu etkiler.
              </Text>
            </View>

            <View style={styles.section}>
              <View style={styles.optionGrid}>
                {sleepOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionCard,
                      sleepHours === option.value && styles.optionCardSelected,
                    ]}
                    onPress={() => setSleepHours(option.value)}
                  >
                    <View style={styles.optionHeader}>
                      <Text style={styles.optionIcon}>{option.icon}</Text>
                      <Text
                        style={[
                          styles.optionLabel,
                          sleepHours === option.value && styles.optionLabelSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </View>
                    <Text style={styles.optionDescription}>{option.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.noteContainer}>
                <Text style={styles.noteText}>
                  Yetişkinler için önerilen uyku süresi 7-9 saattir. Yeterli uyku, kilo kontrolü ve genel sağlık için önemlidir.
                </Text>
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

export default SleepHoursScreen;