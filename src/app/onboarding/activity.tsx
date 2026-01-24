/**
 * CaloriTrack - Onboarding Activity Level Screen
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
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/button';
import ProgressBar from '../../components/ui/progress-bar';
import { useOnboarding, SCREEN_STEPS } from '../../context/onboarding-context';

const ActivityScreen = () => {
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
      alignItems: 'center',
      marginBottom: LightTheme.spacing['4xl'],
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
      fontSize: 12,
      fontWeight: '400',
      color: LightTheme.semanticColors.text.secondary,
      marginLeft: 36,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: LightTheme.spacing.md,
      paddingHorizontal: LightTheme.spacing['2xl'],
      paddingBottom: LightTheme.spacing['4xl'],
      paddingTop: LightTheme.spacing.xl,
      backgroundColor: LightTheme.semanticColors.background.primary,
      borderTopLeftRadius: LightTheme.borderRadius.xl,
      borderTopRightRadius: LightTheme.borderRadius.xl,
      ...LightTheme.shadows.lg,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} onBack={handlePrevious} />

          <View style={styles.header}>
              <Text style={styles.title}>Aktivite Seviyeniz</Text>
              <Text style={styles.subtitle}>
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
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Devam Et"
          onPress={handleNext}
          fullWidth
          style={LightTheme.shadows.lg}
        />
      </View>
    </SafeAreaView>
  );
};

export default ActivityScreen;
