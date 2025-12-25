/**
 * Firebase Utility Functions
 *
 * This file contains helper functions for Firebase services using react-native-firebase.
 * Currently configured for Authentication and Firestore.
 *
 * Note: react-native-firebase automatically initializes Firebase using the
 * GoogleService-Info.plist (iOS) and google-services.json (Android) files.
 * No manual initialization is required.
 */

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import { FIREBASE_CONFIG } from '@/constants/firebase';

// Firebase Emulator Configuration for Development
const IS_DEV = __DEV__;
const EMULATOR_CONFIG = {
  host: '127.0.0.1', // For Android emulator
  ports: {
    auth: 9099,
    firestore: 8080,
    storage: 9199,
    functions: 5001,
  },
};

// Initialize Firebase Emulators in Development
// Note: Firebase is automatically initialized by react-native-firebase
// We'll initialize emulators in a separate function that can be called after Firebase is ready
let emulatorsInitialized = false;

export const initializeFirebaseEmulators = async () => {
  if (IS_DEV && !emulatorsInitialized) {
    try {
      console.log('🔥 Initializing Firebase Emulators...');

      // Connect to Auth Emulator - requires full URL
      const authUrl = `http://${EMULATOR_CONFIG.host}:${EMULATOR_CONFIG.ports.auth}`;
      console.log('Connecting to Auth Emulator at:', authUrl);
      auth().useEmulator(authUrl);

      // Note: Authentication state is persisted automatically by React Native Firebase.
      // To clear all users and start fresh, use: firebase emulators:start --clear-data
      // Or manually sign out users if needed:
      // const currentUser = auth().currentUser;
      // if (currentUser) {
      //   await auth().signOut();
      //   console.log('🔓 Development: Signed out existing user for clean session');
      // }

      // Connect to Firestore Emulator
      console.log('Connecting to Firestore Emulator at:', `${EMULATOR_CONFIG.host}:${EMULATOR_CONFIG.ports.firestore}`);
      firestore().useEmulator(EMULATOR_CONFIG.host, EMULATOR_CONFIG.ports.firestore);

      // NOT: Storage Emulator'üne bağlanmıyoruz
      // Storage için özel bir solution gerekiyor
      console.log('⚠️  Storage Emulator disabled - Using production Firebase Storage');
      console.log('⚠️  Need to handle Auth token sync between emulator and production');

      // Storage emulator'ü kullanmadığımızı belirt
      console.log('📦 Storage will use: gs://calories-app-185b6.firebasestorage.app');

      console.log('✅ Firebase configuration: Auth: Emulator, Firestore: Emulator, Functions: Emulator, Storage: Production');
      emulatorsInitialized = true;
      return true; // Success
    } catch (error) {
      console.error('❌ Firebase Emulator connection failed:', error);
      emulatorsInitialized = false;
      return false; // Failed
    }
  }
  return emulatorsInitialized;
};

// ============================================================================
// AUTHENTICATION FUNCTIONS
// ============================================================================

/**
 * Sign up a new user with email and password
 */
export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Sign up error:', error);
    throw new Error(error.message);
  }
};

/**
 * Sign in an existing user with email and password
 */
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw new Error(error.message);
  }
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  try {
    await auth().signOut();
  } catch (error: any) {
    console.error('Sign out error:', error);
    throw new Error(error.message);
  }
};

/**
 * Get the currently signed-in user
 */
export const getCurrentUser = () => {
  return auth().currentUser;
};

/**
 * Listen to authentication state changes
 * Returns an unsubscribe function
 */
export const onAuthStateChanged = (callback: (user: any) => void) => {
  return auth().onAuthStateChanged(callback);
};

/**
 * Send a password reset email
 */
export const resetPassword = async (email: string) => {
  try {
    await auth().sendPasswordResetEmail(email);
  } catch (error: any) {
    console.error('Password reset error:', error);
    throw new Error(error.message);
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (displayName: string, photoURL?: string) => {
  try {
    const user = auth().currentUser;
    if (!user) throw new Error('No user signed in');

    await user.updateProfile({
      displayName,
      photoURL,
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    throw new Error(error.message);
  }
};

// ============================================================================
// FIRESTORE FUNCTIONS - USER PROFILE
// ============================================================================

/**
 * Create or update user profile in Firestore
 */
export const saveUserProfile = async (userId: string, userData: {
  name: string;
  email: string;
  dailyCalorieGoal?: number;
  weight?: number;
  height?: number;
  age?: number;
  gender?: string;
}) => {
  try {
    await firestore()
      .collection(FIREBASE_CONFIG.collections.users)
      .doc(userId)
      .set({
        ...userData,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
  } catch (error: any) {
    console.error('Error saving user profile:', error);
    throw new Error(error.message);
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (userId: string) => {
  try {
    const doc = await firestore()
      .collection(FIREBASE_CONFIG.collections.users)
      .doc(userId)
      .get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data(),
    };
  } catch (error: any) {
    console.error('Error getting user profile:', error);
    throw new Error(error.message);
  }
};

/**
 * Listen to user profile changes in real-time
 * Returns an unsubscribe function
 */
export const onUserProfileChanged = (userId: string, callback: (profile: any) => void) => {
  return firestore()
    .collection(FIREBASE_CONFIG.collections.users)
    .doc(userId)
    .onSnapshot(
      (doc) => {
        if (doc.exists) {
          callback({ id: doc.id, ...doc.data() });
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error('Error listening to user profile:', error);
      }
    );
};

// ============================================================================
// FIRESTORE FUNCTIONS - MEALS
// ============================================================================

/**
 * Add a meal entry to Firestore
 */
export const addMeal = async (userId: string, mealData: {
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  imageUrl?: string;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}) => {
  try {
    const docRef = await firestore()
      .collection(FIREBASE_CONFIG.collections.users)
      .doc(userId)
      .collection(FIREBASE_CONFIG.collections.meals)
      .add({
        ...mealData,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    return docRef.id;
  } catch (error: any) {
    console.error('Error adding meal:', error);
    throw new Error(error.message);
  }
};

/**
 * Get all meals for a user
 */
export const getUserMeals = async (userId: string, limit: number = 50) => {
  try {
    const snapshot = await firestore()
      .collection(FIREBASE_CONFIG.collections.users)
      .doc(userId)
      .collection(FIREBASE_CONFIG.collections.meals)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error: any) {
    console.error('Error getting meals:', error);
    throw new Error(error.message);
  }
};

/**
 * Get meals for a specific date
 */
export const getMealsByDate = async (userId: string, date: Date) => {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const snapshot = await firestore()
      .collection(FIREBASE_CONFIG.collections.users)
      .doc(userId)
      .collection(FIREBASE_CONFIG.collections.meals)
      .where('createdAt', '>=', firestore.Timestamp.fromDate(startOfDay))
      .where('createdAt', '<=', firestore.Timestamp.fromDate(endOfDay))
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error: any) {
    console.error('Error getting meals by date:', error);
    throw new Error(error.message);
  }
};

/**
 * Listen to meals in real-time for a user
 * Returns an unsubscribe function
 */
export const onMealsChanged = (userId: string, callback: (meals: any[]) => void, limit: number = 50) => {
  return firestore()
    .collection(FIREBASE_CONFIG.collections.users)
    .doc(userId)
    .collection(FIREBASE_CONFIG.collections.meals)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .onSnapshot(
      (snapshot) => {
        const meals = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(meals);
      },
      (error) => {
        console.error('Error listening to meals:', error);
      }
    );
};

/**
 * Update a meal entry
 */
export const updateMeal = async (userId: string, mealId: string, updates: any) => {
  try {
    await firestore()
      .collection(FIREBASE_CONFIG.collections.users)
      .doc(userId)
      .collection(FIREBASE_CONFIG.collections.meals)
      .doc(mealId)
      .update({
        ...updates,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
  } catch (error: any) {
    console.error('Error updating meal:', error);
    throw new Error(error.message);
  }
};

/**
 * Delete a meal entry
 */
export const deleteMeal = async (userId: string, mealId: string) => {
  try {
    await firestore()
      .collection(FIREBASE_CONFIG.collections.users)
      .doc(userId)
      .collection(FIREBASE_CONFIG.collections.meals)
      .doc(mealId)
      .delete();
  } catch (error: any) {
    console.error('Error deleting meal:', error);
    throw new Error(error.message);
  }
};

// ============================================================================
// STORAGE FUNCTIONS - IMAGE UPLOAD
// ============================================================================

/**
 * Upload an image to Firebase Storage
 */
export const uploadImage = async (
  userId: string,
  imageUri: string,
  imageName: string = `meal_${Date.now()}.jpg`
) => {
  try {
    // React Native Firebase v9+ formatı
    const storageReference = storage().ref(`users/${userId}/meals/${imageName}`);
    console.log('Storage ref created:', `users/${userId}/meals/${imageName}`);

    await storageReference.putFile(imageUri);
    console.log('File uploaded successfully');

    const downloadURL = await storageReference.getDownloadURL();
    console.log('Download URL obtained:', downloadURL);

    return downloadURL;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw new Error(error.message);
  }
};

/**
 * Delete an image from Firebase Storage
 */
export const deleteImage = async (imageUrl: string) => {
  try {
    const reference = storage().refFromURL(imageUrl);
    await reference.delete();
  } catch (error: any) {
    console.error('Error deleting image:', error);
    throw new Error(error.message);
  }
};

// ============================================================================
// EXAMPLE: COMPLETE WORKFLOW
// ============================================================================

/**
 * Upload image from URI to Firebase Storage
 */
export const uploadImageFromUri = async (
  userId: string,
  imageUri: string,
  imageName: string = `meal_${Date.now()}.jpg`
) => {
  try {
    // Doğrudan URI'den Storage'a yükle
    const reference = storage().ref(`users/${userId}/meals/${imageName}`);
    await reference.putFile(imageUri);
    const downloadURL = await reference.getDownloadURL();

    return downloadURL;
  } catch (error: any) {
    console.error('Error uploading image from URI:', error);
    throw new Error(error.message);
  }
};

/**
 * Example: Add a meal with image upload
 */
export const addMealWithImage = async (
  userId: string,
  mealData: {
    name: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  },
  imageUri?: string
) => {
  try {
    let imageUrl;

    // Upload image if provided
    if (imageUri) {
      imageUrl = await uploadImage(userId, imageUri);
    }

    // Add meal to Firestore
    const mealId = await addMeal(userId, {
      ...mealData,
      imageUrl,
    });

    return { mealId, imageUrl };
  } catch (error: any) {
    console.error('Error adding meal with image:', error);
    throw new Error(error.message);
  }
};

// ============================================================================
// FIRESTORE FUNCTIONS - ONBOARDING DATA
// ============================================================================

/**
 * Save complete onboarding data to Firestore
 * This function saves all onboarding information after user completes the flow
 */
// Helper function to filter out undefined and null values recursively
const filterUndefinedValues = (obj: any): any => {
  // Handle primitive values
  if (obj === null || obj === undefined) {
    return null;
  }

  // Handle Date objects
  if (obj instanceof Date) {
    return obj;
  }

  // Handle Firestore Timestamp objects
  if (typeof obj === 'object' && obj && obj._type === 'timestamp') {
    return obj; // Keep Firestore timestamps as-is
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    const filteredArray = obj
      .map(item => filterUndefinedValues(item))
      .filter(item => item !== null && item !== undefined);
    return filteredArray.length > 0 ? filteredArray : null;
  }

  // Handle objects
  const filtered: any = {};
  let hasValidValues = false;

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      // Skip undefined values
      if (value === undefined) {
        continue;
      }

      // Recursively filter nested objects
      if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
        if (value && value._type === 'timestamp') {
          // Keep Firestore timestamps
          filtered[key] = value;
          hasValidValues = true;
        } else {
          const filteredValue = filterUndefinedValues(value);
          if (filteredValue !== null && filteredValue !== undefined) {
            filtered[key] = filteredValue;
            hasValidValues = true;
          }
        }
      } else {
        // Include primitive values and Dates
        filtered[key] = value === null ? null : value;
        hasValidValues = true;
      }
    }
  }

  // Return null if object has no valid values
  return hasValidValues ? filtered : null;
};

export const saveOnboardingData = async (userId: string, onboardingData: any) => {
  try {
    //console.log('Original onboarding data:', JSON.stringify(onboardingData, null, 2));

    // Filter out any undefined values before sending to Firestore
    const filteredData = filterUndefinedValues(onboardingData);
    //console.log('Filtered onboarding data:', JSON.stringify(filteredData, null, 2));

    // If filtered data is null, create minimal structure
    if (filteredData === null) {
      console.warn('All data was filtered out, creating minimal structure');
      const minimalData = {
        onboardingCompleted: true,
        onboardingCompletedAt: firestore.FieldValue.serverTimestamp(),
        lastUpdated: firestore.FieldValue.serverTimestamp(),
        version: '1.0.0',
      };

      await firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(userId)
        .set(minimalData, { merge: true });

      console.log('Minimal onboarding data saved successfully for user:', userId);
      return;
    }

    // Build the Firestore document data
    const firestoreData: any = {
      // Metadata
      onboardingCompleted: true,
      onboardingCompletedAt: firestore.FieldValue.serverTimestamp(),
      lastUpdated: firestore.FieldValue.serverTimestamp(),
      version: '1.0.0',
    };

    // Directly use the filtered data as the main document
    const finalData = {
      ...firestoreData,
      ...filteredData,
    };

    // Remove any remaining undefined values
    const cleanedFinalData = filterUndefinedValues(finalData);

    // Save to Firestore
    await firestore()
      .collection(FIREBASE_CONFIG.collections.users)
      .doc(userId)
      .set(cleanedFinalData || firestoreData, { merge: true });

    console.log('Onboarding data saved successfully for user:', userId);
  } catch (error: any) {
    console.error('Error saving onboarding data:', error);
    throw new Error(`Failed to save onboarding data: ${error.message}`);
  }
};

/**
 * Get onboarding data from Firestore
 */
export const getOnboardingData = async (userId: string) => {
  try {
    const doc = await firestore()
      .collection(FIREBASE_CONFIG.collections.users)
      .doc(userId)
      .get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data();
    return {
      id: doc.id,
      profile: {
        name: data.name,
        lastName: data.lastName,
        age: data.age,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        height: data.height,
        currentWeight: data.currentWeight,
        profilePhoto: data.profilePhoto,
      },
      goals: data.goals,
      activity: data.activity,
      diet: data.diet,
      preferences: data.preferences,
      calculatedValues: data.calculatedValues,
      commitment: data.commitment,
      account: data.account,
      onboardingCompleted: data.onboardingCompleted || false,
      onboardingCompletedAt: data.onboardingCompletedAt,
      lastUpdated: data.lastUpdated,
      version: data.version,
    };
  } catch (error: any) {
    console.error('Error getting onboarding data:', error);
    throw new Error(`Failed to get onboarding data: ${error.message}`);
  }
};

/**
 * Update specific parts of onboarding data
 */
export const updateOnboardingData = async (
  userId: string,
  updates: Partial<{
    profile: any;
    goals: any;
    activity: any;
    diet: any;
    preferences: any;
    calculatedValues: any;
    commitment: any;
    account: any;
  }>
) => {
  try {
    await firestore()
      .collection(FIREBASE_CONFIG.collections.users)
      .doc(userId)
      .update({
        ...updates,
        lastUpdated: firestore.FieldValue.serverTimestamp(),
      });

    console.log('Onboarding data updated successfully for user:', userId);
  } catch (error: any) {
    console.error('Error updating onboarding data:', error);
    throw new Error(`Failed to update onboarding data: ${error.message}`);
  }
};

// Export auth and firestore instances for direct use
export { auth, firestore };

