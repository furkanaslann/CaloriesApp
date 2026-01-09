/**
 * CaloriTrack - Bottom Navigation Component
 * Minimal. Cool. Aesthetic.
 * Figma Design: https://www.figma.com/design/V4OjFZYz1hhZdeWSgZyYtu/Calories-Pages
 *
 * Modern bottom navigation with elevated center FAB button
 */

import { Ionicons } from '@expo/vector-icons';
import { Href, usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface NavigationItem {
  route: string;
  icon: string;
  iconActive: string;
  label: string;
}

interface BottomNavigationProps {
  activeRoute?: string;
}

const navigationItems: NavigationItem[] = [
  { route: '/dashboard', icon: 'home-outline', iconActive: 'home', label: 'Ana Sayfa' },
  { route: '/recipes', icon: 'restaurant-outline', iconActive: 'restaurant', label: 'Tarifler' },
  // Center FAB placeholder - not rendered in normal items
  { route: '__FAB__', icon: '', iconActive: '', label: '' },
  { route: '/dashboard/progress', icon: 'stats-chart-outline', iconActive: 'stats-chart', label: 'İlerleme' },
  { route: '/dashboard/profile', icon: 'person-outline', iconActive: 'person', label: 'Profil' },
];

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeRoute }) => {
  const router = useRouter();
  const pathname = usePathname();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  // Use pathname if activeRoute not provided
  const currentRoute = activeRoute || pathname;

  const isActive = (route: string) => {
    // Exact match for all routes
    if (currentRoute === route || currentRoute === `${route}/`) return true;

    // Special case: /dashboard should not match /dashboard/* routes
    if (route === '/dashboard') {
      return currentRoute === '/dashboard' || currentRoute === '/dashboard/';
    }

    // Special case: /recipes should match /recipes and /recipes/*
    if (route === '/recipes') {
      return currentRoute === '/recipes' || currentRoute.startsWith('/recipes/');
    }

    // For other routes, check if currentRoute starts with route + '/'
    return currentRoute.startsWith(route + '/');
  };

  const handleNavPress = (route: string) => {
    
    if (route === '__FAB__') {
      return;
    }

    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }, 100);

    // Always navigate, even if on the same route (to handle edge cases)
    try {
      // Try using replace instead of push for bottom nav (prevents stack buildup)
      if (route === '/dashboard') {
        // For dashboard, we might be in a nested route, so use replace
        router.replace(route as Href);
      } else {
        // For other routes, use push
        router.push(route as Href);
      }
    } catch (error) {
      // Fallback: try with replace
      try {
        router.replace(route as Href);
      } catch (replaceError) {
      }
    }
  };

  const handleFABPress = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }, 100);

    router.push('/dashboard/camera');
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav} pointerEvents="auto">
        {navigationItems.map((item, index) => {
          // Skip the center FAB placeholder
          if (item.route === '__FAB__') {
            return <View key="fab-spacer" style={styles.fabSpacer} />;
          }

          return (
            <TouchableOpacity
              key={item.route}
              style={styles.navItem}
              onPress={() => handleNavPress(item.route)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isActive(item.route) ? item.iconActive : item.icon as any}
                size={24}
                color={isActive(item.route) ? '#7C3AED' : '#94A3B8'}
                style={styles.navIcon}
              />
              <Text
                style={[
                  styles.navLabel,
                  isActive(item.route) && styles.navLabelActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Elevated Center FAB */}
      <Animated.View 
        style={[styles.fabContainer, { transform: [{ scale: scaleAnim }] }]}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          style={styles.fabButton}
          onPress={handleFABPress}
          activeOpacity={0.9}
        >
          <Ionicons name="camera" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingBottom: 30,
    paddingTop: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  navIcon: {
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  fabSpacer: {
    flex: 1,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  fabButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
});

export default BottomNavigation;
