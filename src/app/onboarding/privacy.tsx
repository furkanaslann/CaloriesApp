/**
 * CaloriTrack - Onboarding Privacy Screen
 * Minimal. Cool. Aesthetic.
 */

import { LightTheme } from '@/constants';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Linking,
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

const PrivacyScreen = () => {
  const { preferences, updatePreferences, nextStep, previousStep } = useOnboarding();

  const [formData, setFormData] = useState({
    privacy: {
      dataSharing: preferences.privacy?.dataSharing ?? false,
      analytics: preferences.privacy?.analytics ?? true,
      marketing: preferences.privacy?.marketing ?? false,
    },
    termsAccepted: false,
  });

  const handlePrivacyToggle = (type: keyof typeof formData.privacy) => {
    setFormData(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [type]: !prev.privacy[type],
      },
    }));
  };

  const handleTermsToggle = () => {
    setFormData(prev => ({
      ...prev,
      termsAccepted: !prev.termsAccepted,
    }));
  };

  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Hata', 'Link açılamadı');
    });
  };

  const validateAndProceed = () => {
    if (!formData.termsAccepted) {
      Alert.alert('Gerekli', 'Devam etmek için Kullanım Koşulları ve Gizlilik Politikası\'nı kabul etmeniz gerekmektedir.');
      return;
    }

    updatePreferences(formData);
    nextStep();
    router.push('/onboarding/summary');
  };

  const handleNext = () => {
    validateAndProceed();
  };

  const handlePrevious = () => {
    previousStep();
    router.back();
  };

  const privacySettings = [
    {
      key: 'dataSharing' as const,
      title: 'Veri Paylaşımı',
      description: 'Anonim verilerin araştırma amaçlı paylaşılmasına izin ver',
      icon: '📊',
      recommended: false,
    },
    {
      key: 'analytics' as const,
      title: 'Analitik',
      description: 'Uygulama kullanımını iyileştirmek için anonim kullanım verilerini topla',
      icon: '📈',
      recommended: true,
    },
    {
      key: 'marketing' as const,
      title: 'Pazarlama İletişimi',
      description: 'Kampanya ve haberler için e-posta gönderimlerini al',
      icon: '📧',
      recommended: false,
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
    privacyCard: {
      backgroundColor: LightTheme.semanticColors.background.secondary,
      borderRadius: LightTheme.borderRadius.lg,
      padding: LightTheme.spacing['2xl'],
      marginBottom: LightTheme.spacing['2xl'],
      alignItems: 'center',
      ...LightTheme.shadows.md,
    },
    privacyIcon: {
      fontSize: 48,
      marginBottom: LightTheme.spacing['2xl'],
    },
    privacyTitle: {
      fontSize: LightTheme.typography['2xl'].fontSize,
      fontWeight: '600',
      color: LightTheme.semanticColors.text.primary,
      textAlign: 'center',
      marginBottom: LightTheme.spacing.lg,
    },
    privacyDescription: {
      fontSize: LightTheme.typography.sm.fontSize,
      fontWeight: '400',
      color: LightTheme.semanticColors.text.secondary,
      textAlign: 'center',
      lineHeight: 20,
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
    privacyList: {
      gap: LightTheme.spacing.lg,
    },
    privacyOptionCard: {
      backgroundColor: LightTheme.semanticColors.background.secondary,
      borderRadius: LightTheme.borderRadius.lg,
      padding: LightTheme.spacing['2xl'],
      flexDirection: 'row',
      alignItems: 'center',
      ...LightTheme.shadows.sm,
    },
    privacyOptionIcon: {
      fontSize: 32,
      marginRight: LightTheme.spacing['2xl'],
    },
    privacyOptionContent: {
      flex: 1,
    },
    privacyOptionTitle: {
      fontSize: LightTheme.typography.lg.fontSize,
      fontWeight: '600',
      color: LightTheme.semanticColors.text.primary,
      marginBottom: LightTheme.spacing.sm,
      lineHeight: 22,
    },
    privacyOptionDescription: {
      fontSize: LightTheme.typography.sm.fontSize,
      fontWeight: '400',
      color: LightTheme.semanticColors.text.secondary,
      lineHeight: 20,
    },
    recommendedBadge: {
      backgroundColor: LightTheme.colors.success,
      paddingHorizontal: LightTheme.spacing.sm,
      paddingVertical: LightTheme.spacing.xs,
      borderRadius: LightTheme.borderRadius.full,
      marginTop: LightTheme.spacing.sm,
      alignSelf: 'flex-start',
    },
    recommendedBadgeText: {
      fontSize: LightTheme.typography.xs.fontSize,
      fontWeight: '600',
      color: LightTheme.semanticColors.background.primary,
    },
    switchContainer: {
      marginLeft: LightTheme.spacing.lg,
    },
    termsCard: {
      backgroundColor: LightTheme.semanticColors.background.secondary,
      borderRadius: LightTheme.borderRadius.lg,
      padding: LightTheme.spacing['2xl'],
      marginBottom: 40,
      ...LightTheme.shadows.sm,
    },
    termsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: LightTheme.spacing.lg,
    },
    termsIcon: {
      fontSize: 24,
      marginRight: LightTheme.spacing.lg,
    },
    termsTitle: {
      fontSize: LightTheme.typography.lg.fontSize,
      fontWeight: '600',
      color: LightTheme.semanticColors.text.primary,
      lineHeight: 22,
    },
    termsDescription: {
      fontSize: LightTheme.typography.base.fontSize,
      fontWeight: '400',
      color: LightTheme.semanticColors.text.secondary,
      lineHeight: LightTheme.typography.base.lineHeight,
      marginBottom: LightTheme.spacing['2xl'],
    },
    termsLinks: {
      gap: LightTheme.spacing.sm,
    },
    termsLink: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    linkText: {
      fontSize: LightTheme.typography.base.fontSize,
      fontWeight: '400',
      color: LightTheme.colors.primary,
      textDecorationLine: 'underline',
      lineHeight: 22,
    },
    termsCheckbox: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: LightTheme.spacing['2xl'],
      paddingTop: LightTheme.spacing['2xl'],
      borderTopWidth: 1,
      borderTopColor: LightTheme.semanticColors.border.primary,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderWidth: 2,
      borderColor: formData.termsAccepted ? LightTheme.colors.primary : LightTheme.semanticColors.border.primary,
      borderRadius: LightTheme.borderRadius.sm,
      marginRight: LightTheme.spacing.lg,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: formData.termsAccepted ? LightTheme.colors.primary : 'transparent',
      ...(formData.termsAccepted && {
        shadowColor: LightTheme.colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
      }),
    },
    checkmark: {
      color: LightTheme.semanticColors.background.primary,
      fontWeight: 'bold',
      fontSize: 16,
    },
    checkboxText: {
      fontSize: LightTheme.typography.base.fontSize,
      fontWeight: '400',
      color: LightTheme.semanticColors.text.primary,
      flex: 1,
      lineHeight: LightTheme.typography.base.lineHeight,
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
            <Text style={styles.title}>Gizlilik ve Güvenlik</Text>
            <Text style={styles.subtitle}>
              Verileriniz bizim için değerlidir. Gizlilik ayarlarınızı kişiselleştirin ve nasıl veri topladığımızı öğrenin.
            </Text>
          </View>

          <View style={styles.privacyCard}>
            <Text style={styles.privacyIcon}>🔒</Text>
            <Text style={styles.privacyTitle}>Verileriniz Güvende</Text>
            <Text style={styles.privacyDescription}>
              Tüm kişisel verileriniz şifrelenir ve asla üçüncü şahıslarla paylaşılmaz.
              Tam kontrol sizdedir.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gizlilik Ayarları</Text>
            <View style={styles.privacyList}>
              {privacySettings.map((setting) => (
                <View key={setting.key} style={styles.privacyOptionCard}>
                  <Text style={styles.privacyOptionIcon}>{setting.icon}</Text>
                  <View style={styles.privacyOptionContent}>
                    <Text style={styles.privacyOptionTitle}>{setting.title}</Text>
                    <Text style={styles.privacyOptionDescription}>{setting.description}</Text>
                    {setting.recommended && (
                      <View style={styles.recommendedBadge}>
                        <Text style={styles.recommendedBadgeText}>Tavsiye Edilen</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.switchContainer}>
                    <Switch
                      value={formData.privacy[setting.key]}
                      onValueChange={() => handlePrivacyToggle(setting.key)}
                      trackColor={{ false: LightTheme.semanticColors.border.primary, true: LightTheme.colors.primary }}
                      thumbColor={LightTheme.semanticColors.background.primary}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.termsCard}>
            <View style={styles.termsHeader}>
              <Text style={styles.termsIcon}>📋</Text>
              <Text style={styles.termsTitle}>Kullanım Koşulları</Text>
            </View>
            <Text style={styles.termsDescription}>
              Lütfen kullanım koşullarımızı ve gizlilik politikamızı dikkatlice okuyun.
            </Text>
            <View style={styles.termsLinks}>
              <TouchableOpacity
                style={styles.termsLink}
                onPress={() => handleLinkPress('https://caloritrack.com/terms')}
              >
                <Text style={styles.linkText}>• Kullanım Koşulları</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.termsLink}
                onPress={() => handleLinkPress('https://caloritrack.com/privacy')}
              >
                <Text style={styles.linkText}>• Gizlilik Politikası</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.termsCheckbox} onPress={handleTermsToggle}>
              <View style={styles.checkbox}>
                {formData.termsAccepted && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxText}>
                Kullanım Koşulları'nı ve Gizlilik Politikası'nı okudum ve kabul ediyorum.
              </Text>
            </TouchableOpacity>
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

export default PrivacyScreen;