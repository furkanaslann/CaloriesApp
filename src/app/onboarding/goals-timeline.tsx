/**
 * CaloriTrack - Onboarding Timeline Screen
 * Minimal. Cool. Aesthetic.
 */

import { LightTheme } from '@/constants';
import { router } from 'expo-router';
import React, { useState } from 'react';
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

const TimelineScreen = () => {
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
      color: LightTheme.colors.warning,
    },
    {
      value: '12',
      label: '3 Ay',
      description: 'Kısa vadeli hedef ve görünür sonuçlar',
      icon: '🎯',
      color: LightTheme.colors.primary,
    },
    {
      value: '24',
      label: '6 Ay',
      description: 'Orta vadeli hedef ve sağlam ilerleme',
      icon: '📈',
      color: LightTheme.colors.info,
    },
    {
      value: '52',
      label: '1 Yıl',
      description: 'Uzun vadeli hedef ve kalıcı değişim',
      icon: '🏆',
      color: LightTheme.colors.success,
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
    timelineGrid: {
      gap: LightTheme.spacing.md,
    },
    timelineOption: {
      borderWidth: 1,
      borderColor: LightTheme.semanticColors.border.primary,
      borderRadius: LightTheme.borderRadius.md,
      padding: LightTheme.spacing.lg,
      backgroundColor: LightTheme.semanticColors.background.primary,
      flexDirection: 'row',
      alignItems: 'center',
      ...LightTheme.shadows.sm,
    },
    timelineOptionSelected: {
      borderColor: LightTheme.colors.primary,
    },
    timelineIcon: {
      fontSize: 32,
      marginRight: LightTheme.spacing.lg,
    },
    timelineContent: {
      flex: 1,
    },
    timelineLabel: {
      fontSize: LightTheme.typography.lg.fontSize,
      color: LightTheme.semanticColors.text.primary,
      marginBottom: LightTheme.spacing.xs,
    },
    timelineLabelSelected: {
      color: LightTheme.colors.primary,
      fontWeight: '600',
    },
    timelineDescription: {
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
      lineHeight: 24,
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

export default TimelineScreen;