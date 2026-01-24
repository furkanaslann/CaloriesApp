/**
 * CaloriTrack - Recipes Screen
 * Minimal. Cool. Aesthetic.
 * Figma Design: https://www.figma.com/design/V4OjFZYz1hhZdeWSgZyYtu/Calories-Pages?node-id=47-9
 *
 * Updated to use:
 * - useRecipes hook for state management
 * - RecipeCard, RecipeSearch, RecipeFilterModal components
 * - Premium gating for recipe view limits
 */

import BottomNavigation from '@/components/navigation/BottomNavigation';
import { RecipeCard, RecipeSearch, RecipeFilterModal } from '@/components/recipes';
import { RecipeLimitPrompt } from '@/components/premium/RecipeLimitPrompt';
import { useRecipes } from '@/hooks/use-recipes';
import { useRevenueCat } from '@/context/revenuecat-context';
import type { RecipeFilters } from '@/types/recipe';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Recipe } from '@/types/recipe';

const { width } = Dimensions.get('window');

// =============================================================================
// Component
// =============================================================================

const RecipesScreen = () => {
  const router = useRouter();
  const { isPremium } = useRevenueCat();

  // Use recipes hook
  const {
    recipes,
    savedRecipes,
    searchResults,
    loading,
    error,
    filters,
    monthlyViews,
    searchRecipes,
    updateFilters,
    clearFilters,
    selectRecipe,
    saveRecipe,
    unsaveRecipe,
    isRecipeSaved,
    canViewRecipe,
    getRemainingViews,
    loadSearchHistory,
    clearSearchHistory,
    refresh,
  } = useRecipes();

  // Local state
  const [searchText, setSearchText] = React.useState('');
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [showMoreDietInfo, setShowMoreDietInfo] = React.useState(false);
  const [showLimitPrompt, setShowLimitPrompt] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'recipes' | 'favorites'>('recipes');

  // Search history
  const [searchHistory, setSearchHistory] = React.useState<string[]>([]);
  const [historyLoaded, setHistoryLoaded] = React.useState(false);

  // Load search history on mount
  React.useEffect(() => {
    loadSearchHistory().then(items => {
      setSearchHistory(items.map(item => item.query));
      setHistoryLoaded(true);
    });
  }, [loadSearchHistory]);

  // Displayed recipes (search results or all recipes)
  const displayedRecipes = useMemo(() => {
    return searchText || filters.search ? searchResults : recipes;
  }, [searchText, filters.search, searchResults, recipes]);

  // Displayed recipes for current tab
  const tabRecipes = useMemo(() => {
    if (activeTab === 'favorites') {
      return savedRecipes;
    }
    return displayedRecipes;
  }, [activeTab, displayedRecipes, savedRecipes]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.search ||
      filters.mealType ||
      filters.diet?.length ||
      filters.calories ||
      filters.time ||
      filters.allergens?.length
    );
  }, [filters]);

  // Handle search
  const handleSearch = useCallback(async (query: string) => {
    setSearchText(query);
    if (query.trim()) {
      await searchRecipes(query, filters);
    }
  }, [searchRecipes, filters]);

  // Handle apply filters
  const handleApplyFilters = useCallback((newFilters: RecipeFilters) => {
    updateFilters(newFilters);
    setShowFilterModal(false);

    // Trigger search with new filters
    if (searchText) {
      searchRecipes(searchText, newFilters);
    }
  }, [updateFilters, searchText, searchRecipes]);

  // Handle recipe press
  const handleRecipePress = useCallback(async (recipe: Recipe) => {
    // Check if user can view recipe (premium gating)
    const canView = await canViewRecipe(recipe);
    if (!canView) {
      setShowLimitPrompt(true);
      return;
    }

    selectRecipe(recipe);
    router.push(`/recipes/${recipe.id}` as any);
  }, [canViewRecipe, selectRecipe, router]);

  // Handle favorite toggle
  const handleFavoritePress = useCallback(async (recipeId: string, currentlySaved: boolean) => {
    try {
      if (currentlySaved) {
        await unsaveRecipe(recipeId);
      } else {
        await saveRecipe(recipeId);
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update favorites');
    }
  }, [saveRecipe, unsaveRecipe]);

  // Handle filter press
  const handleFilterPress = useCallback(() => {
    setShowFilterModal(true);
  }, []);

  // Handle clear history
  const handleClearHistory = useCallback(async () => {
    await clearSearchHistory();
    setSearchHistory([]);
  }, [clearSearchHistory]);

  // Render recipe card
  const renderRecipeCard = useCallback(({ item }: { item: Recipe }) => {
    const checkIfSaved = async () => {
      return await isRecipeSaved(item.id);
    };

    // For simplicity, check local state first
    const isSaved = savedRecipes.some(r => r.id === item.id);

    return (
      <RecipeCard
        key={item.id}
        recipe={item}
        width={(width - 48) / 2}
        isSaved={isSaved}
        onPress={handleRecipePress}
        onFavoritePress={handleFavoritePress}
        showPremiumBadge={!isPremium}
        isPremium={isPremium}
      />
    );
  }, [savedRecipes, isRecipeSaved, handleRecipePress, handleFavoritePress, isPremium]);

  // Render empty state
  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>🍽️</Text>
      <Text style={styles.emptyStateTitle}>
        {activeTab === 'favorites' ? 'No Favorites Yet' : 'No Recipes Found'}
      </Text>
      <Text style={styles.emptyStateText}>
        {activeTab === 'favorites'
          ? 'Save your favorite recipes to see them here'
          : 'Try adjusting your filters or search terms'}
      </Text>
      {hasActiveFilters && (
        <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
          <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  ), [activeTab, hasActiveFilters, clearFilters]);

  // Loading state
  if (loading && recipes.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#E6F3FF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={styles.loadingText}>Loading recipes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#E6F3FF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Recipes</Text>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="star" size={24} color="#7C3AED" />
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabNav}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('recipes')}
          >
            <Text style={[styles.tabText, activeTab === 'recipes' && styles.tabTextActive]}>
              Recipes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('favorites')}
          >
            <View style={styles.tabWithCheck}>
              <Ionicons
                name={activeTab === 'favorites' ? 'checkmark-circle' : 'ellipse-outline'}
                size={16}
                color="#7C3AED"
              />
              <Text style={[styles.tabText, activeTab === 'favorites' && styles.tabTextActive]}>
                Favorites ({savedRecipes.length})
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <RecipeSearch
          value={searchText}
          onChangeText={setSearchText}
          onSearch={handleSearch}
          onFilterPress={handleFilterPress}
          searchHistory={searchHistory}
          onHistoryItemPress={setSearchText}
          onClearHistory={handleClearHistory}
          showFilterButton
        />
      </View>

      {/* Main Content */}
      {hasActiveFilters || activeTab === 'favorites' ? (
        // Filtered Results or Favorites - Grid Layout
        <View style={styles.resultsContainer}>
          {hasActiveFilters && (
            <Text style={styles.resultsTitle}>
              {tabRecipes.length} {tabRecipes.length === 1 ? 'Recipe' : 'Recipes'} Found
            </Text>
          )}
          {tabRecipes.length > 0 ? (
            <FlatList
              data={tabRecipes}
              renderItem={renderRecipeCard}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.resultsGrid}
              showsVerticalScrollIndicator={false}
              onRefresh={refresh}
              refreshing={loading}
            />
          ) : (
            renderEmptyState()
          )}
        </View>
      ) : (
        // Default Layout - Featured Banner + Meal Sections
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Featured Banner */}
          <View style={styles.featuredBanner}>
            <ImageBackground
              source={{ uri: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=400&fit=crop' }}
              style={styles.bannerImage}
            >
              <View style={styles.bannerOverlay}>
                <View style={styles.bannerContent}>
                  <Ionicons name="leaf" size={28} color="#FFFFFF" style={styles.wreathIcon} />
                  <View>
                    <Text style={styles.bannerTitle}>Gluten-Free</Text>
                    <Text style={styles.bannerSubtitle}>Weekly Selected</Text>
                  </View>
                  <Ionicons name="leaf" size={28} color="#FFFFFF" style={styles.wreathIcon} />
                </View>
              </View>
            </ImageBackground>
          </View>

          {/* Diet Info Section */}
          <View style={styles.dietInfoSection}>
            <Text style={styles.dietInfoTitle}>Gluten-free & Losing Weight</Text>
            <Text style={styles.dietInfoDescription}>
              {showMoreDietInfo
                ? 'This gluten-free diet includes fruits, vegetables, meat, dairy, and grains like rice and quinoa. It can aid in weight loss by reducing processed foods and focusing on whole, natural ingredients. Many people report increased energy and improved digestion.'
                : 'This gluten-free diet includes fruits, vegetables, meat, dairy, and grains like rice and quinoa. It can aid...'}
            </Text>
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() => setShowMoreDietInfo(!showMoreDietInfo)}
            >
              <Text style={styles.moreText}>{showMoreDietInfo ? 'Less' : 'More'}</Text>
              <Ionicons
                name={showMoreDietInfo ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#7C3AED"
              />
            </TouchableOpacity>
          </View>

          {/* Breakfast Section */}
          <View style={styles.mealSection}>
            <View style={styles.mealSectionHeader}>
              <Text style={styles.mealSectionTitle}>Breakfast</Text>
              <TouchableOpacity onPress={() => {
                updateFilters({ mealType: 'breakfast' });
              }}>
                <Text style={styles.mealMoreLink}>More</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recipeCardsRow}
            >
              {recipes
                .filter(r => r.mealType === 'breakfast')
                .slice(0, 5)
                .map(recipe => renderRecipeCard({ item: recipe }))}
            </ScrollView>
          </View>

          {/* Lunch Section */}
          <View style={styles.mealSection}>
            <View style={styles.mealSectionHeader}>
              <Text style={styles.mealSectionTitle}>Lunch</Text>
              <TouchableOpacity onPress={() => {
                updateFilters({ mealType: 'lunch' });
              }}>
                <Text style={styles.mealMoreLink}>More</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recipeCardsRow}
            >
              {recipes
                .filter(r => r.mealType === 'lunch')
                .slice(0, 5)
                .map(recipe => renderRecipeCard({ item: recipe }))}
            </ScrollView>
          </View>
        </ScrollView>
      )}

      {/* Filter Modal */}
      <RecipeFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={filters}
      />

      {/* Recipe Limit Prompt */}
      <RecipeLimitPrompt
        visible={showLimitPrompt}
        currentCount={monthlyViews}
        limit={5}
        onClose={() => setShowLimitPrompt(false)}
      />

      {/* Bottom Navigation */}
      <BottomNavigation activeRoute="/recipes" />
    </SafeAreaView>
  );
};

// =============================================================================
// Styles
// =============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
  // Header
  header: {
    backgroundColor: '#E6F3FF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    flex: 1,
    textAlign: 'center',
  },
  headerIcon: {
    width: 24,
    height: 24,
  },
  // Tab Navigation
  tabNav: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabItem: {
    marginRight: 24,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666666',
  },
  tabTextActive: {
    fontWeight: '700',
    color: '#7C3AED',
  },
  tabWithCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  // Main Content
  scrollContent: {
    paddingBottom: 100,
  },
  // Featured Banner
  featuredBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  wreathIcon: {
    width: 32,
    height: 32,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 4,
    textAlign: 'center',
  },
  // Diet Info Section
  dietInfoSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  dietInfoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  dietInfoDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 8,
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  moreText: {
    fontSize: 14,
    color: '#7C3AED',
  },
  // Meal Category Section
  mealSection: {
    marginTop: 24,
  },
  mealSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  mealSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  mealMoreLink: {
    fontSize: 14,
    color: '#7C3AED',
  },
  // Recipe Cards Row
  recipeCardsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  // Grid Results
  resultsContainer: {
    flex: 1,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  resultsGrid: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  clearFiltersButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  clearFiltersButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
  },
});

export default RecipesScreen;
