/**
 * CaloriTrack - Onboarding Date of Birth Screen
 * Minimal. Cool. Aesthetic.
 */

import { LightTheme } from "@/constants";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/ui/button";
import Input from "../../components/ui/input";
import ProgressBar from "../../components/ui/progress-bar";
import { useOnboarding } from "../../context/onboarding-context";

const DateOfBirthScreen = () => {
  const {
    profile,
    updateProfile,
    nextStep,
    previousStep,
    totalSteps,
    getCurrentStep,
  } = useOnboarding();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(
    profile.dateOfBirth ? new Date(profile.dateOfBirth) : new Date(),
  );
  const [isFocused, setIsFocused] = useState(false);

  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const validateDate = (): boolean => {
    const age = calculateAge(dateOfBirth);

    if (age < 14) {
      Alert.alert("Hata", "Yaşınız en az 14 olmalıdır.");
      return false;
    }

    if (age > 100) {
      Alert.alert("Hata", "Lütfen geçerli bir doğum tarihi girin.");
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
      dateOfBirth: dateOfBirth.toISOString().split("T")[0],
      age: age,
    });
    nextStep();
    router.push("/onboarding/gender");
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
      paddingHorizontal: LightTheme.spacing["2xl"],
      paddingTop: LightTheme.spacing.lg,
      paddingBottom: LightTheme.spacing["4xl"],
    },
    header: {
      marginTop: "10%",
      marginBottom: LightTheme.spacing["4xl"],
      alignItems: "center",
    },
    title: {
      fontSize: LightTheme.typography["3xl"].fontSize,
      fontWeight: "700",
      color: LightTheme.semanticColors.text.primary,
      marginBottom: LightTheme.spacing.md,
      textAlign: "center",
      lineHeight: LightTheme.typography["3xl"].lineHeight,
    },
    subtitle: {
      fontSize: LightTheme.typography.base.fontSize,
      fontWeight: "400",
      color: LightTheme.semanticColors.text.secondary,
      textAlign: "center",
      lineHeight: LightTheme.typography.base.lineHeight,
      maxWidth: 300,
    },
    inputContainer: {
      marginBottom: LightTheme.spacing["4xl"],
      alignItems: "center",
    },
    buttonContainer: {
      flexDirection: "row",
      gap: LightTheme.spacing.md,
      paddingHorizontal: LightTheme.spacing["2xl"],
      paddingBottom: LightTheme.spacing["4xl"],
      paddingTop: LightTheme.spacing.xl,
      backgroundColor: LightTheme.semanticColors.background.primary,
      borderTopLeftRadius: LightTheme.borderRadius.xl,
      borderTopRightRadius: LightTheme.borderRadius.xl,
      ...LightTheme.shadows.lg,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: LightTheme.borderRadius.full,
      backgroundColor: LightTheme.colors.primaryLight + "25",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: LightTheme.spacing["2xl"],
      ...LightTheme.shadows.lg,
    },
    iconText: {
      fontSize: 32,
      fontWeight: "700",
      color: LightTheme.semanticColors.text.onPrimary,
    },
    dateButton: {
      width: "100%",
      maxWidth: 350,
      backgroundColor: LightTheme.semanticColors.background.secondary,
      borderRadius: LightTheme.borderRadius.lg,
      borderWidth: 2,
      borderColor: isFocused
        ? LightTheme.colors.primary
        : LightTheme.semanticColors.border.primary,
      ...LightTheme.shadows.md,
    },
    ageText: {
      fontSize: LightTheme.typography.base.fontSize,
      fontWeight: "400",
      color: LightTheme.semanticColors.text.secondary,
      textAlign: "center",
      marginTop: LightTheme.spacing.md,
    },
    ageNumber: {
      fontSize: LightTheme.typography.xl.fontSize,
      color: LightTheme.colors.primary,
      fontWeight: "600",
    },
  });

  const currentStep = getCurrentStep("date-of-birth");
  const age = calculateAge(dateOfBirth);

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <ProgressBar
            currentStep={currentStep}
            totalSteps={totalSteps}
            onBack={handlePrevious}
          />

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
                value={dateOfBirth.toLocaleDateString("tr-TR")}
                placeholder="Doğum tarihinizi seçin"
                editable={false}
                autoFocus
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                style={{
                  borderWidth: 0,
                  backgroundColor: "transparent",
                  fontSize: 18,
                  fontWeight: "500",
                  paddingVertical: LightTheme.spacing.lg,
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
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Devam Et"
          onPress={handleNext}
          fullWidth
          style={LightTheme.shadows.lg}
        />
      </View>
    </SafeAreaView>
  );
};

export default DateOfBirthScreen;
