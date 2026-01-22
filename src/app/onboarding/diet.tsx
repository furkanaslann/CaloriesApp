/**
 * CaloriTrack - Onboarding Diet Preferences Screen
 * Minimal. Cool. Aesthetic.
 */

import { LightTheme } from '@/constants';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
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
    router.push('/onboarding/allergies');
  };

  const handlePrevious = () => {
    previousStep();
    router.back();
  };

  const currentStep = getCurrentStep('diet');

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
      marginBottom: LightTheme.spacing['3xl'],
    },
    title: {
      fontSize: LightTheme.typography['3xl'].fontSize,
      fontWeight: '700',
      color: LightTheme.semanticColors.text.primary,
      marginBottom: LightTheme.spacing.md,
      lineHeight: LightTheme.typography['3xl'].lineHeight,
    },
    subtitle: {
      fontSize: LightTheme.typography.base.fontSize,
      color: LightTheme.semanticColors.text.secondary,
      lineHeight: 24,
    },
    section: {
      marginBottom: LightTheme.spacing['2xl'],
    },
    sectionTitle: {
      fontSize: LightTheme.typography.xl.fontSize,
      color: LightTheme.semanticColors.text.primary,
      marginBottom: LightTheme.spacing.lg,
    },
    optionGrid: {
      gap: LightTheme.spacing.md,
    },
    optionCard: {
      borderWidth: 1,
      borderColor: LightTheme.semanticColors.border.primary,
      borderRadius: LightTheme.borderRadius.md,
      padding: LightTheme.spacing.lg,
      backgroundColor: LightTheme.semanticColors.background.primary,
      ...LightTheme.shadows.sm,
    },
    optionCardSelected: {
      borderColor: LightTheme.colors.primary,
      backgroundColor: `${LightTheme.colors.primary}10`,
    },
    optionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: LightTheme.spacing.sm,
    },
    optionIcon: {
      fontSize: 24,
      marginRight: LightTheme.spacing.md,
    },
    optionLabel: {
      fontSize: LightTheme.typography.lg.fontSize,
      color: LightTheme.semanticColors.text.primary,
      fontWeight: '600',
    },
    optionLabelSelected: {
      color: LightTheme.colors.primary,
    },
    optionDescription: {
      fontSize: LightTheme.typography.sm.fontSize,
      color: LightTheme.semanticColors.text.secondary,
      marginLeft: 36,
      lineHeight: 20,
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

export default DietScreen;