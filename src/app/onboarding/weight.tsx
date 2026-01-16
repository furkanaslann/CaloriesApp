/**
 * CaloriTrack - Onboarding Weight Screen
 * Minimal. Cool. Aesthetic.
 */

import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import ProgressBar from '../../components/ui/progress-bar';
import { useOnboarding } from '../../context/onboarding-context';

const WeightScreen = () => {
  // Modern theme system using constants

  // Theme object using constants
  const theme = {
    semanticColors: {
      background: { primary: COLORS.background, surface: COLORS.surfaceAlt, primarySurface: COLORS.primaryLight + '25' },
      text: {
        primary: COLORS.textPrimary,
        secondary: COLORS.textSecondary,
        tertiary: COLORS.textTertiary,
        onPrimary: '#FFFFFF'
      },
      border: { primary: COLORS.border, secondary: COLORS.border },
    },
    colors: {
      primary: COLORS.primary,
      gradientStart: COLORS.gradientStart,
      gradientEnd: COLORS.gradientEnd,
    },
    textStyles: {
      onboardingTitle: { fontSize: TYPOGRAPHY.fontSizes['3xl'], fontWeight: '600' },
      onboardingDescription: { fontSize: TYPOGRAPHY.fontSizes.base, fontWeight: '400' },
      heading2: { fontSize: TYPOGRAPHY.fontSizes['2xl'], fontWeight: '600' },
      body: { fontSize: TYPOGRAPHY.fontSizes.base, fontWeight: '400' },
      bodySmall: { fontSize: TYPOGRAPHY.fontSizes.sm, fontWeight: '400' },
      labelMedium: { fontSize: 15, fontWeight: '500' },
    },
    typography: { lineHeight: { relaxed: TYPOGRAPHY.lineHeights.relaxed }, fontWeight: { semibold: '600' } },
    spacing: {
      ...SPACING,
      sm: SPACING[2],
      md: SPACING[3],
      lg: SPACING[4],
      xl: SPACING[5],
      '2xl': SPACING[6],
      '3xl': SPACING[10],
      '4xl': SPACING[12],
    },
    borderRadius: BORDER_RADIUS,
    shadows: SHADOWS,
    coloredShadows: { primary: SHADOWS.lg },
  };
  const { profile, updateProfile, nextStep, previousStep, totalSteps, getCurrentStep } = useOnboarding();

  const [weight, setWeight] = useState(profile.currentWeight?.toString() || '');

  const validateWeight = (): boolean => {
    const weightValue = parseFloat(weight);

    if (!weight || isNaN(weightValue)) {
      Alert.alert('Hata', 'Lütfen geçerli bir kilo değeri girin.');
      return false;
    }

    if (weightValue < 30 || weightValue > 300) {
      Alert.alert('Hata', 'Kilo değeri 30-300 kg aralığında olmalıdır.');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateWeight()) return;

    updateProfile({ currentWeight: parseFloat(weight) });
    nextStep();
    router.push('/onboarding/profile-photo');
  };

  const handlePrevious = () => {
    previousStep();
    router.back();
  };

  const commonWeights = [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme?.semanticColors?.background?.primary || '#FFFFFF',
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    content: {
      paddingHorizontal: theme?.spacing?.['2xl'] || 24,
      paddingTop: theme?.spacing?.['4xl'] || 48,
      paddingBottom: theme?.spacing?.['4xl'] || 48,
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
    inputContainer: {
      marginBottom: theme?.spacing?.['2xl'] || 24,
      alignItems: 'center',
    },
    inputWrapper: {
      width: '100%',
      maxWidth: 350,
      backgroundColor: theme?.semanticColors?.background?.surface || '#F8FAFC',
      borderRadius: theme?.borderRadius?.lg || 12,
      borderWidth: 2,
      borderColor: theme?.semanticColors?.border?.secondary || '#E2E8F0',
      ...(theme?.shadows?.md || {}),
    },
    quickSelectContainer: {
      marginBottom: theme?.spacing?.['2xl'] || 24,
    },
    quickSelectLabel: {
      ...(theme?.textStyles?.labelMedium || {}),
      color: theme?.semanticColors?.text?.secondary || '#475569',
      marginBottom: theme?.spacing?.md || 16,
      textAlign: 'center',
    },
    quickSelectGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: theme?.spacing?.sm || 8,
    },
    quickSelectButton: {
      paddingHorizontal: theme?.spacing?.md || 16,
      paddingVertical: theme?.spacing?.sm || 8,
      borderWidth: 2,
      borderColor: theme?.semanticColors?.border?.secondary || '#E2E8F0',
      borderRadius: theme?.borderRadius?.md || 10,
      backgroundColor: theme?.semanticColors?.background?.primary || '#FFFFFF',
      minWidth: 60,
      alignItems: 'center',
    },
    quickSelectButtonSelected: {
      borderColor: theme?.colors?.primary || '#7C3AED',
      backgroundColor: `${theme?.colors?.primary || '#7C3AED'}10`,
    },
    quickSelectText: {
      ...(theme?.textStyles?.labelMedium || {}),
      color: theme?.semanticColors?.text?.primary || '#1E293B',
    },
    quickSelectTextSelected: {
      color: theme?.colors?.primary || '#7C3AED',
      fontWeight: '600',
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
    infoText: {
      ...(theme?.textStyles?.bodySmall || {}),
      color: theme?.semanticColors?.text?.secondary || '#475569',
      textAlign: 'center',
      marginTop: theme?.spacing?.md || 16,
    },
  });

  const currentStep = getCurrentStep('weight');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} onBack={handlePrevious} />

          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>⚖️</Text>
            </View>
            <Text style={styles.title}>Kilonuz</Text>
            <Text style={styles.subtitle}>
              Mevcut kilonuzu kilogram cinsinden girin.
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Input
                label=""
                value={weight}
                onChangeText={setWeight}
                placeholder="Örn: 70"
                keyboardType="numeric"
                autoFocus
                style={{
                  borderWidth: 0,
                  backgroundColor: 'transparent',
                  fontSize: 18,
                  fontWeight: '500',
                  paddingVertical: theme?.spacing?.lg || 24,
                }}
              />
            </View>
          </View>

          <View style={styles.quickSelectContainer}>
            <Text style={styles.quickSelectLabel}>Hızlı Seçim</Text>
            <View style={styles.quickSelectGrid}>
              {commonWeights.map((w) => (
                <TouchableOpacity
                  key={w}
                  style={[
                    styles.quickSelectButton,
                    weight === w.toString() && styles.quickSelectButtonSelected,
                  ]}
                  onPress={() => setWeight(w.toString())}
                >
                  <Text
                    style={[
                      styles.quickSelectText,
                      weight === w.toString() && styles.quickSelectTextSelected,
                    ]}
                  >
                    {w}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Text
            style={[
              styles.infoText,
              {
                ...(theme?.textStyles?.bodySmall || {}),
                color: theme?.semanticColors?.text?.secondary || '#475569',
                fontSize: 14,
                fontWeight: '400',
                lineHeight: 20,
              }
            ]}
          >
            Bu bilgi, günlük kalori ihtiyacınızı hesaplamak için kullanılacaktır.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Devam Et"
          onPress={handleNext}
          style={theme?.coloredShadows?.primary || {}}
        />
      </View>
    </SafeAreaView>
  );
};

export default WeightScreen;