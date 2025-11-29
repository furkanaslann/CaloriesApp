/**
 * CaloriTrack - Dashboard Camera Screen
 * Minimal. Cool. Aesthetic.
 */

import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const CameraDashboardScreen = () => {
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

  // Sample food analysis history
  const foodHistory = [
    {
      id: '1',
      foodName: 'Çoban Salata',
      calories: 185,
      protein: 8,
      carbs: 12,
      fat: 14,
      time: '12:30',
      date: 'Bugün',
      confidence: 95
    },
    {
      id: '2',
      foodName: 'Izgara Tavuk',
      calories: 320,
      protein: 45,
      carbs: 8,
      fat: 12,
      time: '19:45',
      date: 'Dün',
      confidence: 88
    },
    {
      id: '3',
      foodName: 'Yulaf Ezmesi',
      calories: 280,
      protein: 12,
      carbs: 35,
      fat: 8,
      time: '08:15',
      date: 'Dün',
      confidence: 92
    },
    {
      id: '4',
      foodName: 'Mevsim Salata',
      calories: 145,
      protein: 6,
      carbs: 18,
      fat: 7,
      time: '13:00',
      date: '2 gün önce',
      confidence: 90
    },
  ];

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
      paddingBottom: theme.spacing['2xl'],
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
  });

  const handleCameraPress = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      Alert.alert(
        'Analiz Tamamlandı!',
        'Yemek başarıyla analiz edildi.\n\n🥗 Mevsim Salata\nKalori: 145 kcal\nGüven: %92',
        [{ text: 'Tamam', style: 'default' }]
      );
    }, 2000);
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
    </SafeAreaView>
  );
};

export default CameraDashboardScreen;