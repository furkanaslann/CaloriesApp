/**
 * CaloriTrack - Dashboard Profile Screen
 * Minimal. Cool. Aesthetic.
 */

import BottomNavigation from '@/components/navigation/BottomNavigation';
import { FIREBASE_CONFIG } from '@/constants/firebase';
import { BORDER_RADIUS, COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useUser } from '@/context/user-context';
import { Ionicons } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const ProfileDashboardScreen = () => {
  const router = useRouter();
  const { userData, user, refreshUserData, signOut } = useUser();
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showGoalPicker, setShowGoalPicker] = useState(false);
  const [userStats, setUserStats] = useState({
    totalDays: 0,
    totalCalories: 0,
    goalsCompleted: 0,
    currentStreak: 0
  });

  const [editForm, setEditForm] = useState({
    firstName: userData?.profile?.name || '',
    lastName: userData?.profile?.lastName || '',
    phone: userData?.commitment?.phone || '',
    age: userData?.profile?.age?.toString() || '',
    height: userData?.profile?.height?.toString() || '',
    currentWeight: userData?.profile?.currentWeight?.toString() || '',
    targetWeight: userData?.goals?.targetWeight?.toString() || '',
    primaryGoal: userData?.goals?.primaryGoal || '',
    weeklyGoal: userData?.goals?.weeklyGoal?.toString() || '',
    timeline: userData?.goals?.timeline || ''
  });

  const goalOptions = [
    { value: 'weight_loss', label: 'Kilo Verme', icon: '🏃‍♂️' },
    { value: 'muscle_gain', label: 'Kas Kazanma', icon: '💪' },
    { value: 'maintenance', label: 'Koruma', icon: '⚖️' }
  ];

  // Handle edit profile
  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  
  // Handle settings
  const handleSettings = () => {
    router.push('/dashboard/settings');
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const updateData = {
        'profile.name': editForm.firstName,
        'profile.lastName': editForm.lastName,
        'profile.age': parseInt(editForm.age) || null,
        'profile.height': parseFloat(editForm.height) || null,
        'profile.currentWeight': parseFloat(editForm.currentWeight) || null,
        'commitment.phone': editForm.phone,
        'goals.targetWeight': parseFloat(editForm.targetWeight) || null,
        'goals.primaryGoal': editForm.primaryGoal,
        'goals.weeklyGoal': parseFloat(editForm.weeklyGoal) || null,
        'goals.timeline': editForm.timeline,
      };

      await firestore().collection(FIREBASE_CONFIG.collections.users).doc(user.uid).update(updateData);
      await refreshUserData();
      setShowEditModal(false);
      Alert.alert('Başarılı', 'Profiliniz başarıyla güncellendi.');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await signOut();
              router.replace('/onboarding/welcome');
            } catch (error) {
              console.error('Sign out error:', error);
              Alert.alert('Hata', 'Çıkış yapılamadı. Lütfen tekrar deneyin.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

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
        { label: 'Kullanıcı ID', value: user?.uid || 'Bilinmiyor', icon: '🔑' },
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

    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContainer: {
      backgroundColor: theme.semanticColors.background.primary,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      maxHeight: '90%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.semanticColors.border.primary,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
    },
    modalClose: {
      fontSize: 24,
      color: theme.semanticColors.text.secondary,
      paddingHorizontal: theme.spacing.sm,
    },
    modalContent: {
      padding: theme.spacing.lg,
      maxHeight: '70%',
    },
    inputGroup: {
      marginBottom: theme.spacing.lg,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '500' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.sm,
    },
    input: {
      backgroundColor: theme.semanticColors.background.primary,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      fontSize: 16,
      color: theme.semanticColors.text.primary,
    },
    inputRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    inputHalf: {
      width: '48%',
    },
    goalsSection: {
      marginTop: theme.spacing.xl,
    },
    sectionLabel: {
      fontSize: 16,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.lg,
    },
    pickerButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.semanticColors.background.primary,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    pickerContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    pickerText: {
      fontSize: 16,
      color: theme.semanticColors.text.primary,
      marginLeft: theme.spacing.sm,
    },
    pickerArrow: {
      fontSize: 12,
      color: theme.semanticColors.text.secondary,
    },
    dropdownList: {
      backgroundColor: theme.semanticColors.background.primary,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.md,
      marginTop: theme.spacing.xs,
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      zIndex: 1000,
      ...theme.shadows.lg,
    },
    dropdownItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    dropdownItemFirst: {
      borderTopLeftRadius: theme.borderRadius.md,
      borderTopRightRadius: theme.borderRadius.md,
    },
    dropdownItemLast: {
      borderBottomLeftRadius: theme.borderRadius.md,
      borderBottomRightRadius: theme.borderRadius.md,
    },
    dropdownItemSelected: {
      backgroundColor: `${theme.colors.primary}20`,
    },
    dropdownIcon: {
      fontSize: 16,
      marginRight: theme.spacing.sm,
    },
    dropdownLabel: {
      flex: 1,
      fontSize: 16,
      color: theme.semanticColors.text.primary,
    },
    dropdownCheck: {
      fontSize: 16,
      color: theme.colors.primary,
    },
    selectedIcon: {
      fontSize: 16,
    },
    modalButtons: {
      flexDirection: 'row',
      padding: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.semanticColors.border.primary,
      gap: theme.spacing.md,
    },
    modalButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
    },
    modalCancelButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
    },
    modalSaveButton: {
      backgroundColor: theme.colors.primary,
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: '600' as TextStyle['fontWeight'],
    },
    modalCancelText: {
      color: theme.semanticColors.text.primary,
    },
    modalSaveText: {
      color: theme.semanticColors.onPrimary,
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
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleEditProfile}
              disabled={loading}
            >
              <Text style={styles.actionButtonText}>📝 Profili Düzenle</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={handleSettings}
              disabled={loading}
            >
              <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>⚙️ Ayarlar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onLongPress={handleSignOut}
              disabled={loading}
              delayLongPress={1000} // 1 saniye sonra long press tetiklenir
            >
              <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>🚪 Çıkış Yap (Uzun Bas)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeRoute="/dashboard/profile" />

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowEditModal(false);
          setShowGoalPicker(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Profili Düzenle</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Text style={styles.modalClose}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* İsim ve Soyisim */}
              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, styles.inputHalf]}>
                  <Text style={styles.inputLabel}>Ad</Text>
                  <TextInput
                    style={styles.input}
                    value={editForm.firstName}
                    onChangeText={(text) => setEditForm(prev => ({ ...prev, firstName: text }))}
                    placeholder="Adınız"
                  />
                </View>
                <View style={[styles.inputGroup, styles.inputHalf]}>
                  <Text style={styles.inputLabel}>Soyad</Text>
                  <TextInput
                    style={styles.input}
                    value={editForm.lastName}
                    onChangeText={(text) => setEditForm(prev => ({ ...prev, lastName: text }))}
                    placeholder="Soyadınız"
                  />
                </View>
              </View>

              {/* Telefon */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Telefon</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.phone}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, phone: text }))}
                  placeholder="+90 5XX XXX XX XX"
                  keyboardType="phone-pad"
                />
              </View>

              {/* Yaş, Boy, Kilo */}
              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, styles.inputHalf]}>
                  <Text style={styles.inputLabel}>Yaş</Text>
                  <TextInput
                    style={styles.input}
                    value={editForm.age}
                    onChangeText={(text) => setEditForm(prev => ({ ...prev, age: text }))}
                    placeholder="25"
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.inputGroup, styles.inputHalf]}>
                  <Text style={styles.inputLabel}>Boy (cm)</Text>
                  <TextInput
                    style={styles.input}
                    value={editForm.height}
                    onChangeText={(text) => setEditForm(prev => ({ ...prev, height: text }))}
                    placeholder="175"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Mevcut Kilo ve Hedef Kilo */}
              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, styles.inputHalf]}>
                  <Text style={styles.inputLabel}>Mevcut Kilo (kg)</Text>
                  <TextInput
                    style={styles.input}
                    value={editForm.currentWeight}
                    onChangeText={(text) => setEditForm(prev => ({ ...prev, currentWeight: text }))}
                    placeholder="72.5"
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.inputGroup, styles.inputHalf]}>
                  <Text style={styles.inputLabel}>Hedef Kilo (kg)</Text>
                  <TextInput
                    style={styles.input}
                    value={editForm.targetWeight}
                    onChangeText={(text) => setEditForm(prev => ({ ...prev, targetWeight: text }))}
                    placeholder="70"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Hedefler Bölümü */}
              <View style={styles.goalsSection}>
                <Text style={styles.sectionLabel}>🎯 Hedefler</Text>

                {/* Ana Hedef */}
                <View style={[styles.inputGroup, { zIndex: 10 }]}>
                  <Text style={styles.inputLabel}>Ana Hedef</Text>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => setShowGoalPicker(!showGoalPicker)}
                  >
                    <View style={styles.pickerContent}>
                      {editForm.primaryGoal ? (
                        <>
                          <Text style={styles.selectedIcon}>
                            {goalOptions.find(opt => opt.value === editForm.primaryGoal)?.icon}
                          </Text>
                          <Text style={styles.pickerText}>
                            {goalOptions.find(opt => opt.value === editForm.primaryGoal)?.label}
                          </Text>
                        </>
                      ) : (
                        <Text style={[styles.pickerText, { color: theme.semanticColors.text.tertiary }]}>
                          Ana Hedef Seçin
                        </Text>
                      )}
                    </View>
                    <Text style={[styles.pickerArrow, { transform: [{ rotate: showGoalPicker ? '180deg' : '0deg' }] }]}>▼</Text>
                  </TouchableOpacity>

                  {/* Dropdown Listesi */}
                  {showGoalPicker && (
                    <View style={styles.dropdownList}>
                      {goalOptions.map((option, index) => (
                        <TouchableOpacity
                          key={option.value}
                          style={[
                            styles.dropdownItem,
                            index === 0 && styles.dropdownItemFirst,
                            index === goalOptions.length - 1 && styles.dropdownItemLast,
                            editForm.primaryGoal === option.value && styles.dropdownItemSelected
                          ]}
                          onPress={() => {
                            setEditForm(prev => ({ ...prev, primaryGoal: option.value }));
                            setShowGoalPicker(false);
                          }}
                        >
                          <Text style={styles.dropdownIcon}>{option.icon}</Text>
                          <Text style={styles.dropdownLabel}>{option.label}</Text>
                          {editForm.primaryGoal === option.value && (
                            <Text style={styles.dropdownCheck}>✓</Text>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Haftalık Hedef ve Timeline */}
                <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, styles.inputHalf]}>
                    <Text style={styles.inputLabel}>Haftalık Hedef (kg)</Text>
                    <TextInput
                      style={styles.input}
                      value={editForm.weeklyGoal}
                      onChangeText={(text) => setEditForm(prev => ({ ...prev, weeklyGoal: text }))}
                      placeholder="0.5"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={[styles.inputGroup, styles.inputHalf]}>
                    <Text style={styles.inputLabel}>Timeline</Text>
                    <TextInput
                      style={styles.input}
                      value={editForm.timeline}
                      onChangeText={(text) => setEditForm(prev => ({ ...prev, timeline: text }))}
                      placeholder="3 ay"
                    />
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowEditModal(false)}
                disabled={loading}
              >
                <Text style={[styles.modalButtonText, styles.modalCancelText]}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSaveButton]}
                onPress={handleSaveProfile}
                disabled={loading}
              >
                <Text style={[styles.modalButtonText, styles.modalSaveText]}>
                  {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileDashboardScreen;