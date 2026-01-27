/**
 * CaloriTrack - Onboarding Commitment Screen
 * Minimal. Cool. Aesthetic.
 */

import { LightTheme } from '@/constants';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/button';
import PhoneInput from '../../components/ui/phone-input';
import { useOnboarding } from '../../context/onboarding-context';
import { useOnboardingSync } from '../../hooks/use-onboarding-sync';
import { PhoneInputValue } from '@/types/ui';

const CommitmentScreen = () => {

  const { profile, updateProfile, nextStep, calculatedValues, updateCommitment } = useOnboarding();
  const { completeOnboarding, isReadyToComplete } = useOnboardingSync();

  const [commitmentData, setCommitmentData] = useState({
    firstName: profile.name || '',
    lastName: profile.lastName || '',
    email: '',
    phone: {
      countryCode: 'TR',
      dialCode: '+90',
      phoneNumber: '',
    } as PhoneInputValue,
    isCommitmentAccepted: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean | PhoneInputValue) => {
    setCommitmentData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  
  
  const validateForm = () => {
    if (!commitmentData.firstName.trim()) {
      Alert.alert('Hata', 'Lütfen adınızı giriniz.');
      return false;
    }
    if (!commitmentData.lastName.trim()) {
      Alert.alert('Hata', 'Lütfen soyadınızı giriniz.');
      return false;
    }
    if (!commitmentData.email.trim()) {
      Alert.alert('Hata', 'Lütfen e-posta adresinizi giriniz.');
      return false;
    }
    if (!commitmentData.isCommitmentAccepted) {
      Alert.alert('Hata', 'Lütfen taahhüdü onaylayınız.');
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(commitmentData.email)) {
      Alert.alert('Hata', 'Lütfen geçerli bir e-posta adresi giriniz.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    console.log('Commitment form submission started');
    if (!validateForm()) return;

    // Check if user is ready to complete onboarding
    console.log('Checking if ready to complete:', isReadyToComplete());
    if (!isReadyToComplete()) {
      Alert.alert('Hata', 'Lütfen önce tüm gerekli profil ve hedef bilgilerini doldurun.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Update profile with commitment data
      const profileUpdate = {
        name: commitmentData.firstName,
        lastName: commitmentData.lastName,
      };

      console.log('Updating profile with:', profileUpdate);
      updateProfile(profileUpdate);

      // Update commitment data
      const commitmentUpdate = {
        firstName: commitmentData.firstName,
        lastName: commitmentData.lastName,
        email: commitmentData.email,
        phone: commitmentData.phone.phoneNumber
          ? `${commitmentData.phone.dialCode} ${commitmentData.phone.phoneNumber}`
          : '',
        commitmentStatement: commitmentData.isCommitmentAccepted ? 'Okudum, onaylıyorum' : '',
        timestamp: new Date().toISOString(),
      };

      console.log('Updating commitment with:', commitmentUpdate);
      updateCommitment(commitmentUpdate);

      // Log calculated values for debugging
      console.log('Calculated values being saved:', calculatedValues);

      // Navigate to account creation screen
      console.log('Navigating to account-creation...');
      router.push('/onboarding/account-creation');
    } catch (error) {
      console.error('Error submitting commitment:', error);
      Alert.alert('Hata', 'Taahhüt gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
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
      paddingHorizontal: LightTheme.spacing['2xl'],
      paddingVertical: LightTheme.spacing.lg,
    },
    header: {
      alignItems: 'center',
      marginBottom: LightTheme.spacing['4xl'],
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: LightTheme.borderRadius.full,
      backgroundColor: `${LightTheme.colors.primary}15`,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: LightTheme.spacing.xl,
      ...LightTheme.shadows.lg,
    },
    icon: {
      fontSize: 40,
    },
    title: {
      fontSize: LightTheme.typography['3xl'].fontSize,
      fontWeight: '600',
      color: LightTheme.semanticColors.text.primary,
      textAlign: 'center',
      marginBottom: LightTheme.spacing.lg,
      lineHeight: 36,
    },
    subtitle: {
      fontSize: LightTheme.typography.xl.fontSize,
      fontWeight: '500',
      color: LightTheme.semanticColors.text.secondary,
      textAlign: 'center',
      marginBottom: LightTheme.spacing.lg,
      lineHeight: 28,
    },
    description: {
      fontSize: 16,
      fontWeight: '400',
      color: LightTheme.semanticColors.text.secondary,
      textAlign: 'center',
      paddingHorizontal: LightTheme.spacing.lg,
      lineHeight: 24,
      marginBottom: LightTheme.spacing['2xl'],
    },
    form: {
      gap: LightTheme.spacing.lg,
    },
    inputGroup: {
      gap: LightTheme.spacing.sm,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: LightTheme.semanticColors.text.primary,
      marginBottom: LightTheme.spacing.xs,
    },
    input: {
      backgroundColor: LightTheme.semanticColors.background.secondary,
      borderWidth: 1,
      borderColor: LightTheme.semanticColors.border.primary,
      borderRadius: LightTheme.borderRadius.lg,
      paddingHorizontal: LightTheme.spacing.lg,
      paddingVertical: LightTheme.spacing.md,
      fontSize: 16,
      color: LightTheme.semanticColors.text.primary,
    },
    inputFocused: {
      borderColor: LightTheme.colors.primary,
      borderWidth: 2,
      shadowColor: LightTheme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    checkboxContainer: {
      backgroundColor: LightTheme.semanticColors.background.secondary,
      borderWidth: 2,
      borderColor: LightTheme.semanticColors.border.primary,
      borderRadius: LightTheme.borderRadius.lg,
      padding: LightTheme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: LightTheme.spacing.md,
    },
    checkboxContainerChecked: {
      borderColor: LightTheme.colors.primary,
      backgroundColor: `${LightTheme.colors.primary}10`,
    },
    checkbox: {
      width: 28,
      height: 28,
      borderWidth: 2,
      borderColor: LightTheme.semanticColors.border.primary,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxChecked: {
      borderColor: LightTheme.colors.primary,
      backgroundColor: LightTheme.colors.primary,
    },
    checkmark: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '700',
      lineHeight: 20,
    },
    checkboxLabel: {
      flex: 1,
      fontSize: 16,
      fontWeight: '500',
      color: LightTheme.semanticColors.text.primary,
    },
    checkboxLabelChecked: {
      color: LightTheme.colors.primary,
      fontWeight: '600',
    },
    checkboxHint: {
      fontSize: 14,
      color: LightTheme.semanticColors.text.secondary,
      marginTop: LightTheme.spacing.sm,
      lineHeight: 20,
    },
    footer: {
      paddingHorizontal: LightTheme.spacing['2xl'],
      paddingBottom: LightTheme.spacing['4xl'],
      paddingTop: LightTheme.spacing.xl,
      backgroundColor: LightTheme.semanticColors.background.primary,
      borderTopLeftRadius: LightTheme.borderRadius.xl,
      borderTopRightRadius: LightTheme.borderRadius.xl,
      ...LightTheme.shadows.lg,
    },
    buttonContainer: {
      gap: LightTheme.spacing.md,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>✍️</Text>
            </View>
            <Text style={styles.title}>Sağlık Taahhüdü</Text>
            <Text style={styles.subtitle}>Yaşam tarzınızı değiştirme sözü verin</Text>
            <Text style={styles.description}>
              CaloriTrack uygulamasıyla başarılı olmak için kendinize olan taahhüdünüzü belirtin. Bu bilgiler kişisel hedeflerinizi oluşturmanıza yardımcı olacaktır.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Adınız *</Text>
              <TextInput
                style={styles.input}
                placeholder="Adınızı giriniz"
                placeholderTextColor={LightTheme.semanticColors.text.tertiary}
                value={commitmentData.firstName}
                onChangeText={(value) => handleInputChange('firstName', value)}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Soyadınız *</Text>
              <TextInput
                style={styles.input}
                placeholder="Soyadınızı giriniz"
                placeholderTextColor={LightTheme.semanticColors.text.tertiary}
                value={commitmentData.lastName}
                onChangeText={(value) => handleInputChange('lastName', value)}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-posta Adresiniz *</Text>
              <TextInput
                style={styles.input}
                placeholder="ornek@email.com"
                placeholderTextColor={LightTheme.semanticColors.text.tertiary}
                value={commitmentData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <PhoneInput
                value={commitmentData.phone}
                onChange={(value) => handleInputChange('phone', value)}
                label="Telefon (İsteğe Bağlı)"
                placeholder="555 123 45 67"
                defaultCountry="TR"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Taahhüt *</Text>
              <TouchableOpacity
                style={[
                  styles.checkboxContainer,
                  commitmentData.isCommitmentAccepted && styles.checkboxContainerChecked,
                ]}
                onPress={() => handleInputChange('isCommitmentAccepted', !commitmentData.isCommitmentAccepted)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.checkbox,
                  commitmentData.isCommitmentAccepted && styles.checkboxChecked,
                ]}>
                  {commitmentData.isCommitmentAccepted && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
                <Text style={[
                  styles.checkboxLabel,
                  commitmentData.isCommitmentAccepted && styles.checkboxLabelChecked,
                ]}>
                  Taahhüt bildirimini okudum, onaylıyorum
                </Text>
              </TouchableOpacity>
              <Text style={styles.checkboxHint}>
                Bu onay ile sağlık hedeflerinize ulaşmak için CaloriTrack uygulamasını düzenli kullanacağınızı taahhüt etmiş olursunuz.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <Button
            title={isSubmitting ? 'Gönderiliyor...' : 'Taahhüdü Gönder'}
            onPress={handleSubmit}
            disabled={isSubmitting}
            fullWidth
            style={LightTheme.shadows.lg}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CommitmentScreen;