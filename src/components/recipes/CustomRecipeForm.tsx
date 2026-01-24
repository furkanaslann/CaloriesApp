/**
 * CustomRecipeForm Component
 *
 * Minimal. Cool. Aesthetic.
 *
 * Premium feature - Create custom recipes with:
 * - Recipe name and description
 * - Ingredients with quantities
 * - Cooking instructions
 * - Servings, time, difficulty
 * - Photos
 * - Dietary restrictions and allergens
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRevenueCat } from '@/context/revenuecat-context';
import { PremiumGate } from '@/components/premium/PremiumGate';
import type { CreateRecipeInput, RecipeIngredient, DietaryRestriction, AllergenType } from '@/types/recipe';

// =============================================================================
// Props
// =============================================================================

export interface CustomRecipeFormProps {
  /** Callback when form is submitted */
  onSubmit: (recipe: CreateRecipeInput) => Promise<void>;
  /** Initial data for editing */
  initialData?: Partial<CreateRecipeInput>;
  /** Callback when form is cancelled */
  onCancel?: () => void;
  /** Custom container style */
  containerStyle?: object;
}

// =============================================================================
// Options
// =============================================================================

const DIFFICULTY_OPTIONS = ['easy', 'medium', 'hard'] as const;

const MEAL_TYPE_OPTIONS = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

const CUISINE_OPTIONS = [
  'american',
  'italian',
  'mexican',
  'chinese',
  'japanese',
  'indian',
  'thai',
  'mediterranean',
  'french',
  'greek',
] as const;

const COOKING_METHOD_OPTIONS = [
  'baked',
  'grilled',
  'fried',
  'steamed',
  'boiled',
  'roasted',
  'sautéed',
  'raw',
  'slow-cooked',
] as const;

const DIETARY_RESTRICTION_OPTIONS: DietaryRestriction[] = [
  'gluten-free',
  'keto',
  'low-carb',
  'low-fat',
  'vegetarian',
  'vegan',
  'dairy-free',
  'paleo',
];

const ALLERGEN_OPTIONS: AllergenType[] = [
  'gluten',
  'dairy',
  'eggs',
  'soy',
  'nuts',
  'peanuts',
  'fish',
  'shellfish',
];

// =============================================================================
// Helper Functions
// =============================================================================

const formatLabel = (str: string): string => {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// =============================================================================
// Component
// =============================================================================

export const CustomRecipeForm: React.FC<CustomRecipeFormProps> = ({
  onSubmit,
  initialData,
  onCancel,
  containerStyle,
}) => {
  const { isPremium } = useRevenueCat();
  const [showPremiumGate, setShowPremiumGate] = useState(false);

  // Form state
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [servings, setServings] = useState(initialData?.servings || 2);
  const [prepTime, setPrepTime] = useState(initialData?.prepTime || 10);
  const [cookTime, setCookTime] = useState(initialData?.cookTime || 20);
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || 'medium');
  const [mealType, setMealType] = useState(initialData?.mealType || 'dinner');
  const [cuisineType, setcuisineType] = useState(initialData?.cuisineType);
  const [cookingMethod, setCookingMethod] = useState(initialData?.cookingMethod);

  // Ingredients
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>(
    initialData?.ingredients || [
      { foodId: 'ingredient 1', quantity: 1, unit: 'cup' },
    ]
  );

  // Instructions
  const [instructions, setInstructions] = useState<string[]>(
    initialData?.instructions || ['']
  );

  // Dietary restrictions
  const [selectedDiets, setSelectedDiets] = useState<DietaryRestriction[]>(
    initialData?.dietaryRestrictions || []
  );

  // Allergens
  const [selectedAllergens, setSelectedAllergens] = useState<AllergenType[]>(
    initialData?.allergens || []
  );

  // Tags
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');

  // Photos (simplified - would use image picker in production)
  const [photos, setPhotos] = useState<string[]>(initialData?.photos || []);

  // Loading state
  const [submitting, setSubmitting] = useState(false);

  // Handle ingredient change
  const handleIngredientChange = useCallback((index: number, field: keyof RecipeIngredient, value: string | number) => {
    setIngredients(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  // Add ingredient
  const handleAddIngredient = useCallback(() => {
    setIngredients(prev => [...prev, { foodId: '', quantity: 1, unit: '' }]);
  }, []);

  // Remove ingredient
  const handleRemoveIngredient = useCallback((index: number) => {
    if (ingredients.length > 1) {
      setIngredients(prev => prev.filter((_, i) => i !== index));
    }
  }, [ingredients.length]);

  // Handle instruction change
  const handleInstructionChange = useCallback((index: number, value: string) => {
    setInstructions(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  }, []);

  // Add instruction
  const handleAddInstruction = useCallback(() => {
    setInstructions(prev => [...prev, '']);
  }, []);

  // Remove instruction
  const handleRemoveInstruction = useCallback((index: number) => {
    if (instructions.length > 1) {
      setInstructions(prev => prev.filter((_, i) => i !== index));
    }
  }, [instructions.length]);

  // Toggle dietary restriction
  const toggleDiet = useCallback((diet: DietaryRestriction) => {
    setSelectedDiets(prev =>
      prev.includes(diet)
        ? prev.filter(d => d !== diet)
        : [...prev, diet]
    );
  }, []);

  // Toggle allergen
  const toggleAllergen = useCallback((allergen: AllergenType) => {
    setSelectedAllergens(prev =>
      prev.includes(allergen)
        ? prev.filter(a => a !== allergen)
        : [...prev, allergen]
    );
  }, []);

  // Add tag
  const handleAddTag = useCallback(() => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  }, [tagInput, tags]);

  // Remove tag
  const handleRemoveTag = useCallback((tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  }, []);

  // Validate form
  const validateForm = (): boolean => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter a recipe name');
      return false;
    }

    if (ingredients.some(ing => !ing.foodId.trim())) {
      Alert.alert('Required', 'Please fill in all ingredient fields');
      return false;
    }

    if (instructions.some((inst, i) => i === instructions.length - 1 ? false : !inst.trim())) {
      Alert.alert('Required', 'Please fill in all instructions');
      return false;
    }

    if (servings < 1) {
      Alert.alert('Invalid', 'Servings must be at least 1');
      return false;
    }

    return true;
  };

  // Handle submit
  const handleSubmit = useCallback(async () => {
    if (!isPremium) {
      setShowPremiumGate(true);
      return;
    }

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const recipeData: CreateRecipeInput = {
        name: name.trim(),
        description: description.trim() || undefined,
        ingredients: ingredients.filter(ing => ing.foodId.trim()),
        instructions: instructions.filter(inst => inst.trim()),
        servings,
        prepTime,
        cookTime,
        difficulty,
        photos: photos.length > 0 ? photos : undefined,
        dietaryRestrictions: selectedDiets.length > 0 ? selectedDiets : undefined,
        allergens: selectedAllergens.length > 0 ? selectedAllergens : undefined,
        mealType,
        cuisineType,
        cookingMethod,
        tags: tags.length > 0 ? tags : [difficulty, mealType],
      };

      await onSubmit(recipeData);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create recipe');
    } finally {
      setSubmitting(false);
    }
  }, [
    name,
    description,
    ingredients,
    instructions,
    servings,
    prepTime,
    cookTime,
    difficulty,
    photos,
    selectedDiets,
    selectedAllergens,
    mealType,
    cuisineType,
    cookingMethod,
    tags,
    isPremium,
    onSubmit,
  ]);

  // Main content
  const mainContent = (
    <ScrollView
      style={[styles.container, containerStyle]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Basic Info Section */}
      <Section title="Basic Information">
        <Input
          label="Recipe Name *"
          value={name}
          onChangeText={setName}
          placeholder="e.g., Grandma's Apple Pie"
        />

        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Briefly describe your recipe..."
          multiline
          numberOfLines={3}
        />

        <View style={styles.row}>
          <Input
            label="Servings *"
            value={servings.toString()}
            onChangeText={(text) => setServings(Math.max(1, parseInt(text) || 1))}
            placeholder="2"
            keyboardType="number-pad"
            containerStyle={styles.half}
          />
          <Input
            label="Prep Time (min) *"
            value={prepTime.toString()}
            onChangeText={(text) => setPrepTime(Math.max(0, parseInt(text) || 0))}
            placeholder="10"
            keyboardType="number-pad"
            containerStyle={styles.half}
          />
        </View>

        <View style={styles.row}>
          <Input
            label="Cook Time (min) *"
            value={cookTime.toString()}
            onChangeText={(text) => setCookTime(Math.max(0, parseInt(text) || 0))}
            placeholder="20"
            keyboardType="number-pad"
            containerStyle={styles.half}
          />
          <Select
            label="Difficulty"
            value={difficulty}
            onSelect={setDifficulty}
            options={DIFFICULTY_OPTIONS}
            containerStyle={styles.half}
          />
        </View>
      </Section>

      {/* Meal & Cuisine */}
      <Section title="Category">
        <Select
          label="Meal Type"
          value={mealType}
          onSelect={setMealType}
          options={MEAL_TYPE_OPTIONS}
        />

        <Select
          label="Cuisine Type"
          value={cuisineType}
          onSelect={setcuisineType}
          options={CUISINE_OPTIONS}
          placeholder="Select cuisine..."
        />

        <Select
          label="Cooking Method"
          value={cookingMethod}
          onSelect={setCookingMethod}
          options={COOKING_METHOD_OPTIONS}
          placeholder="Select method..."
        />
      </Section>

      {/* Ingredients */}
      <Section title="Ingredients *">
        {ingredients.map((ingredient, index) => (
          <View key={index} style={styles.ingredientRow}>
            <Input
              placeholder="Ingredient"
              value={ingredient.foodId}
              onChangeText={(text) => handleIngredientChange(index, 'foodId', text)}
              containerStyle={styles.ingredientName}
            />
            <Input
              placeholder="Qty"
              value={ingredient.quantity.toString()}
              onChangeText={(text) => handleIngredientChange(index, 'quantity', parseFloat(text) || 0)}
              keyboardType="decimal-pad"
              containerStyle={styles.ingredientQty}
            />
            <Input
              placeholder="Unit"
              value={ingredient.unit}
              onChangeText={(text) => handleIngredientChange(index, 'unit', text)}
              containerStyle={styles.ingredientUnit}
            />
            {ingredients.length > 1 && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveIngredient(index)}
              >
                <Ionicons name="close-circle" size={24} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={handleAddIngredient}>
          <Ionicons name="add-circle" size={20} color="#7C3AED" />
          <Text style={styles.addButtonText}>Add Ingredient</Text>
        </TouchableOpacity>
      </Section>

      {/* Instructions */}
      <Section title="Instructions *">
        {instructions.map((instruction, index) => (
          <View key={index} style={styles.instructionRow}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>{index + 1}</Text>
            </View>
            <Input
              placeholder={`Step ${index + 1}`}
              value={instruction}
              onChangeText={(text) => handleInstructionChange(index, text)}
              multiline
              containerStyle={styles.instructionInput}
            />
            {instructions.length > 1 && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveInstruction(index)}
              >
                <Ionicons name="close-circle" size={24} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={handleAddInstruction}>
          <Ionicons name="add-circle" size={20} color="#7C3AED" />
          <Text style={styles.addButtonText}>Add Step</Text>
        </TouchableOpacity>
      </Section>

      {/* Dietary & Allergens */}
      <Section title="Dietary Information">
        <Text style={styles.sectionLabel}>Dietary Restrictions</Text>
        <View style={styles.tagContainer}>
          {DIETARY_RESTRICTION_OPTIONS.map(diet => (
            <TouchableOpacity
              key={diet}
              style={[
                styles.tag,
                selectedDiets.includes(diet) && styles.tagSelected,
              ]}
              onPress={() => toggleDiet(diet)}
            >
              <Text
                style={[
                  styles.tagText,
                  selectedDiets.includes(diet) && styles.tagTextSelected,
                ]}
              >
                {formatLabel(diet)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Contains Allergens</Text>
        <View style={styles.tagContainer}>
          {ALLERGEN_OPTIONS.map(allergen => (
            <TouchableOpacity
              key={allergen}
              style={[
                styles.tag,
                styles.tagAllergen,
                selectedAllergens.includes(allergen) && styles.tagSelectedAllergen,
              ]}
              onPress={() => toggleAllergen(allergen)}
            >
              <Text
                style={[
                  styles.tagText,
                  selectedAllergens.includes(allergen) && styles.tagTextSelected,
                ]}
              >
                {formatLabel(allergen)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Section>

      {/* Tags */}
      <Section title="Tags">
        <View style={styles.tagInputRow}>
          <TextInput
            style={styles.tagInput}
            value={tagInput}
            onChangeText={setTagInput}
            placeholder="Add a tag..."
            onSubmitEditing={handleAddTag}
          />
          <TouchableOpacity style={styles.tagAddButton} onPress={handleAddTag}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.tagContainer}>
          {tags.map(tag => (
            <TouchableOpacity
              key={tag}
              style={[styles.tag, styles.tagCustom]}
              onPress={() => handleRemoveTag(tag)}
            >
              <Text style={styles.tagText}>{tag}</Text>
              <Ionicons name="close" size={14} color="#64748B" />
            </TouchableOpacity>
          ))}
        </View>
      </Section>

      {/* Submit Button */}
      <View style={styles.footer}>
        {onCancel && (
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.submitButton, !isPremium && styles.submitButtonLocked]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <Text style={styles.submitButtonText}>Creating...</Text>
          ) : (
            <>
              <Text style={styles.submitButtonText}>
                {isPremium ? 'Create Recipe' : 'Upgrade to Create'}
              </Text>
              {!isPremium && (
                <Ionicons name="lock-closed" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
              )}
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // Non-premium users see premium gate
  if (!isPremium) {
    return (
      <>
        <View style={[styles.container, containerStyle]}>
          <View style={styles.lockedContent}>
            <LinearGradient
              colors={['#7C3AED', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.lockedIcon}
            >
              <Ionicons name="restaurant-outline" size={40} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.lockedTitle}>Premium Feature</Text>
            <Text style={styles.lockedText}>
              Create and save your own custom recipes with ingredients, instructions, and nutrition info
            </Text>
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => setShowPremiumGate(true)}
            >
              <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <PremiumGate
          visible={showPremiumGate}
          onClose={() => setShowPremiumGate(false)}
          feature="Custom Recipe Creation"
        />
      </>
    );
  }

  return mainContent;
};

// =============================================================================
// Sub-Components
// =============================================================================

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad';
  multiline?: boolean;
  numberOfLines?: number;
  containerStyle?: object;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  containerStyle,
}) => (
  <View style={[styles.inputContainer, containerStyle]}>
    {label && <Text style={styles.inputLabel}>{label}</Text>}
    <TextInput
      style={[styles.input, multiline && styles.inputMultiline]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#94A3B8"
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={numberOfLines}
    />
  </View>
);

interface SelectProps {
  label?: string;
  value?: string;
  onSelect: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  containerStyle?: object;
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  onSelect,
  options,
  placeholder = 'Select...',
  containerStyle,
}) => (
  <View style={[styles.inputContainer, containerStyle]}>
    {label && <Text style={styles.inputLabel}>{label}</Text>}
    <View style={styles.select}>
      <Text style={[styles.selectText, !value && styles.selectPlaceholder]}>
        {value ? formatLabel(value) : placeholder}
      </Text>
      <Ionicons name="chevron-down" size={16} color="#64748B" />
    </View>
    <View style={styles.optionsContainer}>
      {options.map(option => (
        <TouchableOpacity
          key={option}
          style={[styles.option, value === option && styles.optionSelected]}
          onPress={() => onSelect(option)}
        >
          <Text
            style={[styles.optionText, value === option && styles.optionTextSelected]}
          >
            {formatLabel(option)}
          </Text>
          {value === option && (
            <Ionicons name="checkmark" size={16} color="#7C3AED" />
          )}
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

// =============================================================================
// Styles
// =============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectText: {
    fontSize: 15,
    color: '#1E293B',
  },
  selectPlaceholder: {
    color: '#94A3B8',
  },
  optionsContainer: {
    marginTop: 8,
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  optionSelected: {
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    borderColor: '#7C3AED',
  },
  optionText: {
    fontSize: 14,
    color: '#1E293B',
  },
  optionTextSelected: {
    color: '#7C3AED',
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  // Ingredients
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  ingredientName: {
    flex: 1,
  },
  ingredientQty: {
    width: 60,
  },
  ingredientUnit: {
    width: 70,
  },
  removeButton: {
    padding: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
  },
  // Instructions
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
  instructionNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  instructionInput: {
    flex: 1,
  },
  // Tags
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tagSelected: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  tagAllergen: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2',
  },
  tagSelectedAllergen: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  tagCustom: {
    gap: 6,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  tagTextSelected: {
    color: '#FFFFFF',
  },
  tagInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tagInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tagAddButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Footer
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  submitButtonLocked: {
    backgroundColor: '#64748B',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Locked Content
  lockedContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  lockedIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  lockedTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  lockedText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: '#7C3AED',
    borderRadius: 12,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default CustomRecipeForm;
