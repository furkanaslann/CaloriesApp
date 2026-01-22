/**
 * CaloriTrack - Onboarding Profile Summary Screen
 * Minimal. Cool. Aesthetic.
 */

import { LightTheme } from '@/constants';
import { router } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/button';
import ProgressBar from '../../components/ui/progress-bar';
import { useOnboarding } from '../../context/onboarding-context';

const ProfileScreen = () => {
  const { profile, nextStep, previousStep, totalSteps, getCurrentStep } = useOnboarding();

  const handleNext = () => {
    nextStep();
    router.push('/onboarding/goals-primary');
  };

  const handlePrevious = () => {
    previousStep();
    router.back();
  };

  const handleEdit = (field: string) => {
    // Navigate to the specific edit screen
    switch (field) {
      case 'name':
        router.push('/onboarding/name');
        break;
      case 'lastName':
        router.push('/onboarding/last-name');
        break;
      case 'dateOfBirth':
        router.push('/onboarding/date-of-birth');
        break;
      case 'gender':
        router.push('/onboarding/gender');
        break;
      case 'height':
        router.push('/onboarding/height');
        break;
      case 'weight':
        router.push('/onboarding/weight');
        break;
      case 'profilePhoto':
        router.push('/onboarding/profile-photo');
        break;
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
    scrollContent: {
      flexGrow: 1,
    },
    content: {
      padding: LightTheme.spacing.lg,
    },
    header: {
      marginTop: 40,
      marginBottom: LightTheme.spacing['3xl'],
    },
    title: {
      color: LightTheme.semanticColors.text.primary,
      marginBottom: LightTheme.spacing.md,
      textAlign: 'center',
      lineHeight: 40,
      fontSize: 32,
      fontWeight: '700',
    },
    subtitle: {
      fontSize: LightTheme.typography.base.fontSize,
      color: LightTheme.semanticColors.text.secondary,
      textAlign: 'center',
      lineHeight: LightTheme.typography.base.lineHeight,
    },
    profileContainer: {
      marginBottom: LightTheme.spacing['3xl'],
    },
    profileHeader: {
      alignItems: 'center',
      marginBottom: LightTheme.spacing.xl,
    },
    profilePhoto: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: LightTheme.semanticColors.background.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: LightTheme.spacing.md,
      borderWidth: 2,
      borderColor: LightTheme.semanticColors.border.primary,
    },
    profilePhotoPlaceholder: {
      fontSize: 40,
    },
    profileName: {
      fontSize: LightTheme.typography.xl.fontSize,
      fontWeight: '600',
      color: LightTheme.semanticColors.text.primary,
      marginBottom: LightTheme.spacing.xs,
    },
    profileDetails: {
      fontSize: LightTheme.typography.base.fontSize,
      color: LightTheme.semanticColors.text.secondary,
    },
    section: {
      marginBottom: LightTheme.spacing.xl,
    },
    sectionTitle: {
      fontSize: LightTheme.typography.xl.fontSize,
      color: LightTheme.semanticColors.text.primary,
      marginBottom: LightTheme.spacing.md,
    },
    infoItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: LightTheme.spacing.md,
      backgroundColor: LightTheme.semanticColors.background.secondary,
      borderRadius: LightTheme.borderRadius.md,
      marginBottom: LightTheme.spacing.sm,
      borderWidth: 1,
      borderColor: LightTheme.semanticColors.border.primary,
    },
    infoLabel: {
      fontSize: LightTheme.typography.base.fontSize,
      fontWeight: '400',
      color: LightTheme.semanticColors.text.secondary,
      flex: 1,
    },
    infoValue: {
      fontSize: LightTheme.typography.base.fontSize,
      fontWeight: '500',
      color: LightTheme.semanticColors.text.primary,
      flex: 2,
      textAlign: 'right',
    },
    editButton: {
      fontSize: LightTheme.typography.sm.fontSize,
      fontWeight: '500',
      color: LightTheme.colors.primary,
      textDecorationLine: 'underline',
      marginLeft: LightTheme.spacing.sm,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: LightTheme.spacing.md,
      paddingHorizontal: LightTheme.spacing.lg,
      paddingBottom: LightTheme.spacing.xl,
    },
    topBar: {
      paddingTop: LightTheme.spacing.lg,
      backgroundColor: LightTheme.semanticColors.background.primary,
    },
  });

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'male':
        return 'Erkek';
      case 'female':
        return 'Kadın';
      case 'other':
        return 'Diğer';
      default:
        return gender;
    }
  };

  return (
    <SafeAreaView style={styles.container as ViewStyle} edges={['left', 'right', 'bottom']}>
      <View style={styles.topBar}>
        <ProgressBar currentStep={getCurrentStep('profile')} totalSteps={totalSteps} onBack={handlePrevious} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Profil Özeti</Text>
            <Text style={styles.subtitle}>
              Bilgilerinizi kontrol edin ve devam edin
            </Text>
          </View>

          <View style={styles.profileContainer}>
            <View style={styles.profileHeader}>
              <View style={styles.profilePhoto}>
                {profile.profilePhoto ? (
                  <></> // Image component would go here
                ) : (
                  <Text style={styles.profilePhotoPlaceholder}>👤</Text>
                )}
              </View>
              <Text style={styles.profileName}>
                {profile.name} {profile.lastName}
              </Text>
              <Text style={styles.profileDetails}>
                {profile.age} yaş • {getGenderLabel(profile.gender || '')}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Ad</Text>
                <Text style={styles.infoValue}>{profile.name || 'Belirtilmemiş'}</Text>
                <TouchableOpacity onPress={() => handleEdit('name')}>
                  <Text style={styles.editButton}>Düzenle</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Soyad</Text>
                <Text style={styles.infoValue}>{profile.lastName || 'Belirtilmemiş'}</Text>
                <TouchableOpacity onPress={() => handleEdit('lastName')}>
                  <Text style={styles.editButton}>Düzenle</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Doğum Tarihi</Text>
                <Text style={styles.infoValue}>
                  {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
                </Text>
                <TouchableOpacity onPress={() => handleEdit('dateOfBirth')}>
                  <Text style={styles.editButton}>Düzenle</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Cinsiyet</Text>
                <Text style={styles.infoValue}>{getGenderLabel(profile.gender || '')}</Text>
                <TouchableOpacity onPress={() => handleEdit('gender')}>
                  <Text style={styles.editButton}>Düzenle</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fiziksel Bilgiler</Text>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Boy</Text>
                <Text style={styles.infoValue}>{profile.height} cm</Text>
                <TouchableOpacity onPress={() => handleEdit('height')}>
                  <Text style={styles.editButton}>Düzenle</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Kilo</Text>
                <Text style={styles.infoValue}>{profile.currentWeight} kg</Text>
                <TouchableOpacity onPress={() => handleEdit('weight')}>
                  <Text style={styles.editButton}>Düzenle</Text>
                </TouchableOpacity>
              </View>
            </View>
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

export default ProfileScreen;