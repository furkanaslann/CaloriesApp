/**
 * CaloriTrack - Progress Bar Component
 * Minimal. Cool. Aesthetic.
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING, TYPOGRAPHY } from '@/constants/theme';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  color?: string;
  backgroundColor?: string;
  height?: number;
  animated?: boolean;
  onBack?: () => void;
  showBackButton?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  color = COLORS.primary,
  backgroundColor = COLORS.border,
  height = 4,
  animated = true,
  onBack,
  showBackButton = true,
}) => {
  const progress = (currentStep / totalSteps) * 100;
  const animatedWidth = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: progress,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(progress);
    }
  }, [progress, animated]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {showBackButton && onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        )}
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.track,
              {
                backgroundColor,
                height,
                borderRadius: height / 2,
              },
            ]}
          >
            <Animated.View
              style={[
                styles.fill,
                {
                  backgroundColor: color,
                  height,
                  borderRadius: height / 2,
                  width: animatedWidth.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: SPACING[6],
    paddingTop: SPACING[4],
    marginTop: SPACING[8],
    marginBottom: SPACING[6],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING[3],
  },
  backButton: {
    width: '10%',
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: TYPOGRAPHY.fontSizes['2xl'],
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.textPrimary,
    lineHeight: 28,
    textAlignVertical: 'center',
  },
  progressContainer: {
    width: '90%',
  },
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});

export default ProgressBar;
