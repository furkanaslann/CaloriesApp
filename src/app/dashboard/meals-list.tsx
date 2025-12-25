/**
 * CaloriTrack - Dashboard Meals List Screen
 * Minimal. Cool. Aesthetic.
 */

import { BORDER_RADIUS, COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useUser } from '@/context/user-context';
import { useDashboard } from '@/hooks/use-dashboard';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  time: string;
  date: string;
  type: string;
  confidence?: number;
  imageUrl?: string;
  imageBase64?: string;
  ingredients?: string[];
  healthTips?: string[];
  tags?: string[];
  portion?: string;
  healthScore?: number;
  allergens?: string[];
  processingLevel?: string;
  vitamins?: Record<string, number>;
  suggestions?: string[];
}

const MealsListScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const { getRecentMeals } = useDashboard();

  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [showMealDetail, setShowMealDetail] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedMeal, setEditedMeal] = useState<Meal | null>(null);

  // Theme object
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
      info: '#3B82F6',
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
      xs: SPACING[1],
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.semanticColors.background.primary,
    },
    header: {
      paddingHorizontal: theme.spacing['2xl'],
      paddingTop: theme.spacing['4xl'],
      paddingBottom: theme.spacing['2xl'],
      backgroundColor: theme.semanticColors.background.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.semanticColors.border.primary,
      ...theme.shadows.sm,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    backButton: {
      marginRight: theme.spacing.lg,
    },
    title: {
      fontSize: theme.textStyles.onboardingTitle?.fontSize || 30,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
    },
    subtitle: {
      fontSize: theme.textStyles.onboardingSubtitle?.fontSize || 18,
      fontWeight: '400' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.secondary,
      marginTop: theme.spacing.xs,
    },
    listContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing['2xl'],
      paddingTop: theme.spacing.lg,
    },
    mealCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      ...theme.shadows.sm,
    },
    mealHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.md,
    },
    mealInfo: {
      flex: 1,
    },
    mealName: {
      fontSize: 18,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    mealMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.lg,
    },
    mealTime: {
      fontSize: 14,
      color: theme.semanticColors.text.secondary,
    },
    mealType: {
      fontSize: 12,
      color: theme.semanticColors.text.tertiary,
      backgroundColor: '#F1F5F9',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.sm,
    },
    confidenceBadge: {
      backgroundColor: theme.colors.success + '20',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.md,
    },
    confidenceText: {
      fontSize: 10,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.colors.success,
    },
    nutritionInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.semanticColors.border.primary,
    },
    nutritionItem: {
      alignItems: 'center',
      flex: 1,
    },
    nutritionValue: {
      fontSize: 16,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
    },
    nutritionLabel: {
      fontSize: 10,
      color: theme.semanticColors.text.tertiary,
      marginTop: 2,
    },
    caloriesMain: {
      fontSize: 20,
      fontWeight: '700' as TextStyle['fontWeight'],
      color: theme.colors.primary,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing['2xl'],
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: theme.spacing.lg,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    emptyText: {
      fontSize: 16,
      color: theme.semanticColors.text.secondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    addButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing['2xl'],
      alignItems: 'center',
      marginTop: theme.spacing.lg,
      ...theme.shadows.md,
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600' as TextStyle['fontWeight'],
    },

    // Modal styles for meal detail
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      maxHeight: '80%',
      paddingTop: theme.spacing['2xl'],
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing['2xl'],
      paddingBottom: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.semanticColors.border.primary,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      flex: 1,
      marginLeft: theme.spacing.lg,
    },
    modalCloseButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#F1F5F9',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalScrollContent: {
      paddingHorizontal: theme.spacing['2xl'],
      paddingBottom: theme.spacing['4xl'],
    },
    detailSection: {
      marginBottom: theme.spacing['2xl'],
    },
    detailSectionTitle: {
      fontSize: 16,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.md,
    },
    detailNutritionGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },
    detailNutritionCard: {
      backgroundColor: '#F8FAFC',
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      alignItems: 'center',
      width: (width - theme.spacing['2xl'] * 2 - theme.spacing.md) / 2,
    },
    detailNutritionValue: {
      fontSize: 18,
      fontWeight: '700' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: 4,
    },
    detailNutritionLabel: {
      fontSize: 12,
      color: theme.semanticColors.text.secondary,
    },
    tagContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    tag: {
      backgroundColor: '#F1F5F9',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 6,
      borderRadius: theme.borderRadius.md,
    },
    tagText: {
      fontSize: 12,
      color: theme.semanticColors.text.secondary,
      fontWeight: '500',
    },
    healthScoreText: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F0FDF4',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: '#BBF7D0',
    },
    healthTipsList: {
      gap: theme.spacing.sm,
    },
    healthTipText: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: '#FEF3C7',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: '#FCD34D',
    },

    // Bottom Navigation - Modern style
    bottomNav: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 90,
      backgroundColor: '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: '#E2E8F0',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingBottom: 30,
      paddingHorizontal: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 5,
    },
    navItem: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      paddingVertical: 8,
    },
    navIcon: {
      marginBottom: 4,
    },
    navLabel: {
      fontSize: 12,
      color: '#94A3B8',
      fontWeight: '500',
    },
    navLabelActive: {
      color: '#7C3AED',
    },
    // Edit mode styles
    editButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
    },
    saveButton: {
      backgroundColor: theme.colors.success,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
    },
    cancelButton: {
      backgroundColor: theme.colors.danger,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      marginRight: theme.spacing.sm,
    },
    actionButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    editableInput: {
      backgroundColor: '#F8FAFC',
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: 16,
      color: theme.semanticColors.text.primary,
      minHeight: 44,
    },
    editableTextArea: {
      backgroundColor: '#F8FAFC',
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: 14,
      color: theme.semanticColors.text.primary,
      minHeight: 80,
      textAlignVertical: 'top',
    },
    editTagInput: {
      backgroundColor: '#F8FAFC',
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
      fontSize: 12,
      color: theme.semanticColors.text.primary,
      minHeight: 36,
      flex: 1,
    },
    tagEditContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    addTagButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
    },
    addTagButtonText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
    },
    removeTagButton: {
      backgroundColor: theme.colors.danger,
      width: 20,
      height: 20,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: theme.spacing.sm,
    },
    removeTagButtonText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '700',
    },
    editTitleInput: {
      backgroundColor: '#F8FAFC',
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
      fontSize: 18,
      fontWeight: '600',
      color: theme.semanticColors.text.primary,
      minHeight: 44,
    },
  });

  // Load meals from dashboard hook
  const loadMeals = useCallback(async () => {
    if (!user) return;

    try {
      const recentMeals = await getRecentMeals(50); // Load more meals for the list view

      // Transform meals to expected format
      const transformedMeals: Meal[] = recentMeals.map(meal => ({
        id: meal.id,
        name: meal.name,
        calories: meal.calories,
        protein: meal.nutrition?.protein || 0,
        carbs: meal.nutrition?.carbohydrates || 0,
        fat: meal.nutrition?.fats || 0,
        fiber: meal.nutrition?.fiber || 0,
        sugar: meal.nutrition?.sugar || 0,
        sodium: meal.nutrition?.sodium || 0,
        time: meal.time,
        date: meal.date,
        type: meal.type || 'Atıştırmalık',
        confidence: meal.confidence || 0,
        imageUrl: meal.imageUrl,
        imageBase64: meal.imageBase64,
        ingredients: meal.ingredients || [],
        healthTips: meal.healthTips || [],
        tags: meal.tags || [],
        portion: meal.portion || '1 porsiyon',
        healthScore: meal.healthScore,
        allergens: meal.allergens || [],
        processingLevel: meal.processingLevel,
        vitamins: meal.vitamins || {},
        suggestions: meal.suggestions || [],
      }));

      setMeals(transformedMeals);
    } catch (error) {
      console.error('Error loading meals:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, getRecentMeals]);

  useEffect(() => {
    loadMeals();
  }, [loadMeals]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadMeals();
  };

  const handleMealPress = (meal: Meal) => {
    setSelectedMeal(meal);
    setShowMealDetail(true);
  };

  const closeModal = () => {
    setShowMealDetail(false);
    setSelectedMeal(null);
    setIsEditMode(false);
    setEditedMeal(null);
  };

  const startEdit = () => {
    if (selectedMeal) {
      setIsEditMode(true);
      setEditedMeal({ ...selectedMeal });
    }
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    setEditedMeal(null);
  };

  const saveEdit = () => {
    if (editedMeal) {
      // Update the meals list with edited data
      setMeals(prevMeals =>
        prevMeals.map(meal =>
          meal.id === editedMeal.id ? editedMeal : meal
        )
      );
      setSelectedMeal(editedMeal);
      setIsEditMode(false);
      setEditedMeal(null);
      // TODO: Save to Firebase/backend
    }
  };

  const updateEditedMeal = (field: string, value: any) => {
    if (editedMeal) {
      setEditedMeal({ ...editedMeal, [field]: value });
    }
  };

  const addTag = (tag: string) => {
    if (editedMeal && tag.trim()) {
      const currentTags = editedMeal.tags || [];
      if (!currentTags.includes(tag.trim())) {
        setEditedMeal({
          ...editedMeal,
          tags: [...currentTags, tag.trim()]
        });
      }
    }
  };

  const removeTag = (index: number) => {
    if (editedMeal && editedMeal.tags) {
      setEditedMeal({
        ...editedMeal,
        tags: editedMeal.tags.filter((_, i) => i !== index)
      });
    }
  };

  const addIngredient = (ingredient: string) => {
    if (editedMeal && ingredient.trim()) {
      const currentIngredients = editedMeal.ingredients || [];
      if (!currentIngredients.includes(ingredient.trim())) {
        setEditedMeal({
          ...editedMeal,
          ingredients: [...currentIngredients, ingredient.trim()]
        });
      }
    }
  };

  const removeIngredient = (index: number) => {
    if (editedMeal && editedMeal.ingredients) {
      setEditedMeal({
        ...editedMeal,
        ingredients: editedMeal.ingredients.filter((_, i) => i !== index)
      });
    }
  };

  const addHealthTip = (tip: string) => {
    if (editedMeal && tip.trim()) {
      const currentTips = editedMeal.healthTips || [];
      setEditedMeal({
        ...editedMeal,
        healthTips: [...currentTips, tip.trim()]
      });
    }
  };

  const removeHealthTip = (index: number) => {
    if (editedMeal && editedMeal.healthTips) {
      setEditedMeal({
        ...editedMeal,
        healthTips: editedMeal.healthTips.filter((_, i) => i !== index)
      });
    }
  };

  const addAllergen = (allergen: string) => {
    if (editedMeal && allergen.trim()) {
      const currentAllergens = editedMeal.allergens || [];
      if (!currentAllergens.includes(allergen.trim())) {
        setEditedMeal({
          ...editedMeal,
          allergens: [...currentAllergens, allergen.trim()]
        });
      }
    }
  };

  const removeAllergen = (index: number) => {
    if (editedMeal && editedMeal.allergens) {
      setEditedMeal({
        ...editedMeal,
        allergens: editedMeal.allergens.filter((_, i) => i !== index)
      });
    }
  };

  const [newTag, setNewTag] = useState('');
  const [newIngredient, setNewIngredient] = useState('');
  const [newHealthTip, setNewHealthTip] = useState('');
  const [newAllergen, setNewAllergen] = useState('');

  const getMealIcon = (type: string) => {
    switch (type) {
      case 'Kahvaltı':
        return 'sunny-outline';
      case 'Öğle Yemeği':
        return 'partly-sunny-outline';
      case 'Akşam Yemeği':
        return 'moon-outline';
      default:
        return 'nutrition-outline';
    }
  };

  const renderMealItem = ({ item }: { item: Meal }) => (
    <TouchableOpacity
      style={styles.mealCard}
      onPress={() => handleMealPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.mealHeader}>
        <View style={styles.mealInfo}>
          <Text style={styles.mealName}>{item.name}</Text>
          <View style={styles.mealMeta}>
            <Text style={styles.mealTime}>{item.date} • {item.time}</Text>
            <View style={styles.mealType}>
              <Ionicons
                name={getMealIcon(item.type)}
                size={12}
                color="#64748B"
                style={{ marginRight: 4 }}
              />
              <Text style={{ fontSize: 12, color: theme.semanticColors.text.tertiary }}>{item.type}</Text>
            </View>
          </View>
        </View>
        {item.confidence !== undefined && item.confidence > 0 && (
          <View style={styles.confidenceBadge}>
            <Text style={styles.confidenceText}>{item.confidence}%</Text>
          </View>
        )}
      </View>
      <View style={styles.nutritionInfo}>
        <View style={styles.nutritionItem}>
          <Text style={[styles.nutritionValue, styles.caloriesMain]}>{item.calories}</Text>
          <Text style={styles.nutritionLabel}>Kalori</Text>
        </View>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{item.protein}g</Text>
          <Text style={styles.nutritionLabel}>Protein</Text>
        </View>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{item.carbs}g</Text>
          <Text style={styles.nutritionLabel}>Karbonhidrat</Text>
        </View>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{item.fat}g</Text>
          <Text style={styles.nutritionLabel}>Yağ</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🍽️</Text>
      <Text style={styles.emptyTitle}>Henüz Yemek Kaydı Yok</Text>
      <Text style={styles.emptyText}>
        Yemeklerinizi eklemek için kamera özelliğini kullanın veya manuel olarak kaydedin.
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/dashboard/camera')}
      >
        <Text style={styles.addButtonText}>📸 İlk Yemeği Ekle</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMealDetailModal = () => {
    if (!selectedMeal) return null;

    const displayMeal = isEditMode ? editedMeal : selectedMeal;

    return (
      <Modal
        visible={showMealDetail}
        animationType="slide"
        presentationStyle="pageSheet"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity style={styles.modalCloseButton} onPress={isEditMode ? cancelEdit : closeModal}>
                <Ionicons name={isEditMode ? "close" : "close"} size={18} color="#64748B" />
              </TouchableOpacity>
              {isEditMode ? (
                <TextInput
                  style={styles.editTitleInput}
                  value={editedMeal?.name || ''}
                  onChangeText={(text) => updateEditedMeal('name', text)}
                  placeholder="Yemek adı"
                />
              ) : (
                <Text style={styles.modalTitle} numberOfLines={1}>
                  {selectedMeal.name}
                </Text>
              )}
              {isEditMode ? (
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity style={styles.cancelButton} onPress={cancelEdit}>
                    <Text style={styles.actionButtonText}>İptal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveButton} onPress={saveEdit}>
                    <Text style={styles.actionButtonText}>Kaydet</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.editButton} onPress={startEdit}>
                  <Ionicons name="pencil" size={18} color={theme.colors.primary} />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.modalScrollContent} showsVerticalScrollIndicator={false}>
              {/* Nutrition Overview - Not editable */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Besin Değerleri</Text>
                <View style={styles.detailNutritionGrid}>
                  <View style={styles.detailNutritionCard}>
                    <Text style={styles.detailNutritionValue}>{displayMeal?.calories}</Text>
                    <Text style={styles.detailNutritionLabel}>Kalori</Text>
                  </View>
                  <View style={styles.detailNutritionCard}>
                    <Text style={styles.detailNutritionValue}>{displayMeal?.protein}g</Text>
                    <Text style={styles.detailNutritionLabel}>Protein</Text>
                  </View>
                  <View style={styles.detailNutritionCard}>
                    <Text style={styles.detailNutritionValue}>{displayMeal?.carbs}g</Text>
                    <Text style={styles.detailNutritionLabel}>Karbonhidrat</Text>
                  </View>
                  <View style={styles.detailNutritionCard}>
                    <Text style={styles.detailNutritionValue}>{displayMeal?.fat}g</Text>
                    <Text style={styles.detailNutritionLabel}>Yağ</Text>
                  </View>
                  {displayMeal?.fiber !== undefined && displayMeal.fiber > 0 && (
                    <View style={styles.detailNutritionCard}>
                      <Text style={styles.detailNutritionValue}>{displayMeal.fiber}g</Text>
                      <Text style={styles.detailNutritionLabel}>Lif</Text>
                    </View>
                  )}
                  {displayMeal?.sugar !== undefined && displayMeal.sugar > 0 && (
                    <View style={styles.detailNutritionCard}>
                      <Text style={styles.detailNutritionValue}>{displayMeal.sugar}g</Text>
                      <Text style={styles.detailNutritionLabel}>Şeker</Text>
                    </View>
                  )}
                  {displayMeal?.sodium !== undefined && displayMeal.sodium > 0 && (
                    <View style={styles.detailNutritionCard}>
                      <Text style={styles.detailNutritionValue}>{displayMeal.sodium}mg</Text>
                      <Text style={styles.detailNutritionLabel}>Sodyum</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Health Score - Editable */}
              {displayMeal?.healthScore !== undefined && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Sağlık Skoru</Text>
                  {isEditMode ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
                      <TextInput
                        style={[styles.editableInput, { flex: 1 }]}
                        value={editedMeal?.healthScore?.toString() || ''}
                        onChangeText={(text) => updateEditedMeal('healthScore', parseInt(text) || 0)}
                        keyboardType="numeric"
                        placeholder="Skor (1-10)"
                      />
                      <Text style={{ fontSize: 14, color: '#64748B' }}>/10</Text>
                    </View>
                  ) : (
                    <View style={styles.healthScoreText}>
                      <Ionicons name="shield-checkmark" size={20} color="#166534" />
                      <Text style={{ fontSize: 16, fontWeight: '600', color: '#166534' }}>
                        {' '}{displayMeal?.healthScore || 0}/10 - {(displayMeal?.healthScore || 0) >= 8 ? 'Çok Sağlıklı' : ((displayMeal?.healthScore || 0) >= 6 ? 'Sağlıklı' : 'Dengeli')}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* Tags - Editable */}
              {(displayMeal?.tags || isEditMode) && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Etiketler</Text>
                  {isEditMode ? (
                    <View>
                      <View style={styles.tagContainer}>
                        {(editedMeal?.tags || []).map((tag, index) => (
                          <View key={index} style={[styles.tag, { flexDirection: 'row', alignItems: 'center' }]}>
                            <Text style={styles.tagText}>{tag}</Text>
                            <TouchableOpacity style={styles.removeTagButton} onPress={() => removeTag(index)}>
                              <Text style={styles.removeTagButtonText}>×</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                      <View style={styles.tagEditContainer}>
                        <TextInput
                          style={styles.editTagInput}
                          value={newTag}
                          onChangeText={setNewTag}
                          placeholder="Yeni etiket..."
                          onSubmitEditing={() => { addTag(newTag); setNewTag(''); }}
                        />
                        <TouchableOpacity style={styles.addTagButton} onPress={() => { addTag(newTag); setNewTag(''); }}>
                          <Text style={styles.addTagButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    displayMeal?.tags && displayMeal.tags.length > 0 ? (
                      <View style={styles.tagContainer}>
                        {displayMeal.tags.map((tag, index) => (
                          <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                          </View>
                        ))}
                      </View>
                    ) : null
                  )}
                </View>
              )}

              {/* Ingredients - Editable */}
              {(displayMeal?.ingredients || isEditMode) && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>İçindekiler</Text>
                  {isEditMode ? (
                    <View>
                      {(editedMeal?.ingredients || []).map((ingredient, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm }}>
                          <Text style={{ fontSize: 14, color: '#64748B', flex: 1 }}>• {ingredient}</Text>
                          <TouchableOpacity style={styles.removeTagButton} onPress={() => removeIngredient(index)}>
                            <Text style={styles.removeTagButtonText}>×</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                      <View style={styles.tagEditContainer}>
                        <TextInput
                          style={styles.editTagInput}
                          value={newIngredient}
                          onChangeText={setNewIngredient}
                          placeholder="Yeni malzeme..."
                          onSubmitEditing={() => { addIngredient(newIngredient); setNewIngredient(''); }}
                        />
                        <TouchableOpacity style={styles.addTagButton} onPress={() => { addIngredient(newIngredient); setNewIngredient(''); }}>
                          <Text style={styles.addTagButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    displayMeal?.ingredients && displayMeal.ingredients.length > 0 ? (
                      displayMeal.ingredients.map((ingredient, index) => (
                        <Text key={index} style={{ fontSize: 14, color: '#64748B', marginBottom: 4 }}>
                          • {ingredient}
                        </Text>
                      ))
                    ) : null
                  )}
                </View>
              )}

              {/* Health Tips - Editable */}
              {(displayMeal?.healthTips || isEditMode) && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Sağlık İpuçları</Text>
                  {isEditMode ? (
                    <View>
                      {(editedMeal?.healthTips || []).map((tip, index) => (
                        <View key={index} style={[styles.healthTipText, { flexDirection: 'row', alignItems: 'flex-start' }]}>
                          <Ionicons name="bulb" size={16} color="#F59E0B" />
                          <Text style={{ fontSize: 14, color: '#92400E', lineHeight: 20, marginLeft: 8, flex: 1 }}>
                            {tip}
                          </Text>
                          <TouchableOpacity style={styles.removeTagButton} onPress={() => removeHealthTip(index)}>
                            <Text style={styles.removeTagButtonText}>×</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                      <View style={{ flexDirection: 'row', gap: theme.spacing.sm, marginTop: theme.spacing.sm }}>
                        <TextInput
                          style={[styles.editableTextArea, { flex: 1 }]}
                          value={newHealthTip}
                          onChangeText={setNewHealthTip}
                          placeholder="Yeni ipucu..."
                          multiline
                        />
                        <TouchableOpacity style={[styles.addTagButton, { height: 44, alignSelf: 'center' }]} onPress={() => { addHealthTip(newHealthTip); setNewHealthTip(''); }}>
                          <Text style={styles.addTagButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    displayMeal?.healthTips && displayMeal.healthTips.length > 0 ? (
                      <View style={styles.healthTipsList}>
                        {displayMeal.healthTips.map((tip, index) => (
                          <View key={index} style={styles.healthTipText}>
                            <Ionicons name="bulb" size={16} color="#F59E0B" />
                            <Text style={{ fontSize: 14, color: '#92400E', lineHeight: 20, marginLeft: 8, flex: 1 }}>
                              {tip}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ) : null
                  )}
                </View>
              )}

              {/* Allergens - Editable */}
              {(displayMeal?.allergens || isEditMode) && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Alerjen Uyarısı</Text>
                  {isEditMode ? (
                    <View>
                      <View style={{ backgroundColor: '#FEF2F2', padding: theme.spacing.md, borderRadius: theme.borderRadius.lg, borderWidth: 1, borderColor: '#FECACA', flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
                        {(editedMeal?.allergens || []).map((allergen, index) => (
                          <View key={index} style={{ backgroundColor: '#FCA5A5', paddingHorizontal: theme.spacing.sm, paddingVertical: 4, borderRadius: theme.borderRadius.sm, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#991B1B', fontSize: 12 }}>{allergen}</Text>
                            <TouchableOpacity style={[styles.removeTagButton, { marginLeft: 4, width: 16, height: 16, borderRadius: 8 }]} onPress={() => removeAllergen(index)}>
                              <Text style={[styles.removeTagButtonText, { fontSize: 10 }]}>×</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                      <View style={styles.tagEditContainer}>
                        <TextInput
                          style={styles.editTagInput}
                          value={newAllergen}
                          onChangeText={setNewAllergen}
                          placeholder="Yeni alerjen..."
                          onSubmitEditing={() => { addAllergen(newAllergen); setNewAllergen(''); }}
                        />
                        <TouchableOpacity style={styles.addTagButton} onPress={() => { addAllergen(newAllergen); setNewAllergen(''); }}>
                          <Text style={styles.addTagButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    displayMeal?.allergens && displayMeal.allergens.length > 0 ? (
                      <View style={{ backgroundColor: '#FEF2F2', padding: theme.spacing.md, borderRadius: theme.borderRadius.lg, borderWidth: 1, borderColor: '#FECACA' }}>
                        <Text style={{ color: '#991B1B', fontSize: 14, fontWeight: '500' }}>
                          ⚠️ İçerdiği alerjenler: {displayMeal.allergens.join(', ')}
                        </Text>
                      </View>
                    ) : null
                  )}
                </View>
              )}

              {/* Portion - Editable */}
              {(displayMeal?.portion || isEditMode) && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Porsiyon</Text>
                  {isEditMode ? (
                    <TextInput
                      style={styles.editableInput}
                      value={editedMeal?.portion || ''}
                      onChangeText={(text) => updateEditedMeal('portion', text)}
                      placeholder="Örn: 1 porsiyon, 100g"
                    />
                  ) : (
                    displayMeal?.portion && (
                      <Text style={{ fontSize: 14, color: '#64748B' }}>{displayMeal.portion}</Text>
                    )
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color={theme.semanticColors.text.primary} />
            </TouchableOpacity>
            <View>
              <Text style={styles.title}>Yemekler Listesi</Text>
              <Text style={styles.subtitle}>Tüm yemek kayıtlarınız</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Meals List */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : meals.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={meals}
          renderItem={renderMealItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContainer, { paddingBottom: 120 }]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Bottom Navigation - Modern style */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/dashboard')}>
          <Ionicons name="home-outline" size={24} color="#94A3B8" style={styles.navIcon} />
          <Text style={styles.navLabel}>Ana Sayfa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard/camera')}>
          <Ionicons name="camera" size={24} color="#94A3B8" style={styles.navIcon} />
          <Text style={styles.navLabel}>Kamera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard/recipes')}>
          <Ionicons name="restaurant-outline" size={24} color="#94A3B8" style={styles.navIcon} />
          <Text style={styles.navLabel}>Tarifler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard/profile')}>
          <Ionicons name="person-outline" size={24} color="#94A3B8" style={styles.navIcon} />
          <Text style={styles.navLabel}>Profil</Text>
        </TouchableOpacity>
      </View>

      {/* Meal Detail Modal */}
      {renderMealDetailModal()}
    </SafeAreaView>
  );
};

export default MealsListScreen;