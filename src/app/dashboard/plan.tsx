/**
 * CaloriTrack - Dashboard Plan Screen
 * Minimal. Cool. Aesthetic.
 */

import BottomNavigation from '@/components/navigation/BottomNavigation';
import { RecipeCard } from '@/components/recipes';
import { useRecipes } from '@/hooks/use-recipes';
import { useRevenueCat } from '@/context/revenuecat-context';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextStyle,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const PlanDashboardScreen = () => {
  const router = useRouter();
  const { isPremium } = useRevenueCat();
  const { recipes, searchRecipes, canViewRecipe } = useRecipes();

  const [selectedDay, setSelectedDay] = useState('2024-01-15');
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);

  // Create theme object that matches expected structure
  const theme = {
    semanticColors: {
      background: { primary: COLORS.background },
      text: {
        primary: COLORS.textPrimary,
        secondary: COLORS.textSecondary,
        tertiary: COLORS.textTertiary,
        onPrimary: '#FFFFFF'
      },
      border: { primary: COLORS.border },
      onPrimary: '#FFFFFF',
    },
    colors: {
      primary: COLORS.primary,
      gradientStart: COLORS.primary,
      gradientEnd: '#EC4899',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
    },
    textStyles: {
      onboardingHero: { fontSize: TYPOGRAPHY.fontSizes['4xl'] },
      onboardingTitle: { fontSize: TYPOGRAPHY.fontSizes['3xl'], fontWeight: '600' },
      onboardingSubtitle: { fontSize: TYPOGRAPHY.fontSizes['xl'], fontWeight: '500' },
      onboardingDescription: { fontSize: TYPOGRAPHY.fontSizes.base },
    },
    spacing: {
      ...SPACING,
      sm: SPACING[2],
      md: SPACING[3],
      lg: SPACING[4],
      xl: SPACING[5],
      '2xl': SPACING[6],
      '4xl': SPACING[12],
    },
    borderRadius: BORDER_RADIUS,
    shadows: SHADOWS,
    coloredShadows: { gradient: SHADOWS.lg },
  };

  // Meal plan data
  const mealPlanData = {
    date: '15 Ocak 2024',
    totalCalories: 1985,
    dailyGoal: 2000,
    macros: {
      protein: { current: 145, goal: 150 },
      carbs: { current: 245, goal: 250 },
      fat: { current: 65, goal: 67 },
    },
    meals: [
      {
        id: '1',
        type: 'Kahvaltı',
        time: '08:00',
        foods: [
          { name: 'Yulaf Ezmesi', calories: 280, protein: 12, carbs: 35, fat: 8 },
          { name: 'Muz', calories: 89, protein: 1, carbs: 23, fat: 0 },
          { name: 'Badem', calories: 160, protein: 6, carbs: 6, fat: 14 },
        ],
        completed: true
      },
      {
        id: '2',
        type: 'Ara Öğün',
        time: '10:30',
        foods: [
          { name: 'Yoğurt', calories: 100, protein: 10, carbs: 6, fat: 4 },
          { name: 'Yaban Mersini', calories: 57, protein: 1, carbs: 14, fat: 0 },
        ],
        completed: true
      },
      {
        id: '3',
        type: 'Öğle Yemeği',
        time: '13:00',
        foods: [
          { name: 'Izgara Tavuk Göğsü', calories: 165, protein: 31, carbs: 0, fat: 4 },
          { name: 'Esmer Pirinç', calories: 216, protein: 5, carbs: 45, fat: 2 },
          { name: 'Brokoli', calories: 55, protein: 4, carbs: 11, fat: 1 },
        ],
        completed: false
      },
      {
        id: '4',
        type: 'Ara Öğün',
        time: '16:00',
        foods: [
          { name: 'Elma', calories: 52, protein: 0, carbs: 14, fat: 0 },
        ],
        completed: false
      },
      {
        id: '5',
        type: 'Akşam Yemeği',
        time: '19:00',
        foods: [
          { name: 'Izgara Somon', calories: 367, protein: 40, carbs: 0, fat: 22 },
          { name: 'Quinoa', calories: 120, protein: 4, carbs: 21, fat: 2 },
          { name: 'Çoban Salata', calories: 145, protein: 3, carbs: 12, fat: 10 },
        ],
        completed: false
      },
    ]
  };

  // Dynamic styles using updated theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.semanticColors.background.primary,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: theme.spacing['2xl'],
    },
    header: {
      paddingHorizontal: theme.spacing['2xl'],
      paddingTop: theme.spacing['4xl'],
      paddingBottom: theme.spacing['2xl'],
    },
    title: {
      fontSize: theme.textStyles.onboardingTitle?.fontSize || 30,
      fontWeight: (theme.textStyles.onboardingTitle?.fontWeight || '600') as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: theme.textStyles.onboardingSubtitle?.fontSize || 18,
      fontWeight: (theme.textStyles.onboardingSubtitle?.fontWeight || '400') as TextStyle['fontWeight'],
      color: theme.semanticColors.text.secondary,
    },
    content: {
      paddingHorizontal: theme.spacing['2xl'],
    },
    section: {
      marginBottom: theme.spacing['2xl'],
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.lg,
    },

    // Daily Overview Card
    overviewCard: {
      backgroundColor: theme.semanticColors.background.primary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing['2xl'],
      ...theme.shadows.sm,
    },
    overviewHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    dateInfo: {
      flex: 1,
    },
    dateText: {
      fontSize: 16,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: 4,
    },
    caloriesInfo: {
      fontSize: 14,
      color: theme.semanticColors.text.secondary,
    },
    progressBadge: {
      backgroundColor: `${theme.colors.success}20`,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
    },
    progressText: {
      fontSize: 12,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.colors.success,
    },

    // Macros Overview
    macrosContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.semanticColors.border.primary,
    },
    macroItem: {
      alignItems: 'center',
      flex: 1,
    },
    macroValue: {
      fontSize: 14,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: 2,
    },
    macroLabel: {
      fontSize: 10,
      color: theme.semanticColors.text.tertiary,
      marginBottom: 4,
    },
    macroBar: {
      height: 4,
      width: '80%',
      backgroundColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.sm,
      overflow: 'hidden',
    },
    macroFill: {
      height: '100%',
      borderRadius: theme.borderRadius.sm,
    },

    // Meal Cards
    mealCard: {
      backgroundColor: theme.semanticColors.background.primary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    mealHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    mealInfo: {
      flex: 1,
    },
    mealType: {
      fontSize: 16,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: 2,
    },
    mealTime: {
      fontSize: 12,
      color: theme.semanticColors.text.tertiary,
    },
    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.md,
    },
    completedBadge: {
      backgroundColor: `${theme.colors.success}20`,
    },
    pendingBadge: {
      backgroundColor: `${theme.colors.warning}20`,
    },
    statusText: {
      fontSize: 10,
      fontWeight: '600' as TextStyle['fontWeight'],
    },
    completedText: {
      color: theme.colors.success,
    },
    pendingText: {
      color: theme.colors.warning,
    },

    // Food Items
    foodItems: {
      borderTopWidth: 1,
      borderTopColor: theme.semanticColors.border.primary,
      paddingTop: theme.spacing.md,
    },
    foodItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    foodName: {
      fontSize: 14,
      color: theme.semanticColors.text.primary,
      flex: 1,
    },
    foodCalories: {
      fontSize: 12,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.secondary,
      marginLeft: theme.spacing.sm,
    },

    // Action Buttons
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing['4xl'],
    },
    actionButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      minWidth: (width - theme.spacing['2xl'] * 2 - theme.spacing.md) / 2,
      alignItems: 'center',
      ...theme.shadows.md,
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.onPrimary,
    },
    secondaryButtonText: {
      color: theme.semanticColors.text.primary,
    },

    // Section Header
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    seeAllText: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '600' as TextStyle['fontWeight'],
    },

    // Recipe Suggestions
    recipesScroll: {
      gap: theme.spacing.md,
      paddingRight: theme.spacing['2xl'],
    },
    recipeCardWrapper: {
      width: 280,
    },
    recipeCard: {
      width: 280,
    },
  });

  const calculateMacroPercentage = (current, goal) => (current / goal) * 100;

  const renderMealCard = ({ item }) => (
    <TouchableOpacity style={styles.mealCard}>
      <View style={styles.mealHeader}>
        <View style={styles.mealInfo}>
          <Text style={styles.mealType}>{item.type}</Text>
          <Text style={styles.mealTime}>{item.time}</Text>
        </View>
        <View style={[styles.statusBadge, item.completed ? styles.completedBadge : styles.pendingBadge]}>
          <Text style={[styles.statusText, item.completed ? styles.completedText : styles.pendingText]}>
            {item.completed ? '✓ Tamamlandı' : '⏰ Beklemede'}
          </Text>
        </View>
      </View>
      <View style={styles.foodItems}>
        {item.foods.map((food, index) => (
          <View key={index} style={styles.foodItem}>
            <Text style={styles.foodName}>{food.name}</Text>
            <Text style={styles.foodCalories}>{food.calories} kcal</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Kişisel Planlar</Text>
          <Text style={styles.subtitle}>Size özel hedefler belirlenir</Text>
        </View>

        <View style={styles.content}>
          {/* Daily Overview */}
          <View style={styles.section}>
            <View style={styles.overviewCard}>
              <View style={styles.overviewHeader}>
                <View style={styles.dateInfo}>
                  <Text style={styles.dateText}>{mealPlanData.date}</Text>
                  <Text style={styles.caloriesInfo}>
                    {mealPlanData.totalCalories} / {mealPlanData.dailyGoal} kcal
                  </Text>
                </View>
                <View style={styles.progressBadge}>
                  <Text style={styles.progressText}>
                    {Math.round((mealPlanData.totalCalories / mealPlanData.dailyGoal) * 100)}%
                  </Text>
                </View>
              </View>

              <View style={styles.macrosContainer}>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>{mealPlanData.macros.protein.current}g</Text>
                  <Text style={styles.macroLabel}>Protein</Text>
                  <View style={styles.macroBar}>
                    <View
                      style={[
                        styles.macroFill,
                        {
                          width: `${calculateMacroPercentage(mealPlanData.macros.protein.current, mealPlanData.macros.protein.goal)}%`,
                          backgroundColor: theme.colors.primary,
                        }
                      ]}
                    />
                  </View>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>{mealPlanData.macros.carbs.current}g</Text>
                  <Text style={styles.macroLabel}>Karbonhidrat</Text>
                  <View style={styles.macroBar}>
                    <View
                      style={[
                        styles.macroFill,
                        {
                          width: `${calculateMacroPercentage(mealPlanData.macros.carbs.current, mealPlanData.macros.carbs.goal)}%`,
                          backgroundColor: theme.colors.warning,
                        }
                      ]}
                    />
                  </View>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>{mealPlanData.macros.fat.current}g</Text>
                  <Text style={styles.macroLabel}>Yağ</Text>
                  <View style={styles.macroBar}>
                    <View
                      style={[
                        styles.macroFill,
                        {
                          width: `${calculateMacroPercentage(mealPlanData.macros.fat.current, mealPlanData.macros.fat.goal)}%`,
                          backgroundColor: theme.colors.success,
                        }
                      ]}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Meal Plan */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bugünkü Beslenme Planı</Text>
            <FlatList
              data={mealPlanData.meals}
              renderItem={renderMealCard}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                setSelectedMealType(null);
                setShowRecipeModal(true);
              }}
            >
              <Text style={styles.actionButtonText}>🍽️ Tarif Ekle</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
              <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>📅 Haftalık Gör</Text>
            </TouchableOpacity>
          </View>

          {/* Recipe Suggestions Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tarif Önerileri</Text>
              <TouchableOpacity onPress={() => setShowRecipeModal(true)}>
                <Text style={styles.seeAllText}>Tümünü Gör →</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recipesScroll}
            >
              {recipes.slice(0, 5).map(recipe => (
                <View key={recipe.id} style={styles.recipeCardWrapper}>
                  <RecipeCard
                    recipe={recipe}
                    onPress={() => {
                      if (canViewRecipe(recipe.id)) {
                        router.push(`/recipes/${recipe.id}`);
                      }
                    }}
                    containerStyle={styles.recipeCard}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeRoute="/dashboard/plan" />
    </SafeAreaView>
  );
};

export default PlanDashboardScreen;