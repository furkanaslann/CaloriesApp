/**
 * CaloriTrack - Onboarding Weight Screen
 * Minimal. Cool. Aesthetic.
 */

import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import { useOnboarding, SCREEN_STEPS } from '../../contexts/onboarding-context';
import { useTheme } from '../../src/theme/index';

const WeightScreen = () => {
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
      body: { fontSize: 16, fontWeight: '400' },
      bodySmall: { fontSize: 14, fontWeight: '400' },
      labelMedium: { fontSize: 15, fontWeight: '500' },
    },
    typography: { lineHeight: { relaxed: 24 }, fontWeight: { semibold: '600' } },
    spacing: { lg: 24, md: 16, xl: 32, sm: 8, '3xl': 40, '4xl': 48, '2xl': 24 },
    borderRadius: { full: 9999, xl: 16, lg: 12, sm: 8, md: 10 },
    shadows: { lg: {}, md: {}, sm: {} },
    coloredShadows: { primary: {} },
  };

  const theme = themeResult || defaultTheme;
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

export default WeightScreen;