/**
 * CaloriTrack - Onboarding Occupation Screen
 * Minimal. Cool. Aesthetic.
 */

import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Button from '../../components/ui/button';
import { useOnboarding } from '../../contexts/onboarding-context';
import { useTheme } from '../../src/theme';

const OccupationScreen = () => {
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
      labelMedium: { fontSize: 15, fontWeight: '500' },
      caption: { fontSize: 12, fontWeight: '400' },
    },
    typography: { lineHeight: { relaxed: 1.75 } },
    spacing: { lg: 24, md: 16, xl: 32, '4xl': 48, '3xl': 40, '2xl': 24, sm: 8, xs: 4 },
    borderRadius: { full: 9999, xl: 16, lg: 12, md: 10, sm: 8 },
    shadows: { lg: {}, md: {}, sm: {} },
  };
  const { activity, updateActivity, nextStep, previousStep, totalSteps, getCurrentStep } = useOnboarding();

  const [occupation, setOccupation] = useState<string>(activity.occupation || 'office');

  const currentStep = getCurrentStep('occupation');

  const handleNext = () => {
    updateActivity({
      occupation: occupation as 'office' | 'physical' | 'mixed'
    });
    nextStep();
    router.push('/onboarding/exercise-types');
  };

  const handlePrevious = () => {
    previousStep();
    router.back();
  };

  const occupationTypes = [
    {
      value: 'office',
      label: 'Ofis İşleri',
      description: 'Masa başı, bilgisayar başında çalışıyorum',
      icon: '💻',
    },
    {
      value: 'physical',
      label: 'Fiziksel İş',
      description: 'Ayakta, fiziksel çaba gerektiren iş',
      icon: '🏗️',
    },
    {
      value: 'mixed',
      label: 'Karma',
      description: 'Hem ofis hem fiziksel aktivite',
      icon: '🔄',
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
      marginLeft: 36,
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
            <Text style={styles.title}>Mesleğiniz</Text>
            <Text style={styles.subtitle}>
              Mesleki aktivitenizi belirtin. Bu bilgiler günlük kalori ihtiyacınızı daha doğru hesaplamamıza yardımcı olacaktır.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.optionGrid}>
              {occupationTypes.map((occupationType) => (
                <TouchableOpacity
                  key={occupationType.value}
                  style={[
                    styles.optionCard,
                    occupation === occupationType.value && styles.optionCardSelected,
                  ]}
                  onPress={() => setOccupation(occupationType.value)}
                >
                  <View style={styles.optionHeader}>
                    <Text style={styles.optionIcon}>{occupationType.icon}</Text>
                    <Text
                      style={[
                        styles.optionLabel,
                        occupation === occupationType.value && styles.optionLabelSelected,
                      ]}
                    >
                      {occupationType.label}
                    </Text>
                  </View>
                  <Text style={styles.optionDescription}>{occupationType.description}</Text>
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
        />
      </View>
    </SafeAreaView>
  );
};

export default OccupationScreen;