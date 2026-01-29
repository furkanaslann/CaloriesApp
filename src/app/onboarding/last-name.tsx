/**
 * CaloriTrack - Onboarding Last Name Screen
 * Minimal. Cool. Aesthetic.
 */

import { LightTheme } from "@/constants";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/ui/button";
import Input from "../../components/ui/input";
import ProgressBar from "../../components/ui/progress-bar";
import { useOnboarding } from "../../context/onboarding-context";

const LastNameScreen = () => {
  const {
    profile,
    updateProfile,
    nextStep,
    previousStep,
    totalSteps,
    getCurrentStep,
  } = useOnboarding();

  const [lastName, setLastName] = useState(profile.lastName || "");
  const [isFocused, setIsFocused] = useState(false);

  const validateLastName = (): boolean => {
    if (!lastName.trim()) {
      Alert.alert("Hata", "Lütfen soyadınızı girin.");
      return false;
    }

    if (lastName.trim().length < 2) {
      Alert.alert("Hata", "Soyadınız en az 2 karakter olmalıdır.");
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateLastName()) return;

    updateProfile({ lastName: lastName.trim() });
    nextStep();
    router.push("/onboarding/date-of-birth");
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
    inputWrapper: {
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
  });

  const currentStep = getCurrentStep("last-name");

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
              <Text style={styles.iconText}>👤</Text>
            </View>
            <Text style={styles.title}>Soyadınız</Text>
            <Text style={styles.subtitle}>Şimdi soyadınızı öğrenelim.</Text>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Input
                label=""
                value={lastName}
                onChangeText={setLastName}
                placeholder="Soyadınızı girin"
                autoCapitalize="words"
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
            </View>
          </View>
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

export default LastNameScreen;
