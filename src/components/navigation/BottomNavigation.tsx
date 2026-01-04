/**
 * CaloriTrack - Bottom Navigation Component
 * Minimal. Cool. Aesthetic.
 *
 * Ortak Bottom Navigation component'i.
 * Tüm dashboard sayfalarında tek bir noktadan yönetilir.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';

export interface NavigationItem {
  route: string;
  icon: string;
  iconActive: string;
  label: string;
}

interface BottomNavigationProps {
  activeRoute: string;
}

const navigationItems: NavigationItem[] = [
  { route: '/dashboard', icon: 'home-outline', iconActive: 'home', label: 'Ana Sayfa' },
  { route: '/dashboard/camera', icon: 'camera-outline', iconActive: 'camera', label: 'Kamera' },
  { route: '/recipes', icon: 'restaurant-outline', iconActive: 'restaurant', label: 'Tarifler' },
  { route: '/dashboard/profile', icon: 'person-outline', iconActive: 'person', label: 'Profil' },
];

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeRoute }) => {
  const router = useRouter();

  const isActive = (route: string) => {
    return activeRoute === route;
  };

  return (
    <View style={styles.bottomNav}>
      {navigationItems.map((item) => (
        <TouchableOpacity
          key={item.route}
          style={styles.navItem}
          onPress={() => router.push(item.route)}
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
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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

export default BottomNavigation;
