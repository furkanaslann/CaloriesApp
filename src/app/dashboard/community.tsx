/**
 * CaloriTrack - Dashboard Community Screen
 * Minimal. Cool. Aesthetic.
 */

import BottomNavigation from '@/components/navigation/BottomNavigation';
import { BORDER_RADIUS, COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import React from 'react';
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  achievement: boolean;
}

const CommunityDashboardScreen = () => {
  // Create theme object that matches expected structure
  const theme = {
    semanticColors: {
      background: { primary: COLORS.background },
      text: {
        primary: COLORS.textPrimary,
        secondary: COLORS.textSecondary,
        tertiary: COLORS.textTertiary,
        onPrimary: '#FFFFFF'
      },
      border: { primary: COLORS.border },
      onPrimary: '#FFFFFF',
    },
    colors: {
      primary: COLORS.primary,
      gradientStart: COLORS.primary,
      gradientEnd: '#EC4899',
      success: '#10B981',
      warning: '#F59E0B',
    },
    textStyles: {
      onboardingHero: { fontSize: TYPOGRAPHY.fontSizes['4xl'] },
      onboardingTitle: { fontSize: TYPOGRAPHY.fontSizes['3xl'], fontWeight: '600' },
      onboardingSubtitle: { fontSize: TYPOGRAPHY.fontSizes['xl'], fontWeight: '500' },
      onboardingDescription: { fontSize: TYPOGRAPHY.fontSizes.base },
    },
    spacing: {
      ...SPACING,
      sm: SPACING[2],
      md: SPACING[3],
      lg: SPACING[4],
      xl: SPACING[5],
      '2xl': SPACING[6],
      '4xl': SPACING[12],
    },
    borderRadius: BORDER_RADIUS,
    shadows: SHADOWS,
    coloredShadows: { gradient: SHADOWS.lg },
  };

  // Community posts data
  const communityPosts: CommunityPost[] = [
    {
      id: '1',
      author: 'Ayşe K.',
      avatar: '👩',
      time: '2 saat önce',
      content: 'Bugün 5kg kaybettiğimi fark ettim! Motivasyon yüksek 🎉',
      likes: 24,
      comments: 8,
      achievement: true
    },
    {
      id: '2',
      author: 'Mehmet D.',
      avatar: '👨',
      time: '4 saat önce',
      content: 'Yeni beslenme planımı başlattım, ilk hafta harika geçiyor!',
      likes: 18,
      comments: 5,
      achievement: false
    },
    {
      id: '3',
      author: 'Zeynep A.',
      avatar: '👩‍💼',
      time: '6 saat önce',
      content: 'Günlük 10.000 adım hedefime ulaştım 💪',
      likes: 31,
      comments: 12,
      achievement: true
    },
  ];

  // Dynamic styles using updated theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.semanticColors.background.primary,
    },
    header: {
      paddingHorizontal: theme.spacing['2xl'],
      paddingTop: theme.spacing['4xl'],
      paddingBottom: theme.spacing['2xl'],
      borderBottomWidth: 1,
      borderBottomColor: theme.semanticColors.border.primary,
    },
    title: {
      fontSize: theme.textStyles.onboardingTitle?.fontSize || 30,
      fontWeight: (theme.textStyles.onboardingTitle?.fontWeight || '600') as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: theme.textStyles.onboardingSubtitle?.fontSize || 18,
      fontWeight: (theme.textStyles.onboardingSubtitle?.fontWeight || '400') as TextStyle['fontWeight'],
      color: theme.semanticColors.text.secondary,
    },
    postsContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing['2xl'],
    },
    postCard: {
      backgroundColor: theme.semanticColors.background.primary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    postHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.full,
      backgroundColor: `${theme.colors.primary}20`,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    avatarText: {
      fontSize: 20,
    },
    authorInfo: {
      flex: 1,
    },
    authorName: {
      fontSize: 16,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: 2,
    },
    postTime: {
      fontSize: 12,
      color: theme.semanticColors.text.tertiary,
    },
    achievementBadge: {
      backgroundColor: theme.colors.success + '20',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.md,
    },
    achievementText: {
      fontSize: 10,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.colors.success,
    },
    postContent: {
      fontSize: 14,
      color: theme.semanticColors.text.primary,
      lineHeight: 20,
      marginBottom: theme.spacing.md,
    },
    postActions: {
      flexDirection: 'row',
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.semanticColors.border.primary,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: theme.spacing['2xl'],
    },
    actionIcon: {
      fontSize: 16,
      marginRight: theme.spacing.sm,
    },
    actionText: {
      fontSize: 14,
      color: theme.semanticColors.text.secondary,
    },
    floatingButton: {
      position: 'absolute',
      bottom: theme.spacing['2xl'],
      right: theme.spacing['2xl'],
      width: 56,
      height: 56,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.shadows.lg,
    },
    floatingButtonText: {
      fontSize: 24,
      color: theme.semanticColors.onPrimary,
    },
  });

  const renderPost: ListRenderItem<CommunityPost> = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.avatar}</Text>
        </View>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{item.author}</Text>
          <Text style={styles.postTime}>{item.time}</Text>
        </View>
        {item.achievement && (
          <View style={styles.achievementBadge}>
            <Text style={styles.achievementText}>🏆 Başarı</Text>
          </View>
        )}
      </View>
      <Text style={styles.postContent}>{item.content}</Text>
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>❤️</Text>
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>📤</Text>
          <Text style={styles.actionText}>Paylaş</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sosyal Destek</Text>
        <Text style={styles.subtitle}>Topluluğa katılın</Text>
      </View>

      <FlatList
        style={styles.postsContainer}
        data={communityPosts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: theme.spacing['4xl'] }}
      />

      <TouchableOpacity style={styles.floatingButton}>
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <BottomNavigation activeRoute="/dashboard/community" />
    </SafeAreaView>
  );
};

export default CommunityDashboardScreen;