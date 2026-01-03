/**
 * CaloriTrack - Premium Gate Component
 * 
 * Use this component to wrap premium features and show upgrade prompts
 * for non-premium users
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useRevenueCat } from '@/context/revenuecat-context';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import Button from '@/components/ui/button';

interface PremiumGateProps {
  children: React.ReactNode;
  featureName?: string;
  featureDescription?: string;
  showUpgradeButton?: boolean;
  fallback?: React.ReactNode;
}

/**
 * PremiumGate Component
 * 
 * Wraps premium features and shows an upgrade prompt for free users
 * 
 * @example
 * ```tsx
 * <PremiumGate featureName="Advanced Analytics">
 *   <AdvancedAnalyticsScreen />
 * </PremiumGate>
 * ```
 */
export const PremiumGate: React.FC<PremiumGateProps> = ({
  children,
  featureName = 'Premium Feature',
  featureDescription = 'Upgrade to Premium to unlock this feature',
  showUpgradeButton = true,
  fallback,
}) => {
  const { isPremium, isLoading } = useRevenueCat();
  const router = useRouter();

  // Show loading state while checking subscription
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // If user has premium, show the feature
  if (isPremium) {
    return <>{children}</>;
  }

  // If user doesn't have premium, show upgrade prompt or fallback
  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🔒</Text>
        </View>
        
        <Text style={styles.title}>{featureName}</Text>
        <Text style={styles.description}>{featureDescription}</Text>

        {showUpgradeButton && (
          <Button
            title="Upgrade to Premium"
            onPress={() => router.push('/paywall')}
            style={styles.button}
          />
        )}
      </View>
    </View>
  );
};

/**
 * Simple inline premium badge
 * 
 * @example
 * ```tsx
 * <Text>Advanced Features <PremiumBadge /></Text>
 * ```
 */
export const PremiumBadge: React.FC<{ size?: 'small' | 'medium' | 'large' }> = ({ 
  size = 'medium' 
}) => {
  const sizes = {
    small: { fontSize: 10, paddingHorizontal: 6, paddingVertical: 2 },
    medium: { fontSize: 12, paddingHorizontal: 8, paddingVertical: 3 },
    large: { fontSize: 14, paddingHorizontal: 10, paddingVertical: 4 },
  };

  return (
    <View style={[styles.badge, sizes[size]]}>
      <Text style={[styles.badgeText, { fontSize: sizes[size].fontSize }]}>
        ⭐ PREMIUM
      </Text>
    </View>
  );
};

/**
 * Hook to check if a feature is available based on premium status
 * 
 * @example
 * ```tsx
 * const canAccessFeature = usePremiumFeature();
 * 
 * if (!canAccessFeature) {
 *   return <UpgradePrompt />;
 * }
 * ```
 */
export const usePremiumFeature = () => {
  const { isPremium, isLoading } = useRevenueCat();
  return { isPremium, isLoading };
};

/**
 * Premium feature card with custom content
 * 
 * @example
 * ```tsx
 * <PremiumFeatureCard
 *   title="AI Meal Planning"
 *   description="Let AI create your perfect meal plan"
 *   onUpgrade={() => router.push('/paywall')}
 * />
 * ```
 */
interface PremiumFeatureCardProps {
  title: string;
  description: string;
  icon?: string;
  onUpgrade?: () => void;
}

export const PremiumFeatureCard: React.FC<PremiumFeatureCardProps> = ({
  title,
  description,
  icon = '⭐',
  onUpgrade,
}) => {
  const router = useRouter();

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      router.push('/paywall');
    }
  };

  return (
    <Pressable style={styles.featureCard} onPress={handleUpgrade}>
      <View style={styles.featureCardContent}>
        <Text style={styles.featureIcon}>{icon}</Text>
        <View style={styles.featureTextContainer}>
          <View style={styles.featureTitleRow}>
            <Text style={styles.featureTitle}>{title}</Text>
            <PremiumBadge size="small" />
          </View>
          <Text style={styles.featureDescription}>{description}</Text>
        </View>
      </View>
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING[6],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING[8],
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
    ...SHADOWS.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING[4],
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSizes['2xl'],
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING[2],
  },
  description: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING[6],
    lineHeight: 24,
  },
  button: {
    width: '100%',
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING[4],
    marginVertical: SPACING[2],
    ...SHADOWS.sm,
  },
  featureCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: SPACING[3],
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING[2],
    marginBottom: SPACING[1],
  },
  featureTitle: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  featureDescription: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  arrow: {
    fontSize: 24,
    color: COLORS.textTertiary,
    marginLeft: SPACING[2],
  },
});

export default PremiumGate;


