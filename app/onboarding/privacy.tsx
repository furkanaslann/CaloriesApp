/**
 * CaloriTrack - Onboarding Privacy Screen
 * Minimal. Cool. Aesthetic.
 */

import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Linking,
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

const PrivacyScreen = () => {
  const themeResult = useTheme();
  const theme = themeResult || {
    semanticColors: {
      background: { primary: '#FFFFFF', surface: '#F8FAFC', primarySurface: '#EDE9FE' },
      text: { primary: '#1E293B', secondary: '#475569', tertiary: '#64748B', onPrimary: '#FFFFFF' },
      border: { primary: '#E2E8F0', secondary: '#E2E8F0' },
    },
    colors: { primary: '#7C3AED', success: '#10B981', error: '#EF4444', info: '#3B82F6' },
    textStyles: {
      onboardingTitle: { fontSize: 30, fontWeight: '600' },
      onboardingDescription: { fontSize: 16, fontWeight: '400' },
      heading3: { fontSize: 24, fontWeight: '600' },
      heading4: { fontSize: 20, fontWeight: '600' },
      body: { fontSize: 16, fontWeight: '400' },
      bodySmall: { fontSize: 14, fontWeight: '400' },
      buttonMedium: { fontSize: 16, fontWeight: '500' },
    },
    spacing: { lg: 24, md: 16, xl: 32, '4xl': 48, '3xl': 40, '2xl': 24, sm: 8 },
    borderRadius: { full: 9999, xl: 16, lg: 12, md: 10 },
    shadows: { lg: {}, md: {} },
    coloredShadows: { primary: {} },
  };
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
      backgroundColor: theme.semanticColors.background.primary,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: theme.spacing.lg,
    },
    header: {
      marginBottom: theme.spacing['3xl'],
      alignItems: 'center',
    },
    title: {
      ...theme.textStyles.heading2,
      color: theme.semanticColors.text.primary,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    subtitle: {
      ...theme.textStyles.body,
      color: theme.semanticColors.text.secondary,
      textAlign: 'center',
      lineHeight: theme.typography.lineHeight.relaxed,
      paddingHorizontal: theme.spacing.lg,
    },
    privacyCard: {
      backgroundColor: theme.semanticColors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing['2xl'],
      marginBottom: theme.spacing['2xl'],
      alignItems: 'center',
      ...theme.shadows.md,
    },
    privacyIcon: {
      fontSize: 48,
      marginBottom: theme.spacing.lg,
    },
    privacyTitle: {
      ...theme.textStyles.heading3,
      color: theme.semanticColors.text.primary,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    privacyDescription: {
      ...theme.textStyles.body,
      color: theme.semanticColors.text.secondary,
      textAlign: 'center',
      lineHeight: theme.typography.lineHeight.relaxed,
    },
    section: {
      marginBottom: theme.spacing['3xl'],
    },
    sectionTitle: {
      ...theme.textStyles.heading4,
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.lg,
    },
    privacyList: {
      gap: theme.spacing.md,
    },
    privacyOptionCard: {
      backgroundColor: theme.semanticColors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      ...theme.shadows.sm,
    },
    privacyOptionIcon: {
      fontSize: 32,
      marginRight: theme.spacing.lg,
    },
    privacyOptionContent: {
      flex: 1,
    },
    privacyOptionTitle: {
      ...theme.textStyles.labelLarge,
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.xs,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    privacyOptionDescription: {
      ...theme.textStyles.caption,
      color: theme.semanticColors.text.secondary,
      lineHeight: theme.typography.lineHeight.normal,
    },
    recommendedBadge: {
      backgroundColor: theme.colors.success,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
      marginTop: theme.spacing.xs,
      alignSelf: 'flex-start',
    },
    recommendedBadgeText: {
      ...theme.textStyles.caption,
      color: theme.semanticColors.text.onPrimary,
      fontSize: 10,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    switchContainer: {
      marginLeft: theme.spacing.md,
    },
    termsCard: {
      backgroundColor: theme.semanticColors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing['3xl'],
      ...theme.shadows.sm,
    },
    termsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    termsIcon: {
      fontSize: 24,
      marginRight: theme.spacing.md,
    },
    termsTitle: {
      ...theme.textStyles.labelLarge,
      color: theme.semanticColors.text.primary,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    termsDescription: {
      ...theme.textStyles.body,
      color: theme.semanticColors.text.secondary,
      lineHeight: theme.typography.lineHeight.relaxed,
      marginBottom: theme.spacing.lg,
    },
    termsLinks: {
      gap: theme.spacing.sm,
    },
    termsLink: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    linkText: {
      ...theme.textStyles.body,
      color: theme.colors.primary,
      textDecorationLine: 'underline',
    },
    termsCheckbox: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.semanticColors.border.primary,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderWidth: 2,
      borderColor: formData.termsAccepted ? theme.colors.primary : theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.sm,
      marginRight: theme.spacing.md,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: formData.termsAccepted ? theme.colors.primary : 'transparent',
    },
    checkmark: {
      color: theme.semanticColors.text.onPrimary,
      fontWeight: 'bold',
      fontSize: 16,
    },
    checkboxText: {
      ...theme.textStyles.body,
      color: theme.semanticColors.text.primary,
      flex: 1,
      lineHeight: theme.typography.lineHeight.relaxed,
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
                      trackColor={{ false: theme.semanticColors.border.primary, true: theme.colors.primary }}
                      thumbColor={theme.semanticColors.background.primary}
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