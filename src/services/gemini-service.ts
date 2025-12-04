import axios from 'axios';

const FUNCTIONS_URL = process.env.EXPO_PUBLIC_FIREBASE_FUNCTIONS_URL || 'https://us-central1-caloriesapp-demo.cloudfunctions.net';

export interface FoodAnalysisResult {
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  ingredients: string[];
  health_tips: string[];
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
    return this.makeRequest('/analyzeFood', {
      imageBase64,
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