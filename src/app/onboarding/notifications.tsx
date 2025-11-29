/**
 * CaloriTrack - Onboarding Notifications Screen
 * Minimal. Cool. Aesthetic.
 */

import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme';
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
      backgroundColor: COLORS.background,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: SPACING[6],
    },
    header: {
      marginTop: '10%',
      marginBottom: SPACING[10],
      alignItems: 'center',
    },
    title: {
      fontSize: TYPOGRAPHY.fontSizes['3xl'],
      fontWeight: TYPOGRAPHY.fontWeights.bold,
      color: COLORS.textPrimary,
      textAlign: 'center',
      marginBottom: SPACING[4],
      lineHeight: TYPOGRAPHY.lineHeights.tight * TYPOGRAPHY.fontSizes['3xl'],
    },
    subtitle: {
      fontSize: TYPOGRAPHY.fontSizes.base,
      fontWeight: TYPOGRAPHY.fontWeights.regular,
      color: COLORS.textSecondary,
      textAlign: 'center',
      lineHeight: TYPOGRAPHY.lineHeights.relaxed * TYPOGRAPHY.fontSizes.base,
      paddingHorizontal: SPACING[6],
    },
    permissionCard: {
      backgroundColor: COLORS.surfaceAlt,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING[6],
      marginBottom: SPACING[6],
      alignItems: 'center',
      ...SHADOWS.md,
    },
    permissionTitle: {
      fontSize: TYPOGRAPHY.fontSizes.xl,
      fontWeight: TYPOGRAPHY.fontWeights.semibold,
      color: COLORS.textPrimary,
      marginBottom: SPACING[4],
      textAlign: 'center',
    },
    permissionDescription: {
      fontSize: TYPOGRAPHY.fontSizes.sm,
      fontWeight: TYPOGRAPHY.fontWeights.regular,
      color: COLORS.textSecondary,
      textAlign: 'center',
      marginBottom: SPACING[6],
      lineHeight: TYPOGRAPHY.lineHeights.normal * TYPOGRAPHY.fontSizes.sm,
    },
    permissionButton: {
      backgroundColor: COLORS.primary,
      paddingHorizontal: SPACING[6],
      paddingVertical: SPACING[4],
      borderRadius: BORDER_RADIUS.md,
    },
    permissionButtonText: {
      fontSize: TYPOGRAPHY.fontSizes.lg,
      fontWeight: TYPOGRAPHY.fontWeights.medium,
      color: COLORS.background,
    },
    permissionStatus: {
      fontSize: TYPOGRAPHY.fontSizes.xs,
      fontWeight: TYPOGRAPHY.fontWeights.regular,
      color: COLORS.textSecondary,
      marginTop: SPACING[2],
    },
    section: {
      marginBottom: SPACING[10],
    },
    sectionTitle: {
      fontSize: TYPOGRAPHY.fontSizes.xl,
      fontWeight: TYPOGRAPHY.fontWeights.semibold,
      color: COLORS.textPrimary,
      marginBottom: SPACING[6],
    },
    notificationList: {
      gap: SPACING[4],
    },
    notificationCard: {
      backgroundColor: COLORS.surfaceAlt,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING[6],
      flexDirection: 'row',
      alignItems: 'flex-start',
      minHeight: 80,
      ...SHADOWS.sm,
    },
    notificationIcon: {
      fontSize: 28,
      marginRight: SPACING[6],
      marginTop: 2,
    },
    notificationContent: {
      flex: 1,
      justifyContent: 'center',
    },
    notificationTitle: {
      fontSize: TYPOGRAPHY.fontSizes.lg,
      fontWeight: TYPOGRAPHY.fontWeights.semibold,
      color: COLORS.textPrimary,
      marginBottom: SPACING[1],
      lineHeight: TYPOGRAPHY.lineHeights.normal * TYPOGRAPHY.fontSizes.lg,
    },
    notificationDescription: {
      fontSize: TYPOGRAPHY.fontSizes.xs,
      fontWeight: TYPOGRAPHY.fontWeights.regular,
      color: COLORS.textSecondary,
      marginBottom: SPACING[1],
      lineHeight: TYPOGRAPHY.lineHeights.normal * TYPOGRAPHY.fontSizes.xs,
      flexWrap: 'wrap',
    },
    notificationTime: {
      fontSize: TYPOGRAPHY.fontSizes.xs,
      fontWeight: TYPOGRAPHY.fontWeights.medium,
      color: COLORS.primary,
    },
    switchContainer: {
      marginLeft: SPACING[4],
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: SPACING[4],
      paddingHorizontal: SPACING[6],
      paddingBottom: SPACING[8],
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
                      trackColor={{ false: COLORS.border, true: COLORS.primary }}
                      thumbColor={COLORS.background}
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