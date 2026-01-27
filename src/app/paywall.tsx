/**
 * CaloriTrack - Paywall Screen
 * Minimal. Cool. Aesthetic.
 *
 * Shown after onboarding, before dashboard
 */

import { LightTheme } from '@/constants';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Purchases, { PurchasesOffering } from 'react-native-purchases';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/ui/button';
import { PREMIUM_FEATURES } from '../config/revenuecat';
import { useRevenueCat } from '../context/revenuecat-context';

const PaywallScreen = () => {
  const { isPremium, currentOffering, restorePurchases } = useRevenueCat();
  const [isRestoring, setIsRestoring] = useState(false);
  const [showCustomPaywall, setShowCustomPaywall] = useState(false);

  const handleViewPremiumPlans = () => {
    // In development/emulator, show custom paywall
    // In production with real offerings, use RevenueCat UI
    if (!currentOffering || __DEV__) {
      setShowCustomPaywall(true);
    } else {
      showRevenueCatPaywall();
    }
  };

  const showRevenueCatPaywall = async () => {
    try {
      const RevenueCatUI = require('react-native-purchases-ui');
      const result = await RevenueCatUI.presentPaywall({
        displayCloseButton: true,
      });

      if (result === RevenueCatUI.PAYWALL_RESULT.PURCHASED ||
          result === RevenueCatUI.PAYWALL_RESULT.RESTORED) {
        handleContinue();
      }
    } catch (error) {
      console.error('Paywall error:', error);
      setShowCustomPaywall(true);
    }
  };

  const handlePurchasePackage = async (pkg: any) => {
    try {
      setIsRestoring(true);
      const { customerInfo } = await Purchases.purchasePackage(pkg);

      if (customerInfo.entitlements.active.premium !== undefined) {
        Alert.alert(
          'Başarılı!',
          'Premium üyeliğiniz aktif edildi!',
          [
            { text: 'Devam Et', onPress: () => handleContinue() },
          ]
        );
      }
    } catch (error: any) {
      console.error('Purchase error:', error);

      // User cancelled - don't show error
      if (error.userCancelled) {
        return;
      }

      // In emulator, this is expected
      if (__DEV__) {
        Alert.alert(
          'Bilgi (Geliştirme Modu)',
          'Google Play Billing emulatorde mevcut değil. Gerçek cihazda satın alabilirsiniz.',
          [
            { text: 'Tamam' },
            { text: 'Ücretsiz Devam Et', onPress: () => handleContinue() },
          ]
        );
      } else {
        Alert.alert('Hata', 'Satın alma işlemi başarısız oldu. Lütfen daha sonra tekrar deneyin.');
      }
    } finally {
      setIsRestoring(false);
    }
  };

  const handleRestorePurchases = async () => {
    setIsRestoring(true);
    try {
      const hasAccess = await restorePurchases();

      if (hasAccess) {
        Alert.alert(
          'Başarılı',
          'Satın almalarınız geri yüklendi! Premium özelliklere erişiminiz var.',
          [
            { text: 'Devam Et', onPress: () => handleContinue() },
          ]
        );
      } else {
        Alert.alert(
          'Bilgi',
          'Aktif bir Premium üyeliğiniz bulunamadı.',
          [
            { text: 'Tamam' },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Hata', 'Satın alamalar geri yüklenirken bir sorun oluştu.');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleContinueFree = () => {
    Alert.alert(
      'Ücretsiz Devam',
      'Premium özelliklere erişemeyeceksiniz ancak istediğiniz zaman yükseltebilirsiniz.',
      [
        { text: 'Geri', style: 'cancel' },
        { text: 'Devam Et', onPress: () => handleContinue() },
      ]
    );
  };

  const handleContinue = () => {
    // Navigate to dashboard
    router.replace('/dashboard');
  };

  const renderCustomPaywall = () => {
    // In development without offerings, show placeholder
    if (!currentOffering || !currentOffering.availablePackages || currentOffering.availablePackages.length === 0) {
      return (
        <Modal
          visible={showCustomPaywall}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowCustomPaywall(false)}
        >
          <View style={customPaywallStyles.overlay}>
            <View style={customPaywallStyles.modal}>
              {/* Header */}
              <View style={customPaywallStyles.header}>
                <TouchableOpacity
                  style={customPaywallStyles.closeButton}
                  onPress={() => setShowCustomPaywall(false)}
                >
                  <Ionicons name="close" size={24} color="#64748B" />
                </TouchableOpacity>
                <Text style={customPaywallStyles.title}>Premium Planları</Text>
                <View style={customPaywallStyles.spacer} />
              </View>

              {/* No offerings message */}
              <View style={customPaywallStyles.noOfferingsContainer}>
                <Ionicons name="information-circle-outline" size={48} color="#94A3B8" />
                <Text style={customPaywallStyles.noOfferingsTitle}>Planlar Yükleniyor</Text>
                <Text style={customPaywallStyles.noOfferingsText}>
                  {__DEV__
                    ? 'Geliştirme modunda RevenueCat ürünleri mevcut değil. Gerçek cihazda planlar görüntülenecektir.'
                    : 'Şu anda planlar yüklenemiyor. Lütfen daha sonra tekrar deneyin.'}
                </Text>
                <TouchableOpacity
                  style={customPaywallStyles.continueButton}
                  onPress={handleContinue}
                >
                  <Text style={customPaywallStyles.continueButtonText}>
                    Ücretsiz Devam Et
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      );
    }

    const packages = currentOffering.availablePackages;

    return (
      <Modal
        visible={showCustomPaywall}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCustomPaywall(false)}
      >
        <View style={customPaywallStyles.overlay}>
          <View style={customPaywallStyles.modal}>
            {/* Header */}
            <View style={customPaywallStyles.header}>
              <TouchableOpacity
                style={customPaywallStyles.closeButton}
                onPress={() => setShowCustomPaywall(false)}
              >
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
              <Text style={customPaywallStyles.title}>Premium Planları</Text>
              <View style={customPaywallStyles.spacer} />
            </View>

            {/* Packages */}
            <ScrollView style={customPaywallStyles.packagesContainer}>
              {packages.map((pkg, index) => (
                <TouchableOpacity
                  key={pkg.identifier}
                  style={[
                    customPaywallStyles.packageCard,
                    index === 0 && customPaywallStyles.featuredPackage,
                  ]}
                  onPress={() => handlePurchasePackage(pkg)}
                >
                  {index === 0 && (
                    <View style={customPaywallStyles.popularBadge}>
                      <Text style={customPaywallStyles.popularBadgeText}>En Popüler</Text>
                    </View>
                  )}

                  <View style={customPaywallStyles.packageHeader}>
                    <Text style={customPaywallStyles.packageName}>
                      {pkg.packageType === 'MONTHLY' ? 'Aylık' : 'Yıllık'} Plan
                    </Text>
                    <Text style={customPaywallStyles.packagePrice}>
                      {pkg.product.priceString}
                    </Text>
                  </View>

                  <View style={customPaywallStyles.packageFeatures}>
                    <Text style={customPaywallStyles.featureItem}>
                      ✓ Sınırsız tarif erişimi
                    </Text>
                    <Text style={customPaywallStyles.featureItem}>
                      ✓ AI destekli yemek önerileri
                    </Text>
                    <Text style={customPaywallStyles.featureItem}>
                      ✓ Özel tarif oluşturma
                    </Text>
                    <Text style={customPaywallStyles.featureItem}>
                      ✓ Otomatik market listesi
                    </Text>
                    <Text style={customPaywallStyles.featureItem}>
                      ✓ Reklamsız deneyim
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={customPaywallStyles.selectButton}
                    onPress={() => handlePurchasePackage(pkg)}
                  >
                    <LinearGradient
                      colors={['#7C3AED', '#EC4899']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={customPaywallStyles.selectGradient}
                    >
                      <Text style={customPaywallStyles.selectButtonText}>
                        Seç
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Footer */}
            <View style={customPaywallStyles.footer}>
              <TouchableOpacity
                style={customPaywallStyles.restoreButton}
                onPress={handleRestorePurchases}
              >
                <Text style={customPaywallStyles.restoreButtonText}>
                  Satın Almayı Geri Yükle
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section with Gradient */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800' }}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay}>
            <Text style={styles.heroEmoji}>💎</Text>
            <Text style={styles.heroTitle}>CaloriTrack Premium</Text>
            <Text style={styles.heroSubtitle}>Sağlıklı yaşam yolculuğunuzu bir üst seviyeye taşıyın</Text>
          </View>
        </ImageBackground>

        {/* Features List */}
        <View style={styles.content}>
          <Text style={styles.featuresTitle}>Premium Özellikler</Text>
          <Text style={styles.featuresDescription}>
            Premium ile daha fazlasını kilidini açın
          </Text>

          {PREMIUM_FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
              </View>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}

          {/* Pricing Preview */}
          {currentOffering && (
            <View style={styles.pricingPreview}>
              <Text style={styles.pricingTitle}>Planlar</Text>
              <View style={styles.pricingCards}>
                {currentOffering.availablePackages.map((pkg, index) => (
                  <View
                    key={pkg.identifier}
                    style={[
                      styles.pricingCard,
                      index === 0 && styles.pricingCardFeatured,
                    ]}
                  >
                    {index === 0 && (
                      <View style={styles.pricingBadge}>
                        <Text style={styles.pricingBadgeText}>Önerilen</Text>
                      </View>
                    )}
                    <Text style={styles.pricingPeriod}>
                      {pkg.packageType === 'MONTHLY' ? 'Aylık' : 'Yıllık'}
                    </Text>
                    <Text style={styles.pricingPrice}>
                      {pkg.product.priceString}
                    </Text>
                    {pkg.product.introPrice && (
                      <Text style={styles.pricingIntro}>
                        İlk ay {pkg.product.introPrice.priceString}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Premium Badge */}
          <View style={styles.benefitsCard}>
            <Text style={styles.benefitsTitle}>🎯 Neden Premium?</Text>
            <Text style={styles.benefitsText}>
              Premium ile yapay zeka destekli yemek analizi, detaylı besin değerleri ve kişiselleştirilmiş öneriler gibi özelliklere sınırsız erişim sağlayın.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <Button
          title="Premium Planları Gör"
          onPress={handleViewPremiumPlans}
          fullWidth
          style={LightTheme.shadows.lg}
        />

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleRestorePurchases}
          disabled={isRestoring}
        >
          <Text style={styles.secondaryButtonText}>
            {isRestoring ? 'Geri Yükleniyor...' : 'Satın Almaları Geri Yükle'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tertiaryButton}
          onPress={handleContinueFree}
        >
          <Text style={styles.tertiaryButtonText}>Ücretsiz Devam Et</Text>
        </TouchableOpacity>
      </View>

      {renderCustomPaywall()}
    </SafeAreaView>
  );
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
  hero: {
    height: 280,
    width: '100%',
  },
  heroImage: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(124, 58, 237, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: LightTheme.spacing['2xl'],
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroEmoji: {
    fontSize: 64,
    marginBottom: LightTheme.spacing.md,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: LightTheme.spacing.sm,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  content: {
    padding: LightTheme.spacing['2xl'],
  },
  featuresTitle: {
    fontSize: LightTheme.typography['2xl'].fontSize,
    fontWeight: '600',
    color: LightTheme.semanticColors.text.primary,
    marginBottom: LightTheme.spacing.sm,
  },
  featuresDescription: {
    fontSize: LightTheme.typography.base.fontSize,
    color: LightTheme.semanticColors.text.secondary,
    marginBottom: LightTheme.spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LightTheme.semanticColors.background.secondary,
    borderRadius: LightTheme.borderRadius.lg,
    padding: LightTheme.spacing.lg,
    marginBottom: LightTheme.spacing.md,
    borderWidth: 1,
    borderColor: LightTheme.semanticColors.border.primary,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${LightTheme.colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: LightTheme.spacing.md,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: LightTheme.typography.base.fontSize,
    fontWeight: '600',
    color: LightTheme.semanticColors.text.primary,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: LightTheme.typography.sm.fontSize,
    color: LightTheme.semanticColors.text.secondary,
  },
  pricingPreview: {
    marginTop: LightTheme.spacing['2xl'],
    marginBottom: LightTheme.spacing.xl,
  },
  pricingTitle: {
    fontSize: LightTheme.typography['2xl'].fontSize,
    fontWeight: '600',
    color: LightTheme.semanticColors.text.primary,
    marginBottom: LightTheme.spacing.lg,
    textAlign: 'center',
  },
  pricingCards: {
    flexDirection: 'row',
    gap: LightTheme.spacing.md,
  },
  pricingCard: {
    flex: 1,
    backgroundColor: LightTheme.semanticColors.background.secondary,
    borderRadius: LightTheme.borderRadius.lg,
    padding: LightTheme.spacing.lg,
    borderWidth: 1,
    borderColor: LightTheme.semanticColors.border.primary,
    alignItems: 'center',
  },
  pricingCardFeatured: {
    borderColor: LightTheme.colors.primary,
    borderWidth: 2,
    backgroundColor: `${LightTheme.colors.primary}10`,
  },
  pricingBadge: {
    position: 'absolute',
    top: -1,
    backgroundColor: LightTheme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pricingBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  pricingPeriod: {
    fontSize: 12,
    color: LightTheme.semanticColors.text.secondary,
    marginBottom: 4,
  },
  pricingPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: LightTheme.semanticColors.text.primary,
    marginBottom: 4,
  },
  pricingIntro: {
    fontSize: 11,
    color: LightTheme.colors.primary,
  },
  benefitsCard: {
    backgroundColor: `${LightTheme.colors.primary}10`,
    borderRadius: LightTheme.borderRadius.lg,
    padding: LightTheme.spacing.lg,
    marginTop: LightTheme.spacing.md,
    borderWidth: 1,
    borderColor: `${LightTheme.colors.primary}30`,
  },
  benefitsTitle: {
    fontSize: LightTheme.typography.lg.fontSize,
    fontWeight: '600',
    color: LightTheme.semanticColors.text.primary,
    marginBottom: LightTheme.spacing.sm,
  },
  benefitsText: {
    fontSize: LightTheme.typography.base.fontSize,
    color: LightTheme.semanticColors.text.secondary,
    lineHeight: LightTheme.typography.base.lineHeight,
  },
  footer: {
    padding: LightTheme.spacing['2xl'],
    backgroundColor: LightTheme.semanticColors.background.primary,
    borderTopWidth: 1,
    borderTopColor: LightTheme.semanticColors.border.primary,
    gap: LightTheme.spacing.sm,
  },
  secondaryButton: {
    paddingVertical: LightTheme.spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: LightTheme.typography.base.fontSize,
    fontWeight: '500',
    color: LightTheme.colors.primary,
  },
  tertiaryButton: {
    paddingVertical: LightTheme.spacing.sm,
    alignItems: 'center',
  },
  tertiaryButtonText: {
    fontSize: LightTheme.typography.sm.fontSize,
    color: LightTheme.semanticColors.text.tertiary,
  },
});

const customPaywallStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  spacer: {
    width: 32,
  },
  packagesContainer: {
    padding: 20,
    maxHeight: 400,
  },
  packageCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  featuredPackage: {
    borderColor: '#7C3AED',
    backgroundColor: '#F3E8FF',
  },
  popularBadge: {
    position: 'absolute',
    top: -1,
    right: 16,
    backgroundColor: '#7C3AED',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  packageHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  packageName: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
  },
  packageFeatures: {
    marginBottom: 20,
  },
  featureItem: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 8,
  },
  selectButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  restoreButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  restoreButtonText: {
    color: '#7C3AED',
    fontSize: 16,
    fontWeight: '500',
  },
  // No offerings state
  noOfferingsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noOfferingsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  noOfferingsText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  continueButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaywallScreen;
