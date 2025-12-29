/**
 * CaloriTrack - Dashboard Meals Screen
 * Minimal. Cool. Aesthetic.
 */

import { BORDER_RADIUS, COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  RefreshControl,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDashboard } from '@/hooks/use-dashboard';

const { width } = Dimensions.get('window');

const MealsScreen = () => {
  const router = useRouter();
  const { getRecentMeals } = useDashboard();
  const [allMeals, setAllMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'Tümü', icon: 'restaurant-outline' },
    { id: 'breakfast', label: 'Kahvaltı', icon: 'sunny-outline' },
    { id: 'lunch', label: 'Öğle', icon: 'partly-sunny-outline' },
    { id: 'dinner', label: 'Akşam', icon: 'moon-outline' },
    { id: 'snack', label: 'Atıştırmalık', icon: 'nutrition-outline' },
  ];

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

  const loadAllMeals = useCallback(async () => {
    try {
      setLoading(true);
      // Get all meals (increase limit to get more data)
      const meals = await getRecentMeals(100);

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
        type: meal.type,
        confidence: meal.confidence || 0,
        ingredients: meal.ingredients || [],
        health_tips: meal.health_tips || []
      }));

      setAllMeals(transformedMeals);
      setFilteredMeals(transformedMeals);
    } catch (error) {
      console.error('Error loading all meals:', error);
      Alert.alert('Hata', 'Yiyecekler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [getRecentMeals]);

  useEffect(() => {
    loadAllMeals();
  }, [loadAllMeals]);

  // Filter meals based on search query and selected filter
  useEffect(() => {
    let filtered = allMeals;

    // Apply type filter
    if (selectedFilter !== 'all') {
      const typeMap = {
        breakfast: 'Kahvaltı',
        lunch: 'Öğle Yemeği',
        dinner: 'Akşam Yemeği',
        snack: 'Atıştırmalık'
      };
      filtered = filtered.filter(meal => meal.type === typeMap[selectedFilter]);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(meal =>
        meal.foodName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMeals(filtered);
  }, [allMeals, searchQuery, selectedFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllMeals();
    setRefreshing(false);
  };

  const getMealIcon = (type: string) => {
    switch (type) {
      case 'Kahvaltı': return 'sunny-outline';
      case 'Öğle Yemeği': return 'partly-sunny-outline';
      case 'Akşam Yemeği': return 'moon-outline';
      default: return 'nutrition-outline';
    }
  };

  const getMealColor = (type: string) => {
    switch (type) {
      case 'Kahvaltı': return '#F59E0B';
      case 'Öğle Yemeği': return '#10B981';
      case 'Akşam Yemeği': return '#7C3AED';
      default: return '#EC4899';
    }
  };

  const getTotalStats = () => {
    return filteredMeals.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const totalStats = getTotalStats();

  const renderMealItem = ({ item }) => (
    <View style={styles.mealCard}>
      <View style={styles.mealHeader}>
        <View style={styles.mealLeft}>
          <View style={[styles.mealIconContainer, { backgroundColor: getMealColor(item.type) + '20' }]}>
            <Ionicons name={getMealIcon(item.type)} size={24} color={getMealColor(item.type)} />
          </View>
          <View style={styles.mealInfo}>
            <Text style={styles.mealName}>{item.foodName}</Text>
            <View style={styles.mealMeta}>
              <Text style={styles.mealTime}>{item.date}</Text>
              <Text style={styles.mealType}>{item.type}</Text>
            </View>
            {item.ingredients && item.ingredients.length > 0 && (
              <View style={styles.ingredientsContainer}>
                <Text style={styles.ingredientsLabel}>Malzemeler:</Text>
                <Text style={styles.ingredientsText}>{item.ingredients.slice(0, 3).join(', ')}
                  {item.ingredients.length > 3 && '...'}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.mealRight}>
          {item.confidence && (
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>{item.confidence}%</Text>
            </View>
          )}
          <Text style={styles.mealCalories}>{item.calories} kcal</Text>
        </View>
      </View>

      <View style={styles.nutritionInfo}>
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

  const renderFilterItem = (filter) => (
    <TouchableOpacity
      key={filter.id}
      style={[
        styles.filterItem,
        selectedFilter === filter.id && styles.filterItemActive
      ]}
      onPress={() => setSelectedFilter(filter.id)}
    >
      <Ionicons
        name={filter.icon}
        size={20}
        color={selectedFilter === filter.id ? '#FFFFFF' : COLORS.textSecondary}
      />
      <Text style={[
        styles.filterText,
        selectedFilter === filter.id && styles.filterTextActive
      ]}>
        {filter.label}
      </Text>
    </TouchableOpacity>
  );

  // Dynamic styles using updated theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.semanticColors.background.primary,
    },
    header: {
      paddingHorizontal: theme.spacing['2xl'],
      paddingTop: theme.spacing['4xl'],
      paddingBottom: theme.spacing['2xl'],
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: theme.semanticColors.border.primary,
    },
    title: {
      fontSize: theme.textStyles.onboardingTitle?.fontSize || 30,
      fontWeight: (theme.textStyles.onboardingTitle?.fontWeight || '600') as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.sm,
    },
    statsContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.semanticColors.background.primary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      padding: theme.spacing.md,
      alignItems: 'center',
    },
    statValue: {
      fontSize: 20,
      fontWeight: '700' as TextStyle['fontWeight'],
      color: theme.colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: theme.semanticColors.text.secondary,
    },
    searchSection: {
      paddingHorizontal: theme.spacing['2xl'],
      paddingVertical: theme.spacing.md,
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: theme.semanticColors.border.primary,
    },
    searchInput: {
      backgroundColor: '#F1F5F9',
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      fontSize: 16,
      color: theme.semanticColors.text.primary,
    },
    filterSection: {
      paddingHorizontal: theme.spacing['2xl'],
      paddingVertical: theme.spacing.md,
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: theme.semanticColors.border.primary,
    },
    filterContainer: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    filterItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: '#F1F5F9',
      gap: 6,
    },
    filterItemActive: {
      backgroundColor: theme.colors.primary,
    },
    filterText: {
      fontSize: 14,
      fontWeight: '500' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.secondary,
    },
    filterTextActive: {
      color: '#FFFFFF',
    },
    listContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing['2xl'],
    },
    mealCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    mealHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.md,
    },
    mealLeft: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    mealIconContainer: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    mealInfo: {
      flex: 1,
    },
    mealName: {
      fontSize: 16,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: 4,
    },
    mealMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginBottom: 6,
    },
    mealTime: {
      fontSize: 12,
      color: theme.semanticColors.text.tertiary,
    },
    mealType: {
      fontSize: 12,
      color: theme.semanticColors.text.secondary,
      backgroundColor: '#F1F5F9',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    ingredientsContainer: {
      marginTop: 4,
    },
    ingredientsLabel: {
      fontSize: 12,
      color: theme.semanticColors.text.tertiary,
      marginBottom: 2,
    },
    ingredientsText: {
      fontSize: 12,
      color: theme.semanticColors.text.secondary,
    },
    mealRight: {
      alignItems: 'flex-end',
    },
    confidenceBadge: {
      backgroundColor: theme.colors.success + '20',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
      marginBottom: 4,
    },
    confidenceText: {
      fontSize: 10,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.colors.success,
    },
    mealCalories: {
      fontSize: 18,
      fontWeight: '700' as TextStyle['fontWeight'],
      color: theme.colors.primary,
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
      marginBottom: 2,
    },
    nutritionLabel: {
      fontSize: 10,
      color: theme.semanticColors.text.tertiary,
    },

    // Bottom Navigation
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📊 Yiyecek Geçmişi</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{filteredMeals.length}</Text>
            <Text style={styles.statLabel}>Öğün</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalStats.calories}</Text>
            <Text style={styles.statLabel}>Toplam Kalori</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{Math.round(totalStats.calories / filteredMeals.length || 0)}</Text>
            <Text style={styles.statLabel}>Ortalama</Text>
          </View>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Yiyecek ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#64748B"
        />
      </View>

      {/* Filters */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterContainer}>
            {filters.map(renderFilterItem)}
          </View>
        </ScrollView>
      </View>

      {/* Meals List */}
      <View style={styles.listContainer}>
        <FlatList
          data={filteredMeals}
          renderItem={renderMealItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Ionicons name="restaurant-outline" size={48} color="#CBD5E1" />
              <Text style={{ fontSize: 16, color: '#64748B', marginTop: 16, textAlign: 'center' }}>
                {searchQuery ? 'Arama kriterinize uygun yiyecek bulunamadı' : 'Henüz yiyecek kaydı yok'}
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard')}>
          <Ionicons name="home-outline" size={24} color="#94A3B8" style={styles.navIcon} />
          <Text style={styles.navLabel}>Ana Sayfa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard/camera')}>
          <Ionicons name="camera-outline" size={24} color="#94A3B8" style={styles.navIcon} />
          <Text style={styles.navLabel}>Kamera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/recipes')}>
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

export default MealsScreen;