/**
 * CaloriTrack - Onboarding Welcome Screen
 * Minimal. Cool. Aesthetic.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../theme/index';
import { useOnboarding } from '../../contexts/onboarding-context';
import Button from '../../components/ui/button';

const { width } = Dimensions.get('window');

const WelcomeScreen = () => {
  const themeResult = useTheme();
  const theme = themeResult || {
    semanticColors: {
      background: { primary: '#FFFFFF' },
      text: { primary: '#111827', secondary: '#6B7280' },
      border: { primary: '#E5E7EB' },
      onPrimary: '#FFFFFF',
    },
    colors: { primary: '#6366F1' },
    textStyles: {
      display: { fontSize: 36, fontWeight: '700' },
      heading2: { fontSize: 30, fontWeight: '700' },
      body: { fontSize: 16, fontWeight: '400' },
    },
    spacing: { lg: 24, md: 16, xl: 32, '4xl': 48 },
    borderRadius: { full: 9999 },
    shadows: { sm: {} },
  };

  const { nextStep } = useOnboarding();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Welcome slides data
  const slides = [
    {
      title: 'Hoş Geldiniz!',
      subtitle: 'CaloriTrack',
      description: 'Sağlıklı yaşam yolculuğunuza başlayın',
      icon: '🍎',
    },
    {
      title: 'Akıllı Takip',
      description: 'Yemeklerinizi fotoğraflayarak kolayca takip edin',
      icon: '📸',
    },
    {
      title: 'Kişisel Hedefler',
      description: 'Kilo verme, kas kazanma veya sağlıklı beslenme hedeflerinize ulaşın',
      icon: '🎯',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      nextStep();
      router.push('/onboarding/profile');
    }
  };

  const handleSkip = () => {
    nextStep();
    router.push('/onboarding/profile');
  };

  // Dynamic styles using theme
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
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
    },
    icon: {
      fontSize: 80,
      marginBottom: theme.spacing['4xl'],
    },
    title: {
      ...theme.textStyles.display,
      color: theme.semanticColors.text.primary,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    subtitle: {
      ...theme.textStyles.heading2,
      color: theme.semanticColors.text.secondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    description: {
      ...theme.textStyles.body,
      color: theme.semanticColors.text.secondary,
      textAlign: 'center',
      lineHeight: theme.typography.lineHeight.relaxed,
      maxWidth: 300,
    },
    footer: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing['4xl'],
      paddingTop: theme.spacing.xl,
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: theme.spacing.xl,
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
      gap: theme.spacing.md,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
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
            <Text style={styles.icon}>{slide.icon}</Text>
            <Text style={styles.title}>{slide.title}</Text>
            {slide.subtitle && (
              <Text style={styles.subtitle}>{slide.subtitle}</Text>
            )}
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
            title={currentSlide < slides.length - 1 ? 'Devam Et' : 'Başlayalım'}
            onPress={handleNext}
            fullWidth
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