/**
 * CaloriTrack - Recipes Screen
 * Minimal. Cool. Aesthetic.
 * Figma Design: https://www.figma.com/design/V4OjFZYz1hhZdeWSgZyYtu/Calories-Pages?node-id=47-9
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Recipe data
const breakfastRecipes = [
  {
    id: '1',
    name: 'Raw Vegan Key Lime Mousse',
    time: '18 min',
    calories: '233 Cal',
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    name: 'Avocado Toast',
    time: '10 min',
    calories: '320 Cal',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    name: 'Berry Smoothie Bowl',
    time: '8 min',
    calories: '185 Cal',
    image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400&h=300&fit=crop',
  },
];

const lunchRecipes = [
  {
    id: '4',
    name: 'Quinoa Salad Bowl',
    time: '25 min',
    calories: '410 Cal',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
  },
  {
    id: '5',
    name: 'Grilled Chicken Wrap',
    time: '20 min',
    calories: '380 Cal',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
  },
  {
    id: '6',
    name: 'Mediterranean Salad',
    time: '15 min',
    calories: '295 Cal',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
  },
];

const RecipesScreen = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [showMoreDietInfo, setShowMoreDietInfo] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Search history state
  const [searchHistory, setSearchHistory] = useState<string[]>([
    'Avocado Toast',
    'Quinoa Salad',
    'Smoothie Bowl',
  ]);
  const popularSearches = [
    'Chicken',
    'Salad',
    'Pasta',
    'Soup',
    'Vegan',
    'Keto',
  ];

  // Filter states
  const [selectedMealType, setSelectedMealType] = useState<string>('all');
  const [selectedDiet, setSelectedDiet] = useState<string[]>([]);
  const [selectedCalories, setSelectedCalories] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Active filters state
  const [activeFilters, setActiveFilters] = useState({
    mealType: 'all',
    diet: [] as string[],
    calories: '',
    time: '',
    search: '',
  });

  // Filter options
  const mealTypes = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];
  const diets = ['Gluten-Free', 'Keto', 'Low-Carb', 'High-Protein', 'Dairy-Free'];
  const calorieRanges = ['0-200 Cal', '200-400 Cal', '400-600 Cal', '600+ Cal'];
  const timeRanges = ['0-15 min', '15-30 min', '30-60 min', '60+ min'];

  const toggleDiet = (diet: string) => {
    if (selectedDiet.includes(diet)) {
      setSelectedDiet(selectedDiet.filter(d => d !== diet));
    } else {
      setSelectedDiet([...selectedDiet, diet]);
    }
  };

  // Apply filters function
  const applyFilters = () => {
    setActiveFilters({
      mealType: selectedMealType,
      diet: selectedDiet,
      calories: selectedCalories,
      time: selectedTime,
      search: searchText,
    });
    setShowFilterModal(false);
  };

  // Handle search submit
  const handleSearchSubmit = () => {
    if (searchText.trim()) {
      // Add to search history if not already exists
      setSearchHistory(prev => {
        const filtered = prev.filter(item => item.toLowerCase() !== searchText.toLowerCase());
        return [searchText, ...filtered].slice(0, 5);
      });
    }
    setActiveFilters(prev => ({ ...prev, search: searchText }));
    setIsSearchFocused(false);
  };

  // Handle search text change - filter on every keystroke
  const handleSearchChange = (text: string) => {
    setSearchText(text);
    setActiveFilters(prev => ({ ...prev, search: text }));
  };

  // Handle search focus
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  // Handle search history item press
  const handleSearchHistoryPress = (term: string) => {
    setSearchText(term);
    setActiveFilters(prev => ({ ...prev, search: term }));
    setIsSearchFocused(false);
  };

  // Clear search history
  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  // Clear current search
  const clearSearch = () => {
    setSearchText('');
    setActiveFilters(prev => ({ ...prev, search: '' }));
  };

  // Filter recipes based on active filters
  const filterRecipes = (recipes: typeof breakfastRecipes) => {
    return recipes.filter(recipe => {
      // Search filter
      if (activeFilters.search && !recipe.name.toLowerCase().includes(activeFilters.search.toLowerCase())) {
        return false;
      }

      // Meal type filter
      if (activeFilters.mealType !== 'all') {
        // This would need mealType property in recipe data
        // For now, skip this filter
      }

      // Calories filter
      if (activeFilters.calories) {
        const calNum = parseInt(recipe.calories);
        if (activeFilters.calories === '0-200 Cal' && calNum > 200) return false;
        if (activeFilters.calories === '200-400 Cal' && (calNum < 200 || calNum > 400)) return false;
        if (activeFilters.calories === '400-600 Cal' && (calNum < 400 || calNum > 600)) return false;
        if (activeFilters.calories === '600+ Cal' && calNum < 600) return false;
      }

      // Time filter
      if (activeFilters.time) {
        const timeNum = parseInt(recipe.time);
        if (activeFilters.time === '0-15 min' && timeNum > 15) return false;
        if (activeFilters.time === '15-30 min' && (timeNum < 15 || timeNum > 30)) return false;
        if (activeFilters.time === '30-60 min' && (timeNum < 30 || timeNum > 60)) return false;
        if (activeFilters.time === '60+ min' && timeNum < 60) return false;
      }

      return true;
    });
  };

  const filteredBreakfastRecipes = filterRecipes(breakfastRecipes);
  const filteredLunchRecipes = filterRecipes(lunchRecipes);

  // Combine all recipes for filter results
  const allRecipes = [...breakfastRecipes, ...lunchRecipes];
  const filteredRecipes = filterRecipes(allRecipes);

  // Check if user is searching or filtering
  const hasActiveFilters = activeFilters.search ||
                          activeFilters.mealType !== 'all' ||
                          activeFilters.calories ||
                          activeFilters.time ||
                          activeFilters.diet.length > 0;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    // Header
    header: {
      backgroundColor: '#E6F3FF',
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 16,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    headerLogo: {
      fontSize: 14,
      fontWeight: '500',
      color: '#333333',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: '#333333',
      flex: 1,
      textAlign: 'center',
    },
    headerIcon: {
      width: 24,
      height: 24,
    },
    // Tab Navigation
    tabNav: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    tabItem: {
      marginRight: 24,
    },
    tabText: {
      fontSize: 16,
      fontWeight: '400',
      color: '#666666',
    },
    tabTextActive: {
      fontWeight: '700',
      color: '#007AFF',
    },
    tabWithCheck: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    checkIcon: {
      width: 16,
      height: 16,
    },
    // Search Bar
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    searchIcon: {
      width: 20,
      height: 20,
      marginRight: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: '#333333',
    },
    filterIcon: {
      width: 20,
      height: 20,
    },
    // Main Content
    scrollContent: {
      paddingBottom: 100,
    },
    // Featured Banner
    featuredBanner: {
      marginHorizontal: 16,
      marginTop: 16,
      height: 180,
      borderRadius: 16,
      overflow: 'hidden',
    },
    bannerImage: {
      width: '100%',
      height: '100%',
    },
    bannerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.35)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    bannerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    wreathIcon: {
      width: 32,
      height: 32,
    },
    bannerTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: '#FFFFFF',
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    bannerSubtitle: {
      fontSize: 14,
      color: '#FFFFFF',
      marginTop: 4,
      textAlign: 'center',
    },
    // Diet Info Section
    dietInfoSection: {
      paddingHorizontal: 16,
      marginTop: 24,
    },
    dietInfoTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#333333',
      marginBottom: 8,
    },
    dietInfoDescription: {
      fontSize: 14,
      color: '#666666',
      lineHeight: 20,
      marginBottom: 8,
    },
    moreButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    moreText: {
      fontSize: 14,
      color: '#007AFF',
    },
    moreIcon: {
      width: 16,
      height: 16,
    },
    // Meal Category Section
    mealSection: {
      marginTop: 24,
    },
    mealSectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginBottom: 12,
    },
    mealSectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#333333',
    },
    mealMoreLink: {
      fontSize: 14,
      color: '#007AFF',
    },
    // Recipe Cards Row
    recipeCardsRow: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      gap: 12,
    },
    // Recipe Card
    recipeCard: {
      width: (width - 48) / 2,
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      overflow: 'hidden',
      marginBottom: 16,
    },
    cardImageContainer: {
      position: 'relative',
    },
    cardImage: {
      width: '100%',
      height: 140,
      backgroundColor: '#F5F5F5',
    },
    favoriteButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: 32,
      height: 32,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    cardContent: {
      padding: 14,
    },
    cardMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    cardTime: {
      fontSize: 12,
      color: '#64748B',
      fontWeight: '500',
    },
    cardCalories: {
      fontSize: 12,
      color: '#64748B',
      fontWeight: '500',
    },
    cardTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: '#1E293B',
      lineHeight: 20,
    },
    // Grid Results Container
    resultsGrid: {
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    resultsEmpty: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
      paddingVertical: 60,
    },
    resultsEmptyIcon: {
      fontSize: 48,
      marginBottom: 16,
    },
    resultsEmptyTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1E293B',
      marginBottom: 8,
    },
    resultsEmptyText: {
      fontSize: 14,
      color: '#64748B',
      textAlign: 'center',
      lineHeight: 20,
    },
    resultsTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#1E293B',
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 12,
    },
    // Search Focus Overlay
    searchOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      zIndex: 100,
    },
    searchOverlayContent: {
      flex: 1,
      paddingTop: 16,
    },
    searchHistorySection: {
      paddingHorizontal: 16,
      marginBottom: 24,
    },
    searchHistoryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    searchHistoryTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1E293B',
    },
    clearHistoryButton: {
      fontSize: 14,
      color: '#7C3AED',
      fontWeight: '500',
    },
    searchHistoryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: '#F8FAFC',
      borderRadius: 12,
      marginBottom: 8,
    },
    searchHistoryIcon: {
      marginRight: 12,
    },
    searchHistoryText: {
      fontSize: 15,
      color: '#1E293B',
      flex: 1,
    },
    removeHistoryItem: {
      padding: 4,
    },
    popularSearchesSection: {
      paddingHorizontal: 16,
      marginBottom: 24,
    },
    popularSearchTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1E293B',
      marginBottom: 16,
    },
    popularSearchTags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    popularSearchTag: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: '#F1F5F9',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#E2E8F0',
    },
    popularSearchTagText: {
      fontSize: 14,
      color: '#475569',
      fontWeight: '500',
    },
    searchOverlayHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#E2E8F0',
      marginBottom: 16,
    },
    searchOverlayBackButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    searchOverlayInputContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F1F5F9',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    searchOverlayInput: {
      flex: 1,
      fontSize: 16,
      color: '#1E293B',
    },
    searchOverlayClearButton: {
      padding: 4,
    },
    noHistoryText: {
      fontSize: 14,
      color: '#94A3B8',
      textAlign: 'center',
      paddingVertical: 24,
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
    // Filter Modal
    filterModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    filterModalContent: {
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingBottom: 34,
      maxHeight: '80%',
    },
    filterModalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#F1F5F9',
    },
    filterModalTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#1E293B',
    },
    filterModalClose: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#F1F5F9',
      justifyContent: 'center',
      alignItems: 'center',
    },
    filterModalScroll: {
      paddingHorizontal: 24,
      paddingTop: 20,
    },
    // Filter Section
    filterSection: {
      marginBottom: 24,
    },
    filterSectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1E293B',
      marginBottom: 12,
    },
    // Filter Tags - Horizontal Scroll
    filterTagsScroll: {
      flexDirection: 'row',
      gap: 8,
    },
    filterTag: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: '#F8FAFC',
      borderWidth: 1,
      borderColor: '#E2E8F0',
    },
    filterTagSelected: {
      backgroundColor: '#007AFF',
      borderColor: '#007AFF',
    },
    filterTagText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#64748B',
    },
    filterTagTextSelected: {
      color: '#FFFFFF',
    },
    // Checkbox Items
    checkboxItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: '#F8FAFC',
      borderRadius: 12,
      marginBottom: 8,
    },
    checkboxItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    checkboxDot: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#CBD5E1',
    },
    checkboxDotSelected: {
      backgroundColor: '#007AFF',
      borderColor: '#007AFF',
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxDotInner: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#FFFFFF',
    },
    checkboxText: {
      fontSize: 15,
      color: '#1E293B',
    },
    // Radio Items
    radioItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: '#F8FAFC',
      borderRadius: 12,
      marginBottom: 8,
    },
    radioCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#CBD5E1',
    },
    radioCircleSelected: {
      backgroundColor: '#007AFF',
      borderColor: '#007AFF',
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioCircleInner: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#FFFFFF',
    },
    // Apply Button
    applyButtonContainer: {
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 16,
      borderTopWidth: 1,
      borderTopColor: '#F1F5F9',
    },
    applyButton: {
      backgroundColor: '#007AFF',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    applyButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });

  const renderRecipeCard = (recipe: typeof breakfastRecipes[0]) => (
    <TouchableOpacity
      key={recipe.id}
      style={styles.recipeCard}
      onPress={() => router.push(`/recipes/${recipe.id}` as any)}
      activeOpacity={0.9}
    >
      <View style={styles.cardImageContainer}>
        <Image source={{ uri: recipe.image }} style={styles.cardImage} />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation();
            // TODO: Toggle favorite
          }}
        >
          <Ionicons name="star-outline" size={18} color="#FFD700" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardMeta}>
          <Text style={styles.cardTime}>{recipe.time}</Text>
          <Text style={styles.cardCalories}>{recipe.calories}</Text>
        </View>
        <Text style={styles.cardTitle} numberOfLines={2}>{recipe.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.resultsEmpty}>
      <Text style={styles.resultsEmptyIcon}>🍽️</Text>
      <Text style={styles.resultsEmptyTitle}>No Recipes Found</Text>
      <Text style={styles.resultsEmptyText}>
        Try adjusting your filters or search terms to find recipes.
      </Text>
    </View>
  );

  // Render search focus overlay
  const renderSearchOverlay = () => (
    <Modal
      visible={isSearchFocused}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setIsSearchFocused(false)}
    >
      <SafeAreaView style={styles.searchOverlay} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Search Overlay Header */}
        <View style={styles.searchOverlayHeader}>
          <TouchableOpacity
            style={styles.searchOverlayBackButton}
            onPress={() => setIsSearchFocused(false)}
          >
            <Ionicons name="chevron-down" size={24} color="#1E293B" />
          </TouchableOpacity>
          <View style={styles.searchOverlayInputContainer}>
            <Ionicons name="search" size={20} color="#94A3B8" style={{ marginRight: 12 }} />
            <TextInput
              style={styles.searchOverlayInput}
              placeholder="Search for recipes"
              placeholderTextColor="#94A3B8"
              value={searchText}
              onChangeText={handleSearchChange}
              onSubmitEditing={handleSearchSubmit}
              autoFocus={true}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity style={styles.searchOverlayClearButton} onPress={clearSearch}>
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Search History & Popular Searches */}
        <ScrollView
          style={styles.searchOverlayContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Recent Searches */}
          {searchHistory.length > 0 && (
            <View style={styles.searchHistorySection}>
              <View style={styles.searchHistoryHeader}>
                <Text style={styles.searchHistoryTitle}>Recent Searches</Text>
                <TouchableOpacity onPress={clearSearchHistory}>
                  <Text style={styles.clearHistoryButton}>Clear All</Text>
                </TouchableOpacity>
              </View>
              {searchHistory.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.searchHistoryItem}
                  onPress={() => handleSearchHistoryPress(item)}
                >
                  <Ionicons name="time-outline" size={18} color="#94A3B8" style={styles.searchHistoryIcon} />
                  <Text style={styles.searchHistoryText}>{item}</Text>
                  <TouchableOpacity
                    style={styles.removeHistoryItem}
                    onPress={(e) => {
                      e.stopPropagation();
                      setSearchHistory(prev => prev.filter((_, i) => i !== index));
                    }}
                  >
                    <Ionicons name="close" size={16} color="#CBD5E1" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {searchHistory.length === 0 && (
            <View style={styles.searchHistorySection}>
              <Text style={styles.searchHistoryTitle}>Recent Searches</Text>
              <Text style={styles.noHistoryText}>No recent searches</Text>
            </View>
          )}

          {/* Popular Searches */}
          <View style={styles.popularSearchesSection}>
            <Text style={styles.popularSearchTitle}>Popular Searches</Text>
            <View style={styles.popularSearchTags}>
              {popularSearches.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.popularSearchTag}
                  onPress={() => handleSearchHistoryPress(item)}
                >
                  <Text style={styles.popularSearchTagText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#E6F3FF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Recipes</Text>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="star" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabNav}>
          <TouchableOpacity style={styles.tabItem}>
            <Text style={styles.tabTextActive}>Recipes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <View style={styles.tabWithCheck}>
              <Ionicons name="checkmark-circle" size={16} color="#007AFF" />
              <Text style={styles.tabText}>Added to Favorites</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for recipes"
            placeholderTextColor="#999999"
            value={searchText}
            onChangeText={handleSearchChange}
            onFocus={handleSearchFocus}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity style={{ padding: 4 }} onPress={clearSearch}>
              <Ionicons name="close-circle" size={18} color="#999999" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.filterIcon} onPress={() => setShowFilterModal(true)}>
            <Ionicons name="options-outline" size={20} color="#999999" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      {hasActiveFilters ? (
        // Filtered Results - Grid Layout
        <View style={{ flex: 1 }}>
          <Text style={styles.resultsTitle}>
            {filteredRecipes.length} {filteredRecipes.length === 1 ? 'Recipe' : 'Recipes'} Found
          </Text>
          {filteredRecipes.length > 0 ? (
            <FlatList
              data={filteredRecipes}
              renderItem={({ item }) => renderRecipeCard(item)}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={{ gap: 12 }}
              contentContainerStyle={styles.resultsGrid}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            renderEmptyState()
          )}
        </View>
      ) : (
        // Default Layout - Featured Banner + Meal Sections
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Featured Banner */}
          <View style={styles.featuredBanner}>
            <ImageBackground
              source={{ uri: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=400&fit=crop' }}
              style={styles.bannerImage}
            >
              <View style={styles.bannerOverlay}>
                <View style={styles.bannerContent}>
                  <Ionicons name="leaf" size={28} color="#FFFFFF" style={styles.wreathIcon} />
                  <View>
                    <Text style={styles.bannerTitle}>Gluten-Free</Text>
                    <Text style={styles.bannerSubtitle}>Weekly Selected</Text>
                  </View>
                  <Ionicons name="leaf" size={28} color="#FFFFFF" style={styles.wreathIcon} />
                </View>
              </View>
            </ImageBackground>
          </View>

          {/* Diet Info Section */}
          <View style={styles.dietInfoSection}>
            <Text style={styles.dietInfoTitle}>Gluten-free & Losing Weight</Text>
            <Text style={styles.dietInfoDescription}>
              {showMoreDietInfo
                ? 'This gluten-free diet includes fruits, vegetables, meat, dairy, and grains like rice and quinoa. It can aid in weight loss by reducing processed foods and focusing on whole, natural ingredients. Many people report increased energy and improved digestion.'
                : 'This gluten-free diet includes fruits, vegetables, meat, dairy, and grains like rice and quinoa. It can aid...'}
            </Text>
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() => setShowMoreDietInfo(!showMoreDietInfo)}
            >
              <Text style={styles.moreText}>{showMoreDietInfo ? 'Less' : 'More'}</Text>
              <Ionicons
                name={showMoreDietInfo ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#007AFF"
              />
            </TouchableOpacity>
          </View>

          {/* Breakfast Section */}
          <View style={styles.mealSection}>
            <View style={styles.mealSectionHeader}>
              <Text style={styles.mealSectionTitle}>Breakfast</Text>
              <TouchableOpacity>
                <Text style={styles.mealMoreLink}>More</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recipeCardsRow}
            >
              {filteredBreakfastRecipes.length > 0 ? (
                filteredBreakfastRecipes.map(renderRecipeCard)
              ) : (
                <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
                  <Text style={{ fontSize: 14, color: '#64748B' }}>No recipes found</Text>
                </View>
              )}
            </ScrollView>
          </View>

          {/* Lunch Section */}
          <View style={styles.mealSection}>
            <View style={styles.mealSectionHeader}>
              <Text style={styles.mealSectionTitle}>Lunch</Text>
              <TouchableOpacity>
                <Text style={styles.mealMoreLink}>More</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recipeCardsRow}
            >
              {filteredLunchRecipes.length > 0 ? (
                filteredLunchRecipes.map(renderRecipeCard)
              ) : (
                <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
                  <Text style={{ fontSize: 14, color: '#64748B' }}>No recipes found</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </ScrollView>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard')}>
          <Ionicons name="home" size={24} color="#94A3B8" style={styles.navIcon} />
          <Text style={styles.navLabel}>Ana Sayfa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard/camera')}>
          <Ionicons name="camera-outline" size={24} color="#94A3B8" style={styles.navIcon} />
          <Text style={styles.navLabel}>Kamera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="restaurant-outline" size={24} color="#7C3AED" style={styles.navIcon} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Tarifler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard/profile')}>
          <Ionicons name="person-outline" size={24} color="#94A3B8" style={styles.navIcon} />
          <Text style={styles.navLabel}>Profil</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.filterModalOverlay}>
          <View style={styles.filterModalContent}>
            {/* Header */}
            <View style={styles.filterModalHeader}>
              <Text style={styles.filterModalTitle}>Filters</Text>
              <TouchableOpacity
                style={styles.filterModalClose}
                onPress={() => setShowFilterModal(false)}
              >
                <Ionicons name="close" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView style={styles.filterModalScroll} showsVerticalScrollIndicator={false}>
              {/* Meal Type */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Meal Type</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.filterTagsScroll}>
                    {mealTypes.map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.filterTag,
                          selectedMealType === type.toLowerCase() && styles.filterTagSelected,
                        ]}
                        onPress={() => setSelectedMealType(type.toLowerCase())}
                      >
                        <Text
                          style={[
                            styles.filterTagText,
                            selectedMealType === type.toLowerCase() && styles.filterTagTextSelected,
                          ]}
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Diet - Checkboxes */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Diet</Text>
                {diets.map((diet) => (
                  <TouchableOpacity
                    key={diet}
                    style={styles.checkboxItem}
                    onPress={() => toggleDiet(diet)}
                  >
                    <View style={styles.checkboxItemLeft}>
                      <View
                        style={[
                          styles.checkboxDot,
                          selectedDiet.includes(diet) && styles.checkboxDotSelected,
                        ]}
                      >
                        {selectedDiet.includes(diet) && (
                          <View style={styles.checkboxDotInner} />
                        )}
                      </View>
                      <Text style={styles.checkboxText}>{diet}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Calories - Radio */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Calories</Text>
                {calorieRanges.map((range) => (
                  <TouchableOpacity
                    key={range}
                    style={styles.radioItem}
                    onPress={() => setSelectedCalories(range)}
                  >
                    <Text style={styles.checkboxText}>{range}</Text>
                    <View
                      style={[
                        styles.radioCircle,
                        selectedCalories === range && styles.radioCircleSelected,
                      ]}
                    >
                      {selectedCalories === range && <View style={styles.radioCircleInner} />}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Time - Radio */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Time</Text>
                {timeRanges.map((range) => (
                  <TouchableOpacity
                    key={range}
                    style={styles.radioItem}
                    onPress={() => setSelectedTime(range)}
                  >
                    <Text style={styles.checkboxText}>{range}</Text>
                    <View
                      style={[
                        styles.radioCircle,
                        selectedTime === range && styles.radioCircleSelected,
                      ]}
                    >
                      {selectedTime === range && <View style={styles.radioCircleInner} />}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Apply Button */}
            <View style={styles.applyButtonContainer}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={applyFilters}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Search Focus Overlay */}
      {renderSearchOverlay()}
    </SafeAreaView>
  );
};

export default RecipesScreen;
