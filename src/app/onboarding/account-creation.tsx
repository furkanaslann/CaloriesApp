/**
 * CaloriTrack - Onboarding Account Creation Screen
 * Email OTP Verification Flow
 * Minimal. Cool. Aesthetic.
 */

import { LightTheme } from "@/constants";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Alert,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/ui/button";
import { useOnboarding } from "../../context/onboarding-context";
import { useUser } from "../../context/user-context";

type Step = "email" | "otp";

const AccountCreationScreen = () => {
  const { profile, goals, updateAccount, commitment } = useOnboarding();
  const { user: currentUser, refreshUserData } = useUser();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState(commitment.email || "");
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false);

  // OTP input refs
  const otpRefs = useRef<(TextInput | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Email validation
  const isValidEmail = (emailStr: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  };

  // Send OTP code
  const handleSendOTP = async () => {
    if (!email.trim()) {
      Alert.alert("Hata", "Lütfen e-posta adresinizi giriniz.");
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert("Hata", "Lütfen geçerli bir e-posta adresi giriniz.");
      return;
    }
    if (!agreeToTerms) {
      Alert.alert("Hata", "Lütfen kullanım koşullarını kabul edin.");
      return;
    }
    if (!agreeToPrivacy) {
      Alert.alert("Hata", "Lütfen gizlilik politikasını kabul edin.");
      return;
    }

    setIsLoading(true);
    try {
      const { sendOTPCode } = await import("@/utils/firebase");
      await sendOTPCode(email.toLowerCase().trim(), currentUser?.uid);

      setStep("otp");
      setCountdown(60);
      setOtpCode(["", "", "", "", "", ""]);

      // Focus first OTP input after transition
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 300);
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      Alert.alert("Hata", error.message || "Doğrulama kodu gönderilemedi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP code
  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    try {
      const { sendOTPCode } = await import("@/utils/firebase");
      await sendOTPCode(email.toLowerCase().trim(), currentUser?.uid);
      setCountdown(60);
      setOtpCode(["", "", "", "", "", ""]);
      Alert.alert("Başarılı", "Yeni doğrulama kodu gönderildi.");
    } catch (error: any) {
      console.error("Error resending OTP:", error);
      Alert.alert("Hata", error.message || "Doğrulama kodu gönderilemedi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input change
  const handleOTPChange = useCallback(
    (index: number, value: string) => {
      if (value.length > 1) {
        // Handle paste: distribute digits across inputs
        const digits = value.replace(/\D/g, "").split("").slice(0, 6);
        const newCode = [...otpCode];
        digits.forEach((digit, i) => {
          if (index + i < 6) {
            newCode[index + i] = digit;
          }
        });
        setOtpCode(newCode);

        // Focus the next empty field or the last field
        const nextIndex = Math.min(index + digits.length, 5);
        otpRefs.current[nextIndex]?.focus();
        return;
      }

      const newCode = [...otpCode];
      newCode[index] = value.replace(/\D/g, "");
      setOtpCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    },
    [otpCode],
  );

  // Handle backspace on OTP inputs
  const handleOTPKeyPress = useCallback(
    (index: number, key: string) => {
      if (key === "Backspace" && !otpCode[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
        const newCode = [...otpCode];
        newCode[index - 1] = "";
        setOtpCode(newCode);
      }
    },
    [otpCode],
  );

  // Verify OTP and complete account creation
  const handleVerifyOTP = async () => {
    const code = otpCode.join("");
    if (code.length !== 6) {
      Alert.alert("Hata", "Lütfen 6 haneli doğrulama kodunu eksiksiz giriniz.");
      return;
    }

    setIsLoading(true);
    Keyboard.dismiss();

    try {
      console.log("Starting OTP verification with email:", email);

      const { verifyOTPCode, saveOnboardingData } =
        await import("@/utils/firebase");

      // Verify OTP and get authenticated user
      const verifiedUser = await verifyOTPCode(
        email.toLowerCase().trim(),
        code,
        currentUser?.uid,
      );

      console.log("✅ OTP verified, user:", verifiedUser.uid);

      // Update account data in onboarding context
      updateAccount({
        email: email.toLowerCase().trim(),
        createdAt: new Date().toISOString(),
        preferences: {
          agreeToTerms,
          agreeToPrivacy,
          subscribeToNewsletter: false,
        },
      });

      // Save complete onboarding data to Firestore
      try {
        const completeUserData = {
          uid: verifiedUser.uid,
          email: verifiedUser.email || email.toLowerCase().trim(),
          isAnonymous: false,
          emailVerified: true,
          onboardingCompleted: true,
          onboardingCompletedAt: new Date().toISOString(),
          profile: {
            name: profile.name,
            lastName: profile.lastName,
            age: profile.age,
            dateOfBirth: profile.dateOfBirth,
            gender: profile.gender,
            height: profile.height,
            currentWeight: profile.currentWeight,
            profilePhoto: profile.profilePhoto,
          },
          goals: {
            primaryGoal: goals.primaryGoal,
            targetWeight: goals.targetWeight,
            timeline: goals.timeline,
            weeklyGoal: goals.weeklyGoal,
            motivation: goals.motivation,
          },
          commitment: {
            firstName: profile.name,
            lastName: profile.lastName,
            email: email.toLowerCase().trim(),
            commitmentStatement: "Ok",
            timestamp: new Date().toISOString(),
          },
          preferences: {
            agreeToTerms,
            agreeToPrivacy,
            notifications: {
              mealReminders: true,
              waterReminders: true,
              exerciseReminders: false,
              dailySummary: true,
              achievements: true,
            },
            privacy: {
              dataSharing: true,
              analytics: true,
              marketing: false,
            },
          },
          progress: {
            currentWeight: profile.currentWeight,
            startingWeight: profile.currentWeight,
            goalWeight: goals.targetWeight,
            weightLossTotal: 0,
            weightLossToGoal: 0,
            weeklyWeightChange: 0,
            averageWeeklyLoss: 0,
            timeOnApp: 0,
            lastWeightUpdate: new Date().toISOString().split("T")[0],
          },
        };

        await saveOnboardingData(verifiedUser.uid, completeUserData);
        console.log("✅ Onboarding data saved successfully");
      } catch (saveError) {
        console.error("Error saving onboarding data:", saveError);
      }

      // Wait for data sync
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Refresh user context
      try {
        await refreshUserData();
      } catch (refreshError) {
        console.warn("⚠️ Could not refresh user context:", refreshError);
      }

      await new Promise((resolve) => setTimeout(resolve, 300));

      // Navigate to paywall
      console.log("✅ Navigating to paywall");
      router.replace("/paywall");
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      Alert.alert(
        "Hata",
        error.message || "Doğrulama başarısız oldu. Lütfen tekrar deneyin.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-submit when all OTP digits are entered
  useEffect(() => {
    const code = otpCode.join("");
    if (code.length === 6 && step === "otp" && !isLoading) {
      handleVerifyOTP();
    }
  }, [otpCode, step]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: LightTheme.semanticColors.background.primary,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      paddingHorizontal: LightTheme.spacing["2xl"],
      paddingVertical: LightTheme.spacing.lg,
    },
    header: {
      alignItems: "center",
      marginBottom: LightTheme.spacing["4xl"],
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: LightTheme.borderRadius.full,
      backgroundColor: `${LightTheme.colors.primary}15`,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: LightTheme.spacing.xl,
      ...LightTheme.shadows.md,
    },
    icon: {
      fontSize: 40,
    },
    title: {
      fontSize: LightTheme.typography["3xl"].fontSize,
      fontWeight: "600",
      color: LightTheme.semanticColors.text.primary,
      textAlign: "center",
      marginBottom: LightTheme.spacing.lg,
      lineHeight: 36,
    },
    subtitle: {
      fontSize: LightTheme.typography.xl.fontSize,
      fontWeight: "500",
      color: LightTheme.semanticColors.text.secondary,
      textAlign: "center",
      marginBottom: LightTheme.spacing.lg,
      lineHeight: 28,
    },
    description: {
      fontSize: 16,
      fontWeight: "400",
      color: LightTheme.semanticColors.text.secondary,
      textAlign: "center",
      paddingHorizontal: LightTheme.spacing.lg,
      lineHeight: 24,
      marginBottom: LightTheme.spacing["2xl"],
    },
    form: {
      gap: LightTheme.spacing.lg,
    },
    inputGroup: {
      gap: LightTheme.spacing.sm,
    },
    label: {
      fontSize: 16,
      fontWeight: "500",
      color: LightTheme.semanticColors.text.primary,
      marginBottom: LightTheme.spacing.xs,
    },
    input: {
      backgroundColor: LightTheme.semanticColors.background.secondary,
      borderWidth: 1,
      borderColor: LightTheme.semanticColors.border.primary,
      borderRadius: LightTheme.borderRadius.lg,
      paddingHorizontal: LightTheme.spacing.lg,
      paddingVertical: LightTheme.spacing.md,
      fontSize: 16,
      color: LightTheme.semanticColors.text.primary,
    },
    checkboxContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: LightTheme.spacing.sm,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 2,
      borderColor: LightTheme.semanticColors.border.primary,
      borderRadius: LightTheme.borderRadius.sm,
      marginRight: LightTheme.spacing.md,
      marginTop: 2,
      justifyContent: "center",
      alignItems: "center",
    },
    checkboxChecked: {
      backgroundColor: LightTheme.colors.primary,
      borderColor: LightTheme.colors.primary,
      shadowColor: LightTheme.colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    checkboxText: {
      flex: 1,
      fontSize: 14,
      color: LightTheme.semanticColors.text.secondary,
      lineHeight: 20,
    },
    linkText: {
      color: LightTheme.colors.primary,
      textDecorationLine: "underline",
    },
    // OTP styles
    otpContainer: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 10,
      marginVertical: LightTheme.spacing.xl,
    },
    otpInput: {
      width: 48,
      height: 56,
      borderWidth: 2,
      borderColor: LightTheme.semanticColors.border.primary,
      borderRadius: LightTheme.borderRadius.lg,
      textAlign: "center",
      fontSize: 24,
      fontWeight: "700",
      color: LightTheme.semanticColors.text.primary,
      backgroundColor: LightTheme.semanticColors.background.secondary,
    },
    otpInputFilled: {
      borderColor: LightTheme.colors.primary,
      backgroundColor: `${LightTheme.colors.primary}08`,
    },
    otpInputFocused: {
      borderColor: LightTheme.colors.primary,
      shadowColor: LightTheme.colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    resendContainer: {
      alignItems: "center",
      marginTop: LightTheme.spacing.lg,
    },
    resendText: {
      fontSize: 14,
      color: LightTheme.semanticColors.text.secondary,
    },
    resendButton: {
      fontSize: 14,
      fontWeight: "600",
      color: LightTheme.colors.primary,
    },
    resendDisabled: {
      color: LightTheme.semanticColors.text.tertiary,
    },
    countdownText: {
      fontSize: 14,
      color: LightTheme.semanticColors.text.tertiary,
      marginTop: LightTheme.spacing.xs,
    },
    emailDisplay: {
      backgroundColor: `${LightTheme.colors.primary}10`,
      borderRadius: LightTheme.borderRadius.lg,
      padding: LightTheme.spacing.md,
      alignItems: "center",
      marginBottom: LightTheme.spacing.md,
    },
    emailDisplayText: {
      fontSize: 16,
      fontWeight: "600",
      color: LightTheme.colors.primary,
    },
    changeEmailButton: {
      marginTop: LightTheme.spacing.sm,
    },
    changeEmailText: {
      fontSize: 13,
      color: LightTheme.semanticColors.text.secondary,
      textDecorationLine: "underline",
    },
    welcomeCard: {
      backgroundColor: LightTheme.semanticColors.background.secondary,
      borderRadius: LightTheme.borderRadius.lg,
      padding: LightTheme.spacing.lg,
      marginTop: LightTheme.spacing.lg,
      marginBottom: LightTheme.spacing.lg,
    },
    welcomeTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: LightTheme.semanticColors.text.primary,
      marginBottom: LightTheme.spacing.sm,
    },
    welcomeText: {
      fontSize: 14,
      color: LightTheme.semanticColors.text.secondary,
      lineHeight: 20,
    },
    userName: {
      fontWeight: "600",
      color: LightTheme.colors.primary,
    },
    footer: {
      paddingHorizontal: LightTheme.spacing["2xl"],
      paddingBottom: LightTheme.spacing["4xl"],
      paddingTop: LightTheme.spacing.xl,
      backgroundColor: LightTheme.semanticColors.background.primary,
      borderTopLeftRadius: LightTheme.borderRadius.xl,
      borderTopRightRadius: LightTheme.borderRadius.xl,
      ...LightTheme.shadows.lg,
    },
    buttonContainer: {
      gap: LightTheme.spacing.md,
    },
  });

  // Render Email Step
  const renderEmailStep = () => (
    <>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📧</Text>
        </View>
        <Text style={styles.title}>E-posta Doğrulama</Text>
        <Text style={styles.subtitle}>Hesabınızı güvence altına alın</Text>
        <Text style={styles.description}>
          E-posta adresinize bir doğrulama kodu göndereceğiz. Bu sayede
          hesabınız güvende kalacak ve tekrar giriş yapabileceksiniz.
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-posta Adresi *</Text>
          <TextInput
            style={styles.input}
            placeholder="ornek@email.com"
            placeholderTextColor={LightTheme.semanticColors.text.tertiary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
          />
        </View>

        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}
            onPress={() => setAgreeToTerms(!agreeToTerms)}
          >
            {agreeToTerms && <Text style={{ color: "#FFFFFF" }}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.checkboxText}>
            <Text style={styles.linkText}>Kullanım Koşulları</Text>'nı okudum ve
            kabul ediyorum.
          </Text>
        </View>

        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[styles.checkbox, agreeToPrivacy && styles.checkboxChecked]}
            onPress={() => setAgreeToPrivacy(!agreeToPrivacy)}
          >
            {agreeToPrivacy && <Text style={{ color: "#FFFFFF" }}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.checkboxText}>
            <Text style={styles.linkText}>Gizlilik Politikası</Text>'nı okudum
            ve kabul ediyorum.
          </Text>
        </View>

        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Hoş Geldiniz!</Text>
          <Text style={styles.welcomeText}>
            Merhaba{" "}
            <Text style={styles.userName}>{profile.name || "Kullanıcı"}</Text>!
            CaloriTrack ailesine katılmak üzeresiniz. E-posta doğrulaması
            sonrası hesabınız aktif olacak.
          </Text>
        </View>
      </View>
    </>
  );

  // Render OTP Step
  const renderOTPStep = () => (
    <>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🔐</Text>
        </View>
        <Text style={styles.title}>Doğrulama Kodu</Text>
        <Text style={styles.subtitle}>E-postanızı kontrol edin</Text>
        <Text style={styles.description}>
          6 haneli doğrulama kodunu aşağıya giriniz.
        </Text>
      </View>

      <View style={styles.emailDisplay}>
        <Text style={styles.emailDisplayText}>{email}</Text>
        <TouchableOpacity
          style={styles.changeEmailButton}
          onPress={() => {
            setStep("email");
            setOtpCode(["", "", "", "", "", ""]);
          }}
        >
          <Text style={styles.changeEmailText}>E-postayı Değiştir</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.otpContainer}>
        {otpCode.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              otpRefs.current[index] = ref;
            }}
            style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
            value={digit}
            onChangeText={(value) => handleOTPChange(index, value)}
            onKeyPress={({ nativeEvent }) =>
              handleOTPKeyPress(index, nativeEvent.key)
            }
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
          />
        ))}
      </View>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Kodu almadınız mı?</Text>
        <TouchableOpacity
          onPress={handleResendOTP}
          disabled={countdown > 0 || isLoading}
        >
          <Text
            style={[
              styles.resendButton,
              countdown > 0 && styles.resendDisabled,
            ]}
          >
            {countdown > 0 ? `Tekrar Gönder (${countdown}s)` : "Tekrar Gönder"}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {step === "email" ? renderEmailStep() : renderOTPStep()}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          {step === "email" ? (
            <Button
              title={isLoading ? "Gönderiliyor..." : "Doğrulama Kodu Gönder"}
              onPress={handleSendOTP}
              disabled={isLoading}
              fullWidth
              style={LightTheme.shadows.lg}
            />
          ) : (
            <Button
              title={isLoading ? "Doğrulanıyor..." : "Hesabı Doğrula"}
              onPress={handleVerifyOTP}
              disabled={isLoading || otpCode.join("").length !== 6}
              fullWidth
              style={LightTheme.shadows.lg}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AccountCreationScreen;
