/**
 * CaloriTrack - Onboarding Camera Tutorial Screen
 * Minimal. Cool. Aesthetic.
 */

import { LightTheme } from '@/constants';
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
      backgroundColor: LightTheme.semanticColors.background.primary,
    },
    content: {
      paddingHorizontal: LightTheme.spacing['2xl'],
      paddingTop: LightTheme.spacing.lg,
      paddingBottom: LightTheme.spacing['4xl'],
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
      backgroundColor: `${LightTheme.colors.primary}15`,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: '15%',
      marginBottom: LightTheme.spacing['4xl'],
      ...LightTheme.shadows.lg,
    },
    icon: {
      fontSize: 60,
      textAlign: 'center',
    },
    logo: {
      fontSize: 48,
      fontWeight: '800',
      color: LightTheme.colors.primary,
      marginBottom: LightTheme.spacing.md,
      textAlign: 'center',
      textShadowColor: 'rgba(124, 58, 237, 0.15)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
      letterSpacing: -1,
      lineHeight: 56,
    },
    title: {
      fontSize: 30,
      fontWeight: '600',
      color: LightTheme.semanticColors.text.primary,
      textAlign: 'center',
      marginTop: '10%',
      marginBottom: LightTheme.spacing.lg,
      lineHeight: 36,
    },
    subtitle: {
      fontSize: 20,
      fontWeight: '500',
      color: LightTheme.semanticColors.text.secondary,
      textAlign: 'center',
      marginBottom: LightTheme.spacing.lg,
      lineHeight: 28,
    },
    description: {
      fontSize: 16,
      fontWeight: '400',
      color: LightTheme.semanticColors.text.secondary,
      textAlign: 'center',
      lineHeight: 24,
      paddingHorizontal: LightTheme.spacing.lg,
      marginBottom: LightTheme.spacing['3xl'],
    },
    tipsContainer: {
      backgroundColor: LightTheme.semanticColors.background.secondary,
      borderRadius: LightTheme.borderRadius.lg,
      padding: LightTheme.spacing.lg,
      ...LightTheme.shadows.sm,
    },
    tipsTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: LightTheme.semanticColors.text.primary,
      marginBottom: LightTheme.spacing.md,
      textAlign: 'center',
    },
    tipItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: LightTheme.spacing.sm,
    },
    tipBullet: {
      width: 8,
      height: 8,
      borderRadius: LightTheme.borderRadius.full,
      backgroundColor: LightTheme.colors.primary,
      marginRight: LightTheme.spacing.md,
    },
    tipText: {
      color: LightTheme.semanticColors.text.primary,
      flex: 1,
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },
    footer: {
      paddingHorizontal: LightTheme.spacing['2xl'],
      paddingBottom: LightTheme.spacing['4xl'],
      paddingTop: LightTheme.spacing.xl,
      backgroundColor: LightTheme.semanticColors.background.primary,
      borderTopLeftRadius: LightTheme.borderRadius.xl,
      borderTopRightRadius: LightTheme.borderRadius.xl,
      ...LightTheme.shadows.lg,
    },
    progressIndicator: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: LightTheme.spacing['2xl'],
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: LightTheme.borderRadius.full,
      backgroundColor: '#CBD5E1',
      marginHorizontal: 4,
      opacity: 0.7,
    },
    dotActive: {
      backgroundColor: LightTheme.colors.primary,
      width: 32,
      height: 8,
      borderRadius: 4,
      opacity: 1,
    },
    buttonContainer: {
      gap: LightTheme.spacing.md,
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
                marginBottom: LightTheme.spacing['2xl'],
                fontSize: 16,
                fontWeight: '400',
                fontStyle: 'italic',
                color: LightTheme.semanticColors.text.tertiary
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