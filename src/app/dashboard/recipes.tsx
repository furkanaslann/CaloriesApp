/**
 * CaloriTrack - Recipes Screen
 * Minimal. Cool. Aesthetic.
 * Figma Design: https://www.figma.com/design/V4OjFZYz1hhZdeWSgZyYtu/Calories-Pages
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
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

const FIGMA_IMAGES = {
  recipesHero: "https://www.figma.com/api/mcp/asset/e2f26506-bce8-489c-abfd-ccb882bd02fb",
};

// Sample recipe data matching Figma design
const sampleRecipes = [
  {
    id: 1,
    name: 'Grillen Tavuk Salata',
    description: 'Yüksek proteinli, düşük kalorili ve lezzetli akşam yemeği',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=200&fit=crop',
    calories: 285,
    time: '25 dk',
    difficulty: 'Kolay',
    category: 'main',
    protein: 32,
    carbs: 12,
    fat: 8
  },
  {
    id: 2,
    name: 'Yulaf Ezmesi Meyveli',
    description: 'Enerjik başlangıç için sağlıklı kahvaltı seçeneği',
    image: 'https://images.unsplash.com/photo-1525373612132-b3e820b87cea?w=400&h=200&fit=crop',
    calories: 220,
    time: '10 dk',
    difficulty: 'Kolay',
    category: 'breakfast',
    protein: 8,
    carbs: 35,
    fat: 6
  },
  {
    id: 3,
    name: 'Protein Smoothie',
    description: 'Antrenman sonrası için besleyici içecek',
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&h=200&fit=crop',
    calories: 180,
    time: '5 dk',
    difficulty: 'Kolay',
    category: 'snack',
    protein: 25,
    carbs: 15,
    fat: 3
  },
  {
    id: 4,
    name: 'Sütlü Tatlı',
    description: 'Düşük kalorili sağlıklı tatlı alternatifi',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=200&fit=crop',
    calories: 150,
    time: '20 dk',
    difficulty: 'Orta',
    category: 'dessert',
    protein: 4,
    carbs: 22,
    fat: 5
  },
  {
    id: 5,
    name: 'Açai Bowl',
    description: 'Antioksidan zenginliği ve görsel şölen',
    image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=200&fit=crop',
    calories: 320,
    time: '8 dk',
    difficulty: 'Kolay',
    category: 'beverage',
    protein: 6,
    carbs: 45,
    fat: 12
  },
  {
    id: 6,
    name: 'Akdeniz Salata',
    description: 'Taze sebzelerle zenginleştirilmiş sağlıklı seçenek',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop',
    calories: 195,
    time: '15 dk',
    difficulty: 'Kolay',
    category: 'salad',
    protein: 5,
    carbs: 18,
    fat: 11
  },
  {
    id: 7,
    name: 'İzmir Köfte',
    description: 'Geleneksel lezzet sağlıklı pişirme yöntemiyle',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=200&fit=crop',
    calories: 380,
    time: '35 dk',
    difficulty: 'Orta',
    category: 'main',
    protein: 28,
    carbs: 25,
    fat: 18
  },
  {
    id: 8,
    name: 'Sebzeli Fırın Yemeği',
    description: 'Sebzelerle zenginleştirilmiş dengeli öğün',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=200&fit=crop',
    calories: 265,
    time: '40 dk',
    difficulty: 'Orta',
    category: 'main',
    protein: 22,
    carbs: 30,
    fat: 8
  }
];

const RecipesScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState<'discover' | 'favorites' | 'rated'>('discover');

  // Sample data for different tabs
const favoriteRecipes = sampleRecipes.slice(0, 3);
const ratedRecipes = [
  ...sampleRecipes.slice(0, 2),
  {
    ...sampleRecipes[2],
    id: 7,
    rating: 4.8,
    reviews: 156
  },
  {
    ...sampleRecipes[3],
    id: 8,
    rating: 4.6,
    reviews: 92
  }
];

  // Filter recipes based on search and category
  const getFilteredRecipes = () => {
    let recipes = activeTab === 'discover' ? sampleRecipes :
                  activeTab === 'favorites' ? favoriteRecipes :
                  ratedRecipes;

    return recipes.filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  const filteredRecipes = getFilteredRecipes();

  // Get user display name with fallback
  const getUserDisplayName = () => {
    // This would normally come from user context
    return 'Kullanıcı';
  };

  const userName = getUserDisplayName();
  const userInitial = userName.charAt(0).toUpperCase();

  // Dynamic styles using theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    scrollView: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    content: {
      paddingBottom: 120, // Space for bottom nav
    },

    // Header Section - Figma style
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 24,
      backgroundColor: '#FFFFFF',
    },
    greetingSection: {
      flex: 1,
    },
    greetingText: {
      fontSize: 16,
      color: '#64748B',
      marginBottom: 4,
    },
    userName: {
      fontSize: 32,
      fontWeight: '700',
      color: '#1E293B',
      lineHeight: 38,
    },
    headerActions: {
      flexDirection: 'row',
      gap: 12,
    },
    notificationButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#F1F5F9',
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      overflow: 'hidden',
      backgroundColor: '#7C3AED',
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileInitial: {
      fontSize: 18,
      fontWeight: '700',
      color: '#FFFFFF',
    },

    // Tab Navigation Section
    tabSection: {
      paddingHorizontal: 24,
      marginBottom: 24,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: '#F8FAFC',
      borderRadius: 12,
      padding: 4,
      borderWidth: 1,
      borderColor: '#E2E8F0',
    },
    tabButton: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabButtonActive: {
      backgroundColor: '#7C3AED',
      shadowColor: '#7C3AED',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#64748B',
    },
    tabTextActive: {
      color: '#FFFFFF',
    },

    // Hero Section - Figma inspired
    heroSection: {
      paddingHorizontal: 24,
      marginBottom: 24,
    },
    heroCard: {
      borderRadius: 20,
      height: 200,
      position: 'relative',
      overflow: 'hidden',
      marginBottom: 24,
    },
    heroBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    heroOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(124, 58, 237, 0.8)',
    },
    heroContent: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    heroTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 12,
      lineHeight: 34,
    },
    heroSubtitle: {
      fontSize: 16,
      color: '#FFFFFF',
      textAlign: 'center',
      opacity: 0.9,
      lineHeight: 22,
    },

    // Search Bar
    searchSection: {
      paddingHorizontal: 24,
      marginBottom: 24,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F8FAFC',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: '#E2E8F0',
    },
    searchIcon: {
      marginRight: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: '#1E293B',
      fontFamily: 'Inter',
    },
    clearButton: {
      padding: 4,
    },

    // Category Filter
    categorySection: {
      paddingHorizontal: 24,
      marginBottom: 24,
    },
    categoryTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#1E293B',
      marginBottom: 16,
    },
    categoryContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    categoryButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: '#F8FAFC',
      borderWidth: 1,
      borderColor: '#E2E8F0',
    },
    categoryButtonActive: {
      backgroundColor: '#7C3AED',
      borderColor: '#7C3AED',
    },
    categoryText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#64748B',
    },
    categoryTextActive: {
      color: '#FFFFFF',
    },

    // Recipes Grid
    recipesSection: {
      paddingHorizontal: 24,
      marginBottom: 32,
    },
    recipesHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    recipesTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: '#1E293B',
    },
    recipesCount: {
      fontSize: 16,
      color: '#64748B',
      fontWeight: '500',
    },
    recipeCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
      borderWidth: 1,
      borderColor: '#F1F5F9',
      overflow: 'hidden',
    },
    recipeImage: {
      width: '100%',
      height: 140,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
    recipeImageOverlay: {
      position: 'absolute',
      top: 12,
      left: 12,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    recipeImageText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    recipeContent: {
      padding: 16,
    },
    recipeName: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1E293B',
      marginBottom: 8,
      lineHeight: 24,
    },
    recipeDescription: {
      fontSize: 14,
      color: '#64748B',
      marginBottom: 16,
      lineHeight: 20,
    },
    recipeMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    recipeMetaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    recipeMetaIcon: {
      width: 16,
      height: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    recipeMetaText: {
      fontSize: 12,
      color: '#64748B',
      fontWeight: '500',
    },
    recipeCount: {
      fontSize: 14,
      fontWeight: '600',
      color: '#7C3AED',
    },

    // Rating Styles
    recipeRating: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    ratingStars: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#1E293B',
      marginLeft: 4,
    },
    reviewsCount: {
      fontSize: 11,
      color: '#64748B',
      marginLeft: 2,
    },

    // Favorite Badge
    favoriteBadge: {
      position: 'absolute',
      top: 12,
      right: 12,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },

    // Macros Styles
    macrosContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    macroItem: {
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 28,
    },
    macroValue: {
      fontSize: 10,
      fontWeight: '600',
      color: '#1E293B',
      lineHeight: 12,
    },
    macroLabel: {
      fontSize: 8,
      fontWeight: '500',
      color: '#64748B',
      marginTop: 1,
    },

    // Empty State
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingVertical: 60,
    },
    emptyStateIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: '#F3E8FF',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    emptyStateTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1E293B',
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyStateDescription: {
      fontSize: 14,
      color: '#64748B',
      textAlign: 'center',
      lineHeight: 20,
    },

    // Bottom Navigation - Same as dashboard
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

  const renderRecipeCard = ({ item }: { item: any }) => {
    const isFavorite = activeTab === 'favorites' || favoriteRecipes.some(r => r.id === item.id);
    const showRating = activeTab === 'rated' && item.rating;

    return (
      <TouchableOpacity
        style={styles.recipeCard}
        onPress={() => router.push(`/dashboard/recipes/${item.id}` as any)}
      >
        <View style={{ position: 'relative' }}>
          <ImageBackground
            source={{ uri: item.image }}
            style={styles.recipeImage}
            imageStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
          >
            {activeTab !== 'favorites' && (
              <View style={styles.recipeImageOverlay}>
                <Text style={styles.recipeImageText}>{item.calories} kcal</Text>
              </View>
            )}

            {isFavorite && (
              <View style={styles.favoriteBadge}>
                <Ionicons name="heart" size={16} color="#EF4444" />
              </View>
            )}
          </ImageBackground>
        </View>

        <View style={styles.recipeContent}>
          <Text style={styles.recipeName}>{item.name}</Text>
          <Text style={styles.recipeDescription}>{item.description}</Text>

          <View style={styles.recipeMeta}>
            <View style={styles.recipeMetaItem}>
              <View style={styles.recipeMetaIcon}>
                <Ionicons name="time-outline" size={14} color="#64748B" />
              </View>
              <Text style={styles.recipeMetaText}>{item.time}</Text>
            </View>

            <View style={styles.recipeMetaItem}>
              <View style={styles.recipeMetaIcon}>
                <Ionicons name="bar-chart-outline" size={14} color="#64748B" />
              </View>
              <Text style={styles.recipeMetaText}>{item.difficulty}</Text>
            </View>

            {showRating ? (
              <View style={styles.recipeRating}>
                <View style={styles.ratingStars}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
                <Text style={styles.reviewsCount}>({item.reviews})</Text>
              </View>
            ) : activeTab === 'discover' ? (
              <View style={styles.macrosContainer}>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>{item.protein}g</Text>
                  <Text style={styles.macroLabel}>P</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>{item.carbs}g</Text>
                  <Text style={styles.macroLabel}>K</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>{item.fat}g</Text>
                  <Text style={styles.macroLabel}>Y</Text>
                </View>
              </View>
            ) : (
              <Text style={styles.recipeCount}>{item.calories} kcal</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>
        <Ionicons name="search-outline" size={32} color="#7C3AED" />
      </View>
      <Text style={styles.emptyStateTitle}>Tarif bulunamadı</Text>
      <Text style={styles.emptyStateDescription}>
        Arama kriterlerinize uygun tarif bulunamadı. Başka bir kelime deneyin.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {/* Tab Navigation Section */}
          <View style={styles.tabSection}>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === 'discover' && styles.tabButtonActive
                ]}
                onPress={() => setActiveTab('discover')}
              >
                <Text style={[
                  styles.tabText,
                  activeTab === 'discover' && styles.tabTextActive
                ]}>
                  Discover
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === 'favorites' && styles.tabButtonActive
                ]}
                onPress={() => setActiveTab('favorites')}
              >
                <Text style={[
                  styles.tabText,
                  activeTab === 'favorites' && styles.tabTextActive
                ]}>
                  Favorites
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === 'rated' && styles.tabButtonActive
                ]}
                onPress={() => setActiveTab('rated')}
              >
                <Text style={[
                  styles.tabText,
                  activeTab === 'rated' && styles.tabTextActive
                ]}>
                  Rated
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color="#64748B" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Tarif ara..."
                placeholderTextColor="#64748B"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => setSearchQuery('')}
                >
                  <Ionicons name="close-circle" size={20} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Category Filter */}
          <View style={styles.categorySection}>
            <Text style={styles.categoryTitle}>Kategoriler</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryContainer}>
                {[
                  { id: 'all', name: 'Tümü' },
                  { id: 'main', name: 'Ana Yemek' },
                  { id: 'breakfast', name: 'Kahvaltı' },
                  { id: 'snack', name: 'Ara Öğün' },
                  { id: 'dessert', name: 'Tatlı' },
                  { id: 'salad', name: 'Salata' },
                ].map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category.id && styles.categoryButtonActive
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <Text style={[
                      styles.categoryText,
                      selectedCategory === category.id && styles.categoryTextActive
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Recipes Grid */}
          <View style={styles.recipesSection}>
            <View style={styles.recipesHeader}>
              <Text style={styles.recipesTitle}>
                {activeTab === 'discover' ? 'Keşfet' :
                 activeTab === 'favorites' ? 'Favoriler' : 'Oylananlar'}
              </Text>
              <Text style={styles.recipesCount}>{filteredRecipes.length} tarif</Text>
            </View>

            {filteredRecipes.length > 0 ? (
              <FlatList
                data={filteredRecipes}
                renderItem={renderRecipeCard}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              renderEmptyState()
            )}
          </View>
        </View>
      </ScrollView>

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
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="restaurant-outline" size={24} color="#7C3AED" style={styles.navIcon} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Tarifler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard/profile')}>
          <Ionicons name="person-outline" size={24} color="#94A3B8" style={styles.navIcon} />
          <Text style={styles.navLabel}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RecipesScreen;