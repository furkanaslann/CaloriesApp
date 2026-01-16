/**
 * CaloriTrack - Onboarding Profile Summary Screen
 * Minimal. Cool. Aesthetic.
 */

import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme';
import { router } from 'expo-router';
import React from 'react';
import {
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

const ProfileScreen = () => {
  // Modern theme system using constants
  const theme = {
    semanticColors: {
      background: { primary: '#FFFFFF', surface: '#F8FAFC' },
      text: { primary: '#1E293B', secondary: '#475569', tertiary: '#64748B' },
      border: { primary: '#E2E8F0', secondary: '#E2E8F0' },
    },
    colors: { primary: '#7C3AED' },
    textStyles: {
      heading2: { fontSize: 28, fontWeight: '600' },
      heading3: { fontSize: 24, fontWeight: '600' },
      heading4: { fontSize: 20, fontWeight: '600' },
      body: { fontSize: 16, fontWeight: '400' },
      bodyMedium: { fontSize: 16, fontWeight: '500' },
      labelSmall: { fontSize: 13, fontWeight: '500' },
    },
    typography: { lineHeight: { relaxed: 24 } },
    spacing: { lg: 24, md: 16, xl: 32, xs: 4, sm: 8, '3xl': 40 },
    borderRadius: { md: 10 },
    shadows: {},
  };
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
    },
    header: {
      marginTop: '10%',
      marginBottom: theme.spacing['3xl'],
    },
    title: {
      ...theme.textStyles.heading2,
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
      lineHeight: 40,
      fontSize: 32,
      fontWeight: '700',
    },
    subtitle: {
      ...theme.textStyles.body,
      color: theme.semanticColors.text.secondary,
      textAlign: 'center',
      lineHeight: theme.typography.lineHeight.relaxed,
    },
    profileContainer: {
      marginBottom: theme.spacing['3xl'],
    },
    profileHeader: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    profilePhoto: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.semanticColors.background.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      borderWidth: 2,
      borderColor: theme.semanticColors.border.primary,
    },
    profilePhotoPlaceholder: {
      fontSize: 40,
    },
    profileName: {
      ...theme.textStyles.heading3,
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    profileDetails: {
      ...theme.textStyles.body,
      color: theme.semanticColors.text.secondary,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      ...theme.textStyles.heading4,
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.md,
    },
    infoItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.md,
      backgroundColor: theme.semanticColors.background.surface,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
    },
    infoLabel: {
      ...theme.textStyles.body,
      color: theme.semanticColors.text.secondary,
      flex: 1,
    },
    infoValue: {
      ...theme.textStyles.bodyMedium,
      color: theme.semanticColors.text.primary,
      flex: 2,
      textAlign: 'right',
    },
    editButton: {
      ...theme.textStyles.labelSmall,
      color: theme.colors.primary,
      textDecorationLine: 'underline',
      marginLeft: theme.spacing.sm,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
    topBar: {
      paddingTop: SPACING[4],
      backgroundColor: theme.semanticColors.background.primary,
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
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <ProgressBar currentStep={getCurrentStep('profile')} totalSteps={totalSteps} onBack={handlePrevious} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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

export default ProfileScreen;