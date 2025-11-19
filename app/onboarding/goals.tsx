/**
 * CaloriTrack - Onboarding Goals Setup Screen
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
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import { useOnboarding } from '../../contexts/onboarding-context';
import { useTheme } from '../../src/theme';

const GoalsScreen = () => {
  const themeResult = useTheme();
  const theme = themeResult || {
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
  const { profile, goals, updateGoals, nextStep, previousStep } = useOnboarding();

  const [formData, setFormData] = useState({
    primaryGoal: goals.primaryGoal || 'weight_loss',
    targetWeight: goals.targetWeight?.toString() || profile.currentWeight?.toString() || '',
    timeline: goals.timeline?.toString() || '12',
    weeklyGoal: goals.weeklyGoal?.toString() || '0.5',
    motivation: goals.motivation?.toString() || '7',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGoalSelect = (goal: string) => {
    handleInputChange('primaryGoal', goal);

    // Set sensible defaults based on goal type
    switch (goal) {
      case 'weight_loss':
        handleInputChange('weeklyGoal', '0.5');
        break;
      case 'maintenance':
        handleInputChange('weeklyGoal', '0');
        break;
      case 'muscle_gain':
        handleInputChange('weeklyGoal', '0.25');
        break;
      default:
        break;
    }
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    const currentWeight = profile.currentWeight || 0;
    const targetWeight = parseFloat(formData.targetWeight);

    if (!targetWeight || targetWeight < 30 || targetWeight > 300) {
      errors.push('Hedef kilo 30-300 kg aralığında olmalıdır');
    }

    const weeklyGoal = parseFloat(formData.weeklyGoal);
    if (isNaN(weeklyGoal) || weeklyGoal < -2 || weeklyGoal > 2) {
      errors.push('Haftalık hedef -2 ila +2 kg aralığında olmalıdır');
    }

    const motivation = parseInt(formData.motivation);
    if (!motivation || motivation < 1 || motivation > 10) {
      errors.push('Motivasyon seviyesi 1-10 aralığında olmalıdır');
    }

    const timeline = parseInt(formData.timeline);
    if (!timeline || timeline < 1 || timeline > 104) {
      errors.push('Zaman çizelgesi 1-104 hafta aralığında olmalıdır');
    }

    // Check if target weight makes sense
    if (formData.primaryGoal === 'weight_loss' && targetWeight >= currentWeight) {
      errors.push('Kilo verme hedefi için hedef kilo mevcut kilodan az olmalıdır');
    }

    if (formData.primaryGoal === 'muscle_gain' && targetWeight <= currentWeight) {
      errors.push('Kas kazanma hedefi için hedef kilo mevcut kilodan fazla olmalıdır');
    }

    if (errors.length > 0) {
      Alert.alert('Doğrulama Hatası', errors.join('\n'));
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateForm()) return;

    const updatedGoals = {
      primaryGoal: formData.primaryGoal as 'weight_loss' | 'maintenance' | 'muscle_gain' | 'healthy_eating',
      targetWeight: parseFloat(formData.targetWeight),
      timeline: parseInt(formData.timeline),
      weeklyGoal: parseFloat(formData.weeklyGoal),
      motivation: parseInt(formData.motivation),
    };

    updateGoals(updatedGoals);
    nextStep();
    router.push('/onboarding/activity');
  };

  const handlePrevious = () => {
    previousStep();
    router.back();
  };

  const goalOptions = [
    {
      value: 'weight_loss',
      label: 'Kilo Verme',
      description: 'Sağlıklı bir şekilde kilo verin',
      icon: '🎯',
      color: theme.colors.error,
    },
    {
      value: 'maintenance',
      label: 'Koruma',
      description: 'Mevcut kilonuzu koruyun',
      icon: '⚖️',
      color: theme.colors.primary,
    },
    {
      value: 'muscle_gain',
      label: 'Kas Kazanma',
      description: 'Kas kütlenizi artırın',
      icon: '💪',
      color: theme.colors.success,
    },
    {
      value: 'healthy_eating',
      label: 'Sağlıklı Beslenme',
      description: 'Beslenme alışkanlıklarınızı iyileştirin',
      icon: '🥗',
      color: theme.colors.info,
    },
  ];

  const weeklyGoalOptions = [
    { value: '0.25', label: 'Yavaş (0.25 kg/hafta)' },
    { value: '0.5', label: 'Orta (0.5 kg/hafta)' },
    { value: '1', label: 'Hızlı (1 kg/hafta)' },
  ];

  const timelineOptions = [
    { value: '4', label: '1 ay' },
    { value: '12', label: '3 ay' },
    { value: '24', label: '6 ay' },
    { value: '52', label: '1 yıl' },
  ];

  const motivationLevels = [
    { value: '1-3', label: 'Düşük', emoji: '😐' },
    { value: '4-6', label: 'Orta', emoji: '🙂' },
    { value: '7-8', label: 'Yüksek', emoji: '😊' },
    { value: '9-10', label: 'Çok Yüksek', emoji: '🔥' },
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
      ...(theme?.textStyles?.bodySmall || {}),
      color: theme?.semanticColors?.text?.secondary || '#475569',
      fontSize: 16,
      fontWeight: '400',
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
    goalContainer: {
      marginBottom: theme.spacing.lg,
    },
    goalGrid: {
      gap: theme.spacing.md,
    },
    goalOption: {
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.lg,
      backgroundColor: theme.semanticColors.background.primary,
      flexDirection: 'row',
      alignItems: 'center',
      ...theme.shadows.sm,
    },
    goalOptionSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: `${theme.colors.primary}10`,
    },
    goalIcon: {
      fontSize: 32,
      marginRight: theme.spacing.lg,
    },
    goalContent: {
      flex: 1,
    },
    goalLabel: {
      ...theme.textStyles.labelLarge,
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    goalLabelSelected: {
      color: theme.colors.primary,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    goalDescription: {
      ...theme.textStyles.caption,
      color: theme.semanticColors.text.secondary,
    },
    optionContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    optionButton: {
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.semanticColors.background.primary,
    },
    optionButtonSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary,
    },
    optionText: {
      ...theme.textStyles.labelMedium,
      color: theme.semanticColors.text.primary,
    },
    optionTextSelected: {
      color: theme.semanticColors.text.onPrimary,
    },
    motivationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
    },
    motivationOption: {
      flex: 1,
      alignItems: 'center',
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.semanticColors.background.primary,
    },
    motivationOptionSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: `${theme.colors.primary}10`,
    },
    motivationEmoji: {
      fontSize: 24,
      marginBottom: theme.spacing.sm,
    },
    motivationLabel: {
      ...(theme?.textStyles?.caption || { fontSize: 12, fontWeight: '400' }),
      color: theme?.semanticColors?.text?.primary || '#1E293B',
      textAlign: 'center',
      fontSize: 14,
      fontWeight: '500',
    },
    motivationLabelSelected: {
      color: theme?.colors?.primary || '#7C3AED',
      fontWeight: '600',
    },
    sliderContainer: {
      alignItems: 'center',
      marginVertical: theme.spacing.lg,
    },
    sliderValue: {
      ...theme.textStyles.heading3,
      color: theme.colors.primary,
      marginBottom: theme.spacing.sm,
    },
    slider: {
      width: '100%',
      height: 40,
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
            <Text style={styles.title}>Hedeflerinizi Belirleyin</Text>
            <Text
              style={styles.subtitle}
            >
              Ulaşmak istediğiniz hedefleri belirleyerek size özel plan oluşturalım.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ana Hedefiniz</Text>
            <View style={styles.goalGrid}>
              {goalOptions.map((goal) => (
                <TouchableOpacity
                  key={goal.value}
                  style={[
                    styles.goalOption,
                    formData.primaryGoal === goal.value && styles.goalOptionSelected,
                  ]}
                  onPress={() => handleGoalSelect(goal.value)}
                >
                  <Text style={styles.goalIcon}>{goal.icon}</Text>
                  <View style={styles.goalContent}>
                    <Text
                      style={[
                        styles.goalLabel,
                        formData.primaryGoal === goal.value && styles.goalLabelSelected,
                      ]}
                    >
                      {goal.label}
                    </Text>
                    <Text style={styles.goalDescription}>{goal.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hedef Kilo</Text>
            <Input
              label="Hedef Kilonuz (kg)"
              value={formData.targetWeight}
              onChangeText={(text) => handleInputChange('targetWeight', text)}
              placeholder="Hedef kilonuzu girin"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Haftalık Hedef</Text>
            <View style={styles.optionContainer}>
              {weeklyGoalOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    formData.weeklyGoal === option.value && styles.optionButtonSelected,
                  ]}
                  onPress={() => handleInputChange('weeklyGoal', option.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData.weeklyGoal === option.value && styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Zaman Çizelgesi</Text>
            <View style={styles.optionContainer}>
              {timelineOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    formData.timeline === option.value && styles.optionButtonSelected,
                  ]}
                  onPress={() => handleInputChange('timeline', option.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData.timeline === option.value && styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Motivasyon Seviyeniz</Text>
            <View style={styles.motivationContainer}>
              {motivationLevels.map((level, index) => {
                const isSelected =
                  (level.value === '1-3' && formData.motivation >= '1' && formData.motivation <= '3') ||
                  (level.value === '4-6' && formData.motivation >= '4' && formData.motivation <= '6') ||
                  (level.value === '7-8' && formData.motivation >= '7' && formData.motivation <= '8') ||
                  (level.value === '9-10' && formData.motivation >= '9' && formData.motivation <= '10');

                return (
                  <TouchableOpacity
                    key={level.value}
                    style={[
                      styles.motivationOption,
                      isSelected && styles.motivationOptionSelected,
                    ]}
                    onPress={() => {
                      const middleValue = level.value.split('-')[1];
                      handleInputChange('motivation', middleValue);
                    }}
                  >
                    <Text style={styles.motivationEmoji}>{level.emoji}</Text>
                    <Text
                      style={[
                        styles.motivationLabel,
                        isSelected && styles.motivationLabelSelected,
                      ]}
                    >
                      {level.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>{formData.motivation}/10</Text>
              <TextInput
                style={styles.slider}
                value={formData.motivation}
                onChangeText={(text) => {
                  const value = parseInt(text) || 1;
                  if (value >= 1 && value <= 10) {
                    handleInputChange('motivation', value.toString());
                  }
                }}
                keyboardType="numeric"
                maxLength={2}
                textAlign="center"
              />
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

export default GoalsScreen;