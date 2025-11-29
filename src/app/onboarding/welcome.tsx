/**
 * CaloriTrack - Onboarding Welcome Screen
 * Minimal. Cool. Aesthetic.
 */

import { BORDER_RADIUS, COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/button';
import { useOnboarding } from '../../context/onboarding-context';

// Placeholder icons for onboarding screens
const WELCOME_ICONS = {
  camera: "📸",
  plan: "📋",
  progress: "📊",
  community: "👥",
};

const { width } = Dimensions.get('window');

const WelcomeScreen = () => {
  // Create theme object that matches expected structure
  const theme = {
    semanticColors: {
      background: { primary: COLORS.background },
      text: {
        primary: COLORS.textPrimary,
        secondary: COLORS.textSecondary,
        tertiary: COLORS.textTertiary,
        onPrimary: '#FFFFFF'
      },
      border: { primary: COLORS.border },
      onPrimary: '#FFFFFF',
    },
    colors: {
      primary: COLORS.primary,
      gradientStart: COLORS.primary,
      gradientEnd: '#EC4899',
    },
    textStyles: {
      onboardingHero: { fontSize: TYPOGRAPHY.fontSizes['4xl'] },
      onboardingTitle: { fontSize: TYPOGRAPHY.fontSizes['3xl'], fontWeight: '600' },
      onboardingSubtitle: { fontSize: TYPOGRAPHY.fontSizes['xl'], fontWeight: '500' },
      onboardingDescription: { fontSize: TYPOGRAPHY.fontSizes.base },
    },
    spacing: {
      ...SPACING,
      sm: SPACING[2],
      md: SPACING[3],
      lg: SPACING[4],
      xl: SPACING[5],
      '2xl': SPACING[6],
      '4xl': SPACING[12],
    },
    borderRadius: BORDER_RADIUS,
    shadows: SHADOWS,
    coloredShadows: { gradient: SHADOWS.lg },
  };

  const { nextStep } = useOnboarding();
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Welcome slides data based on Figma design - modern onboarding flow
  const slides = [
    {
      title: 'Hoş Geldiniz!',
      subtitle: 'CaloriTrack',
      description: 'Sağlıklı yaşam yolculuğunuza başlayın',
      icon: null,
      hasLogo: true,
    },
    {
      title: 'Akıllı Fotoğraf',
      subtitle: 'Yemeklerinizi anında analiz edin',
      description: 'Yemeklerinizi çekin, yapay zeka destekli sistemimiz kalorileri otomatik olarak hesaplasın',
      icon: WELCOME_ICONS.camera,
      hasLogo: false,
    },
    {
      title: 'Kişisel Planlar',
      subtitle: 'Size özel hedefler belirlenir',
      description: 'Yaşam tarzınıza, hedeflerinize ve tercihlerinize uygun beslenme planları oluşturun',
      icon: WELCOME_ICONS.plan,
      hasLogo: false,
    },
    {
      title: 'Detaylı Analiz',
      subtitle: 'İlerlemenizi takip edin',
      description: 'Günlük, haftalık ve aylık raporlarla beslenme alışkanlıklarınızı analiz edin',
      icon: WELCOME_ICONS.progress,
      hasLogo: false,
    },
    {
      title: 'Sosyal Destek',
      subtitle: 'Topluluğa katılın',
      description: 'Benzer hedeflere sahip kullanıcılarla deneyimlerinizi paylaşın ve birbirinize destek olun',
      icon: WELCOME_ICONS.community,
      hasLogo: false,
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      // ScrollView'i manuel olarak bir sonraki slayta kaydır
      scrollViewRef.current?.scrollTo({
        x: nextSlide * width,
        animated: true,
      });
    } else {
      nextStep();
      router.push('/onboarding/name');
    }
  };

  const handleSkip = () => {
    nextStep();
    router.push('/onboarding/name');
  };

  // Dynamic styles using updated theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.semanticColors.background.primary,
    },
    scrollView: {
      flex: 1,
    },
    slideContainer: {
      width: width,
      height: '100%',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingHorizontal: theme.spacing['2xl'],
    },
    iconContainer: {
      width: width * 0.4,
      height: width * 0.4,
      marginTop: '20%',
      marginBottom: theme.spacing['4xl'],
      borderRadius: theme.borderRadius.full,
      backgroundColor: `${theme.colors.primary}15`,
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.shadows.lg,
    },
    icon: {
      fontSize: width * 0.15,
      textAlign: 'center',
    },
    logo: {
      fontSize: 48,
      fontWeight: '800',
      color: theme.colors.primary,
      marginBottom: theme.spacing['4xl'],
      marginTop: '20%',
      textAlign: 'center',
      textShadowColor: 'rgba(124, 58, 237, 0.15)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
      letterSpacing: -1,
      lineHeight: 56,
    },
    title: {
      fontSize: theme.textStyles.onboardingTitle?.fontSize || 30,
      fontWeight: (theme.textStyles.onboardingTitle?.fontWeight || '600') as TextStyle['fontWeight'],
      color: theme.semanticColors.text.primary,
      textAlign: 'center',
      marginTop: '10%',
      marginBottom: theme.spacing.lg,
      lineHeight: 36,
    },
    subtitle: {
      fontSize: theme.textStyles.onboardingSubtitle?.fontSize || 20,
      fontWeight: (theme.textStyles.onboardingSubtitle?.fontWeight || '500') as TextStyle['fontWeight'],
      color: theme.semanticColors.text.secondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
      lineHeight: 28,
    },
    description: {
      fontSize: 16,
      fontWeight: '400',
      color: theme.semanticColors.text.secondary,
      textAlign: 'center',
      maxWidth: width * 0.85,
      paddingHorizontal: theme.spacing.lg,
      lineHeight: 24,
      opacity: 1,
    },
    footer: {
      paddingHorizontal: theme.spacing['2xl'],
      paddingBottom: theme.spacing['4xl'],
      paddingTop: theme.spacing.xl,
      backgroundColor: theme.semanticColors.background.primary,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      ...theme.shadows.lg,
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: theme.spacing['2xl'],
      alignItems: 'center',
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: theme.borderRadius.full,
      backgroundColor: '#CBD5E1',
      marginHorizontal: 4,
      opacity: 0.7,
    },
    dotActive: {
      backgroundColor: theme.colors.primary,
      width: 32,
      height: 8,
      borderRadius: 4,
      opacity: 1,
    },
    buttonContainer: {
      gap: theme.spacing.md,
    },
    gradientButton: {
      backgroundColor: `linear-gradient(135deg, ${theme.colors.gradientStart}, ${theme.colors.gradientEnd})`,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const slideIndex = Math.round(
            event.nativeEvent.contentOffset.x / width
          );
          setCurrentSlide(slideIndex);
        }}
      >
        {slides.map((slide, index) => (
          <View key={index} style={styles.slideContainer}>
            {slide.hasLogo ? (
              <View>
                <Text style={styles.logo}>CaloriTrack</Text>
                <Text style={[styles.subtitle, {
                  marginBottom: theme.spacing['2xl'],
                  fontSize: 16,
                  fontWeight: '400' as TextStyle['fontWeight'],
                  fontStyle: 'italic',
                  color: theme.semanticColors.text.tertiary
                }]}>
                  Minimal. Cool. Aesthetic.
                </Text>
              </View>
            ) : (
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>{slide.icon}</Text>
              </View>
            )}
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.subtitle}>{slide.subtitle}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentSlide && styles.dotActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={currentSlide < slides.length - 1 ? 'Devam Et' : 'Hadi Başlayalım!'}
            onPress={handleNext}
            fullWidth
            style={currentSlide === slides.length - 1 ? theme.coloredShadows?.gradient || {} : {}}
          />

          {currentSlide === 0 && (
            <Button
              title="Atla"
              onPress={handleSkip}
              variant="secondary"
              fullWidth
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;