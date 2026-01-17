/**
 * CaloriTrack - Onboarding Height Screen
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

const HeightScreen = () => {
  // Modern theme system using constants
  const theme = {
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
    },
    textStyles: {
      onboardingTitle: { fontSize: 30, fontWeight: '600' },
      onboardingDescription: { fontSize: 16, fontWeight: '400' },
      body: { fontSize: 16, fontWeight: '400' },
      labelLarge: { fontSize: 18, fontWeight: '500' },
      buttonMedium: { fontSize: 16, fontWeight: '500' },
    },
    spacing: { lg: 24, md: 16, xl: 32, '4xl': 48, '2xl': 24, sm: 8 },
    borderRadius: { full: 9999, xl: 16, lg: 12, sm: 8 },
    shadows: { lg: {}, md: {}, sm: {} },
    coloredShadows: { primary: {} },
  };
  const { profile, updateProfile, nextStep, previousStep, totalSteps, getCurrentStep } = useOnboarding();

  const [height, setHeight] = useState(profile.height?.toString() || '');
  const [isFocused, setIsFocused] = useState(false);

  const validateHeight = (): boolean => {
    const heightValue = parseFloat(height);

    if (!height || isNaN(heightValue)) {
      Alert.alert('Hata', 'Lütfen geçerli bir boy değeri girin.');
      return false;
    }

    if (heightValue < 100 || heightValue > 250) {
      Alert.alert('Hata', 'Boy değeri 100-250 cm aralığında olmalıdır.');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateHeight()) return;

    updateProfile({ height: parseFloat(height) });
    nextStep();
    router.push('/onboarding/weight');
  };

  const handlePrevious = () => {
    previousStep();
    router.back();
  };

  const commonHeights = [150, 160, 165, 170, 175, 180, 185, 190, 195];

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
      paddingTop: theme?.spacing?.lg || 16,
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
      maxWidth: 200,
      backgroundColor: theme?.semanticColors?.background?.surface || '#F8FAFC',
      borderRadius: theme?.borderRadius?.lg || 12,
      borderWidth: 2,
      borderColor: isFocused ? (theme?.colors?.primary || '#7C3AED') : (theme?.semanticColors?.border?.secondary || '#E2E8F0'),
      alignItems: 'center',
      ...(theme?.shadows?.md || {}),
    },
    inputSuffix: {
      ...(theme?.textStyles?.body || {}),
      color: theme?.semanticColors?.text?.secondary || '#475569',
      marginLeft: theme?.spacing?.sm || 8,
      fontWeight: '500',
    },
    quickSelectContainer: {
      marginBottom: theme?.spacing?.['2xl'] || 24,
    },
    quickSelectLabel: {
      ...(theme?.textStyles?.labelLarge || {}),
      color: theme?.semanticColors?.text?.secondary || '#475569',
      marginBottom: theme?.spacing?.lg || 24,
      textAlign: 'center',
    },
    quickSelectGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: theme?.spacing?.sm || 8,
    },
    quickSelectButton: {
      paddingHorizontal: theme?.spacing?.lg || 24,
      paddingVertical: theme?.spacing?.md || 16,
      borderWidth: 2,
      borderColor: theme?.semanticColors?.border?.secondary || '#E2E8F0',
      borderRadius: theme?.borderRadius?.lg || 12,
      backgroundColor: theme?.semanticColors?.background?.surface || '#F8FAFC',
      minWidth: 70,
      alignItems: 'center',
      ...(theme?.shadows?.sm || {}),
    },
    quickSelectButtonSelected: {
      borderColor: theme?.colors?.primary || '#7C3AED',
      backgroundColor: theme?.semanticColors?.background?.primarySurface || '#EDE9FE',
      ...(theme?.coloredShadows?.primary || {}),
    },
    quickSelectText: {
      ...(theme?.textStyles?.buttonMedium || {}),
      color: theme?.semanticColors?.text?.primary || '#1E293B',
      fontWeight: '500',
    },
    quickSelectTextSelected: {
      color: theme?.semanticColors?.text?.onPrimary || '#FFFFFF',
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
  });

  const currentStep = getCurrentStep('height');

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} onBack={handlePrevious} />

          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>📏</Text>
            </View>
            <Text style={styles.title}>Boyunuz</Text>
            <Text style={styles.subtitle}>
              Boyunuzu girerek kişisel hedeflerinizi daha doğru belirleyebiliriz.
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Input
                label=""
                value={height}
                onChangeText={setHeight}
                placeholder="175"
                keyboardType="numeric"
                autoFocus
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                style={{
                  borderWidth: 0,
                  backgroundColor: 'transparent',
                  fontSize: 24,
                  fontWeight: '600',
                  textAlign: 'center',
                  minWidth: 100,
                }}
              />
              <Text style={styles.inputSuffix}>cm</Text>
            </View>
          </View>

          <View style={styles.quickSelectContainer}>
            <Text style={styles.quickSelectLabel}>Yaygın Boy Seçenekleri</Text>
            <View style={styles.quickSelectGrid}>
              {commonHeights.map((h) => (
                <TouchableOpacity
                  key={h}
                  style={[
                    styles.quickSelectButton,
                    height === h.toString() && styles.quickSelectButtonSelected,
                  ]}
                  onPress={() => setHeight(h.toString())}
                >
                  <Text
                    style={[
                      styles.quickSelectText,
                      height === h.toString() && styles.quickSelectTextSelected,
                    ]}
                  >
                    {h}
                  </Text>
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
          style={theme?.coloredShadows?.primary || {}}
        />
      </View>
    </SafeAreaView>
  );
};

export default HeightScreen;