/**
 * CaloriTrack - Onboarding Diet Preferences Screen
 * Minimal. Cool. Aesthetic.
 */

import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/button';
import ProgressBar from '../../components/ui/progress-bar';
import { useOnboarding } from '../../context/onboarding-context';

const DietScreen = () => {
  // Modern theme system using constants
  const theme = {
    semanticColors: {
      background: { primary: '#FFFFFF', surface: '#F8FAFC', primarySurface: '#EDE9FE' },
      text: { primary: '#1E293B', secondary: '#475569', tertiary: '#64748B', onPrimary: '#FFFFFF' },
      border: { primary: '#E2E8F0', secondary: '#E2E8F0' },
    },
    colors: { primary: '#7C3AED', success: '#10B981', error: '#EF4444' },
    textStyles: {
      heading2: { fontSize: 32, fontWeight: '700' },
      heading4: { fontSize: 20, fontWeight: '600' },
      body: { fontSize: 16, fontWeight: '400' },
      bodySmall: { fontSize: 14, fontWeight: '400' },
      labelLarge: { fontSize: 18, fontWeight: '500' },
      labelMedium: { fontSize: 15, fontWeight: '500' },
      caption: { fontSize: 12, fontWeight: '400' },
    },
    spacing: { lg: 24, md: 16, xl: 32, '4xl': 48, '3xl': 40, '2xl': 24, sm: 8, xs: 4 },
    borderRadius: { full: 9999, xl: 16, lg: 12, md: 10, sm: 8 },
    shadows: { lg: {}, md: {}, sm: {} },
    coloredShadows: { primary: {} },
  };

  const { diet, updateDiet, nextStep, previousStep, totalSteps, getCurrentStep } = useOnboarding();

  const [type, setType] = useState(diet.type || '');

  const dietTypes = [
    { value: 'omnivore', label: 'Herşeyci', icon: '🍽️', description: 'Her tür besini tüketirim' },
    { value: 'vegetarian', label: 'Vejetaryen', icon: '🥗', description: 'Et tüketmem' },
    { value: 'vegan', label: 'Vegan', icon: '🌱', description: 'Hayvansal ürün tüketmem' },
    { value: 'pescatarian', label: 'Pesketaryen', icon: '🐟', description: 'Balık tüketirim, et tüketmem' },
    { value: 'keto', label: 'Ketojenik', icon: '🥑', description: 'Düşük karbonhidrat, yüksek yağ' },
    { value: 'paleo', label: 'Paleo', icon: '🦴', description: 'İlkel beslenme' },
    { value: 'mediterranean', label: 'Akdeniz', icon: '🫒', description: 'Akdeniz beslenmesi' },
    { value: 'glutenFree', label: 'Glutensiz', icon: '🌾', description: 'Glüten tüketmem' },
  ];

  const handleTypeSelect = (selectedType: string) => {
    setType(selectedType);
  };

  const handleNext = () => {
    const updatedDiet = {
      ...diet,
      type,
    };

    updateDiet(updatedDiet);
    nextStep();
    router.push('/onboarding/camera-tutorial');
  };

  const handlePrevious = () => {
    previousStep();
    router.back();
  };

  const currentStep = getCurrentStep('diet');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.semanticColors.background.primary,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    header: {
      marginBottom: theme.spacing['3xl'],
    },
    title: {
      ...theme.textStyles.heading2,
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.md,
      lineHeight: 40,
      fontSize: 32,
      fontWeight: '700',
    },
    subtitle: {
      ...theme.textStyles.body,
      color: theme.semanticColors.text.secondary,
      lineHeight: 24,
    },
    section: {
      marginBottom: theme.spacing['3xl'],
    },
    sectionTitle: {
      ...theme.textStyles.heading4,
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.lg,
    },
    optionGrid: {
      gap: theme.spacing.md,
    },
    optionCard: {
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.lg,
      backgroundColor: theme.semanticColors.background.primary,
      ...theme.shadows.sm,
    },
    optionCardSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: `${theme.colors.primary}10`,
    },
    optionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    optionIcon: {
      fontSize: 24,
      marginRight: theme.spacing.md,
    },
    optionLabel: {
      ...theme.textStyles.labelLarge,
      color: theme.semanticColors.text.primary,
      fontWeight: '600',
    },
    optionLabelSelected: {
      color: theme.colors.primary,
    },
    optionDescription: {
      ...(theme?.textStyles?.caption || { fontSize: 12, fontWeight: '400' }),
      color: theme?.semanticColors?.text?.secondary || '#475569',
      marginLeft: 36,
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
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
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} onBack={handlePrevious} />

        <View style={styles.header}>
          <Text style={styles.title}>Beslenme Tercihleriniz</Text>
          <Text style={styles.subtitle}>
            Beslenme tarzınızı seçin. Bu bilgi, size özel beslenme planı oluşturmamıza yardımcı olacaktır.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Beslenme Türü</Text>
          <View style={styles.optionGrid}>
            {dietTypes.map((dietType) => (
              <TouchableOpacity
                key={dietType.value}
                style={[
                  styles.optionCard,
                  type === dietType.value && styles.optionCardSelected,
                ]}
                onPress={() => handleTypeSelect(dietType.value)}
              >
                <View style={styles.optionHeader}>
                  <Text style={styles.optionIcon}>{dietType.icon}</Text>
                  <Text
                    style={[
                      styles.optionLabel,
                      type === dietType.value && styles.optionLabelSelected,
                    ]}
                  >
                    {dietType.label}
                  </Text>
                </View>
                <Text style={styles.optionDescription}>{dietType.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Devam Et"
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
};

export default DietScreen;