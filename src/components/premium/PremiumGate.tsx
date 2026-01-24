/**
 * PremiumGate Component
 *
 * Wraps premium features and shows upgrade prompt for non-premium users
 */

import React, { ReactNode } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { LightTheme } from '@/constants';
import { useRevenueCat } from '@/context/revenuecat-context';
import Button from '../ui/button';

interface PremiumGateProps {
  children: ReactNode;
  featureName?: string;
  featureDescription?: string;
  fallback?: ReactNode;
}

export const PremiumGate: React.FC<PremiumGateProps> = ({
  children,
  featureName = 'Premium Feature',
  featureDescription = 'Upgrade to Premium to access this feature',
  fallback,
}) => {
  const { isPremium, isLoading } = useRevenueCat();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={LightTheme.colors.primary} />
      </View>
    );
  }

  if (isPremium) {
    return <>{children}</>;
  }

  // Custom fallback provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default premium lock UI
  const handleUpgrade = () => {
    Alert.alert(
      'Premium Özellik',
      `"${featureName}" özelliğine erişmek için Premium üye olun.`,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Yükselt', onPress: () => router.push('/paywall') },
      ]
    );
  };

  return (
    <View style={styles.lockContainer}>
      <View style={styles.lockContent}>
        <Text style={styles.lockIcon}>🔒</Text>
        <Text style={styles.lockTitle}>{featureName}</Text>
        <Text style={styles.lockDescription}>{featureDescription}</Text>
        <Button
          title="Premium'a Yükselt"
          onPress={handleUpgrade}
          fullWidth
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: LightTheme.spacing.xl,
  },
  lockContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: LightTheme.spacing.xl,
    backgroundColor: LightTheme.semanticColors.background.secondary,
    borderRadius: LightTheme.borderRadius.lg,
    margin: LightTheme.spacing.md,
  },
  lockContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  lockIcon: {
    fontSize: 48,
    marginBottom: LightTheme.spacing.lg,
  },
  lockTitle: {
    fontSize: LightTheme.typography.xl.fontSize,
    fontWeight: '600',
    color: LightTheme.semanticColors.text.primary,
    marginBottom: LightTheme.spacing.sm,
    textAlign: 'center',
  },
  lockDescription: {
    fontSize: LightTheme.typography.base.fontSize,
    color: LightTheme.semanticColors.text.secondary,
    textAlign: 'center',
    marginBottom: LightTheme.spacing.xl,
    lineHeight: LightTheme.typography.base.lineHeight,
  },
});
