/**
 * AIRecommendationsCard Component
 *
 * Minimal. Cool. Aesthetic.
 *
 * Premium feature - AI-powered recipe recommendations based on:
 * - User nutrition goals
 * - Dietary restrictions
 * - Allergens
 * - Preferred cuisines
 * - Meal type
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRevenueCat } from '@/context/revenuecat-context';
import { PremiumGate } from '@/components/premium/PremiumGate';
import type { Recipe, AIRecommendationParams } from '@/types/recipe';

// =============================================================================
// Props
// =============================================================================

export interface AIRecommendationsCardProps {
  /** User nutrition goals */
  userGoals: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fats: number;
  };
  /** Dietary restrictions */
  dietaryRestrictions?: string[];
  /** Allergens to avoid */
  allergens?: string[];
  /** Preferred cuisines */
  preferredCuisines?: string[];
  /** Meal type to filter by */
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  /** Maximum calories per recipe */
  maxCalories?: number;
  /** Maximum cooking time */
  maxTime?: number;
  /** Callback when recipe is selected */
  onRecipePress?: (recipe: Recipe) => void;
  /** Callback when refresh is pressed */
  onRefresh?: () => void;
  /** Recommendations (if already fetched) */
  recommendations?: Recipe[];
  /** Loading state */
  loading?: boolean;
  /** Custom container style */
  containerStyle?: object;
}

// =============================================================================
// Component
// =============================================================================

export const AIRecommendationsCard: React.FC<AIRecommendationsCardProps> = ({
  userGoals,
  dietaryRestrictions = [],
  allergens = [],
  preferredCuisines = [],
  mealType,
  maxCalories,
  maxTime,
  onRecipePress,
  onRefresh,
  recommendations = [],
  loading = false,
  containerStyle,
}) => {
  const { isPremium } = useRevenueCat();
  const { width } = useWindowDimensions();
  const [showPremiumGate, setShowPremiumGate] = useState(false);

  const cardWidth = (width - 48) / 2;

  // Handle refresh (triggers premium check)
  const handleRefresh = useCallback(() => {
    if (!isPremium) {
      setShowPremiumGate(true);
      return;
    }
    if (onRefresh) {
      onRefresh();
    }
  }, [isPremium, onRefresh]);

  // Handle recipe press
  const handleRecipePress = useCallback((recipe: Recipe) => {
    if (onRecipePress) {
      onRecipePress(recipe);
    } else {
      router.push(`/recipes/${recipe.id}` as any);
    }
  }, [onRecipePress]);

  // Render recipe card
  const renderRecipeCard = useCallback(({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={[styles.recipeCard, { width: cardWidth }]}
      onPress={() => handleRecipePress(item)}
      activeOpacity={0.9}
    >
      <Image
        source={{
          uri: item.photos?.[0] || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop',
        }}
        style={styles.recipeImage}
      />

      {/* AI Match Badge */}
      <View style={styles.aiBadge}>
        <Ionicons name="sparkles" size={10} color="#7C3AED" />
        <Text style={styles.aiBadgeText}>AI Pick</Text>
      </View>

      <View style={styles.recipeContent}>
        <Text style={styles.recipeName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.recipeMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="flame" size={12} color="#64748B" />
            <Text style={styles.metaText}>
              {Math.round(item.nutritionPerServing.calories)} cal
            </Text>
          </View>
          {item.healthScore && (
            <View style={styles.metaItem}>
              <Ionicons name="nutrition" size={12} color="#10B981" />
              <Text style={styles.metaText}>{item.healthScore}/10</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  ), [cardWidth, handleRecipePress]);

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <LinearGradient
        colors={['#7C3AED', '#EC4899']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.emptyIcon}
      >
        <Ionicons name="nutrition-outline" size={40} color="#FFFFFF" />
      </LinearGradient>
      <Text style={styles.emptyTitle}>No Recommendations Yet</Text>
      <Text style={styles.emptyText}>
        Get personalized recipe suggestions based on your goals
      </Text>
      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Ionicons name="refresh-outline" size={18} color="#7C3AED" />
        <Text style={styles.refreshButtonText}>Get Recommendations</Text>
      </TouchableOpacity>
    </View>
  );

  // Render loading state
  const renderLoadingState = () => (
    <View style={styles.loadingState}>
      <LinearGradient
        colors={['#7C3AED', '#EC4899']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.loadingIcon}
      >
        <Ionicons name="sparkles" size={32} color="#FFFFFF" />
      </LinearGradient>
      <Text style={styles.loadingTitle}>Finding Your Recipes</Text>
      <Text style={styles.loadingText}>
        Our AI is matching recipes to your goals...
      </Text>
    </View>
  );

  // Main content (premium users)
  const mainContent = (
    <View style={[styles.container, containerStyle]}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#7C3AED', '#EC4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <Ionicons name="sparkles" size={20} color="#FFFFFF" />
        </LinearGradient>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>AI Recommendations</Text>
          <Text style={styles.headerSubtitle}>
            Personalized for your goals
          </Text>
        </View>
        <TouchableOpacity style={styles.refreshIconButton} onPress={handleRefresh}>
          <Ionicons name="refresh-outline" size={20} color="#7C3AED" />
        </TouchableOpacity>
      </View>

      {/* Goals Summary */}
      <View style={styles.goalsSummary}>
        <View style={styles.goalItem}>
          <Text style={styles.goalLabel}>Calories</Text>
          <Text style={styles.goalValue}>{userGoals.calories}</Text>
        </View>
        <View style={styles.goalDivider} />
        <View style={styles.goalItem}>
          <Text style={styles.goalLabel}>Protein</Text>
          <Text style={styles.goalValue}>{userGoals.protein}g</Text>
        </View>
        <View style={styles.goalDivider} />
        <View style={styles.goalItem}>
          <Text style={styles.goalLabel}>Carbs</Text>
          <Text style={styles.goalValue}>{userGoals.carbohydrates}g</Text>
        </View>
        <View style={styles.goalDivider} />
        <View style={styles.goalItem}>
          <Text style={styles.goalLabel}>Fat</Text>
          <Text style={styles.goalValue}>{userGoals.fats}g</Text>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        renderLoadingState()
      ) : recommendations.length > 0 ? (
        <FlatList
          data={recommendations}
          renderItem={renderRecipeCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        renderEmptyState()
      )}
    </View>
  );

  // Non-premium users see locked card
  if (!isPremium) {
    return (
      <>
        <View style={[styles.container, containerStyle]}>
          {/* Header */}
          <View style={styles.header}>
            <LinearGradient
              colors={['#7C3AED', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradient}
            >
              <Ionicons name="sparkles" size={20} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>AI Recommendations</Text>
              <Text style={styles.headerSubtitle}>
                Unlock personalized recipes
              </Text>
            </View>
            <TouchableOpacity style={styles.lockIcon}>
              <Ionicons name="lock-closed" size={20} color="#7C3AED" />
            </TouchableOpacity>
          </View>

          {/* Locked Content */}
          <TouchableOpacity
            style={styles.lockedContent}
            onPress={() => setShowPremiumGate(true)}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['rgba(124, 58, 237, 0.1)', 'rgba(236, 72, 153, 0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.lockedGradient}
            >
              <View style={styles.lockedIconContainer}>
                <Ionicons name="sparkles" size={48} color="#7C3AED" />
              </View>
              <Text style={styles.lockedTitle}>Premium Feature</Text>
              <Text style={styles.lockedText}>
                Get personalized recipe recommendations based on your nutrition goals and preferences
              </Text>
              <View style={styles.upgradeButton}>
                <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Premium Gate Modal */}
        <PremiumGate
          visible={showPremiumGate}
          onClose={() => setShowPremiumGate(false)}
          feature="AI Meal Suggestions"
        />
      </>
    );
  }

  return mainContent;
};

// =============================================================================
// Styles
// =============================================================================

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerGradient: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  refreshIconButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalsSummary: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  goalItem: {
    flex: 1,
    alignItems: 'center',
  },
  goalLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
  },
  goalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  goalDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
  },
  listContent: {
    paddingBottom: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
  recipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  recipeImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#F5F5F5',
  },
  aiBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(124, 58, 237, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  recipeContent: {
    padding: 12,
  },
  recipeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  recipeMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#64748B',
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
  },
  // Loading State
  loadingState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  // Locked Content
  lockedContent: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  lockedGradient: {
    padding: 24,
    alignItems: 'center',
  },
  lockedIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  lockedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  lockedText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#7C3AED',
    borderRadius: 12,
  },
  upgradeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default AIRecommendationsCard;
