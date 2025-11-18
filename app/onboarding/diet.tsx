/**
 * CaloriTrack - Onboarding Diet Preferences Screen
 * Minimal. Cool. Aesthetic.
 */

import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Button from '../../components/ui/button';
import { useOnboarding } from '../../contexts/onboarding-context';
import { useTheme } from '../../src/theme';

const DietScreen = () => {
  const themeResult = useTheme();
  const theme = themeResult || {
    semanticColors: {
      background: { primary: '#FFFFFF', surface: '#F8FAFC', primarySurface: '#EDE9FE' },
      text: { primary: '#1E293B', secondary: '#475569', tertiary: '#64748B', onPrimary: '#FFFFFF' },
      border: { primary: '#E2E8F0', secondary: '#E2E8F0' },
    },
    colors: { primary: '#7C3AED', success: '#10B981', error: '#EF4444' },
    textStyles: {
      onboardingTitle: { fontSize: 30, fontWeight: '600' },
      onboardingDescription: { fontSize: 16, fontWeight: '400' },
      heading3: { fontSize: 24, fontWeight: '600' },
      heading4: { fontSize: 20, fontWeight: '600' },
      body: { fontSize: 16, fontWeight: '400' },
      bodySmall: { fontSize: 14, fontWeight: '400' },
      labelLarge: { fontSize: 18, fontWeight: '500' },
      labelMedium: { fontSize: 15, fontWeight: '500' },
    },
    spacing: { lg: 24, md: 16, xl: 32, '4xl': 48, '3xl': 40, '2xl': 24, sm: 8, xs: 4 },
    borderRadius: { full: 9999, xl: 16, lg: 12, md: 10, sm: 8 },
    shadows: { lg: {}, md: {}, sm: {} },
    coloredShadows: { primary: {} },
  };
  const { diet, updateDiet, nextStep, previousStep } = useOnboarding();

  const [formData, setFormData] = useState({
    type: diet.type || '',
    allergies: diet.allergies || [],
    intolerances: diet.intolerances || [],
    dislikedFoods: diet.dislikedFoods || [],
    culturalRestrictions: diet.culturalRestrictions || [],
    customAllergy: '',
    customIntolerance: '',
    customDislikedFood: '',
    customCulturalRestriction: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayToggle = (arrayField: 'allergies' | 'intolerances' | 'dislikedFoods' | 'culturalRestrictions', value: string) => {
    setFormData(prev => ({
      ...prev,
      [arrayField]: prev[arrayField].includes(value)
        ? prev[arrayField].filter(item => item !== value)
        : [...prev[arrayField], value],
    }));
  };

  const handleAddCustom = (arrayField: 'allergies' | 'intolerances' | 'dislikedFoods' | 'culturalRestrictions') => {
    const customField = `custom${arrayField.charAt(0).toUpperCase() + arrayField.slice(1, -1)}`;
    const value = formData[customField as keyof typeof formData] as string;

    if (value.trim() && !formData[arrayField].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [arrayField]: [...prev[arrayField], value.trim()],
        [customField]: '',
      }));
    }
  };

  const handleRemoveItem = (arrayField: 'allergies' | 'intolerances' | 'dislikedFoods' | 'culturalRestrictions', value: string) => {
    setFormData(prev => ({
      ...prev,
      [arrayField]: prev[arrayField].filter(item => item !== value),
    }));
  };

  const handleNext = () => {
    const updatedDiet = {
      type: formData.type,
      allergies: formData.allergies,
      intolerances: formData.intolerances,
      dislikedFoods: formData.dislikedFoods,
      culturalRestrictions: formData.culturalRestrictions,
    };

    updateDiet(updatedDiet);
    nextStep();
    router.push('/onboarding/camera-tutorial');
  };

  const handlePrevious = () => {
    previousStep();
    router.back();
  };

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

  const commonIntolerances = [
    { value: 'lactose', label: 'Laktoz', icon: '🥛' },
    { value: 'gluten', label: 'Glüten', icon: '🌾' },
    { value: 'fructose', label: 'Fruktoz', icon: '🍎' },
    { value: 'histamine', label: 'Histamin', icon: '🧪' },
    { value: 'caffeine', label: 'Kafein', icon: '☕' },
    { value: 'alcohol', label: 'Alkol', icon: '🍷' },
  ];

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

  const culturalRestrictions = [
    { value: 'halal', label: 'Helal', icon: '☪️' },
    { value: 'kosher', label: 'Koşer', icon: '✡️' },
    { value: 'hindu', label: 'Hindu', icon: '🕉️' },
    { value: 'buddhist', label: 'Budist', icon: '☸️' },
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
      marginBottom: theme.spacing['3xl'],
    },
    title: {
      ...theme.textStyles.heading2,
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.md,
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
      ...theme.textStyles.caption,
      color: theme.semanticColors.text.secondary,
      marginLeft: 36,
    },
    tagContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
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
    selectedTagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
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
    customInputContainer: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      alignItems: 'center',
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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Beslenme Tercihleriniz</Text>
            <Text style={styles.subtitle}>
              Beslenme tarzınız, alerjileriniz ve tercihlerinizi belirtin. Bu bilgiler size özel beslenme planı oluşturmamıza yardımcı olacaktır.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Beslenme Türü</Text>
            <View style={styles.optionGrid}>
              {dietTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.optionCard,
                    formData.type === type.value && styles.optionCardSelected,
                  ]}
                  onPress={() => handleInputChange('type', type.value)}
                >
                  <View style={styles.optionHeader}>
                    <Text style={styles.optionIcon}>{type.icon}</Text>
                    <Text
                      style={[
                        styles.optionLabel,
                        formData.type === type.value && styles.optionLabelSelected,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </View>
                  <Text style={styles.optionDescription}>{type.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alerjiler</Text>
            {formData.allergies.length > 0 && (
              <View style={styles.selectedTagsContainer}>
                {formData.allergies.map((allergy) => (
                  <View key={allergy} style={styles.selectedTag}>
                    <Text style={styles.selectedTagText}>{allergy}</Text>
                    <TouchableOpacity onPress={() => handleRemoveItem('allergies', allergy)}>
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
                    formData.allergies.includes(allergy.value) && styles.tagButtonSelected,
                  ]}
                  onPress={() => handleArrayToggle('allergies', allergy.value)}
                >
                  <Text style={styles.tagIcon}>{allergy.icon}</Text>
                  <Text
                    style={[
                      styles.tagText,
                      formData.allergies.includes(allergy.value) && styles.tagTextSelected,
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
                value={formData.customAllergy}
                onChangeText={(text) => handleInputChange('customAllergy', text)}
                placeholder="Diğer alerjinizi yazın"
                placeholderTextColor={theme.semanticColors.text.tertiary}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddCustom('allergies')}
              >
                <Text style={styles.addButtonText}>Ekle</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>İntoleranslar</Text>
            {formData.intolerances.length > 0 && (
              <View style={styles.selectedTagsContainer}>
                {formData.intolerances.map((intolerance) => (
                  <View key={intolerance} style={styles.selectedTag}>
                    <Text style={styles.selectedTagText}>{intolerance}</Text>
                    <TouchableOpacity onPress={() => handleRemoveItem('intolerances', intolerance)}>
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
                    formData.intolerances.includes(intolerance.value) && styles.tagButtonSelected,
                  ]}
                  onPress={() => handleArrayToggle('intolerances', intolerance.value)}
                >
                  <Text style={styles.tagIcon}>{intolerance.icon}</Text>
                  <Text
                    style={[
                      styles.tagText,
                      formData.intolerances.includes(intolerance.value) && styles.tagTextSelected,
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
                value={formData.customIntolerance}
                onChangeText={(text) => handleInputChange('customIntolerance', text)}
                placeholder="Diğer intoleransınızı yazın"
                placeholderTextColor={theme.semanticColors.text.tertiary}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddCustom('intolerances')}
              >
                <Text style={styles.addButtonText}>Ekle</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sevmediğiniz Besinler</Text>
            {formData.dislikedFoods.length > 0 && (
              <View style={styles.selectedTagsContainer}>
                {formData.dislikedFoods.map((food) => (
                  <View key={food} style={styles.selectedTag}>
                    <Text style={styles.selectedTagText}>{food}</Text>
                    <TouchableOpacity onPress={() => handleRemoveItem('dislikedFoods', food)}>
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
                    formData.dislikedFoods.includes(food.value) && styles.tagButtonSelected,
                  ]}
                  onPress={() => handleArrayToggle('dislikedFoods', food.value)}
                >
                  <Text style={styles.tagIcon}>{food.icon}</Text>
                  <Text
                    style={[
                      styles.tagText,
                      formData.dislikedFoods.includes(food.value) && styles.tagTextSelected,
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
                value={formData.customDislikedFood}
                onChangeText={(text) => handleInputChange('customDislikedFood', text)}
                placeholder="Sevmediğiniz başka besinler"
                placeholderTextColor={theme.semanticColors.text.tertiary}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddCustom('dislikedFoods')}
              >
                <Text style={styles.addButtonText}>Ekle</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dinsel/Kültürel Kısıtlamalar</Text>
            {formData.culturalRestrictions.length > 0 && (
              <View style={styles.selectedTagsContainer}>
                {formData.culturalRestrictions.map((restriction) => (
                  <View key={restriction} style={styles.selectedTag}>
                    <Text style={styles.selectedTagText}>{restriction}</Text>
                    <TouchableOpacity onPress={() => handleRemoveItem('culturalRestrictions', restriction)}>
                      <Text style={styles.removeTag}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            <View style={styles.tagContainer}>
              {culturalRestrictions.map((restriction) => (
                <TouchableOpacity
                  key={restriction.value}
                  style={[
                    styles.tagButton,
                    formData.culturalRestrictions.includes(restriction.value) && styles.tagButtonSelected,
                  ]}
                  onPress={() => handleArrayToggle('culturalRestrictions', restriction.value)}
                >
                  <Text style={styles.tagIcon}>{restriction.icon}</Text>
                  <Text
                    style={[
                      styles.tagText,
                      formData.culturalRestrictions.includes(restriction.value) && styles.tagTextSelected,
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
                value={formData.customCulturalRestriction}
                onChangeText={(text) => handleInputChange('customCulturalRestriction', text)}
                placeholder="Diğer kültürel kısıtlamalar"
                placeholderTextColor={theme.semanticColors.text.tertiary}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddCustom('culturalRestrictions')}
              >
                <Text style={styles.addButtonText}>Ekle</Text>
              </TouchableOpacity>
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

export default DietScreen;