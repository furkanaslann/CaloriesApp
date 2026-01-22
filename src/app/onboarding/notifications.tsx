/**
 * CaloriTrack - Onboarding Notifications Screen
 * Minimal. Cool. Aesthetic.
 */

import { LightTheme } from '@/constants';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/button';
import { useOnboarding } from '../../context/onboarding-context';

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
      marginBottom: 40,
      alignItems: 'center',
    },
    title: {
      fontSize: LightTheme.typography['3xl'].fontSize,
      fontWeight: '700',
      color: LightTheme.semanticColors.text.primary,
      textAlign: 'center',
      marginBottom: LightTheme.spacing.lg,
      lineHeight: LightTheme.typography['3xl'].lineHeight,
    },
    subtitle: {
      fontSize: LightTheme.typography.base.fontSize,
      fontWeight: '400',
      color: LightTheme.semanticColors.text.secondary,
      textAlign: 'center',
      lineHeight: LightTheme.typography.base.lineHeight,
      paddingHorizontal: LightTheme.spacing['2xl'],
    },
    permissionCard: {
      backgroundColor: LightTheme.semanticColors.background.secondary,
      borderRadius: LightTheme.borderRadius.lg,
      padding: LightTheme.spacing['2xl'],
      marginBottom: LightTheme.spacing['2xl'],
      alignItems: 'center',
      ...LightTheme.shadows.md,
    },
    permissionTitle: {
      fontSize: LightTheme.typography.xl.fontSize,
      fontWeight: '600',
      color: LightTheme.semanticColors.text.primary,
      marginBottom: LightTheme.spacing.lg,
      textAlign: 'center',
    },
    permissionDescription: {
      fontSize: LightTheme.typography.sm.fontSize,
      fontWeight: '400',
      color: LightTheme.semanticColors.text.secondary,
      textAlign: 'center',
      marginBottom: LightTheme.spacing['2xl'],
      lineHeight: 20,
    },
    permissionButton: {
      backgroundColor: LightTheme.colors.primary,
      paddingHorizontal: LightTheme.spacing['2xl'],
      paddingVertical: LightTheme.spacing.lg,
      borderRadius: LightTheme.borderRadius.md,
    },
    permissionButtonText: {
      fontSize: LightTheme.typography.lg.fontSize,
      fontWeight: '500',
      color: LightTheme.semanticColors.background.primary,
    },
    permissionStatus: {
      fontSize: LightTheme.typography.xs.fontSize,
      fontWeight: '400',
      color: LightTheme.semanticColors.text.secondary,
      marginTop: LightTheme.spacing.sm,
    },
    section: {
      marginBottom: 40,
    },
    sectionTitle: {
      fontSize: LightTheme.typography.xl.fontSize,
      fontWeight: '600',
      color: LightTheme.semanticColors.text.primary,
      marginBottom: LightTheme.spacing['2xl'],
    },
    notificationList: {
      gap: LightTheme.spacing.lg,
    },
    notificationCard: {
      backgroundColor: LightTheme.semanticColors.background.secondary,
      borderRadius: LightTheme.borderRadius.lg,
      padding: LightTheme.spacing['2xl'],
      flexDirection: 'row',
      alignItems: 'flex-start',
      minHeight: 80,
      ...LightTheme.shadows.sm,
    },
    notificationIcon: {
      fontSize: 28,
      marginRight: LightTheme.spacing['2xl'],
      marginTop: 2,
    },
    notificationContent: {
      flex: 1,
      justifyContent: 'center',
    },
    notificationTitle: {
      fontSize: LightTheme.typography.lg.fontSize,
      fontWeight: '600',
      color: LightTheme.semanticColors.text.primary,
      marginBottom: LightTheme.spacing.sm,
      lineHeight: 22,
    },
    notificationDescription: {
      fontSize: LightTheme.typography.xs.fontSize,
      fontWeight: '400',
      color: LightTheme.semanticColors.text.secondary,
      marginBottom: LightTheme.spacing.sm,
      lineHeight: 16,
      flexWrap: 'wrap',
    },
    notificationTime: {
      fontSize: LightTheme.typography.xs.fontSize,
      fontWeight: '500',
      color: LightTheme.colors.primary,
    },
    switchContainer: {
      marginLeft: LightTheme.spacing.lg,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: LightTheme.spacing.lg,
      paddingHorizontal: LightTheme.spacing['2xl'],
      paddingBottom: LightTheme.spacing['2xl'],
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
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
                      trackColor={{ false: LightTheme.semanticColors.border.primary, true: LightTheme.colors.primary }}
                      thumbColor={LightTheme.semanticColors.background.primary}
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
          title="Devam Et"
          onPress={handleNext}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
};

export default NotificationsScreen;