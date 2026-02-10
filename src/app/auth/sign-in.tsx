/**
 * CaloriTrack - Sign In Screen
 * Google/Apple Sign-In + Email OTP
 * Minimal. Cool. Aesthetic.
 */

import { LightTheme } from "@/constants";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Alert,
    Keyboard,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/ui/button";
import { useUser } from "../../context/user-context";

type Step = "main" | "otp";

const SignInScreen = () => {
  const { createAnonymousUser } = useUser();
  const [step, setStep] = useState<Step>("main");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

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

  // Google Sign-In handler
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { signInWithGoogle } = await import("@/utils/firebase");
      const user = await signInWithGoogle();
      console.log("✅ Google sign-in successful:", user.uid);
      // Navigation will be handled by _layout.tsx auth state listener
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      Alert.alert("Hata", error.message || "Google ile giriş başarısız oldu.");
    } finally {
      setIsLoading(false);
    }
  };

  // Apple Sign-In handler
  const handleAppleSignIn = async () => {
    setIsLoading(true);
    try {
      const { signInWithApple } = await import("@/utils/firebase");
      const user = await signInWithApple();
      console.log("✅ Apple sign-in successful:", user.uid);
      // Navigation will be handled by _layout.tsx auth state listener
    } catch (error: any) {
      console.error("Apple sign-in error:", error);
      Alert.alert("Hata", error.message || "Apple ile giriş başarısız oldu.");
    } finally {
      setIsLoading(false);
    }
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

    setIsLoading(true);
    try {
      const { sendOTPCode } = await import("@/utils/firebase");
      await sendOTPCode(email.toLowerCase().trim());

      setStep("otp");
      setCountdown(60);
      setOtpCode(["", "", "", "", "", ""]);

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

  // Resend OTP
  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    try {
      const { sendOTPCode } = await import("@/utils/firebase");
      await sendOTPCode(email.toLowerCase().trim());
      setCountdown(60);
      setOtpCode(["", "", "", "", "", ""]);
      Alert.alert("Başarılı", "Yeni doğrulama kodu gönderildi.");
    } catch (error: any) {
      Alert.alert("Hata", error.message || "Doğrulama kodu gönderilemedi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input change
  const handleOTPChange = useCallback(
    (index: number, value: string) => {
      if (value.length > 1) {
        const digits = value.replace(/\D/g, "").split("").slice(0, 6);
        const newCode = [...otpCode];
        digits.forEach((digit, i) => {
          if (index + i < 6) {
            newCode[index + i] = digit;
          }
        });
        setOtpCode(newCode);
        const nextIndex = Math.min(index + digits.length, 5);
        otpRefs.current[nextIndex]?.focus();
        return;
      }

      const newCode = [...otpCode];
      newCode[index] = value.replace(/\D/g, "");
      setOtpCode(newCode);

      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    },
    [otpCode],
  );

  // Handle backspace
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

  // Verify OTP
  const handleVerifyOTP = async () => {
    const code = otpCode.join("");
    if (code.length !== 6) {
      Alert.alert("Hata", "Lütfen 6 haneli doğrulama kodunu eksiksiz giriniz.");
      return;
    }

    setIsLoading(true);
    Keyboard.dismiss();

    try {
      const { verifyOTPCode } = await import("@/utils/firebase");
      const user = await verifyOTPCode(email.toLowerCase().trim(), code);
      console.log("✅ OTP verification successful:", user.uid);
      // Navigation will be handled by _layout.tsx auth state listener
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

  // Navigate to onboarding for new users - create anonymous user first
  const handleStartOnboarding = async () => {
    try {
      setIsLoading(true);
      await createAnonymousUser();
      router.replace("/onboarding/welcome");
    } catch (error: any) {
      console.error("Error starting onboarding:", error);
      Alert.alert("Hata", "Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
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
    content: {
      paddingHorizontal: LightTheme.spacing["2xl"],
      paddingVertical: LightTheme.spacing.lg,
      flex: 1,
    },
    header: {
      alignItems: "center",
      marginBottom: LightTheme.spacing["3xl"],
      marginTop: LightTheme.spacing["4xl"],
    },
    logoContainer: {
      width: 100,
      height: 100,
      borderRadius: LightTheme.borderRadius.full,
      backgroundColor: `${LightTheme.colors.primary}15`,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: LightTheme.spacing.xl,
      ...LightTheme.shadows.lg,
    },
    logo: {
      fontSize: 48,
    },
    title: {
      fontSize: LightTheme.typography["3xl"].fontSize,
      fontWeight: "700",
      color: LightTheme.semanticColors.text.primary,
      textAlign: "center",
      marginBottom: LightTheme.spacing.sm,
      lineHeight: 36,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: "400",
      color: LightTheme.semanticColors.text.secondary,
      textAlign: "center",
      lineHeight: 24,
    },
    // Social buttons
    socialSection: {
      gap: LightTheme.spacing.md,
      marginBottom: LightTheme.spacing.xl,
    },
    socialButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: LightTheme.semanticColors.background.secondary,
      borderWidth: 1,
      borderColor: LightTheme.semanticColors.border.primary,
      borderRadius: LightTheme.borderRadius.lg,
      paddingVertical: LightTheme.spacing.md,
      paddingHorizontal: LightTheme.spacing.lg,
      gap: LightTheme.spacing.md,
      ...LightTheme.shadows.sm,
    },
    socialButtonGoogle: {
      backgroundColor: "#FFFFFF",
    },
    socialButtonApple: {
      backgroundColor: "#000000",
    },
    socialButtonIcon: {
      fontSize: 22,
    },
    socialButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: LightTheme.semanticColors.text.primary,
    },
    socialButtonTextApple: {
      color: "#FFFFFF",
    },
    // Divider
    dividerContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: LightTheme.spacing.lg,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: LightTheme.semanticColors.border.primary,
    },
    dividerText: {
      paddingHorizontal: LightTheme.spacing.lg,
      fontSize: 14,
      fontWeight: "500",
      color: LightTheme.semanticColors.text.tertiary,
    },
    // Email section
    emailSection: {
      gap: LightTheme.spacing.md,
    },
    inputGroup: {
      gap: LightTheme.spacing.sm,
    },
    label: {
      fontSize: 16,
      fontWeight: "500",
      color: LightTheme.semanticColors.text.primary,
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
    // OTP styles
    otpHeader: {
      alignItems: "center",
      marginBottom: LightTheme.spacing.xl,
      marginTop: LightTheme.spacing["3xl"],
    },
    otpIconContainer: {
      width: 80,
      height: 80,
      borderRadius: LightTheme.borderRadius.full,
      backgroundColor: `${LightTheme.colors.primary}15`,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: LightTheme.spacing.xl,
      ...LightTheme.shadows.md,
    },
    otpIcon: {
      fontSize: 40,
    },
    otpTitle: {
      fontSize: LightTheme.typography["3xl"].fontSize,
      fontWeight: "600",
      color: LightTheme.semanticColors.text.primary,
      textAlign: "center",
      marginBottom: LightTheme.spacing.md,
    },
    otpSubtitle: {
      fontSize: 16,
      color: LightTheme.semanticColors.text.secondary,
      textAlign: "center",
      lineHeight: 24,
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
    // Footer
    footer: {
      paddingHorizontal: LightTheme.spacing["2xl"],
      paddingBottom: LightTheme.spacing["4xl"],
      paddingTop: LightTheme.spacing.xl,
    },
    footerLink: {
      alignItems: "center",
      paddingVertical: LightTheme.spacing.md,
    },
    footerLinkText: {
      fontSize: 15,
      color: LightTheme.semanticColors.text.secondary,
    },
    footerLinkHighlight: {
      color: LightTheme.colors.primary,
      fontWeight: "600",
    },
  });

  // Render Main Sign-In Step
  const renderMainStep = () => (
    <>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🔥</Text>
        </View>
        <Text style={styles.title}>CaloriTrack</Text>
        <Text style={styles.subtitle}>
          Hesabınıza giriş yapın veya yeni hesap oluşturun
        </Text>
      </View>

      {/* Social Sign-In Buttons */}
      <View style={styles.socialSection}>
        <TouchableOpacity
          style={[styles.socialButton, styles.socialButtonGoogle]}
          onPress={handleGoogleSignIn}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <Text style={styles.socialButtonIcon}>G</Text>
          <Text style={styles.socialButtonText}>Google ile Giriş Yap</Text>
        </TouchableOpacity>

        {Platform.OS === "ios" && (
          <TouchableOpacity
            style={[styles.socialButton, styles.socialButtonApple]}
            onPress={handleAppleSignIn}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.socialButtonIcon, { color: "#FFFFFF" }]}
            ></Text>
            <Text
              style={[styles.socialButtonText, styles.socialButtonTextApple]}
            >
              Apple ile Giriş Yap
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>veya</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Email OTP Section */}
      <View style={styles.emailSection}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-posta Adresi</Text>
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

        <Button
          title={isLoading ? "Gönderiliyor..." : "Doğrulama Kodu Gönder"}
          onPress={handleSendOTP}
          disabled={isLoading}
          fullWidth
          style={LightTheme.shadows.lg}
        />
      </View>
    </>
  );

  // Render OTP Step
  const renderOTPStep = () => (
    <>
      <View style={styles.otpHeader}>
        <View style={styles.otpIconContainer}>
          <Text style={styles.otpIcon}>🔐</Text>
        </View>
        <Text style={styles.otpTitle}>Doğrulama Kodu</Text>
        <Text style={styles.otpSubtitle}>
          E-postanıza gönderilen 6 haneli kodu giriniz.
        </Text>
      </View>

      <View style={styles.emailDisplay}>
        <Text style={styles.emailDisplayText}>{email}</Text>
        <TouchableOpacity
          style={styles.changeEmailButton}
          onPress={() => {
            setStep("main");
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

      <View style={{ marginTop: LightTheme.spacing["2xl"] }}>
        <Button
          title={isLoading ? "Doğrulanıyor..." : "Giriş Yap"}
          onPress={handleVerifyOTP}
          disabled={isLoading || otpCode.join("").length !== 6}
          fullWidth
          style={LightTheme.shadows.lg}
        />
      </View>
    </>
  );

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right", "bottom"]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.content}>
          {step === "main" ? renderMainStep() : renderOTPStep()}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerLink}
          onPress={handleStartOnboarding}
        >
          <Text style={styles.footerLinkText}>
            Hesabınız yok mu?{" "}
            <Text style={styles.footerLinkHighlight}>Başlayalım</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignInScreen;
