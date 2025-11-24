/**
 * CaloriTrack - Onboarding Target Weight Screen
 * Minimal. Cool. Aesthetic.
 */

import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/button';
import { useOnboarding } from '../../context/onboarding-context';

const TargetWeightScreen = () => {
  // Modern theme system using constants
  const theme = {
    semanticColors: {
      background: { primary: '#FFFFFF', surface: '#F8FAFC', primarySurface: '#EDE9FE' },
      text: { primary: '#1E293B', secondary: '#475569', tertiary: '#64748B', onPrimary: '#FFFFFF' },
      border: { primary: '#E2E8F0', secondary: '#E2E8F0' },
    },
    colors: { primary: '#7C3AED', success: '#10B981', warning: '#F59E0B', error: '#EF4444', info: '#3B82F6' },
    textStyles: {
      onboardingTitle: { fontSize: 30, fontWeight: '600' },
      onboardingDescription: { fontSize: 16, fontWeight: '400' },
      heading3: { fontSize: 24, fontWeight: '600' },
      heading4: { fontSize: 20, fontWeight: '600' },
      body: { fontSize: 16, fontWeight: '400' },
      bodySmall: { fontSize: 14, fontWeight: '400' },
      labelLarge: { fontSize: 18, fontWeight: '500' },
      labelMedium: { fontSize: 15, fontWeight: '500' },
      caption: { fontSize: 12, fontWeight: '400' },
    },
    spacing: { lg: 24, md: 16, xl: 32, '4xl': 48, '3xl': 40, '2xl': 24, sm: 8 },
    borderRadius: { full: 9999, xl: 16, lg: 12, md: 10 },
    shadows: { sm: {}, md: {} },
    coloredShadows: { primary: {} },
  };
  const { profile, goals, updateGoals, nextStep, previousStep, totalSteps, getCurrentStep } = useOnboarding();

  const [targetWeight, setTargetWeight] = useState(goals.targetWeight || 70);
  const [sliderPosition, setSliderPosition] = useState(0);

  const currentStep = getCurrentStep('goals-weight');

  const { width: screenWidth } = Dimensions.get('window');
  const sliderWidth = screenWidth - 64; // Padding'leri çıkarıyoruz
  const minWeight = 40;
  const maxWeight = 150;
  const weightRange = maxWeight - minWeight;

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, gestureState) => {
        // When starting to drag, calculate initial position based on current weight
        if (targetWeight >= minWeight && targetWeight <= maxWeight) {
          const percentage = (targetWeight - minWeight) / weightRange;
          const initialPosition = percentage * sliderWidth;
          setSliderPosition(initialPosition);
        }
      },
      onPanResponderMove: (_, gestureState) => {
        // Calculate absolute position based on where the user started dragging
        const touchX = gestureState.x0 + gestureState.dx;
        const newPosition = Math.max(0, Math.min(sliderWidth, touchX - 40)); // 40 = handle radius
        setSliderPosition(newPosition);

        // Calculate weight based on position
        const percentage = newPosition / sliderWidth;
        const newWeight = Math.round(minWeight + (percentage * weightRange));
        setTargetWeight(newWeight);
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  const validateForm = (): boolean => {
    const errors: string[] = [];

    const weight = targetWeight;
    if (!weight || weight < 40 || weight > 150) {
      errors.push('Hedef kilo 40-150 kg aralığında olmalıdır');
    }

    const currentWeight = profile.currentWeight || 0;

    if (goals.primaryGoal === 'weight_loss' && weight >= currentWeight) {
      errors.push('Kilo verme hedefi için hedef kilo mevcut kilodan az olmalıdır');
    }

    if (goals.primaryGoal === 'muscle_gain' && weight <= currentWeight) {
      errors.push('Kas kazanma hedefi için hedef kilo mevcut kilodan fazla olmalıdır');
    }

    if (errors.length > 0) {
      Alert.alert('Doğrulama Hatası', errors.join('\n'));
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateForm()) return;

    updateGoals({ targetWeight });
    nextStep();
    router.push('/onboarding/goals-weekly');
  };

  // Initialize slider position based on weight changes
  React.useEffect(() => {
    if (targetWeight >= minWeight && targetWeight <= maxWeight) {
      const percentage = (targetWeight - minWeight) / weightRange;
      const newPosition = percentage * sliderWidth;
      setSliderPosition(newPosition);
    }
  }, [targetWeight, minWeight, maxWeight, weightRange, sliderWidth]);

  const handlePrevious = () => {
    previousStep();
    router.back();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.semanticColors.background.primary,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
      justifyContent: 'flex-start',
    },
    progressIndicator: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing['2xl'] || 24,
      paddingTop: '5%',
      marginTop: '15%',
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: theme.borderRadius.full || 9999,
      backgroundColor: theme.semanticColors.border.secondary || '#E2E8F0',
      marginHorizontal: 4,
    },
    dotActive: {
      backgroundColor: theme.colors.primary || '#7C3AED',
      width: 32,
      height: 8,
      borderRadius: theme.borderRadius.sm || 8,
    },
    header: {
      marginBottom: theme.spacing['3xl'],
      alignItems: 'center',
    },
    title: {
      ...theme.textStyles.onboardingTitle,
      fontSize: 32,
      fontWeight: '700',
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.md,
      marginTop: theme.spacing.sm,
      textAlign: 'center',
      lineHeight: 40,
    },
    subtitle: {
      ...theme.textStyles.body,
      color: theme.semanticColors.text.tertiary || '#64748B',
      textAlign: 'center',
      lineHeight: 26,
      fontWeight: '500',
      fontSize: 16,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.xl,
    },
    section: {
      marginBottom: theme.spacing['2xl'],
    },
    sectionTitle: {
      ...theme.textStyles.labelLarge,
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.lg,
      fontSize: 18,
      fontWeight: '500',
    },
    weightDisplay: {
      alignItems: 'center',
      marginBottom: theme.spacing['3xl'],
    },
    weightValue: {
      fontSize: 48,
      fontWeight: '700',
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.sm,
    },
    weightUnit: {
      fontSize: 18,
      color: theme.semanticColors.text.secondary,
      fontWeight: '500',
    },
    sliderContainer: {
      marginBottom: theme.spacing['3xl'],
    },
    sliderBackground: {
      height: 60,
      backgroundColor: theme.semanticColors.background.surface,
      borderRadius: 30,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.lg,
      ...theme.shadows.md,
    },
    sliderBar: {
      height: 12,
      backgroundColor: theme.semanticColors.border.primary,
      borderRadius: 6,
      position: 'relative',
    },
    sliderBarFill: {
      position: 'absolute',
      height: '100%',
      backgroundColor: theme.colors.primary,
      borderRadius: 6,
      left: 0,
    },
    sliderHandle: {
      position: 'absolute',
      width: 40,
      height: 40,
      backgroundColor: theme.colors.primary,
      borderRadius: 20,
      top: '50%',
      transform: [{ translateY: -20 }, { translateX: -20 }],
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.shadows.lg,
    },
    sliderHandleInner: {
      width: 30,
      height: 30,
      backgroundColor: '#FFFFFF',
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sliderHandleText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.primary,
    },
    scaleNumbers: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
    },
    scaleNumber: {
      fontSize: 14,
      color: theme.semanticColors.text.tertiary,
      fontWeight: '500',
    },
    infoCard: {
      backgroundColor: theme.semanticColors.background.primary,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      ...theme.shadows.sm,
    },
    infoText: {
      ...theme.textStyles.body,
      color: theme.semanticColors.text.primary,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
  });

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
          <Text style={styles.title}>Hedef Kilo</Text>
          <Text style={styles.subtitle}>
            Ulaşmak istediğiniz ideal kilonuzu belirleyin.
          </Text>
        </View>

        <View style={styles.weightDisplay}>
          <Text style={styles.weightValue}>{targetWeight}</Text>
          <Text style={styles.weightUnit}>kg</Text>
        </View>

        <View style={styles.sliderContainer}>
          <View style={styles.sliderBackground}>
            <View style={styles.sliderBar}>
              <View
                style={[
                  styles.sliderBarFill,
                  { width: sliderPosition }
                ]}
              />
              <View
                style={[
                  styles.sliderHandle,
                  { left: sliderPosition }
                ]}
                {...panResponder.panHandlers}
              >
                <View style={styles.sliderHandleInner}>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.scaleNumbers}>
            <Text style={styles.scaleNumber}>{minWeight}</Text>
            <Text style={styles.scaleNumber}>{Math.round((minWeight + maxWeight) / 2)}</Text>
            <Text style={styles.scaleNumber}>{maxWeight}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Mevcut kilonuz: {profile.currentWeight || 'Belirtilmemiş'} kg
          </Text>
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

export default TargetWeightScreen;