/**
 * CaloriTrack - Onboarding Motivation Screen
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

const MotivationScreen = () => {
  const { goals, updateGoals, nextStep, previousStep, totalSteps, getCurrentStep } = useOnboarding();

  const [motivation, setMotivation] = useState(goals.motivation || 7);
  const [sliderPosition, setSliderPosition] = useState(0);

  const currentStep = getCurrentStep('goals-motivation');

  const { width: screenWidth } = Dimensions.get('window');
  const sliderWidth = screenWidth - 64; // Padding'leri çıkarıyoruz
  const minMotivation = 1;
  const maxMotivation = 10;
  const motivationRange = maxMotivation - minMotivation;

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, gestureState) => {
        // When starting to drag, calculate initial position based on current motivation
        if (motivation >= minMotivation && motivation <= maxMotivation) {
          const percentage = (motivation - minMotivation) / motivationRange;
          const initialPosition = percentage * sliderWidth;
          setSliderPosition(initialPosition);
        }
      },
      onPanResponderMove: (_, gestureState) => {
        // Calculate absolute position based on where the user started dragging
        const touchX = gestureState.x0 + gestureState.dx;
        const newPosition = Math.max(0, Math.min(sliderWidth, touchX - 40)); // 40 = handle radius
        setSliderPosition(newPosition);

        // Calculate motivation based on position
        const percentage = newPosition / sliderWidth;
        const newMotivation = Math.round(minMotivation + (percentage * motivationRange));
        setMotivation(newMotivation);
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!motivation || motivation < 1 || motivation > 10) {
      errors.push('Motivasyon seviyesi 1-10 aralığında olmalıdır');
    }

    if (errors.length > 0) {
      Alert.alert('Doğrulama Hatası', errors.join('\n'));
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateForm()) return;

    updateGoals({ motivation });
    nextStep();
    router.push('/onboarding/activity');
  };

  const handlePrevious = () => {
    previousStep();
    router.back();
  };

  // Initialize slider position based on motivation changes
  React.useEffect(() => {
    if (motivation >= minMotivation && motivation <= maxMotivation) {
      const percentage = (motivation - minMotivation) / motivationRange;
      const newPosition = percentage * sliderWidth;
      setSliderPosition(newPosition);
    }
  }, [motivation, minMotivation, maxMotivation, motivationRange, sliderWidth]);

  const motivationEmojis = [
    { value: 1, emoji: '😔' },
    { value: 2, emoji: '😐' },
    { value: 3, emoji: '😕' },
    { value: 4, emoji: '🙂' },
    { value: 5, emoji: '😊' },
    { value: 6, emoji: '😄' },
    { value: 7, emoji: '🤗' },
    { value: 8, emoji: '😎' },
    { value: 9, emoji: '🔥' },
    { value: 10, emoji: '🚀' },
  ];

  const getMotivationEmoji = () => {
    const emoji = motivationEmojis.find(e => e.value === motivation);
    return emoji ? emoji.emoji : '😐';
  };

  const getMotivationDescription = () => {
    if (motivation >= 1 && motivation <= 2) return 'Başlamakta zorlanıyorum';
    if (motivation >= 3 && motivation <= 4) return 'Biraz tereddütlüyüm';
    if (motivation >= 5 && motivation <= 6) return 'Fikrim stabil';
    if (motivation >= 7 && motivation <= 8) return 'Heyecanlıyım';
    if (motivation >= 9 && motivation <= 10) return 'Tamamen hazırım';
    return '';
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
      paddingBottom: LightTheme.spacing.xl,
    },
    header: {
      marginBottom: LightTheme.spacing['3xl'],
      alignItems: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      color: LightTheme.semanticColors.text.primary,
      marginBottom: LightTheme.spacing.md,
      marginTop: LightTheme.spacing.sm,
      textAlign: 'center',
      lineHeight: 40,
    },
    subtitle: {
      fontSize: LightTheme.typography.base.fontSize,
      color: LightTheme.semanticColors.text.secondary,
      textAlign: 'center',
      lineHeight: 26,
      fontWeight: '400',
      marginTop: LightTheme.spacing.md,
      marginBottom: LightTheme.spacing.xl,
    },
    sliderContainer: {
      marginBottom: LightTheme.spacing['3xl'],
    },
    sliderBackground: {
      height: 80,
      backgroundColor: LightTheme.semanticColors.background.secondary,
      borderRadius: 40,
      justifyContent: 'center',
      paddingHorizontal: LightTheme.spacing.lg,
      ...LightTheme.shadows.md,
    },
    sliderBar: {
      height: 16,
      backgroundColor: LightTheme.semanticColors.border.primary,
      borderRadius: 8,
      position: 'relative',
    },
    sliderBarFill: {
      position: 'absolute',
      height: '100%',
      backgroundColor: LightTheme.colors.primary,
      borderRadius: 8,
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
    sliderHandleText: {
      fontSize: 12,
      fontWeight: '600',
      color: LightTheme.colors.primary,
    },
    sliderEmojiContainer: {
      alignItems: 'center',
      backgroundColor: LightTheme.semanticColors.background.secondary,
      borderWidth: 1,
      borderColor: LightTheme.semanticColors.border.primary,
      borderRadius: LightTheme.borderRadius.lg,
      padding: LightTheme.spacing.xl,
      ...LightTheme.shadows.sm,
    },
    sliderEmoji: {
      fontSize: 48,
      marginBottom: LightTheme.spacing.md,
    },
    sliderValue: {
      fontSize: 36,
      color: LightTheme.colors.primary,
      marginBottom: LightTheme.spacing.sm,
      fontWeight: '700',
    },
    sliderDescription: {
      fontSize: LightTheme.typography.sm.fontSize,
      color: LightTheme.semanticColors.text.secondary,
      textAlign: 'center',
      marginBottom: LightTheme.spacing.lg,
      lineHeight: 24,
    },
    emojiScale: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: LightTheme.spacing.md,
      paddingHorizontal: LightTheme.spacing.lg,
      position: 'relative',
    },
    emojiItem: {
      alignItems: 'center',
      position: 'absolute',
      transform: [{ translateX: -20 }],
      width: 40,
    },
    emojiText: {
      fontSize: 28,
      marginBottom: LightTheme.spacing.xs,
    },
    emojiNumber: {
      fontSize: 12,
      color: LightTheme.semanticColors.text.tertiary,
      fontWeight: '500',
    },
    infoCard: {
      backgroundColor: LightTheme.semanticColors.background.secondary,
      borderWidth: 1,
      borderColor: LightTheme.semanticColors.border.primary,
      borderRadius: LightTheme.borderRadius.lg,
      padding: LightTheme.spacing.lg,
      marginTop: LightTheme.spacing.lg,
      ...LightTheme.shadows.sm,
    },
    infoText: {
      fontSize: LightTheme.typography.base.fontSize,
      color: LightTheme.semanticColors.text.secondary,
      textAlign: 'center',
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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} onBack={handlePrevious} />

          <View style={styles.header}>
            <Text style={styles.title}>Motivasyon Seviyeniz</Text>
            <Text style={styles.subtitle}>
              Bu yolculukta ne kadar motive olduğunuzu paylaşın.
            </Text>
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
          <View style={styles.emojiScale}>
            {motivationEmojis.map((emoji, index) => {
              const position = (index / (motivationEmojis.length - 1)) * sliderWidth;
              return (
                <View
                  key={emoji.value}
                  style={[
                    styles.emojiItem,
                    { left: position }
                  ]}
                >
                  <Text style={styles.emojiText}>{emoji.emoji}</Text>
                  <Text style={styles.emojiNumber}>{emoji.value}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.sliderContainer}>
          <View style={styles.sliderEmojiContainer}>
            <Text style={styles.sliderEmoji}>{getMotivationEmoji()}</Text>
            <Text style={styles.sliderValue}>{motivation}/10</Text>
            <Text style={styles.sliderDescription}>{getMotivationDescription()}</Text>
          </View>
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

export default MotivationScreen;