/**
 * RecipeLimitPrompt Component
 *
 * Minimal. Cool. Aesthetic.
 *
 * Displayed when free users reach their monthly recipe view limit.
 * Encourages upgrade to Premium for unlimited recipe access.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// =============================================================================
// Props
// =============================================================================

export interface RecipeLimitPromptProps {
  /** Whether modal is visible */
  visible: boolean;
  /** Current month's view count */
  currentCount: number;
  /** Monthly limit */
  limit: number;
  /** Callback when upgrade button is pressed */
  onUpgrade?: () => void;
  /** Callback when modal is closed */
  onClose?: () => void;
  /** Custom title */
  title?: string;
  /** Custom message */
  message?: string;
}

// =============================================================================
// Component
// =============================================================================

export const RecipeLimitPrompt: React.FC<RecipeLimitPromptProps> = ({
  visible,
  currentCount,
  limit,
  onUpgrade,
  onClose,
  title,
  message,
}) => {
  const router = useRouter();

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      router.push('/paywall' as any);
    }
  };

  const remainingDays = getRemainingDaysInMonth();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Close Button */}
          {onClose && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#64748B" />
            </TouchableOpacity>
          )}

          {/* Hero Image/Icon */}
          <LinearGradient
            colors={['#7C3AED', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <Ionicons name="lock-closed" size={48} color="#FFFFFF" />
          </LinearGradient>

          {/* Title */}
          <Text style={styles.title}>
            {title || 'Recipe Limit Reached'}
          </Text>

          {/* Message */}
          <Text style={styles.message}>
            {message ||
              `You've viewed ${currentCount} of ${limit} recipes available this month.`}
          </Text>

          {/* Reset Info */}
          <View style={styles.resetInfo}>
            <Ionicons name="calendar-outline" size={18} color="#64748B" />
            <Text style={styles.resetText}>
              Resets in {remainingDays} day{remainingDays !== 1 ? 's' : ''}
            </Text>
          </View>

          {/* Benefits List */}
          <View style={styles.benefits}>
            <BenefitItem icon="infinite-outline" text="Unlimited recipe access" />
            <BenefitItem icon="sparkles-outline" text="AI-powered meal suggestions" />
            <BenefitItem icon="restaurant-outline" text="Create custom recipes" />
            <BenefitItem icon="cart-outline" text="Auto-generate grocery lists" />
          </View>

          {/* Upgrade Button */}
          <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
            <LinearGradient
              colors={['#7C3AED', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.upgradeGradient}
            >
              <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Pricing Info */}
          <Text style={styles.pricingText}>
            Starting at $4.99/month • Cancel anytime
          </Text>
        </View>
      </View>
    </Modal>
  );
};

// =============================================================================
// Sub-Components
// =============================================================================

interface BenefitItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}

const BenefitItem: React.FC<BenefitItemProps> = ({ icon, text }) => (
  <View style={styles.benefitItem}>
    <View style={styles.benefitIcon}>
      <Ionicons name={icon} size={20} color="#7C3AED" />
    </View>
    <Text style={styles.benefitText}>{text}</Text>
  </View>
);

// =============================================================================
// Helper Functions
// =============================================================================

function getRemainingDaysInMonth(): number {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return lastDay.getDate() - now.getDate();
}

// =============================================================================
// Styles
// =============================================================================

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  resetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 24,
  },
  resetText: {
    fontSize: 14,
    color: '#64748B',
  },
  benefits: {
    width: '100%',
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  benefitIcon: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitText: {
    flex: 1,
    fontSize: 15,
    color: '#334155',
  },
  upgradeButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  upgradeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
  },
  upgradeButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pricingText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },
});

export default RecipeLimitPrompt;
