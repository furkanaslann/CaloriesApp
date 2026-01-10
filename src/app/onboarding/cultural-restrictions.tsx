/**
 * CaloriTrack - Onboarding Cultural Restrictions Screen
 * Minimal. Cool. Aesthetic.
 */

import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme';
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
import ProgressBar from '../../components/ui/progress-bar';
import { useOnboarding } from '../../context/onboarding-context';

const CulturalRestrictionsScreen = () => {
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

  const [culturalRestrictions, setculturalRestrictions] = useState(diet.culturalRestrictions || []);
  const [customCulturalRestriction, setCustomCulturalRestriction] = useState('');

  const culturalRestrictionsOptions = [
    { value: 'halal', label: 'Helal', icon: '☪️' },
    { value: 'kosher', label: 'Koşer', icon: '✡️' },
    { value: 'hindu', label: 'Hindu', icon: '🕉️' },
    { value: 'buddhist', label: 'Budist', icon: '☸️' },
  ];

  const handleToggle = (value: string) => {
    setculturalRestrictions(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const handleAddCustom = () => {
    if (customCulturalRestriction.trim() && !culturalRestrictions.includes(customCulturalRestriction.trim())) {
      setculturalRestrictions(prev => [...prev, customCulturalRestriction.trim()]);
      setCustomCulturalRestriction('');
    }
  };

  const handleRemove = (value: string) => {
    setculturalRestrictions(prev => prev.filter(item => item !== value));
  };

  const handleNext = () => {
    updateDiet({ ...diet, culturalRestrictions });
    nextStep();
    router.push('/onboarding/camera-tutorial');
  };

  const handlePrevious = () => {
    updateDiet({ ...diet, culturalRestrictions });
    previousStep();
    router.back();
  };

  const currentStep = getCurrentStep('cultural-restrictions');

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
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} onBack={handlePrevious} />
        <View style={styles.header}>
          <Text style={styles.title}>Dinsel/Kültürel Kısıtlamalarınız</Text>
          <Text style={styles.subtitle}>
            Dinsel veya kültürel beslenme kısıtlamalarınızı belirtin. Bu bilgiler inançlarınıza uygun beslenme planı oluşturmamıza yardımcı olacaktır.
          </Text>
        </View>

        {culturalRestrictions.length > 0 && (
          <View style={styles.selectedTagsContainer}>
            {culturalRestrictions.map((restriction) => (
              <View key={restriction} style={styles.selectedTag}>
                <Text style={styles.selectedTagText}>{restriction}</Text>
                <TouchableOpacity onPress={() => handleRemove(restriction)}>
                  <Text style={styles.removeTag}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={styles.tagContainer}>
          {culturalRestrictionsOptions.map((restriction) => (
            <TouchableOpacity
              key={restriction.value}
              style={[
                styles.tagButton,
                culturalRestrictions.includes(restriction.value) && styles.tagButtonSelected,
              ]}
              onPress={() => handleToggle(restriction.value)}
            >
              <Text style={styles.tagIcon}>{restriction.icon}</Text>
              <Text
                style={[
                  styles.tagText,
                  culturalRestrictions.includes(restriction.value) && styles.tagTextSelected,
                ]}
              >
                {restriction.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.customInputContainer}>
          <TextInput
            style={styles.customInput}
            value={customCulturalRestriction}
            onChangeText={setCustomCulturalRestriction}
            placeholder="Diğer kültürel kısıtlamalar"
            placeholderTextColor={theme.semanticColors.text.tertiary}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddCustom}>
            <Text style={styles.addButtonText}>Ekle</Text>
          </TouchableOpacity>
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

export default CulturalRestrictionsScreen;