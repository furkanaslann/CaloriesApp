/**
 * CaloriTrack - Onboarding Gender Screen
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
import { useOnboarding } from '../../context/onboarding-context';

const GenderScreen = () => {
  const { profile, updateProfile, nextStep, previousStep, totalSteps, getCurrentStep } = useOnboarding();

  const [gender, setGender] = useState<'male' | 'female' | 'other'>(
    profile.gender || 'male'
  );

  const handleNext = () => {
    updateProfile({ gender });
    nextStep();
    router.push('/onboarding/height');
  };

  const handlePrevious = () => {
    previousStep();
    router.back();
  };

  const genderOptions = [
    { value: 'male' as const, label: 'Erkek', icon: '👨', description: 'Erkek' },
    { value: 'female' as const, label: 'Kadın', icon: '👩', description: 'Kadın' },
    { value: 'other' as const, label: 'Diğer', icon: '👤', description: 'Diğer' },
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
      paddingHorizontal: LightTheme.spacing['2xl'],
      paddingTop: LightTheme.spacing.lg,
      paddingBottom: LightTheme.spacing['4xl'],
    },
    header: {
      marginTop: '10%',
      marginBottom: LightTheme.spacing['4xl'],
      alignItems: 'center',
    },
    title: {
      fontSize: LightTheme.typography['3xl'].fontSize,
      fontWeight: '700',
      color: LightTheme.semanticColors.text.primary,
      marginBottom: LightTheme.spacing.md,
      textAlign: 'center',
      lineHeight: LightTheme.typography['3xl'].lineHeight,
    },
    subtitle: {
      fontSize: LightTheme.typography.base.fontSize,
      fontWeight: '400',
      color: LightTheme.semanticColors.text.secondary,
      textAlign: 'center',
      lineHeight: LightTheme.typography.base.lineHeight,
      maxWidth: 300,
    },
    genderContainer: {
      gap: LightTheme.spacing.md,
      marginBottom: LightTheme.spacing['4xl'],
      width: '100%',
      maxWidth: 350,
      alignSelf: 'center',
    },
    genderOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: LightTheme.spacing.lg,
      borderWidth: 2,
      borderColor: LightTheme.semanticColors.border.primary,
      borderRadius: LightTheme.borderRadius.lg,
      backgroundColor: LightTheme.semanticColors.background.primary,
      ...LightTheme.shadows.md,
    },
    genderOptionSelected: {
      borderColor: LightTheme.colors.primary,
      backgroundColor: `${LightTheme.colors.primary}10`,
    },
    genderIcon: {
      fontSize: 32,
      marginRight: LightTheme.spacing.lg,
    },
    genderContent: {
      flex: 1,
    },
    genderLabel: {
      fontSize: LightTheme.typography.xl.fontSize,
      fontWeight: '600',
      color: LightTheme.semanticColors.text.primary,
      marginBottom: LightTheme.spacing.xs,
    },
    genderLabelSelected: {
      color: LightTheme.colors.primary,
    },
    genderDescription: {
      fontSize: LightTheme.typography.sm.fontSize,
      fontWeight: '400',
      color: LightTheme.semanticColors.text.secondary,
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
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: LightTheme.borderRadius.full,
      backgroundColor: LightTheme.colors.primaryLight + '25',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: LightTheme.spacing['2xl'],
      ...LightTheme.shadows.lg,
    },
    iconText: {
      fontSize: 32,
      fontWeight: '700',
      color: LightTheme.semanticColors.text.onPrimary,
    },
  });

  const currentStep = getCurrentStep('gender');

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} onBack={handlePrevious} />

          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>⚧️</Text>
            </View>
            <Text style={styles.title}>Cinsiyetiniz</Text>
            <Text style={styles.subtitle}>
              Cinsiyetiniz, metabolik hesaplamalar için önemlidir.
            </Text>
          </View>

          <View style={styles.genderContainer}>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.genderOption,
                  gender === option.value && styles.genderOptionSelected,
                ]}
                onPress={() => setGender(option.value)}
              >
                <Text style={styles.genderIcon}>{option.icon}</Text>
                <View style={styles.genderContent}>
                  <Text
                    style={[
                      styles.genderLabel,
                      gender === option.value && styles.genderLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text style={styles.genderDescription}>
                    {option.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
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

export default GenderScreen;
