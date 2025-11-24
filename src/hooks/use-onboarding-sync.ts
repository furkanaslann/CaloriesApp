/**
 * CaloriTrack - Onboarding Sync Hook
 * Sync onboarding context data with user context (Firestore)
 */

import { useEffect, useCallback } from 'react';
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

  // Sync profile data to Firestore
  useEffect(() => {
    if (user && !isLoading && Object.keys(profile).length > 0) {
      updateUserProfile(profile);
    }
  }, [profile, user, isLoading, updateUserProfile]);

  // Sync goals data to Firestore
  useEffect(() => {
    if (user && !isLoading && Object.keys(goals).length > 0) {
      updateGoals(goals);
    }
  }, [goals, user, isLoading, updateGoals]);

  // Sync activity data to Firestore
  useEffect(() => {
    if (user && !isLoading && Object.keys(activity).length > 0) {
      updateActivity(activity);
    }
  }, [activity, user, isLoading, updateActivity]);

  // Sync diet data to Firestore
  useEffect(() => {
    if (user && !isLoading && Object.keys(diet).length > 0) {
      updateDiet(diet);
    }
  }, [diet, user, isLoading, updateDiet]);

  // Sync preferences data to Firestore
  useEffect(() => {
    if (user && !isLoading && Object.keys(preferences).length > 0) {
      updatePreferences(preferences);
    }
  }, [preferences, user, isLoading, updatePreferences]);

  // Sync commitment data to Firestore - but only from onboarding context
  // Skip if we already have commitment data in user context (to avoid race conditions)
  useEffect(() => {
    if (user && !isLoading && Object.keys(commitment).length > 0 && !userData?.commitment) {
      updateCommitment(commitment);
    }
  }, [commitment, user, isLoading, userData?.commitment, updateCommitment]);

  // Sync calculated values to Firestore
  useEffect(() => {
    if (user && !isLoading && calculatedValues && (calculatedValues.bmr > 0 || calculatedValues.tdee > 0)) {
      // Update calculated values in Firestore when they change
      const updateCalculatedValues = async () => {
        try {
          await firestore()
            .collection(FIREBASE_CONFIG.collections.users)
            .doc(user.uid)
            .update({
              calculatedValues,
              updatedAt: firestore.FieldValue.serverTimestamp(),
            });
        } catch (error) {
          console.error('Error updating calculated values:', error);
        }
      };

      updateCalculatedValues();
    }
  }, [calculatedValues, user, isLoading]);

  // Complete onboarding in both contexts
  const completeOnboarding = useCallback(async () => {
    try {
      // Complete in local context
      completeOnboardingLocal();

      // Complete in Firestore
      if (user) {
        await completeOnboardingInFirestore();

        // Ensure calculated values are saved to Firestore
        if (calculatedValues && (calculatedValues.bmr > 0 || calculatedValues.tdee > 0)) {
          try {
            await firestore()
              .collection(FIREBASE_CONFIG.collections.users)
              .doc(user.uid)
              .update({
                calculatedValues,
                updatedAt: firestore.FieldValue.serverTimestamp(),
              });
            console.log('Calculated values saved to Firestore:', calculatedValues);
          } catch (error) {
            console.error('Error saving calculated values to Firestore:', error);
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