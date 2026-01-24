/**
 * RecipeCard Component
 *
 * Minimal. Cool. Aesthetic.
 *
 * A reusable recipe card component displaying:
 * - Recipe image with favorite button
 * - Meta information (time, calories)
 * - Recipe name
 * - Optional premium badge
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  DimensionValue,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { Recipe } from '@/types/recipe';

// =============================================================================
// Props
// =============================================================================

export interface RecipeCardProps {
  /** The recipe to display */
  recipe: Recipe;
  /** Card width (for responsive layouts) */
  width?: DimensionValue;
  /** Whether the recipe is saved/favorited */
  isSaved?: boolean;
  /** Callback when card is pressed */
  onPress?: (recipe: Recipe) => void;
  /** Callback when favorite button is pressed */
  onFavoritePress?: (recipeId: string, isSaved: boolean) => void;
  /** Show premium badge */
  showPremiumBadge?: boolean;
  /** Whether user is premium */
  isPremium?: boolean;
  /** Custom image style */
  imageStyle?: object;
  /** Custom container style */
  containerStyle?: object;
  /** Compact mode (smaller card) */
  compact?: boolean;
}

// =============================================================================
// Component
// =============================================================================

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  width,
  isSaved = false,
  onPress,
  onFavoritePress,
  showPremiumBadge = false,
  isPremium = false,
  imageStyle,
  containerStyle,
  compact = false,
}) => {
  // Format time string
  const timeString = useMemo(() => {
    const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
    return `${totalTime} min`;
  }, [recipe.prepTime, recipe.cookTime]);

  // Format calories string
  const calorieString = useMemo(() => {
    return `${Math.round(recipe.nutritionPerServing.calories)} Cal`;
  }, [recipe.nutritionPerServing.calories]);

  // Get difficulty color
  const difficultyColor = useMemo(() => {
    switch (recipe.difficulty) {
      case 'easy':
        return '#10B981';
      case 'medium':
        return '#F59E0B';
      case 'hard':
        return '#EF4444';
      default:
        return '#64748B';
    }
  }, [recipe.difficulty]);

  // Handle card press
  const handlePress = () => {
    if (onPress) {
      onPress(recipe);
    } else {
      router.push(`/recipes/${recipe.id}` as any);
    }
  };

  // Handle favorite press
  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    if (onFavoritePress) {
      onFavoritePress(recipe.id, isSaved);
    }
  };

  // Get card dimensions based on compact mode
  const cardWidth = width || (compact ? 140 : undefined);
  const imageHeight = compact ? 100 : 140;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        compact && styles.cardCompact,
        cardWidth && { width: cardWidth },
        containerStyle,
      ]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: recipe.photos?.[0] || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop',
          }}
          style={[styles.image, { height: imageHeight }, imageStyle]}
        />

        {/* RD Approved Badge */}
        {recipe.verified && (
          <View style={styles.rdBadge}>
            <Text style={styles.rdBadgeText}>RD</Text>
          </View>
        )}

        {/* Premium Badge */}
        {showPremiumBadge && !isPremium && (
          <View style={styles.premiumBadge}>
            <Ionicons name="lock-closed" size={10} color="#7C3AED" />
            <Text style={styles.premiumBadgeText}>Premium</Text>
          </View>
        )}

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={isSaved ? 'star' : 'star-outline'}
            size={compact ? 16 : 18}
            color={isSaved ? '#FFD700' : '#64748B'}
          />
        </TouchableOpacity>
      </View>

      {/* Card Content */}
      <View style={[styles.content, compact && styles.contentCompact]}>
        {/* Meta Row */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={12} color="#64748B" />
            <Text style={styles.metaText}>{timeString}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="flame" size={12} color="#64748B" />
            <Text style={styles.metaText}>{calorieString}</Text>
          </View>
        </View>

        {/* Title */}
        <Text
          style={[styles.title, compact && styles.titleCompact]}
          numberOfLines={2}
        >
          {recipe.name}
        </Text>

        {/* Difficulty Indicator (non-compact) */}
        {!compact && recipe.difficulty && (
          <View style={styles.difficultyRow}>
            <View
              style={[styles.difficultyDot, { backgroundColor: difficultyColor }]}
            />
            <Text style={styles.difficultyText}>
              {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
            </Text>
          </View>
        )}

        {/* Tags (compact mode) */}
        {compact && recipe.tags && recipe.tags.length > 0 && (
          <View style={styles.tagsRow}>
            <Text style={styles.tagText} numberOfLines={1}>
              {recipe.tags[0]}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// =============================================================================
// Styles
// =============================================================================

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  cardCompact: {
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    backgroundColor: '#F5F5F5',
  },
  rdBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  rdBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#1E293B',
  },
  premiumBadge: {
    position: 'absolute',
    bottom: 8,
    right: 48,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.3)',
  },
  premiumBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#7C3AED',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    padding: 14,
  },
  contentCompact: {
    padding: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: 20,
    marginBottom: 8,
  },
  titleCompact: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  difficultyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  difficultyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  difficultyText: {
    fontSize: 11,
    color: '#64748B',
  },
  tagsRow: {
    marginTop: 4,
  },
  tagText: {
    fontSize: 10,
    color: '#7C3AED',
    fontWeight: '500',
  },
});

export default RecipeCard;
