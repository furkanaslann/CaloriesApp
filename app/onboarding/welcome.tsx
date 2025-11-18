/**
 * CaloriTrack - Onboarding Welcome Screen
 * Minimal. Cool. Aesthetic.
 */

import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Button from '../../components/ui/button';
import { useOnboarding } from '../../contexts/onboarding-context';
import { useTheme } from '../../src/theme/index';

// Figma onboarding images from the design
const img3216B7Adc1294B15A468E83C9Cae2192Webp = "http://localhost:3845/assets/587418f9e462ffc7beeffae5c6087cc9a9dd6560.png";
const imgEc39430F33F644D588Db5E15104E90FaWebp = "http://localhost:3845/assets/e67608693ca612af3c1abae815e0c7bcf7c6d2be.png";
const imgB6575Fe326C245E2Acf3806B12047CcfWebp = "http://localhost:3845/assets/f1f9cc64d518c90731ba5011b22d99d241240237.png";
const imgAf62C1E53Bf649F8B298F4B88D2C3D7AWebp = "http://localhost:3845/assets/8be20259007adc78cc32bf1e56a343ee77793f40.png";
const img8840Af3E4D4F446685E9470C9Bcce41FWebp = "http://localhost:3845/assets/f19c44477ae953d5c2deb9e66c1eb8707f7b6a81.png";
const imgE56F25E6E9Ee44468Dc1641617Cdcd4DWebp = "http://localhost:3845/assets/b54ee1581edecf69989eaa2325d638148ef2530b.png";
const img998Bcddc892849A38E402084C03774F9Webp = "http://localhost:3845/assets/5a5e3bd6f95bd6f1d3dff4f1c798a3a57869fb98.png";
const img67D9204B798D44Da83Cf6Ae9836Ab293Webp = "http://localhost:3845/assets/30378ff963e2b8a5a9903befcb43a74b51c74eb8.png";
const imgDeec771D6E3544D7A8431F5D27Be53DdWebp = "http://localhost:3845/assets/b3df2c29c29ee2be139e10f2efddbde50db5a9a8.png";
const img19842F7B44E24Dd08573194Beeeda00CWebp = "http://localhost:3845/assets/f392197c8ab3886da478ed4431f6d55980faa46f.png";
const img37F8A84E0Eca4Deea20Ce10C40Fcf202Webp = "http://localhost:3845/assets/32d6f997adfbb5451f69aded4bab41f69adec70c.png";
const img2E4B17E3F3624Bfca65E9166D41D93E3Webp = "http://localhost:3845/assets/0debc9b474129ed158ef0367f08072bcd2be06ca.png";
const imgFf26Bf2B1D16462Baf1E0Cf28B19A444Webp = "http://localhost:3845/assets/b68e4bf70bf80d5671fc6a280dc95f3f11e85bcc.png";
const imgC52Fa98268F441F2Bc8E8C0Bf1863Fb6Webp = "http://localhost:3845/assets/01dfe2758ffea0e05773b20d210252f2dde9dae3.png";
const imgA4Ee39C6C4454Ff6B7F770769D9A3Ef5Webp = "http://localhost:3845/assets/f29947cdbf5e218b99f45d96a81ce6b0f8fc73e5.png";
const img230844Fb79284434B95Ed7892Bfe88FdWebp = "http://localhost:3845/assets/2ab632c39d4fb27a378bd5fdda73edc00e64eec2.png";
const img267Fd455F9Bc4Bf7A2B9278059C42C7DWebp = "http://localhost:3845/assets/dae22cc0be83061b2c2cf5a3988196c2cc878312.png";
const imgE3Bf9Ab0079649899Ee8E971C1467C40Webp = "http://localhost:3845/assets/b859f11e6513c3ce5371625a032c0bcd16974654.png";
const imgB7B8C215667646Fc8E26Fbed9B00D7EbWebp = "http://localhost:3845/assets/fc2a08b24dff9609049a0032b567c697e7d744f1.png";
const imgDf7E470792A8443Ab8C75B48C780Bfc1Webp = "http://localhost:3845/assets/e78c2b6d0e1345e1dbb6b4f3230d0a0d6a00a1eb.png";
const img732A40C0470F48Beacb1C3Be46547A27Webp = "http://localhost:3845/assets/87162ded8009b180415a12cd0b16adc76b403357.png";
const img671Ce043639F4A4591624Dcadc6F100CWebp = "http://localhost:3845/assets/2e05e7ea8cdbe884b85bef02aedc2337d8aee116.png";
const imgE287E3562Df84E5D85F24Ca6Ac536Ce8Webp = "http://localhost:3845/assets/06d9dcc47308c9f4c9e2fb2b89390c3e7c9dab18.png";
const imgAb378C3C7Afa4F2F9B12Acb84Ae4D6EdWebp = "http://localhost:3845/assets/6ee25e081ad2871a35de6de0ba75668f5d1858bf.png";
const img1Dd6F70C04F14A4Dae21Dcccf4756977Webp = "http://localhost:3845/assets/63e58bd2648b28327a5d614c5f6b6051af89bbab.png";
const img38B1687B403C4B6Ba50Bc06325Cbe6CaWebp = "http://localhost:3845/assets/9375a65c33c3d58ff81b437a60bb3a2bbf1147d0.png";
const imgBfb9D5Bbd0B748B692A6Ece10384FfdaWebp = "http://localhost:3845/assets/559609bf09939ced3e885a549946695c582a799e.png";
const img691126E385494F85A1B606699A37D540Webp = "http://localhost:3845/assets/9e00f50f543984e99a2252b1891794e9c8179313.png";
const imgF3Ebb06F412B4249931Bfc05B35B7C6CWebp = "http://localhost:3845/assets/8400c13cd87484d535bb89aa60f5a0ec589e74c2.png";
const img375Cdc1Db4574385898Ce1Cf78586190Webp = "http://localhost:3845/assets/cbe48491c12e9e840ccb9bfce05565f9bd1a2825.png";

const { width } = Dimensions.get('window');

const WelcomeScreen = () => {
  const themeResult = useTheme();
  const theme = themeResult || {
    semanticColors: {
      background: { primary: '#FFFFFF' },
      text: {
        primary: '#1E293B',
        secondary: '#475569',
        tertiary: '#64748B',
        onPrimary: '#FFFFFF'
      },
      border: { primary: '#E2E8F0' },
      onPrimary: '#FFFFFF',
    },
    colors: {
      primary: '#7C3AED',
      gradientStart: '#7C3AED',
      gradientEnd: '#EC4899',
    },
    textStyles: {
      onboardingHero: { fontSize: 36, fontWeight: '700' },
      onboardingTitle: { fontSize: 30, fontWeight: '600' },
      onboardingSubtitle: { fontSize: 20, fontWeight: '500' },
      onboardingDescription: { fontSize: 16, fontWeight: '400' },
    },
    spacing: { lg: 24, md: 16, xl: 32, '4xl': 48, '2xl': 24 },
    borderRadius: { full: 9999, xl: 16, lg: 12 },
    shadows: { lg: {}, md: {} },
    coloredShadows: { gradient: {} },
  };

  const { nextStep } = useOnboarding();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Welcome slides data based on Figma design - modern onboarding flow
  const slides = [
    {
      title: 'Hoş Geldiniz!',
      subtitle: 'CaloriTrack',
      description: 'Sağlıklı yaşam yolculuğunuza başlayın',
      image: img3216B7Adc1294B15A468E83C9Cae2192Webp,
      hasLogo: true,
    },
    {
      title: 'Akıllı Fotoğraf',
      subtitle: 'Yemeklerinizi anında analiz edin',
      description: 'Yemeklerinizi çekin, yapay zeka destekli sistemimiz kalorileri otomatik olarak hesaplasın',
      image: imgEc39430F33F644D588Db5E15104E90FaWebp,
      hasLogo: false,
    },
    {
      title: 'Kişisel Planlar',
      subtitle: 'Size özel hedefler belirlenir',
      description: 'Yaşam tarzınıza, hedeflerinize ve tercihlerinize uygun beslenme planları oluşturun',
      image: imgB6575Fe326C245E2Acf3806B12047CcfWebp,
      hasLogo: false,
    },
    {
      title: 'Detaylı Analiz',
      subtitle: 'İlerlemenizi takip edin',
      description: 'Günlük, haftalık ve aylık raporlarla beslenme alışkanlıklarınızı analiz edin',
      image: imgAf62C1E53Bf649F8B298F4B88D2C3D7AWebp,
      hasLogo: false,
    },
    {
      title: 'Sosyal Destek',
      subtitle: 'Topluluğa katılın',
      description: 'Benzer hedeflere sahip kullanıcılarla deneyimlerinizi paylaşın ve birbirinize destek olun',
      image: img8840Af3E4D4F446685E9470C9Bcce41FWebp,
      hasLogo: false,
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
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
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing['2xl'],
      paddingVertical: theme.spacing['4xl'],
    },
    imageContainer: {
      width: width * 0.85,
      height: width * 0.65,
      marginBottom: theme.spacing['4xl'],
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden',
      ...theme.shadows.lg,
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    logo: {
      ...theme.textStyles.onboardingHero,
      color: theme.colors.primary,
      marginBottom: theme.spacing['4xl'],
      textAlign: 'center',
      fontWeight: '700',
    },
    title: {
      fontSize: theme.textStyles.onboardingTitle?.fontSize || 30,
      fontWeight: theme.textStyles.onboardingTitle?.fontWeight || '600',
      color: theme.semanticColors.text.primary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
      lineHeight: 36,
    },
    subtitle: {
      fontSize: theme.textStyles.onboardingSubtitle?.fontSize || 20,
      fontWeight: theme.textStyles.onboardingSubtitle?.fontWeight || '500',
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
      background: `linear-gradient(135deg, ${theme.colors.gradientStart}, ${theme.colors.gradientEnd})`,
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
            {slide.hasLogo ? (
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
              <View style={styles.imageContainer}>
                <Image source={{ uri: slide.image }} style={styles.image} />
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