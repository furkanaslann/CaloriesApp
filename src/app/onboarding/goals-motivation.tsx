/**
 * CaloriTrack - Onboarding Motivation Screen
 * Minimal. Cool. Aesthetic.
 */

import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme';
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
    shadows: { lg: {}, md: {} },
    coloredShadows: { primary: {} },
  };
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
      backgroundColor: theme.semanticColors.background.primary,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: theme.spacing.lg,
      paddingBottom: 0, // ScrollView'de alt boşluğu azalt
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
      color: theme.semanticColors.text.secondary,
      textAlign: 'center',
      lineHeight: 26,
      fontWeight: '400',
      fontSize: 16,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.xl,
    },
    sliderContainer: {
      marginBottom: theme.spacing['3xl'],
    },
    sliderBackground: {
      height: 80,
      backgroundColor: theme.semanticColors.background.surface,
      borderRadius: 40,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.lg,
      ...theme.shadows.md,
    },
    sliderBar: {
      height: 16,
      backgroundColor: theme.semanticColors.border.primary,
      borderRadius: 8,
      position: 'relative',
    },
    sliderBarFill: {
      position: 'absolute',
      height: '100%',
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
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
    sliderEmojiContainer: {
      alignItems: 'center',
      backgroundColor: theme.semanticColors.background.surface,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xl,
      ...theme.shadows.sm,
    },
    sliderEmoji: {
      fontSize: 48,
      marginBottom: theme.spacing.md,
    },
    sliderValue: {
      ...theme.textStyles.heading3,
      color: theme.colors.primary,
      marginBottom: theme.spacing.sm,
      fontSize: 36,
      fontWeight: '700',
    },
    sliderDescription: {
      ...theme.textStyles.bodySmall,
      color: theme.semanticColors.text.secondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
      lineHeight: 24,
    },
    emojiScale: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      position: 'relative',
    },
    emojiItem: {
      alignItems: 'center',
      position: 'absolute',
      transform: [{ translateX: -20 }], // Center the emoji
      width: 40,
    },
    emojiText: {
      fontSize: 28,
      marginBottom: theme.spacing.xs,
    },
    emojiNumber: {
      fontSize: 12,
      color: theme.semanticColors.text.tertiary,
      fontWeight: '500',
    },
        infoCard: {
      backgroundColor: theme.semanticColors.background.surface,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginTop: theme.spacing.lg,
      ...theme.shadows.sm,
    },
    infoText: {
      ...theme.textStyles.body,
      color: theme.semanticColors.text.secondary,
      textAlign: 'center',
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
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
      >
        <View style={styles.content}>
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

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

export default MotivationScreen;