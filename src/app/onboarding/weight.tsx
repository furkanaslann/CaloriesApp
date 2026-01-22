/**
 * CaloriTrack - Onboarding Weight Screen
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

const WeightScreen = () => {
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
      maxWidth: 350,
      backgroundColor: LightTheme.semanticColors.background.secondary,
      borderRadius: LightTheme.borderRadius.lg,
      borderWidth: 2,
      borderColor: LightTheme.semanticColors.border.primary,
      ...LightTheme.shadows.md,
    },
    quickSelectContainer: {
      marginBottom: LightTheme.spacing['2xl'],
    },
    quickSelectLabel: {
      fontSize: 15,
      fontWeight: '500',
      color: LightTheme.semanticColors.text.secondary,
      marginBottom: LightTheme.spacing.md,
      textAlign: 'center',
    },
    quickSelectGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: LightTheme.spacing.sm,
    },
    quickSelectButton: {
      paddingHorizontal: LightTheme.spacing.md,
      paddingVertical: LightTheme.spacing.sm,
      borderWidth: 2,
      borderColor: LightTheme.semanticColors.border.primary,
      borderRadius: LightTheme.borderRadius.md,
      backgroundColor: LightTheme.semanticColors.background.primary,
      minWidth: 60,
      alignItems: 'center',
    },
    quickSelectButtonSelected: {
      borderColor: LightTheme.colors.primary,
      backgroundColor: `${LightTheme.colors.primary}10`,
    },
    quickSelectText: {
      fontSize: 15,
      fontWeight: '500',
      color: LightTheme.semanticColors.text.primary,
    },
    quickSelectTextSelected: {
      color: LightTheme.colors.primary,
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
    infoText: {
      fontSize: LightTheme.typography.sm.fontSize,
      fontWeight: '400',
      color: LightTheme.semanticColors.text.secondary,
      textAlign: 'center',
      marginTop: LightTheme.spacing.md,
    },
  });

  const currentStep = getCurrentStep('weight');

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
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
                  paddingVertical: LightTheme.spacing.lg,
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

          <Text style={styles.infoText}>
            Bu bilgi, günlük kalori ihtiyacınızı hesaplamak için kullanılacaktır.
          </Text>
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

export default WeightScreen;
