/**
 * CaloriTrack - Onboarding Height Screen
 * Minimal. Cool. Aesthetic.
 */

import { LightTheme } from '@/constants';
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
    inputContainer: {
      marginBottom: LightTheme.spacing['2xl'],
      alignItems: 'center',
    },
    inputWrapper: {
      width: '100%',
      maxWidth: 200,
      backgroundColor: LightTheme.semanticColors.background.secondary,
      borderRadius: LightTheme.borderRadius.lg,
      borderWidth: 2,
      borderColor: isFocused ? LightTheme.colors.primary : LightTheme.semanticColors.border.primary,
      alignItems: 'center',
      ...LightTheme.shadows.md,
    },
    inputSuffix: {
      fontSize: LightTheme.typography.base.fontSize,
      color: LightTheme.semanticColors.text.secondary,
      marginLeft: LightTheme.spacing.sm,
      fontWeight: '500',
    },
    quickSelectContainer: {
      marginBottom: LightTheme.spacing['2xl'],
    },
    quickSelectLabel: {
      fontSize: LightTheme.typography.lg.fontSize,
      fontWeight: '500',
      color: LightTheme.semanticColors.text.secondary,
      marginBottom: LightTheme.spacing.lg,
      textAlign: 'center',
    },
    quickSelectGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: LightTheme.spacing.sm,
    },
    quickSelectButton: {
      paddingHorizontal: LightTheme.spacing.lg,
      paddingVertical: LightTheme.spacing.md,
      borderWidth: 2,
      borderColor: LightTheme.semanticColors.border.primary,
      borderRadius: LightTheme.borderRadius.lg,
      backgroundColor: LightTheme.semanticColors.background.secondary,
      minWidth: 70,
      alignItems: 'center',
      ...LightTheme.shadows.sm,
    },
    quickSelectButtonSelected: {
      borderColor: LightTheme.colors.primary,
      backgroundColor: LightTheme.colors.primaryLight + '25',
      shadowColor: LightTheme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    quickSelectText: {
      fontSize: LightTheme.typography.base.fontSize,
      fontWeight: '500',
      color: LightTheme.semanticColors.text.primary,
    },
    quickSelectTextSelected: {
      color: LightTheme.semanticColors.text.onPrimary,
      fontWeight: '600',
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
          style={LightTheme.shadows.lg}
        />
      </View>
    </SafeAreaView>
  );
};

export default HeightScreen;
