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

  // Filter states
  const [selectedMealType, setSelectedMealType] = useState<string>('all');
  const [selectedDiet, setSelectedDiet] = useState<string[]>([]);
  const [selectedCalories, setSelectedCalories] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

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
      width: (width - 64) / 3,
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      overflow: 'hidden',
    },
    cardImageContainer: {
      position: 'relative',
    },
    cardImage: {
      width: '100%',
      height: 90,
      backgroundColor: '#F5F5F5',
    },
    favoriteButton: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 24,
      height: 24,
    },
    cardContent: {
      padding: 10,
    },
    cardMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    cardTime: {
      fontSize: 11,
      color: '#999999',
    },
    cardCalories: {
      fontSize: 11,
      color: '#999999',
    },
    cardTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: '#333333',
      lineHeight: 16,
    },
    // Bottom Navigation
    bottomNav: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 70,
      backgroundColor: '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: '#E5E5E5',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingBottom: 10,
      paddingHorizontal: 20,
    },
    navItem: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    navIcon: {
      marginBottom: 4,
    },
    navLabel: {
      fontSize: 12,
      color: '#999999',
      fontWeight: '500',
    },
    navLabelActive: {
      color: '#007AFF',
    },
    // Camera Button
    cameraButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#007AFF',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: -20,
      shadowColor: '#007AFF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    cameraIcon: {
      width: 24,
      height: 24,
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
      onPress={() => router.push(`/dashboard/food-detail?id=${recipe.id}` as any)}
      activeOpacity={0.9}
    >
      <View style={styles.cardImageContainer}>
        <Image source={{ uri: recipe.image }} style={styles.cardImage} />
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="star-outline" size={16} color="#FFD700" />
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
            onChangeText={setSearchText}
          />
          <TouchableOpacity style={styles.filterIcon} onPress={() => setShowFilterModal(true)}>
            <Ionicons name="options-outline" size={20} color="#999999" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
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
            {breakfastRecipes.map(renderRecipeCard)}
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
            {lunchRecipes.map(renderRecipeCard)}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/dashboard')}
        >
          <Ionicons name="stats-chart-outline" size={24} color="#999999" style={styles.navIcon} />
          <Text style={styles.navLabel}>Tracker</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/dashboard')}
        >
          <Ionicons name="calendar-outline" size={24} color="#999999" style={styles.navIcon} />
          <Text style={styles.navLabel}>Plans</Text>
        </TouchableOpacity>

        {/* Camera Button */}
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={() => router.push('/dashboard/camera')}
        >
          <Ionicons name="camera" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="restaurant" size={24} color="#007AFF" style={styles.navIcon} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Recipes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/dashboard/profile')}
        >
          <Ionicons name="person-outline" size={24} color="#999999" style={styles.navIcon} />
          <Text style={styles.navLabel}>Me</Text>
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
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default RecipesScreen;
