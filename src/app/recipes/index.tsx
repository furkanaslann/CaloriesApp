/**
 * CaloriTrack - Recipes Gallery Screen
 * Minimal. Cool. Aesthetic.
 * Figma Design: https://www.figma.com/design/V4OjFZYz1hhZdeWSgZyYtu/Calories-Pages?node-id=41-2
 */

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Full screen card size based on Figma
const CARD_WIDTH = width;
const CARD_HEIGHT = height;

// Recipe data with new Figma images
const recipesData = [
  {
    id: '1',
    name: 'Grillen Tavuk Salata',
    description: 'Yüksek proteinli, düşük kalorili',
    image: 'https://www.figma.com/api/mcp/asset/e07f73e1-480d-4fca-aa88-c05e7882c19c',
    calories: 285,
    time: '25 dk',
    rating: 4.8,
    category: 'Salata',
    difficulty: 'Kolay',
    servings: 2,
  },
  {
    id: '2',
    name: 'Yulaf Ezmesi',
    description: 'Enerjik başlangıç için',
    image: 'https://www.figma.com/api/mcp/asset/f8e76563-3619-46fe-a616-98b64db5b68c',
    calories: 220,
    time: '10 dk',
    rating: 4.6,
    category: 'Kahvaltı',
    difficulty: 'Çok Kolay',
    servings: 1,
  },
  {
    id: '3',
    name: 'Protein Smoothie',
    description: 'Antrenman sonrası için',
    image: 'https://www.figma.com/api/mcp/asset/9bf11826-aeb8-4590-95c5-9431548cb1db',
    calories: 180,
    time: '5 dk',
    rating: 4.9,
    category: 'İçecek',
    difficulty: 'Çok Kolay',
    servings: 1,
  },
  {
    id: '4',
    name: 'Sütlü Tatlı',
    description: 'Düşük kalorili alternatif',
    image: 'https://www.figma.com/api/mcp/asset/59454786-16ae-4656-a53d-f54f342a90de',
    calories: 150,
    time: '20 dk',
    rating: 4.5,
    category: 'Tatlı',
    difficulty: 'Orta',
    servings: 4,
  },
  {
    id: '5',
    name: 'Akdeniz Salata',
    description: 'Taze sebzelerle',
    image: 'https://www.figma.com/api/mcp/asset/8fac0685-dd78-42b9-aea1-2520497a320c',
    calories: 195,
    time: '15 dk',
    rating: 4.8,
    category: 'Salata',
    difficulty: 'Kolay',
    servings: 2,
  },
  {
    id: '6',
    name: 'Açai Bowl',
    description: 'Antioksidan zengini',
    image: 'https://www.figma.com/api/mcp/asset/f33b5c1b-6fb6-400a-8d67-abd467422bfa',
    calories: 320,
    time: '8 dk',
    rating: 4.7,
    category: 'Kahvaltı',
    difficulty: 'Kolay',
    servings: 1,
  },
  {
    id: '7',
    name: 'Avokado Tost',
    description: 'Sağlıklı yağ kaynağı',
    image: 'https://www.figma.com/api/mcp/asset/ca1d6c5b-0aef-4b85-ae5a-03917a07166e',
    calories: 340,
    time: '12 dk',
    rating: 4.7,
    category: 'Kahvaltı',
    difficulty: 'Kolay',
    servings: 1,
  },
  {
    id: '8',
    name: 'Quinoa Bowl',
    description: 'Bitkisel protein',
    image: 'https://www.figma.com/api/mcp/asset/7a0a79f8-a6a6-4ebe-a192-09ac8ceff0ad',
    calories: 290,
    time: '18 dk',
    rating: 4.6,
    category: 'Ana Yemek',
    difficulty: 'Orta',
    servings: 2,
  },
  {
    id: '9',
    name: 'Somon Grill',
    description: 'Omega-3 zengini',
    image: 'https://www.figma.com/api/mcp/asset/e94820dd-8f78-416e-a9a4-881d47bc084f',
    calories: 380,
    time: '30 dk',
    rating: 4.9,
    category: 'Ana Yemek',
    difficulty: 'Orta',
    servings: 2,
  },
  {
    id: '10',
    name: 'Meyve Salata',
    description: 'Taze ve ferahlatıcı',
    image: 'https://www.figma.com/api/mcp/asset/0c030c87-d29d-472d-9fe9-7ce3787ecb68',
    calories: 165,
    time: '10 dk',
    rating: 4.7,
    category: 'Tatlı',
    difficulty: 'Çok Kolay',
    servings: 2,
  },
];

const categories = ['Tümü', 'Kahvaltı', 'Salata', 'Ana Yemek', 'İçecek', 'Tatlı'];

const RecipesGalleryScreen = () => {
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredRecipes = recipesData.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tümü' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (recipeId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(recipeId)) {
      newFavorites.delete(recipeId);
    } else {
      newFavorites.add(recipeId);
    }
    setFavorites(newFavorites);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000',
    },
    // Full screen cards
    cardContainer: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
    },
    cardImage: {
      width: '100%',
      height: '100%',
    },
    // Overlay gradient
    gradientOverlay: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    gradientBottom: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 300,
      backgroundColor: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
    },
    // Top Header
    topHeader: {
      position: 'absolute',
      top: 60,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    headerTitle: {
      fontSize: 36,
      fontWeight: '700',
      color: '#FFFFFF',
      letterSpacing: -1,
    },
    headerButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    headerButton: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(20px)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    // Content Overlay
    contentOverlay: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingBottom: 100,
      paddingHorizontal: 32,
    },
    categoryBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 24,
      backgroundColor: 'rgba(124, 58, 237, 0.9)',
      marginBottom: 16,
    },
    categoryBadgeText: {
      fontSize: 14,
      fontWeight: '700',
      color: '#FFFFFF',
      letterSpacing: 0.5,
    },
    recipeTitle: {
      fontSize: 42,
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: 12,
      lineHeight: 48,
      letterSpacing: -1,
      textShadow: '0 2px 10px rgba(0,0,0,0.3)',
    },
    recipeDescription: {
      fontSize: 18,
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: 24,
      lineHeight: 26,
    },
    // Meta info
    metaRow: {
      flexDirection: 'row',
      gap: 24,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    metaText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    ratingBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(10px)',
    },
    ratingText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    // Action buttons
    actionButtons: {
      position: 'absolute',
      bottom: 40,
      left: 24,
      right: 24,
      flexDirection: 'row',
      gap: 16,
    },
    primaryButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      backgroundColor: '#7C3AED',
      borderRadius: 20,
      paddingVertical: 20,
      shadowColor: '#7C3AED',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 20,
      elevation: 10,
    },
    primaryButtonText: {
      fontSize: 18,
      fontWeight: '700',
      color: '#FFFFFF',
      letterSpacing: 0.5,
    },
    secondaryButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(20px)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    // Page indicator
    pageIndicator: {
      position: 'absolute',
      bottom: 120,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
    },
    pageDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    pageDotActive: {
      width: 24,
      backgroundColor: '#FFFFFF',
    },
    // Search Modal
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: '#1E293B',
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      paddingHorizontal: 28,
      paddingTop: 36,
      paddingBottom: 48,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 28,
    },
    modalTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#334155',
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingVertical: 16,
      marginBottom: 24,
    },
    searchInput: {
      flex: 1,
      fontSize: 18,
      color: '#FFFFFF',
      marginLeft: 12,
    },
    clearButton: {
      fontSize: 16,
      fontWeight: '600',
      color: '#7C3AED',
    },
    recentSearchesTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#94A3B8',
      marginBottom: 20,
    },
    recentSearchItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#334155',
    },
    recentSearchText: {
      fontSize: 16,
      color: '#E2E8F0',
      marginLeft: 12,
    },
    // Categories horizontal list
    categoriesContainer: {
      position: 'absolute',
      top: 130,
      left: 0,
      right: 0,
    },
    categoryScroll: {
      paddingHorizontal: 24,
    },
    categoryChip: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 28,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      marginRight: 12,
    },
    categoryChipActive: {
      backgroundColor: '#7C3AED',
      borderColor: '#7C3AED',
    },
    categoryChipText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyStateText: {
      fontSize: 18,
      color: '#94A3B8',
      textAlign: 'center',
      marginTop: 20,
    },
  });

  const renderCard = ({ item, index }: { item: typeof recipesData[0]; index: number }) => {
    const isFavorite = favorites.has(item.id);

    return (
      <View style={styles.cardContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.cardImage}
        />

        <View style={styles.gradientOverlay} />
        <View style={styles.gradientBottom} />

        {/* Top Header */}
        <View style={styles.topHeader}>
          <Text style={styles.headerTitle}>Tarifler</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setSearchModalVisible(true)}
            >
              <Ionicons name="search-outline" size={26} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerButton, isFavorite && { backgroundColor: 'rgba(239, 68, 68, 0.4)' }]}
              onPress={() => toggleFavorite(item.id)}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={26}
                color={isFavorite ? '#EF4444' : '#FFFFFF'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            renderItem={({ item: cat }) => {
              const isActive = selectedCategory === cat;
              return (
                <TouchableOpacity
                  style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={styles.categoryChipText}>{cat}</Text>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.categoryScroll}
          />
        </View>

        {/* Content Overlay */}
        <View style={styles.contentOverlay}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{item.category}</Text>
          </View>

          <Text style={styles.recipeTitle}>{item.name}</Text>
          <Text style={styles.recipeDescription}>{item.description}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={22} color="#FFFFFF" />
              <Text style={styles.metaText}>{item.time}</Text>
            </View>

            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={22} color="#FFFFFF" />
              <Text style={styles.metaText}>{item.servings} kişilik</Text>
            </View>

            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={20} color="#FBBF24" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push({ pathname: '/recipes/[id]', params: { id: item.id } })}
          >
            <Ionicons name="restaurant-outline" size={24} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Tarife Git</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => toggleFavorite(item.id)}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={28}
              color={isFavorite ? '#EF4444' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>

        {/* Page Indicator */}
        <View style={styles.pageIndicator}>
          {filteredRecipes.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.pageDot,
                idx === index % filteredRecipes.length && styles.pageDotActive,
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {filteredRecipes.length > 0 ? (
        <FlatList
          data={filteredRecipes}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH}
          decelerationRate="fast"
          onViewableItemsChanged={({ viewableItems }) => {
            if (viewableItems[0]) {
              setCurrentIndex(viewableItems[0].index || 0);
            }
          }}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
          }}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={80} color="#475569" />
          <Text style={styles.emptyStateText}>
            Arama kriterlerinize uygun tarif bulunamadı.
          </Text>
        </View>
      )}

      {/* Search Modal */}
      <Modal
        visible={searchModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSearchModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setSearchModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Tarif Ara</Text>
                  <TouchableOpacity onPress={() => setSearchModalVisible(false)}>
                    <Ionicons name="close" size={32} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                <View style={styles.searchInputContainer}>
                  <Ionicons name="search-outline" size={24} color="#64748B" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Tarif adı veya malzeme ara..."
                    placeholderTextColor="#64748B"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                      <Text style={styles.clearButton}>Temizle</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {searchQuery.length === 0 && (
                  <>
                    <Text style={styles.recentSearchesTitle}>Son Aramalar</Text>
                    {['Tavuk', 'Protein', 'Salata', 'Kahvaltı'].map((term, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.recentSearchItem}
                        onPress={() => setSearchQuery(term)}
                      >
                        <Ionicons name="time-outline" size={22} color="#64748B" />
                        <Text style={styles.recentSearchText}>{term}</Text>
                      </TouchableOpacity>
                    ))}
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default RecipesGalleryScreen;
