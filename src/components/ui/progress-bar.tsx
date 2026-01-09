/**
 * CaloriTrack - Progress Bar Component
 * Minimal. Cool. Aesthetic.
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING } from '@/constants/theme';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  color?: string;
  backgroundColor?: string;
  height?: number;
  animated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  color = COLORS.primary,
  backgroundColor = COLORS.border,
  height = 4,
  animated = true,
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
