/**
 * CaloriTrack - Onboarding Account Creation Screen
 * Minimal. Cool. Aesthetic.
 */

import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from '../../components/ui/button';
import { useOnboarding } from '../../context/onboarding-context';

const AccountCreationScreen = () => {
  // Theme object using constants
  const theme = {
    semanticColors: {
      background: { primary: COLORS.background, surface: COLORS.surfaceAlt },
      text: {
        primary: COLORS.textPrimary,
        secondary: COLORS.textSecondary,
        tertiary: COLORS.textTertiary,
        onPrimary: '#FFFFFF'
      },
      border: { primary: COLORS.border, secondary: COLORS.border },
      success: { background: COLORS.successLight, text: COLORS.successDark },
      error: { background: COLORS.errorLight, text: COLORS.errorDark },
    },
    colors: {
      primary: COLORS.primary,
      gradientStart: COLORS.gradientStart,
      gradientEnd: COLORS.gradientEnd,
      success: COLORS.success,
      error: COLORS.error,
    },
    textStyles: {
      heading1: { fontSize: TYPOGRAPHY.fontSizes['4xl'], fontWeight: '700' },
      heading2: { fontSize: TYPOGRAPHY.fontSizes['2xl'], fontWeight: '600' },
      heading3: { fontSize: TYPOGRAPHY.fontSizes.xl, fontWeight: '600' },
      body: { fontSize: TYPOGRAPHY.fontSizes.base, fontWeight: '400' },
      bodySmall: { fontSize: TYPOGRAPHY.fontSizes.sm, fontWeight: '400' },
      button: { fontSize: TYPOGRAPHY.fontSizes.base, fontWeight: '500' },
      input: { fontSize: TYPOGRAPHY.fontSizes.base, fontWeight: '400' },
    },
    typography: {
      lineHeight: {
        tight: TYPOGRAPHY.lineHeights.tight,
        normal: TYPOGRAPHY.lineHeights.normal,
        relaxed: TYPOGRAPHY.lineHeights.relaxed,
      },
      fontWeight: {
        regular: TYPOGRAPHY.fontWeights.regular,
        medium: TYPOGRAPHY.fontWeights.medium,
        semibold: TYPOGRAPHY.fontWeights.semibold,
        bold: TYPOGRAPHY.fontWeights.bold,
      },
    },
    spacing: {
      ...SPACING,
      xs: SPACING[1],
      sm: SPACING[2],
      md: SPACING[3],
      lg: SPACING[4],
      xl: SPACING[5],
      '2xl': SPACING[6],
      '3xl': SPACING[8],
      '4xl': SPACING[12],
    },
    borderRadius: BORDER_RADIUS,
    shadows: SHADOWS,
    coloredShadows: {
      primary: SHADOWS.md,
      success: SHADOWS.sm,
      error: SHADOWS.sm,
    },
    components: {
      input: {
        borderWidth: 1,
        borderRadius: BORDER_RADIUS.md,
        paddingHorizontal: SPACING[4],
        paddingVertical: SPACING[3],
      },
      button: {
        borderRadius: BORDER_RADIUS.md,
        paddingHorizontal: SPACING[6],
        paddingVertical: SPACING[3],
      },
      card: {
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING[6],
      },
    },
  };

  const { profile, completeOnboarding } = useOnboarding();

  const [accountData, setAccountData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    agreeToPrivacy: false,
    subscribeToNewsletter: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setAccountData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!accountData.username.trim()) {
      Alert.alert('Hata', 'Lütfen bir kullanıcı adı seçin.');
      return false;
    }
    if (accountData.username.length < 3) {
      Alert.alert('Hata', 'Kullanıcı adı en az 3 karakter olmalıdır.');
      return false;
    }
    if (!accountData.email.trim()) {
      Alert.alert('Hata', 'Lütfen e-posta adresinizi giriniz.');
      return false;
    }
    if (!accountData.password) {
      Alert.alert('Hata', 'Lütfen bir şifre belirleyin.');
      return false;
    }
    if (accountData.password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return false;
    }
    if (accountData.password !== accountData.confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return false;
    }
    if (!accountData.agreeToTerms) {
      Alert.alert('Hata', 'Lütfen kullanım koşullarını kabul edin.');
      return false;
    }
    if (!accountData.agreeToPrivacy) {
      Alert.alert('Hata', 'Lütfen gizlilik politikasını kabul edin.');
      return false;
    }
    return true;
  };

  const handleCreateAccount = async () => {
    if (!validateForm()) return;

    setIsCreating(true);

    try {
      // Simulate API call for account creation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Complete onboarding process
      completeOnboarding();

      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Hata', 'Hesap oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsCreating(false);
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
      paddingHorizontal: theme.spacing['2xl'],
      paddingVertical: theme.spacing['4xl'],
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing['4xl'],
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.full,
      backgroundColor: `${theme.colors.primary}15`,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
      ...theme.shadows.md,
    },
    icon: {
      fontSize: 40,
    },
    title: {
      fontSize: theme.textStyles.onboardingTitle?.fontSize || 30,
      fontWeight: theme.textStyles.onboardingTitle?.fontWeight || '600',
      color: theme.semanticColors.text.primary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
      lineHeight: 36,
    },
    subtitle: {
      fontSize: theme.textStyles.onboardingSubtitle?.fontSize || 20,
      fontWeight: theme.textStyles.onboardingSubtitle?.fontWeight || '500',
      color: theme.semanticColors.text.secondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
      lineHeight: 28,
    },
    description: {
      fontSize: 16,
      fontWeight: '400',
      color: theme.semanticColors.text.secondary,
      textAlign: 'center',
      paddingHorizontal: theme.spacing.lg,
      lineHeight: 24,
      marginBottom: theme.spacing['2xl'],
    },
    form: {
      gap: theme.spacing.lg,
    },
    inputGroup: {
      gap: theme.spacing.sm,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    input: {
      backgroundColor: theme.semanticColors.background.surface,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      fontSize: 16,
      color: theme.semanticColors.text.primary,
    },
    passwordContainer: {
      position: 'relative',
    },
    passwordToggle: {
      position: 'absolute',
      right: theme.spacing.md,
      top: '50%',
      transform: [{ translateY: -12 }],
      color: theme.semanticColors.text.tertiary,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 2,
      borderColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.sm,
      marginRight: theme.spacing.md,
      marginTop: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxChecked: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    checkboxText: {
      flex: 1,
      fontSize: 14,
      color: theme.semanticColors.text.secondary,
      lineHeight: 20,
    },
    linkText: {
      color: theme.colors.primary,
      textDecorationLine: 'underline',
    },
    welcomeCard: {
      backgroundColor: theme.semanticColors.background.tertiary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    welcomeTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.sm,
    },
    welcomeText: {
      fontSize: 14,
      color: theme.semanticColors.text.secondary,
      lineHeight: 20,
    },
    userName: {
      fontWeight: '600',
      color: theme.colors.primary,
    },
    footer: {
      paddingHorizontal: theme.spacing['2xl'],
      paddingBottom: theme.spacing['4xl'],
      paddingTop: theme.spacing.xl,
      backgroundColor: theme.semanticColors.background.primary,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      ...theme.shadows.lg,
    },
    buttonContainer: {
      gap: theme.spacing.md,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>👤</Text>
            </View>
            <Text style={styles.title}>Hesap Oluştur</Text>
            <Text style={styles.subtitle}>CaloriTrack ailesine katılın</Text>
            <Text style={styles.description}>
              Kişisel hesabınızı oluşturun ve sağlıklı yaşam yolculuğunuza başlayın. Verileriniz güvende kalacak.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Kullanıcı Adı *</Text>
              <TextInput
                style={styles.input}
                placeholder="kullanici_adi"
                placeholderTextColor={theme.semanticColors.text.muted}
                value={accountData.username}
                onChangeText={(value) => handleInputChange('username', value)}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-posta Adresi *</Text>
              <TextInput
                style={styles.input}
                placeholder="ornek@email.com"
                placeholderTextColor={theme.semanticColors.text.muted}
                value={accountData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Şifre *</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="En az 6 karakter"
                  placeholderTextColor={theme.semanticColors.text.muted}
                  value={accountData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Şifre Tekrar *</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Şifrenizi tekrar girin"
                  placeholderTextColor={theme.semanticColors.text.muted}
                  value={accountData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Text>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={[styles.checkbox, accountData.agreeToTerms && styles.checkboxChecked]}
                onPress={() => handleInputChange('agreeToTerms', !accountData.agreeToTerms)}
              >
                {accountData.agreeToTerms && <Text style={{ color: '#FFFFFF' }}>✓</Text>}
              </TouchableOpacity>
              <Text style={styles.checkboxText}>
                <Text style={styles.linkText}>Kullanım Koşulları</Text>'nı okudum ve kabul ediyorum.
              </Text>
            </View>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={[styles.checkbox, accountData.agreeToPrivacy && styles.checkboxChecked]}
                onPress={() => handleInputChange('agreeToPrivacy', !accountData.agreeToPrivacy)}
              >
                {accountData.agreeToPrivacy && <Text style={{ color: '#FFFFFF' }}>✓</Text>}
              </TouchableOpacity>
              <Text style={styles.checkboxText}>
                <Text style={styles.linkText}>Gizlilik Politikası</Text>'nı okudum ve kabul ediyorum.
              </Text>
            </View>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={[styles.checkbox, accountData.subscribeToNewsletter && styles.checkboxChecked]}
                onPress={() => handleInputChange('subscribeToNewsletter', !accountData.subscribeToNewsletter)}
              >
                {accountData.subscribeToNewsletter && <Text style={{ color: '#FFFFFF' }}>✓</Text>}
              </TouchableOpacity>
              <Text style={styles.checkboxText}>
                Sağlıklı yaşam ipuçları ve ürün güncellemeleri için bülten aboneliği (isteğe bağlı)
              </Text>
            </View>

            <View style={styles.welcomeCard}>
              <Text style={styles.welcomeTitle}>Hoş Geldiniz!</Text>
              <Text style={styles.welcomeText}>
                Merhaba <Text style={styles.userName}>{profile.name || 'Kullanıcı'}</Text>! CaloriTrack ailesine katılmak üzeresiniz.
                Hesabınız oluşturulduktan sonra kişisel hedeflerinizi belirleyebilir ve sağlıklı yaşam yolculuğunuza başlayabilirsiniz.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <Button
            title={isCreating ? 'Hesap Oluşturuluyor...' : 'Hesabı Oluştur'}
            onPress={handleCreateAccount}
            disabled={isCreating}
            fullWidth
            style={theme.coloredShadows?.gradient || {}}
          />
          <Button
            title="Geri Dön"
            onPress={() => router.back()}
            variant="secondary"
            fullWidth
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AccountCreationScreen;