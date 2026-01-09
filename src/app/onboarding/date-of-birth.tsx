/**
 * CaloriTrack - Onboarding Date of Birth Screen
 * Minimal. Cool. Aesthetic.
 */

import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import ProgressBar from '../../components/ui/progress-bar';
import { useOnboarding } from '../../context/onboarding-context';

const DateOfBirthScreen = () => {
  // Modern theme system using constants
  const theme = {
    semanticColors: {
      background: { primary: '#FFFFFF', surface: '#F8FAFC', primarySurface: '#EDE9FE' },
      text: {
        primary: '#1E293B',
        secondary: '#475569',
        tertiary: '#64748B',
        onPrimary: '#FFFFFF'
      },
      border: { primary: '#E2E8F0', secondary: '#E2E8F0' },
    },
    colors: {
      primary: '#7C3AED',
      gradientStart: '#7C3AED',
      gradientEnd: '#EC4899',
    },
    textStyles: {
      onboardingTitle: { fontSize: 30, fontWeight: '600' },
      onboardingDescription: { fontSize: 16, fontWeight: '400' },
      heading2: { fontSize: 28, fontWeight: '600' },
      heading3: { fontSize: 24, fontWeight: '600' },
      body: { fontSize: 16, fontWeight: '400' },
      buttonMedium: { fontSize: 16, fontWeight: '500' },
    },
    typography: { lineHeight: { relaxed: 24 }, fontWeight: { semibold: '600' } },
    spacing: { lg: 24, md: 16, xl: 32, '4xl': 48, '2xl': 24, '3xl': 40, sm: 8 },
    borderRadius: { full: 9999, xl: 16, lg: 12, sm: 8 },
    shadows: { lg: {}, md: {}, sm: {} },
    coloredShadows: { primary: {} },
  };
  const { profile, updateProfile, nextStep, previousStep, totalSteps, getCurrentStep } = useOnboarding();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(
    profile.dateOfBirth ? new Date(profile.dateOfBirth) : new Date()
  );

  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const validateDate = (): boolean => {
    const age = calculateAge(dateOfBirth);

    if (age < 14) {
      Alert.alert('Hata', 'Yaşınız en az 14 olmalıdır.');
      return false;
    }

    if (age > 100) {
      Alert.alert('Hata', 'Lütfen geçerli bir doğum tarihi girin.');
      return false;
    }

    return true;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const handleNext = () => {
    if (!validateDate()) return;

    const age = calculateAge(dateOfBirth);
    updateProfile({
      dateOfBirth: dateOfBirth.toISOString().split('T')[0],
      age: age
    });
    nextStep();
    router.push('/onboarding/gender');
  };

  const handlePrevious = () => {
    previousStep();
    router.back();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme?.semanticColors?.background?.primary || '#FFFFFF',
    },
    content: {
      flex: 1,
      paddingHorizontal: theme?.spacing?.['2xl'] || 24,
      justifyContent: 'flex-start',
    },
    header: {
      marginTop: '10%',
      marginBottom: theme?.spacing?.['4xl'] || 48,
      alignItems: 'center',
    },
    title: {
      ...(theme?.textStyles?.onboardingTitle || {}),
      color: theme?.semanticColors?.text?.primary || '#1E293B',
      marginBottom: theme?.spacing?.md || 16,
      textAlign: 'center',
      lineHeight: 40,
      fontSize: 32,
      fontWeight: '700',
    },
    subtitle: {
      ...(theme?.textStyles?.onboardingDescription || {}),
      color: theme?.semanticColors?.text?.secondary || '#475569',
      textAlign: 'center',
      lineHeight: 24,
      maxWidth: 300,
    },
    inputContainer: {
      marginBottom: theme?.spacing?.['4xl'] || 48,
      alignItems: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: theme?.spacing?.md || 16,
      paddingHorizontal: theme?.spacing?.['2xl'] || 24,
      paddingBottom: theme?.spacing?.['4xl'] || 48,
      paddingTop: theme?.spacing?.xl || 32,
      backgroundColor: theme?.semanticColors?.background?.primary || '#FFFFFF',
      borderTopLeftRadius: theme?.borderRadius?.xl || 16,
      borderTopRightRadius: theme?.borderRadius?.xl || 16,
      ...(theme?.shadows?.lg || {}),
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: theme?.borderRadius?.full || 9999,
      backgroundColor: theme?.semanticColors?.background?.primarySurface || '#EDE9FE',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme?.spacing?.['2xl'] || 24,
      ...(theme?.coloredShadows?.primary || {}),
    },
    iconText: {
      fontSize: 32,
      fontWeight: '700',
      color: theme?.semanticColors?.text?.onPrimary || '#FFFFFF',
    },
    dateButton: {
      width: '100%',
      maxWidth: 350,
      backgroundColor: theme?.semanticColors?.background?.surface || '#F8FAFC',
      borderRadius: theme?.borderRadius?.lg || 12,
      borderWidth: 2,
      borderColor: theme?.semanticColors?.border?.secondary || '#E2E8F0',
      ...(theme?.shadows?.md || {}),
    },
    ageText: {
      ...(theme?.textStyles?.onboardingDescription || {}),
      color: theme?.semanticColors?.text?.secondary || '#475569',
      textAlign: 'center',
      marginTop: theme?.spacing?.md || 16,
    },
    ageNumber: {
      ...(theme?.textStyles?.heading3 || {}),
      color: theme?.colors?.primary || '#7C3AED',
      fontWeight: '600',
    },
  });

  const currentStep = getCurrentStep('date-of-birth');
  const age = calculateAge(dateOfBirth);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>📅</Text>
          </View>
          <Text style={styles.title}>Doğum Tarihiniz</Text>
          <Text style={styles.subtitle}>
            Doğum tarihiniz, yaşınızı hesaplamak için gereklidir.
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Input
              label=""
              value={dateOfBirth.toLocaleDateString('tr-TR')}
              placeholder="Doğum tarihinizi seçin"
              editable={false}
              style={{
                borderWidth: 0,
                backgroundColor: 'transparent',
                fontSize: 18,
                fontWeight: '500',
                paddingVertical: theme?.spacing?.lg || 24,
              }}
            />
          </TouchableOpacity>

          <Text style={styles.ageText}>
            Yaşınız: <Text style={styles.ageNumber}>{age}</Text>
          </Text>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dateOfBirth}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={handleDateChange}
          />
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Geri"
          onPress={handlePrevious}
          variant="secondary"
        />
        <Button
          title="Devam Et"
          onPress={handleNext}
          style={theme?.coloredShadows?.primary || {}}
        />
      </View>
    </SafeAreaView>
  );
};

export default DateOfBirthScreen;