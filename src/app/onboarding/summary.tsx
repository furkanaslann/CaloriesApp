/**
 * CaloriTrack - Onboarding Summary Screen
 * Minimal. Cool. Aesthetic.
 */

import { LightTheme } from '@/constants';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/button';
import { useOnboarding } from '../../context/onboarding-context';

const SummaryScreen = () => {
  const {
    profile,
    goals,
    activity,
    diet,
    preferences,
    calculatedValues,
    completeOnboarding
  } = useOnboarding();

  const [isCalculating, setIsCalculating] = useState(true);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Simulate calculation delay for dramatic effect
    const timer = setTimeout(() => {
      setIsCalculating(false);
      setShowResults(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    router.push('/onboarding/commitment');
  };

  const getGoalLabel = (goal: string) => {
    const goalLabels: Record<string, string> = {
      weight_loss: 'Kilo Verme',
      maintenance: 'Koruma',
      muscle_gain: 'Kas Kazanma',
      healthy_eating: 'Sağlıklı Beslenme',
    };
    return goalLabels[goal] || goal;
  };

  const getActivityLabel = (level: string) => {
    const activityLabels: Record<string, string> = {
      sedentary: 'Hareketsiz',
      lightly_active: 'Hafif Aktif',
      moderately_active: 'Orta Aktif',
      very_active: 'Çok Aktif',
      extremely_active: 'Son Derece Aktif',
    };
    return activityLabels[level] || level;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: LightTheme.semanticColors.background.primary,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: LightTheme.spacing.lg,
    },
    header: {
      marginTop: '10%',
      alignItems: 'center',
      marginBottom: LightTheme.spacing['3xl'],
    },
    title: {
      fontSize: LightTheme.typography['3xl'].fontSize,
      fontWeight: '700',
      color: LightTheme.semanticColors.text.primary,
      textAlign: 'center',
      marginBottom: LightTheme.spacing.md,
      lineHeight: 40,
    },
    subtitle: {
      fontSize: LightTheme.typography.base.fontSize,
      fontWeight: '400',
      color: LightTheme.semanticColors.text.secondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    calculatingCard: {
      backgroundColor: LightTheme.semanticColors.background.secondary,
      borderRadius: LightTheme.borderRadius.lg,
      padding: LightTheme.spacing['3xl'],
      alignItems: 'center',
      marginBottom: LightTheme.spacing['3xl'],
      ...LightTheme.shadows.md,
    },
    calculatingImage: {
      width: 200,
      height: 200,
      resizeMode: 'contain',
      marginBottom: LightTheme.spacing['2xl'],
    },
    calculatingTitle: {
      fontSize: LightTheme.typography['2xl'].fontSize,
      fontWeight: '600',
      color: LightTheme.semanticColors.text.primary,
      textAlign: 'center',
      marginBottom: LightTheme.spacing.md,
    },
    calculatingDescription: {
      fontSize: LightTheme.typography.base.fontSize,
      fontWeight: '400',
      color: LightTheme.semanticColors.text.secondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    resultsCard: {
      backgroundColor: LightTheme.colors.primary,
      borderRadius: LightTheme.borderRadius.lg,
      padding: LightTheme.spacing['2xl'],
      marginBottom: LightTheme.spacing['3xl'],
      ...LightTheme.shadows.lg,
    },
    resultsTitle: {
      fontSize: LightTheme.typography['2xl'].fontSize,
      fontWeight: '600',
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: LightTheme.spacing.lg,
    },
    caloriesContainer: {
      alignItems: 'center',
      marginBottom: LightTheme.spacing.lg,
    },
    caloriesNumber: {
      fontSize: 64,
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: LightTheme.spacing.sm,
    },
    caloriesLabel: {
      fontSize: 18,
      fontWeight: '500',
      color: '#FFFFFF',
      opacity: 0.9,
    },
    macrosContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingTop: LightTheme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.3)',
    },
    macroItem: {
      alignItems: 'center',
    },
    macroValue: {
      fontSize: 20,
      fontWeight: '600',
      color: '#FFFFFF',
      marginBottom: LightTheme.spacing.xs,
    },
    macroLabel: {
      fontSize: 12,
      fontWeight: '400',
      color: '#FFFFFF',
      opacity: 0.8,
    },
    summarySection: {
      marginBottom: LightTheme.spacing['2xl'],
    },
    summaryTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: LightTheme.semanticColors.text.primary,
      marginBottom: LightTheme.spacing.lg,
    },
    profileCard: {
      backgroundColor: LightTheme.semanticColors.background.secondary,
      borderRadius: LightTheme.borderRadius.lg,
      padding: LightTheme.spacing.lg,
      marginBottom: LightTheme.spacing.lg,
      ...LightTheme.shadows.sm,
    },
    profileRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: LightTheme.spacing.sm,
    },
    profileLabel: {
      fontSize: LightTheme.typography.base.fontSize,
      fontWeight: '400',
      color: LightTheme.semanticColors.text.secondary,
    },
    profileValue: {
      fontSize: LightTheme.typography.base.fontSize,
      fontWeight: '400',
      color: LightTheme.semanticColors.text.primary,
      fontWeight: '600',
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: LightTheme.spacing.md,
    },
    statCard: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: LightTheme.semanticColors.background.secondary,
      borderRadius: LightTheme.borderRadius.lg,
      padding: LightTheme.spacing.lg,
      alignItems: 'center',
      ...LightTheme.shadows.sm,
    },
    statIcon: {
      fontSize: 32,
      marginBottom: LightTheme.spacing.sm,
    },
    statValue: {
      fontSize: 20,
      fontWeight: '600',
      color: LightTheme.semanticColors.text.primary,
      marginBottom: LightTheme.spacing.xs,
    },
    statLabel: {
      fontSize: 12,
      fontWeight: '400',
      color: LightTheme.semanticColors.text.secondary,
      textAlign: 'center',
    },
    buttonContainer: {
      paddingHorizontal: LightTheme.spacing['2xl'],
      paddingBottom: LightTheme.spacing['4xl'],
      paddingTop: LightTheme.spacing.xl,
      backgroundColor: LightTheme.semanticColors.background.primary,
      borderTopLeftRadius: LightTheme.borderRadius.xl,
      borderTopRightRadius: LightTheme.borderRadius.xl,
      ...LightTheme.shadows.lg,
    },
    finishButton: {
      backgroundColor: LightTheme.colors.success,
    },
  });

  if (isCalculating) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Kişisel Planınız Hazırlanıyor</Text>
              <Text style={styles.subtitle}>
                Sağlık verilerinize göre size özel beslenme planınızı oluşturuyoruz...
              </Text>
            </View>

            <View style={styles.calculatingCard}>
              <Image source={{ uri: img4Dd87D5500484Ca1Add51872F8E2F05FWebp }} style={styles.calculatingImage} />
              <Text style={styles.calculatingTitle}>🧮 Hesaplanıyor...</Text>
              <Text style={styles.calculatingDescription}>
                Metabolizma hızınız, kalori ihtiyacınız ve makro dağılımınız hesaplanıyor.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>🎉 Planınız Hazır!</Text>
            <Text style={styles.subtitle}>
              İşte size özel hazırlanan beslenme planınız. Bu hedeflere ulaşmak için size destek olacağız.
            </Text>
          </View>

          {showResults && (
            <View style={styles.resultsCard}>
              <Text style={styles.resultsTitle}>Günlük Kalori Hedefiniz</Text>
              <View style={styles.caloriesContainer}>
                <Text style={styles.caloriesNumber}>{calculatedValues.dailyCalorieGoal}</Text>
                <Text style={styles.caloriesLabel}>kcal/gün</Text>
              </View>
              <View style={styles.macrosContainer}>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>{calculatedValues.macros.protein}g</Text>
                  <Text style={styles.macroLabel}>Protein</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>{calculatedValues.macros.carbs}g</Text>
                  <Text style={styles.macroLabel}>Karbonhidrat</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>{calculatedValues.macros.fats}g</Text>
                  <Text style={styles.macroLabel}>Yağ</Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>📋 Profil Özeti</Text>
            <View style={styles.profileCard}>
              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>İsim</Text>
                <Text style={styles.profileValue}>{profile.name} {profile.lastName}</Text>
              </View>
              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>Yaş</Text>
                <Text style={styles.profileValue}>{profile.age} yaş</Text>
              </View>
              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>Boy/Kilo</Text>
                <Text style={styles.profileValue}>{profile.height}cm / {profile.currentWeight}kg</Text>
              </View>
              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>Cinsiyet</Text>
                <Text style={styles.profileValue}>{profile.gender === 'male' ? 'Erkek' : profile.gender === 'female' ? 'Kadın' : 'Diğer'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>🎯 Hedefleriniz</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>🎯</Text>
                <Text style={styles.statValue}>{getGoalLabel(goals.primaryGoal)}</Text>
                <Text style={styles.statLabel}>Ana Hedef</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>⚖️</Text>
                <Text style={styles.statValue}>{goals.targetWeight}kg</Text>
                <Text style={styles.statLabel}>Hedef Kilo</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>🏃</Text>
                <Text style={styles.statValue}>{getActivityLabel(activity.level)}</Text>
                <Text style={styles.statLabel}>Aktivite</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>🔥</Text>
                <Text style={styles.statValue}>{calculatedValues.bmr}</Text>
                <Text style={styles.statLabel}>BMR</Text>
              </View>
            </View>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>📊 Metabolik Değerleriniz</Text>
            <View style={styles.profileCard}>
              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>Bazal Metabolizma Hızı (BMR)</Text>
                <Text style={styles.profileValue}>{calculatedValues.bmr} kcal</Text>
              </View>
              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>Günlük Enerji Harcaması (TDEE)</Text>
                <Text style={styles.profileValue}>{calculatedValues.tdee} kcal</Text>
              </View>
              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>Haftalık Hedef</Text>
                <Text style={styles.profileValue}>{goals.weeklyGoal} kg/hafta</Text>
              </View>
              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>Motivasyon Seviyesi</Text>
                <Text style={styles.profileValue}>{goals.motivation}/10</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Taahhütte Bulun"
          onPress={handleComplete}
          fullWidth
          style={styles.finishButton}
        />
      </View>
    </SafeAreaView>
  );
};

// Placeholder image - will be replaced with proper assets
const img4Dd87D5500484Ca1Add51872F8E2F05FWebp = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%23666' text-anchor='middle' dy='.3em'%3E✨ Calculating...%3C/text%3E%3C/svg%3E";

export default SummaryScreen;