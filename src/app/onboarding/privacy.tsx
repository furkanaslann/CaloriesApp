/**
 * CaloriTrack - Onboarding Privacy Screen
 * Minimal. Cool. Aesthetic.
 */

import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme';
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
    privacyCard: {
      backgroundColor: COLORS.surfaceAlt,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING[6],
      marginBottom: SPACING[6],
      alignItems: 'center',
      ...SHADOWS.md,
    },
    privacyIcon: {
      fontSize: 48,
      marginBottom: SPACING[6],
    },
    privacyTitle: {
      fontSize: TYPOGRAPHY.fontSizes['2xl'],
      fontWeight: TYPOGRAPHY.fontWeights.semibold,
      color: COLORS.textPrimary,
      textAlign: 'center',
      marginBottom: SPACING[4],
    },
    privacyDescription: {
      fontSize: TYPOGRAPHY.fontSizes.sm,
      fontWeight: TYPOGRAPHY.fontWeights.regular,
      color: COLORS.textSecondary,
      textAlign: 'center',
      lineHeight: TYPOGRAPHY.lineHeights.normal * TYPOGRAPHY.fontSizes.sm,
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
    privacyList: {
      gap: SPACING[4],
    },
    privacyOptionCard: {
      backgroundColor: COLORS.surfaceAlt,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING[6],
      flexDirection: 'row',
      alignItems: 'center',
      ...SHADOWS.sm,
    },
    privacyOptionIcon: {
      fontSize: 32,
      marginRight: SPACING[6],
    },
    privacyOptionContent: {
      flex: 1,
    },
    privacyOptionTitle: {
      fontSize: TYPOGRAPHY.fontSizes.lg,
      fontWeight: TYPOGRAPHY.fontWeights.semibold,
      color: COLORS.textPrimary,
      marginBottom: SPACING[1],
      lineHeight: TYPOGRAPHY.lineHeights.normal * TYPOGRAPHY.fontSizes.lg,
    },
    privacyOptionDescription: {
      fontSize: TYPOGRAPHY.fontSizes.sm,
      fontWeight: TYPOGRAPHY.fontWeights.regular,
      color: COLORS.textSecondary,
      lineHeight: TYPOGRAPHY.lineHeights.normal * TYPOGRAPHY.fontSizes.sm,
    },
    recommendedBadge: {
      backgroundColor: COLORS.success,
      paddingHorizontal: SPACING[2],
      paddingVertical: SPACING[1],
      borderRadius: BORDER_RADIUS.full,
      marginTop: SPACING[1],
      alignSelf: 'flex-start',
    },
    recommendedBadgeText: {
      fontSize: TYPOGRAPHY.fontSizes.xs,
      fontWeight: TYPOGRAPHY.fontWeights.semibold,
      color: COLORS.background,
    },
    switchContainer: {
      marginLeft: SPACING[4],
    },
    termsCard: {
      backgroundColor: COLORS.surfaceAlt,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING[6],
      marginBottom: SPACING[10],
      ...SHADOWS.sm,
    },
    termsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING[4],
    },
    termsIcon: {
      fontSize: 24,
      marginRight: SPACING[4],
    },
    termsTitle: {
      fontSize: TYPOGRAPHY.fontSizes.lg,
      fontWeight: TYPOGRAPHY.fontWeights.semibold,
      color: COLORS.textPrimary,
      lineHeight: TYPOGRAPHY.lineHeights.normal * TYPOGRAPHY.fontSizes.lg,
    },
    termsDescription: {
      fontSize: TYPOGRAPHY.fontSizes.base,
      fontWeight: TYPOGRAPHY.fontWeights.regular,
      color: COLORS.textSecondary,
      lineHeight: TYPOGRAPHY.lineHeights.relaxed * TYPOGRAPHY.fontSizes.base,
      marginBottom: SPACING[6],
    },
    termsLinks: {
      gap: SPACING[2],
    },
    termsLink: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    linkText: {
      fontSize: TYPOGRAPHY.fontSizes.base,
      fontWeight: TYPOGRAPHY.fontWeights.regular,
      color: COLORS.primary,
      textDecorationLine: 'underline',
      lineHeight: TYPOGRAPHY.lineHeights.normal * TYPOGRAPHY.fontSizes.base,
    },
    termsCheckbox: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: SPACING[6],
      paddingTop: SPACING[6],
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderWidth: 2,
      borderColor: formData.termsAccepted ? COLORS.primary : COLORS.border,
      borderRadius: BORDER_RADIUS.sm,
      marginRight: SPACING[4],
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: formData.termsAccepted ? COLORS.primary : 'transparent',
    },
    checkmark: {
      color: COLORS.background,
      fontWeight: 'bold',
      fontSize: 16,
    },
    checkboxText: {
      fontSize: TYPOGRAPHY.fontSizes.base,
      fontWeight: TYPOGRAPHY.fontWeights.regular,
      color: COLORS.textPrimary,
      flex: 1,
      lineHeight: TYPOGRAPHY.lineHeights.relaxed * TYPOGRAPHY.fontSizes.base,
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
                      trackColor={{ false: COLORS.border, true: COLORS.primary }}
                      thumbColor={COLORS.background}
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

export default PrivacyScreen;