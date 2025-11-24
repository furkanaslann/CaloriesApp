/**
 * CaloriTrack - Onboarding Allergies Screen
 * Minimal. Cool. Aesthetic.
 */

import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/button';
import { useOnboarding } from '../../context/onboarding-context';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme';

const AllergiesScreen = () => {
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
      labelSmall: { fontSize: 14, fontWeight: '400' },
      caption: { fontSize: 12, fontWeight: '400' },
    },
    spacing: { lg: 24, md: 16, xl: 32, '4xl': 48, '3xl': 40, '2xl': 24, sm: 8, xs: 4 },
    borderRadius: { full: 9999, xl: 16, lg: 12, md: 10, sm: 8 },
    shadows: { lg: {}, md: {}, sm: {} },
  };

  const { diet, updateDiet, nextStep, previousStep, totalSteps, getCurrentStep } = useOnboarding();

  const [allergies, setAllergies] = useState(diet.allergies || []);
  const [customAllergy, setCustomAllergy] = useState('');

  const commonAllergies = [
    { value: 'peanuts', label: 'Fıstık', icon: '🥜' },
    { value: 'treeNuts', label: 'Kuruyemiş', icon: '🌰' },
    { value: 'shellfish', label: 'Kabuklu Deniz Ürünleri', icon: '🦐' },
    { value: 'fish', label: 'Balık', icon: '🐟' },
    { value: 'eggs', label: 'Yumurta', icon: '🥚' },
    { value: 'milk', label: 'Süt', icon: '🥛' },
    { value: 'wheat', label: 'Buğday', icon: '🌾' },
    { value: 'soy', label: 'Soya', icon: '🫘' },
  ];

  const handleToggle = (value: string) => {
    setAllergies(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const handleAddCustom = () => {
    if (customAllergy.trim() && !allergies.includes(customAllergy.trim())) {
      setAllergies(prev => [...prev, customAllergy.trim()]);
      setCustomAllergy('');
    }
  };

  const handleRemove = (value: string) => {
    setAllergies(prev => prev.filter(item => item !== value));
  };

  const handleNext = () => {
    updateDiet({ ...diet, allergies });
    nextStep();
    router.push('/onboarding/intolerances');
  };

  const handlePrevious = () => {
    updateDiet({ ...diet, allergies });
    previousStep();
    router.back();
  };

  const currentStep = getCurrentStep('allergies');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.semanticColors.background.primary,
    },
    progressIndicator: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: theme.spacing['2xl'],
      alignItems: 'center',
      paddingTop: '5%',
      marginTop: '15%',
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.semanticColors.border.secondary,
      marginHorizontal: 4,
    },
    dotActive: {
      backgroundColor: theme.colors.primary,
      width: 32,
      height: 8,
      borderRadius: theme.borderRadius.sm,
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
    },
    subtitle: {
      ...theme.textStyles.body,
      color: theme.semanticColors.text.secondary,
      lineHeight: 24,
    },
    selectedTagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    selectedTag: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    selectedTagText: {
      ...theme.textStyles.labelSmall,
      color: theme.semanticColors.text.onPrimary,
    },
    removeTag: {
      fontSize: 16,
      color: theme.semanticColors.text.onPrimary,
    },
    tagContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.xl,
    },
    tagButton: {
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.semanticColors.background.primary,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    tagButtonSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary,
    },
    tagIcon: {
      fontSize: 16,
    },
    tagText: {
      ...theme.textStyles.labelSmall,
      color: theme.semanticColors.text.primary,
    },
    tagTextSelected: {
      color: theme.semanticColors.text.onPrimary,
    },
    customInputContainer: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    customInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      ...theme.textStyles.body,
      color: theme.semanticColors.text.primary,
    },
    addButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
    },
    addButtonText: {
      ...theme.textStyles.labelSmall,
      color: theme.semanticColors.text.onPrimary,
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
          <Text style={styles.title}>Alerjileriniz</Text>
          <Text style={styles.subtitle}>
            Alerjilerinizi belirtin. Bu bilgiler size özel beslenme planı oluşturmamıza yardımcı olacaktır.
          </Text>
        </View>

        {allergies.length > 0 && (
          <View style={styles.selectedTagsContainer}>
            {allergies.map((allergy) => (
              <View key={allergy} style={styles.selectedTag}>
                <Text style={styles.selectedTagText}>{allergy}</Text>
                <TouchableOpacity onPress={() => handleRemove(allergy)}>
                  <Text style={styles.removeTag}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={styles.tagContainer}>
          {commonAllergies.map((allergy) => (
            <TouchableOpacity
              key={allergy.value}
              style={[
                styles.tagButton,
                allergies.includes(allergy.value) && styles.tagButtonSelected,
              ]}
              onPress={() => handleToggle(allergy.value)}
            >
              <Text style={styles.tagIcon}>{allergy.icon}</Text>
              <Text
                style={[
                  styles.tagText,
                  allergies.includes(allergy.value) && styles.tagTextSelected,
                ]}
              >
                {allergy.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.customInputContainer}>
          <TextInput
            style={styles.customInput}
            value={customAllergy}
            onChangeText={setCustomAllergy}
            placeholder="Diğer alerjinizi yazın"
            placeholderTextColor={theme.semanticColors.text.tertiary}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddCustom}>
            <Text style={styles.addButtonText}>Ekle</Text>
          </TouchableOpacity>
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

export default AllergiesScreen;