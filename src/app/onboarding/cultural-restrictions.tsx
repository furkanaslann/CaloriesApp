/**
 * CaloriTrack - Onboarding Cultural Restrictions Screen
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

const CulturalRestrictionsScreen = () => {
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
      backgroundColor: LightTheme.semanticColors.background.primary,
    },
    content: {
      padding: LightTheme.spacing.lg,
      paddingBottom: LightTheme.spacing['4xl'],
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
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

export default CulturalRestrictionsScreen;