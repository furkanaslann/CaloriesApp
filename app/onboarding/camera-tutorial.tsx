/**
 * CaloriTrack - Onboarding Camera Tutorial Screen
 * Minimal. Cool. Aesthetic.
 */

import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Button from '../../components/ui/button';
import { useOnboarding } from '../../contexts/onboarding-context';
import { useTheme } from '../../src/theme';

const CameraTutorialScreen = () => {
  const themeResult = useTheme();
  const theme = themeResult || {
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
    spacing: { lg: 24, md: 16, xl: 32, '4xl': 48, '2xl': 24 },
    borderRadius: { full: 9999, xl: 16, lg: 12 },
    shadows: { lg: {}, md: {} },
    coloredShadows: { gradient: {} },
  };
  const { nextStep, previousStep } = useOnboarding();

  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Yemeklerinizi Fotoğraflayın',
      subtitle: 'Akıllı Tanıma',
      description: 'Yemeklerinizi çekin ve yapay zeka tarafından otomatik olarak tanımasını izleyin.',
      image: img7Dbf04425Ad247Bfaca593A3C5C58Bc6Webp,
      tips: [
        'Iyi aydınlatılmış ortamda çekin',
        'Yemeğin tamamını görünür yapın',
        'Referans objesi ekleyin (çatal, kaşık)'
      ]
    },
    {
      title: 'Otomatik Kalori Hesaplama',
      subtitle: 'Hızlı ve Doğru',
      description: 'Yapay zeka, yemeğinizin kalori ve besin değerlerini otomatik olarak hesaplar.',
      image: img84C0Ea078A2844B6B1B595C53Bf04137Webp,
      tips: [
        'Porsiyon boyutunu belirtin',
        'Malzemeleri düzenleyin',
        'Yemek türünü doğrulayın'
      ]
    },
    {
      title: 'Günlük Takip',
      subtitle: 'İlerleme Gözlemi',
      description: 'Tüm öğünlerinizi kolayca takip edin ve günlük hedeflerinize ulaşın.',
      image: img6E99198Bc5B746798F189Eed63933EabWebp,
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.semanticColors.background.primary,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
      justifyContent: 'center',
    },
    image: {
      width: '100%',
      height: 300,
      resizeMode: 'contain',
      marginBottom: theme.spacing['4xl'],
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing['3xl'],
    },
    title: {
      ...theme.textStyles.heading2,
      color: theme.semanticColors.text.primary,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    subtitle: {
      ...theme.textStyles.heading4,
      color: theme.colors.primary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    description: {
      ...theme.textStyles.body,
      color: theme.semanticColors.text.secondary,
      textAlign: 'center',
      lineHeight: theme.typography.lineHeight.relaxed,
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing['3xl'],
    },
    tipsContainer: {
      backgroundColor: theme.semanticColors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing['4xl'],
      ...theme.shadows.sm,
    },
    tipsTitle: {
      ...theme.textStyles.heading5,
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
      ...theme.textStyles.body,
      color: theme.semanticColors.text.primary,
      flex: 1,
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing['2xl'],
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.semanticColors.border.primary,
      marginHorizontal: 4,
    },
    dotActive: {
      backgroundColor: theme.colors.primary,
      width: 24,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Image source={{ uri: currentSlideData.image }} style={styles.image} />

          <View style={styles.header}>
            <Text style={styles.title}>{currentSlideData.title}</Text>
            <Text style={styles.subtitle}>{currentSlideData.subtitle}</Text>
            <Text style={styles.description}>{currentSlideData.description}</Text>
          </View>

          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 İpuçları</Text>
            {currentSlideData.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <View style={styles.tipBullet} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>

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
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Geri"
          onPress={handlePrevious}
          variant="secondary"
        />
        <Button
          title={currentSlide < slides.length - 1 ? 'Sonraki' : 'Anladım'}
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
};

// Placeholder images - will be replaced with proper assets
const img7Dbf04425Ad247Bfaca593A3C5C58Bc6Webp = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%23666' text-anchor='middle' dy='.3em'%3E📷 Camera%3C/text%3E%3C/svg%3E";
const img84C0Ea078A2844B6B1B595C53Bf04137Webp = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%23666' text-anchor='middle' dy='.3em'%3E🧮 Analytics%3C/text%3E%3C/svg%3E";
const img6E99198Bc5B746798F189Eed63933EabWebp = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%23666' text-anchor='middle' dy='.3em'%3E📊 Progress%3C/text%3E%3C/svg%3E";

export default CameraTutorialScreen;