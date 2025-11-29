/**
 * CaloriTrack - Creative Streak Card Component
 * Minimal. Cool. Aesthetic.
 * Figma Design: https://www.figma.com/design/V4OjFZYz1hhZdeWSgZyYtu/Calories-Pages?node-id=11-22&m=dev
 * Shows 7-day weekly streak with creative fire design
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface StreakCardProps {
  currentStreak: number;
  bestStreak: number;
  weekDays: boolean[]; // 7 days of the week
  onPress?: () => void;
}

const StreakCard: React.FC<StreakCardProps> = ({
  currentStreak,
  bestStreak,
  weekDays,
  onPress,
}) => {
  const animatedValue = React.useRef(new Animated.Value(1)).current;
  const flameAnimations = weekDays.map(() => React.useRef(new Animated.Value(1)).current);

  // Main fire animation on mount or streak change
  React.useEffect(() => {
    if (currentStreak > 0) {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Animate individual flames
      weekDays.forEach((isCompleted, index) => {
        if (isCompleted) {
          setTimeout(() => {
            Animated.sequence([
              Animated.timing(flameAnimations[index], {
                toValue: 1.3,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(flameAnimations[index], {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
              }),
            ]).start();
          }, index * 100); // Stagger animation
        }
      });
    }
  }, [currentStreak, weekDays]);

  // Get week day labels (Pzt-Paz)
  const weekDayLabels = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  // Image-based flame component using reference image
  const FlameImage: React.FC<{ isCompleted: boolean; index: number }> = ({ isCompleted, index }) => {
    const animatedScale = flameAnimations[index];
    const flickerAnimation = React.useRef(new Animated.Value(1)).current;

    // Flicker animation for burning flames
    React.useEffect(() => {
      if (isCompleted) {
        const flicker = () => {
          Animated.sequence([
            Animated.timing(flickerAnimation, {
              toValue: 0.85,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(flickerAnimation, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setTimeout(flicker, Math.random() * 2500 + 1500); // Random flicker timing
          });
        };
        flicker();
      }
    }, [isCompleted]);

    if (isCompleted) {
      // Burning flame - original orange flame image
      return (
        <View style={styles.flameContainer}>
          <Animated.Image
            source={require('../../../assets/images/fire.png')}
            style={[
              styles.flameImage,
              {
                transform: [{ scale: animatedScale }],
                opacity: flickerAnimation,
                shadowColor: '#F59E0B',
                shadowOpacity: 0.4,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
              },
            ]}
            resizeMode="contain"
          />
        </View>
      );
    } else {
      // Dim flame - same image with reduced opacity and grayscale
      return (
        <View style={styles.flameContainer}>
          <Image
            source={require('../../../assets/images/fire.png')}
            style={[
              styles.flameImage,
              {
                opacity: 0.3,
                tintColor: '#CBD5E1',
              },
            ]}
            resizeMode="contain"
          />
        </View>
      );
    }
  };

  // Render week day
  const renderWeekDay = (isCompleted: boolean, index: number) => (
    <View key={index} style={styles.weekDayContainer}>
      <Text style={styles.weekDayLabel}>{weekDayLabels[index]}</Text>
      <FlameImage isCompleted={isCompleted} index={index} />
    </View>
  );

  const getStreakText = () => {
    if (currentStreak === 0) return "Seri başlat";
    if (currentStreak === 1) return "Harika başlangıç!";
    if (currentStreak < 7) return `${currentStreak} gün`;
    return `${currentStreak} gün 🔥`;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Minimalist Header */}
      <View style={styles.header}>
        <Animated.View
          style={[
            styles.fireIcon,
            {
              transform: [{ scale: animatedValue }],
              opacity: currentStreak > 0 ? 1 : 0.3,
              shadowColor: '#F97316',
              shadowOpacity: currentStreak > 0 ? 0.4 : 0,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
            },
          ]}
        >
          <Ionicons
            name="flame"
            size={24}
            color={currentStreak > 0 ? "#F97316" : "#CBD5E1"}
          />
        </Animated.View>
        <View style={styles.streakInfo}>
          <Text style={styles.streakText}>{getStreakText()}</Text>
          <Text style={styles.bestStreakText}>En iyi: {bestStreak} gün</Text>
        </View>
      </View>

      {/* 7-Day Week View with Creative Flames */}
      <View style={styles.weekContainer}>
        {weekDays.map((isCompleted, index) => renderWeekDay(isCompleted, index))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  fireIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  streakInfo: {
    flex: 1,
  },
  streakText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  bestStreakText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  weekDayContainer: {
    alignItems: 'center',
    flex: 1,
  },
  weekDayLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  // Flame Image Styles
  flameContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  flameImage: {
    width: 24,
    height: 24,
  },
});

export default StreakCard;