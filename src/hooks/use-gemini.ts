import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import geminiService, { FoodAnalysisResult } from '@/services/gemini-service';

interface UseGeminiState {
  loading: boolean;
  error: string | null;
}

interface UseGeminiReturn extends UseGeminiState {
  analyzeFood: (imageBase64: string, userPrompt?: string) => Promise<FoodAnalysisResult | null>;
  clearError: () => void;
}

export const useGemini = (authToken?: string): UseGeminiReturn => {
  const [state, setState] = useState<UseGeminiState>({
    loading: false,
    error: null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const analyzeFood = useCallback(async (
    imageBase64: string,
    userPrompt?: string
  ): Promise<FoodAnalysisResult | null> => {
    setLoading(true);
    setError(null);

    try {
      // Resim doğrulama
      if (!geminiService.validateBase64Image(imageBase64)) {
        throw new Error('Geçersiz resim formatı veya boyutu çok büyük');
      }

      const response = await geminiService.analyzeFood(imageBase64, userPrompt, authToken);

      if (response.success && response.data) {
        Alert.alert(
          'Başarılı',
          `"${response.data.food_name}" için besin analizi tamamlandı!`,
          [{ text: 'Tamam', style: 'default' }]
        );
        return response.data;
      } else {
        throw new Error('Analiz sonuçları alınamadı');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Yiyecek analizi sırasında bir hata oluştu';
      setError(errorMessage);
      Alert.alert('Hata', errorMessage, [{ text: 'Tamam', style: 'destructive' }]);
      return null;
    } finally {
      setLoading(false);
    }
  }, [authToken, setLoading, setError]);

  return {
    ...state,
    analyzeFood,
    clearError,
  };
};

export default useGemini;