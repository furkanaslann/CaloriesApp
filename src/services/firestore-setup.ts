/**
 * Firestore Collections Setup for Recipes
 *
 * This file documents the Firestore collection structure used by the RecipeService.
 * Use this reference when setting up Firestore security rules and indexes.
 *
 * COLLECTION STRUCTURE:
 *
 * 1. recipes (Collection)
 *    - Recipe documents with full recipe data
 *    - Indexed by: createdAt, tags, difficulty, healthScore
 *
 * 2. users/{userId}/savedRecipes (Sub-collection)
 *    - User's saved/favorited recipes
 *    - Indexed by: savedAt
 *
 * 3. users/{userId}/recipeViews (Sub-collection)
 *    - Monthly recipe view tracking for premium limits
 *    - Document ID format: "YYYY-MM" (e.g., "2024-01")
 *
 * 4. users/{userId}/customRecipes (Sub-collection)
 *    - User-created custom recipes (Premium feature)
 *    - Indexed by: createdAt
 */

import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

// =============================================================================
// Collection Names
// =============================================================================

export const COLLECTIONS = {
  RECIPES: 'recipes' as const,
  USERS: 'users' as const,
} as const;

export const SUB_COLLECTIONS = {
  SAVED_RECIPES: 'savedRecipes' as const,
  RECIPE_VIEWS: 'recipeViews' as const,
  CUSTOM_RECIPES: 'customRecipes' as const,
} as const;

// =============================================================================
// Type References
// =============================================================================

/**
 * Recipe Document Structure
 *
 * @example
 * {
 *   id: "recipe_123",
 *   name: "Grilled Chicken Salad",
 *   description: "A healthy and delicious salad...",
 *   ingredients: [...],
 *   instructions: [...],
 *   servings: 4,
 *   nutritionPerServing: {...},
 *   tags: ["high-protein", "low-carb", "gluten-free"],
 *   difficulty: "easy",
 *   prepTime: 15,
 *   cookTime: 20,
 *   healthScore: 9,
 *   allergens: ["none"],
 *   processingLevel: "unprocessed",
 *   mealType: "lunch",
 *   cuisineType: "mediterranean",
 *   verified: true,
 *   createdAt: "2024-01-15T10:00:00Z",
 *   updatedAt: "2024-01-15T10:00:00Z"
 * }
 */
export type RecipeDocument = {
  id: string;
  name: string;
  description?: string;
  ingredients: Array<{
    foodId: string;
    quantity: number;
    unit: string;
    notes?: string;
  }>;
  instructions: string[];
  servings: number;
  prepTime?: number;
  cookTime?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  nutritionPerServing: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fats: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };
  photos?: string[];
  tags: string[];
  verified: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  // Extended fields from meal-analysis-api.md
  healthScore?: number; // 1-10
  allergens?: string[];
  processingLevel?: 'unprocessed' | 'minimally_processed' | 'processed' | 'ultra_processed';
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  cuisineType?: string;
  cookingMethod?: string;
  dietaryRestrictions?: string[];
};

/**
 * Saved Recipe Document Structure
 *
 * @example
 * {
 *   recipeId: "recipe_123",
 *   savedAt: "2024-01-15T10:00:00Z",
 *   recipe: {...} // Full recipe reference (optional, for offline access)
 * }
 */
export type SavedRecipeDocument = {
  recipeId: string;
  savedAt: string; // ISO 8601
  recipe?: Partial<RecipeDocument>; // Cached recipe data
};

/**
 * Recipe View Document Structure (Monthly tracking)
 *
 * Document ID: "YYYY-MM" (e.g., "2024-01")
 *
 * @example
 * {
 *   month: "2024-01",
 *   views: 5,
 *   viewDates: [
 *     { recipeId: "recipe_123", viewedAt: "2024-01-15T10:00:00Z" },
 *     { recipeId: "recipe_456", viewedAt: "2024-01-15T11:00:00Z" }
 *   ],
 *   limit: 5, // null for premium users
 *   resetDate: "2024-02-01T00:00:00Z"
 * }
 */
export type RecipeViewDocument = {
  month: string; // "YYYY-MM" format
  views: number;
  viewDates: Array<{
    recipeId: string;
    viewedAt: string; // ISO 8601
  }>;
  limit: number | null; // 5 for free, null for premium
  resetDate: string; // ISO 8601
};

/**
 * Custom Recipe Document Structure (Premium)
 *
 * @example
 * {
 *   id: "custom_123",
 *   userId: "user_456",
 *   name: "Grandma's Pasta",
 *   description: "Family recipe passed down...",
 *   ingredients: [...],
 *   instructions: [...],
 *   servings: 6,
 *   nutritionPerServing: {...},
 *   photos: ["url..."],
 *   tags: ["homemade", "family-recipe"],
 *   isPublic: false,
 *   createdAt: "2024-01-15T10:00:00Z",
 *   updatedAt: "2024-01-15T10:00:00Z"
 * }
 */
export type CustomRecipeDocument = RecipeDocument & {
  userId: string;
  isPublic: boolean;
};

// =============================================================================
// Collection References Helpers
// =============================================================================

/**
 * Get the recipes collection reference
 */
export const getRecipesCollection = (): FirebaseFirestoreTypes.CollectionReference => {
  return firestore().collection(COLLECTIONS.RECIPES);
};

/**
 * Get a specific recipe document reference
 */
export const getRecipeDocument = (recipeId: string): FirebaseFirestoreTypes.DocumentReference => {
  return getRecipesCollection().doc(recipeId);
};

/**
 * Get the user's saved recipes sub-collection
 */
export const getSavedRecipesCollection = (userId: string): FirebaseFirestoreTypes.CollectionReference => {
  return firestore()
    .collection(COLLECTIONS.USERS)
    .doc(userId)
    .collection(SUB_COLLECTIONS.SAVED_RECIPES);
};

/**
 * Get a specific saved recipe document
 */
export const getSavedRecipeDocument = (
  userId: string,
  recipeId: string
): FirebaseFirestoreTypes.DocumentReference => {
  return getSavedRecipesCollection(userId).doc(recipeId);
};

/**
 * Get the user's recipe views sub-collection (monthly tracking)
 */
export const getRecipeViewsCollection = (userId: string): FirebaseFirestoreTypes.CollectionReference => {
  return firestore()
    .collection(COLLECTIONS.USERS)
    .doc(userId)
    .collection(SUB_COLLECTIONS.RECIPE_VIEWS);
};

/**
 * Get a specific month's view document
 * Document ID format: "YYYY-MM"
 */
export const getRecipeViewDocument = (
  userId: string,
  month: string // "YYYY-MM" format
): FirebaseFirestoreTypes.DocumentReference => {
  return getRecipeViewsCollection(userId).doc(month);
};

/**
 * Get the user's custom recipes sub-collection
 */
export const getCustomRecipesCollection = (userId: string): FirebaseFirestore-types.CollectionReference => {
  return firestore()
    .collection(COLLECTIONS.USERS)
    .doc(userId)
    .collection(SUB_COLLECTIONS.CUSTOM_RECIPES);
};

/**
 * Get a specific custom recipe document
 */
export const getCustomRecipeDocument = (
  userId: string,
  recipeId: string
): FirebaseFirestoreTypes.DocumentReference => {
  return getCustomRecipesCollection(userId).doc(recipeId);
};

// =============================================================================
// Firestore Index Requirements
// =============================================================================

/**
 * REQUIRED COMPOSITE INDEXES:
 *
 * 1. recipes collection:
 *    - Index: tags (ascending), createdAt (descending)
 *      Purpose: Filter by tags and sort by newest
 *
 *    - Index: difficulty (ascending), healthScore (descending)
 *      Purpose: Filter by difficulty and sort by health score
 *
 *    - Index: mealType (ascending), createdAt (descending)
 *      Purpose: Filter by meal type and sort by newest
 *
 * 2. users/{userId}/savedRecipes sub-collection:
 *    - Index: savedAt (descending)
 *      Purpose: Sort saved recipes by date
 *
 * 3. users/{userId}/recipeViews sub-collection:
 *    - Index: month (ascending)
 *      Purpose: Query current month's views
 *
 * 4. users/{userId}/customRecipes sub-collection:
 *    - Index: createdAt (descending)
 *      Purpose: Sort custom recipes by date
 *
 * To create indexes, use the Firebase Console or deploy via:
 * firebase firestore:indexes
 */

export const REQUIRED_INDEXES = [
  {
    collection: 'recipes',
    fields: [
      { field: 'tags', order: 'ASCENDING' },
      { field: 'createdAt', order: 'DESCENDING' },
    ],
  },
  {
    collection: 'recipes',
    fields: [
      { field: 'difficulty', order: 'ASCENDING' },
      { field: 'healthScore', order: 'DESCENDING' },
    ],
  },
  {
    collection: 'recipes',
    fields: [
      { field: 'mealType', order: 'ASCENDING' },
      { field: 'createdAt', order: 'DESCENDING' },
    ],
  },
] as const;

// =============================================================================
// Firestore Security Rules Reference
// =============================================================================

/**
 * FIRESTORE SECURITY RULES FOR RECIPES:
 *
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *
 *     // Recipes collection - public read, authenticated create/update
 *     match /recipes/{recipeId} {
 *       allow read: if true;
 *       allow create: if request.auth != null
 *         && request.resource.data.difficulty in ['easy', 'medium', 'hard']
 *         && request.resource.data.servings > 0;
 *       allow update: if request.auth != null
 *         && request.auth.token.admin == true;
 *       allow delete: if request.auth != null
 *         && request.auth.token.admin == true;
 *     }
 *
 *     // User saved recipes - user-specific
 *     match /users/{userId}/savedRecipes/{recipeId} {
 *       allow read: if request.auth != null && request.auth.uid == userId;
 *       allow write: if request.auth != null && request.auth.uid == userId;
 *     }
 *
 *     // User recipe views - user-specific
 *     match /users/{userId}/recipeViews/{month} {
 *       allow read, write: if request.auth != null && request.auth.uid == userId;
 *     }
 *
 *     // User custom recipes - premium feature
 *     match /users/{userId}/customRecipes/{recipeId} {
 *       allow read: if request.auth != null && request.auth.uid == userId;
 *       allow create: if request.auth != null
 *         && request.auth.uid == userId
 *         && request.auth.token.premium == true;
 *       allow update, delete: if request.auth != null
 *         && request.auth.uid == userId
 *         && request.resource.data.userId == request.auth.uid;
 *     }
 *   }
 * }
 */

export default {
  COLLECTIONS,
  SUB_COLLECTIONS,
  getRecipesCollection,
  getRecipeDocument,
  getSavedRecipesCollection,
  getSavedRecipeDocument,
  getRecipeViewsCollection,
  getRecipeViewDocument,
  getCustomRecipesCollection,
  getCustomRecipeDocument,
  REQUIRED_INDEXES,
};
