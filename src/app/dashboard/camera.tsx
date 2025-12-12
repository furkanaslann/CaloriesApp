/**
 * CaloriTrack - Dashboard Camera Screen
 * Minimal. Cool. Aesthetic.
 */

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

const CameraDashboardScreen = () => {
  const router = useRouter();
  const { addMeal, getRecentMeals } = useDashboard();
  const { user } = useUser();
  const [foodHistory, setFoodHistory] = useState([]);
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

  // Load recent meals on mount or when dependencies change
  useEffect(() => {
    loadRecentMeals();
    checkPermissions(); // İzinleri kontrol et
  }, [getRecentMeals, loadRecentMeals]);

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

    // Bottom Navigation - Modern style
    bottomNav: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 90,
      backgroundColor: '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: '#E2E8F0',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingBottom: 30,
      paddingHorizontal: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 5,
    },
    navItem: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      paddingVertical: 8,
    },
    navIcon: {
      marginBottom: 4,
    },
    navLabel: {
      fontSize: 12,
      color: '#94A3B8',
      fontWeight: '500',
    },
    navLabelActive: {
      color: '#7C3AED',
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

  const handleAnalysisComplete = async (result: FoodAnalysisResult, imageData?: string) => {
    try {
      setIsAnalyzing(true);

      // Create meal object from AI analysis
      const analyzedMeal = {
        name: result.food_name,
        calories: result.calories,
        time: new Date().toTimeString().slice(0, 5),
        type: 'Öğle Yemeği' as const,
        nutrition: {
          protein: result.protein,
          carbohydrates: result.carbs,
          fats: result.fat
        },
        confidence: Math.round(result.confidence_score * 100),
        ingredients: result.ingredients,
        health_tips: result.health_tips,
        imageBase64: imageData // Base64 fotoğraf verisini ekle
      };

      // Add meal to Firestore via dashboard service
      const addedMeal = await addMeal(analyzedMeal);

      // Reload recent meals
      await loadRecentMeals();

      setIsAnalyzing(false);
      const message = `🍽️ ${addedMeal.name}\n🔥 ${addedMeal.calories} kcal\n💪 Protein: ${addedMeal.nutrition.protein}g\n🌾 Karbonhidrat: ${addedMeal.nutrition.carbohydrates}g\n🥑 Yağ: ${addedMeal.nutrition.fats}g\n📸 Fotoğraf kaydedildi\n\nGüven Skoru: ${addedMeal.confidence}%`;

      Alert.alert(
        '✅ AI Analiz Tamamlandı!',
        message,
        [
          { text: 'Dashboard', onPress: () => router.push('/dashboard') },
          { text: 'Tamam', style: 'default' }
        ]
      );
    } catch (error) {
      setIsAnalyzing(false);
      Alert.alert(
        '❌ Hata',
        'Yemek analizi sırasında bir hata oluştu. Lütfen tekrar deneyin.',
        [{ text: 'Tamam', style: 'default' }]
      );
    }
  };

  const renderFoodItem = ({ item }) => (
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
            <Text style={styles.sectionTitle}>Son Analizler</Text>
            {foodHistory.map((item) => renderFoodItem({ item }))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation - Modern style */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard')}>
          <Ionicons name="home-outline" size={24} color="#94A3B8" style={styles.navIcon} />
          <Text style={styles.navLabel}>Ana Sayfa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="camera" size={24} color="#7C3AED" style={styles.navIcon} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Kamera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard/recipes')}>
          <Ionicons name="restaurant-outline" size={24} color="#94A3B8" style={styles.navIcon} />
          <Text style={styles.navLabel}>Tarifler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard/profile')}>
          <Ionicons name="person-outline" size={24} color="#94A3B8" style={styles.navIcon} />
          <Text style={styles.navLabel}>Profil</Text>
        </TouchableOpacity>
      </View>

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