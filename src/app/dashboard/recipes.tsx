/**
 * CaloriTrack - Recipes Gallery Screen
 * Minimal. Cool. Aesthetic.
 * Figma Design: https://www.figma.com/design/V4OjFZYz1hhZdeWSgZyYtu/Calories-Pages?node-id=28-32
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Recipe card width + margin
const CARD_WIDTH = width * 0.75;
const CARD_MARGIN = 12;
const FULL_CARD_WIDTH = CARD_WIDTH + CARD_MARGIN;

// Recipe data matching Figma design - using Figma asset images
const recipesData = [
  {
    id: '1',
    name: 'Grillen Tavuk Salata',
    description: 'Yüksek proteinli, düşük kalorili',
    image: 'https://www.figma.com/api/mcp/asset/1a470308-0b07-415f-b317-3b514e8f4b08',
    calories: 285,
    time: '25 dk',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Yulaf Ezmesi',
    description: 'Enerjik başlangıç için',
    image: 'https://www.figma.com/api/mcp/asset/a77ecc7c-2252-47c0-993e-aca6087aed9b',
    calories: 220,
    time: '10 dk',
    rating: 4.6,
  },
  {
    id: '3',
    name: 'Protein Smoothie',
    description: 'Antrenman sonrası için',
    image: 'https://www.figma.com/api/mcp/asset/1009e8ea-182f-4973-a0cf-80484b0865a7',
    calories: 180,
    time: '5 dk',
    rating: 4.9,
  },
  {
    id: '4',
    name: 'Sütlü Tatlı',
    description: 'Düşük kalorili alternatif',
    image: 'https://www.figma.com/api/mcp/asset/df5ecbfe-4875-4acb-a0cf-712727424bb8',
    calories: 150,
    time: '20 dk',
    rating: 4.5,
  },
  {
    id: '5',
    name: 'Açai Bowl',
    description: 'Antioksidan zengini',
    image: 'https://www.figma.com/api/mcp/asset/f97b78d5-9a73-4847-95ed-18959915924b',
    calories: 320,
    time: '8 dk',
    rating: 4.7,
  },
  {
    id: '6',
    name: 'Akdeniz Salata',
    description: 'Taze sebzelerle',
    image: 'https://www.figma.com/api/mcp/asset/8f172810-3852-4145-8223-1c009f394378',
    calories: 195,
    time: '15 dk',
    rating: 4.8,
  },
];

const RecipesGalleryScreen = () => {
  const router = useRouter();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    // Header
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 16,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: '#1E293B',
      letterSpacing: -0.5,
    },
    headerButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#F8FAFC',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#E2E8F0',
    },
    // Subtitle section
    subtitleSection: {
      paddingHorizontal: 24,
      paddingBottom: 24,
    },
    subtitleText: {
      fontSize: 16,
      color: '#64748B',
      lineHeight: 22,
    },
    // Horizontal Gallery
    galleryContainer: {
      paddingBottom: 40,
    },
    // Recipe Card
    card: {
      width: CARD_WIDTH,
      height: 480,
      marginLeft: CARD_MARGIN,
      borderRadius: 24,
      overflow: 'hidden',
      backgroundColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 8,
    },
    cardImageContainer: {
      width: '100%',
      height: 350,
      position: 'relative',
    },
    cardImage: {
      width: '100%',
      height: '100%',
    },
    // Gradient overlay
    gradientOverlay: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 180,
      backgroundColor: 'rgba(124, 58, 237, 0.3)',
    },
    gradientTop: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: 100,
      backgroundColor: 'linear-gradient(180deg, rgba(124, 58, 237, 0.6) 0%, rgba(124, 58, 237, 0) 100%)',
    },
    // Card badges
    badgeContainer: {
      position: 'absolute',
      top: 16,
      left: 16,
      flexDirection: 'row',
      gap: 8,
    },
    badge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#7C3AED',
    },
    favoriteButton: {
      position: 'absolute',
      top: 16,
      right: 16,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    // Card Content
    cardContent: {
      padding: 20,
    },
    cardTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: '#1E293B',
      marginBottom: 8,
      lineHeight: 28,
      letterSpacing: -0.3,
    },
    cardDescription: {
      fontSize: 14,
      color: '#64748B',
      marginBottom: 16,
      lineHeight: 20,
    },
    cardMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: '#F1F5F9',
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    metaIcon: {
      width: 18,
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    metaText: {
      fontSize: 13,
      fontWeight: '500',
      color: '#64748B',
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    ratingText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#1E293B',
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

  const renderRecipeCard = ({ item, index }: { item: typeof recipesData[0]; index: number }) => {
    const isFirst = index === 0;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          isFirst && { marginLeft: 24 },
        ]}
        onPress={() => router.push(`/dashboard/food-detail?id=${item.id}` as any)}
        activeOpacity={0.9}
      >
        <View style={styles.cardImageContainer}>
          <ImageBackground
            source={{ uri: item.image }}
            style={styles.cardImage}
            imageStyle={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
          >
            <View style={styles.gradientOverlay} />
          </ImageBackground>

          {/* Badges */}
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.calories} kcal</Text>
            </View>
          </View>

          {/* Favorite Button */}
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* Card Content */}
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>

          <View style={styles.cardMeta}>
            <View style={styles.metaItem}>
              <View style={styles.metaIcon}>
                <Ionicons name="time-outline" size={16} color="#64748B" />
              </View>
              <Text style={styles.metaText}>{item.time}</Text>
            </View>

            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tarifler</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="search-outline" size={22} color="#1E293B" />
        </TouchableOpacity>
      </View>

      {/* Subtitle */}
      <View style={styles.subtitleSection}>
        <Text style={styles.subtitleText}>
          Sağlıklı ve lezzetli tarifler keşfedin
        </Text>
      </View>

      {/* Horizontal Gallery */}
      <FlatList
        data={recipesData}
        renderItem={renderRecipeCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={FULL_CARD_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={styles.galleryContainer}
        pagingEnabled
      />

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

export default RecipesGalleryScreen;
