/**
 * CaloriTrack - Onboarding Name Screen
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
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import ProgressBar from '../../components/ui/progress-bar';
import { useOnboarding } from '../../context/onboarding-context';

const NameScreen = () => {
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
      border: { secondary: COLORS.border },
    },
    colors: {
      primary: COLORS.primary,
    },
    textStyles: {
      onboardingTitle: { fontSize: TYPOGRAPHY.fontSizes['3xl'], fontWeight: '600' },
      onboardingDescription: { fontSize: TYPOGRAPHY.fontSizes.base, fontWeight: '400' },
    },
    spacing: {
      ...SPACING,
      sm: SPACING[2],
      md: SPACING[3],
      lg: SPACING[4],
      xl: SPACING[5],
      '2xl': SPACING[6],
      '4xl': SPACING[12],
    },
    borderRadius: BORDER_RADIUS,
    shadows: SHADOWS,
    coloredShadows: { primary: SHADOWS.lg },
  };
  const { profile, updateProfile, nextStep, previousStep, totalSteps, getCurrentStep } = useOnboarding();

  const [name, setName] = useState(profile.name || '');
  const [isFocused, setIsFocused] = useState(false);

  const validateName = (): boolean => {
    if (!name.trim()) {
      Alert.alert('Hata', 'Lütfen adınızı girin.');
      return false;
    }

    if (name.trim().length < 2) {
      Alert.alert('Hata', 'Adınız en az 2 karakter olmalıdır.');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateName()) return;

    updateProfile({ name: name.trim() });
    nextStep();
    router.push('/onboarding/last-name');
  };

  const handlePrevious = () => {
    previousStep();
    router.back();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme?.semanticColors?.background?.primary || '#FFFFFF',
    },
    content: {
      paddingHorizontal: theme?.spacing?.['2xl'] || 24,
      paddingTop: theme?.spacing?.['4xl'] || 48,
      paddingBottom: theme?.spacing?.['4xl'] || 48,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    header: {
      marginTop: '10%',
      marginBottom: theme?.spacing?.['4xl'] || 48,
      alignItems: 'center',
    },
    title: {
      ...theme.textStyles?.onboardingTitle,
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
      marginBottom: theme?.spacing?.['4xl'] || 48,
      alignItems: 'center',
    },
    inputWrapper: {
      width: '100%',
      maxWidth: 350,
      backgroundColor: theme?.semanticColors?.background?.surface || '#F8FAFC',
      borderRadius: theme?.borderRadius?.lg || 12,
      borderWidth: 2,
      borderColor: isFocused ? (theme?.colors?.primary || '#7C3AED') : (theme?.semanticColors?.border?.secondary || '#E2E8F0'),
      ...(theme?.shadows?.md || {}),
    },
    buttonContainer: {
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
  });

  const currentStep = getCurrentStep('name');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} onBack={handlePrevious} />

          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>👤</Text>
            </View>
            <Text style={styles.title}>Adınız</Text>
            <Text style={styles.subtitle}>
              Başlamak için adınızı paylaşır mısınız? Bu bilgiyi size özel deneyim sunmak için kullanacağız.
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Input
                label=""
                value={name}
                onChangeText={setName}
                placeholder="Adınızı girin"
                autoCapitalize="words"
                autoFocus
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
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
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Devam Et"
          onPress={handleNext}
          fullWidth
          style={theme?.coloredShadows?.primary || {}}
        />
      </View>
    </SafeAreaView>
  );
};

export default NameScreen;