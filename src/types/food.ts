// Food Item Types
export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
  nutrition: NutritionInfo;
  servingSize: number;
  servingUnit: string;
  category: FoodCategory;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Nutrition Information
export interface NutritionInfo {
  calories: number;
  protein: number; // grams
  carbohydrates: number; // grams
  fats: number; // grams
  fiber?: number; // grams
  sugar?: number; // grams
  sodium?: number; // mg
  cholesterol?: number; // mg
  saturatedFat?: number; // grams
  transFat?: number; // grams
  vitamins?: {
    vitaminA?: number; // IU
    vitaminC?: number; // mg
    vitaminD?: number; // IU
    vitaminE?: number; // mg
    vitaminK?: number; // mcg
    thiamine?: number; // mg
    riboflavin?: number; // mg
    niacin?: number; // mg
    vitaminB6?: number; // mg
    folate?: number; // mcg
    vitaminB12?: number; // mcg
  };
  minerals?: {
    calcium?: number; // mg
    iron?: number; // mg
    magnesium?: number; // mg
    phosphorus?: number; // mg
    potassium?: number; // mg
    zinc?: number; // mg
  };
}

// Food Categories
export type FoodCategory =
  | 'fruits'
  | 'vegetables'
  | 'grains'
  | 'protein'
  | 'dairy'
  | 'fats'
  | 'beverages'
  | 'snacks'
  | 'processed'
  | 'other';

// Meal Types
export interface Meal {
  id: string;
  type: MealType;
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format
  foods: MealFood[];
  totalNutrition: NutritionInfo;
  notes?: string;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
}

export type MealType =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'snack'
  | 'beverage';

// Food in a meal
export interface MealFood {
  foodId: string;
  quantity: number;
  unit: string;
  nutrition: NutritionInfo; // Calculated based on quantity
}

// Daily Nutrition Summary
export interface DailyNutrition {
  date: string; // YYYY-MM-DD format
  meals: Meal[];
  totalNutrition: NutritionInfo;
  goals: NutritionInfo;
  achievement: {
    calories: number; // percentage of goal
    protein: number; // percentage of goal
    carbohydrates: number; // percentage of goal
    fats: number; // percentage of goal
  };
}

// Water Tracking
export interface WaterIntake {
  id: string;
  date: string; // YYYY-MM-DD format
  amount: number; // ml
  timestamp: string; // ISO string
}

// Recipe Types
export interface Recipe {
  id: string;
  name: string;
  description?: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  servings: number;
  prepTime?: number; // minutes
  cookTime?: number; // minutes
  difficulty?: 'easy' | 'medium' | 'hard';
  nutritionPerServing: NutritionInfo;
  photos?: string[];
  tags: string[];
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeIngredient {
  foodId: string;
  quantity: number;
  unit: string;
  notes?: string;
}

// Food Search
export interface FoodSearchResult {
  items: FoodItem[];
  total: number;
  page: number;
  limit: number;
}

// Food Recognition
export interface FoodRecognitionResult {
  foods: RecognizedFood[];
  confidence: number; // 0-1
  timestamp: string;
  imageUrl?: string;
}

export interface RecognizedFood {
  name: string;
  confidence: number; // 0-1
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  estimatedNutrition?: NutritionInfo;
}

// User Preferences for Food
export interface FoodPreferences {
  favoriteFoods: string[];
  dislikedFoods: string[];
  allergens: string[];
  dietaryRestrictions: DietaryRestriction[];
  frequentlyEaten: string[];
}

export type DietaryRestriction =
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'dairy-free'
  | 'keto'
  | 'paleo'
  | 'low-carb'
  | 'low-fat'
  | 'low-sodium'
  | 'halal'
  | 'kosher'
  | 'other';

// Nutrition Goals
export interface NutritionGoals {
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
  fiber?: number;
  sodium?: number;
}

// Barcode Scanner Result
export interface BarcodeResult {
  barcode: string;
  format: string;
  foodItem?: FoodItem;
  scannedAt: string;
}