/**
 * CaloriTrack - Dashboard Profile Screen
 * Minimal. Cool. Aesthetic.
 */

import { FIREBASE_CONFIG } from '@/constants/firebase';
import { BORDER_RADIUS, COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useUser } from '@/context/user-context';
import { Ionicons } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const ProfileDashboardScreen = () => {
  const router = useRouter();
  const { userData, user, refreshUserData } = useUser();
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState({
    totalDays: 0,
    totalCalories: 0,
    goalsCompleted: 0,
    currentStreak: 0
  });

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
      danger: '#EF4444',
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

  // Get user display name
  const getDisplayName = () => {
    if (userData?.profile?.name) {
      return `${userData.profile.name} ${userData.profile.lastName || ''}`;
    }
    if (user?.displayName) {
      return user.displayName;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Kullanıcı';
  };

  // Get formatted join date
  const getJoinDate = () => {
    if (userData?.createdAt) {
      const date = new Date(userData.createdAt);
      return date.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
    return 'Bilinmiyor';
  };

  // Calculate stats from user data
  useEffect(() => {
    const calculateStats = async () => {
      if (!userData || !user) return;

      try {
        // Calculate days since joining
        let totalDays = 0;
        if (userData.createdAt) {
          const joinDate = new Date(userData.createdAt);
          const today = new Date();
          const diffTime = Math.abs(today.getTime() - joinDate.getTime());
          totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        // Get food logs for calorie count
        let totalCalories = 0;
        let goalsCompleted = 0;

        const foodLogsSnapshot = await firestore()
          .collection(FIREBASE_CONFIG.collections.foodLogs)
          .where('userId', '==', user.uid)
          .get();

        foodLogsSnapshot.forEach(doc => {
          const log = doc.data();
          if (log.calories) {
            totalCalories += log.calories;
          }
        });

        // Check for completed goals (simplified logic)
        if (userData.goals?.targetWeight && userData.progress?.currentWeight) {
          const currentWeight = userData.progress.currentWeight;
          const targetWeight = userData.goals.targetWeight;
          const startingWeight = userData.progress.startingWeight || currentWeight;

          // Calculate progress percentage
          const totalGoal = Math.abs(startingWeight - targetWeight);
          const currentProgress = Math.abs(startingWeight - currentWeight);

          if (totalGoal > 0 && currentProgress >= totalGoal) {
            goalsCompleted = 1;
          }
        }

        setUserStats({
          totalDays,
          totalCalories: Math.round(totalCalories),
          goalsCompleted,
          currentStreak: userData.progress?.timeOnApp || 0
        });
      } catch (error) {
        console.error('Error calculating stats:', error);
      }
    };

    calculateStats();
  }, [userData, user]);

  const profileSections = [
    {
      title: 'Kişisel Bilgiler',
      items: [
        { label: 'Ad Soyad', value: getDisplayName(), icon: '👤' },
        { label: 'E-posta', value: user?.email || 'Bilinmiyor', icon: '📧' },
        { label: 'Telefon', value: userData?.commitment?.phone || 'Belirtilmemiş', icon: '📱' },
        {
          label: 'Doğum Tarihi',
          value: userData?.profile?.dateOfBirth || 'Belirtilmemiş',
          icon: '🎂'
        },
        {
          label: 'Yaş',
          value: userData?.profile?.age ? `${userData.profile.age} yaş` : 'Belirtilmemiş',
          icon: '🎂'
        },
      ]
    },
    {
      title: 'Sağlık Bilgileri',
      items: [
        {
          label: 'Boy',
          value: userData?.profile?.height ? `${userData.profile.height} cm` : 'Belirtilmemiş',
          icon: '📏'
        },
        {
          label: 'Mevcut Kilo',
          value: userData?.profile?.currentWeight ? `${userData.profile.currentWeight} kg` : 'Belirtilmemiş',
          icon: '⚖️'
        },
        {
          label: 'Hedef Kilo',
          value: userData?.goals?.targetWeight ? `${userData.goals.targetWeight} kg` : 'Belirtilmemiş',
          icon: '🎯'
        },
        {
          label: 'Aktivite Seviyesi',
          value: userData?.activity?.level === 'sedentary' ? 'Düşük' :
                userData?.activity?.level === 'lightly_active' ? 'Hafif Aktif' :
                userData?.activity?.level === 'moderately_active' ? 'Orta Aktif' :
                userData?.activity?.level === 'very_active' ? 'Çok Aktif' : 'Bilinmiyor',
          icon: '🏃'
        },
        {
          label: 'Cinsiyet',
          value: userData?.profile?.gender === 'male' ? 'Erkek' :
                userData?.profile?.gender === 'female' ? 'Kadın' : 'Belirtilmemiş',
          icon: '⚧️'
        }
      ]
    },
    {
      title: 'Hedefler',
      items: [
        {
          label: 'Ana Hedef',
          value: userData?.goals?.primaryGoal === 'weight_loss' ? 'Kilo Verme' :
                userData?.goals?.primaryGoal === 'muscle_gain' ? 'Kas Kazanma' :
                userData?.goals?.primaryGoal === 'maintenance' ? 'Koruma' : 'Belirtilmemiş',
          icon: '🏆'
        },
        {
          label: 'Haftalık Hedef',
          value: userData?.goals?.weeklyGoal ? `${userData.goals.weeklyGoal} kg` : 'Belirtilmemiş',
          icon: '📊'
        },
        {
          label: 'Günlük Kalori Hedefi',
          value: userData?.calculatedValues?.dailyCalorieGoal ? `${userData.calculatedValues.dailyCalorieGoal} kcal` : 'Belirtilmemiş',
          icon: '🔥'
        },
        {
          label: 'Beslenme Tipi',
          value: userData?.diet?.type === 'omnivore' ? 'Her Şeyden Yer' :
                userData?.diet?.type === 'vegetarian' ? 'Vejetaryen' :
                userData?.diet?.type === 'vegan' ? 'Vegan' :
                userData?.diet?.type === 'pescatarian' ? 'Pesketaryen' : 'Belirtilmemiş',
          icon: '🥗'
        },
        {
          label: 'Katılım Tarihi',
          value: getJoinDate(),
          icon: '📅'
        }
      ]
    },
  ];

  // Dynamic styles using updated theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.semanticColors.background.primary,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: theme.spacing['2xl'],
    },
    header: {
      paddingHorizontal: theme.spacing['2xl'],
      paddingTop: theme.spacing['4xl'],
      paddingBottom: theme.spacing['2xl'],
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
    content: {
      paddingHorizontal: theme.spacing['2xl'],
    },
    section: {
      marginBottom: theme.spacing['2xl'],
    },

    // Profile Header
    profileHeader: {
      backgroundColor: theme.semanticColors.background.primary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      padding: theme.spacing['2xl'],
      alignItems: 'center',
      marginBottom: theme.spacing['2xl'],
      ...theme.shadows.sm,
    },
    avatarContainer: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.full,
      backgroundColor: `${theme.colors.primary}20`,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    avatarText: {
      fontSize: 32,
    },
    name: {
      fontSize: 20,
      fontWeight: '700' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    email: {
      fontSize: 14,
      color: theme.semanticColors.text.secondary,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    levelBadge: {
      backgroundColor: `${theme.colors.warning}20`,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
      marginBottom: theme.spacing.md,
    },
    levelText: {
      fontSize: 12,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.colors.warning,
    },
    memberInfo: {
      fontSize: 12,
      color: theme.semanticColors.text.tertiary,
    },

    // Stats Grid
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: theme.spacing['2xl'],
    },
    statCard: {
      width: (width - theme.spacing['2xl'] * 2 - theme.spacing.md) / 2,
      backgroundColor: theme.semanticColors.background.primary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      padding: theme.spacing.lg,
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    statIcon: {
      fontSize: 24,
      marginBottom: theme.spacing.sm,
    },
    statValue: {
      fontSize: 18,
      fontWeight: '700' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    statLabel: {
      fontSize: 10,
      color: theme.semanticColors.text.tertiary,
      textAlign: 'center',
    },

    // Profile Sections
    sectionCard: {
      backgroundColor: theme.semanticColors.background.primary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.lg,
    },
    profileItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    profileItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    itemIcon: {
      fontSize: 16,
      marginRight: theme.spacing.md,
      width: 20,
      textAlign: 'center',
    },
    itemInfo: {
      flex: 1,
    },
    itemLabel: {
      fontSize: 12,
      color: theme.semanticColors.text.tertiary,
      marginBottom: 2,
    },
    itemValue: {
      fontSize: 14,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
    },

    // Action Buttons
    actionButtons: {
      marginBottom: theme.spacing['4xl'],
    },

    // Bottom Navigation - Modern style (from index.tsx)
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
    actionButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      ...theme.shadows.md,
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
    },
    actionButtonText: {
      fontSize: 16,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.onPrimary,
    },
    secondaryButtonText: {
      color: theme.semanticColors.text.primary,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Kişisel Profil</Text>
          <Text style={styles.subtitle}>Bilgilerinizi yönetin</Text>
        </View>

        <View style={styles.content}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{getDisplayName().charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.name}>{getDisplayName()}</Text>
            <Text style={styles.email}>{user?.email || 'Bilinmiyor'}</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Aktif Üye</Text>
            </View>
            <Text style={styles.memberInfo}>
              {userStats.totalDays} gün • {getJoinDate()}'den beri üye
            </Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📅</Text>
              <Text style={styles.statValue}>{userStats.totalDays}</Text>
              <Text style={styles.statLabel}>Toplam Gün</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🔥</Text>
              <Text style={styles.statValue}>{userStats.totalCalories.toLocaleString('tr-TR')}</Text>
              <Text style={styles.statLabel}>Kalori Kaydedilen</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🎯</Text>
              <Text style={styles.statValue}>{userStats.goalsCompleted}</Text>
              <Text style={styles.statLabel}>Hedef Tamamlanan</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>⚡</Text>
              <Text style={styles.statValue}>{userStats.currentStreak} gün</Text>
              <Text style={styles.statLabel}>Uygulamada Geçen Süre</Text>
            </View>
          </View>

          {/* Profile Sections */}
          {profileSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map((item, itemIndex) => (
                <View key={itemIndex} style={styles.profileItem}>
                  <Text style={styles.itemIcon}>{item.icon}</Text>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemLabel}>{item.label}</Text>
                    <Text style={styles.itemValue}>{item.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>📝 Profili Düzenle</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
              <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>⚙️ Ayarlar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
              <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>🚪 Çıkış Yap</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation - Modern style */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard')}>
          <Ionicons name="home-outline" size={24} color="#94A3B8" style={styles.navIcon} />
          <Text style={styles.navLabel}>Ana Sayfa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard/camera')}>
          <Ionicons name="camera-outline" size={24} color="#94A3B8" style={styles.navIcon} />
          <Text style={styles.navLabel}>Kamera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard/meals')}>
          <Ionicons name="restaurant-outline" size={24} color="#94A3B8" style={styles.navIcon} />
          <Text style={styles.navLabel}>Tarifler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={24} color="#7C3AED" style={styles.navIcon} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileDashboardScreen;