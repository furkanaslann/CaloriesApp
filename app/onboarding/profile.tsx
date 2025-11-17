/**
 * CaloriTrack - Onboarding Profile Setup Screen
 * Minimal. Cool. Aesthetic.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useThemeContext } from '../../contexts/theme-context';
import { useOnboarding } from '../../contexts/onboarding-context';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';

const ProfileScreen = () => {
  const { theme } = useThemeContext();
  const { profile, updateProfile, nextStep, previousStep } = useOnboarding();

  const [formData, setFormData] = useState({
    name: profile.name || '',
    lastName: profile.lastName || '',
    age: profile.age?.toString() || '',
    height: profile.height?.toString() || '',
    currentWeight: profile.currentWeight?.toString() || '',
    gender: profile.gender || 'male' as 'male' | 'female' | 'other',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(
    profile.dateOfBirth ? new Date(profile.dateOfBirth) : new Date()
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
      const age = calculateAge(selectedDate);
      setFormData(prev => ({
        ...prev,
        age: age.toString(),
      }));
    }
  };

  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push('Ad alanı zorunludur');
    }

    if (!formData.lastName.trim()) {
      errors.push('Soyad alanı zorunludur');
    }

    const age = parseInt(formData.age);
    if (!age || age < 14 || age > 100) {
      errors.push('Yaş 14-100 aralığında olmalıdır');
    }

    const height = parseFloat(formData.height);
    if (!height || height < 100 || height > 250) {
      errors.push('Boy 100-250 cm aralığında olmalıdır');
    }

    const weight = parseFloat(formData.currentWeight);
    if (!weight || weight < 30 || weight > 300) {
      errors.push('Kilo 30-300 kg aralığında olmalıdır');
    }

    if (errors.length > 0) {
      Alert.alert('Doğrulama Hatası', errors.join('\n'));
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateForm()) return;

    const updatedProfile = {
      name: formData.name.trim(),
      lastName: formData.lastName.trim(),
      age: parseInt(formData.age),
      height: parseFloat(formData.height),
      currentWeight: parseFloat(formData.currentWeight),
      gender: formData.gender,
      dateOfBirth: dateOfBirth.toISOString().split('T')[0],
    };

    updateProfile(updatedProfile);
    nextStep();
    router.push('/onboarding/goals');
  };

  const handlePrevious = () => {
    previousStep();
    router.back();
  };

  const genderOptions = [
    { value: 'male', label: 'Erkek', icon: '👨' },
    { value: 'female', label: 'Kadın', icon: '👩' },
    { value: 'other', label: 'Diğer', icon: '👤' },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.semanticColors.background.primary,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: theme.spacing.lg,
    },
    header: {
      marginBottom: theme.spacing['3xl'],
    },
    title: {
      ...theme.textStyles.heading2,
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.md,
    },
    subtitle: {
      ...theme.textStyles.body,
      color: theme.semanticColors.text.secondary,
      lineHeight: theme.typography.lineHeight.relaxed,
    },
    section: {
      marginBottom: theme.spacing['3xl'],
    },
    sectionTitle: {
      ...theme.textStyles.heading4,
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.lg,
    },
    genderContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    genderOption: {
      flex: 1,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.semanticColors.border.primary,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      backgroundColor: theme.semanticColors.background.primary,
    },
    genderOptionSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: `${theme.colors.primary}10`,
    },
    genderIcon: {
      fontSize: 32,
      marginBottom: theme.spacing.sm,
    },
    genderLabel: {
      ...theme.textStyles.labelMedium,
      color: theme.semanticColors.text.primary,
    },
    genderLabelSelected: {
      color: theme.colors.primary,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
    dateButton: {
      ...theme.shadows.sm,
    },
    dateButtonText: {
      ...theme.textStyles.buttonMedium,
      color: theme.semanticColors.text.primary,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Profilinizi Oluşturun</Text>
            <Text style={styles.subtitle}>
              Kişisel bilgilerinizi girerek hesabınızı oluşturun. Bu bilgiler, size özel kalori hedefleri belirlememize yardımcı olacaktır.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>

            <Input
              label="Adınız"
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              placeholder="Adınızı girin"
              autoCapitalize="words"
            />

            <Input
              label="Soyadınız"
              value={formData.lastName}
              onChangeText={(text) => handleInputChange('lastName', text)}
              placeholder="Soyadınızı girin"
              autoCapitalize="words"
            />

            <TouchableOpacity
              style={[theme.shadows.sm, styles.dateButton]}
              onPress={() => setShowDatePicker(true)}
            >
              <Input
                label="Doğum Tarihi"
                value={dateOfBirth.toLocaleDateString('tr-TR')}
                placeholder="Doğum tarihinizi seçin"
                editable={false}
              />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth}
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={handleDateChange}
              />
            )}

            <Input
              label="Yaş"
              value={formData.age}
              onChangeText={(text) => handleInputChange('age', text)}
              placeholder="Yaşınız"
              keyboardType="numeric"
              editable={false}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fiziksel Bilgiler</Text>

            <Text style={styles.sectionTitle}>Cinsiyet</Text>
            <View style={styles.genderContainer}>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.genderOption,
                    formData.gender === option.value && styles.genderOptionSelected,
                  ]}
                  onPress={() => handleInputChange('gender', option.value)}
                >
                  <Text style={styles.genderIcon}>{option.icon}</Text>
                  <Text
                    style={[
                      styles.genderLabel,
                      formData.gender === option.value && styles.genderLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input
              label="Boy (cm)"
              value={formData.height}
              onChangeText={(text) => handleInputChange('height', text)}
              placeholder="Boyunuzu cm olarak girin"
              keyboardType="numeric"
            />

            <Input
              label="Kilo (kg)"
              value={formData.currentWeight}
              onChangeText={(text) => handleInputChange('currentWeight', text)}
              placeholder="Kilonuzu kg olarak girin"
              keyboardType="numeric"
            />
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