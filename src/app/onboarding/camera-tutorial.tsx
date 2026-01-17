/**
 * CaloriTrack - Onboarding Camera Tutorial Screen
 * Minimal. Cool. Aesthetic.
 */

import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/button';
import { useOnboarding } from '../../context/onboarding-context';

const CameraTutorialScreen = () => {
  // Modern theme system using constants
  const theme = {
    semanticColors: {
      background: { primary: '#FFFFFF', surface: '#F8FAFC', primarySurface: '#EDE9FE' },
      text: { primary: '#1E293B', secondary: '#475569', tertiary: '#64748B', onPrimary: '#FFFFFF' },
      border: { primary: '#E2E8F0', secondary: '#E2E8F0' },
    },
    colors: { primary: '#7C3AED', gradientStart: '#7C3AED', gradientEnd: '#EC4899' },
    textStyles: {
      onboardingTitle: { fontSize: 30, fontWeight: '600' },
      onboardingSubtitle: { fontSize: 20, fontWeight: '500' },
      onboardingDescription: { fontSize: 16, fontWeight: '400' },
      body: { fontSize: 16, fontWeight: '400' },
      bodySmall: { fontSize: 14, fontWeight: '400' },
    },
    spacing: { sm: 8, lg: 24, md: 16, xl: 32, '3xl': 40, '4xl': 48, '2xl': 24 },
    borderRadius: { sm: 4, full: 9999, xl: 16, lg: 12 },
    shadows: { sm: {}, lg: {}, md: {} },
    coloredShadows: { gradient: {} },
  };
  const { nextStep, previousStep, totalSteps, getCurrentStep } = useOnboarding();

  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Akıllı Fotoğraf',
      subtitle: 'Yemeklerinizi anında analiz edin',
      description: 'Yemeklerinizi çekin, yapay zeka destekli sistemimiz kalorileri otomatik olarak hesaplasın',
      icon: '📸',
      hasLogo: false,
      tips: [
        'Iyi aydınlatılmış ortamda çekin',
        'Yemeğin tamamını görünür yapın',
        'Referans objesi ekleyin (çatal, kaşık)'
      ]
    },
    {
      title: 'Otomatik Analiz',
      subtitle: 'Hızlı ve doğru sonuçlar',
      description: 'Yapay zeka, yemeğinizin kalori ve besin değerlerini otomatik olarak hesaplar',
      icon: '🧮',
      hasLogo: false,
      tips: [
        'Porsiyon boyutunu belirtin',
        'Malzemeleri düzenleyin',
        'Yemek türünü doğrulayın'
      ]
    },
    {
      title: 'Günlük Takip',
      subtitle: 'İlerlemenizi izleyin',
      description: 'Tüm öğünlerinizi kolayca takip edin ve günlük hedeflerinize ulaşın',
      icon: '📊',
      hasLogo: false,
      tips: [
        'Öğün zamanlarını kaydedin',
        'Su tüketimini ekleyin',
        'Açlık/notlar ekleyin'
      ]
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      nextStep();
      router.push('/onboarding/notifications');
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else {
      previousStep();
      router.back();
    }
  };

  const currentSlideData = slides[currentSlide];
  const currentStep = getCurrentStep('camera-tutorial');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.semanticColors.background.primary,
    },
    content: {
      paddingHorizontal: theme.spacing['2xl'],
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing['4xl'],
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    iconContainer: {
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: `${theme.colors.primary}15`,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: theme.spacing['4xl'],
      ...(theme.shadows?.lg || {}),
    },
    icon: {
      fontSize: 60,
      textAlign: 'center',
    },
    logo: {
      fontSize: 48,
      fontWeight: '800',
      color: theme.colors.primary,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
      textShadowColor: 'rgba(124, 58, 237, 0.15)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
      letterSpacing: -1,
      lineHeight: 56,
    },
    title: {
      fontSize: theme.textStyles.onboardingTitle?.fontSize || 30,
      fontWeight:
        (typeof theme.textStyles.onboardingTitle?.fontWeight === 'number' ||
          typeof theme.textStyles.onboardingTitle?.fontWeight === 'undefined')
          ? theme.textStyles.onboardingTitle?.fontWeight ?? '600'
          : (parseInt(theme.textStyles.onboardingTitle?.fontWeight, 10) as any) ?? '600',
      color: theme.semanticColors.text.primary,
      textAlign: 'center',
      marginTop: '10%',
      marginBottom: theme.spacing.lg,
      lineHeight: 36,
    },
    subtitle: {
      fontSize: theme.textStyles.onboardingSubtitle?.fontSize || 20,
      fontWeight:
        (typeof theme.textStyles.onboardingSubtitle?.fontWeight === 'number' ||
          typeof theme.textStyles.onboardingSubtitle?.fontWeight === 'undefined')
          ? theme.textStyles.onboardingSubtitle?.fontWeight ?? '500'
          : (parseInt(theme.textStyles.onboardingSubtitle?.fontWeight, 10) as any) ?? '500',
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
      lineHeight: 24,
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing['3xl'],
    },
    tipsContainer: {
      backgroundColor: theme.semanticColors.background.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      ...(theme.shadows?.sm || {}),
    },
    tipsTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.semanticColors.text.primary,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    tipItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    tipBullet: {
      width: 8,
      height: 8,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.primary,
      marginRight: theme.spacing.md,
    },
    tipText: {
      color: theme.semanticColors.text.primary,
      flex: 1,
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },
    footer: {
      paddingHorizontal: theme.spacing['2xl'],
      paddingBottom: theme.spacing['4xl'],
      paddingTop: theme.spacing.xl,
      backgroundColor: theme.semanticColors.background.primary,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      ...(theme.shadows?.lg || {}),
    },
    progressIndicator: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing['2xl'],
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
  });

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {currentSlideData.hasLogo ? (
            <View>
              <Text style={styles.logo}>CaloriTrack</Text>
              <Text style={[styles.subtitle, {
                marginBottom: theme.spacing['2xl'],
                fontSize: 16,
                fontWeight: '400',
                fontStyle: 'italic',
                color: theme.semanticColors.text.tertiary
              }]}>
                Minimal. Cool. Aesthetic.
              </Text>
            </View>
          ) : (
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{currentSlideData.icon}</Text>
            </View>
          )}

          <Text style={styles.title}>{currentSlideData.title}</Text>
          <Text style={styles.subtitle}>{currentSlideData.subtitle}</Text>
          <Text style={styles.description}>{currentSlideData.description}</Text>

          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 İpuçları</Text>
            {currentSlideData.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <View style={styles.tipBullet} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.progressIndicator}>
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
            title={currentSlide < slides.length - 1 ? 'Sonraki' : 'Anladım'}
            onPress={handleNext}
            fullWidth
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CameraTutorialScreen;