/**
 * Recipes Data Module - Main Export
 *
 * Exports all mock recipe data and utilities
 */

export { MOCK_RECIPES } from './mock-recipes';
export { RECIPE_IMAGES, getRandomImage, getImage } from './recipe-images';
export {
  calculateHealthScore,
  createNutritionInfo,
  generateRecipeId,
  getAllergensFromIngredients,
  getDietaryRestrictions,
} from './recipe-utils';
