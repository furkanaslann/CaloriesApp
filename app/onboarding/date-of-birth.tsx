/**
 * CaloriTrack - Onboarding Date of Birth Screen
 * Minimal. Cool. Aesthetic.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../src/theme/index';
import { useOnboarding } from '../../contexts/onboarding-context';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';

const DateOfBirthScreen = () => {
  const themeResult = useTheme();
  const theme = themeResult || {
    semanticColors: {
      background: { primary: '#FFFFFF', surface: '#F8FAFC' },
      text: { primary: '#1E293B', secondary: '#475569', tertiary: '#64748B' },
      border: { primary: '#E2E8F0', secondary: '#E2E8F0' },
    },
    colors: { primary: '#7C3AED' },
    textStyles: {
      heading2: { fontSize: 28, fontWeight: '600' },
      heading3: { fontSize: 24, fontWeight: '600' },
      body: { fontSize: 16, fontWeight: '400' },
      buttonMedium: { fontSize: 16, fontWeight: '500' },
    },
    typography: { lineHeight: { relaxed: 24 }, fontWeight: { semibold: '600' } },
    spacing: { lg: 24, md: 16, xl: 32, '3xl': 40, sm: 8 },
    borderRadius: { lg: 12 },
    shadows: { sm: {}, md: {} },
  };
  const { profile, updateProfile, nextStep, previousStep } = useOnboarding();

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
      backgroundColor: theme.semanticColors.background.primary,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
      justifyContent: 'center',
    },
    header: {
      marginBottom: theme.spacing['3xl'],
    },
    title: {
      ...theme.textStyles.heading2,
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    subtitle: {
      ...theme.textStyles.body,
      color: theme.semanticColors.text.secondary,
      textAlign: 'center',
      lineHeight: theme.typography.lineHeight.relaxed,
    },
    inputContainer: {
      marginBottom: theme.spacing['3xl'],
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
    progressIndicator: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: theme.spacing.xl,
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
    dateButton: {
      ...theme.shadows.sm,
    },
    dateButtonText: {
      ...theme.textStyles.buttonMedium,
      color: theme.semanticColors.text.primary,
    },
    ageText: {
      ...theme.textStyles.body,
      color: theme.semanticColors.text.secondary,
      textAlign: 'center',
      marginTop: theme.spacing.md,
    },
    ageNumber: {
      ...theme.textStyles.heading3,
      color: theme.colors.primary,
      fontWeight: theme.typography.fontWeight.semibold,
    },
  });

  const totalSteps = 9;
  const currentStep = 3;
  const age = calculateAge(dateOfBirth);

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
              label="Doğum Tarihi"
              value={dateOfBirth.toLocaleDateString('tr-TR')}
              placeholder="Doğum tarihinizi seçin"
              editable={false}
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
        />
      </View>
    </SafeAreaView>
  );
};

export default DateOfBirthScreen;