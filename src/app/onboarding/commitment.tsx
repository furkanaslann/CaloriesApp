/**
 * CaloriTrack - Onboarding Commitment Screen
 * Minimal. Cool. Aesthetic.
 */

import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Button from '../../components/ui/button';
import { useOnboarding } from '../../context/onboarding-context';
import { useUser } from '../../context/user-context';
import { useTheme } from '@/constants';

const CommitmentScreen = () => {
  const theme = useTheme();
  const { updateProfile, nextStep } = useOnboarding();
  const { updateUserProfile, updateCommitment, completeOnboarding } = useUser();

  const [commitmentData, setCommitmentData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    commitmentStatement: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
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
    if (!commitmentData.commitmentStatement.trim()) {
      Alert.alert('Hata', 'Lütfen taahhüt bildiriminizi giriniz.');
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
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Update profile with commitment data in both contexts
      const profileUpdate = {
        name: commitmentData.firstName,
        lastName: commitmentData.lastName,
      };

      updateProfile(profileUpdate);
      await updateUserProfile(profileUpdate);

      // Update commitment data
      const commitmentUpdate = {
        firstName: commitmentData.firstName,
        lastName: commitmentData.lastName,
        email: commitmentData.email,
        phone: commitmentData.phone,
        commitmentStatement: commitmentData.commitmentStatement,
        timestamp: new Date().toISOString(),
      };

      await updateCommitment(commitmentUpdate);

      // Complete onboarding and save to Firestore
      nextStep();
      await completeOnboarding();

      // Navigate to main app
      router.replace('/(tabs)');
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
    inputFocused: {
      borderColor: theme.semanticColors.border.focus,
      borderWidth: 2,
      ...theme.shadows.sm,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    commitmentPreview: {
      backgroundColor: theme.semanticColors.background.tertiary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    previewTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.sm,
    },
    previewText: {
      fontSize: 14,
      color: theme.semanticColors.text.secondary,
      fontStyle: 'italic',
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
                placeholderTextColor={theme.semanticColors.text.muted}
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
                placeholderTextColor={theme.semanticColors.text.muted}
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
                placeholderTextColor={theme.semanticColors.text.muted}
                value={commitmentData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Telefon (İsteğe Bağlı)</Text>
              <TextInput
                style={styles.input}
                placeholder="+90 555 123 45 67"
                placeholderTextColor={theme.semanticColors.text.muted}
                value={commitmentData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Taahhüt Bildiriminiz *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Kendinize ne taahhüt vermek istersiniz? Örneğin: 'Her gün düzenli olarak beslenme takibi yapacağım' veya 'Sağlıklı yaşam alışkanlıkları kazanacağım'..."
                placeholderTextColor={theme.semanticColors.text.muted}
                value={commitmentData.commitmentStatement}
                onChangeText={(value) => handleInputChange('commitmentStatement', value)}
                multiline
                textAlignVertical="top"
              />
            </View>

            {commitmentData.commitmentStatement && (
              <View style={styles.commitmentPreview}>
                <Text style={styles.previewTitle}>Taahhüdünüz:</Text>
                <Text style={styles.previewText}>
                  "{commitmentData.commitmentStatement}"
                </Text>
              </View>
            )}
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

export default CommitmentScreen;