/**
 * CaloriTrack - Onboarding Profile Photo Screen
 * Minimal. Cool. Aesthetic.
 */

import { LightTheme } from '@/constants';
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
      backgroundColor: LightTheme.semanticColors.background.primary,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    content: {
      padding: LightTheme.spacing.lg,
      paddingTop: LightTheme.spacing.xl,
      paddingBottom: LightTheme.spacing.xl,
    },
    header: {
      marginBottom: LightTheme.spacing.xl,
      alignItems: 'center',
    },
    title: {
      fontSize: LightTheme.typography['3xl'].fontSize,
      fontWeight: '600',
      color: LightTheme.semanticColors.text.primary,
      marginBottom: LightTheme.spacing.md,
      marginTop: LightTheme.spacing.sm,
      textAlign: 'center',
      lineHeight: LightTheme.typography.base.lineHeight,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: LightTheme.typography.base.fontSize,
      fontWeight: '400',
      color: LightTheme.semanticColors.text.secondary,
      textAlign: 'center',
      lineHeight: LightTheme.typography.base.lineHeight,
    },
    photoContainer: {
      alignItems: 'center',
      marginBottom: LightTheme.spacing['6xl'],
    },
    photoWrapper: {
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: LightTheme.semanticColors.background.secondary,
      borderWidth: 3,
      borderColor: LightTheme.semanticColors.border.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: LightTheme.spacing.lg,
      overflow: 'hidden',
    },
    photoImage: {
      width: '100%',
      height: '100%',
    },
    placeholderIcon: {
      fontSize: 60,
      marginBottom: LightTheme.spacing.sm,
    },
    placeholderText: {
      fontSize: LightTheme.typography.sm.fontSize,
      fontWeight: '400',
      color: LightTheme.semanticColors.text.secondary,
      textAlign: 'center',
    },
    actionButtonContainer: {
      gap: LightTheme.spacing.md,
      marginBottom: LightTheme.spacing.lg,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: LightTheme.spacing.md,
      borderWidth: 1,
      borderColor: LightTheme.semanticColors.border.primary,
      borderRadius: LightTheme.borderRadius.md,
      backgroundColor: LightTheme.semanticColors.background.primary,
    },
    removeButton: {
      borderColor: LightTheme.colors.error,
    },
    buttonText: {
      fontSize: LightTheme.typography.base.fontSize,
      fontWeight: '500',
      color: LightTheme.semanticColors.text.primary,
      marginLeft: LightTheme.spacing.sm,
    },
    removeButtonText: {
      color: LightTheme.colors.error,
    },
    skipText: {
      color: LightTheme.semanticColors.text.primary,
      textAlign: 'center',
      marginTop: LightTheme.spacing.lg,
      fontSize: LightTheme.typography.base.fontSize,
      fontWeight: '500',
      lineHeight: LightTheme.typography.base.lineHeight,
      paddingHorizontal: LightTheme.spacing.md,
    },
    buttonContainer: {
      paddingHorizontal: LightTheme.spacing.md,
      paddingBottom: LightTheme.spacing['6xl'],
      paddingTop: LightTheme.spacing.xl,
      backgroundColor: LightTheme.semanticColors.background.primary,
      borderTopLeftRadius: LightTheme.borderRadius.xl,
      borderTopRightRadius: LightTheme.borderRadius.xl,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 15,
      elevation: 5,
    },
  });

  const currentStep = getCurrentStep('profile-photo');

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
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

          <View style={styles.actionButtonContainer}>
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

      <View style={styles.buttonContainer}>
        <Button
          title="Devam Et"
          onPress={handleNext}
          fullWidth
          style={LightTheme.shadows.md}
        />
      </View>
    </SafeAreaView>
  );
};

export default ProfilePhotoScreen;
