/**
 * CaloriTrack - Onboarding Weight Screen
 * Minimal. Cool. Aesthetic.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../src/theme/index';
import { useOnboarding } from '../../contexts/onboarding-context';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';

const WeightScreen = () => {
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
      body: { fontSize: 16, fontWeight: '400' },
      bodySmall: { fontSize: 14, fontWeight: '400' },
      labelMedium: { fontSize: 15, fontWeight: '500' },
    },
    typography: { lineHeight: { relaxed: 24 }, fontWeight: { semibold: '600' } },
    spacing: { lg: 24, md: 16, xl: 32, sm: 8, '3xl': 40 },
    borderRadius: { md: 10 },
    shadows: {},
  };
  const { profile, updateProfile, nextStep, previousStep } = useOnboarding();

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
    inputContainer: {
      marginBottom: theme.spacing.xl,
    },
    quickSelectContainer: {
      marginBottom: theme.spacing['3xl'],
    },
    quickSelectLabel: {
      ...theme.textStyles.labelMedium,
      color: theme.semanticColors.text.secondary,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    quickSelectGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: theme.spacing.sm,
    },
    quickSelectButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.semanticColors.background.primary,
      minWidth: 60,
      alignItems: 'center',
    },
    quickSelectButtonSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: `${theme.colors.primary}10`,
    },
    quickSelectText: {
      ...theme.textStyles.labelMedium,
      color: theme.semanticColors.text.primary,
    },
    quickSelectTextSelected: {
      color: theme.colors.primary,
      fontWeight: theme.typography.fontWeight.semibold,
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
    infoText: {
      ...theme.textStyles.bodySmall,
      color: theme.semanticColors.text.secondary,
      textAlign: 'center',
      marginTop: theme.spacing.md,
    },
  });

  const totalSteps = 9;
  const currentStep = 6;

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
          <Text style={styles.title}>Kilonuz</Text>
          <Text style={styles.subtitle}>
            Mevcut kilonuzu kilogram cinsinden girin.
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Input
            label="Kilo (kg)"
            value={weight}
            onChangeText={setWeight}
            placeholder="Örn: 70"
            keyboardType="numeric"
            autoFocus
          />
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

export default WeightScreen;