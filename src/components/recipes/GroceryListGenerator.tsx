/**
 * GroceryListGenerator Component
 *
 * Minimal. Cool. Aesthetic.
 *
 * Premium feature - Generate grocery lists from recipes:
 * - Consolidate ingredients across multiple recipes
 * - Organize by category
 * - Check off items as you shop
 * - Share/export list
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRevenueCat } from '@/context/revenuecat-context';
import { PremiumGate } from '@/components/premium/PremiumGate';
import type { GroceryList, GroceryItem, Recipe } from '@/types/recipe';

// =============================================================================
// Props
// =============================================================================

export interface GroceryListGeneratorProps {
  /** Selected recipes to generate list from */
  recipes: Recipe[];
  /** Servings for each recipe (recipeId -> servings) */
  servings: Record<string, number>;
  /** Callback when list is generated */
  onGenerate?: (list: GroceryList) => void;
  /** Callback when list is shared/exported */
  onShare?: (list: GroceryList) => void;
  /** Custom container style */
  containerStyle?: object;
}

// =============================================================================
// Helper Functions
// =============================================================================

const categorizeIngredient = (name: string): string => {
  const lower = name.toLowerCase();

  const categories: Record<string, string[]> = {
    'Produce': ['vegetable', 'fruit', 'herb', 'lettuce', 'spinach', 'tomato', 'onion', 'garlic', 'carrot', 'potato', 'pepper', 'apple', 'banana', 'berry'],
    'Meat & Seafood': ['chicken', 'beef', 'pork', 'fish', 'shrimp', 'salmon', 'turkey', 'steak', 'sausage'],
    'Dairy & Eggs': ['milk', 'cheese', 'yogurt', 'cream', 'butter', 'egg'],
    'Bakery': ['bread', 'flour', 'roll', 'bun', 'tortilla'],
    'Pantry': ['rice', 'pasta', 'oil', 'sauce', 'spice', 'salt', 'pepper', 'sugar', 'honey'],
    'Frozen': ['frozen', 'ice cream'],
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lower.includes(keyword))) {
      return category;
    }
  }

  return 'Other';
};

// =============================================================================
// Component
// =============================================================================

export const GroceryListGenerator: React.FC<GroceryListGeneratorProps> = ({
  recipes,
  servings,
  onGenerate,
  onShare,
  containerStyle,
}) => {
  const { isPremium } = useRevenueCat();
  const [showModal, setShowModal] = useState(false);
  const [showPremiumGate, setShowPremiumGate] = useState(false);
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Produce']));

  // Generate consolidated grocery list
  const generateList = useCallback(() => {
    if (!isPremium) {
      setShowPremiumGate(true);
      return;
    }

    if (recipes.length === 0) {
      Alert.alert('No Recipes', 'Please select at least one recipe to generate a grocery list.');
      return;
    }

    // Consolidate ingredients
    const consolidatedMap = new Map<string, GroceryItem>();

    recipes.forEach(recipe => {
      const multiplier = (servings[recipe.id] || recipe.servings) / recipe.servings;

      recipe.ingredients.forEach(ingredient => {
        const key = `${ingredient.foodId}_${ingredient.unit}`;
        const existing = consolidatedMap.get(key);

        if (existing) {
          existing.quantity += ingredient.quantity * multiplier;
          if (!existing.recipes.includes(recipe.id)) {
            existing.recipes.push(recipe.id);
          }
        } else {
          consolidatedMap.set(key, {
            id: key,
            name: ingredient.foodId,
            quantity: ingredient.quantity * multiplier,
            unit: ingredient.unit,
            checked: false,
            recipes: [recipe.id],
            category: categorizeIngredient(ingredient.foodId),
            notes: ingredient.notes,
          });
        }
      });
    });

    const list = Array.from(consolidatedMap.values());
    setGroceryList(list);
    setShowModal(true);

    if (onGenerate) {
      onGenerate({
        id: `list_${Date.now()}`,
        items: list,
        createdAt: new Date().toISOString(),
      });
    }
  }, [recipes, servings, isPremium, onGenerate]);

  // Toggle item checked
  const toggleItemChecked = useCallback((itemId: string) => {
    setGroceryList(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  }, []);

  // Toggle category expanded
  const toggleCategoryExpanded = useCallback((category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  }, []);

  // Organize items by category
  const itemsByCategory = useMemo(() => {
    const grouped: Record<string, GroceryItem[]> = {};

    groceryList.forEach(item => {
      const category = item.category || 'Other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    });

    return grouped;
  }, [groceryList]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = groceryList.length;
    const checked = groceryList.filter(item => item.checked).length;
    const categories = Object.keys(itemsByCategory).length;

    return { total, checked, categories };
  }, [groceryList, itemsByCategory]);

  // Handle share
  const handleShare = useCallback(() => {
    const list: GroceryList = {
      id: `list_${Date.now()}`,
      items: groceryList,
      createdAt: new Date().toISOString(),
    };

    if (onShare) {
      onShare(list);
    } else {
      // Default share behavior - create text
      const text = groceryList
        .filter(item => !item.checked)
        .map(item => `☐ ${item.name} - ${item.quantity} ${item.unit}`)
        .join('\n');

      Alert.alert('Share List', text, [
        { text: 'OK', style: 'default' },
      ]);
    }
  }, [groceryList, onShare]);

  // Clear checked items
  const clearCheckedItems = useCallback(() => {
    Alert.alert(
      'Clear Checked Items',
      'Remove all checked items from your list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setGroceryList(prev => prev.filter(item => !item.checked));
          },
        },
      ]
    );
  }, []);

  // Render category section
  const renderCategory = useCallback(([category, items]: [string, GroceryItem[]]) => {
    const isExpanded = expandedCategories.has(category);
    const checkedCount = items.filter(item => item.checked).length;

    return (
      <View key={category} style={styles.category}>
        <TouchableOpacity
          style={styles.categoryHeader}
          onPress={() => toggleCategoryExpanded(category)}
        >
          <View style={styles.categoryLeft}>
            <Ionicons
              name={isExpanded ? 'chevron-down' : 'chevron-forward'}
              size={20}
              color="#64748B"
            />
            <Text style={styles.categoryName}>{category}</Text>
            <Text style={styles.categoryCount}>
              {checkedCount}/{items.length}
            </Text>
          </View>
          <View style={styles.categoryProgress}>
            <View
              style={[
                styles.categoryProgressBar,
                { width: `${(checkedCount / items.length) * 100}%` },
              ]}
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.categoryItems}>
            {items.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.groceryItem}
                onPress={() => toggleItemChecked(item.id)}
              >
                <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
                  {item.checked && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                </View>
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, item.checked && styles.itemNameChecked]}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemDetails}>
                    {item.quantity} {item.unit}
                    {item.notes && ` • ${item.notes}`}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  }, [expandedCategories, toggleCategoryExpanded, toggleItemChecked]);

  // Main trigger button
  const TriggerButton = () => (
    <TouchableOpacity
      style={[styles.triggerButton, containerStyle]}
      onPress={generateList}
    >
      <LinearGradient
        colors={['#7C3AED', '#EC4899']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.triggerGradient}
      >
        <Ionicons name="cart-outline" size={20} color="#FFFFFF" />
        <Text style={styles.triggerButtonText}>
          {isPremium ? `Generate Grocery List (${recipes.length})` : 'Premium Feature'}
        </Text>
        {!isPremium && <Ionicons name="lock-closed" size={16} color="#FFFFFF" />}
      </LinearGradient>
    </TouchableOpacity>
  );

  // Non-premium users see just the locked button
  if (!isPremium) {
    return (
      <>
        <TriggerButton />

        <PremiumGate
          visible={showPremiumGate}
          onClose={() => setShowPremiumGate(false)}
          feature="Grocery List Generation"
        />
      </>
    );
  }

  return (
    <>
      <TriggerButton />

      <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Ionicons name="close" size={24} color="#1E293B" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Grocery List</Text>
            <TouchableOpacity onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color="#7C3AED" />
            </TouchableOpacity>
          </View>

          {/* Stats Bar */}
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Items</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.checked}</Text>
              <Text style={styles.statLabel}>Checked</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.categories}</Text>
              <Text style={styles.statLabel}>Categories</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>
              Shopping Progress: {Math.round((stats.checked / stats.total) * 100)}%
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(stats.checked / stats.total) * 100}%` },
                ]}
              />
            </View>
          </View>

          {/* Grocery List */}
          <ScrollView
            style={styles.listContent}
            contentContainerStyle={styles.listContentContainer}
          >
            {Object.entries(itemsByCategory).map(renderCategory)}

            {groceryList.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="basket-outline" size={64} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>Your List is Empty</Text>
                <Text style={styles.emptyText}>
                  Add recipes to generate a shopping list
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Footer Actions */}
          {groceryList.length > 0 && (
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.footerButton}
                onPress={clearCheckedItems}
              >
                <Ionicons name="trash-outline" size={20} color="#64748B" />
                <Text style={styles.footerButtonText}>Clear Checked</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.footerButtonPrimary}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.footerButtonTextPrimary}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
};

// =============================================================================
// Styles
// =============================================================================

const styles = StyleSheet.create({
  triggerButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginTop: 16,
  },
  triggerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  triggerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  statsBar: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  progressLabel: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  listContent: {
    flex: 1,
  },
  listContentContainer: {
    padding: 16,
  },
  // Category
  category: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  categoryCount: {
    fontSize: 13,
    color: '#64748B',
  },
  categoryProgress: {
    width: 60,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  categoryProgressBar: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  categoryItems: {
    marginTop: 8,
    marginLeft: 16,
  },
  // Grocery Item
  groceryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  itemDetails: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
  },
  // Footer
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  footerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  footerButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  footerButtonPrimary: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    alignItems: 'center',
  },
  footerButtonTextPrimary: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default GroceryListGenerator;
