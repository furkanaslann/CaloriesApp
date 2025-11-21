/**
 * CaloriTrack - Onboarding Sleep Hours Screen
 * Minimal. Cool. Aesthetic.
 */

import { Alert, router } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Button from '../../components/ui/button';
import { useOnboarding } from '../../context/onboarding-context';
import { useTheme } from '@/constants';

const SleepHoursScreen = () => {
  const themeResult = useTheme();
  const theme = themeResult || {
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
      backgroundColor: theme.semanticColors.background.primary,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
      justifyContent: 'flex-start',
    },
    progressIndicator: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing['2xl'] || 24,
      paddingTop: '5%',
      marginTop: '15%',
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: theme.borderRadius.full || 9999,
      backgroundColor: theme.semanticColors.border.secondary || '#E2E8F0',
      marginHorizontal: 4,
    },
    dotActive: {
      backgroundColor: theme.colors.primary || '#7C3AED',
      width: 32,
      height: 8,
      borderRadius: theme.borderRadius.sm || 8,
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
    optionIcon: {
      fontSize: 24,
      marginRight: theme.spacing.md,
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
    noteContainer: {
      backgroundColor: theme.semanticColors.background.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.info,
    },
    noteText: {
      ...theme.textStyles.bodySmall,
      color: theme.semanticColors.text.secondary,
      fontSize: 13,
      lineHeight: 18,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.progressIndicator}>
          {Array.from({ length: totalSteps }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentStep - 1 && styles.dotActive,
              ]}
            />
          ))}
        </View>

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

      <View style={styles.buttonContainer}>
        <Button
          title="Geri"
          onPress={handlePrevious}
          variant="secondary"
        />
        <Button
          title="Devam Et"
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
};

export default SleepHoursScreen;