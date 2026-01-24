/**
 * RecipeSearch Component
 *
 * Minimal. Cool. Aesthetic.
 *
 * Search bar component with:
 * - Search input with clear button
 * - Search history
 * - Popular searches
 * - Focus overlay with expanded view
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { RecipeFilters, SearchHistoryItem } from '@/types/recipe';

// =============================================================================
// Props
// =============================================================================

export interface RecipeSearchProps {
  /** Current search query */
  value: string;
  /** Callback when search query changes */
  onChangeText: (text: string) => void;
  /** Callback when search is submitted */
  onSearch: (query: string) => void;
  /** Callback when filter button is pressed */
  onFilterPress?: () => void;
  /** Placeholder text */
  placeholder?: string;
  /** Search history items */
  searchHistory?: string[];
  /** Popular search suggestions */
  popularSearches?: string[];
  /** Callback when history item is pressed */
  onHistoryItemPress?: (item: string) => void;
  /** Callback when clear history is pressed */
  onClearHistory?: () => void;
  /** Custom container style */
  containerStyle?: object;
  /** Show filter button */
  showFilterButton?: boolean;
  /** Auto-focus search input */
  autoFocus?: boolean;
}

// =============================================================================
// Component
// =============================================================================

export const RecipeSearch: React.FC<RecipeSearchProps> = ({
  value,
  onChangeText,
  onSearch,
  onFilterPress,
  placeholder = 'Search for recipes',
  searchHistory = [],
  popularSearches = [
    'Chicken',
    'Salad',
    'Pasta',
    'Soup',
    'Vegan',
    'Keto',
    'Healthy',
    'Quick',
  ],
  onHistoryItemPress,
  onClearHistory,
  containerStyle,
  showFilterButton = true,
  autoFocus = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // Handle text change
  const handleChangeText = useCallback((text: string) => {
    onChangeText(text);
  }, [onChangeText]);

  // Handle search submission
  const handleSubmit = useCallback(() => {
    if (value.trim()) {
      onSearch(value.trim());
      setShowOverlay(false);
      Keyboard.dismiss();
    }
  }, [value, onSearch]);

  // Handle focus
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setShowOverlay(true);
  }, []);

  // Handle blur
  const handleBlur = useCallback(() => {
    setIsFocused(false);
    // Don't hide overlay immediately to allow tapping on history items
  }, []);

  // Handle overlay close
  const handleCloseOverlay = useCallback(() => {
    setShowOverlay(false);
    setIsFocused(false);
    Keyboard.dismiss();
  }, []);

  // Handle history item press
  const handleHistoryItemPress = useCallback((item: string) => {
    onChangeText(item);
    onSearch(item);
    setShowOverlay(false);
    Keyboard.dismiss();
    if (onHistoryItemPress) {
      onHistoryItemPress(item);
    }
  }, [onChangeText, onSearch, onHistoryItemPress]);

  // Handle clear search
  const handleClear = useCallback(() => {
    onChangeText('');
  }, [onChangeText]);

  // Handle clear history
  const handleClearHistory = useCallback(() => {
    if (onClearHistory) {
      onClearHistory();
    }
  }, [onClearHistory]);

  // Handle clear individual history item
  const handleRemoveHistoryItem = useCallback((item: string, e: any) => {
    e.stopPropagation();
    // This would be handled by parent through a callback
    // For now, just prevent the item press
  }, []);

  return (
    <>
      {/* Search Bar */}
      <View style={[styles.container, containerStyle]}>
        <View style={[styles.searchBar, isFocused && styles.searchBarFocused]}>
          <Ionicons
            name="search"
            size={20}
            color={isFocused ? '#7C3AED' : '#94A3B8'}
            style={styles.searchIcon}
          />

          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#94A3B8"
            value={value}
            onChangeText={handleChangeText}
            onSubmitEditing={handleSubmit}
            onFocus={handleFocus}
            onBlur={handleBlur}
            returnKeyType="search"
            autoFocus={autoFocus}
          />

          {value.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClear}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}

          {showFilterButton && (
            <TouchableOpacity
              style={styles.filterButton}
              onPress={onFilterPress}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name="options-outline"
                size={20}
                color={isFocused ? '#7C3AED' : '#94A3B8'}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Overlay Modal */}
      <Modal
        visible={showOverlay}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseOverlay}
      >
        <SafeAreaView style={styles.overlay} edges={['top']}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

          {/* Overlay Header */}
          <View style={styles.overlayHeader}>
            <TouchableOpacity
              style={styles.overlayBackButton}
              onPress={handleCloseOverlay}
            >
              <Ionicons name="chevron-down" size={24} color="#1E293B" />
            </TouchableOpacity>

            <View style={styles.overlayInputContainer}>
              <Ionicons
                name="search"
                size={20}
                color="#94A3B8"
                style={{ marginRight: 12 }}
              />
              <TextInput
                style={styles.overlayInput}
                placeholder="Search for recipes"
                placeholderTextColor="#94A3B8"
                value={value}
                onChangeText={handleChangeText}
                onSubmitEditing={handleSubmit}
                returnKeyType="search"
                autoFocus={true}
              />
              {value.length > 0 && (
                <TouchableOpacity onPress={handleClear}>
                  <Ionicons name="close-circle" size={18} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.overlayContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Recent Searches */}
            {searchHistory.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent Searches</Text>
                  <TouchableOpacity onPress={handleClearHistory}>
                    <Text style={styles.clearHistoryText}>Clear All</Text>
                  </TouchableOpacity>
                </View>

                {searchHistory.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.historyItem}
                    onPress={() => handleHistoryItemPress(item)}
                  >
                    <Ionicons
                      name="time-outline"
                      size={18}
                      color="#94A3B8"
                      style={styles.historyIcon}
                    />
                    <Text style={styles.historyText}>{item}</Text>
                    <TouchableOpacity
                      style={styles.removeHistoryButton}
                      onPress={(e) => handleRemoveHistoryItem(item, e)}
                    >
                      <Ionicons name="close" size={16} color="#CBD5E1" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {searchHistory.length === 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <Text style={styles.emptyText}>No recent searches</Text>
              </View>
            )}

            {/* Popular Searches */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Popular Searches</Text>
              <View style={styles.popularTags}>
                {popularSearches.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.popularTag}
                    onPress={() => handleHistoryItemPress(item)}
                  >
                    <Text style={styles.popularTagText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Search Tips */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Search Tips</Text>
              <View style={styles.tipsContainer}>
                <View style={styles.tipItem}>
                  <Ionicons name="bulb-outline" size={16} color="#7C3AED" />
                  <Text style={styles.tipText}>
                    Try searching for ingredients, dish names, or cuisines
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons name="bulb-outline" size={16} color="#7C3AED" />
                  <Text style={styles.tipText}>
                    Use filters to narrow down by diet, calories, or time
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
};

// =============================================================================
// Styles
// =============================================================================

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
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
    borderWidth: 1,
    borderColor: 'transparent',
  },
  searchBarFocused: {
    borderColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOpacity: 0.15,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    padding: 4,
    marginLeft: 8,
  },
  // Overlay
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
  },
  overlayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  overlayBackButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  overlayInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  overlayInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    paddingVertical: 0,
  },
  overlayContent: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
    paddingTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  clearHistoryText: {
    fontSize: 14,
    color: '#7C3AED',
    fontWeight: '500',
  },
  // History Items
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 8,
  },
  historyIcon: {
    marginRight: 12,
  },
  historyText: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
  },
  removeHistoryButton: {
    padding: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    paddingVertical: 24,
  },
  // Popular Tags
  popularTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  popularTag: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  popularTagText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  // Tips
  tipsContainer: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FAF5FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#581C87',
    lineHeight: 20,
  },
});

export default RecipeSearch;
