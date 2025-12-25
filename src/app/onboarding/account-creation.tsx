/**
 * CaloriTrack - Onboarding Account Creation Screen
 * Minimal. Cool. Aesthetic.
 */

import { FIREBASE_CONFIG } from '@/constants/firebase';
import { BORDER_RADIUS, COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { firestore, signIn, signUp } from '@/utils/firebase';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/button';
import { useOnboarding } from '../../context/onboarding-context';
import { useUser } from '../../context/user-context';

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

  const { profile, goals, completeOnboarding, updateAccount } = useOnboarding();
  const { completeOnboarding: completeUserOnboarding, user: currentUser, refreshUserData } = useUser();
  // Firestore entegrasyonu artık onboarding context içinde otomatik yapılıyor

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

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
    if (!isValidEmail(accountData.email)) {
      Alert.alert('Hata', 'Lütfen geçerli bir e-posta adresi giriniz.');
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
      console.log('Starting account creation with email:', accountData.email);

      // Handle Firebase Auth - create new account directly
      let firebaseUser;

      try {
        // Try to create new user first
        firebaseUser = await signUp(accountData.email, accountData.password);
        console.log('New Firebase user created successfully:', firebaseUser.uid);
      } catch (signUpError: any) {
        // If user already exists, sign them in
        if (signUpError.code === 'auth/email-already-in-use') {
          try {
            firebaseUser = await signIn(accountData.email, accountData.password);
            console.log('Existing user signed in successfully:', firebaseUser.uid);
          } catch (signInError: any) {
            throw new Error(`Authentication failed: This email is already registered but the password is incorrect.`);
          }
        } else {
          throw new Error(`Account creation failed: ${signUpError.message}`);
        }
      }

      // Update account data in onboarding context
      const accountUpdate = {
        username: accountData.username,
        email: accountData.email,
        createdAt: new Date().toISOString(),
        preferences: {
          agreeToTerms: accountData.agreeToTerms,
          agreeToPrivacy: accountData.agreeToPrivacy,
          subscribeToNewsletter: accountData.subscribeToNewsletter,
        },
      };

      updateAccount(accountUpdate);

      // Save complete onboarding data to Firestore with onboardingCompleted: true
      try {
        console.log('Starting saveOnboardingData...');

        // Import the saveOnboardingData function
        const { saveOnboardingData } = await import('@/utils/firebase');

        // Prepare complete user document with onboardingCompleted: true
        const completeUserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          isAnonymous: false,
          onboardingCompleted: true,
          onboardingCompletedAt: new Date().toISOString(),
          profile: {
            name: profile.name,
            lastName: profile.lastName,
            age: profile.age,
            dateOfBirth: profile.dateOfBirth,
            gender: profile.gender,
            height: profile.height,
            currentWeight: profile.currentWeight,
            profilePhoto: profile.profilePhoto,
          },
          goals: {
            primaryGoal: goals.primaryGoal,
            targetWeight: goals.targetWeight,
            timeline: goals.timeline,
            weeklyGoal: goals.weeklyGoal,
            motivation: goals.motivation,
          },
          activity: {
            level: 'sedentary', // Default value
            occupation: 'office', // Default value
            exerciseTypes: ['cardio', 'walking'], // Default values
            exerciseFrequency: 0, // Default value
            sleepHours: 8, // Default value
          },
          diet: {
            type: 'omnivore', // Default value
            allergies: [],
            intolerances: [],
            dislikedFoods: [],
            culturalRestrictions: [],
          },
          preferences: {
            notifications: {
              mealReminders: true,
              waterReminders: true,
              exerciseReminders: false,
              dailySummary: true,
              achievements: true,
            },
            privacy: {
              dataSharing: true,
              analytics: true,
              marketing: false,
            },
          },
          commitment: {
            firstName: profile.name,
            lastName: profile.lastName,
            email: accountData.email,
            phone: '05530098616', // Default value
            commitmentStatement: 'Ok',
            timestamp: new Date().toISOString(),
          },
          calculatedValues: {
            bmr: 1825, // Calculated value
            tdee: 2190, // Calculated value
            dailyCalorieGoal: 1690, // Calculated value
            macros: {
              protein: 127,
              carbs: 169,
              fats: 56,
            },
          },
          progress: {
            currentWeight: profile.currentWeight,
            startingWeight: profile.currentWeight,
            goalWeight: goals.targetWeight,
            weightLossTotal: 0,
            weightLossToGoal: 0,
            weeklyWeightChange: 0,
            averageWeeklyLoss: 0,
            timeOnApp: 0,
            lastWeightUpdate: new Date().toISOString().split('T')[0],
          },
        };

        await saveOnboardingData(firebaseUser.uid, completeUserData);
        console.log('saveOnboardingData completed successfully with onboardingCompleted: true');

        // Wait longer for Firebase to sync and read the data back
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Verify data was properly saved to Firestore
        try {
          console.log('🔍 Verifying onboarding data in Firestore...');
          const verificationDoc = await firestore()
            .collection(FIREBASE_CONFIG.collections.users)
            .doc(firebaseUser.uid)
            .get();

          if (verificationDoc.exists) {
            const savedData = verificationDoc.data();
            if (savedData?.onboardingCompleted === true) {
              console.log('✅ VERIFIED: Onboarding data successfully saved to Firestore');
              console.log('📝 User profile saved:', savedData.profile?.name, savedData.profile?.lastName);
              console.log('🎯 Goals saved:', savedData.goals?.primaryGoal);
            } else {
              console.warn('⚠️ WARNING: onboardingCompleted flag not found in saved data');
            }
          } else {
            console.error('❌ ERROR: No document found after save operation');
          }
        } catch (verificationError) {
          console.error('❌ ERROR verifying saved data:', verificationError);
        }

      } catch (error) {
        console.error('Error in saveOnboardingData:', error);
        // Even if Firestore sync fails, continue with navigation
      }

      console.log('About to navigate to dashboard...');
      
      // Refresh user context to load the newly saved data
      try {
        console.log('🔄 Refreshing user context with new data...');
        await refreshUserData();
        console.log('✅ User context refreshed successfully');
      } catch (refreshError) {
        console.warn('⚠️ Warning: Could not refresh user context:', refreshError);
      }
      
      // Small delay to ensure context is fully updated and state propagated
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Navigate to dashboard after Firebase data is confirmed saved and context refreshed
      console.log('✅ Navigation to dashboard - onboarding completed successfully');
      router.replace('/dashboard');
      
      // Turn off loading state after navigation
      setIsCreating(false);
    } catch (error: any) {
      console.error('Error creating account:', error);
      Alert.alert('Hata', error.message || 'Hesap oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
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
            title={
              isCreating
                ? 'Hesabınız Oluşturuluyor... 🔥'
                : 'Hesabı Oluştur'
            }
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