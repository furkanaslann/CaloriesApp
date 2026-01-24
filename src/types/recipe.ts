/**
 * Recipe Types
 *
 * Extended recipe types for CaloriTrack application.
 * Includes filters, state management, and API-related types.
 */

import { NutritionInfo, DietaryRestriction } from './food';

// =============================================================================
// Recipe Filters
// =============================================================================

export interface RecipeFilters {
  /** Meal type filter */
  mealType?: MealType | 'all';
  /** Dietary restrictions filter */
  diet?: DietaryRestriction[];
  /** Calorie range filter */
  calories?: { min: number; max: number };
  /** Cooking time range filter */
  time?: { min: number; max: number };
  /** Cuisine types filter */
  cuisine?: CuisineType[];
  /** Allergens to exclude */
  allergens?: AllergenType[];
  /** Difficulty level filter */
  difficulty?: DifficultyLevel;
  /** Search query text */
  search?: string;
  /** Processing level filter */
  processingLevel?: ProcessingLevel;
  /** Health score range (1-10) */
  healthScore?: { min: number; max: number };
}

// =============================================================================
// Recipe State
// =============================================================================

export interface RecipeState {
  /** List of all available recipes */
  recipes: Recipe[];
  /** User's saved/favorite recipes */
  savedRecipes: Recipe[];
  /** Currently selected recipe */
  selectedRecipe: Recipe | null;
  /** Loading state */
  loading: boolean;
  /** Error message */
  error: string | null;
  /** Active filters */
  filters: RecipeFilters;
  /** Monthly recipe view count for current user */
  monthlyViews: number;
  /** Search results */
  searchResults: Recipe[];
  /** AI recommendations (Premium) */
  aiRecommendations: Recipe[];
}

// =============================================================================
// Extended Recipe Types (API Integration)
// =============================================================================

/**
 * Meal type enum
 */
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

/**
 * Cuisine type enum
 */
export type CuisineType =
  | 'american'
  | 'italian'
  | 'mexican'
  | 'chinese'
  | 'japanese'
  | 'indian'
  | 'thai'
  | 'mediterranean'
  | 'french'
  | 'greek'
  | 'spanish'
  | 'korean'
  | 'vietnamese'
  | 'middle-eastern'
  | 'other';

/**
 * Cooking method enum
 */
export type CookingMethod =
  | 'baked'
  | 'grilled'
  | 'fried'
  | 'steamed'
  | 'boiled'
  | 'roasted'
  | 'sautéed'
  | 'raw'
  | 'slow-cooked'
  | 'pressure-cooked'
  | 'air-fried'
  | 'other';

/**
 * Difficulty level enum
 */
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

/**
 * Processing level enum (from meal-analysis-api.md)
 */
export type ProcessingLevel =
  | 'unprocessed'
  | 'minimally-processed'
  | 'processed'
  | 'ultra-processed';

/**
 * Allergen type enum
 */
export type AllergenType =
  | 'gluten'
  | 'dairy'
  | 'eggs'
  | 'soy'
  | 'nuts'
  | 'peanuts'
  | 'fish'
  | 'shellfish'
  | 'sesame'
  | 'sulfites'
  | 'other';

/**
 * Extended Recipe interface with API fields
 */
export interface Recipe {
  id: string;
  name: string;
  description?: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  servings: number;
  prepTime?: number; // minutes
  cookTime?: number; // minutes
  totalTime?: number; // prepTime + cookTime
  difficulty?: DifficultyLevel;
  nutritionPerServing: NutritionInfo;
  photos?: string[];
  tags: string[];
  verified: boolean;
  createdAt: string;
  updatedAt: string;

  // Extended fields from API
  /** Health score (1-10) */
  healthScore?: number;
  /** List of allergens in the recipe */
  allergens?: AllergenType[];
  /** Processing level of ingredients */
  processingLevel?: ProcessingLevel;
  /** Dietary restrictions this recipe satisfies */
  dietaryRestrictions?: DietaryRestriction[];
  /** Meal type category */
  mealType?: MealType;
  /** Cuisine type */
  cuisineType?: CuisineType;
  /** Cooking method */
  cookingMethod?: CookingMethod;
  /** Detailed ingredient information */
  ingredientDetails?: IngredientDetail[];
  /** Author/creator information */
  author?: {
    id: string;
    name: string;
    isVerified: boolean;
  };
  /** Average rating (1-5) */
  rating?: number;
  /** Number of ratings */
  ratingCount?: number;
  /** Number of times saved/favorited */
  saveCount?: number;
  /** View count */
  viewCount?: number;
}

/**
 * Recipe ingredient (basic)
 */
export interface RecipeIngredient {
  foodId: string;
  quantity: number;
  unit: string;
  notes?: string;
}

/**
 * Detailed ingredient information
 */
export interface IngredientDetail {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
  nutritionPerUnit: NutritionInfo;
  category: string;
  isOrganic?: boolean;
  brand?: string;
}

// =============================================================================
// AI Recommendations
// =============================================================================

/**
 * AI recommendation request parameters
 */
export interface AIRecommendationParams {
  userGoals: UserNutritionGoals;
  dietaryRestrictions: DietaryRestriction[];
  allergens: AllergenType[];
  preferredCuisines?: CuisineType[];
  mealType?: MealType;
  maxCalories?: number;
  maxTime?: number;
  excludeIngredients?: string[];
}

/**
 * User nutrition goals for recommendations
 */
export interface UserNutritionGoals {
  calories: number;
  protein: number; // grams
  carbohydrates: number; // grams
  fats: number; // grams
}

// =============================================================================
// Custom Recipe Creation (Premium)
// =============================================================================

/**
 * Input data for creating a custom recipe
 */
export interface CreateRecipeInput {
  name: string;
  description?: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  servings: number;
  prepTime?: number;
  cookTime?: number;
  difficulty?: DifficultyLevel;
  photos?: string[];
  dietaryRestrictions?: DietaryRestriction[];
  allergens?: AllergenType[];
  mealType?: MealType;
  cuisineType?: CuisineType;
  cookingMethod?: CookingMethod;
  tags: string[];
}

/**
 * Validation result for recipe input
 */
export interface RecipeValidationResult {
  isValid: boolean;
  errors: RecipeValidationError[];
}

/**
 * Recipe validation error
 */
export interface RecipeValidationError {
  field: string;
  message: string;
}

// =============================================================================
// Grocery List Generation (Premium)
// =============================================================================

/**
 * Grocery list item
 */
export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
  recipes: string[]; // Recipe IDs that use this ingredient
  category?: string;
  notes?: string;
}

/**
 * Grocery list generation input
 */
export interface GroceryListInput {
  recipeIds: string[];
  servings: Record<string, number>; // recipeId -> serving count
  consolidateIngredients?: boolean;
}

/**
 * Generated grocery list
 */
export interface GroceryList {
  id: string;
  items: GroceryItem[];
  estimatedCost?: number;
  createdAt: string;
}

// =============================================================================
// Recipe View Tracking
// =============================================================================

/**
 * Recipe view record for monthly tracking
 */
export interface RecipeViewRecord {
  userId: string;
  recipeId: string;
  viewedAt: string; // ISO timestamp
  monthYear: string; // Format: YYYY-MM
}

/**
 * Monthly view summary for a user
 */
export interface MonthlyViewSummary {
  userId: string;
  monthYear: string;
  totalViews: number;
  uniqueRecipesViewed: string[];
}

// =============================================================================
// Saved Recipes
// =============================================================================

/**
 * Saved recipe record
 */
export interface SavedRecipe {
  userId: string;
  recipeId: string;
  savedAt: string; // ISO timestamp
  notes?: string;
  customServings?: number;
}

/**
 * Saved recipe with full recipe data
 */
export interface SavedRecipeWithDetails extends SavedRecipe {
  recipe: Recipe;
}

// =============================================================================
// Search & Discovery
// =============================================================================

/**
 * Search result with relevance score
 */
export interface RecipeSearchResult {
  recipe: Recipe;
  relevanceScore: number;
  matchedFields: string[];
}

/**
 * Search history item
 */
export interface SearchHistoryItem {
  query: string;
  filters?: RecipeFilters;
  timestamp: string;
  resultCount: number;
}

// =============================================================================
// Pagination
// =============================================================================

/**
 * Paginated recipe list response
 */
export interface PaginatedRecipes {
  recipes: Recipe[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: SortField;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Available sort fields
 */
export type SortField =
  | 'name'
  | 'createdAt'
  | 'rating'
  | 'viewCount'
  | 'saveCount'
  | 'prepTime'
  | 'calories'
  | 'healthScore';

// =============================================================================
// Recipe Categories
// =============================================================================

/**
 * Recipe category for grouping
 */
export interface RecipeCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  recipeCount: number;
}

// =============================================================================
// Export all types
// =============================================================================

export type {
  RecipeFilters,
  RecipeState,
  Recipe,
  RecipeIngredient,
  IngredientDetail,
  AIRecommendationParams,
  UserNutritionGoals,
  CreateRecipeInput,
  RecipeValidationResult,
  RecipeValidationError,
  GroceryItem,
  GroceryListInput,
  GroceryList,
  RecipeViewRecord,
  MonthlyViewSummary,
  SavedRecipe,
  SavedRecipeWithDetails,
  RecipeSearchResult,
  SearchHistoryItem,
  PaginatedRecipes,
  PaginationParams,
  RecipeCategory,
};
