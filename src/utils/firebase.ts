/**
 * Firebase Utility Functions
 *
 * This file contains helper functions for Firebase services.
 * Currently configured for Authentication and Firestore.
 */

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { FIREBASE_CONFIG } from '@/constants';

// Uncomment when you install Firebase Storage
// import storage from '@react-native-firebase/storage';

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
      .where('createdAt', '>=', startOfDay)
      .where('createdAt', '<=', endOfDay)
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
// export const uploadImage = async (
//   userId: string,
//   imageUri: string,
//   imageName: string = `meal_${Date.now()}.jpg`
// ) => {
//   try {
//     const reference = storage().ref(`users/${userId}/meals/${imageName}`);
//     await reference.putFile(imageUri);
//     const downloadURL = await reference.getDownloadURL();
//     return downloadURL;
//   } catch (error: any) {
//     console.error('Error uploading image:', error);
//     throw new Error(error.message);
//   }
// };

/**
 * Delete an image from Firebase Storage
 */
// export const deleteImage = async (imageUrl: string) => {
//   try {
//     const reference = storage().refFromURL(imageUrl);
//     await reference.delete();
//   } catch (error: any) {
//     console.error('Error deleting image:', error);
//     throw new Error(error.message);
//   }
// };

// ============================================================================
// EXAMPLE: COMPLETE WORKFLOW
// ============================================================================

/**
 * Example: Add a meal with image upload
 */
// export const addMealWithImage = async (
//   userId: string,
//   mealData: {
//     name: string;
//     calories: number;
//     protein?: number;
//     carbs?: number;
//     fat?: number;
//     mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
//   },
//   imageUri?: string
// ) => {
//   try {
//     let imageUrl;
//     
//     // Upload image if provided
//     if (imageUri) {
//       imageUrl = await uploadImage(userId, imageUri);
//     }
//     
//     // Add meal to Firestore
//     const mealId = await addMeal(userId, {
//       ...mealData,
//       imageUrl,
//     });
//     
//     return { mealId, imageUrl };
//   } catch (error: any) {
//     console.error('Error adding meal with image:', error);
//     throw new Error(error.message);
//   }
// };

// Export auth and firestore instances for direct use
export { auth, firestore };

