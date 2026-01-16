/**
 * CaloriTrack - Onboarding Disliked Foods Screen
 * Minimal. Cool. Aesthetic.
 */

import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/button';
import ProgressBar from '../../components/ui/progress-bar';
import { useOnboarding } from '../../context/onboarding-context';

const DislikedFoodsScreen = () => {
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

  const [dislikedFoods, setDislikedFoods] = useState(diet.dislikedFoods || []);
  const [customDislikedFood, setCustomDislikedFood] = useState('');

  const commonDislikedFoods = [
    { value: 'mushrooms', label: 'Mantar', icon: '🍄' },
    { value: 'olives', label: 'Zeytin', icon: '🫒' },
    { value: 'cilantro', label: 'Kişniş', icon: '🌿' },
    { value: 'broccoli', label: 'Brokoli', icon: '🥦' },
    { value: 'spinach', label: 'Ispanak', icon: '🥬' },
    { value: 'tomatoes', label: 'Domates', icon: '🍅' },
    { value: 'onions', label: 'Soğan', icon: '🧅' },
    { value: 'garlic', label: 'Sarımsak', icon: '🧄' },
  ];

  const handleToggle = (value: string) => {
    setDislikedFoods(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const handleAddCustom = () => {
    if (customDislikedFood.trim() && !dislikedFoods.includes(customDislikedFood.trim())) {
      setDislikedFoods(prev => [...prev, customDislikedFood.trim()]);
      setCustomDislikedFood('');
    }
  };

  const handleRemove = (value: string) => {
    setDislikedFoods(prev => prev.filter(item => item !== value));
  };

  const handleNext = () => {
    updateDiet({ ...diet, dislikedFoods });
    nextStep();
    router.push('/onboarding/cultural-restrictions');
  };

  const handlePrevious = () => {
    updateDiet({ ...diet, dislikedFoods });
    previousStep();
    router.back();
  };

  const currentStep = getCurrentStep('disliked-foods');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.semanticColors.background.primary,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    content: {
      padding: theme.spacing.lg,
      paddingTop: theme.spacing['4xl'],
      paddingBottom: theme.spacing['4xl'],
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
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} onBack={handlePrevious} />
          <View style={styles.header}>
            <Text style={styles.title}>Sevmediğiniz Besinler</Text>
            <Text style={styles.subtitle}>
              Sevmediğiniz besinleri belirtin. Bu bilgiler size özel ve zevkinize uygun beslenme planı oluşturmamıza yardımcı olacaktır.
            </Text>
          </View>

          {dislikedFoods.length > 0 && (
            <View style={styles.selectedTagsContainer}>
              {dislikedFoods.map((food) => (
                <View key={food} style={styles.selectedTag}>
                  <Text style={styles.selectedTagText}>{food}</Text>
                  <TouchableOpacity onPress={() => handleRemove(food)}>
                    <Text style={styles.removeTag}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <View style={styles.tagContainer}>
            {commonDislikedFoods.map((food) => (
              <TouchableOpacity
                key={food.value}
                style={[
                  styles.tagButton,
                  dislikedFoods.includes(food.value) && styles.tagButtonSelected,
                ]}
                onPress={() => handleToggle(food.value)}
              >
                <Text style={styles.tagIcon}>{food.icon}</Text>
                <Text
                  style={[
                    styles.tagText,
                    dislikedFoods.includes(food.value) && styles.tagTextSelected,
                  ]}
                >
                  {food.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.customInputContainer}>
            <TextInput
              style={styles.customInput}
              value={customDislikedFood}
              onChangeText={setCustomDislikedFood}
              placeholder="Sevmediğiniz başka besinler"
              placeholderTextColor={theme.semanticColors.text.tertiary}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddCustom}>
              <Text style={styles.addButtonText}>Ekle</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Devam Et"
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
};

export default DislikedFoodsScreen;