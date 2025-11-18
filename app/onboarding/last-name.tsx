/**
 * CaloriTrack - Onboarding Last Name Screen
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
import { useTheme } from '../../src/theme/index';
import { useOnboarding } from '../../contexts/onboarding-context';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';

const LastNameScreen = () => {
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
      body: { fontSize: 16, fontWeight: '400' },
    },
    typography: { lineHeight: { relaxed: 24 } },
    spacing: { lg: 24, md: 16, xl: 32, '3xl': 40 },
    borderRadius: { lg: 12 },
    shadows: { md: {} },
  };
  const { profile, updateProfile, nextStep, previousStep } = useOnboarding();

  const [lastName, setLastName] = useState(profile.lastName || '');

  const validateLastName = (): boolean => {
    if (!lastName.trim()) {
      Alert.alert('Hata', 'Lütfen soyadınızı girin.');
      return false;
    }

    if (lastName.trim().length < 2) {
      Alert.alert('Hata', 'Soyadınız en az 2 karakter olmalıdır.');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateLastName()) return;

    updateProfile({ lastName: lastName.trim() });
    nextStep();
    router.push('/onboarding/date-of-birth');
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
  });

  const totalSteps = 9;
  const currentStep = 2;

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
          <Text style={styles.title}>Soyadınız</Text>
          <Text style={styles.subtitle}>
            Şimdi soyadınızı öğrenelim.
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Input
            label="Soyadınız"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Soyadınızı girin"
            autoCapitalize="words"
            autoFocus
          />
        </View>
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

export default LastNameScreen;