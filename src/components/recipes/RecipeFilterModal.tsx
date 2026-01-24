/**
 * RecipeFilterModal Component
 *
 * Minimal. Cool. Aesthetic.
 *
 * Filter modal with:
 * - Meal type selection
 * - Diet restrictions (checkboxes)
 * - Calorie range
 * - Time range
 * - Allergens
 * - Difficulty level
 * - Processing level
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type {
  RecipeFilters,
  MealType,
  DietaryRestriction,
  AllergenType,
  DifficultyLevel,
  ProcessingLevel,
} from '@/types/recipe';

// =============================================================================
// Props
// =============================================================================

export interface RecipeFilterModalProps {
  /** Whether modal is visible */
  visible: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Callback when filters are applied */
  onApplyFilters: (filters: RecipeFilters) => void;
  /** Initial filters */
  initialFilters?: RecipeFilters;
  /** Available meal types */
  mealTypes?: (MealType | 'all')[];
  /** Available diet options */
  dietOptions?: DietaryRestriction[];
  /** Available allergen options */
  allergenOptions?: AllergenType[];
  /** Calorie range options */
  calorieRanges?: string[];
  /** Time range options */
  timeRanges?: string[];
}

// =============================================================================
// Default Options
// =============================================================================

const DEFAULT_MEAL_TYPES: (MealType | 'all')[] = [
  'all',
  'breakfast',
  'lunch',
  'dinner',
  'snack',
];

const DEFAULT_DIET_OPTIONS: DietaryRestriction[] = [
  'gluten-free',
  'keto',
  'low-carb',
  'low-fat',
  'vegetarian',
  'vegan',
  'dairy-free',
];

const DEFAULT_ALLERGEN_OPTIONS: AllergenType[] = [
  'gluten',
  'dairy',
  'eggs',
  'soy',
  'nuts',
  'peanuts',
  'fish',
  'shellfish',
];

const DEFAULT_CALORIE_RANGES = [
  '0-200 Cal',
  '200-400 Cal',
  '400-600 Cal',
  '600+ Cal',
];

const DEFAULT_TIME_RANGES = [
  '0-15 min',
  '15-30 min',
  '30-60 min',
  '60+ min',
];

const DIFFICULTY_LEVELS: DifficultyLevel[] = ['easy', 'medium', 'hard'];

const PROCESSING_LEVELS: ProcessingLevel[] = [
  'unprocessed',
  'minimally-processed',
  'processed',
  'ultra-processed',
];

// =============================================================================
// Helper Functions
// =============================================================================

const formatMealType = (type: MealType | 'all'): string => {
  if (type === 'all') return 'All';
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const formatDietaryRestriction = (diet: DietaryRestriction): string => {
  return diet
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const formatAllergen = (allergen: AllergenType): string => {
  return allergen.charAt(0).toUpperCase() + allergen.slice(1);
};

const formatDifficulty = (difficulty: DifficultyLevel): string => {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
};

const formatProcessingLevel = (level: ProcessingLevel): string => {
  return level
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// =============================================================================
// Component
// =============================================================================

export const RecipeFilterModal: React.FC<RecipeFilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  initialFilters,
  mealTypes = DEFAULT_MEAL_TYPES,
  dietOptions = DEFAULT_DIET_OPTIONS,
  allergenOptions = DEFAULT_ALLERGEN_OPTIONS,
  calorieRanges = DEFAULT_CALORIE_RANGES,
  timeRanges = DEFAULT_TIME_RANGES,
}) => {
  // Local filter state
  const [selectedMealType, setSelectedMealType] = useState<MealType | 'all'>(
    initialFilters?.mealType || 'all'
  );
  const [selectedDiets, setSelectedDiets] = useState<DietaryRestriction[]>(
    initialFilters?.diet || []
  );
  const [selectedAllergens, setSelectedAllergens] = useState<AllergenType[]>(
    initialFilters?.allergens || []
  );
  const [selectedCalories, setSelectedCalories] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | undefined>(
    initialFilters?.difficulty
  );
  const [selectedProcessingLevel, setSelectedProcessingLevel] = useState<ProcessingLevel | undefined>(
    initialFilters?.processingLevel
  );

  // Reset filters when modal opens with initialFilters
  useEffect(() => {
    if (visible && initialFilters) {
      setSelectedMealType(initialFilters.mealType || 'all');
      setSelectedDiets(initialFilters.diet || []);
      setSelectedAllergens(initialFilters.allergens || []);
      setSelectedDifficulty(initialFilters.difficulty);
      setSelectedProcessingLevel(initialFilters.processingLevel);
    }
  }, [visible, initialFilters]);

  // Toggle diet selection
  const toggleDiet = useCallback((diet: DietaryRestriction) => {
    setSelectedDiets(prev =>
      prev.includes(diet)
        ? prev.filter(d => d !== diet)
        : [...prev, diet]
    );
  }, []);

  // Toggle allergen selection
  const toggleAllergen = useCallback((allergen: AllergenType) => {
    setSelectedAllergens(prev =>
      prev.includes(allergen)
        ? prev.filter(a => a !== allergen)
        : [...prev, allergen]
    );
  }, []);

  // Parse calorie range
  const parseCalorieRange = (range: string): { min: number; max: number } | undefined => {
    if (!range) return undefined;
    const match = range.match(/(\d+)(?:\+(\s*)Cal)?/);
    if (!match) return undefined;

    const min = range.includes('+') ? parseInt(match[1]) : 0;
    const parts = range.split('-');
    if (parts.length === 2) {
      return {
        min: parseInt(parts[0]),
        max: parseInt(parts[1]),
      };
    }
    return { min, max: 9999 };
  };

  // Parse time range
  const parseTimeRange = (range: string): { min: number; max: number } | undefined => {
    if (!range) return undefined;
    const parts = range.split('-');
    if (parts.length === 2) {
      const min = parseInt(parts[0]);
      const max = parts[1].includes('+') ? 999 : parseInt(parts[1]);
      return { min, max };
    }
    return undefined;
  };

  // Handle apply filters
  const handleApplyFilters = useCallback(() => {
    const filters: RecipeFilters = {
      mealType: selectedMealType === 'all' ? undefined : selectedMealType,
      diet: selectedDiets.length > 0 ? selectedDiets : undefined,
      allergens: selectedAllergens.length > 0 ? selectedAllergens : undefined,
      calories: parseCalorieRange(selectedCalories),
      time: parseTimeRange(selectedTime),
      difficulty: selectedDifficulty,
      processingLevel: selectedProcessingLevel,
    };

    onApplyFilters(filters);
    onClose();
  }, [
    selectedMealType,
    selectedDiets,
    selectedAllergens,
    selectedCalories,
    selectedTime,
    selectedDifficulty,
    selectedProcessingLevel,
    onApplyFilters,
    onClose,
  ]);

  // Handle clear all filters
  const handleClearFilters = useCallback(() => {
    setSelectedMealType('all');
    setSelectedDiets([]);
    setSelectedAllergens([]);
    setSelectedCalories('');
    setSelectedTime('');
    setSelectedDifficulty(undefined);
    setSelectedProcessingLevel(undefined);
  }, []);

  // Check if any filters are active
  const hasActiveFilters =
    selectedMealType !== 'all' ||
    selectedDiets.length > 0 ||
    selectedAllergens.length > 0 ||
    selectedCalories !== '' ||
    selectedTime !== '' ||
    selectedDifficulty !== undefined ||
    selectedProcessingLevel !== undefined;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.overlay}>
        {/* Modal Content */}
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Meal Type */}
            <FilterSection title="Meal Type">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {mealTypes.map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterTag,
                      selectedMealType === type && styles.filterTagSelected,
                    ]}
                    onPress={() => setSelectedMealType(type)}
                  >
                    <Text
                      style={[
                        styles.filterTagText,
                        selectedMealType === type && styles.filterTagTextSelected,
                      ]}
                    >
                      {formatMealType(type)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </FilterSection>

            {/* Diet */}
            <FilterSection title="Diet">
              {dietOptions.map(diet => (
                <CheckboxItem
                  key={diet}
                  label={formatDietaryRestriction(diet)}
                  selected={selectedDiets.includes(diet)}
                  onPress={() => toggleDiet(diet)}
                />
              ))}
            </FilterSection>

            {/* Allergens */}
            <FilterSection title="Exclude Allergens">
              {allergenOptions.map(allergen => (
                <CheckboxItem
                  key={allergen}
                  label={formatAllergen(allergen)}
                  selected={selectedAllergens.includes(allergen)}
                  onPress={() => toggleAllergen(allergen)}
                  caution // Show allergens in a different style
                />
              ))}
            </FilterSection>

            {/* Calories */}
            <FilterSection title="Calories">
              {calorieRanges.map(range => (
                <RadioItem
                  key={range}
                  label={range}
                  selected={selectedCalories === range}
                  onPress={() => setSelectedCalories(range)}
                />
              ))}
            </FilterSection>

            {/* Time */}
            <FilterSection title="Cooking Time">
              {timeRanges.map(range => (
                <RadioItem
                  key={range}
                  label={range}
                  selected={selectedTime === range}
                  onPress={() => setSelectedTime(range)}
                />
              ))}
            </FilterSection>

            {/* Difficulty */}
            <FilterSection title="Difficulty">
              <View style={styles.horizontalScroll}>
                {DIFFICULTY_LEVELS.map(level => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.filterTag,
                      selectedDifficulty === level && styles.filterTagSelected,
                    ]}
                    onPress={() => setSelectedDifficulty(
                      selectedDifficulty === level ? undefined : level
                    )}
                  >
                    <Text
                      style={[
                        styles.filterTagText,
                        selectedDifficulty === level && styles.filterTagTextSelected,
                      ]}
                    >
                      {formatDifficulty(level)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </FilterSection>

            {/* Processing Level */}
            <FilterSection title="Processing Level">
              {PROCESSING_LEVELS.map(level => (
                <RadioItem
                  key={level}
                  label={formatProcessingLevel(level)}
                  selected={selectedProcessingLevel === level}
                  onPress={() =>
                    setSelectedProcessingLevel(
                      selectedProcessingLevel === level ? undefined : level
                    )
                  }
                />
              ))}
            </FilterSection>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            {hasActiveFilters && (
              <TouchableOpacity
                style={styles.clearButtonFooter}
                onPress={handleClearFilters}
              >
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.applyButton, !hasActiveFilters && styles.applyButtonFull]}
              onPress={handleApplyFilters}
            >
              <Text style={styles.applyButtonText}>
                Apply Filters{hasActiveFilters ? ` (${[
                  selectedMealType !== 'all' ? 1 : 0,
                  selectedDiets.length,
                  selectedAllergens.length,
                  selectedCalories ? 1 : 0,
                  selectedTime ? 1 : 0,
                  selectedDifficulty ? 1 : 0,
                  selectedProcessingLevel ? 1 : 0,
                ].reduce((a, b) => a + b, 0)})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

// =============================================================================
// Sub-Components
// =============================================================================

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

interface CheckboxItemProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  caution?: boolean;
}

const CheckboxItem: React.FC<CheckboxItemProps> = ({
  label,
  selected,
  onPress,
  caution = false,
}) => (
  <TouchableOpacity
    style={[styles.item, caution && styles.itemCaution]}
    onPress={onPress}
  >
    <View style={styles.itemLeft}>
      <View
        style={[
          styles.checkbox,
          caution && styles.checkboxCaution,
          selected && styles.checkboxSelected,
          caution && selected && styles.checkboxCautionSelected,
        ]}
      >
        {selected && <View style={styles.checkboxInner} />}
      </View>
      <Text style={styles.itemText}>{label}</Text>
    </View>
  </TouchableOpacity>
);

interface RadioItemProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const RadioItem: React.FC<RadioItemProps> = ({ label, selected, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Text style={styles.itemText}>{label}</Text>
    <View
      style={[styles.radio, selected && styles.radioSelected]}
    >
      {selected && <View style={styles.radioInner} />}
    </View>
  </TouchableOpacity>
);

// =============================================================================
// Styles
// =============================================================================

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 34,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  horizontalScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  filterTag: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterTagSelected: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  filterTagText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  filterTagTextSelected: {
    color: '#FFFFFF',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 8,
  },
  itemCaution: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemText: {
    fontSize: 15,
    color: '#1E293B',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  checkboxCaution: {
    borderColor: '#FCA5A5',
  },
  checkboxSelected: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  checkboxCautionSelected: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  checkboxInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  radioSelected: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  clearButtonFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonFull: {
    flex: 1,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default RecipeFilterModal;
