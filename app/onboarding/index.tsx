import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/contexts/onboarding-context';

export default function OnboardingIndex() {
  const router = useRouter();
  const { isCompleted, loadProgress } = useOnboarding();

  useEffect(() => {
    // Check onboarding completion status
    const checkOnboardingStatus = async () => {
      await loadProgress();

      if (isCompleted) {
        // If onboarding is completed, redirect to main app
        router.replace('/(tabs)');
      } else {
        // If not completed, start onboarding
        router.replace('/onboarding/welcome');
      }
    };

    checkOnboardingStatus();
  }, [isCompleted, loadProgress, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6366F1" />
      <Text style={styles.loadingText}>Yükleniyor...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingTop: '5%',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter',
  },
});