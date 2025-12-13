import axios from 'axios';

const FUNCTIONS_URL = process.env.EXPO_PUBLIC_FIREBASE_FUNCTIONS_URL || 'https://us-central1-calories-app-185b6.cloudfunctions.net';

export interface Vitamins {
  vitamin_a?: number;
  vitamin_c?: number;
  vitamin_d?: number;
  vitamin_e?: number;
  vitamin_k?: number;
  thiamine?: number;
  riboflavin?: number;
  niacin?: number;
  vitamin_b6?: number;
  folate?: number;
  vitamin_b12?: number;
}

export interface Minerals {
  calcium?: number;
  iron?: number;
  magnesium?: number;
  phosphorus?: number;
  potassium?: number;
  zinc?: number;
  copper?: number;
  manganese?: number;
  selenium?: number;
}

export interface IngredientDetail {
  name: string;
  amount?: number;
  unit?: string;
  notes?: string;
}

export interface FoodAnalysisResult {
  // Basic nutrition
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;

  // Detailed nutrition
  sugar?: number;
  sodium?: number;
  cholesterol?: number;
  saturated_fat?: number;
  unsaturated_fat?: number;

  // Vitamins and minerals
  vitamins?: Vitamins;
  minerals?: Minerals;

  // Health metrics
  health_score?: number; // 1-10 scale
  allergens?: string[];
  processing_level?: 'unprocessed' | 'minimally_processed' | 'processed' | 'ultra_processed';

  // Meal analysis
  meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert' | 'beverage' | 'other';
  cuisine_type?: string;
  cooking_method?: string;

  // Dietary information
  dietary_restrictions?: string[];

  // Ingredients
  ingredients?: string[];
  ingredient_details?: IngredientDetail[];

  // Recommendations
  health_tips?: string[];
  suggestions?: string[];

  // Meta
  confidence_score: number;
}

class GeminiService {
  private async makeRequest(endpoint: string, data: any, authToken?: string) {
    try {
      const config: any = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }

      const response = await axios.post(
        `${FUNCTIONS_URL}${endpoint}`,
        data,
        config
      );

      return response.data;
    } catch (error: any) {
      console.error(`Gemini Service Error (${endpoint}):`, error.response?.data || error.message);
      throw new Error(error.response?.data?.error || error.message || 'Servis hatası');
    }
  }

  /**
   * Yiyecek görselini analiz eder
   * @param imageBase64 - Base64 formatında resim verisi
   * @param userPrompt - Kullanıcı prompt'u (opsiyonel)
   * @param authToken - Firebase auth token (opsiyonel)
   */
  async analyzeFood(
    imageBase64: string,
    userPrompt?: string,
    authToken?: string
  ): Promise<{ success: boolean; data: FoodAnalysisResult }> {
    // Debug logları ekle
    console.log('Gemini Service: analyzeFood çağrıldı');
    console.log('Image length:', imageBase64.length);
    console.log('Image starts with:', imageBase64.substring(0, 50) + '...');

    // Base64 formatını kontrol et ve düzelt
    let processedImageBase64 = imageBase64;

    // Data URL formatındaysa sadece base64 kısmını al
    if (imageBase64.includes(',')) {
      processedImageBase64 = imageBase64.split(',')[1];
      console.log('Image processed: Data URL\'den base64 ayrıldı');
    }

    // Whitespace karakterlerini temizle
    processedImageBase64 = processedImageBase64.replace(/\s+/g, '').trim();
    console.log('Image cleaned, new length:', processedImageBase64.length);

    // Base64 formatını doğrula
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(processedImageBase64)) {
      console.error('Invalid base64 format detected');
      console.log('First 100 chars:', processedImageBase64.substring(0, 100));
      throw new Error('Geçersiz resim formatı');
    }

    console.log('Processed image length:', processedImageBase64.length);

    return this.makeRequest('/analyzeFood', {
      imageBase64: processedImageBase64,
      userPrompt: userPrompt || 'Bu yemeği analiz et ve besin değerlerini tahmin et'
    }, authToken);
  }

  /**
   * Base64 resim formatını kontrol eder
   * @param base64String - Base64 string
   */
  validateBase64Image(base64String: string): boolean {
    // Base64 format kontrolü
    const base64Regex = /^data:image\/(jpeg|jpg|png|webp);base64,/;
    if (!base64Regex.test(base64String)) {
      return false;
    }

    // Boyut kontrolü (max 10MB)
    const base64Data = base64String.split(',')[1];
    const fileSizeInBytes = (base64Data.length * 3) / 4;
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB

    return fileSizeInBytes <= maxSizeInBytes;
  }
}

export default new GeminiService();