/**
 * CaloriTrack - Onboarding Notifications Screen
 * Minimal. Cool. Aesthetic.
 */

import Constants from 'expo-constants';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from '../../components/ui/button';
import { useOnboarding } from '../../contexts/onboarding-context';
import { useTheme } from '../../src/theme';

// Check if running in Expo Go
const isExpoGo = Constants.executionEnvironment === 'storeClient';

// Conditional import for notifications to avoid Expo Go error
let Notifications: any = null;
if (!isExpoGo) {
  try {
    Notifications = require('expo-notifications');
  } catch (error) {
    console.warn('Notifications not available:', error);
  }
}

const NotificationsScreen = () => {
  const themeResult = useTheme();
  const theme = themeResult || {
    semanticColors: {
      background: { primary: '#FFFFFF', surface: '#F8FAFC', primarySurface: '#EDE9FE' },
      text: { primary: '#1E293B', secondary: '#475569', tertiary: '#64748B', onPrimary: '#FFFFFF' },
      border: { primary: '#E2E8F0', secondary: '#E2E8F0' },
    },
    colors: { primary: '#7C3AED', success: '#10B981', warning: '#F59E0B', info: '#3B82F6' },
    textStyles: {
      onboardingTitle: { fontSize: 30, fontWeight: '600' },
      onboardingDescription: { fontSize: 16, fontWeight: '400' },
      heading3: { fontSize: 24, fontWeight: '600' },
      heading4: { fontSize: 20, fontWeight: '600' },
      body: { fontSize: 16, fontWeight: '400' },
      bodySmall: { fontSize: 14, fontWeight: '400' },
      labelMedium: { fontSize: 15, fontWeight: '500' },
    },
    spacing: { lg: 24, md: 16, xl: 32, '4xl': 48, '3xl': 40, '2xl': 24, sm: 8 },
    borderRadius: { full: 9999, xl: 16, lg: 12, md: 10 },
    shadows: { lg: {}, md: {} },
    coloredShadows: { primary: {} },
  };
  const { preferences, updatePreferences, nextStep, previousStep } = useOnboarding();

  const [formData, setFormData] = useState({
    notifications: {
      mealReminders: preferences.notifications?.mealReminders ?? true,
      waterReminders: preferences.notifications?.waterReminders ?? true,
      exerciseReminders: preferences.notifications?.exerciseReminders ?? false,
      dailySummary: preferences.notifications?.dailySummary ?? true,
      achievements: preferences.notifications?.achievements ?? true,
    },
  });

  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');

  const handleNotificationToggle = (type: keyof typeof formData.notifications) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type],
      },
    }));
  };

  useEffect(() => {
    // Expo Go'da çalışıyorsa izin durumunu 'granted' olarak ayarla
    if (isExpoGo) {
      setPermissionStatus('granted');
    }
  }, []);

  const requestNotificationPermission = async () => {
    try {
      if (isExpoGo) {
        Alert.alert(
          'Geliştirme Modu',
          'Expo Go\'da bildirimler sınırlıdır. Gerçek cihazda test etmek için "expo run:android" veya "expo run:ios" komutunu kullanın.',
          [{ text: 'Tamam' }]
        );
        setPermissionStatus('granted');
        return;
      }

      if (!Notifications) {
        Alert.alert(
          'Bildirimler Kullanılamıyor',
          'Bildirim modülü yüklenemedi. Lütfen uygulamayı yeniden başlatın.',
          [{ text: 'Tamam' }]
        );
        return;
      }

      const { status } = await Notifications.requestPermissionsAsync();
      setPermissionStatus(status);

      if (status !== 'granted') {
        Alert.alert(
          'Bildirim İzni',
          'Bildirimler hatırlatıcılar için önemlidir. Ayarlardan daha sonra izin verebilirsiniz.',
          [{ text: 'Tamam' }]
        );
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      Alert.alert(
        'Hata',
        'Bildirim izni istenirken bir hata oluştu.',
        [{ text: 'Tamam' }]
      );
    }
  };

  const handleNext = () => {
    updatePreferences(formData);
    nextStep();
    router.push('/onboarding/privacy');
  };

  const handlePrevious = () => {
    previousStep();
    router.back();
  };

  const notificationSettings = [
    {
      key: 'mealReminders' as const,
      title: 'Öğün Hatırlatıcıları',
      description: 'Kahvaltı, öğle ve akşam yemeği zamanlarında hatırlat',
      icon: '🍽️',
      time: '08:00, 12:30, 19:00',
    },
    {
      key: 'waterReminders' as const,
      title: 'Su Hatırlatıcıları',
      description: 'Günde 8 bardak su içmeyi hatırlat',
      icon: '💧',
      time: 'Saat başı',
    },
    {
      key: 'exerciseReminders' as const,
      title: 'Egzersiz Hatırlatıcıları',
      description: 'Egzersiz yapmanız gereken zamanlarda hatırlat',
      icon: '🏃',
      time: 'Seçtiğiniz zamanlarda',
    },
    {
      key: 'dailySummary' as const,
      title: 'Günlük Özet',
      description: 'Günlük kalori ve besin alımınızı özetle',
      icon: '📊',
      time: '21:00',
    },
    {
      key: 'achievements' as const,
      title: 'Başarı Bildirimleri',
      description: 'Hedeflerinize ulaştığınızda motive edici bildirimler',
      icon: '🏆',
      time: 'Anlık',
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.semanticColors.background.primary,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: theme.spacing.lg,
    },
    header: {
      marginTop: '10%',
      marginBottom: theme.spacing['3xl'],
      alignItems: 'center',
    },
    title: {
      ...theme.textStyles.heading2,
      color: theme.semanticColors.text.primary,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
      lineHeight: 40,
      fontSize: 32,
      fontWeight: '700',
    },
    subtitle: {
      ...theme.textStyles.body,
      color: theme.semanticColors.text.secondary,
      textAlign: 'center',
      lineHeight: theme.typography.lineHeight.relaxed,
      paddingHorizontal: theme.spacing.lg,
    },
    permissionCard: {
      backgroundColor: theme.semanticColors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing['2xl'],
      alignItems: 'center',
      ...theme.shadows.md,
    },
    permissionTitle: {
      ...theme.textStyles.heading4,
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    permissionDescription: {
      ...theme.textStyles.body,
      color: theme.semanticColors.text.secondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
      lineHeight: theme.typography.lineHeight.relaxed,
    },
    permissionButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing['2xl'],
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
    },
    permissionButtonText: {
      ...theme.textStyles.labelLarge,
      color: theme.semanticColors.text.onPrimary,
    },
    permissionStatus: {
      ...theme.textStyles.caption,
      color: theme.semanticColors.text.secondary,
      marginTop: theme.spacing.sm,
    },
    section: {
      marginBottom: theme.spacing['3xl'],
    },
    sectionTitle: {
      ...theme.textStyles.heading4,
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.lg,
    },
    notificationList: {
      gap: theme.spacing.md,
    },
    notificationCard: {
      backgroundColor: theme.semanticColors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      ...theme.shadows.sm,
    },
    notificationIcon: {
      fontSize: 32,
      marginRight: theme.spacing.lg,
    },
    notificationContent: {
      flex: 1,
    },
    notificationTitle: {
      ...theme.textStyles.labelLarge,
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.xs,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    notificationDescription: {
      ...theme.textStyles.caption,
      color: theme.semanticColors.text.secondary,
      marginBottom: theme.spacing.xs,
    },
    notificationTime: {
      ...theme.textStyles.caption,
      color: theme.colors.primary,
      fontSize: 12,
    },
    switchContainer: {
      marginLeft: theme.spacing.md,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Bildirimler</Text>
            <Text style={styles.subtitle}>
              Hedeflerinize ulaşmanız için size hatırlatıcılar ve motive edici bildirimler gönderelim. Bildirimleri istediğiniz zaman ayarlardan değiştirebilirsiniz.
            </Text>
          </View>

          <View style={styles.permissionCard}>
            <Text style={styles.permissionTitle}>🔔 Bildirim İzni</Text>
            <Text style={styles.permissionDescription}>
              CaloriTrack'in size zamanında hatırlatmalar gönderebilmesi için bildirim izni gereklidir.
            </Text>

            {permissionStatus === 'undetermined' && (
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={requestNotificationPermission}
              >
                <Text style={styles.permissionButtonText}>Bildirim İzni Ver</Text>
              </TouchableOpacity>
            )}

            {permissionStatus === 'granted' && (
              <Text style={styles.permissionStatus}>✅ Bildirimler aktif</Text>
            )}

            {permissionStatus === 'denied' && (
              <Text style={styles.permissionStatus}>❌ Bildirimler engellenmiş (Ayarlar'dan değiştirin)</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hatırlatıcı Türleri</Text>
            <View style={styles.notificationList}>
              {notificationSettings.map((setting) => (
                <View key={setting.key} style={styles.notificationCard}>
                  <Text style={styles.notificationIcon}>{setting.icon}</Text>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>{setting.title}</Text>
                    <Text style={styles.notificationDescription}>{setting.description}</Text>
                    <Text style={styles.notificationTime}>📅 {setting.time}</Text>
                  </View>
                  <View style={styles.switchContainer}>
                    <Switch
                      value={formData.notifications[setting.key]}
                      onValueChange={() => handleNotificationToggle(setting.key)}
                      trackColor={{ false: theme.semanticColors.border.primary, true: theme.colors.primary }}
                      thumbColor={theme.semanticColors.background.primary}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Geri"
          onPress={handlePrevious}
          variant="secondary"
        />
        <Button
          title="Devam Et"
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
};

export default NotificationsScreen;