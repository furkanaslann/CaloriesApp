/**
 * CaloriTrack - Onboarding Intolerances Screen
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

const IntolerancesScreen = () => {
  const { diet, updateDiet, nextStep, previousStep, totalSteps, getCurrentStep } = useOnboarding();

  const [intolerances, setIntolerances] = useState(diet.intolerances || []);
  const [customIntolerance, setCustomIntolerance] = useState('');

  const commonIntolerances = [
    { value: 'lactose', label: 'Laktoz', icon: '🥛' },
    { value: 'gluten', label: 'Glüten', icon: '🌾' },
    { value: 'fructose', label: 'Fruktoz', icon: '🍎' },
    { value: 'histamine', label: 'Histamin', icon: '🧪' },
    { value: 'caffeine', label: 'Kafein', icon: '☕' },
    { value: 'alcohol', label: 'Alkol', icon: '🍷' },
  ];

  const handleToggle = (value: string) => {
    setIntolerances(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const handleAddCustom = () => {
    if (customIntolerance.trim() && !intolerances.includes(customIntolerance.trim())) {
      setIntolerances(prev => [...prev, customIntolerance.trim()]);
      setCustomIntolerance('');
    }
  };

  const handleRemove = (value: string) => {
    setIntolerances(prev => prev.filter(item => item !== value));
  };

  const handleNext = () => {
    updateDiet({ ...diet, intolerances });
    nextStep();
    router.push('/onboarding/disliked-foods');
  };

  const handlePrevious = () => {
    updateDiet({ ...diet, intolerances });
    previousStep();
    router.back();
  };

  const currentStep = getCurrentStep('intolerances');

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
            <Text style={styles.title}>İntoleranslarınız</Text>
            <Text style={styles.subtitle}>
              Gıda intoleranslarınızı belirtin. Bu bilgiler sindirim sisteminize uygun beslenme planı oluşturmamıza yardımcı olacaktır.
            </Text>
          </View>

          {intolerances.length > 0 && (
            <View style={styles.selectedTagsContainer}>
              {intolerances.map((intolerance) => (
                <View key={intolerance} style={styles.selectedTag}>
                  <Text style={styles.selectedTagText}>{intolerance}</Text>
                  <TouchableOpacity onPress={() => handleRemove(intolerance)}>
                    <Text style={styles.removeTag}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <View style={styles.tagContainer}>
            {commonIntolerances.map((intolerance) => (
              <TouchableOpacity
                key={intolerance.value}
                style={[
                  styles.tagButton,
                  intolerances.includes(intolerance.value) && styles.tagButtonSelected,
                ]}
                onPress={() => handleToggle(intolerance.value)}
              >
                <Text style={styles.tagIcon}>{intolerance.icon}</Text>
                <Text
                  style={[
                    styles.tagText,
                    intolerances.includes(intolerance.value) && styles.tagTextSelected,
                  ]}
                >
                  {intolerance.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.customInputContainer}>
            <TextInput
              style={styles.customInput}
              value={customIntolerance}
              onChangeText={setCustomIntolerance}
              placeholder="Diğer intoleransınızı yazın"
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

export default IntolerancesScreen;