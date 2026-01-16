/**
 * CaloriTrack - Onboarding Profile Photo Screen
 * Minimal. Cool. Aesthetic.
 */

import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/button';
import ProgressBar from '../../components/ui/progress-bar';
import { useOnboarding } from '../../context/onboarding-context';

const ProfilePhotoScreen = () => {
  // Modern theme system using constants
  const theme = {
    semanticColors: {
      background: { primary: COLORS.background, surface: COLORS.surfaceAlt },
      text: { primary: COLORS.textPrimary, secondary: COLORS.textSecondary, tertiary: COLORS.textTertiary },
      border: { primary: COLORS.border, secondary: COLORS.border },
    },
    colors: { primary: COLORS.primary, error: COLORS.error },
    textStyles: {
      heading2: { fontSize: TYPOGRAPHY.fontSizes['2xl'], fontWeight: '600' as const },
      onboardingTitle: { fontSize: TYPOGRAPHY.fontSizes['3xl'], fontWeight: '600' as const, lineHeight: TYPOGRAPHY.lineHeights.tight, letterSpacing: -0.5 },
      body: { fontSize: TYPOGRAPHY.fontSizes.base, fontWeight: '400' as const },
      bodySmall: { fontSize: TYPOGRAPHY.fontSizes.sm, fontWeight: '400' as const },
      buttonMedium: { fontSize: TYPOGRAPHY.fontSizes.base, fontWeight: '500' as const },
    },
    typography: {
      fontWeights: TYPOGRAPHY.fontWeights,
      lineHeight: { relaxed: TYPOGRAPHY.lineHeights.relaxed },
    },
    spacing: {
      ...SPACING,
      sm: SPACING[2],
      md: SPACING[3],
      lg: SPACING[4],
      xl: SPACING[5],
      '3xl': SPACING[12],
      '4xl': SPACING[12],
    },
    borderRadius: BORDER_RADIUS,
    shadows: SHADOWS,
  };
  const { profile, updateProfile, nextStep, previousStep, totalSteps, getCurrentStep } = useOnboarding();

  const [profilePhoto, setProfilePhoto] = useState<string | undefined>(profile.profilePhoto);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'İzin Gerekli',
        'Profil fotoğrafı eklemek için fotoğraf galerinize erişim izni gerekmektedir.',
        [{ text: 'Tamam' }]
      );
      return false;
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfilePhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Hata', 'Fotoğraf seçilirken bir hata oluştu.');
      console.error('Image picker error:', error);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'İzin Gerekli',
        'Profil fotoğrafı çekmek için kamera izni gerekmektedir.',
        [{ text: 'Tamam' }]
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfilePhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Hata', 'Fotoğraf çekilirken bir hata oluştu.');
      console.error('Camera error:', error);
    }
  };

  const removePhoto = () => {
    setProfilePhoto(undefined);
  };

  const handleNext = () => {
    updateProfile({ profilePhoto });
    nextStep();
    router.push('/onboarding/profile');
  };

  const handlePrevious = () => {
    previousStep();
    router.back();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.semanticColors.background.primary,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    content: {
      padding: theme.spacing.lg,
      paddingTop: theme.spacing['4xl'],
      paddingBottom: theme.spacing['4xl'],
    },
    header: {
      marginBottom: theme.spacing['3xl'],
      alignItems: 'center',
    },
    title: {
      ...theme.textStyles.onboardingTitle,
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.md,
      marginTop: theme.spacing.sm,
      textAlign: 'center',
    },
    subtitle: {
      ...theme.textStyles.body,
      color: theme.semanticColors.text.primary,
      textAlign: 'center',
      lineHeight: theme.typography.lineHeight.relaxed,
      fontWeight: theme.typography.fontWeights.semibold,
      fontSize: TYPOGRAPHY.fontSizes.xl,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.xl,
      backgroundColor: theme.semanticColors.background.primary,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg
    },
    photoContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing['3xl'],
    },
    photoWrapper: {
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: theme.semanticColors.background.surface,
      borderWidth: 3,
      borderColor: theme.semanticColors.border.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
      overflow: 'hidden',
    },
    photoImage: {
      width: '100%',
      height: '100%',
    },
    placeholderIcon: {
      fontSize: 60,
      marginBottom: theme.spacing.sm,
    },
    placeholderText: {
      ...theme.textStyles.bodySmall,
      color: theme.semanticColors.text.tertiary,
      textAlign: 'center',
    },
    buttonContainer: {
      gap: theme.spacing.md,
      marginBottom: theme.spacing['3xl'],
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.semanticColors.background.primary,
    },
    removeButton: {
      borderColor: theme.colors.error,
    },
    buttonText: {
      ...theme.textStyles.buttonMedium,
      color: theme.semanticColors.text.primary,
      marginLeft: theme.spacing.sm,
    },
    removeButtonText: {
      color: theme.colors.error,
    },
    skipText: {
      color: theme.semanticColors.text.primary,
      textAlign: 'center',
      marginTop: theme.spacing.lg,
      fontSize: TYPOGRAPHY.fontSizes.base,
      fontWeight: theme.typography.fontWeights.medium,
      lineHeight: theme.typography.lineHeight.relaxed,
      backgroundColor: theme.semanticColors.background.surface,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.secondary,
    },
    bottomButtonContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
  });

  const currentStep = getCurrentStep('profile-photo');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} onBack={handlePrevious} />

          <View style={styles.header}>
            <Text style={styles.title}>Profil Fotoğrafı</Text>
            <Text style={styles.subtitle}>
              Profilinize bir fotoğraf ekleyerek kişiselleştirebilirsiniz.
            </Text>
          </View>

          <View style={styles.photoContainer}>
            <View style={styles.photoWrapper}>
              {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} style={styles.photoImage} />
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.placeholderIcon}>👤</Text>
                  <Text style={styles.placeholderText}>Fotoğraf Yok</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={pickImageFromGallery}>
              <Text style={styles.buttonText}>📷 Galeriden Seç</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
              <Text style={styles.buttonText}>📸 Fotoğraf Çek</Text>
            </TouchableOpacity>

            {profilePhoto && (
              <TouchableOpacity
                style={[styles.actionButton, styles.removeButton]}
                onPress={removePhoto}
              >
                <Text style={[styles.buttonText, styles.removeButtonText]}>
                  🗑️ Fotoğrafı Kaldır
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.skipText}>
            Profil fotoğrafı eklemek isteğe bağlıdır. Devam etmek için "Atla" butonuna basabilirsiniz.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomButtonContainer}>
        <Button
          title="Atla"
          onPress={handleNext}
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

export default ProfilePhotoScreen;