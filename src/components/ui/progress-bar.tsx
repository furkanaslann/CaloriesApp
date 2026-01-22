/**
 * CaloriTrack - Progress Bar Component
 * Minimal. Cool. Aesthetic.
 */

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';

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
      {showBackButton && onBack && (
        <TouchableOpacity onPress={onBack} style={styles.backButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-back-sharp" size={28} color={COLORS.textPrimary} />
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
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: SPACING[3],
    marginTop: SPACING[4],
    marginBottom: SPACING[6],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING[4],
  },
  backButton: {
    alignSelf: 'flex-start',
    height: 72,
    fontSize: TYPOGRAPHY.fontSizes['sm'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    width: '100%',
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
