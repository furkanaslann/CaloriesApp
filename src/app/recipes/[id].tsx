/**
 * CaloriTrack - Recipe Detail Screen
 * Minimal. Cool. Aesthetic.
 * Figma Design: https://www.figma.com/design/V4OjFZYz1hhZdeWSgZyYtu/Calories-Pages?node-id=47-15
 */

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { GroceryListGenerator } from '@/components/recipes';
import { RecipeLimitPrompt } from '@/components/premium/RecipeLimitPrompt';
import { recipeService } from '@/services/recipe-service';
import { useRevenueCat } from '@/context/revenuecat-context';
import type { Recipe } from '@/types/recipe';

const { width } = Dimensions.get('window');

// Recipe data based on Figma designs
const recipesData: Record<string, {
  id: string;
  name: string;
  image: string;
  calories: number;
  time: number;
  difficulty: string;
  nutrition: {
    carb: { grams: number; percent: number };
    protein: { grams: number; percent: number };
    fat: { grams: number; percent: number };
    fiber?: { grams: number; percent: number };
    sugar?: { grams: number; percent: number };
    sodium?: { grams: number; percent: number };
  };
  tags: string[];
  isFavorite?: boolean;
  ingredients: string[];
  directions: string[];
}> = {
  '1': {
    id: '1',
    name: 'Raw Vegan Key Lime Mousse',
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&h=600&fit=crop',
    calories: 233,
    time: 18,
    difficulty: 'Easy',
    nutrition: {
      carb: { grams: 28, percent: 35 },
      protein: { grams: 5, percent: 20 },
      fat: { grams: 14, percent: 45 },
      fiber: { grams: 4, percent: 16 },
      sugar: { grams: 18, percent: 36 },
      sodium: { grams: 0.15, percent: 6 },
    },
    tags: ['Gluten-Free', 'High-Protein'],
    ingredients: [
      '1 ½ cups raw cashews, soaked overnight',
      '½ cup fresh lime juice',
      '½ cup maple syrup',
      '½ cup coconut oil, melted',
      '1 tsp vanilla extract',
      '¼ tsp sea salt',
      '2 tbsp lime zest',
      'Graham cracker crust (optional)',
    ],
    directions: [
      'Drain and rinse soaked cashews.',
      'Blend cashews, lime juice, maple syrup, coconut oil, vanilla, and salt until smooth and creamy.',
      'Pour mixture into serving dishes or crust.',
      'Refrigerate for at least 4 hours or until set.',
      'Top with lime zest before serving.',
    ],
  },
  '2': {
    id: '2',
    name: 'Avocado Toast',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&h=600&fit=crop',
    calories: 320,
    time: 10,
    difficulty: 'Easy',
    nutrition: {
      carb: { grams: 25, percent: 30 },
      protein: { grams: 8, percent: 25 },
      fat: { grams: 22, percent: 65 },
      fiber: { grams: 8, percent: 32 },
      sugar: { grams: 1, percent: 2 },
      sodium: { grams: 0.4, percent: 17 },
    },
    tags: ['High-Protein', 'Low-Carb'],
    ingredients: [
      '2 slices whole grain bread',
      '1 ripe avocado',
      '1 tbsp lemon juice',
      'Salt and pepper to taste',
      'Red pepper flakes (optional)',
      'Cherry tomatoes, halved (optional)',
      'Microgreens for topping (optional)',
    ],
    directions: [
      'Toast the bread slices until golden brown.',
      'Cut avocado in half, remove pit, and scoop flesh into a bowl.',
      'Mash avocado with lemon juice, salt, and pepper.',
      'Spread mashed avocado evenly on toast.',
      'Top with red pepper flakes, tomatoes, and microgreens if desired.',
      'Serve immediately.',
    ],
  },
  '3': {
    id: '3',
    name: 'Berry Smoothie Bowl',
    image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=800&h=600&fit=crop',
    calories: 185,
    time: 8,
    difficulty: 'Easy',
    nutrition: {
      carb: { grams: 42, percent: 55 },
      protein: { grams: 6, percent: 18 },
      fat: { grams: 3, percent: 12 },
      fiber: { grams: 8, percent: 32 },
      sugar: { grams: 28, percent: 56 },
      sodium: { grams: 0.1, percent: 4 },
    },
    tags: ['Gluten-Free', 'Low-Fat'],
    ingredients: [
      '1 cup frozen mixed berries',
      '1 frozen banana',
      '½ cup almond milk',
      '¼ cup Greek yogurt',
      '1 tbsp honey',
      'Granola for topping',
      'Fresh berries for topping',
      'Chia seeds for sprinkling',
    ],
    directions: [
      'Add frozen berries, banana, almond milk, yogurt, and honey to a blender.',
      'Blend until thick and smooth, adding more milk if needed.',
      'Pour into a bowl.',
      'Top with granola, fresh berries, and chia seeds.',
      'Serve immediately and enjoy with a spoon.',
    ],
  },
  '4': {
    id: '4',
    name: 'Quinoa Salad Bowl',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop',
    calories: 410,
    time: 25,
    difficulty: 'Medium',
    nutrition: {
      carb: { grams: 48, percent: 52 },
      protein: { grams: 15, percent: 35 },
      fat: { grams: 18, percent: 40 },
      fiber: { grams: 8, percent: 32 },
      sugar: { grams: 6, percent: 12 },
      sodium: { grams: 0.5, percent: 21 },
    },
    tags: ['Gluten-Free', 'High-Protein'],
    ingredients: [
      '1 cup quinoa, cooked',
      '1 cup cherry tomatoes, halved',
      '1 cucumber, diced',
      '½ cup red onion, finely chopped',
      '1 cup chickpeas, rinsed and drained',
      '½ cup feta cheese, crumbled',
      '¼ cup olive oil',
      '3 tbsp lemon juice',
      'Fresh parsley, chopped',
      'Salt and pepper to taste',
    ],
    directions: [
      'Cook quinoa according to package instructions and let cool.',
      'In a large bowl, combine quinoa, tomatoes, cucumber, onion, and chickpeas.',
      'Whisk together olive oil, lemon juice, salt, and pepper.',
      'Pour dressing over salad and toss to combine.',
      'Top with crumbled feta and fresh parsley.',
      'Serve at room temperature or chilled.',
    ],
  },
  '5': {
    id: '5',
    name: 'Grilled Chicken Wrap',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&h=600&fit=crop',
    calories: 380,
    time: 20,
    difficulty: 'Medium',
    nutrition: {
      carb: { grams: 32, percent: 38 },
      protein: { grams: 35, percent: 78 },
      fat: { grams: 15, percent: 32 },
      fiber: { grams: 3, percent: 12 },
      sugar: { grams: 4, percent: 8 },
      sodium: { grams: 1.2, percent: 50 },
    },
    tags: ['High-Protein', 'Low-Carb'],
    ingredients: [
      '2 chicken breasts',
      '2 large whole wheat tortillas',
      '1 cup mixed greens',
      '½ cup tomatoes, diced',
      '¼ cup red onion, sliced',
      '¼ cup Greek yogurt',
      '1 tbsp lemon juice',
      '1 tsp garlic powder',
      'Salt and pepper to taste',
      'Olive oil for grilling',
    ],
    directions: [
      'Season chicken breasts with salt, pepper, and garlic powder.',
      'Grill chicken over medium-high heat for 6-7 minutes per side.',
      'Let chicken rest for 5 minutes, then slice into strips.',
      'Mix Greek yogurt with lemon juice for sauce.',
      'Warm tortillas and layer with greens, tomatoes, onion, and chicken.',
      'Drizzle with sauce and wrap tightly.',
      'Serve immediately.',
    ],
  },
  '6': {
    id: '6',
    name: 'Mediterranean Salad',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop',
    calories: 295,
    time: 15,
    difficulty: 'Easy',
    nutrition: {
      carb: { grams: 18, percent: 22 },
      protein: { grams: 12, percent: 28 },
      fat: { grams: 22, percent: 50 },
      fiber: { grams: 6, percent: 24 },
      sugar: { grams: 8, percent: 16 },
      sodium: { grams: 0.8, percent: 33 },
    },
    tags: ['Gluten-Free', 'Low-Carb'],
    ingredients: [
      '4 cups mixed greens',
      '1 cup cherry tomatoes, halved',
      '½ cup Kalamata olives, pitted',
      '½ cup cucumber, sliced',
      '¼ cup red onion, thinly sliced',
      '¼ cup feta cheese, crumbled',
      '3 tbsp olive oil',
      '2 tbsp red wine vinegar',
      '1 tsp dried oregano',
      'Salt and pepper to taste',
    ],
    directions: [
      'In a large bowl, combine greens, tomatoes, olives, cucumber, and onion.',
      'Whisk together olive oil, vinegar, oregano, salt, and pepper.',
      'Pour dressing over salad and toss well to combine.',
      'Top with crumbled feta cheese.',
      'Serve immediately or refrigerate for up to 2 hours.',
    ],
  },
};

// Styles - defined outside component for performance
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 48,
    backgroundColor: '#FFFFFF',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Notification Banner
  notificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  bannerText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  // Recipe Image
  recipeImageContainer: {
    position: 'relative',
    marginTop: 8,
  },
  recipeImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#F5F5F5',
  },
  rdBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rdBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E293B',
  },
  // Content
  scrollContent: {
    paddingBottom: 120,
  },
  // Title Section
  titleSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  // Meta Info
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingHorizontal: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#64748B',
  },
  // Nutrition Facts
  nutritionSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  nutritionCircles: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
  // Dietary Tags
  tagsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    paddingHorizontal: 16,
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  tagGlutenFree: {
    backgroundColor: '#7C3AED',
  },
  tagHighProtein: {
    backgroundColor: '#10B981',
  },
  tagLowCarb: {
    backgroundColor: '#10B981',
  },
  tagLowFat: {
    backgroundColor: '#F59E0B',
  },
  // Meal Type Tabs
  mealTypeSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  mealTypeTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  mealTypeTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  mealTypeTabActive: {
    backgroundColor: '#007AFF',
  },
  mealTypeTabText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  mealTypeTabTextActive: {
    color: '#FFFFFF',
  },
  // Servings
  servingsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  servingsLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  servingsControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  servingsValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    minWidth: 20,
    textAlign: 'center',
  },
  servingsButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Action Button
  actionButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Nutrition circle
  nutritionCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nutritionTextContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  nutritionGrams: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  nutritionPercent: {
    fontSize: 11,
    color: '#64748B',
  },
  // Show Nutrition Button
  showNutritionSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  showNutritionButton: {
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
  showNutritionButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  // Expanded Nutrition Details
  nutritionDetailsContainer: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  nutritionDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginBottom: 8,
  },
  nutritionDetailLabel: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  },
  nutritionDetailValues: {
    alignItems: 'flex-end',
  },
  nutritionDetailGrams: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
  },
  nutritionDetailPercent: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  // Ingredients Section
  ingredientsSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  ingredientBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7C3AED',
    marginTop: 6,
    marginRight: 12,
  },
  ingredientText: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
  },
  // Directions Section
  directionsSection: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  directionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  directionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  directionNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  directionText: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
    paddingTop: 4,
  },
  // Food Logging Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '95%',
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  modalScrollView: {
    flex: 1,
    paddingBottom: 100,
  },
  // Recipe Name in Modal
  modalRecipeName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 16,
    textAlign: 'center',
  },
  // Input Rows
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  inputLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  inputValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 100,
    justifyContent: 'flex-end',
  },
  inputValue: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  inputUnit: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  // Add to Multiple Days
  multipleDaysSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sectionLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  calendarDay: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  calendarDaySelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  calendarDayName: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  calendarDayNameSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  calendarDayNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  calendarDayNumberSelected: {
    color: '#FFFFFF',
  },
  // Nutrition Summary in Modal
  modalNutritionSection: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalNutritionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  modalNutritionSubtext: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  modalNutritionRow: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 12,
  },
  modalNutritionItem: {
    alignItems: 'center',
  },
  modalNutritionItemLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  // Daily Goals Progress
  dailyGoalsSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  progressItem: {
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  // Nutrition Facts Expandable
  nutritionFactsSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  nutritionFactsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nutritionFactsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  nutritionFactsLink: {
    fontSize: 14,
    color: '#007AFF',
  },
  // Modal Footer
  modalFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  reportLink: {
    fontSize: 12,
    color: '#007AFF',
  },
  // Save Button
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Time Picker Modal
  timePickerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  timePickerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 34,
  },
  timePickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
    textAlign: 'center',
  },
  timeOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: 80,
    alignItems: 'center',
  },
  timeOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  timeOptionText: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  },
  timeOptionTextSelected: {
    color: '#FFFFFF',
  },
  // Meal Picker Modal
  mealPickerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 34,
  },
  mealOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  mealOptionText: {
    fontSize: 16,
    color: '#1E293B',
    textAlign: 'center',
  },
  mealOptionSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

const NutritionCircle = ({ grams, percent, color, size = 80 }: { grams: number; percent: number; color: string; size?: number }) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <View style={[styles.nutritionCircle, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#F1F5F9"
          strokeWidth={8}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={8}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.nutritionTextContainer}>
        <Text style={styles.nutritionGrams}>{grams}g</Text>
        <Text style={styles.nutritionPercent}>{percent}%</Text>
      </View>
    </View>
  );
};

const RecipeDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // Handle both string and array cases for id
  const recipeId = Array.isArray(id) ? id[0] : id;
  const recipe = recipesData[recipeId || '1'];

  const [selectedMealType, setSelectedMealType] = useState('Lunch');
  const [servings, setServings] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFavoritesBanner, setShowFavoritesBanner] = useState(false);
  const [showLoggedBanner, setShowLoggedBanner] = useState(false);
  const [showNutritionDetails, setShowNutritionDetails] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [modalServings, setModalServings] = useState(1);
  const [selectedDayIndices, setSelectedDayIndices] = useState<number[]>([0]);
  const [showNutritionFacts, setShowNutritionFacts] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showMealPicker, setShowMealPicker] = useState(false);

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      setShowFavoritesBanner(true);
      setTimeout(() => setShowFavoritesBanner(false), 2000);
    }
  };

  const handleLogMeal = () => {
    setShowLogModal(true);
  };

  const handleSaveLog = () => {
    setShowLogModal(false);
    setShowLoggedBanner(true);
    setTimeout(() => setShowLoggedBanner(false), 2000);
  };

  // Get calendar days (past 7 days including today)
  const getCalendarDays = () => {
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();

    // Show past 7 days (6 days ago + today)
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push({
        name: dayNames[date.getDay()],
        number: date.getDate(),
        fullDate: date,
      });
    }
    return days;
  };

  const calendarDays = getCalendarDays();

  const toggleDaySelection = (index: number) => {
    setSelectedDayIndices((prev) => {
      if (prev.includes(index)) {
        // Don't allow deselecting if it's the only selected day
        if (prev.length === 1) return prev;
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  if (!recipe) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: '#64748B' }}>Recipe not found</Text>
        <Text style={{ fontSize: 14, color: '#94A3B8', marginTop: 8 }}>ID: {recipeId || 'undefined'}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="help-circle-outline" size={24} color="#1E293B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={toggleFavorite}>
            <Ionicons
              name={isFavorite ? "star" : "star-outline"}
              size={24}
              color={isFavorite ? "#FFD700" : "#1E293B"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Notification Banners */}
      {showFavoritesBanner && (
        <View style={styles.notificationBanner}>
          <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
          <Text style={styles.bannerText}>Added to Favorites</Text>
        </View>
      )}

      {showLoggedBanner && (
        <View style={styles.notificationBanner}>
          <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
          <Text style={styles.bannerText}>{selectedMealType} logged</Text>
        </View>
      )}

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Recipe Image */}
        <View style={styles.recipeImageContainer}>
          <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
          <View style={styles.rdBadge}>
            <Text style={styles.rdBadgeText}>RD Approved</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{recipe.name}</Text>
        </View>

        {/* Meta Info */}
        <View style={styles.metaInfo}>
          <View style={styles.metaItem}>
            <Ionicons name="flame" size={18} color="#64748B" />
            <Text style={styles.metaText}>{recipe.calories} Calorie</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={18} color="#64748B" />
            <Text style={styles.metaText}>{recipe.time} Minute</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="speedometer" size={18} color="#64748B" />
            <Text style={styles.metaText}>{recipe.difficulty}</Text>
          </View>
        </View>

        {/* Nutrition Facts */}
        <View style={styles.nutritionSection}>
          <View style={styles.nutritionCircles}>
            <View>
              <NutritionCircle
                grams={recipe.nutrition.carb.grams}
                percent={recipe.nutrition.carb.percent}
                color="#F59E0B"
              />
              <Text style={styles.nutritionLabel}>Carb</Text>
            </View>
            <View>
              <NutritionCircle
                grams={recipe.nutrition.protein.grams}
                percent={recipe.nutrition.protein.percent}
                color="#10B981"
              />
              <Text style={styles.nutritionLabel}>Protein</Text>
            </View>
            <View>
              <NutritionCircle
                grams={recipe.nutrition.fat.grams}
                percent={recipe.nutrition.fat.percent}
                color="#EF4444"
              />
              <Text style={styles.nutritionLabel}>Fat</Text>
            </View>
          </View>
        </View>

        {/* Dietary Tags */}
        <View style={styles.tagsSection}>
          {recipe.tags.map((tag) => {
            let tagStyle = styles.tag;
            if (tag === 'Gluten-Free') tagStyle = { ...tagStyle, ...styles.tagGlutenFree };
            else if (tag === 'High-Protein') tagStyle = { ...tagStyle, ...styles.tagHighProtein };
            else if (tag === 'Low-Carb') tagStyle = { ...tagStyle, ...styles.tagLowCarb };
            else if (tag === 'Low-Fat') tagStyle = { ...tagStyle, ...styles.tagLowFat };

            return (
              <View key={tag} style={tagStyle}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            );
          })}
        </View>

        {/* Meal Type Tabs */}
        <View style={styles.mealTypeSection}>
          <View style={styles.mealTypeTabs}>
            {mealTypes.map((meal) => (
              <TouchableOpacity
                key={meal}
                style={[
                  styles.mealTypeTab,
                  selectedMealType === meal && styles.mealTypeTabActive,
                ]}
                onPress={() => setSelectedMealType(meal)}
              >
                <Text
                  style={[
                    styles.mealTypeTabText,
                    selectedMealType === meal && styles.mealTypeTabTextActive,
                  ]}
                >
                  {meal}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Servings Selector */}
        <View style={styles.servingsSection}>
          <Text style={styles.servingsLabel}>serving</Text>
          <View style={styles.servingsControl}>
            <TouchableOpacity
              style={styles.servingsButton}
              onPress={() => setServings(Math.max(1, servings - 1))}
            >
              <Ionicons name="remove" size={20} color="#64748B" />
            </TouchableOpacity>
            <Text style={styles.servingsValue}>{servings}</Text>
            <TouchableOpacity
              style={styles.servingsButton}
              onPress={() => setServings(servings + 1)}
            >
              <Ionicons name="add" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Show Nutrition Button */}
        <View style={styles.showNutritionSection}>
          <TouchableOpacity
            style={styles.showNutritionButton}
            onPress={() => setShowNutritionDetails(!showNutritionDetails)}
          >
            <Text style={styles.showNutritionButtonText}>
              {showNutritionDetails ? 'Hide Nutrition' : 'Show Nutrition'}
            </Text>
            <Ionicons
              name={showNutritionDetails ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#64748B"
            />
          </TouchableOpacity>
        </View>

        {/* Expanded Nutrition Details */}
        {showNutritionDetails && (
          <View style={styles.nutritionDetailsContainer}>
            <View style={styles.nutritionDetailItem}>
              <Text style={styles.nutritionDetailLabel}>Net Carbs</Text>
              <View style={styles.nutritionDetailValues}>
                <Text style={styles.nutritionDetailGrams}>{recipe.nutrition.carb.grams} g</Text>
                <Text style={styles.nutritionDetailPercent}>{recipe.nutrition.carb.percent}%</Text>
              </View>
            </View>
            <View style={styles.nutritionDetailItem}>
              <Text style={styles.nutritionDetailLabel}>Protein</Text>
              <View style={styles.nutritionDetailValues}>
                <Text style={styles.nutritionDetailGrams}>{recipe.nutrition.protein.grams} g</Text>
                <Text style={styles.nutritionDetailPercent}>{recipe.nutrition.protein.percent}%</Text>
              </View>
            </View>
            <View style={styles.nutritionDetailItem}>
              <Text style={styles.nutritionDetailLabel}>Fat</Text>
              <View style={styles.nutritionDetailValues}>
                <Text style={styles.nutritionDetailGrams}>{recipe.nutrition.fat.grams} g</Text>
                <Text style={styles.nutritionDetailPercent}>{recipe.nutrition.fat.percent}%</Text>
              </View>
            </View>
            {recipe.nutrition.fiber && (
              <View style={styles.nutritionDetailItem}>
                <Text style={styles.nutritionDetailLabel}>Fiber</Text>
                <View style={styles.nutritionDetailValues}>
                  <Text style={styles.nutritionDetailGrams}>{recipe.nutrition.fiber.grams} g</Text>
                  <Text style={styles.nutritionDetailPercent}>{recipe.nutrition.fiber.percent}%</Text>
                </View>
              </View>
            )}
            {recipe.nutrition.sugar && (
              <View style={styles.nutritionDetailItem}>
                <Text style={styles.nutritionDetailLabel}>Sugar</Text>
                <View style={styles.nutritionDetailValues}>
                  <Text style={styles.nutritionDetailGrams}>{recipe.nutrition.sugar.grams} g</Text>
                  <Text style={styles.nutritionDetailPercent}>{recipe.nutrition.sugar.percent}%</Text>
                </View>
              </View>
            )}
            {recipe.nutrition.sodium && (
              <View style={styles.nutritionDetailItem}>
                <Text style={styles.nutritionDetailLabel}>Sodium</Text>
                <View style={styles.nutritionDetailValues}>
                  <Text style={styles.nutritionDetailGrams}>{recipe.nutrition.sodium.grams} g</Text>
                  <Text style={styles.nutritionDetailPercent}>{recipe.nutrition.sodium.percent}%</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Ingredients Section */}
        <View style={styles.ingredientsSection}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <View style={styles.ingredientBullet} />
              <Text style={styles.ingredientText}>{ingredient}</Text>
            </View>
          ))}
        </View>

        {/* Directions Section */}
        <View style={styles.directionsSection}>
          <Text style={styles.sectionTitle}>Directions</Text>
          {recipe.directions.map((direction, index) => (
            <View key={index} style={styles.directionItem}>
              <View style={styles.directionNumber}>
                <Text style={styles.directionNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.directionText}>{direction}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Action Button */}
      <View style={styles.actionButtonContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLogMeal}>
          <Text style={styles.actionButtonText}>Log to {selectedMealType}</Text>
        </TouchableOpacity>
      </View>

      {/* Food Logging Modal */}
      <Modal
        visible={showLogModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLogModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowLogModal(false)}>
                <Ionicons name="arrow-back" size={24} color="#1E293B" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Add Food</Text>
              <TouchableOpacity onPress={handleSaveLog}>
                <Ionicons name="checkmark" size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView}>
              {/* Recipe Name */}
              <Text style={styles.modalRecipeName}>{recipe.name}</Text>

              {/* Serving Size */}
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Serving Size</Text>
                <View style={styles.inputValueContainer}>
                  <Text style={styles.inputValue}>{modalServings} serving{modalServings > 1 ? 's' : ''}</Text>
                </View>
              </View>

              {/* Number of Servings */}
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Number of Servings</Text>
                <View style={styles.inputValueContainer}>
                  <TouchableOpacity onPress={() => setModalServings(Math.max(1, modalServings - 1))}>
                    <Ionicons name="remove" size={18} color="#64748B" style={{ marginRight: 8 }} />
                  </TouchableOpacity>
                  <Text style={styles.inputValue}>{modalServings}</Text>
                  <TouchableOpacity onPress={() => setModalServings(modalServings + 1)}>
                    <Ionicons name="add" size={18} color="#64748B" style={{ marginLeft: 8 }} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Time */}
              <TouchableOpacity style={styles.inputRow} onPress={() => setShowTimePicker(true)}>
                <Text style={styles.inputLabel}>Time</Text>
                <View style={styles.inputValueContainer}>
                  <Text style={[styles.inputValue, { color: '#007AFF' }]}>
                    {selectedTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#64748B" style={{ marginLeft: 8 }} />
                </View>
              </TouchableOpacity>

              {/* Meal Type */}
              <TouchableOpacity style={styles.inputRow} onPress={() => setShowMealPicker(true)}>
                <Text style={styles.inputLabel}>Meal</Text>
                <View style={styles.inputValueContainer}>
                  <Text style={[styles.inputValue, { color: '#007AFF' }]}>{selectedMealType}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#64748B" style={{ marginLeft: 8 }} />
                </View>
              </TouchableOpacity>

              {/* Add to Multiple Days */}
              <View style={styles.multipleDaysSection}>
                <Text style={styles.sectionLabel}>Add to Multiple Days</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.calendarRow}>
                    {calendarDays.slice(0, 7).map((day, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.calendarDay,
                          selectedDayIndices.includes(index) && styles.calendarDaySelected,
                        ]}
                        onPress={() => toggleDaySelection(index)}
                      >
                        <Text
                          style={[
                            styles.calendarDayName,
                            selectedDayIndices.includes(index) && styles.calendarDayNameSelected,
                          ]}
                        >
                          {day.name}
                        </Text>
                        <Text
                          style={[
                            styles.calendarDayNumber,
                            selectedDayIndices.includes(index) && styles.calendarDayNumberSelected,
                          ]}
                        >
                          {day.number}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Nutrition Summary */}
              <View style={styles.modalNutritionSection}>
                <Text style={styles.modalNutritionLabel}>Nutrition Per Serving</Text>
                <Text style={styles.modalNutritionSubtext}>Percent of Daily Goals</Text>

                {/* Circular Nutrition Badge */}
                <NutritionCircle
                  grams={recipe.calories * modalServings}
                  percent={Math.min(100, Math.round((recipe.calories * modalServings / 2000) * 100))}
                  color="#7C3AED"
                  size={120}
                />

                {/* Nutrition Stats */}
                <View style={styles.modalNutritionRow}>
                  <View style={styles.modalNutritionItem}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#10B981' }}>
                      {recipe.nutrition.carb.grams * modalServings}g
                    </Text>
                    <Text style={styles.modalNutritionItemLabel}>Net Carbs</Text>
                  </View>
                  <View style={styles.modalNutritionItem}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#8B5CF6' }}>
                      {recipe.nutrition.fat.grams * modalServings}g
                    </Text>
                    <Text style={styles.modalNutritionItemLabel}>Fat</Text>
                  </View>
                  <View style={styles.modalNutritionItem}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#F59E0B' }}>
                      {recipe.nutrition.protein.grams * modalServings}g
                    </Text>
                    <Text style={styles.modalNutritionItemLabel}>Protein</Text>
                  </View>
                </View>
              </View>

              {/* Percent of Daily Goals */}
              <View style={styles.dailyGoalsSection}>
                <Text style={styles.sectionLabel}>Percent of Daily Goals</Text>

                <View style={styles.progressItem}>
                  <Text style={styles.progressLabel}>Calories</Text>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${Math.min(100, (recipe.calories * modalServings / 2000) * 100)}%`,
                          backgroundColor: '#007AFF',
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.progressLabel, { textAlign: 'right', marginTop: 4 }]}>
                    {Math.min(100, Math.round((recipe.calories * modalServings / 2000) * 100))}%
                  </Text>
                </View>

                <View style={styles.progressItem}>
                  <Text style={styles.progressLabel}>Net Carbs</Text>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${Math.min(100, recipe.nutrition.carb.percent * modalServings)}%`,
                          backgroundColor: '#10B981',
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.progressLabel, { textAlign: 'right', marginTop: 4 }]}>
                    {Math.min(100, Math.round(recipe.nutrition.carb.percent * modalServings))}%
                  </Text>
                </View>

                <View style={styles.progressItem}>
                  <Text style={styles.progressLabel}>Fat</Text>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${Math.min(100, recipe.nutrition.fat.percent * modalServings)}%`,
                          backgroundColor: '#8B5CF6',
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.progressLabel, { textAlign: 'right', marginTop: 4 }]}>
                    {Math.min(100, Math.round(recipe.nutrition.fat.percent * modalServings))}%
                  </Text>
                </View>

                <View style={styles.progressItem}>
                  <Text style={styles.progressLabel}>Protein</Text>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${Math.min(100, recipe.nutrition.protein.percent * modalServings)}%`,
                          backgroundColor: '#F59E0B',
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.progressLabel, { textAlign: 'right', marginTop: 4 }]}>
                    {Math.min(100, Math.round(recipe.nutrition.protein.percent * modalServings))}%
                  </Text>
                </View>
              </View>

              {/* Nutrition Facts */}
              <View style={styles.nutritionFactsSection}>
                <View style={styles.nutritionFactsHeader}>
                  <Text style={styles.nutritionFactsTitle}>Nutrition Facts</Text>
                  <TouchableOpacity onPress={() => setShowNutritionFacts(!showNutritionFacts)}>
                    <Text style={styles.nutritionFactsLink}>
                      {showNutritionFacts ? 'Hide' : 'Show'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {showNutritionFacts && (
                  <View style={{ marginTop: 12 }}>
                    <View style={styles.nutritionDetailItem}>
                      <Text style={styles.nutritionDetailLabel}>Net Carbs</Text>
                      <View style={styles.nutritionDetailValues}>
                        <Text style={styles.nutritionDetailGrams}>{recipe.nutrition.carb.grams * modalServings} g</Text>
                        <Text style={styles.nutritionDetailPercent}>{recipe.nutrition.carb.percent}%</Text>
                      </View>
                    </View>
                    <View style={styles.nutritionDetailItem}>
                      <Text style={styles.nutritionDetailLabel}>Protein</Text>
                      <View style={styles.nutritionDetailValues}>
                        <Text style={styles.nutritionDetailGrams}>{recipe.nutrition.protein.grams * modalServings} g</Text>
                        <Text style={styles.nutritionDetailPercent}>{recipe.nutrition.protein.percent}%</Text>
                      </View>
                    </View>
                    <View style={styles.nutritionDetailItem}>
                      <Text style={styles.nutritionDetailLabel}>Fat</Text>
                      <View style={styles.nutritionDetailValues}>
                        <Text style={styles.nutritionDetailGrams}>{recipe.nutrition.fat.grams * modalServings} g</Text>
                        <Text style={styles.nutritionDetailPercent}>{recipe.nutrition.fat.percent}%</Text>
                      </View>
                    </View>
                    {recipe.nutrition.fiber && (
                      <View style={styles.nutritionDetailItem}>
                        <Text style={styles.nutritionDetailLabel}>Fiber</Text>
                        <View style={styles.nutritionDetailValues}>
                          <Text style={styles.nutritionDetailGrams}>{recipe.nutrition.fiber.grams * modalServings} g</Text>
                          <Text style={styles.nutritionDetailPercent}>{recipe.nutrition.fiber.percent}%</Text>
                        </View>
                      </View>
                    )}
                    {recipe.nutrition.sugar && (
                      <View style={styles.nutritionDetailItem}>
                        <Text style={styles.nutritionDetailLabel}>Sugar</Text>
                        <View style={styles.nutritionDetailValues}>
                          <Text style={styles.nutritionDetailGrams}>{recipe.nutrition.sugar.grams * modalServings} g</Text>
                          <Text style={styles.nutritionDetailPercent}>{recipe.nutrition.sugar.percent}%</Text>
                        </View>
                      </View>
                    )}
                    {recipe.nutrition.sodium && (
                      <View style={styles.nutritionDetailItem}>
                        <Text style={styles.nutritionDetailLabel}>Sodium</Text>
                        <View style={styles.nutritionDetailValues}>
                          <Text style={styles.nutritionDetailGrams}>{recipe.nutrition.sodium.grams * modalServings} g</Text>
                          <Text style={styles.nutritionDetailPercent}>{recipe.nutrition.sodium.percent}%</Text>
                        </View>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <Text style={styles.reportText}>
                Is this information incorrect?{' '}
                <Text style={styles.reportLink}>Report Food</Text>
              </Text>
            </View>

            {/* Time Picker Modal */}
            {showTimePicker && (
              <View style={styles.timePickerOverlay}>
                <View style={styles.timePickerContainer}>
                  <Text style={styles.timePickerTitle}>Select Time</Text>
                  <View style={styles.timeOptionsGrid}>
                    {[
                      new Date().setHours(7, 0, 0, 0),
                      new Date().setHours(8, 0, 0, 0),
                      new Date().setHours(9, 0, 0, 0),
                      new Date().setHours(12, 0, 0, 0),
                      new Date().setHours(13, 0, 0, 0),
                      new Date().setHours(14, 0, 0, 0),
                      new Date().setHours(18, 0, 0, 0),
                      new Date().setHours(19, 0, 0, 0),
                      new Date().setHours(20, 0, 0, 0),
                    ].map((timestamp, index) => {
                      const timeDate = new Date(timestamp);
                      const isSelected = timeDate.getHours() === selectedTime.getHours() && timeDate.getMinutes() === selectedTime.getMinutes();
                      return (
                        <TouchableOpacity
                          key={index}
                          style={[styles.timeOption, isSelected && styles.timeOptionSelected]}
                          onPress={() => {
                            setSelectedTime(timeDate);
                            setShowTimePicker(false);
                          }}
                        >
                          <Text
                            style={[styles.timeOptionText, isSelected && styles.timeOptionTextSelected]}
                          >
                            {timeDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  <TouchableOpacity
                    style={{ marginTop: 16, paddingVertical: 12, alignItems: 'center' }}
                    onPress={() => setShowTimePicker(false)}
                  >
                    <Text style={{ fontSize: 16, color: '#64748B' }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Meal Picker Modal */}
            {showMealPicker && (
              <View style={styles.timePickerOverlay}>
                <View style={styles.mealPickerContainer}>
                  <Text style={styles.timePickerTitle}>Select Meal</Text>
                  {mealTypes.map((meal) => (
                    <TouchableOpacity
                      key={meal}
                      style={styles.mealOption}
                      onPress={() => {
                        setSelectedMealType(meal);
                        setShowMealPicker(false);
                      }}
                    >
                      <Text
                        style={[styles.mealOptionText, selectedMealType === meal && styles.mealOptionSelected]}
                      >
                        {meal}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={{ marginTop: 8, paddingVertical: 12, alignItems: 'center' }}
                    onPress={() => setShowMealPicker(false)}
                  >
                    <Text style={{ fontSize: 16, color: '#64748B' }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default RecipeDetailScreen;
