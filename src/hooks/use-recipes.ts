/**
 * useRecipes Hook
 *
 * Custom React hook for recipe state management.
 * Integrates with RecipeService and RevenueCat for premium features.
 *
 * Features:
 * - Recipe search and filtering
 * - Saving/favoriting recipes
 * - Monthly view tracking
 * - Premium gating
 * - AI recommendations (Premium)
 * - Custom recipe creation (Premium)
 * - Grocery list generation (Premium)
 */

import { useCallback, useEffect, useState } from 'react';
import { useRevenueCat } from '@/context/revenuecat-context';
import { getFeatureLimits } from '@/config/features';
import recipeService from '@/services/recipe-service';
import type {
  Recipe,
  RecipeState,
  RecipeFilters,
  PaginatedRecipes,
  AIRecommendationParams,
  CreateRecipeInput,
  GroceryList,
  GroceryListInput,
  SearchHistoryItem,
} from '@/types/recipe';

// =============================================================================
// Default State
// =============================================================================

const defaultFilters: RecipeFilters = {
  mealType: 'all',
  diet: [],
  calories: undefined,
  time: undefined,
  allergens: [],
};

const initialState: RecipeState = {
  recipes: [],
  savedRecipes: [],
  selectedRecipe: null,
  loading: false,
  error: null,
  filters: defaultFilters,
  monthlyViews: 0,
  searchResults: [],
  aiRecommendations: [],
};

// =============================================================================
// Hook Return Type
// =============================================================================

interface UseRecipesReturn extends RecipeState {
  // Search & Filter
  searchRecipes: (query: string, filters?: RecipeFilters) => Promise<void>;
  updateFilters: (filters: Partial<RecipeFilters>) => void;
  clearFilters: () => void;
  loadRecipes: (refresh?: boolean) => Promise<void>;

  // Recipe Operations
  loadRecipeById: (id: string) => Promise<Recipe | null>;
  selectRecipe: (recipe: Recipe | null) => void;
  saveRecipe: (recipeId: string, notes?: string) => Promise<void>;
  unsaveRecipe: (recipeId: string) => Promise<void>;
  isRecipeSaved: (recipeId: string) => Promise<boolean>;

  // Premium Features
  canViewRecipe: (recipe: Recipe) => Promise<boolean>;
  getAIRecommendations: (params: AIRecommendationParams) => Promise<void>;
  createCustomRecipe: (input: CreateRecipeInput) => Promise<Recipe>;
  generateGroceryList: (input: GroceryListInput) => Promise<GroceryList>;

  // View Tracking
  loadMonthlyViews: () => Promise<void>;
  getRemainingViews: () => number | null;

  // Search History
  loadSearchHistory: () => Promise<SearchHistoryItem[]>;
  clearSearchHistory: () => Promise<void>;

  // Utility
  refresh: () => Promise<void>;
  clearError: () => void;
}

// =============================================================================
// Hook Implementation
// =============================================================================

export function useRecipes(userId?: string): UseRecipesReturn {
  const { isPremium, isLoading: premiumLoading } = useRevenueCat();
  const [state, setState] = useState<RecipeState>(initialState);

  // ===========================================================================
  // Load Recipes
  // ===========================================================================

  const loadRecipes = useCallback(async (refresh = false) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result: PaginatedRecipes = await recipeService.getRecipes(
        state.filters,
        { limit: 50 }
      );

      setState(prev => ({
        ...prev,
        recipes: result.recipes,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load recipes',
      }));
    }
  }, [state.filters]);

  // ===========================================================================
  // Search
  // ===========================================================================

  const searchRecipes = useCallback(async (query: string, filters?: RecipeFilters) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const searchFilters: RecipeFilters = {
        ...filters,
        search: query,
      };

      const results = await recipeService.searchRecipes(
        query,
        filters,
        { limit: 50 }
      );

      setState(prev => ({
        ...prev,
        searchResults: results.map(r => r.recipe),
        filters: searchFilters,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Search failed',
      }));
    }
  }, []);

  // ===========================================================================
  // Filters
  // ===========================================================================

  const updateFilters = useCallback((filters: Partial<RecipeFilters>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...filters },
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      filters: defaultFilters,
      searchResults: [],
    }));
  }, []);

  // ===========================================================================
  // Recipe Details
  // ===========================================================================

  const loadRecipeById = useCallback(async (id: string): Promise<Recipe | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const recipe = await recipeService.getRecipeById(id);

      if (recipe) {
        setState(prev => ({
          ...prev,
          selectedRecipe: recipe,
          loading: false,
        }));
        return recipe;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Recipe not found',
        }));
        return null;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load recipe',
      }));
      return null;
    }
  }, []);

  const selectRecipe = useCallback((recipe: Recipe | null) => {
    setState(prev => ({ ...prev, selectedRecipe: recipe }));
  }, []);

  // ===========================================================================
  // Saved Recipes
  // ===========================================================================

  const loadSavedRecipes = useCallback(async () => {
    if (!userId) return;

    try {
      const saved = await recipeService.getSavedRecipes(userId);
      setState(prev => ({
        ...prev,
        savedRecipes: saved.map(s => s.recipe),
      }));
    } catch (error) {
      console.error('Error loading saved recipes:', error);
    }
  }, [userId]);

  const saveRecipe = useCallback(async (recipeId: string, notes?: string) => {
    if (!userId) {
      throw new Error('User ID required to save recipes');
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      await recipeService.saveRecipe(userId, recipeId, notes);

      // Update local state
      const recipe = await recipeService.getRecipeById(recipeId);
      if (recipe && !state.savedRecipes.find(r => r.id === recipeId)) {
        setState(prev => ({
          ...prev,
          savedRecipes: [...prev.savedRecipes, recipe],
          loading: false,
        }));
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to save recipe',
      }));
      throw error;
    }
  }, [userId, state.savedRecipes]);

  const unsaveRecipe = useCallback(async (recipeId: string) => {
    if (!userId) {
      throw new Error('User ID required to unsave recipes');
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      await recipeService.unsaveRecipe(userId, recipeId);

      setState(prev => ({
        ...prev,
        savedRecipes: prev.savedRecipes.filter(r => r.id !== recipeId),
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to unsave recipe',
      }));
      throw error;
    }
  }, [userId]);

  const isRecipeSaved = useCallback(async (recipeId: string): Promise<boolean> => {
    if (!userId) return false;

    try {
      return await recipeService.isRecipeSaved(userId, recipeId);
    } catch (error) {
      console.error('Error checking if recipe is saved:', error);
      return false;
    }
  }, [userId]);

  // ===========================================================================
  // Premium Gating
  // ===========================================================================

  const canViewRecipe = useCallback(async (recipe: Recipe): Promise<boolean> => {
    // Premium users can view unlimited recipes
    if (isPremium) return true;

    // Get monthly recipe limit
    const tier = isPremium ? 'premium' : 'free';
    const limits = getFeatureLimits(tier);
    const monthlyLimit = limits.monthlyRecipes;

    // If no limit (shouldn't happen for free users, but just in case)
    if (monthlyLimit === null) return true;

    // Check if user has reached limit
    const canView = await recipeService.checkRecipeLimit(userId || '', monthlyLimit);

    if (!canView) {
      setState(prev => ({
        ...prev,
        error: `Monthly recipe limit reached (${monthlyLimit}). Upgrade to Premium for unlimited access.`,
      }));
    }

    return canView;
  }, [isPremium, userId]);

  const getRemainingViews = useCallback((): number | null => {
    if (isPremium) return null; // Unlimited

    const tier = isPremium ? 'premium' : 'free';
    const limits = getFeatureLimits(tier);
    const monthlyLimit = limits.monthlyRecipes;

    if (monthlyLimit === null) return null;

    return Math.max(0, monthlyLimit - state.monthlyViews);
  }, [isPremium, state.monthlyViews]);

  // ===========================================================================
  // Monthly View Tracking
  // ===========================================================================

  const loadMonthlyViews = useCallback(async () => {
    if (!userId) return;

    try {
      const summary = await recipeService.getMonthlyViews(userId);
      setState(prev => ({
        ...prev,
        monthlyViews: summary?.totalViews || 0,
      }));
    } catch (error) {
      console.error('Error loading monthly views:', error);
    }
  }, [userId]);

  // ===========================================================================
  // AI Recommendations (Premium)
  // ===========================================================================

  const getAIRecommendations = useCallback(async (params: AIRecommendationParams) => {
    // Check if premium
    if (!isPremium) {
      setState(prev => ({
        ...prev,
        error: 'AI meal recommendations are a Premium feature. Upgrade to access!',
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const recommendations = await recipeService.getAIRecommendations(params);

      setState(prev => ({
        ...prev,
        aiRecommendations: recommendations,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to get recommendations',
      }));
    }
  }, [isPremium]);

  // ===========================================================================
  // Custom Recipe Creation (Premium)
  // ===========================================================================

  const createCustomRecipe = useCallback(async (input: CreateRecipeInput): Promise<Recipe> => {
    // Check if premium
    if (!isPremium) {
      throw new Error('Custom recipe creation is a Premium feature. Upgrade to access!');
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const recipe = await recipeService.createCustomRecipe(userId || '', input);

      // Add to local recipes list
      setState(prev => ({
        ...prev,
        recipes: [recipe, ...prev.recipes],
        loading: false,
      }));

      return recipe;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to create recipe',
      }));
      throw error;
    }
  }, [isPremium, userId]);

  // ===========================================================================
  // Grocery List Generation (Premium)
  // ===========================================================================

  const generateGroceryList = useCallback(async (input: GroceryListInput): Promise<GroceryList> => {
    // Check if premium
    if (!isPremium) {
      throw new Error('Grocery list generation is a Premium feature. Upgrade to access!');
    }

    try {
      return await recipeService.generateGroceryList(input);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to generate grocery list',
      }));
      throw error;
    }
  }, [isPremium]);

  // ===========================================================================
  // Search History
  // ===========================================================================

  const loadSearchHistory = useCallback(async (): Promise<SearchHistoryItem[]> => {
    try {
      return await recipeService.getSearchHistory();
    } catch (error) {
      console.error('Error loading search history:', error);
      return [];
    }
  }, []);

  const clearSearchHistory = useCallback(async () => {
    try {
      await recipeService.clearSearchHistory();
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  }, []);

  // ===========================================================================
  // Utility
  // ===========================================================================

  const refresh = useCallback(async () => {
    await Promise.all([
      loadRecipes(true),
      userId ? loadSavedRecipes() : Promise.resolve(),
      userId ? loadMonthlyViews() : Promise.resolve(),
    ]);
  }, [loadRecipes, loadSavedRecipes, loadMonthlyViews, userId]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // ===========================================================================
  // Effects
  // ===========================================================================

  // Load initial data
  useEffect(() => {
    if (!premiumLoading) {
      loadRecipes();
      if (userId) {
        loadSavedRecipes();
        loadMonthlyViews();
      }
    }
  }, [premiumLoading, userId, loadRecipes, loadSavedRecipes, loadMonthlyViews]);

  // ===========================================================================
  // Return
  // ===========================================================================

  return {
    ...state,

    // Search & Filter
    searchRecipes,
    updateFilters,
    clearFilters,
    loadRecipes,

    // Recipe Operations
    loadRecipeById,
    selectRecipe,
    saveRecipe,
    unsaveRecipe,
    isRecipeSaved,

    // Premium Features
    canViewRecipe,
    getAIRecommendations,
    createCustomRecipe,
    generateGroceryList,

    // View Tracking
    loadMonthlyViews,
    getRemainingViews,

    // Search History
    loadSearchHistory,
    clearSearchHistory,

    // Utility
    refresh,
    clearError,
  };
}

// =============================================================================
// Export
// =============================================================================

export default useRecipes;
