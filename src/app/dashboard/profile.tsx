/**
 * CaloriTrack - Dashboard Profile Screen
 * Minimal. Cool. Aesthetic.
 */

import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextStyle,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const ProfileDashboardScreen = () => {
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

  // Profile data
  const profileData = {
    name: 'Ahmet Yılmaz',
    email: 'ahmet.yilmaz@email.com',
    joinDate: '15 Ocak 2024',
    memberSince: '3 ay',
    level: 'Altın Üye',
    avatar: '👨‍💼'
  };

  const stats = [
    { label: 'Toplam Gün', value: '92', icon: '📅' },
    { label: 'Kalori Kaydedilen', value: '184.5k', icon: '🔥' },
    { label: 'Hedef Tamamlanan', value: '12', icon: '🎯' },
    { label: 'Aktif Seri', value: '15 gün', icon: '⚡' },
  ];

  const profileSections = [
    {
      title: 'Kişisel Bilgiler',
      items: [
        { label: 'Ad Soyad', value: profileData.name, icon: '👤' },
        { label: 'E-posta', value: profileData.email, icon: '📧' },
        { label: 'Telefon', value: '+90 532 123 4567', icon: '📱' },
        { label: 'Doğum Tarihi', value: '15 Mart 1990', icon: '🎂' },
      ]
    },
    {
      title: 'Sağlık Bilgileri',
      items: [
        { label: 'Boy', value: '175 cm', icon: '📏' },
        { label: 'Kilo', value: '72.5 kg', icon: '⚖️' },
        { label: 'Hedef Kilo', value: '70 kg', icon: '🎯' },
        { label: 'Aktivite Seviyesi', value: 'Orta', icon: '🏃' },
      ]
    },
    {
      title: 'Hedefler',
      items: [
        { label: 'Ana Hedef', value: 'Kilo Verme', icon: '🏆' },
        { label: 'Haftalık Hedef', value: '0.5 kg', icon: '📊' },
        { label: 'Günlük Kalori', value: '2000 kcal', icon: '🔥' },
        { label: 'Beslenme Tipi', value: 'Dengeli', icon: '🥗' },
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
              <Text style={styles.avatarText}>{profileData.avatar}</Text>
            </View>
            <Text style={styles.name}>{profileData.name}</Text>
            <Text style={styles.email}>{profileData.email}</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{profileData.level}</Text>
            </View>
            <Text style={styles.memberInfo}>
              {profileData.memberSince} • {profileData.joinDate}'den beri üye
            </Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
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
    </SafeAreaView>
  );
};

export default ProfileDashboardScreen;