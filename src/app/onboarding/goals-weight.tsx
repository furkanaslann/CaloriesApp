/**
 * CaloriTrack - Onboarding Target Weight Screen
 * Minimal. Cool. Aesthetic.
 */

import { LightTheme } from '@/constants';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/button';
import ProgressBar from '../../components/ui/progress-bar';
import { useOnboarding } from '../../context/onboarding-context';

const TargetWeightScreen = () => {
  const { profile, goals, updateGoals, nextStep, previousStep, totalSteps, getCurrentStep } = useOnboarding();

  const [targetWeight, setTargetWeight] = useState(goals.targetWeight || 70);
  const [sliderPosition, setSliderPosition] = useState(0);

  const currentStep = getCurrentStep('goals-weight');

  const { width: screenWidth } = Dimensions.get('window');
  const sliderWidth = screenWidth - 64;
  const minWeight = 40;
  const maxWeight = 150;
  const weightRange = maxWeight - minWeight;

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, gestureState) => {
        if (targetWeight >= minWeight && targetWeight <= maxWeight) {
          const percentage = (targetWeight - minWeight) / weightRange;
          const initialPosition = percentage * sliderWidth;
          setSliderPosition(initialPosition);
        }
      },
      onPanResponderMove: (_, gestureState) => {
        const touchX = gestureState.x0 + gestureState.dx;
        const newPosition = Math.max(0, Math.min(sliderWidth, touchX - 40));
        setSliderPosition(newPosition);

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
      backgroundColor: LightTheme.semanticColors.background.primary,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    content: {
      padding: LightTheme.spacing.lg,
      paddingTop: LightTheme.spacing.lg,
      paddingBottom: LightTheme.spacing['4xl'],
    },
    header: {
      marginBottom: LightTheme.spacing['6xl'],
      alignItems: 'center',
    },
    title: {
      fontSize: LightTheme.typography['3xl'].fontSize,
      fontWeight: '700',
      color: LightTheme.semanticColors.text.primary,
      marginBottom: LightTheme.spacing.md,
      marginTop: LightTheme.spacing.sm,
      textAlign: 'center',
      lineHeight: LightTheme.typography['3xl'].lineHeight,
    },
    subtitle: {
      fontSize: LightTheme.typography.base.fontSize,
      fontWeight: '500',
      color: LightTheme.semanticColors.text.tertiary,
      textAlign: 'center',
      lineHeight: 26,
      marginTop: LightTheme.spacing.md,
      marginBottom: LightTheme.spacing.xl,
    },
    section: {
      marginBottom: LightTheme.spacing['2xl'],
    },
    weightDisplay: {
      alignItems: 'center',
      marginBottom: LightTheme.spacing['6xl'],
    },
    weightValue: {
      fontSize: 48,
      fontWeight: '700',
      color: LightTheme.semanticColors.text.primary,
      marginBottom: LightTheme.spacing.sm,
    },
    weightUnit: {
      fontSize: 18,
      color: LightTheme.semanticColors.text.secondary,
      fontWeight: '500',
    },
    sliderContainer: {
      marginBottom: LightTheme.spacing['6xl'],
    },
    sliderBackground: {
      height: 60,
      backgroundColor: LightTheme.semanticColors.background.secondary,
      borderRadius: 30,
      justifyContent: 'center',
      paddingHorizontal: LightTheme.spacing.lg,
      ...LightTheme.shadows.md,
    },
    sliderBar: {
      height: 12,
      backgroundColor: LightTheme.semanticColors.border.primary,
      borderRadius: 6,
      position: 'relative',
    },
    sliderBarFill: {
      position: 'absolute',
      height: '100%',
      backgroundColor: LightTheme.colors.primary,
      borderRadius: 6,
      left: 0,
    },
    sliderHandle: {
      position: 'absolute',
      width: 40,
      height: 40,
      backgroundColor: LightTheme.colors.primary,
      borderRadius: 20,
      top: '50%',
      transform: [{ translateY: -20 }, { translateX: -20 }],
      justifyContent: 'center',
      alignItems: 'center',
      ...LightTheme.shadows.lg,
    },
    sliderHandleInner: {
      width: 30,
      height: 30,
      backgroundColor: '#FFFFFF',
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scaleNumbers: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: LightTheme.spacing.md,
      paddingHorizontal: LightTheme.spacing.lg,
    },
    scaleNumber: {
      fontSize: 14,
      color: LightTheme.semanticColors.text.tertiary,
      fontWeight: '500',
    },
    infoCard: {
      backgroundColor: LightTheme.semanticColors.background.primary,
      borderWidth: 1,
      borderColor: LightTheme.semanticColors.border.primary,
      borderRadius: LightTheme.borderRadius.lg,
      padding: LightTheme.spacing.lg,
      marginBottom: LightTheme.spacing.lg,
      ...LightTheme.shadows.sm,
    },
    infoText: {
      fontSize: LightTheme.typography.base.fontSize,
      fontWeight: '500',
      color: LightTheme.semanticColors.text.primary,
      textAlign: 'center',
      lineHeight: 24,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: LightTheme.spacing.md,
      paddingHorizontal: LightTheme.spacing.lg,
      paddingBottom: LightTheme.spacing.xl,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} onBack={handlePrevious} />

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
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Devam Et"
          onPress={handleNext}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
};

export default TargetWeightScreen;
