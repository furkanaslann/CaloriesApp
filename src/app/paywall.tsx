/**
 * CaloriTrack - Paywall Screen
 * RevenueCat Paywall integration
 */

import Button from '@/components/ui/button';
import { BORDER_RADIUS, COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useRevenueCat } from '@/context/revenuecat-context';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaywallScreen() {
  const router = useRouter();
  const { isInitialized, isPremium, currentOffering, isLoading, restorePurchases, checkSubscriptionStatus } = useRevenueCat();
  const [isRestoring, setIsRestoring] = useState(false);
  const [isPresenting, setIsPresenting] = useState(false);

  // If user already has premium, skip to onboarding
  useEffect(() => {
    if (isPremium && !isLoading) {
      console.log('✅ Paywall: User has premium, navigating to onboarding...');
      router.replace('/onboarding/welcome');
    }
  }, [isPremium, isLoading]);

  // Present RevenueCat paywall UI
  const handleShowPaywall = async () => {
    try {
      setIsPresenting(true);
      console.log('🎨 Paywall: Presenting RevenueCat paywall UI...');

      const result = await RevenueCatUI.presentPaywall({
        offering: currentOffering || undefined,
        displayCloseButton: true,
      });

      console.log('📊 Paywall: Result:', result);

      switch (result) {
        case PAYWALL_RESULT.PURCHASED:
          console.log('✅ Paywall: Purchase successful!');
          Alert.alert(
            '🎉 Welcome to Premium!',
            'Thank you for subscribing to CaloriTrack Premium. Enjoy unlimited access to all features!',
            [
              {
                text: 'Continue',
                onPress: () => {
                  checkSubscriptionStatus();
                  router.replace('/onboarding/welcome'); 
                },
              },
            ]
          );
          break;

        case PAYWALL_RESULT.RESTORED:
          console.log('✅ Paywall: Purchases restored!');
          Alert.alert(
            '✅ Purchases Restored',
            'Your subscription has been restored successfully.',
            [
              {
                text: 'Continue',
                onPress: () => {
                  checkSubscriptionStatus();
                  router.replace('/onboarding/welcome');
                },
              },
            ]
          );
          break;

        case PAYWALL_RESULT.CANCELLED:
          console.log('❌ Paywall: User cancelled');
          break;

        case PAYWALL_RESULT.NOT_PRESENTED:
          console.log('⚠️ Paywall: Could not be presented');
          Alert.alert(
            'Unable to Load Paywall',
            'Please check your internet connection and try again.',
            [{ text: 'OK' }]
          );
          break;

        case PAYWALL_RESULT.ERROR:
          console.log('❌ Paywall: Error occurred');
          Alert.alert(
            'An Error Occurred',
            'There was a problem loading the paywall. Please try again.',
            [{ text: 'OK' }]
          );
          break;
      }
    } catch (error) {
      console.error('❌ Paywall: Error presenting paywall:', error);
      Alert.alert(
        'Error',
        'Failed to present paywall. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsPresenting(false);
    }
  };

  // Handle restore purchases
  const handleRestorePurchases = async () => {
    try {
      setIsRestoring(true);
      console.log('🔄 Paywall: Restoring purchases...');

      const hasPremium = await restorePurchases();

      if (hasPremium) {
        Alert.alert(
          '✅ Restored Successfully',
          'Your subscription has been restored!',
          [
            {
              text: 'Continue',
              onPress: () => router.replace('/onboarding/welcome'),
            },
          ]
        );
      } else {
        Alert.alert(
          'No Subscription Found',
          'We couldn\'t find any active subscriptions associated with your account.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('❌ Paywall: Error restoring purchases:', error);
      Alert.alert(
        'Restore Failed',
        'Unable to restore purchases. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsRestoring(false);
    }
  };

  // Handle continue to free version
  const handleContinueFree = () => {
    Alert.alert(
      'Continue with Free Version?',
      'You can upgrade to Premium anytime from the settings.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Continue Free',
          onPress: () => router.replace('/onboarding/welcome'),
        },
      ]
    );
  };

  // Show loading state while initializing
  if (isLoading || !isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading subscription options...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🔥 CaloriTrack</Text>
          <Text style={styles.tagline}>Premium</Text>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Unlock Your Full Potential</Text>
          <Text style={styles.heroSubtitle}>
            Get access to all premium features and achieve your health goals faster
          </Text>
        </View>

        {/* Features List */}
        <View style={styles.featuresContainer}>
          <FeatureItem
            icon="✨"
            title="AI-Powered Analysis"
            description="Advanced food recognition and nutritional breakdown"
          />
          <FeatureItem
            icon="📊"
            title="Detailed Analytics"
            description="Comprehensive insights and progress tracking"
          />
          <FeatureItem
            icon="🎯"
            title="Personalized Plans"
            description="Custom meal plans based on your goals and preferences"
          />
          <FeatureItem
            icon="🏆"
            title="Advanced Features"
            description="Unlock recipe suggestions, meal planning, and more"
          />
          <FeatureItem
            icon="💪"
            title="Priority Support"
            description="Get help when you need it with premium support"
          />
          <FeatureItem
            icon="🔒"
            title="Ad-Free Experience"
            description="Enjoy CaloriTrack without any interruptions"
          />
        </View>

        {/* Pricing Info */}
        <View style={styles.pricingInfo}>
          <Text style={styles.pricingText}>
            Choose the plan that works best for you
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.footer}>
        <Button
          title={isPresenting ? "Loading..." : "View Premium Plans"}
          onPress={handleShowPaywall}
          fullWidth
          disabled={isPresenting || isRestoring || !currentOffering}
          style={styles.primaryButton}
        />

        <Pressable
          onPress={handleRestorePurchases}
          disabled={isRestoring || isPresenting}
          style={styles.restoreButton}
        >
          <Text style={styles.restoreText}>
            {isRestoring ? 'Restoring...' : 'Restore Purchases'}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleContinueFree}
          disabled={isPresenting || isRestoring}
          style={styles.skipButton}
        >
          <Text style={styles.skipText}>Continue with Free Version</Text>
        </Pressable>

        <Text style={styles.termsText}>
          By subscribing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
}

// Feature Item Component
interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIconContainer}>
      <Text style={styles.featureIcon}>{icon}</Text>
    </View>
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING[4],
    fontSize: TYPOGRAPHY.fontSizes.base,
    color: COLORS.textSecondary,
    fontFamily: 'Inter',
  },
  scrollContent: {
    paddingBottom: SPACING[8],
  },
  header: {
    alignItems: 'center',
    paddingTop: SPACING[6],
    paddingBottom: SPACING[4],
  },
  logo: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: SPACING[2],
  },
  tagline: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: '600',
    color: COLORS.primary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  heroSection: {
    paddingHorizontal: SPACING[6],
    paddingVertical: SPACING[8],
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: TYPOGRAPHY.fontSizes['3xl'],
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING[3],
    lineHeight: 36,
  },
  heroSubtitle: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: '90%',
  },
  featuresContainer: {
    paddingHorizontal: SPACING[5],
    gap: SPACING[4],
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    padding: SPACING[4],
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING[3],
  },
  featureIcon: {
    fontSize: 24,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING[1],
  },
  featureDescription: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  pricingInfo: {
    paddingHorizontal: SPACING[6],
    paddingVertical: SPACING[6],
    alignItems: 'center',
  },
  pricingText: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: SPACING[6],
    paddingBottom: SPACING[6],
    paddingTop: SPACING[4],
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  primaryButton: {
    marginBottom: SPACING[3],
  },
  restoreButton: {
    paddingVertical: SPACING[3],
    alignItems: 'center',
  },
  restoreText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: SPACING[3],
    alignItems: 'center',
    marginTop: SPACING[2],
  },
  skipText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.textTertiary,
    fontWeight: '500',
  },
  termsText: {
    fontSize: TYPOGRAPHY.fontSizes.xs,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginTop: SPACING[4],
    lineHeight: 16,
  },
});


