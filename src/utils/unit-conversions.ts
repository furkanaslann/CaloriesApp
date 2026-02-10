/**
 * CaloriTrack - Unit Conversion Utilities
 * Minimal. Cool. Aesthetic.
 */

// Height conversion functions
export const inchesToCm = (inches: number): number => inches * 2.54;
export const cmToInches = (cm: number): number => cm / 2.54;

// Weight conversion functions
export const lbsToKg = (lbs: number): number => lbs * 0.453592;
export const kgToLbs = (kg: number): number => kg / 0.453592;

// Height validation ranges
export const getHeightRange = (unit: 'cm' | 'inches') => {
  if (unit === 'inches') {
    return { min: 39, max: 98 };  // ~100-250 cm
  }
  return { min: 100, max: 250 };
};

// Weight validation ranges
export const getWeightRange = (unit: 'kg' | 'lbs') => {
  if (unit === 'lbs') {
    return { min: 66, max: 660 };  // ~30-300 kg
  }
  return { min: 30, max: 300 };
};

// Quick select values for height
export const getQuickSelectHeights = (unit: 'cm' | 'inches') => {
  if (unit === 'inches') {
    return [59, 63, 65, 67, 69, 71, 73, 75, 77];  // ~150-195 cm
  }
  return [150, 160, 165, 170, 175, 180, 185, 190, 195];
};

// Quick select values for weight
export const getQuickSelectWeights = (unit: 'kg' | 'lbs') => {
  if (unit === 'lbs') {
    return [110, 120, 130, 145, 155, 165, 175, 190, 200, 210, 220];  // ~50-100 kg
  }
  return [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
};

// Unit labels for display
export const getHeightUnitLabel = (unit: 'cm' | 'inches'): string => {
  return unit === 'inches' ? 'inç' : 'cm';
};

export const getWeightUnitLabel = (unit: 'kg' | 'lbs'): string => {
  return unit === 'lbs' ? 'lbs' : 'kg';
};
