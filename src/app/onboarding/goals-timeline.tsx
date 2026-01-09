/**
 * CaloriTrack - Onboarding Timeline Screen
 * Minimal. Cool. Aesthetic.
 */

import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
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

const TimelineScreen = () => {
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
    shadows: { lg: {}, md: {} },
    coloredShadows: { primary: {} },
  };
  const { goals, updateGoals, nextStep, previousStep, totalSteps, getCurrentStep } = useOnboarding();

  const [timeline, setTimeline] = useState(goals.timeline?.toString() || '12');

  const currentStep = getCurrentStep('goals-timeline');

  const validateForm = (): boolean => {
    const errors: string[] = [];

    const weeks = parseInt(timeline);
    if (!weeks || weeks < 1 || weeks > 104) {
      errors.push('Zaman çizelgesi 1-104 hafta aralığında olmalıdır');
    }

    if (errors.length > 0) {
      Alert.alert('Doğrulama Hatası', errors.join('\n'));
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateForm()) return;

    updateGoals({ timeline: parseInt(timeline) });
    nextStep();
    router.push('/onboarding/goals-motivation');
  };

  const handlePrevious = () => {
    previousStep();
    router.back();
  };

  const timelineOptions = [
    {
      value: '4',
      label: '1 Ay',
      description: 'Hızlı başlangıç ve kısa vadeli hedefler',
      icon: '⚡',
      color: theme.colors.warning,
    },
    {
      value: '12',
      label: '3 Ay',
      description: 'Kısa vadeli hedef ve görünür sonuçlar',
      icon: '🎯',
      color: theme.colors.primary,
    },
    {
      value: '24',
      label: '6 Ay',
      description: 'Orta vadeli hedef ve sağlam ilerleme',
      icon: '📈',
      color: theme.colors.info,
    },
    {
      value: '52',
      label: '1 Yıl',
      description: 'Uzun vadeli hedef ve kalıcı değişim',
      icon: '🏆',
      color: theme.colors.success,
    },
  ];

  const getTimelineDescription = () => {
    const weeks = parseInt(timeline);
    const months = Math.round(weeks / 4);

    if (weeks <= 4) {
      return `${weeks} haftalık kısa vadeli hedef`;
    } else if (weeks <= 12) {
      return `Yaklaşık ${months} aylık hedef`;
    } else if (weeks <= 24) {
      return `${months} aylık orta vadeli hedef`;
    } else if (weeks <= 52) {
      return `Yaklaşık 1 yıllık uzun vadeli hedef`;
    } else {
      return `${Math.round(weeks / 52)} yıllık uzun vadeli hedef`;
    }
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
    timelineGrid: {
      gap: theme.spacing.md,
    },
    timelineOption: {
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.lg,
      backgroundColor: theme.semanticColors.background.primary,
      flexDirection: 'row',
      alignItems: 'center',
      ...theme.shadows.sm,
    },
    timelineOptionSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: `${theme.colors.primary}10`,
    },
    timelineIcon: {
      fontSize: 32,
      marginRight: theme.spacing.lg,
    },
    timelineContent: {
      flex: 1,
    },
    timelineLabel: {
      ...theme.textStyles.labelLarge,
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    timelineLabelSelected: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    timelineDescription: {
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
      lineHeight: 24,
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
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        <View style={styles.header}>
          <Text style={styles.title}>Zaman Çizelgesi</Text>
          <Text style={styles.subtitle}>
            Hedefinize ulaşmak için bir zaman çizelgesi belirleyin.
          </Text>
        </View>

        <View style={styles.timelineGrid}>
          {timelineOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.timelineOption,
                timeline === option.value && styles.timelineOptionSelected,
              ]}
              onPress={() => setTimeline(option.value)}
            >
              <Text style={styles.timelineIcon}>{option.icon}</Text>
              <View style={styles.timelineContent}>
                <Text
                  style={[
                    styles.timelineLabel,
                    timeline === option.value && styles.timelineLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
                <Text style={styles.timelineDescription}>{option.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            {getTimelineDescription()}
          </Text>
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

export default TimelineScreen;