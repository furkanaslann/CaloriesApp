/**
 * CaloriTrack - Onboarding Gender Screen
 * Minimal. Cool. Aesthetic.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../src/theme/index';
import { useOnboarding } from '../../contexts/onboarding-context';
import Button from '../../components/ui/button';

const GenderScreen = () => {
  const themeResult = useTheme();
  const theme = themeResult || {
    semanticColors: {
      background: { primary: '#FFFFFF', surface: '#F8FAFC' },
      text: { primary: '#1E293B', secondary: '#475569', tertiary: '#64748B' },
      border: { primary: '#E2E8F0', secondary: '#E2E8F0' },
    },
    colors: { primary: '#7C3AED' },
    textStyles: {
      heading2: { fontSize: 28, fontWeight: '600' },
      heading4: { fontSize: 20, fontWeight: '600' },
      body: { fontSize: 16, fontWeight: '400' },
      bodySmall: { fontSize: 14, fontWeight: '400' },
    },
    typography: { lineHeight: { relaxed: 24 } },
    spacing: { lg: 24, md: 16, xl: 32, xs: 4, '3xl': 40, sm: 8 },
    borderRadius: { lg: 12 },
    shadows: { sm: {} },
  };
  const { profile, updateProfile, nextStep, previousStep } = useOnboarding();

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
      backgroundColor: theme.semanticColors.background.primary,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
      justifyContent: 'center',
    },
    header: {
      marginBottom: theme.spacing['3xl'],
    },
    title: {
      ...theme.textStyles.heading2,
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    subtitle: {
      ...theme.textStyles.body,
      color: theme.semanticColors.text.secondary,
      textAlign: 'center',
      lineHeight: theme.typography.lineHeight.relaxed,
    },
    genderContainer: {
      gap: theme.spacing.md,
      marginBottom: theme.spacing['3xl'],
    },
    genderOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.semanticColors.background.primary,
      ...theme.shadows.sm,
    },
    genderOptionSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: `${theme.colors.primary}10`,
    },
    genderIcon: {
      fontSize: 40,
      marginRight: theme.spacing.lg,
    },
    genderContent: {
      flex: 1,
    },
    genderLabel: {
      ...theme.textStyles.heading4,
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    genderLabelSelected: {
      color: theme.colors.primary,
    },
    genderDescription: {
      ...theme.textStyles.bodySmall,
      color: theme.semanticColors.text.secondary,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
    progressIndicator: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: theme.spacing.xl,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.semanticColors.border.primary,
      marginHorizontal: 4,
    },
    dotActive: {
      backgroundColor: theme.colors.primary,
      width: 24,
    },
  });

  const totalSteps = 9;
  const currentStep = 4;

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

export default GenderScreen;