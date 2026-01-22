/**
 * CaloriTrack - Onboarding Disliked Foods Screen
 * Minimal. Cool. Aesthetic.
 */

import { LightTheme } from '@/constants';
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
    selectedTagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: LightTheme.spacing.sm,
      marginBottom: LightTheme.spacing.lg,
    },
    selectedTag: {
      backgroundColor: LightTheme.colors.primary,
      borderRadius: LightTheme.borderRadius.full,
      paddingHorizontal: LightTheme.spacing.md,
      paddingVertical: LightTheme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      gap: LightTheme.spacing.xs,
    },
    selectedTagText: {
      fontSize: LightTheme.typography.sm.fontSize,
      color: '#FFFFFF',
    },
    removeTag: {
      fontSize: 16,
      color: '#FFFFFF',
    },
    tagContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: LightTheme.spacing.sm,
      marginBottom: LightTheme.spacing.xl,
    },
    tagButton: {
      borderWidth: 1,
      borderColor: LightTheme.semanticColors.border.primary,
      borderRadius: LightTheme.borderRadius.full,
      paddingHorizontal: LightTheme.spacing.md,
      paddingVertical: LightTheme.spacing.sm,
      backgroundColor: LightTheme.semanticColors.background.primary,
      flexDirection: 'row',
      alignItems: 'center',
      gap: LightTheme.spacing.xs,
    },
    tagButtonSelected: {
      borderColor: LightTheme.colors.primary,
      backgroundColor: LightTheme.colors.primary,
    },
    tagIcon: {
      fontSize: 16,
    },
    tagText: {
      fontSize: LightTheme.typography.sm.fontSize,
      color: LightTheme.semanticColors.text.primary,
    },
    tagTextSelected: {
      color: '#FFFFFF',
    },
    customInputContainer: {
      flexDirection: 'row',
      gap: LightTheme.spacing.sm,
      alignItems: 'center',
      marginBottom: LightTheme.spacing.xl,
    },
    customInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: LightTheme.semanticColors.border.primary,
      borderRadius: LightTheme.borderRadius.md,
      paddingHorizontal: LightTheme.spacing.md,
      paddingVertical: LightTheme.spacing.sm,
      fontSize: LightTheme.typography.base.fontSize,
      color: LightTheme.semanticColors.text.primary,
    },
    addButton: {
      backgroundColor: LightTheme.colors.primary,
      borderRadius: LightTheme.borderRadius.md,
      paddingHorizontal: LightTheme.spacing.lg,
      paddingVertical: LightTheme.spacing.sm,
    },
    addButtonText: {
      fontSize: LightTheme.typography.sm.fontSize,
      color: '#FFFFFF',
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
              placeholderTextColor={LightTheme.semanticColors.text.tertiary}
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
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
};

export default DislikedFoodsScreen;