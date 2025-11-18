/**
 * CaloriTrack - Onboarding Profile Photo Screen
 * Minimal. Cool. Aesthetic.
 */

import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from '../../components/ui/button';
import { useOnboarding } from '../../contexts/onboarding-context';
import { useTheme } from '../../src/theme/index';

const ProfilePhotoScreen = () => {
  const themeResult = useTheme();
  const theme = themeResult || {
    semanticColors: {
      background: { primary: '#FFFFFF', surface: '#F8FAFC' },
      text: { primary: '#1E293B', secondary: '#475569', tertiary: '#64748B' },
      border: { primary: '#E2E8F0', secondary: '#E2E8F0' },
    },
    colors: { primary: '#7C3AED', error: '#EF4444' },
    textStyles: {
      heading2: { fontSize: 28, fontWeight: '600' },
      body: { fontSize: 16, fontWeight: '400' },
      bodySmall: { fontSize: 14, fontWeight: '400' },
      buttonMedium: { fontSize: 16, fontWeight: '500' },
    },
    typography: { lineHeight: { relaxed: 24 } },
    spacing: { lg: 24, md: 16, xl: 32, sm: 8, '3xl': 40 },
    borderRadius: { md: 10 },
    shadows: {},
  };
  const { profile, updateProfile, nextStep, previousStep } = useOnboarding();

  const [profilePhoto, setProfilePhoto] = useState(profile.profilePhoto || null);

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
    setProfilePhoto(null);
  };

  const handleNext = () => {
    updateProfile({ profilePhoto });
    nextStep();
    router.push('/onboarding/goals');
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
    content: {
      flex: 1,
      padding: theme.spacing.lg,
      justifyContent: 'flex-start',
    },
    header: {
      marginBottom: theme.spacing['3xl'],
      alignItems: 'center',
    },
    title: {
      ...theme.textStyles.onboardingTitle,
      fontSize: 32,
      fontWeight: '700',
      color: '#1E293B',
      marginBottom: theme.spacing.md,
      marginTop: theme.spacing.sm,
      textAlign: 'center',
      lineHeight: 40,
      //textShadowColor: 'rgba(0, 0, 0, 0.1)',
      //textShadowOffset: { width: 0, height: 1 },
      //textShadowRadius: 2,
    },
    subtitle: {
      ...theme.textStyles.body,
      color: '#1E293B',
      textAlign: 'center',
      lineHeight: 26,
      fontWeight: '700',
      fontSize: 20,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.xl,
      backgroundColor: '#FFFFFF',
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
      ...theme.textStyles.body,
      color: theme.semanticColors.text.primary,
      textAlign: 'center',
      marginTop: theme.spacing.lg,
      fontSize: 15,
      fontWeight: '500',
      lineHeight: 22,
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
    progressIndicator: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: '15%',
      marginBottom: theme.spacing.xl,
      paddingTop: '5%',
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.semanticColors.border.primary,
      marginHorizontal: 4,
    },
    dotActive: {
      backgroundColor: theme.colors.primary,
      width: 24,
    },
  });

  const totalSteps = 9;
  const currentStep = 7;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.progressIndicator}>
          {Array.from({ length: totalSteps }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentStep - 1 && styles.dotActive,
              ]}
            />
          ))}
        </View>

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

      <View style={styles.bottomButtonContainer}>
        <Button
          title="Geri"
          onPress={handlePrevious}
          variant="secondary"
        />
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