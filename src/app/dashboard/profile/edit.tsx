/**
 * CaloriTrack - Profile Edit Screen
 * Minimal. Cool. Aesthetic.
 */

import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@/context/user-context';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme';
import Button from '@/components/ui/button';

const ProfileEditScreen = () => {
  const { userData, updateUserProfile, updateUserGoals, updateUserActivity } = useUser();
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Form states
  const [gender, setGender] = useState(userData?.profile?.gender || 'male');
  const [activityLevel, setActivityLevel] = useState(userData?.activity?.level || 'sedentary');
  const [primaryGoal, setPrimaryGoal] = useState(userData?.goals?.primaryGoal || 'weight_loss');

  // Theme
  const theme = {
    semanticColors: {
      background: { primary: COLORS.background, surface: '#F8FAFC' },
      text: {
        primary: COLORS.textPrimary,
        secondary: COLORS.textSecondary,
        tertiary: COLORS.textTertiary,
        onPrimary: '#FFFFFF'
      },
      border: { primary: COLORS.border },
    },
    colors: {
      primary: COLORS.primary,
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    textStyles: {
      onboardingTitle: { fontSize: TYPOGRAPHY.fontSizes['3xl'], fontWeight: '600' },
      onboardingSubtitle: { fontSize: TYPOGRAPHY.fontSizes.xl, fontWeight: '500' },
      sectionTitle: { fontSize: TYPOGRAPHY.fontSizes['2xl'], fontWeight: '600' },
      cardTitle: { fontSize: TYPOGRAPHY.fontSizes.lg, fontWeight: '600' },
      body: { fontSize: TYPOGRAPHY.fontSizes.base, fontWeight: '400' },
      caption: { fontSize: TYPOGRAPHY.fontSizes.sm, fontWeight: '400' },
    },
    spacing: SPACING,
    borderRadius: BORDER_RADIUS,
    shadows: SHADOWS,
  };

  // Options from onboarding flow
  const genderOptions = [
    { value: 'male', label: 'Erkek', icon: '👨', description: 'Erkek' },
    { value: 'female', label: 'Kadın', icon: '👩', description: 'Kadın' },
    { value: 'other', label: 'Diğer', icon: '👤', description: 'Diğer' },
  ];

  const activityLevels = [
    {
      value: 'sedentary',
      label: 'Hareketsiz',
      description: 'Çok az veya hiç egzersiz yapmıyorum, masa başı iş',
      icon: '🪑',
    },
    {
      value: 'lightly_active',
      label: 'Hafif Aktif',
      description: 'Haftada 1-3 gün hafif egzersiz',
      icon: '🚶',
    },
    {
      value: 'moderately_active',
      label: 'Orta Aktif',
      description: 'Haftada 3-5 gün orta egzersiz',
      icon: '🏃',
    },
    {
      value: 'very_active',
      label: 'Çok Aktif',
      description: 'Haftada 6-7 gün yoğun egzersiz',
      icon: '💪',
    },
    {
      value: 'extremely_active',
      label: 'Son Derece Aktif',
      description: 'Günlük çok yoğun fiziksel aktivite',
      icon: '🔥',
    },
  ];

  const goalOptions = [
    {
      value: 'weight_loss',
      label: 'Kilo Verme',
      description: 'Sağlıklı bir şekilde kilo verin',
      icon: '🎯',
      color: theme.colors.error,
    },
    {
      value: 'maintenance',
      label: 'Koruma',
      description: 'Mevcut kilonuzu koruyun',
      icon: '⚖️',
      color: theme.colors.primary,
    },
    {
      value: 'muscle_gain',
      label: 'Kas Kazanma',
      description: 'Kas kütlenizi artırın',
      icon: '💪',
      color: theme.colors.success,
    },
    {
      value: 'healthy_eating',
      label: 'Sağlıklı Beslenme',
      description: 'Beslenme alışkanlıklarınızı iyileştirin',
      icon: '🥗',
      color: theme.colors.info,
    },
  ];

  // Track changes
  useEffect(() => {
    const originalGender = userData?.profile?.gender || 'male';
    const originalActivity = userData?.activity?.level || 'sedentary';
    const originalGoal = userData?.goals?.primaryGoal || 'weight_loss';

    const hasChanged =
      gender !== originalGender ||
      activityLevel !== originalActivity ||
      primaryGoal !== originalGoal;

    setHasChanges(hasChanged);
  }, [gender, activityLevel, primaryGoal, userData]);

  const handleSave = async () => {
    if (!hasChanges) {
      Alert.alert('Bilgi', 'Değişiklik bulunmamaktadır.');
      return;
    }

    setLoading(true);
    try {
      // Update profile
      await updateUserProfile({ gender });

      // Update activity
      await updateUserActivity({ level: activityLevel });

      // Update goals
      await updateUserGoals({ primaryGoal });

      Alert.alert(
        'Başarılı',
        'Profiliniz başarıyla güncellendi.',
        [{ text: 'Tamam', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Emin misiniz?',
        'Yapılan değişiklikler kaybolacaktır.',
        [
          { text: 'İptal', style: 'cancel' },
          { text: 'Evet', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.semanticColors.background.primary,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: theme.spacing['2xl'],
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing['4xl'],
      paddingTop: theme.spacing['2xl'],
    },
    title: {
      ...theme.textStyles.onboardingTitle,
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    subtitle: {
      ...theme.textStyles.body,
      color: theme.semanticColors.text.secondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    section: {
      marginBottom: theme.spacing['4xl'],
    },
    sectionTitle: {
      ...theme.textStyles.sectionTitle,
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.xl,
    },
    optionGrid: {
      gap: theme.spacing.md,
    },
    optionCard: {
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      backgroundColor: theme.semanticColors.background.primary,
      ...theme.shadows.sm,
    },
    optionCardSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: `${theme.colors.primary}10`,
    },
    optionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    optionIcon: {
      fontSize: 28,
      marginRight: theme.spacing.lg,
    },
    optionContent: {
      flex: 1,
    },
    optionLabel: {
      ...theme.textStyles.cardTitle,
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    optionLabelSelected: {
      color: theme.colors.primary,
    },
    optionDescription: {
      ...theme.textStyles.caption,
      color: theme.semanticColors.text.secondary,
      lineHeight: 18,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing['2xl'],
      paddingBottom: theme.spacing['4xl'],
      paddingTop: theme.spacing.xl,
      backgroundColor: theme.semanticColors.background.primary,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      ...theme.shadows.lg,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: theme.spacing.md,
      ...theme.textStyles.body,
      color: theme.semanticColors.text.secondary,
    },
  });

  // Loading state
  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Profili Düzenle</Text>
            <Text style={styles.subtitle}>
              Sağlık bilgilerinizi ve hedeflerinizi güncelleyin
            </Text>
          </View>

          {/* Sağlık Bilgileri Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏥 Sağlık Bilgileri</Text>

            {/* Gender Selection */}
            <View style={styles.optionGrid}>
              <Text style={styles.sectionTitle}>Cinsiyet</Text>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionCard,
                    gender === option.value && styles.optionCardSelected,
                  ]}
                  onPress={() => setGender(option.value)}
                >
                  <View style={styles.optionHeader}>
                    <Text style={styles.optionIcon}>{option.icon}</Text>
                    <View style={styles.optionContent}>
                      <Text
                        style={[
                          styles.optionLabel,
                          gender === option.value && styles.optionLabelSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                      <Text style={styles.optionDescription}>
                        {option.description}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Activity Level Selection */}
            <View style={styles.optionGrid}>
              <Text style={[styles.sectionTitle, { marginTop: theme.spacing['2xl'] }]}>
                Aktivite Seviyesi
              </Text>
              {activityLevels.map((level) => (
                <TouchableOpacity
                  key={level.value}
                  style={[
                    styles.optionCard,
                    activityLevel === level.value && styles.optionCardSelected,
                  ]}
                  onPress={() => setActivityLevel(level.value)}
                >
                  <View style={styles.optionHeader}>
                    <Text style={styles.optionIcon}>{level.icon}</Text>
                    <View style={styles.optionContent}>
                      <Text
                        style={[
                          styles.optionLabel,
                          activityLevel === level.value && styles.optionLabelSelected,
                        ]}
                      >
                        {level.label}
                      </Text>
                      <Text style={styles.optionDescription}>
                        {level.description}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Hedefler Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Hedefler</Text>

            {/* Primary Goal Selection */}
            <View style={styles.optionGrid}>
              <Text style={styles.sectionTitle}>Ana Hedef</Text>
              {goalOptions.map((goal) => (
                <TouchableOpacity
                  key={goal.value}
                  style={[
                    styles.optionCard,
                    primaryGoal === goal.value && styles.optionCardSelected,
                  ]}
                  onPress={() => setPrimaryGoal(goal.value)}
                >
                  <View style={styles.optionHeader}>
                    <Text style={styles.optionIcon}>{goal.icon}</Text>
                    <View style={styles.optionContent}>
                      <Text
                        style={[
                          styles.optionLabel,
                          primaryGoal === goal.value && styles.optionLabelSelected,
                        ]}
                      >
                        {goal.label}
                      </Text>
                      <Text style={styles.optionDescription}>
                        {goal.description}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Button Container */}
      <View style={styles.buttonContainer}>
        <Button
          title="İptal"
          onPress={handleCancel}
          variant="secondary"
        />
        <Button
          title={loading ? 'Kaydediliyor...' : 'Kaydet'}
          onPress={handleSave}
          disabled={!hasChanges || loading}
          style={theme.coloredShadows?.primary || {}}
        />
      </View>
    </SafeAreaView>
  );
};

export default ProfileEditScreen;