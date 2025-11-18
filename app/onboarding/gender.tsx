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

  // Default theme fallback - name.tsx ile uyumlu
  const defaultTheme = {
    semanticColors: {
      background: { primary: '#FFFFFF', surface: '#F8FAFC', primarySurface: '#EDE9FE' },
      text: {
        primary: '#1E293B',
        secondary: '#475569',
        tertiary: '#64748B',
        onPrimary: '#FFFFFF'
      },
      border: { primary: '#E2E8F0', secondary: '#E2E8F0' },
    },
    colors: {
      primary: '#7C3AED',
      gradientStart: '#7C3AED',
      gradientEnd: '#EC4899',
    },
    textStyles: {
      onboardingTitle: { fontSize: 30, fontWeight: '600' },
      onboardingDescription: { fontSize: 16, fontWeight: '400' },
      heading2: { fontSize: 28, fontWeight: '600' },
      heading4: { fontSize: 20, fontWeight: '600' },
      body: { fontSize: 16, fontWeight: '400' },
      bodySmall: { fontSize: 14, fontWeight: '400' },
    },
    typography: { lineHeight: { relaxed: 24 } },
    spacing: { lg: 24, md: 16, xl: 32, xs: 4, '3xl': 40, sm: 8, '4xl': 48, '2xl': 24 },
    borderRadius: { full: 9999, xl: 16, lg: 12, sm: 8 },
    shadows: { lg: {}, md: {}, sm: {} },
    coloredShadows: { primary: {} },
  };

  const theme = themeResult || defaultTheme;
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
      backgroundColor: theme?.semanticColors?.background?.primary || '#FFFFFF',
    },
    content: {
      flex: 1,
      paddingHorizontal: theme?.spacing?.['2xl'] || 24,
      justifyContent: 'flex-start',
    },
    header: {
      marginTop: '10%',
      marginBottom: theme?.spacing?.['4xl'] || 48,
      alignItems: 'center',
    },
    title: {
      ...(theme?.textStyles?.onboardingTitle || {}),
      color: theme?.semanticColors?.text?.primary || '#1E293B',
      marginBottom: theme?.spacing?.md || 16,
      textAlign: 'center',
      lineHeight: 40,
      fontSize: 32,
      fontWeight: '700',
    },
    subtitle: {
      ...(theme?.textStyles?.onboardingDescription || {}),
      color: theme?.semanticColors?.text?.secondary || '#475569',
      textAlign: 'center',
      lineHeight: 24,
      maxWidth: 300,
    },
    genderContainer: {
      gap: theme?.spacing?.md || 16,
      marginBottom: theme?.spacing?.['4xl'] || 48,
      width: '100%',
      maxWidth: 350,
      alignSelf: 'center',
    },
    genderOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme?.spacing?.lg || 24,
      borderWidth: 2,
      borderColor: theme?.semanticColors?.border?.secondary || '#E2E8F0',
      borderRadius: theme?.borderRadius?.lg || 12,
      backgroundColor: theme?.semanticColors?.background?.primary || '#FFFFFF',
      ...(theme?.shadows?.md || {}),
    },
    genderOptionSelected: {
      borderColor: theme?.colors?.primary || '#7C3AED',
      backgroundColor: `${theme?.colors?.primary || '#7C3AED'}10`,
    },
    genderIcon: {
      fontSize: 32,
      marginRight: theme?.spacing?.lg || 24,
    },
    genderContent: {
      flex: 1,
    },
    genderLabel: {
      ...(theme?.textStyles?.heading4 || {}),
      color: theme?.semanticColors?.text?.primary || '#1E293B',
      marginBottom: theme?.spacing?.xs || 4,
    },
    genderLabelSelected: {
      color: theme?.colors?.primary || '#7C3AED',
    },
    genderDescription: {
      ...(theme?.textStyles?.bodySmall || {}),
      color: theme?.semanticColors?.text?.secondary || '#475569',
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: theme?.spacing?.md || 16,
      paddingHorizontal: theme?.spacing?.['2xl'] || 24,
      paddingBottom: theme?.spacing?.['4xl'] || 48,
      paddingTop: theme?.spacing?.xl || 32,
      backgroundColor: theme?.semanticColors?.background?.primary || '#FFFFFF',
      borderTopLeftRadius: theme?.borderRadius?.xl || 16,
      borderTopRightRadius: theme?.borderRadius?.xl || 16,
      ...(theme?.shadows?.lg || {}),
    },
    progressIndicator: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: theme?.spacing?.['2xl'] || 24,
      alignItems: 'center',
      paddingTop: '5%',
      marginTop: '15%',
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: theme?.borderRadius?.full || 9999,
      backgroundColor: theme?.semanticColors?.border?.secondary || '#E2E8F0',
      marginHorizontal: 4,
    },
    dotActive: {
      backgroundColor: theme?.colors?.primary || '#7C3AED',
      width: 32,
      height: 8,
      borderRadius: theme?.borderRadius?.sm || 8,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: theme?.borderRadius?.full || 9999,
      backgroundColor: theme?.semanticColors?.background?.primarySurface || '#EDE9FE',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme?.spacing?.['2xl'] || 24,
      ...(theme?.coloredShadows?.primary || {}),
    },
    iconText: {
      fontSize: 32,
      fontWeight: '700',
      color: theme?.semanticColors?.text?.onPrimary || '#FFFFFF',
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

export default GenderScreen;