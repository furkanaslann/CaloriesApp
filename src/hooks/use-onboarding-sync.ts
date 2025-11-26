/**
 * CaloriTrack - Onboarding Sync Hook
 * Sync onboarding context data with user context (Firestore)
 */

import { useEffect, useCallback, useRef } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useOnboarding } from '@/context/onboarding-context';
import { useUser } from '@/context/user-context';
import { FIREBASE_CONFIG } from '@/constants/firebase';

export const useOnboardingSync = () => {
  const {
    profile,
    goals,
    activity,
    diet,
    preferences,
    commitment,
    calculatedValues,
    isCompleted,
    completeOnboarding: completeOnboardingLocal,
  } = useOnboarding();

  const {
    updateUserProfile,
    updateGoals,
    updateActivity,
    updateDiet,
    updatePreferences,
    updateCommitment,
    completeOnboarding: completeOnboardingInFirestore,
    userData,
    user,
    isLoading,
  } = useUser();

  // Refs to track previous values and prevent infinite loops
  const prevProfileRef = useRef(profile);
  const prevGoalsRef = useRef(goals);
  const prevActivityRef = useRef(activity);
  const prevDietRef = useRef(diet);
  const prevPreferencesRef = useRef(preferences);
  const prevCommitmentRef = useRef(commitment);
  const prevCalculatedValuesRef = useRef(calculatedValues);

  // Debounce timeout ref
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to handle debounced sync
  const debouncedSync = useCallback((fn: () => Promise<void>, delay: number = 1000) => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    syncTimeoutRef.current = setTimeout(fn, delay);
  }, []);

  // Sync profile data to Firestore (only if it changed)
  useEffect(() => {
    if (user && !isLoading && Object.keys(profile).length > 0 && JSON.stringify(profile) !== JSON.stringify(prevProfileRef.current)) {
      debouncedSync(() => updateUserProfile(profile));
      prevProfileRef.current = profile;
    }
  }, [profile, user, isLoading, updateUserProfile, debouncedSync]);

  // Sync goals data to Firestore (only if it changed)
  useEffect(() => {
    if (user && !isLoading && Object.keys(goals).length > 0 && JSON.stringify(goals) !== JSON.stringify(prevGoalsRef.current)) {
      debouncedSync(() => updateGoals(goals));
      prevGoalsRef.current = goals;
    }
  }, [goals, user, isLoading, updateGoals, debouncedSync]);

  // Sync activity data to Firestore (only if it changed)
  useEffect(() => {
    if (user && !isLoading && Object.keys(activity).length > 0 && JSON.stringify(activity) !== JSON.stringify(prevActivityRef.current)) {
      debouncedSync(() => updateActivity(activity));
      prevActivityRef.current = activity;
    }
  }, [activity, user, isLoading, updateActivity, debouncedSync]);

  // Sync diet data to Firestore (only if it changed)
  useEffect(() => {
    if (user && !isLoading && Object.keys(diet).length > 0 && JSON.stringify(diet) !== JSON.stringify(prevDietRef.current)) {
      debouncedSync(() => updateDiet(diet));
      prevDietRef.current = diet;
    }
  }, [diet, user, isLoading, updateDiet, debouncedSync]);

  // Sync preferences data to Firestore (only if it changed)
  useEffect(() => {
    if (user && !isLoading && Object.keys(preferences).length > 0 && JSON.stringify(preferences) !== JSON.stringify(prevPreferencesRef.current)) {
      debouncedSync(() => updatePreferences(preferences));
      prevPreferencesRef.current = preferences;
    }
  }, [preferences, user, isLoading, updatePreferences, debouncedSync]);

  // Sync commitment data to Firestore (only if it changed and no existing commitment)
  useEffect(() => {
    if (user && !isLoading && Object.keys(commitment).length > 0 && !userData?.commitment && JSON.stringify(commitment) !== JSON.stringify(prevCommitmentRef.current)) {
      debouncedSync(() => updateCommitment(commitment));
      prevCommitmentRef.current = commitment;
    }
  }, [commitment, user, isLoading, userData?.commitment, updateCommitment, debouncedSync]);

  // Sync calculated values to Firestore (only if meaningful values changed and only once)
  useEffect(() => {
    if (user && !isLoading && calculatedValues && (calculatedValues.bmr > 0 || calculatedValues.tdee > 0)) {
      // Only sync if the values actually changed in a meaningful way
      const prev = prevCalculatedValuesRef.current;
      const hasSignificantChange = !prev ||
        Math.abs((prev.bmr || 0) - (calculatedValues.bmr || 0)) > 10 ||
        Math.abs((prev.tdee || 0) - (calculatedValues.tdee || 0)) > 10 ||
        Math.abs((prev.dailyCalorieGoal || 0) - (calculatedValues.dailyCalorieGoal || 0)) > 50;

      if (hasSignificantChange) {
        const updateCalculatedValues = async () => {
          try {
            await firestore()
              .collection(FIREBASE_CONFIG.collections.users)
              .doc(user.uid)
              .update({
                calculatedValues,
                updatedAt: firestore.FieldValue.serverTimestamp(),
              });
            console.log('Calculated values updated in Firestore:', calculatedValues);
          } catch (error) {
            console.error('Error updating calculated values:', error);
          }
        };

        // Use a longer debounce for calculated values (2 seconds)
        debouncedSync(updateCalculatedValues, 2000);
        prevCalculatedValuesRef.current = calculatedValues;
      }
    }
  }, [calculatedValues, user, isLoading, debouncedSync]);

  // Complete onboarding in both contexts
  const completeOnboarding = useCallback(async () => {
    try {
      console.log('Starting onboarding completion...');
      // Complete in local context
      completeOnboardingLocal();
      console.log('Local onboarding completed');

      // Complete in Firestore
      if (user) {
        await completeOnboardingInFirestore();
        console.log('Firestore onboarding completed');

        // Ensure calculated values are saved to Firestore one final time
        if (calculatedValues && (calculatedValues.bmr > 0 || calculatedValues.tdee > 0)) {
          try {
            await firestore()
              .collection(FIREBASE_CONFIG.collections.users)
              .doc(user.uid)
              .update({
                calculatedValues,
                updatedAt: firestore.FieldValue.serverTimestamp(),
              });
            console.log('Final calculated values saved to Firestore:', calculatedValues);
          } catch (error) {
            console.error('Error saving final calculated values to Firestore:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  }, [completeOnboardingLocal, completeOnboardingInFirestore, user, calculatedValues]);

  // Check if all required data is filled for onboarding completion
  const isReadyToComplete = useCallback(() => {
    const requiredProfileFields = ['name', 'lastName', 'age', 'gender', 'height', 'currentWeight'];
    const requiredGoalsFields = ['primaryGoal'];

    const profileComplete = requiredProfileFields.every(field =>
      profile[field as keyof typeof profile] !== undefined &&
      profile[field as keyof typeof profile] !== ''
    );

    const goalsComplete = requiredGoalsFields.every(field =>
      goals[field as keyof typeof goals] !== undefined
    );

    return profileComplete && goalsComplete;
  }, [profile, goals]);

  return {
    completeOnboarding,
    isReadyToComplete,
    isSyncing: isLoading,
  };
};