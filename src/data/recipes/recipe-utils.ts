/**
 * Recipe Utils - Helper Functions for Mock Data
 *
 * Utility functions for generating realistic mock recipe data
 */

import type { Recipe, NutritionInfo } from '@/types/recipe';

/**
 * Generate a unique recipe ID from name and index
 */
export function generateRecipeId(name: string, index: number): string {
  const normalized = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const mealType = index < 7 ? 'bre' : index < 15 ? 'lun' : index < 24 ? 'din' : 'snn';
  return `rec_${mealType}_${normalized}`;
}

/**
 * Calculate health score based on nutrition and ingredients
 */
export function calculateHealthScore(
  calories: number,
  protein: number,
  hasVegetables: boolean,
  processingLevel: string
): number {
  let score = 5; // Base score

  // Protein ratio (higher is better)
  const proteinRatio = (protein / calories) * 100;
  if (proteinRatio >= 20) score += 2;
  else if (proteinRatio >= 15) score += 1;

  // Vegetables bonus
  if (hasVegetables) score += 1;

  // Processing level penalty
  if (processingLevel === 'ultra-processed') score -= 2;
  else if (processingLevel === 'processed') score -= 1;
  else if (processingLevel === 'unprocessed') score += 1;

  return Math.min(10, Math.max(1, score));
}

/**
 * Create nutrition info with balanced macros
 */
export function createNutritionInfo(calories: number): NutritionInfo {
  // Balanced macros: 30% protein, 40% carbs, 30% fats
  const protein = Math.round((calories * 0.30) / 4);
  const carbs = Math.round((calories * 0.40) / 4);
  const fats = Math.round((calories * 0.30) / 9);

  return {
    calories,
    protein,
    carbohydrates: carbs,
    fats,
  };
}

/**
 * Get allergens from ingredients list
 */
export function getAllergensFromIngredients(ingredients: string[]): string[] {
  const allergenMap: Record<string, string> = {
    wheat: 'gluten',
    flour: 'gluten',
    bread: 'gluten',
    pasta: 'gluten',
    milk: 'dairy',
    cheese: 'dairy',
    yogurt: 'dairy',
    butter: 'dairy',
    egg: 'eggs',
    eggs: 'eggs',
    soy: 'soy',
    tofu: 'soy',
    'peanut': 'peanuts',
    peanuts: 'peanuts',
    fish: 'fish',
    shrimp: 'shellfish',
    crab: 'shellfish',
    sesame: 'sesame',
  };

  const allergens: string[] = [];
  const ingredientText = ingredients.join(' ').toLowerCase();

  for (const [key, allergen] of Object.entries(allergenMap)) {
    if (ingredientText.includes(key) && !allergens.includes(allergen)) {
      allergens.push(allergen);
    }
  }

  return allergens;
}

/**
 * Determine dietary restrictions from ingredients
 */
export function getDietaryRestrictions(ingredients: string[]): string[] {
  const restrictions: string[] = [];
  const ingredientText = ingredients.join(' ').toLowerCase();

  const hasMeat = /\b(chicken|beef|pork|lamb|turkey|meat|bacon|ham|sausage)\b/.test(ingredientText);
  const hasFish = /\b(fish|salmon|tuna|shrimp|crab|lobster)\b/.test(ingredientText);
  const hasDairy = /\b(milk|cheese|yogurt|butter|cream)\b/.test(ingredientText);
  const hasEggs = /\b(egg|eggs)\b/.test(ingredientText);
  const hasGluten = /\b(wheat|flour|bread|pasta)\b/.test(ingredientText);

  if (!hasMeat && !hasFish) restrictions.push('vegetarian');
  if (!hasMeat && !hasFish && !hasDairy && !hasEggs) restrictions.push('vegan');
  if (!hasGluten) restrictions.push('gluten-free');
  if (!hasDairy) restrictions.push('dairy-free');

  return restrictions;
}
