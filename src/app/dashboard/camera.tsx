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
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDashboard } from '@/hooks/use-dashboard';

const { width } = Dimensions.get('window');

const CameraDashboardScreen = () => {
  const router = useRouter();
  const { addMeal, getRecentMeals } = useDashboard();
  const [foodHistory, setFoodHistory] = useState([]);
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

  // Load recent meals on mount or when dependencies change
  useEffect(() => {
    loadRecentMeals();
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
      ...theme.shadows.lg,
    },
    cameraButtonText: {
      fontSize: 18,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.onPrimary,
    },
    cameraIcon: {
      fontSize: 24,
      marginRight: theme.spacing.sm,
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
  });

  const handleCameraPress = async () => {
    setIsAnalyzing(true);

    try {
      // Simulate AI analysis with sample data
      await new Promise(resolve => setTimeout(resolve, 2000));

      const analyzedMeal = {
        name: 'Mevsim Salata',
        calories: 145,
        time: new Date().toTimeString().slice(0, 5),
        type: 'Öğle Yemeği' as const,
        nutrition: {
          protein: 6,
          carbohydrates: 18,
          fats: 7
        },
        confidence: 92
      };

      // Add meal to Firestore via dashboard service
      const addedMeal = await addMeal(analyzedMeal);

      // Reload recent meals
      await loadRecentMeals();

      setIsAnalyzing(false);
      Alert.alert(
        'Analiz Tamamlandı!',
        `Yemek başarıyla analiz edildi.\n\n🥗 ${addedMeal.name}\nKalori: ${addedMeal.calories} kcal\nGüven: ${addedMeal.confidence}%`,
        [{ text: 'Tamam', style: 'default' }]
      );
    } catch (error) {
      setIsAnalyzing(false);
      Alert.alert(
        'Hata',
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
        <Text style={styles.title}>Akıllı Fotoğraf</Text>
        <Text style={styles.subtitle}>Yemeklerinizi anında analiz edin</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          {/* Camera Button */}
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={handleCameraPress}
            disabled={isAnalyzing}
          >
            <Text style={[styles.cameraButtonText, { flexDirection: 'row', alignItems: 'center' }]}>
              <Text style={styles.cameraIcon}>📸</Text>
              {isAnalyzing ? 'Analiz Ediliyor...' : 'Yemek Çek'}
            </Text>
          </TouchableOpacity>

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
    </SafeAreaView>
  );
};

export default CameraDashboardScreen;