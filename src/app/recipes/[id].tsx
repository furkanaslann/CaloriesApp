/**
 * CaloriTrack - Recipe Detail Screen
 * Minimal. Cool. Aesthetic.
 * Figma Design: https://www.figma.com/design/V4OjFZYz1hhZdeWSgZyYtu/Calories-Pages?node-id=47-15
 */

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Recipe data based on Figma designs
const recipesData: Record<string, {
  id: string;
  name: string;
  image: string;
  calories: number;
  time: number;
  difficulty: string;
  nutrition: {
    carb: { grams: number; percent: number };
    protein: { grams: number; percent: number };
    fat: { grams: number; percent: number };
  };
  tags: string[];
  isFavorite?: boolean;
}> = {
  '1': {
    id: '1',
    name: 'Raw Vegan Key Lime Mousse',
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&h=600&fit=crop',
    calories: 233,
    time: 18,
    difficulty: 'Easy',
    nutrition: { carb: { grams: 28, percent: 35 }, protein: { grams: 5, percent: 20 }, fat: { grams: 14, percent: 45 } },
    tags: ['Gluten-Free', 'High-Protein'],
  },
  '2': {
    id: '2',
    name: 'Avocado Toast',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&h=600&fit=crop',
    calories: 320,
    time: 10,
    difficulty: 'Easy',
    nutrition: { carb: { grams: 25, percent: 30 }, protein: { grams: 8, percent: 25 }, fat: { grams: 22, percent: 65 } },
    tags: ['High-Protein', 'Low-Carb'],
  },
  '3': {
    id: '3',
    name: 'Berry Smoothie Bowl',
    image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=800&h=600&fit=crop',
    calories: 185,
    time: 8,
    difficulty: 'Easy',
    nutrition: { carb: { grams: 42, percent: 55 }, protein: { grams: 6, percent: 18 }, fat: { grams: 3, percent: 12 } },
    tags: ['Gluten-Free', 'Low-Fat'],
  },
  '4': {
    id: '4',
    name: 'Quinoa Salad Bowl',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop',
    calories: 410,
    time: 25,
    difficulty: 'Medium',
    nutrition: { carb: { grams: 48, percent: 52 }, protein: { grams: 15, percent: 35 }, fat: { grams: 18, percent: 40 } },
    tags: ['Gluten-Free', 'High-Protein'],
  },
  '5': {
    id: '5',
    name: 'Grilled Chicken Wrap',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&h=600&fit=crop',
    calories: 380,
    time: 20,
    difficulty: 'Medium',
    nutrition: { carb: { grams: 32, percent: 38 }, protein: { grams: 35, percent: 78 }, fat: { grams: 15, percent: 32 } },
    tags: ['High-Protein', 'Low-Carb'],
  },
  '6': {
    id: '6',
    name: 'Mediterranean Salad',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop',
    calories: 295,
    time: 15,
    difficulty: 'Easy',
    nutrition: { carb: { grams: 18, percent: 22 }, protein: { grams: 12, percent: 28 }, fat: { grams: 22, percent: 50 } },
    tags: ['Gluten-Free', 'Low-Carb'],
  },
};

// Styles - defined outside component for performance
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 48,
    backgroundColor: '#FFFFFF',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Notification Banner
  notificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  bannerText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  // Recipe Image
  recipeImageContainer: {
    position: 'relative',
    marginTop: 8,
  },
  recipeImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#F5F5F5',
  },
  rdBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rdBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E293B',
  },
  // Content
  scrollContent: {
    paddingBottom: 120,
  },
  // Title Section
  titleSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  // Meta Info
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingHorizontal: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#64748B',
  },
  // Nutrition Facts
  nutritionSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  nutritionCircles: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
  // Dietary Tags
  tagsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    paddingHorizontal: 16,
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  tagGlutenFree: {
    backgroundColor: '#7C3AED',
  },
  tagHighProtein: {
    backgroundColor: '#10B981',
  },
  tagLowCarb: {
    backgroundColor: '#10B981',
  },
  tagLowFat: {
    backgroundColor: '#F59E0B',
  },
  // Meal Type Tabs
  mealTypeSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  mealTypeTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  mealTypeTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  mealTypeTabActive: {
    backgroundColor: '#007AFF',
  },
  mealTypeTabText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  mealTypeTabTextActive: {
    color: '#FFFFFF',
  },
  // Servings
  servingsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  servingsLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  servingsControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  servingsValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    minWidth: 20,
    textAlign: 'center',
  },
  servingsButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Action Button
  actionButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Nutrition circle
  nutritionCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nutritionTextContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  nutritionGrams: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  nutritionPercent: {
    fontSize: 11,
    color: '#64748B',
  },
});

const NutritionCircle = ({ grams, percent, color, size = 80 }: { grams: number; percent: number; color: string; size?: number }) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <View style={[styles.nutritionCircle, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#F1F5F9"
          strokeWidth={8}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={8}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.nutritionTextContainer}>
        <Text style={styles.nutritionGrams}>{grams}g</Text>
        <Text style={styles.nutritionPercent}>{percent}%</Text>
      </View>
    </View>
  );
};

const RecipeDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // Handle both string and array cases for id
  const recipeId = Array.isArray(id) ? id[0] : id;
  const recipe = recipesData[recipeId || '1'];

  const [selectedMealType, setSelectedMealType] = useState('Lunch');
  const [servings, setServings] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFavoritesBanner, setShowFavoritesBanner] = useState(false);
  const [showLoggedBanner, setShowLoggedBanner] = useState(false);

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      setShowFavoritesBanner(true);
      setTimeout(() => setShowFavoritesBanner(false), 2000);
    }
  };

  const handleLogMeal = () => {
    setShowLoggedBanner(true);
    setTimeout(() => setShowLoggedBanner(false), 2000);
  };

  if (!recipe) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: '#64748B' }}>Recipe not found</Text>
        <Text style={{ fontSize: 14, color: '#94A3B8', marginTop: 8 }}>ID: {recipeId || 'undefined'}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="help-circle-outline" size={24} color="#1E293B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={toggleFavorite}>
            <Ionicons
              name={isFavorite ? "star" : "star-outline"}
              size={24}
              color={isFavorite ? "#FFD700" : "#1E293B"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Notification Banners */}
      {showFavoritesBanner && (
        <View style={styles.notificationBanner}>
          <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
          <Text style={styles.bannerText}>Added to Favorites</Text>
        </View>
      )}

      {showLoggedBanner && (
        <View style={styles.notificationBanner}>
          <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
          <Text style={styles.bannerText}>{selectedMealType} logged</Text>
        </View>
      )}

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Recipe Image */}
        <View style={styles.recipeImageContainer}>
          <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
          <View style={styles.rdBadge}>
            <Text style={styles.rdBadgeText}>RD Approved</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{recipe.name}</Text>
        </View>

        {/* Meta Info */}
        <View style={styles.metaInfo}>
          <View style={styles.metaItem}>
            <Ionicons name="flame" size={18} color="#64748B" />
            <Text style={styles.metaText}>{recipe.calories} Calorie</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={18} color="#64748B" />
            <Text style={styles.metaText}>{recipe.time} Minute</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="speedometer" size={18} color="#64748B" />
            <Text style={styles.metaText}>{recipe.difficulty}</Text>
          </View>
        </View>

        {/* Nutrition Facts */}
        <View style={styles.nutritionSection}>
          <View style={styles.nutritionCircles}>
            <View>
              <NutritionCircle
                grams={recipe.nutrition.carb.grams}
                percent={recipe.nutrition.carb.percent}
                color="#F59E0B"
              />
              <Text style={styles.nutritionLabel}>Carb</Text>
            </View>
            <View>
              <NutritionCircle
                grams={recipe.nutrition.protein.grams}
                percent={recipe.nutrition.protein.percent}
                color="#10B981"
              />
              <Text style={styles.nutritionLabel}>Protein</Text>
            </View>
            <View>
              <NutritionCircle
                grams={recipe.nutrition.fat.grams}
                percent={recipe.nutrition.fat.percent}
                color="#EF4444"
              />
              <Text style={styles.nutritionLabel}>Fat</Text>
            </View>
          </View>
        </View>

        {/* Dietary Tags */}
        <View style={styles.tagsSection}>
          {recipe.tags.map((tag) => {
            let tagStyle = styles.tag;
            if (tag === 'Gluten-Free') tagStyle = { ...tagStyle, ...styles.tagGlutenFree };
            else if (tag === 'High-Protein') tagStyle = { ...tagStyle, ...styles.tagHighProtein };
            else if (tag === 'Low-Carb') tagStyle = { ...tagStyle, ...styles.tagLowCarb };
            else if (tag === 'Low-Fat') tagStyle = { ...tagStyle, ...styles.tagLowFat };

            return (
              <View key={tag} style={tagStyle}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            );
          })}
        </View>

        {/* Meal Type Tabs */}
        <View style={styles.mealTypeSection}>
          <View style={styles.mealTypeTabs}>
            {mealTypes.map((meal) => (
              <TouchableOpacity
                key={meal}
                style={[
                  styles.mealTypeTab,
                  selectedMealType === meal && styles.mealTypeTabActive,
                ]}
                onPress={() => setSelectedMealType(meal)}
              >
                <Text
                  style={[
                    styles.mealTypeTabText,
                    selectedMealType === meal && styles.mealTypeTabTextActive,
                  ]}
                >
                  {meal}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Servings Selector */}
        <View style={styles.servingsSection}>
          <Text style={styles.servingsLabel}>serving</Text>
          <View style={styles.servingsControl}>
            <TouchableOpacity
              style={styles.servingsButton}
              onPress={() => setServings(Math.max(1, servings - 1))}
            >
              <Ionicons name="remove" size={20} color="#64748B" />
            </TouchableOpacity>
            <Text style={styles.servingsValue}>{servings}</Text>
            <TouchableOpacity
              style={styles.servingsButton}
              onPress={() => setServings(servings + 1)}
            >
              <Ionicons name="add" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Action Button */}
      <View style={styles.actionButtonContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLogMeal}>
          <Text style={styles.actionButtonText}>Log to {selectedMealType}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RecipeDetailScreen;
