/**
 * CaloriTrack - Dashboard Camera Screen
 * Minimal. Cool. Aesthetic.
 */

import BottomNavigation from '@/components/navigation/BottomNavigation';
import { BORDER_RADIUS, COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  Modal,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDashboard } from '@/hooks/use-dashboard';
import GeminiAnalyzer from '@/components/common/gemini-analyzer';
import { FoodAnalysisResult } from '@/services/gemini-service';
import { useUser } from '@/context/user-context';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

const { width } = Dimensions.get('window');

// Feature Flags
const ENABLE_STORAGE_UPLOAD = false; // Storage upload açık/kapalı

// Food history item type
interface FoodHistoryItem {
  id: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  date: string;
  confidence: number;
}

const CameraDashboardScreen = () => {
  const router = useRouter();
  const { addMeal, getRecentMeals } = useDashboard();
  const { user } = useUser();
  const [foodHistory, setFoodHistory] = useState<FoodHistoryItem[]>([]);
  const [showGeminiAnalyzer, setShowGeminiAnalyzer] = useState(false);

  // İzin durumları
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [galleryPermission, setGalleryPermission] = useState<boolean | null>(null);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  // Create theme object that matches expected structure
  const theme = {
    semanticColors: {
      background: { primary: COLORS.background },
      text: {
        primary: COLORS.textPrimary,
        secondary: COLORS.textSecondary,
        tertiary: COLORS.textTertiary,
        onPrimary: '#FFFFFF'
      },
      border: { primary: COLORS.border },
      onPrimary: '#FFFFFF',
    },
    colors: {
      primary: COLORS.primary,
      gradientStart: COLORS.primary,
      gradientEnd: '#EC4899',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
    },
    textStyles: {
      onboardingHero: { fontSize: TYPOGRAPHY.fontSizes['4xl'] },
      onboardingTitle: { fontSize: TYPOGRAPHY.fontSizes['3xl'], fontWeight: '600' },
      onboardingSubtitle: { fontSize: TYPOGRAPHY.fontSizes['xl'], fontWeight: '500' },
      onboardingDescription: { fontSize: TYPOGRAPHY.fontSizes.base },
    },
    spacing: {
      ...SPACING,
      sm: SPACING[2],
      md: SPACING[3],
      lg: SPACING[4],
      xl: SPACING[5],
      '2xl': SPACING[6],
      '4xl': SPACING[12],
    },
    borderRadius: BORDER_RADIUS,
    shadows: SHADOWS,
    coloredShadows: { gradient: SHADOWS.lg },
  };

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // İzinleri kontrol et
  const checkPermissions = async () => {
    setIsLoadingPermissions(true);
    try {
      // Kamera izni
      const cameraResult = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(cameraResult.status === 'granted');

      // Galeri izni
      const galleryResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(galleryResult.status === 'granted');

      // İzinlerden biri verilmediyse kullanıcıyı bilgilendir
      if (cameraResult.status !== 'granted' || galleryResult.status !== 'granted') {
        showPermissionAlert(cameraResult.status === 'granted', galleryResult.status === 'granted');
      }
    } catch (error) {
      console.error('Permission check error:', error);
      Alert.alert('Hata', 'İzinler kontrol edilirken bir hata oluştu.');
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  // İzin uyarısı göster
  const showPermissionAlert = (hasCamera: boolean, hasGallery: boolean) => {
    let message = 'AI yiyecek analizi için aşağıdaki izinler gereklidir:\n\n';

    if (!hasCamera) {
      message += '• Kamera: Yemek fotoğrafları çekmek için\n';
    }
    if (!hasGallery) {
      message += '• Galeri: Mevcut fotoğrafları seçmek için\n';
    }

    message += '\nAyarlar → Uygulama İzinleri bölümünden izinleri verebilirsiniz.';

    Alert.alert(
      'İzin Gerekli',
      message,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Ayarları Aç',
          onPress: () => Linking.openSettings()
        }
      ]
    );
  };

  // İzinleri yeniden kontrol et
  const handleRefreshPermissions = async () => {
    await checkPermissions();
  };

  // Load recent meals function - MUST be declared before useEffect
  const loadRecentMeals = useCallback(async () => {
    try {
      const meals = await getRecentMeals(10);
      // Transform meals to expected format
      const transformedMeals = meals.map(meal => ({
        id: meal.id,
        foodName: meal.name,
        calories: meal.calories,
        protein: meal.nutrition?.protein || 0,
        carbs: meal.nutrition?.carbohydrates || 0,
        fat: meal.nutrition?.fats || 0,
        time: meal.time,
        date: meal.date,
        confidence: meal.confidence || 0
      }));
      setFoodHistory(transformedMeals);
    } catch (error) {
      console.error('Error loading recent meals:', error);
    }
  }, [getRecentMeals]);

  // Load recent meals on mount
  useEffect(() => {
    loadRecentMeals();
    checkPermissions(); // İzinleri kontrol et
  }, [loadRecentMeals]);

  // Quick food suggestions
  const quickFoods = [
    { name: 'Elma', calories: 52, icon: '🍎' },
    { name: 'Yoğurt', calories: 100, icon: '🥄' },
    { name: 'Badem', calories: 160, icon: '🌰' },
    { name: 'Muz', calories: 89, icon: '🍌' },
  ];

  // Dynamic styles using updated theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.semanticColors.background.primary,
    },
    scrollView: {
      flex: 1,
      backgroundColor: theme.semanticColors.background.primary,
    },
    scrollContent: {
      paddingBottom: theme.spacing['2xl'] + 60, // Extra space for bottom nav
    },
    header: {
      paddingHorizontal: theme.spacing['2xl'],
      paddingTop: theme.spacing['4xl'],
      paddingBottom: theme.spacing['2xl'],
    },
    title: {
      fontSize: theme.textStyles.onboardingTitle?.fontSize || 30,
      fontWeight: (theme.textStyles.onboardingTitle?.fontWeight || '600') as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: theme.textStyles.onboardingSubtitle?.fontSize || 18,
      fontWeight: (theme.textStyles.onboardingSubtitle?.fontWeight || '400') as TextStyle['fontWeight'],
      color: theme.semanticColors.text.secondary,
    },
    content: {
      paddingHorizontal: theme.spacing['2xl'],
    },
    section: {
      marginBottom: theme.spacing['2xl'],
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.lg,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    seeAllButton: {
      fontSize: 14,
      fontWeight: '500' as TextStyle['fontWeight'],
      color: theme.colors.primary,
    },
    cameraButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: theme.spacing['2xl'],
      alignItems: 'center',
      marginBottom: theme.spacing['2xl'],
      flexDirection: 'row',
      justifyContent: 'center',
      ...theme.shadows.lg,
    },
    cameraButtonDisabled: {
      backgroundColor: '#CBD5E1',
    },
    cameraButtonText: {
      fontSize: 18,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.onPrimary,
    },

    // AI Features Section
    aiFeaturesSection: {
      marginBottom: theme.spacing['2xl'],
    },
    featureCard: {
      backgroundColor: theme.semanticColors.background.primary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      ...theme.shadows.sm,
    },
    featureTitle: {
      fontSize: 16,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginLeft: theme.spacing.md,
      flex: 1,
    },
    featureDescription: {
      fontSize: 14,
      color: theme.semanticColors.text.secondary,
      marginLeft: theme.spacing.md,
      flex: 2,
    },

    // Modal Styles
    closeModalButton: {
      position: 'absolute',
      top: 60,
      right: 24,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    quickAddSection: {
      marginBottom: theme.spacing['2xl'],
    },
    quickAddGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    quickAddItem: {
      width: (width - theme.spacing['2xl'] * 2 - theme.spacing.md) / 2,
      backgroundColor: theme.semanticColors.background.primary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      alignItems: 'center',
      ...theme.shadows.sm,
    },
    quickAddIcon: {
      fontSize: 32,
      marginBottom: theme.spacing.sm,
    },
    quickAddName: {
      fontSize: 14,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: 4,
    },
    quickAddCalories: {
      fontSize: 12,
      color: theme.semanticColors.text.secondary,
    },
    historyCard: {
      backgroundColor: theme.semanticColors.background.primary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    historyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    foodInfo: {
      flex: 1,
    },
    foodName: {
      fontSize: 16,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: 4,
    },
    foodTime: {
      fontSize: 12,
      color: theme.semanticColors.text.tertiary,
    },
    confidenceBadge: {
      backgroundColor: theme.colors.success + '20',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.md,
    },
    confidenceText: {
      fontSize: 10,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.colors.success,
    },
    nutritionInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.semanticColors.border.primary,
    },
    nutritionItem: {
      alignItems: 'center',
      flex: 1,
    },
    nutritionValue: {
      fontSize: 16,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
    },
    nutritionLabel: {
      fontSize: 10,
      color: theme.semanticColors.text.tertiary,
      marginTop: 2,
    },
    caloriesMain: {
      fontSize: 20,
      fontWeight: '700' as TextStyle['fontWeight'],
      color: theme.colors.primary,
    },

    // Permission styles
    permissionAlert: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FEF3C7',
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: '#F59E0B',
    },
    permissionContent: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    permissionTitle: {
      fontSize: 16,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: 2,
    },
    permissionText: {
      fontSize: 14,
      color: theme.semanticColors.text.secondary,
    },
    refreshButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: '#F3F4F6',
    },
  });

  const handleCameraPress = () => {
    // İzinler kontrol edilmediyse kontrol et
    if (cameraPermission === null || galleryPermission === null) {
      checkPermissions();
      return;
    }

    // İzinler verilmediyse kontrol et
    if (!cameraPermission || !galleryPermission) {
      showPermissionAlert(cameraPermission, galleryPermission);
      return;
    }

    // Tüm izinler verildiyse analyzer'ı aç
    setShowGeminiAnalyzer(true);
  };

  const handleAnalysisComplete = async (result: FoodAnalysisResult, imageData?: string, imageUri?: string) => {
    try {
      setIsAnalyzing(true);

      // Fotoğrafı Storage'a yükle (feature flag ile kontrol edilir)
      let imageUrl = '';
      if (ENABLE_STORAGE_UPLOAD && imageUri && user?.uid) {
        try {
          console.log('Uploading image for user:', user.uid);
          console.log('Image URI:', imageUri);

          // import edelim
          const { uploadImage } = await import('@/utils/firebase');
          const imageName = `meal_${Date.now()}.jpg`;
          imageUrl = await uploadImage(user.uid, imageUri, imageName);
          console.log('Image uploaded to Storage:', imageUrl);
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          // Upload hatası olsa da devam et
        }
      }

      // Determine meal type based on time
      const hour = new Date().getHours();
      let mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
      if (hour >= 5 && hour < 11) mealType = 'breakfast';
      else if (hour >= 11 && hour < 15) mealType = 'lunch';
      else if (hour >= 17 && hour < 22) mealType = 'dinner';
      else mealType = 'snack';

      // Create meal object from AI analysis
      const analyzedMeal = {
        name: result.food_name,
        calories: result.calories,
        time: new Date().toTimeString().slice(0, 5),
        type: mealType,
        nutrition: {
          protein: result.protein,
          carbohydrates: result.carbs,
          fats: result.fat
        },
        portion: {
          amount: 1,
          unit: 'portion'
        },
        method: 'camera' as const,
        photo: imageUrl || undefined, // Storage URL'ini kullan
        confidence: Math.round(result.confidence_score * 100)
      };

      // Add meal to Firestore via dashboard service
      const addedMeal = await addMeal(analyzedMeal);

      // Reload recent meals
      await loadRecentMeals();

      setIsAnalyzing(false);

      // Detaylı analiz mesajını oluştur
      let message = `🍽️ ${addedMeal.name}\n🔥 ${addedMeal.calories} kcal\n💪 Protein: ${addedMeal.nutrition.protein}g\n🌾 Karbonhidrat: ${addedMeal.nutrition.carbohydrates}g\n🥑 Yağ: ${addedMeal.nutrition.fats}g`;

      // Yeni alanları ekle
      if (result.fiber) {
        message += `\n🌾 Lif: ${result.fiber}g`;
      }
      if (result.sugar) {
        message += `\n🍯 Şeker: ${result.sugar}g`;
      }
      if (result.sodium) {
        message += `\�️ Sodyum: ${result.sodium}mg`;
      }
      if (result.health_score) {
        message += `\n💯 Sağlık Skoru: ${result.health_score}/10`;
      }

      message += `\n📸 Fotoğraf kaydedildi`;
      message += `\n\nGüven Skoru: ${addedMeal.confidence}%`;

      // Alerjenleri ekle
      if (result.allergens && result.allergens.length > 0) {
        message += `\n⚠️ Alerjenler: ${result.allergens.join(', ')}`;
      }

      // İşleme seviyesi
      if (result.processing_level) {
        const levelMap = {
          'unprocessed': 'İşlenmemiş',
          'minimally_processed': 'Az işlenmiş',
          'processed': 'İşlenmiş',
          'ultra_processed': 'Çok işlenmiş'
        };
        message += `\n📊 İşleme Seviyesi: ${levelMap[result.processing_level] || result.processing_level}`;
      }

      // Vitaminler
      if (result.vitamins) {
        const vitamins = Object.entries(result.vitamins)
          .filter(([_, value]) => value && value > 0)
          .map(([key, value]) => `${key}: ${value}`)
          .slice(0, 3); // İlk 3 vitamini göster
        if (vitamins.length > 0) {
          message += `\n🍊 Vitaminler: ${vitamins.join(', ')}`;
        }
      }

      // Öneriler
      if (result.suggestions && result.suggestions.length > 0) {
        const suggestionMap: Record<string, string> = {
          'add_vegetables': 'Daha fazla sebze ekleyin',
          'reduce_salt': 'Tuz miktarını azaltın',
          'choose_lean_protein': 'Yağsız protein tercih edin',
          'add_fiber': 'Lif alımını artırın',
          'portion_control': 'Porsiyon kontrolü yapın'
        };
        const suggestions = result.suggestions
          .map(s => suggestionMap[s] || s)
          .slice(0, 2); // İlk 2 öneriyi göster
        if (suggestions.length > 0) {
          message += `\n💡 Öneriler: ${suggestions.join(', ')}`;
        }
      }

      // Sağlık ipuçları
      if (result.health_tips && result.health_tips.length > 0) {
        message += `\n\n📝 Sağlık İpucu:\n${result.health_tips[0]}`;
      }

      // Instead of showing alert, navigate to food detail screen
      const foodData = {
        name: result.food_name,
        calories: result.calories,
        protein: result.protein,
        carbohydrates: result.carbs,
        fats: result.fat,
        fiber: result.fiber || 0,
        sugar: result.sugar || 0,
        sodium: result.sodium || 0,
        ingredients: result.ingredients || [],
        tags: generateTags(result),
        portion: '1 porsiyon',
        healthScore: result.health_score,
        allergens: result.allergens,
        processingLevel: result.processing_level,
        vitamins: result.vitamins,
        suggestions: result.suggestions,
        healthTips: result.health_tips,
        confidence: Math.round(result.confidence_score * 100),
        imageBase64: imageData,
        imageUri: imageUri,
      };

      // Navigate to food detail screen
      router.push({
        pathname: '/dashboard/food-detail',
        params: {
          foodData: JSON.stringify(foodData),
        },
      });
    } catch (error) {
      setIsAnalyzing(false);
      Alert.alert(
        '❌ Hata',
        'Yemek analizi sırasında bir hata oluştu. Lütfen tekrar deneyin.',
        [{ text: 'Tamam', style: 'default' }]
      );
    }
  };

  // Generate tags based on food analysis
  const generateTags = (result: FoodAnalysisResult): string[] => {
    const tags: string[] = [];

    // Add meal type based on time
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) tags.push('Kahvaltı');
    else if (hour >= 12 && hour < 17) tags.push('Öğle Yemeği');
    else if (hour >= 17 && hour < 22) tags.push('Akşam Yemeği');
    else tags.push('Atıştırmalık');

    // Add health-related tags
    if (result.health_score && result.health_score >= 8) {
      tags.push('Sağlıklı');
    }
    if (result.fiber && result.fiber > 5) {
      tags.push('Lifli');
    }
    if (result.protein && result.protein > 20) {
      tags.push('Proteinli');
    }
    if (result.calories < 200) {
      tags.push('Düşük Kalorili');
    }

    // Add allergen tags
    if (result.allergens && result.allergens.length > 0) {
      tags.push('Alerjen İçerir');
    }

    // Add processing level tags
    if (result.processing_level === 'unprocessed') {
      tags.push('Doğal');
    } else if (result.processing_level === 'ultra_processed') {
      tags.push('İşlenmiş');
    }

    return tags;
  };

  const renderFoodItem = ({ item }: { item: FoodHistoryItem }) => (
    <View key={item.id} style={styles.historyCard}>
      <View style={styles.historyHeader}>
        <View style={styles.foodInfo}>
          <Text style={styles.foodName}>{item.foodName}</Text>
          <Text style={styles.foodTime}>{item.date} • {item.time}</Text>
        </View>
        <View style={styles.confidenceBadge}>
          <Text style={styles.confidenceText}>{item.confidence}%</Text>
        </View>
      </View>
      <View style={styles.nutritionInfo}>
        <View style={styles.nutritionItem}>
          <Text style={[styles.nutritionValue, styles.caloriesMain]}>{item.calories}</Text>
          <Text style={styles.nutritionLabel}>Kalori</Text>
        </View>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{item.protein}g</Text>
          <Text style={styles.nutritionLabel}>Protein</Text>
        </View>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{item.carbs}g</Text>
          <Text style={styles.nutritionLabel}>Karbonhidrat</Text>
        </View>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{item.fat}g</Text>
          <Text style={styles.nutritionLabel}>Yağ</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🤖 AI Yiyecek Analizi</Text>
        <Text style={styles.subtitle}>Yemeklerinizi fotoğraflayarak anında analiz edin</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          {/* İzin Durumu */}
          {(cameraPermission === false || galleryPermission === false) && (
            <View style={styles.permissionAlert}>
              <Ionicons name="warning" size={24} color="#F59E0B" />
              <View style={styles.permissionContent}>
                <Text style={styles.permissionTitle}>İzin Gerekli</Text>
                <Text style={styles.permissionText}>
                  {!cameraPermission && !galleryPermission
                    ? 'Kamera ve Galeri izinleri gerekli'
                    : !cameraPermission
                    ? 'Kamera izni gerekli'
                    : 'Galeri izni gerekli'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={handleRefreshPermissions}
                disabled={isLoadingPermissions}
              >
                {isLoadingPermissions ? (
                  <Ionicons name="sync" size={20} color="#CBD5E1" />
                ) : (
                  <Ionicons name="refresh" size={20} color="#7C3AED" />
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* AI Camera Button */}
          <TouchableOpacity
            style={[
              styles.cameraButton,
              (isAnalyzing || (cameraPermission === false || galleryPermission === false)) &&
              styles.cameraButtonDisabled
            ]}
            onPress={handleCameraPress}
            disabled={isAnalyzing || (cameraPermission === false || galleryPermission === false)}
          >
            <Ionicons name="camera" size={24} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.cameraButtonText}>
              {isLoadingPermissions
                ? 'İzinler Kontrol Ediliyor...'
                : isAnalyzing
                ? 'İşleniyor...'
                : cameraPermission === false || galleryPermission === false
                ? 'İzin Gerekli 📋'
                : '📸 AI ile Analiz Et'}
            </Text>
          </TouchableOpacity>

          {/* AI Features */}
          <View style={styles.aiFeaturesSection}>
            <View style={styles.featureCard}>
              <Ionicons name="bulb" size={24} color="#7C3AED" />
              <Text style={styles.featureTitle}>Akıllı Tanıma</Text>
              <Text style={styles.featureDescription}>Gemini 2.0 Flash ile yiyecekleri otomatik tanı</Text>
            </View>
            <View style={styles.featureCard}>
              <Ionicons name="bar-chart" size={24} color="#10B981" />
              <Text style={styles.featureTitle}>Detaylı Besin</Text>
              <Text style={styles.featureDescription}>Kalori, protein, karbonhidrat, yağ değerleri</Text>
            </View>
            <View style={styles.featureCard}>
              <Ionicons name="shield-checkmark" size={24} color="#F59E0B" />
              <Text style={styles.featureTitle}>Yüksek Doğruluk</Text>
              <Text style={styles.featureDescription}>95+ başarı oranı ile analiz</Text>
            </View>
          </View>

          {/* Quick Add Section */}
          <View style={styles.quickAddSection}>
            <Text style={styles.sectionTitle}>Hızlı Ekle</Text>
            <View style={styles.quickAddGrid}>
              {quickFoods.map((food, index) => (
                <TouchableOpacity key={index} style={styles.quickAddItem}>
                  <Text style={styles.quickAddIcon}>{food.icon}</Text>
                  <Text style={styles.quickAddName}>{food.name}</Text>
                  <Text style={styles.quickAddCalories}>{food.calories} kcal</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Analysis History */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Son Analizler</Text>
              <TouchableOpacity onPress={() => router.push('/dashboard/meals-list')}>
                <Text style={styles.seeAllButton}>Tümünü Gör</Text>
              </TouchableOpacity>
            </View>
            {foodHistory.map((item) => renderFoodItem({ item }))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeRoute="/dashboard/camera" />

      {/* Gemini AI Analyzer Modal */}
      <Modal
        visible={showGeminiAnalyzer}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <GeminiAnalyzer
          onAnalysisComplete={handleAnalysisComplete}
          authToken={user?.uid}
        />
        <TouchableOpacity
          style={styles.closeModalButton}
          onPress={() => setShowGeminiAnalyzer(false)}
        >
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default CameraDashboardScreen;