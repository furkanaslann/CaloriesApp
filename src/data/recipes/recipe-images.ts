/**
 * Recipe Images - Unsplash URL Collection
 *
 * High-quality food photography organized by meal type
 */

export const RECIPE_IMAGES = {
  breakfast: {
    menemen: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&h=600&fit=crop',
    yogurtBowl: 'https://images.unsplash.com/photo-1488477181946-6428a029177b?w=800&h=600&fit=crop',
    avocadoToast: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&h=600&fit=crop',
    shakshuka: 'https://images.unsplash.com/photo-1590598623198-a992e746631b?w=800&h=600&fit=crop',
    overnightOats: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&h=600&fit=crop',
    cheesePlate: 'https://images.unsplash.com/photo-1626202158118-61336836ffd1?w=800&h=600&fit=crop',
    scrambledEggs: 'https://images.unsplash.com/photo-1608039829572-f4e5e1cf8b9c?w=800&h=600&fit=crop',
    pancakes: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop',
    smoothie: 'https://images.unsplash.com/photo-1553530979-7ee52a2670c4?w=800&h=600&fit=crop',
  },
  lunch: {
    chickenSalad: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
    shawarma: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&h=600&fit=crop',
    buddhaBowl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800&h=600&fit=crop',
    lentilSoup: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop',
    caesarSalad: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&h=600&fit=crop',
    mediterraneanPasta: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&h=600&fit=crop',
    thaiBasilChicken: 'https://images.unsplash.com/photo-1564436872-f6d81182df12?w=800&h=600&fit=crop',
    tomatoPilaf: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&h=600&fit=crop',
  },
  dinner: {
    grilledSalmon: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop',
    beefStirFry: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop',
    chickenTikka: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop',
    moussaka: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&h=600&fit=crop',
    margheritaPizza: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop',
    mexicanBowl: 'https://images.unsplash.com/photo-1543352634-a1c51d545805?w=800&h=600&fit=crop',
    adanaKebab: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&h=600&fit=crop',
    ratatouille: 'https://images.unsplash.com/photo-1572453800999-e8d2d1588b83?w=800&h=600&fit=crop',
    teriyakiChicken: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
  },
  snack: {
    hummus: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=800&h=600&fit=crop',
    chickenSkewers: 'https://images.unsplash.com/photo-1565183828189-b7a01e3a373e?w=800&h=600&fit=crop',
    energyBalls: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&h=600&fit=crop',
    nutMix: 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=800&h=600&fit=crop',
    capreseSkewers: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&h=600&fit=crop',
    acaiBowl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&h=600&fit=crop',
  },
  general: {
    cooking: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
    ingredients: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&h=600&fit=crop',
    healthyFood: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop',
  },
} as const;

/**
 * Get a random image URL for a meal type
 */
export function getRandomImage(mealType: string): string {
  const images = RECIPE_IMAGES[mealType as keyof typeof RECIPE_IMAGES];
  if (images && typeof images === 'object') {
    const keys = Object.keys(images);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return (images as any)[randomKey];
  }
  return RECIPE_IMAGES.general.healthyFood;
}

/**
 * Get a specific image by meal type and key
 */
export function getImage(mealType: string, key: string): string {
  const images = RECIPE_IMAGES[mealType as keyof typeof RECIPE_IMAGES];
  if (images && typeof images === 'object') {
    return (images as any)[key] || RECIPE_IMAGES.general.healthyFood;
  }
  return RECIPE_IMAGES.general.healthyFood;
}
