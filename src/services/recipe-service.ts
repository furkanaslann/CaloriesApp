/**
 * Recipe Service
 *
 * Handles all recipe-related operations including:
 * - Fetching recipes from Firestore
 * - Search and filter functionality
 * - AI-powered recommendations
 * - Custom recipe creation
 * - Recipe saving/favoriting
 * - Monthly view tracking for premium gating
 * - Grocery list generation
 * - Local caching
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { FIREBASE_CONFIG } from '@/constants/firebase';
import { APP_CONFIG } from '@/config/app';
import type {
  Recipe,
  RecipeFilters,
  PaginatedRecipes,
  PaginationParams,
  AIRecommendationParams,
  CreateRecipeInput,
  RecipeValidationResult,
  GroceryList,
  GroceryListInput,
  RecipeViewRecord,
  MonthlyViewSummary,
  SavedRecipe,
  SavedRecipeWithDetails,
  RecipeSearchResult,
  SearchHistoryItem,
  GroceryItem,
} from '@/types/recipe';
import type { NutritionInfo } from '@/types/food';

// =============================================================================
// Cache Keys
// =============================================================================

const RECIPE_CACHE_KEYS = {
  RECIPES_LIST: '@caloritrack_recipes_list',
  SAVED_RECIPES: '@caloritrack_saved_recipes',
  MONTHLY_VIEWS: '@caloritrack_monthly_recipe_views',
  RECIPE_DETAIL_PREFIX: '@caloritrack_recipe_',
  SEARCH_HISTORY: '@caloritrack_search_history',
  GROCERY_LIST: '@caloritrack_grocery_list_',
} as const;

// =============================================================================
// Cache Duration (in milliseconds)
// =============================================================================

const CACHE_DURATION = {
  RECIPES_LIST: 60 * 60 * 1000, // 1 hour
  RECIPE_DETAIL: 24 * 60 * 60 * 1000, // 24 hours
  SAVED_RECIPES: 30 * 60 * 1000, // 30 minutes
  MONTHLY_VIEWS: 10 * 60 * 1000, // 10 minutes
  SEARCH_HISTORY: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;

// =============================================================================
// Recipe Service Class
// =============================================================================

class RecipeService {
  // =========================================================================
  // Cache Helpers
  // =========================================================================

  private async getCached<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(key);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const cacheKey = key.split('_')[2] || 'list';
      const duration = Object.entries(CACHE_DURATION).find(([k]) =>
        key.toLowerCase().includes(k)
      )?.[1] || CACHE_DURATION.RECIPES_LIST;

      if (Date.now() - timestamp > duration) {
        await AsyncStorage.removeItem(key);
        return null;
      }

      return data as T;
    } catch (error) {
      console.error('Error getting cached data:', error);
      return null;
    }
  }

  private async setCached<T>(key: string, data: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Error setting cached data:', error);
    }
  }

  private async clearCache(pattern?: string): Promise<void> {
    try {
      if (pattern) {
        const keys = await AsyncStorage.getAllKeys();
        const matchingKeys = keys.filter(key => key.includes(pattern));
        await AsyncStorage.multiRemove(matchingKeys);
      } else {
        await AsyncStorage.clear();
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  // =========================================================================
  // Recipe CRUD Operations
  // =========================================================================

  /**
   * Get all recipes with optional filters and pagination
   */
  async getRecipes(
    filters?: RecipeFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedRecipes> {
    // Use mock recipes in development mode
    if (APP_CONFIG.useMockRecipes) {
      return this.getMockRecipes(filters, pagination);
    }

    // Production: Use Firestore
    try {
      const cacheKey = `${RECIPE_CACHE_KEYS.RECIPES_LIST}_${JSON.stringify(filters)}_${JSON.stringify(pagination)}`;
      const cached = await this.getCached<PaginatedRecipes>(cacheKey);
      if (cached) return cached;

      let query = firestore().collection(FIREBASE_CONFIG.collections.recipes);

      // Apply filters with where clauses
      if (filters?.mealType && filters.mealType !== 'all') {
        query = query.where('mealType', '==', filters.mealType);
      }

      if (filters?.difficulty) {
        query = query.where('difficulty', '==', filters.difficulty);
      }

      if (filters?.processingLevel) {
        query = query.where('processingLevel', '==', filters.processingLevel);
      }

      // Apply sorting
      const sortBy = pagination?.sortBy || 'createdAt';
      const sortOrder = pagination?.sortOrder || 'desc';
      query = query.orderBy(sortBy, sortOrder);

      // Apply pagination (limit)
      const limitNum = pagination?.limit || 20;
      query = query.limit(limitNum * 2); // Fetch more for client-side filtering

      const snapshot = await query.get();
      const recipes: Recipe[] = [];
      snapshot.forEach((doc) => {
        recipes.push({ id: doc.id, ...doc.data() } as Recipe);
      });

      // Apply client-side filters (for arrays, ranges, etc.)
      let filteredRecipes = this.applyClientSideFilters(recipes, filters);

      // Get total count
      const total = filteredRecipes.length;

      // Apply pagination to filtered results
      const page = pagination?.page || 1;
      const start = (page - 1) * limitNum;
      const paginatedRecipes = filteredRecipes.slice(start, start + limitNum);

      const result: PaginatedRecipes = {
        recipes: paginatedRecipes,
        total,
        page,
        limit: limitNum,
        hasMore: start + limitNum < total,
      };

      await this.setCached(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error getting recipes:', error);
      throw new Error('Failed to fetch recipes');
    }
  }

  /**
   * Get mock recipes (development mode)
   */
  private async getMockRecipes(
    filters?: RecipeFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedRecipes> {
    const { MOCK_RECIPES } = await import('@/data/recipes');

    let filtered = this.applyClientSideFilters(MOCK_RECIPES, filters);

    const limit = pagination?.limit || 20;
    const page = pagination?.page || 1;
    const start = (page - 1) * limit;

    return {
      recipes: filtered.slice(start, start + limit),
      total: filtered.length,
      page,
      limit,
      hasMore: start + limit < filtered.length,
    };
  }

  /**
   * Apply client-side filters that can't be done with Firestore queries
   */
  private applyClientSideFilters(recipes: Recipe[], filters?: RecipeFilters): Recipe[] {
    if (!filters) return recipes;

    return recipes.filter((recipe) => {
      // Search text filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          recipe.name.toLowerCase().includes(searchLower) ||
          recipe.description?.toLowerCase().includes(searchLower) ||
          recipe.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
          recipe.ingredients.some(ing =>
            ing.notes?.toLowerCase().includes(searchLower)
          );
        if (!matchesSearch) return false;
      }

      // Diet filter (array-contains)
      if (filters.diet && filters.diet.length > 0) {
        const hasDiet = filters.diet.some(d =>
          recipe.dietaryRestrictions?.includes(d)
        );
        if (!hasDiet) return false;
      }

      // Cuisine filter
      if (filters.cuisine && filters.cuisine.length > 0) {
        if (!recipe.cuisineType || !filters.cuisine.includes(recipe.cuisineType)) {
          return false;
        }
      }

      // Calorie range filter
      if (filters.calories) {
        const calories = recipe.nutritionPerServing.calories;
        if (calories < filters.calories.min || calories > filters.calories.max) {
          return false;
        }
      }

      // Time range filter
      if (filters.time) {
        const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
        if (totalTime < filters.time.min || totalTime > filters.time.max) {
          return false;
        }
      }

      // Allergens filter (exclude recipes with these allergens)
      if (filters.allergens && filters.allergens.length > 0) {
        const hasAllergen = filters.allergens.some(allergen =>
          recipe.allergens?.includes(allergen)
        );
        if (hasAllergen) return false;
      }

      // Health score range filter
      if (filters.healthScore) {
        const score = recipe.healthScore || 0;
        if (score < filters.healthScore.min || score > filters.healthScore.max) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Get a single recipe by ID
   */
  async getRecipeById(id: string): Promise<Recipe | null> {
    // Check mock recipes first in development mode
    if (APP_CONFIG.useMockRecipes) {
      const { MOCK_RECIPES } = await import('@/data/recipes');
      const recipe = MOCK_RECIPES.find(r => r.id === id);
      return recipe || null;
    }

    // Production: Use Firestore
    try {
      const cacheKey = `${RECIPE_CACHE_KEYS.RECIPE_DETAIL_PREFIX}${id}`;
      const cached = await this.getCached<Recipe>(cacheKey);
      if (cached) return cached;

      const docRef = firestore().collection(FIREBASE_CONFIG.collections.recipes).doc(id);
      const docSnap = await docRef.get();

      if (docSnap.exists) {
        const recipe = { id: docSnap.id, ...docSnap.data() } as Recipe;
        await this.setCached(cacheKey, recipe);
        return recipe;
      }

      return null;
    } catch (error) {
      console.error('Error getting recipe by ID:', error);
      throw new Error('Failed to fetch recipe');
    }
  }

  /**
   * Search recipes by query
   */
  async searchRecipes(
    queryText: string,
    filters?: RecipeFilters,
    pagination?: PaginationParams
  ): Promise<RecipeSearchResult[]> {
    try {
      const searchFilters: RecipeFilters = {
        ...filters,
        search: queryText,
      };

      const result = await this.getRecipes(searchFilters, pagination);

      // Calculate relevance scores
      const searchResults: RecipeSearchResult[] = result.recipes.map(recipe => {
        const queryLower = queryText.toLowerCase();
        const matchedFields: string[] = [];

        let score = 0;

        // Name match (highest weight)
        if (recipe.name.toLowerCase().includes(queryLower)) {
          score += 50;
          matchedFields.push('name');
        }

        // Description match
        if (recipe.description?.toLowerCase().includes(queryLower)) {
          score += 30;
          matchedFields.push('description');
        }

        // Tag matches
        const tagMatches = recipe.tags.filter(tag =>
          tag.toLowerCase().includes(queryLower)
        ).length;
        if (tagMatches > 0) {
          score += tagMatches * 10;
          matchedFields.push('tags');
        }

        // Ingredient matches
        const ingredientMatches = recipe.ingredients.filter(ing =>
          ing.notes?.toLowerCase().includes(queryLower)
        ).length;
        if (ingredientMatches > 0) {
          score += ingredientMatches * 5;
          matchedFields.push('ingredients');
        }

        return {
          recipe,
          relevanceScore: score,
          matchedFields,
        };
      });

      // Sort by relevance
      searchResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

      // Save to search history
      await this.saveSearchHistory(queryText, filters, searchResults.length);

      return searchResults;
    } catch (error) {
      console.error('Error searching recipes:', error);
      throw new Error('Failed to search recipes');
    }
  }

  // =========================================================================
  // Saved / Favorite Recipes
  // =========================================================================

  /**
   * Get user's saved/favorite recipes
   */
  async getSavedRecipes(userId: string): Promise<SavedRecipeWithDetails[]> {
    try {
      const cacheKey = `${RECIPE_CACHE_KEYS.SAVED_RECIPES}_${userId}`;
      const cached = await this.getCached<SavedRecipeWithDetails[]>(cacheKey);
      if (cached) return cached;

      const snapshot = await firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(userId)
        .collection('savedRecipes')
        .orderBy('savedAt', 'desc')
        .get();

      const savedRecipes: SavedRecipeWithDetails[] = [];

      for (const docSnap of snapshot.docs) {
        const savedRecipe = docSnap.data() as SavedRecipe;
        const recipe = await this.getRecipeById(savedRecipe.recipeId);

        if (recipe) {
          savedRecipes.push({
            ...savedRecipe,
            recipe,
          });
        }
      }

      await this.setCached(cacheKey, savedRecipes);
      return savedRecipes;
    } catch (error) {
      console.error('Error getting saved recipes:', error);
      throw new Error('Failed to fetch saved recipes');
    }
  }

  /**
   * Save a recipe to user's favorites
   */
  async saveRecipe(userId: string, recipeId: string, notes?: string): Promise<void> {
    try {
      const savedRecipeRef = firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(userId)
        .collection('savedRecipes')
        .doc(recipeId);

      const savedRecipe: SavedRecipe = {
        userId,
        recipeId,
        savedAt: new Date().toISOString(),
        notes,
      };
      await savedRecipeRef.set(savedRecipe);

      // Clear cache
      await this.clearCache(`${RECIPE_CACHE_KEYS.SAVED_RECIPES}_${userId}`);
    } catch (error) {
      console.error('Error saving recipe:', error);
      throw new Error('Failed to save recipe');
    }
  }

  /**
   * Remove a recipe from user's favorites
   */
  async unsaveRecipe(userId: string, recipeId: string): Promise<void> {
    try {
      await firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(userId)
        .collection('savedRecipes')
        .doc(recipeId)
        .delete();

      // Clear cache
      await this.clearCache(`${RECIPE_CACHE_KEYS.SAVED_RECIPES}_${userId}`);
    } catch (error) {
      console.error('Error unsaving recipe:', error);
      throw new Error('Failed to unsave recipe');
    }
  }

  /**
   * Check if a recipe is saved by user
   */
  async isRecipeSaved(userId: string, recipeId: string): Promise<boolean> {
    try {
      const docRef = firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(userId)
        .collection('savedRecipes')
        .doc(recipeId);
      const docSnap = await docRef.get();
      return docSnap.exists;
    } catch (error) {
      console.error('Error checking if recipe is saved:', error);
      return false;
    }
  }

  // =========================================================================
  // Recipe View Tracking (for Premium Gating)
  // =========================================================================

  /**
   * Track a recipe view for monthly limit counting
   */
  async trackRecipeView(userId: string, recipeId?: string): Promise<void> {
    try {
      if (!userId) return;

      const now = new Date();
      const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      const cacheKey = `${RECIPE_CACHE_KEYS.MONTHLY_VIEWS}_${userId}_${monthYear}`;
      const cached = await this.getCached<MonthlyViewSummary>(cacheKey);

      let monthlySummary: MonthlyViewSummary;

      if (cached) {
        monthlySummary = cached;
      } else {
        const summaryRef = firestore()
          .collection(FIREBASE_CONFIG.collections.users)
          .doc(userId)
          .collection('recipeViews')
          .doc(monthYear);
        const summarySnap = await summaryRef.get();

        if (summarySnap.exists) {
          monthlySummary = summarySnap.data() as MonthlyViewSummary;
        } else {
          monthlySummary = {
            userId,
            monthYear,
            totalViews: 0,
            uniqueRecipesViewed: [],
          };
        }
      }

      monthlySummary.totalViews++;
      if (recipeId && !monthlySummary.uniqueRecipesViewed.includes(recipeId)) {
        monthlySummary.uniqueRecipesViewed.push(recipeId);
      }

      const summaryRef = firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(userId)
        .collection('recipeViews')
        .doc(monthYear);
      await summaryRef.set(monthlySummary);

      await this.setCached(cacheKey, monthlySummary);
    } catch (error) {
      console.error('Error tracking recipe view:', error);
    }
  }

  /**
   * Get monthly view summary for a user
   */
  async getMonthlyViews(userId: string): Promise<MonthlyViewSummary | null> {
    try {
      const now = new Date();
      const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      const cacheKey = `${RECIPE_CACHE_KEYS.MONTHLY_VIEWS}_${userId}_${monthYear}`;
      const cached = await this.getCached<MonthlyViewSummary>(cacheKey);
      if (cached) return cached;

      const summaryRef = firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(userId)
        .collection('recipeViews')
        .doc(monthYear);
      const summarySnap = await summaryRef.get();

      if (summarySnap.exists) {
        const summary = summarySnap.data() as MonthlyViewSummary;
        await this.setCached(cacheKey, summary);
        return summary;
      }

      return null;
    } catch (error) {
      console.error('Error getting monthly views:', error);
      return null;
    }
  }

  /**
   * Check if user has reached monthly recipe view limit
   */
  async checkRecipeLimit(userId: string, limit: number): Promise<boolean> {
    if (limit === null) return true;

    const summary = await this.getMonthlyViews(userId);
    const currentViews = summary?.totalViews || 0;
    return currentViews < limit;
  }

  // =========================================================================
  // AI Recommendations (Premium)
  // =========================================================================

  /**
   * Get AI-powered recipe recommendations based on user goals
   */
  async getAIRecommendations(params: AIRecommendationParams): Promise<Recipe[]> {
    try {
      const filters: RecipeFilters = {
        mealType: params.mealType,
        diet: params.dietaryRestrictions,
        allergens: params.allergens,
        cuisine: params.preferredCuisines,
      };

      if (params.maxCalories) {
        filters.calories = { min: 0, max: params.maxCalories };
      }

      if (params.maxTime) {
        filters.time = { min: 0, max: params.maxTime };
      }

      filters.healthScore = { min: 7, max: 10 };

      const result = await this.getRecipes(filters, { limit: 10 });

      const scoredRecipes = result.recipes.map(recipe => {
        let score = 0;
        score += (recipe.healthScore || 5) * 10;

        if (params.maxCalories) {
          const calorieDiff = Math.abs(recipe.nutritionPerServing.calories - params.maxCalories * 0.3);
          score += Math.max(0, 50 - calorieDiff);
        }

        const proteinRatio = recipe.nutritionPerServing.protein /
          recipe.nutritionPerServing.calories * 100;
        if (proteinRatio >= 15) score += 20;

        if (recipe.verified) score += 15;

        return { recipe, score };
      });

      scoredRecipes.sort((a, b) => b.score - a.score);

      return scoredRecipes.slice(0, 10).map(item => item.recipe);
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      throw new Error('Failed to get recommendations');
    }
  }

  // =========================================================================
  // Custom Recipe Creation (Premium)
  // =========================================================================

  /**
   * Validate recipe input
   */
  validateRecipeInput(input: CreateRecipeInput): RecipeValidationResult {
    const errors: Array<{ field: string; message: string }> = [];

    if (!input.name || input.name.trim().length < 3) {
      errors.push({
        field: 'name',
        message: 'Recipe name must be at least 3 characters long',
      });
    }

    if (!input.ingredients || input.ingredients.length === 0) {
      errors.push({
        field: 'ingredients',
        message: 'Recipe must have at least one ingredient',
      });
    }

    if (!input.instructions || input.instructions.length === 0) {
      errors.push({
        field: 'instructions',
        message: 'Recipe must have at least one instruction',
      });
    }

    if (!input.servings || input.servings < 1) {
      errors.push({
        field: 'servings',
        message: 'Recipe must serve at least 1 person',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Create a custom recipe (Premium feature)
   */
  async createCustomRecipe(
    userId: string,
    input: CreateRecipeInput
  ): Promise<Recipe> {
    try {
      const validation = this.validateRecipeInput(input);
      if (!validation.isValid) {
        throw new Error(validation.errors.map(e => e.message).join(', '));
      }

      const nutritionPerServing: NutritionInfo = {
        calories: this.calculateCalories(input.ingredients),
        protein: this.calculateMacro(input.ingredients, 'protein'),
        carbohydrates: this.calculateMacro(input.ingredients, 'carbs'),
        fats: this.calculateMacro(input.ingredients, 'fats'),
      };

      const recipeData: Omit<Recipe, 'id'> = {
        name: input.name.trim(),
        description: input.description?.trim(),
        ingredients: input.ingredients,
        instructions: input.instructions,
        servings: input.servings,
        prepTime: input.prepTime,
        cookTime: input.cookTime,
        totalTime: (input.prepTime || 0) + (input.cookTime || 0),
        difficulty: input.difficulty || 'medium',
        nutritionPerServing,
        photos: input.photos || [],
        tags: input.tags || [],
        verified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dietaryRestrictions: input.dietaryRestrictions,
        allergens: input.allergens,
        mealType: input.mealType,
        cuisineType: input.cuisineType,
        cookingMethod: input.cookingMethod,
        healthScore: 5,
        processingLevel: 'minimally_processed',
      };

      const docRef = await firestore()
        .collection(FIREBASE_CONFIG.collections.recipes)
        .add(recipeData);

      const recipe: Recipe = {
        id: docRef.id,
        ...recipeData,
      };

      await this.clearCache(RECIPE_CACHE_KEYS.RECIPES_LIST);

      return recipe;
    } catch (error) {
      console.error('Error creating custom recipe:', error);
      throw new Error('Failed to create recipe');
    }
  }

  private calculateCalories(ingredients: typeof CreateRecipeInput.prototype.ingredients): number {
    return ingredients.reduce((total, ing) => total + ing.quantity * 100, 0);
  }

  private calculateMacro(
    ingredients: typeof CreateRecipeInput.prototype.ingredients,
    macro: 'protein' | 'carbs' | 'fats'
  ): number {
    const factors = { protein: 0.15, carbs: 0.5, fats: 0.25 };
    return ingredients.reduce((total, ing) => total + ing.quantity * factors[macro] * 100, 0);
  }

  // =========================================================================
  // Grocery List Generation (Premium)
  // =========================================================================

  /**
   * Generate grocery list from recipes
   */
  async generateGroceryList(input: GroceryListInput): Promise<GroceryList> {
    try {
      const consolidatedIngredients = new Map<string, GroceryItem>();

      for (const recipeId of input.recipeIds) {
        const recipe = await this.getRecipeById(recipeId);
        if (!recipe) continue;

        const servings = input.servings[recipeId] || recipe.servings;
        const multiplier = servings / recipe.servings;

        for (const ingredient of recipe.ingredients) {
          const key = `${ingredient.foodId}_${ingredient.unit}`;
          const existing = consolidatedIngredients.get(key);

          if (existing) {
            existing.quantity += ingredient.quantity * multiplier;
            if (!existing.recipes.includes(recipeId)) {
              existing.recipes.push(recipeId);
            }
          } else {
            consolidatedIngredients.set(key, {
              id: key,
              name: ingredient.foodId,
              quantity: ingredient.quantity * multiplier,
              unit: ingredient.unit,
              checked: false,
              recipes: [recipeId],
              notes: ingredient.notes,
            });
          }
        }
      }

      const groceryList: GroceryList = {
        id: `list_${Date.now()}`,
        items: Array.from(consolidatedIngredients.values()),
        createdAt: new Date().toISOString(),
      };

      const cacheKey = `${RECIPE_CACHE_KEYS.GROCERY_LIST}${groceryList.id}`;
      await this.setCached(cacheKey, groceryList);

      return groceryList;
    } catch (error) {
      console.error('Error generating grocery list:', error);
      throw new Error('Failed to generate grocery list');
    }
  }

  // =========================================================================
  // Search History
  // =========================================================================

  private async saveSearchHistory(
    query: string,
    filters?: RecipeFilters,
    resultCount?: number
  ): Promise<void> {
    try {
      const historyItem: SearchHistoryItem = {
        query,
        filters,
        timestamp: new Date().toISOString(),
        resultCount: resultCount || 0,
      };

      const cacheKey = RECIPE_CACHE_KEYS.SEARCH_HISTORY;
      const history = await this.getCached<SearchHistoryItem[]>(cacheKey) || [];

      const filtered = history.filter(item => item.query.toLowerCase() !== query.toLowerCase());
      filtered.unshift(historyItem);
      const trimmed = filtered.slice(0, 20);

      await this.setCached(cacheKey, trimmed);
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }

  async getSearchHistory(): Promise<SearchHistoryItem[]> {
    try {
      const cacheKey = RECIPE_CACHE_KEYS.SEARCH_HISTORY;
      return await this.getCached<SearchHistoryItem[]>(cacheKey) || [];
    } catch (error) {
      console.error('Error getting search history:', error);
      return [];
    }
  }

  async clearSearchHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(RECIPE_CACHE_KEYS.SEARCH_HISTORY);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  }

  // =========================================================================
  // Public Utility Methods
  // =========================================================================

  async clearAllCache(): Promise<void> {
    await this.clearCache('caloritrack_recipe');
  }

  async getFilterSuggestions(): Promise<{
    cuisines: string[];
    mealTypes: string[];
    difficulties: string[];
    tags: string[];
  }> {
    try {
      const snapshot = await firestore()
        .collection(FIREBASE_CONFIG.collections.recipes)
        .limit(100)
        .get();

      const cuisines = new Set<string>();
      const mealTypes = new Set<string>();
      const difficulties = new Set<string>();
      const tags = new Set<string>();

      snapshot.forEach((doc) => {
        const recipe = doc.data() as Recipe;
        if (recipe.cuisineType) cuisines.add(recipe.cuisineType);
        if (recipe.mealType) mealTypes.add(recipe.mealType);
        if (recipe.difficulty) difficulties.add(recipe.difficulty);
        recipe.tags.forEach(tag => tags.add(tag));
      });

      return {
        cuisines: Array.from(cuisines),
        mealTypes: Array.from(mealTypes),
        difficulties: Array.from(difficulties),
        tags: Array.from(tags),
      };
    } catch (error) {
      console.error('Error getting filter suggestions:', error);
      return {
        cuisines: [],
        mealTypes: [],
        difficulties: [],
        tags: [],
      };
    }
  }
}

// =============================================================================
// Export singleton instance
// =============================================================================

export const recipeService = new RecipeService();
export default recipeService;
