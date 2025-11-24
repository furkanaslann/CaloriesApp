/**
 * CaloriTrack - Onboarding Activity Level Screen
 * Minimal. Cool. Aesthetic.
 */

import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/button';
import { useOnboarding, SCREEN_STEPS } from '../../context/onboarding-context';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme';

const ActivityScreen = () => {
  // Modern theme system using constants
  const theme = {
    semanticColors: {
      background: { primary: '#FFFFFF', surface: '#F8FAFC', primarySurface: '#EDE9FE' },
      text: { primary: '#1E293B', secondary: '#475569', tertiary: '#64748B', onPrimary: '#FFFFFF' },
      border: { primary: '#E2E8F0', secondary: '#E2E8F0' },
    },
    colors: { primary: '#7C3AED', success: '#10B981', warning: '#F59E0B', info: '#3B82F6' },
    textStyles: {
      onboardingTitle: { fontSize: 30, fontWeight: '600' },
      onboardingDescription: { fontSize: 16, fontWeight: '400' },
      heading3: { fontSize: 24, fontWeight: '600' },
      body: { fontSize: 16, fontWeight: '400' },
      bodySmall: { fontSize: 14, fontWeight: '400' },
      labelLarge: { fontSize: 18, fontWeight: '500' },
      labelMedium: { fontSize: 15, fontWeight: '500' },
      caption: { fontSize: 12, fontWeight: '400' },
    },
    typography: { lineHeight: { relaxed: 24 }, fontWeight: { semibold: '600' } },
    spacing: { lg: 24, md: 16, xl: 32, '4xl': 48, '3xl': 40, '2xl': 24, sm: 8, xs: 4 },
    borderRadius: { full: 9999, xl: 16, lg: 12, md: 10, sm: 8 },
    shadows: { lg: {}, md: {}, sm: {} },
    coloredShadows: { primary: {} },
  };
  const { activity, updateActivity, nextStep, previousStep, totalSteps, getCurrentStep } = useOnboarding();

  const [level, setLevel] = useState(activity.level || 'sedentary');

  const currentStep = getCurrentStep('activity');

  const handleNext = () => {
    updateActivity({
      level: level as 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active'
    });
    nextStep();
    router.push('/onboarding/occupation');
  };

  const handlePrevious = () => {
    previousStep();
    router.back();
  };

  const activityLevels = [
    {
      value: 'sedentary',
      label: 'Hareketsiz',
      description: 'Çok az veya hiç egzersiz yapmıyorum, masa başı iş',
      icon: '🪑',
    },
    {
      value: 'lightly_active',
      label: 'Hafif Aktif',
      description: 'Haftada 1-3 gün hafif egzersiz',
      icon: '🚶',
    },
    {
      value: 'moderately_active',
      label: 'Orta Aktif',
      description: 'Haftada 3-5 gün orta egzersiz',
      icon: '🏃',
    },
    {
      value: 'very_active',
      label: 'Çok Aktif',
      description: 'Haftada 6-7 gün yoğun egzersiz',
      icon: '💪',
    },
    {
      value: 'extremely_active',
      label: 'Son Derece Aktif',
      description: 'Günlük çok yoğun fiziksel aktivite',
      icon: '🔥',
    },
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
      fontSize: 32,
      fontWeight: '700',
    },
    subtitle: {
      ...theme.textStyles.body,
      color: theme.semanticColors.text.secondary,
      lineHeight: theme.typography.lineHeight.relaxed,
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing['4xl'],
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
      fontWeight: theme.typography.fontWeight.semibold,
    },
    optionLabelSelected: {
      color: theme.colors.primary,
    },
    optionDescription: {
      ...(theme?.textStyles?.caption || { fontSize: 12, fontWeight: '400' }),
      color: theme?.semanticColors?.text?.secondary || '#475569',
      marginLeft: 36,
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing['2xl'],
      paddingBottom: theme.spacing['4xl'],
      paddingTop: theme.spacing.xl,
      backgroundColor: theme.semanticColors.background.primary,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      ...theme.shadows.lg,
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
            <Text style={styles.title}>Aktivite Seviyeniz</Text>
            <Text
              style={[
                styles.subtitle,
                {
                  ...(theme?.textStyles?.bodySmall || {}),
                  color: theme?.semanticColors?.text?.secondary || '#475569',
                  fontSize: 16,
                  fontWeight: '400',
                  lineHeight: 24,
                }
              ]}
            >
              Genel aktivite seviyenizi belirtin. Bu bilgi, günlük kalori ihtiyacınızı hesaplamamıza yardımcı olacaktır.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.optionGrid}>
              {activityLevels.map((activityLevel) => (
                <TouchableOpacity
                  key={activityLevel.value}
                  style={[
                    styles.optionCard,
                    level === activityLevel.value && styles.optionCardSelected,
                  ]}
                  onPress={() => setLevel(activityLevel.value)}
                >
                  <View style={styles.optionHeader}>
                    <Text style={styles.optionIcon}>{activityLevel.icon}</Text>
                    <Text
                      style={[
                        styles.optionLabel,
                        level === activityLevel.value && styles.optionLabelSelected,
                      ]}
                    >
                      {activityLevel.label}
                    </Text>
                  </View>
                  <Text style={styles.optionDescription}>{activityLevel.description}</Text>
                </TouchableOpacity>
              ))}
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
          style={theme?.coloredShadows?.primary || {}}
        />
      </View>
    </SafeAreaView>
  );
};

export default ActivityScreen;