/**
 * CaloriTrack - Onboarding Activity Level Screen
 * Minimal. Cool. Aesthetic.
 */

import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import { useOnboarding } from '../../contexts/onboarding-context';
import { useTheme } from '../../src/theme';

const ActivityScreen = () => {
  const themeResult = useTheme();
  const theme = themeResult || {
    semanticColors: {
      background: { primary: '#FFFFFF', surface: '#F8FAFC', primarySurface: '#EDE9FE' },
      text: { primary: '#1E293B', secondary: '#475569', tertiary: '#64748B', onPrimary: '#FFFFFF' },
      border: { primary: '#E2E8F0', secondary: '#E2E8F0' },
    },
    colors: { primary: '#7C3AED', success: '#10B981', warning: '#F59E0B', info: '#3B82F6' },
    textStyles: {
      onboardingTitle: { fontSize: 30, fontWeight: '600' },
      onboardingDescription: { fontSize: 16, fontWeight: '400' },
      heading3: { fontSize: 24, fontWeight: '600' },
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
  const { activity, updateActivity, nextStep, previousStep } = useOnboarding();

  const [formData, setFormData] = useState({
    level: activity.level || 'sedentary',
    occupation: activity.occupation || 'office',
    exerciseTypes: activity.exerciseTypes || [],
    exerciseFrequency: activity.exerciseFrequency?.toString() || '3',
    sleepHours: activity.sleepHours?.toString() || '7',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleExerciseTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      exerciseTypes: prev.exerciseTypes.includes(type)
        ? prev.exerciseTypes.filter(t => t !== type)
        : [...prev.exerciseTypes, type],
    }));
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    const exerciseFrequency = parseInt(formData.exerciseFrequency);
    if (isNaN(exerciseFrequency) || exerciseFrequency < 0 || exerciseFrequency > 7) {
      errors.push('Egzersiz sıklığı 0-7 gün aralığında olmalıdır');
    }

    const sleepHours = parseFloat(formData.sleepHours);
    if (isNaN(sleepHours) || sleepHours < 4 || sleepHours > 12) {
      errors.push('Uyku süresi 4-12 saat aralığında olmalıdır');
    }

    if (errors.length > 0) {
      Alert.alert('Doğrulama Hatası', errors.join('\n'));
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateForm()) return;

    const updatedActivity = {
      level: formData.level as 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active',
      occupation: formData.occupation as 'office' | 'physical' | 'mixed',
      exerciseTypes: formData.exerciseTypes,
      exerciseFrequency: parseInt(formData.exerciseFrequency),
      sleepHours: parseFloat(formData.sleepHours),
    };

    updateActivity(updatedActivity);
    nextStep();
    router.push('/onboarding/diet');
  };

  const handlePrevious = () => {
    previousStep();
    router.back();
  };

  const activityLevels = [
    {
      value: 'sedentary',
      label: 'Hareketsiz',
      description: 'Çok az veya hiç egzersiz yapmıyorum, masa başı iş',
      icon: '🪑',
    },
    {
      value: 'lightly_active',
      label: 'Hafif Aktif',
      description: 'Haftada 1-3 gün hafif egzersiz',
      icon: '🚶',
    },
    {
      value: 'moderately_active',
      label: 'Orta Aktif',
      description: 'Haftada 3-5 gün orta egzersiz',
      icon: '🏃',
    },
    {
      value: 'very_active',
      label: 'Çok Aktif',
      description: 'Haftada 6-7 gün yoğun egzersiz',
      icon: '💪',
    },
    {
      value: 'extremely_active',
      label: 'Son Derece Aktif',
      description: 'Günlük çok yoğun fiziksel aktivite',
      icon: '🔥',
    },
  ];

  const occupationTypes = [
    {
      value: 'office',
      label: 'Ofis İşleri',
      description: 'Masa başı, bilgisayar başında çalışıyorum',
      icon: '💻',
    },
    {
      value: 'physical',
      label: 'Fiziksel İş',
      description: 'Ayakta, fiziksel çaba gerektiren iş',
      icon: '🏗️',
    },
    {
      value: 'mixed',
      label: 'Karma',
      description: 'Hem ofis hem fiziksel aktivite',
      icon: '🔄',
    },
  ];

  const exerciseTypeOptions = [
    { value: 'cardio', label: 'Kardiyo', icon: '🏃' },
    { value: 'strength', label: 'Kuvvet', icon: '🏋️' },
    { value: 'yoga', label: 'Yoga', icon: '🧘' },
    { value: 'sports', label: 'Spor', icon: '⚽' },
    { value: 'walking', label: 'Yürüme', icon: '🚶' },
    { value: 'cycling', label: 'Bisiklet', icon: '🚴' },
    { value: 'swimming', label: 'Yüzme', icon: '🏊' },
    { value: 'dancing', label: 'Dans', icon: '💃' },
  ];

  const sleepOptions = [
    { value: '5', label: '5 saat' },
    { value: '6', label: '6 saat' },
    { value: '7', label: '7 saat' },
    { value: '8', label: '8 saat' },
    { value: '9', label: '9 saat' },
    { value: '10', label: '10+ saat' },
  ];

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
    },
    header: {
      marginTop: '10%',
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
      lineHeight: theme.typography.lineHeight.relaxed,
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
      fontWeight: theme.typography.fontWeight.semibold,
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
    exerciseTypesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    exerciseTypeButton: {
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
    exerciseTypeButtonSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary,
    },
    exerciseTypeIcon: {
      fontSize: 16,
    },
    exerciseTypeText: {
      ...theme.textStyles.labelSmall,
      color: theme.semanticColors.text.primary,
    },
    exerciseTypeTextSelected: {
      color: theme.semanticColors.text.onPrimary,
    },
    inputContainer: {
      marginBottom: theme.spacing.lg,
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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Aktivite Seviyeniz</Text>
            <Text
              style={[
                styles.subtitle,
                {
                  ...(theme?.textStyles?.bodySmall || {}),
                  color: theme?.semanticColors?.text?.secondary || '#475569',
                  fontSize: 16,
                  fontWeight: '400',
                  lineHeight: 24,
                }
              ]}
            >
              Günlük aktivite seviyenizi ve yaşam tarzınızı belirtin. Bu bilgiler metabolizma hızınızı hesaplamamıza yardımcı olacaktır.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Aktivite Seviyesi</Text>
            <View style={styles.optionGrid}>
              {activityLevels.map((level) => (
                <TouchableOpacity
                  key={level.value}
                  style={[
                    styles.optionCard,
                    formData.level === level.value && styles.optionCardSelected,
                  ]}
                  onPress={() => handleInputChange('level', level.value)}
                >
                  <View style={styles.optionHeader}>
                    <Text style={styles.optionIcon}>{level.icon}</Text>
                    <Text
                      style={[
                        styles.optionLabel,
                        formData.level === level.value && styles.optionLabelSelected,
                      ]}
                    >
                      {level.label}
                    </Text>
                  </View>
                  <Text style={styles.optionDescription}>{level.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meslek</Text>
            <View style={styles.optionGrid}>
              {occupationTypes.map((occupation) => (
                <TouchableOpacity
                  key={occupation.value}
                  style={[
                    styles.optionCard,
                    formData.occupation === occupation.value && styles.optionCardSelected,
                  ]}
                  onPress={() => handleInputChange('occupation', occupation.value)}
                >
                  <View style={styles.optionHeader}>
                    <Text style={styles.optionIcon}>{occupation.icon}</Text>
                    <Text
                      style={[
                        styles.optionLabel,
                        formData.occupation === occupation.value && styles.optionLabelSelected,
                      ]}
                    >
                      {occupation.label}
                    </Text>
                  </View>
                  <Text style={styles.optionDescription}>{occupation.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Egzersiz Türleri</Text>
            <Text style={styles.optionDescription}>Yaptığınız egzersiz türlerini seçin (birden fazla seçebilirsiniz)</Text>
            <View style={styles.exerciseTypesContainer}>
              {exerciseTypeOptions.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.exerciseTypeButton,
                    formData.exerciseTypes.includes(type.value) && styles.exerciseTypeButtonSelected,
                  ]}
                  onPress={() => handleExerciseTypeToggle(type.value)}
                >
                  <Text style={styles.exerciseTypeIcon}>{type.icon}</Text>
                  <Text
                    style={[
                      styles.exerciseTypeText,
                      formData.exerciseTypes.includes(type.value) && styles.exerciseTypeTextSelected,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Egzersiz Sıklığı</Text>
            <View style={styles.inputContainer}>
              <Input
                label="Haftada Kaç Gün Egzersiz Yapıyorsunuz?"
                value={formData.exerciseFrequency}
                onChangeText={(text) => handleInputChange('exerciseFrequency', text)}
                placeholder="0-7 arasında bir sayı girin"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Uyku Süresi</Text>
            <View style={styles.exerciseTypesContainer}>
              {sleepOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.exerciseTypeButton,
                    formData.sleepHours === option.value && styles.exerciseTypeButtonSelected,
                  ]}
                  onPress={() => handleInputChange('sleepHours', option.value)}
                >
                  <Text
                    style={[
                      styles.exerciseTypeText,
                      formData.sleepHours === option.value && styles.exerciseTypeTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
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

export default ActivityScreen;