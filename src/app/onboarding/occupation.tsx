/**
 * CaloriTrack - Onboarding Occupation Screen
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

const OccupationScreen = () => {
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
      backgroundColor: LightTheme.semanticColors.background.primary,
    },
    content: {
      padding: LightTheme.spacing.lg,
      paddingBottom: LightTheme.spacing['4xl'],
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    title: {
      color: LightTheme.semanticColors.text.primary,
      marginBottom: LightTheme.spacing.md,
      lineHeight: 40,
      fontSize: LightTheme.typography['3xl'].fontSize,
      fontWeight: '700',
    },
    subtitle: {
      color: LightTheme.semanticColors.text.secondary,
      lineHeight: LightTheme.typography.xl.lineHeight,
      fontSize: LightTheme.typography.base.fontSize,
    },
    header: {
      marginBottom: LightTheme.spacing.xl,
    },
    section: {
      marginBottom: LightTheme.spacing['6xl'],
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
      backgroundColor: `${LightTheme.colors.primary}10`,
      shadowColor: LightTheme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
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
      fontWeight: '500',
      color: LightTheme.semanticColors.text.primary,
    },
    optionLabelSelected: {
      color: LightTheme.colors.primary,
    },
    optionDescription: {
      fontSize: LightTheme.typography.sm.fontSize,
      color: LightTheme.semanticColors.text.secondary,
      marginLeft: 36,
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

export default OccupationScreen;
