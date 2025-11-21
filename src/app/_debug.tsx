/**
 * CaloriTrack - Debug Screen
 * For testing Firebase authentication and onboarding flow
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useUser } from '@/context/user-context';
import { useOnboarding } from '@/context/onboarding-context';

export default function DebugScreen() {
  const {
    user,
    userData,
    isLoading,
    isAuthenticated,
    isOnboardingCompleted,
    createAnonymousUser,
    updateUserProfile,
    completeOnboarding
  } = useUser();

  const {
    profile,
    goals,
    activity,
    isCompleted: onboardingLocalCompleted
  } = useOnboarding();

  const handleCreateAnonymousUser = async () => {
    try {
      await createAnonymousUser();
    } catch (error) {
      console.error('Error creating anonymous user:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateUserProfile({
        name: 'Test',
        lastName: 'User',
        age: 25,
        gender: 'male' as const,
        height: 180,
        currentWeight: 75
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCompleteOnboarding = async () => {
    try {
      await completeOnboarding();
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔍 CaloriTrack Debug</Text>

      {/* User Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 User Status</Text>
        <Text>Is Loading: {isLoading ? 'Yes' : 'No'}</Text>
        <Text>Is Authenticated: {isAuthenticated ? 'Yes' : 'No'}</Text>
        <Text>User ID: {user?.uid || 'None'}</Text>
        <Text>Is Anonymous: {user?.isAnonymous ? 'Yes' : 'No'}</Text>
      </View>

      {/* Onboarding Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📱 Onboarding Status</Text>
        <Text>Local Completed: {onboardingLocalCompleted ? 'Yes' : 'No'}</Text>
        <Text>Firestore Completed: {isOnboardingCompleted ? 'Yes' : 'No'}</Text>
      </View>

      {/* User Data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 User Data (Firestore)</Text>
        <Text>UID: {userData?.uid || 'None'}</Text>
        <Text>Name: {userData?.profile?.name || userData?.commitment?.firstName || 'None'}</Text>
        <Text>Email: {userData?.commitment?.email || 'None'}</Text>
        <Text>Primary Goal: {userData?.goals?.primaryGoal || 'None'}</Text>
        <Text>Daily Calories: {userData?.calculatedValues?.dailyCalorieGoal || 'None'}</Text>
      </View>

      {/* Local Onboarding Data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📝 Local Onboarding Data</Text>
        <Text>Name: {profile?.name || 'None'}</Text>
        <Text>Last Name: {profile?.lastName || 'None'}</Text>
        <Text>Age: {profile?.age || 'None'}</Text>
        <Text>Primary Goal: {goals?.primaryGoal || 'None'}</Text>
        <Text>Activity Level: {activity?.level || 'None'}</Text>
      </View>

      {/* Test Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🧪 Test Actions</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateAnonymousUser}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Loading...' : 'Create Anonymous User'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleUpdateProfile}
          disabled={!isAuthenticated}
        >
          <Text style={styles.buttonText}>
            Update Test Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleCompleteOnboarding}
          disabled={!isAuthenticated}
        >
          <Text style={styles.buttonText}>
            Complete Onboarding
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  button: {
    backgroundColor: '#7C3AED',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});