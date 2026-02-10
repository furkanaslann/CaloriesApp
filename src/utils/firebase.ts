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

import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import functions from "@react-native-firebase/functions";
import storage from "@react-native-firebase/storage";
import { Platform } from "react-native";

import { FIREBASE_CONFIG } from "@/constants/firebase";

// Firebase Emulator Configuration for Development
const IS_DEV = __DEV__;
const getEmulatorHost = () => {
  if (Platform.OS === "android") {
    return "10.0.2.2";
  } else if (Platform.OS === "ios") {
    return "localhost";
  }
  return "localhost"; // Default for web/other platforms
};

const EMULATOR_CONFIG = {
  host: getEmulatorHost(),
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

// Flag to prevent multiple initialization attempts
let isInitializing = false;

/**
 * Helper function to retry Firestore operations with exponential backoff
 */
const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000,
): Promise<T> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      // More robust error checking - handle cases where error might be undefined or null
      const errorCode = error?.code || error?.message || "";
      const errorString = String(errorCode).toLowerCase();

      const isUnavailableError =
        errorString.includes("firestore/unavailable") ||
        errorString.includes("unavailable") ||
        errorString.includes("transient");

      if (!isUnavailableError || attempt === maxRetries - 1) {
        throw error;
      }

      const delay = initialDelay * Math.pow(2, attempt);
      console.log(
        `⚠️ Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms...`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error("Operation failed after retries");
};

/**
 * Verify that Firestore native module is actually ready
 * This is critical for New Architecture where native bridge may lag behind JS initialization
 */
const verifyFirestoreNativeReady = async (
  maxRetries = 10,
  delayMs = 500,
): Promise<boolean> => {
  console.log("🔍 Verifying Firestore native module readiness...");

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Try a simple Firestore operation to verify native module is ready
      // We don't need the collection to exist, we just need the native call to not throw unavailable
      const testRef = firestore().collection("_health_check").doc("_test");

      // This will fail if native module isn't ready with "unavailable" error
      // We don't care if it succeeds or fails with other errors (permission, etc)
      await testRef.get();

      console.log(
        `✅ Firestore native module ready (attempt ${attempt}/${maxRetries})`,
      );
      return true;
    } catch (error: any) {
      // More robust error checking - handle cases where error might be undefined or null
      const errorCode = error?.code || error?.message || "";
      const errorString = String(errorCode).toLowerCase();

      const isUnavailableError =
        errorString.includes("firestore/unavailable") ||
        errorString.includes("unavailable");

      if (isUnavailableError) {
        console.log(
          `⏳ Firestore native module not ready yet (attempt ${attempt}/${maxRetries}), retrying...`,
        );

        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          continue;
        } else {
          console.error(
            "❌ Firestore native module failed to become ready after all retries",
          );
          return false;
        }
      } else {
        // Any other error means native module is responding (even if with an error)
        // This is actually OK - it means the native bridge is working
        console.log(
          `✅ Firestore native module responding (attempt ${attempt}/${maxRetries})`,
        );
        return true;
      }
    }
  }

  return false;
};

export const initializeFirebaseEmulators = async () => {
  // Prevent concurrent initialization attempts
  if (isInitializing) {
    console.log("⏳ Emulator initialization already in progress, waiting...");
    // Wait a bit for the current initialization to complete
    await new Promise((resolve) => setTimeout(resolve, 100));
    return emulatorsInitialized;
  }

  // Already initialized - return success
  if (emulatorsInitialized) {
    return true;
  }

  // Not in dev mode - nothing to do
  if (!IS_DEV) {
    return true;
  }

  // Start initialization
  isInitializing = true;

  try {
    console.log("🔥 Initializing Firebase Emulators...");
    console.log(`📱 Platform: ${Platform.OS}, Host: ${EMULATOR_CONFIG.host}`);

    // 🔧 AsyncStorage conflict prevention for development
    // Clear Firebase auth/firestore cached data to prevent ID mismatch with RevenueCat
    try {
      const keysToRemove = [
        "@ReactNativeFirebase:auth",
        "@ReactNativeFirebase:firestore",
        "com.techmodern.caloriesapp.android", // RevenueCat cache key
      ];
      await AsyncStorage.multiRemove(keysToRemove);
      console.log(
        "🧹 Cleared Firebase/RevenueCat AsyncStorage cache to prevent ID conflict",
      );
    } catch (clearError) {
      console.warn("⚠️ Failed to clear AsyncStorage cache:", clearError);
      // Continue anyway, this is not critical
    }

    // Connect to Auth Emulator - use the static instance method
    const authUrl = `http://${EMULATOR_CONFIG.host}:${EMULATOR_CONFIG.ports.auth}`;
    console.log("Connecting to Auth Emulator at:", authUrl);
    try {
      auth().useEmulator(authUrl);
    } catch (authError: any) {
      // Ignore if already initialized - this is normal in hot reload
      console.log(
        "Auth emulator status:",
        authError?.message || "Already configured",
      );
    }

    // Connect to Firestore Emulator - CRITICAL: Must be done BEFORE any Firestore access
    console.log(
      "Connecting to Firestore Emulator at:",
      `${EMULATOR_CONFIG.host}:${EMULATOR_CONFIG.ports.firestore}`,
    );
    try {
      firestore().useEmulator(
        EMULATOR_CONFIG.host,
        EMULATOR_CONFIG.ports.firestore,
      );
    } catch (firestoreError: any) {
      // If emulator is already set, that's fine - continue
      // This is expected during hot reload in development
      console.log(
        "Firestore emulator status:",
        firestoreError?.message || "Already configured",
      );
    }

    // Android Emulator'de gRPC hatalarını (unavailable) önlemek için persistence kapatılır
    try {
      firestore().settings({ persistence: false });
    } catch (settingsError: any) {
      // Ignore settings errors if already set
      console.log(
        "Firestore settings status:",
        settingsError?.message || "Already configured",
      );
    }

    // 🚨 CRITICAL FOR NEW ARCHITECTURE: Wait for native module to be truly ready
    // This prevents "firestore/unavailable" errors on first app start
    console.log("⏳ Waiting for Firestore native module to be ready...");
    const isNativeReady = await verifyFirestoreNativeReady(10, 500);

    if (!isNativeReady) {
      console.warn(
        "⚠️ Firestore native module verification failed, but continuing anyway",
      );
    }

    // Connect to Functions Emulator
    console.log(
      "Connecting to Functions Emulator at:",
      `${EMULATOR_CONFIG.host}:${EMULATOR_CONFIG.ports.functions}`,
    );
    try {
      functions().useEmulator(
        EMULATOR_CONFIG.host,
        EMULATOR_CONFIG.ports.functions,
      );
    } catch (functionsError: any) {
      console.log(
        "Functions emulator status:",
        functionsError?.message || "Already configured",
      );
    }

    // Connect to Storage Emulator
    console.log(
      "Connecting to Storage Emulator at:",
      `${EMULATOR_CONFIG.host}:${EMULATOR_CONFIG.ports.storage}`,
    );
    try {
      storage().useEmulator(
        EMULATOR_CONFIG.host,
        EMULATOR_CONFIG.ports.storage,
      );
    } catch (storageError: any) {
      // If emulator is already set, that's fine - continue
      console.log(
        "Storage emulator status:",
        storageError?.message || "Already configured",
      );
    }

    console.log("✅ Firebase Emulators initialized successfully");
    emulatorsInitialized = true;
    return true;
  } catch (error: any) {
    // Even if there's an error, mark as initialized to avoid retry loops
    // The app can still work with partial emulator configuration
    console.error(
      "❌ Firebase Emulator connection error:",
      error?.message || error,
    );

    // Check if the error is about already being initialized - that's OK in dev
    const errorStr = String(error).toLowerCase();
    if (
      errorStr.includes("already") ||
      error?.code === "firestore/unknown" ||
      errorStr.includes("initialized")
    ) {
      console.log(
        "⚠️ Emulators may already be configured from previous session, continuing...",
      );
      emulatorsInitialized = true;
      return true;
    }

    emulatorsInitialized = false;
    return false;
  } finally {
    // Always reset the initializing flag
    isInitializing = false;
  }
};

// ============================================================================
// AUTHENTICATION FUNCTIONS
// ============================================================================

/**
 * Sign up a new user with email and password
 */
export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );
    return userCredential.user;
  } catch (error: any) {
    console.error("Sign up error:", error);
    throw new Error(error.message);
  }
};

/**
 * Sign in an existing user with email and password
 */
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password,
    );
    return userCredential.user;
  } catch (error: any) {
    console.error("Sign in error:", error);
    throw new Error(error.message);
  }
};

/**
 * Convert anonymous user to permanent account with email and password
 * This preserves the user ID and all associated data
 *
 * If the anonymous user is no longer valid, creates a new account instead
 */
export const linkAnonymousToEmailPassword = async (
  email: string,
  password: string,
) => {
  const currentUser = auth().currentUser;

  if (!currentUser) {
    console.log("⚠️ No anonymous user found, creating new account instead");
    return await signUp(email, password);
  }

  if (!currentUser.isAnonymous) {
    console.log("User is already a permanent account, signing in instead");
    return await signIn(email, password);
  }

  console.log("🔗 Linking anonymous user to email/password:", currentUser.uid);

  // Store the anonymous UID for potential data migration
  const anonymousUid = currentUser.uid;

  try {
    // Create email/password credential
    const credential = auth.EmailAuthProvider.credential(email, password);

    // Link the credential to the anonymous user
    const userCredential = await currentUser.linkWithCredential(credential);

    console.log("✅ Successfully linked anonymous user to email/password");
    return userCredential.user;
  } catch (error: any) {
    console.error("❌ Error linking anonymous user:", error);

    // Handle specific error codes
    if (error.code === "auth/email-already-in-use") {
      console.log("Email already in use, signing in instead");
      return await signIn(email, password);
    }

    // If the anonymous user is no longer valid (user-not-found, invalid-user-token, etc.)
    // create a new account and note that data migration may be needed
    if (
      error.code === "auth/user-not-found" ||
      error.code === "auth/user-disabled" ||
      error.code === "auth/invalid-user-token" ||
      error.code === "auth/user-token-expired" ||
      error.code === "auth/invalid-credential"
    ) {
      console.log("⚠️ Anonymous user is no longer valid, creating new account");
      console.log(
        "📝 Note: Anonymous UID was:",
        anonymousUid,
        "- manual data migration may be needed",
      );

      // Create a new account
      const newUser = await signUp(email, password);
      return newUser;
    }

    // For other errors, still try to create a new account as fallback
    console.log(
      "⚠️ Unexpected linking error, creating new account as fallback",
    );
    try {
      const newUser = await signUp(email, password);
      return newUser;
    } catch (signupError: any) {
      console.error(
        "❌ Failed to create new account after linking failed:",
        signupError,
      );
      throw new Error(`Account creation failed: ${signupError.message}`);
    }
  }
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  try {
    await auth().signOut();
  } catch (error: any) {
    console.error("Sign out error:", error);
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
    console.error("Password reset error:", error);
    throw new Error(error.message);
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  displayName: string,
  photoURL?: string,
) => {
  try {
    const user = auth().currentUser;
    if (!user) throw new Error("No user signed in");

    await user.updateProfile({
      displayName,
      photoURL,
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    throw new Error(error.message);
  }
};

// ============================================================================
// FIRESTORE FUNCTIONS - USER PROFILE
// ============================================================================

/**
 * Create or update user profile in Firestore
 */
export const saveUserProfile = async (
  userId: string,
  userData: {
    name: string;
    email: string;
    dailyCalorieGoal?: number;
    weight?: number;
    height?: number;
    age?: number;
    gender?: string;
  },
) => {
  try {
    await firestore()
      .collection(FIREBASE_CONFIG.collections.users)
      .doc(userId)
      .set(
        {
          ...userData,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
  } catch (error: any) {
    console.error("Error saving user profile:", error);
    throw new Error(error.message);
  }
};

/**
 * Get user profile from Firestore with retry logic
 */
export const getUserProfile = async (userId: string) => {
  try {
    const doc = await retryWithBackoff(async () => {
      return await firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(userId)
        .get();
    });

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data(),
    };
  } catch (error: any) {
    console.error("Error getting user profile:", error);
    throw new Error(error.message);
  }
};

/**
 * Listen to user profile changes in real-time
 * Returns an unsubscribe function
 */
export const onUserProfileChanged = (
  userId: string,
  callback: (profile: any) => void,
) => {
  return firestore()
    .collection(FIREBASE_CONFIG.collections.users)
    .doc(userId)
    .onSnapshot(
      (doc) => {
        if (doc.exists()) {
          callback({ id: doc.id, ...doc.data() });
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error("Error listening to user profile:", error);
      },
    );
};

// ============================================================================
// FIRESTORE FUNCTIONS - MEALS
// ============================================================================

/**
 * Add a meal entry to Firestore
 */
export const addMeal = async (
  userId: string,
  mealData: {
    name: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    imageUrl?: string;
    mealType?: "breakfast" | "lunch" | "dinner" | "snack";
  },
) => {
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
    console.error("Error adding meal:", error);
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
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error: any) {
    console.error("Error getting meals:", error);
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
      .where("createdAt", ">=", firestore.Timestamp.fromDate(startOfDay))
      .where("createdAt", "<=", firestore.Timestamp.fromDate(endOfDay))
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error: any) {
    console.error("Error getting meals by date:", error);
    throw new Error(error.message);
  }
};

/**
 * Listen to meals in real-time for a user
 * Returns an unsubscribe function
 */
export const onMealsChanged = (
  userId: string,
  callback: (meals: any[]) => void,
  limit: number = 50,
) => {
  return firestore()
    .collection(FIREBASE_CONFIG.collections.users)
    .doc(userId)
    .collection(FIREBASE_CONFIG.collections.meals)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .onSnapshot(
      (snapshot) => {
        const meals = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(meals);
      },
      (error) => {
        console.error("Error listening to meals:", error);
      },
    );
};

/**
 * Update a meal entry
 */
export const updateMeal = async (
  userId: string,
  mealId: string,
  updates: any,
) => {
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
    console.error("Error updating meal:", error);
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
    console.error("Error deleting meal:", error);
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
  imageName: string = `meal_${Date.now()}.jpg`,
) => {
  try {
    // React Native Firebase v9+ formatı
    const storageReference = storage().ref(
      `users/${userId}/meals/${imageName}`,
    );
    console.log("Storage ref created:", `users/${userId}/meals/${imageName}`);

    await storageReference.putFile(imageUri);
    console.log("File uploaded successfully");

    const downloadURL = await storageReference.getDownloadURL();
    console.log("Download URL obtained:", downloadURL);

    return downloadURL;
  } catch (error: any) {
    console.error("Error uploading image:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
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
    console.error("Error deleting image:", error);
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
  imageName: string = `meal_${Date.now()}.jpg`,
) => {
  try {
    // Doğrudan URI'den Storage'a yükle
    const reference = storage().ref(`users/${userId}/meals/${imageName}`);
    await reference.putFile(imageUri);
    const downloadURL = await reference.getDownloadURL();

    return downloadURL;
  } catch (error: any) {
    console.error("Error uploading image from URI:", error);
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
    mealType?: "breakfast" | "lunch" | "dinner" | "snack";
  },
  imageUri?: string,
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
    console.error("Error adding meal with image:", error);
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
  if (typeof obj === "object" && obj && obj._type === "timestamp") {
    return obj; // Keep Firestore timestamps as-is
  }

  if (typeof obj !== "object") {
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    const filteredArray = obj
      .map((item) => filterUndefinedValues(item))
      .filter((item) => item !== null && item !== undefined);
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
      if (
        typeof value === "object" &&
        value !== null &&
        !(value instanceof Date)
      ) {
        if (value && value._type === "timestamp") {
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

export const saveOnboardingData = async (
  userId: string,
  onboardingData: any,
) => {
  try {
    //console.log('Original onboarding data:', JSON.stringify(onboardingData, null, 2));

    // Filter out any undefined values before sending to Firestore
    const filteredData = filterUndefinedValues(onboardingData);
    //console.log('Filtered onboarding data:', JSON.stringify(filteredData, null, 2));

    // If filtered data is null, create minimal structure
    if (filteredData === null) {
      console.warn("All data was filtered out, creating minimal structure");
      const minimalData = {
        onboardingCompleted: true,
        onboardingCompletedAt: firestore.FieldValue.serverTimestamp(),
        lastUpdated: firestore.FieldValue.serverTimestamp(),
        version: "1.0.0",
      };

      await firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(userId)
        .set(minimalData, { merge: true });

      console.log(
        "Minimal onboarding data saved successfully for user:",
        userId,
      );
      return;
    }

    // Build the Firestore document data
    const firestoreData: any = {
      // Metadata
      onboardingCompleted: true,
      onboardingCompletedAt: firestore.FieldValue.serverTimestamp(),
      lastUpdated: firestore.FieldValue.serverTimestamp(),
      version: "1.0.0",
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

    console.log("Onboarding data saved successfully for user:", userId);
  } catch (error: any) {
    console.error("Error saving onboarding data:", error);
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
        name: data?.name,
        lastName: data?.lastName,
        age: data?.age,
        dateOfBirth: data?.dateOfBirth,
        gender: data?.gender,
        height: data?.height,
        currentWeight: data?.currentWeight,
        profilePhoto: data?.profilePhoto,
      },
      goals: data?.goals,
      activity: data?.activity,
      diet: data?.diet,
      preferences: data?.preferences,
      calculatedValues: data?.calculatedValues,
      commitment: data?.commitment,
      account: data?.account,
      onboardingCompleted: data?.onboardingCompleted || false,
      onboardingCompletedAt: data?.onboardingCompletedAt,
      lastUpdated: data?.lastUpdated,
      version: data?.version,
    };
  } catch (error: any) {
    console.error("Error getting onboarding data:", error);
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
  }>,
) => {
  try {
    await firestore()
      .collection(FIREBASE_CONFIG.collections.users)
      .doc(userId)
      .update({
        ...updates,
        lastUpdated: firestore.FieldValue.serverTimestamp(),
      });

    console.log("Onboarding data updated successfully for user:", userId);
  } catch (error: any) {
    console.error("Error updating onboarding data:", error);
    throw new Error(`Failed to update onboarding data: ${error.message}`);
  }
};

// ============================================================================
// EMAIL OTP AUTHENTICATION FUNCTIONS
// ============================================================================

/**
 * Send OTP verification code to email address
 * Calls the sendEmailOTP Cloud Function
 */
export const sendOTPCode = async (
  email: string,
  anonymousUid?: string,
): Promise<void> => {
  try {
    const sendOTP = functions().httpsCallable("sendEmailOTP");
    const result = await sendOTP({ email, anonymousUid });
    console.log("✅ OTP code sent:", result.data);
  } catch (error: any) {
    console.error("Error sending OTP code:", error);
    // Extract meaningful error message from Firebase Functions error
    const message =
      error?.details?.message ||
      error?.message ||
      "Doğrulama kodu gönderilemedi.";
    throw new Error(message);
  }
};

/**
 * Verify OTP code and sign in
 * Calls the verifyEmailOTP Cloud Function, then signs in with custom token
 */
export const verifyOTPCode = async (
  email: string,
  code: string,
  anonymousUid?: string,
) => {
  try {
    const verifyOTP = functions().httpsCallable("verifyEmailOTP");
    const result = await verifyOTP({ email, code, anonymousUid });

    const { token, uid } = result.data as {
      token: string;
      uid: string;
      email: string;
    };

    // Sign in with the custom token
    const userCredential = await auth().signInWithCustomToken(token);
    console.log(
      "✅ Signed in with custom token, uid:",
      userCredential.user.uid,
    );

    return userCredential.user;
  } catch (error: any) {
    console.error("Error verifying OTP code:", error);
    const message =
      error?.details?.message || error?.message || "Doğrulama başarısız oldu.";
    throw new Error(message);
  }
};

// ============================================================================
// SOCIAL AUTHENTICATION FUNCTIONS
// ============================================================================

/**
 * Sign in with Google
 * Requires @react-native-google-signin/google-signin to be configured
 */
export const signInWithGoogle = async () => {
  try {
    const { GoogleSignin } =
      await import("@react-native-google-signin/google-signin");

    // Configure Google Sign-In with webClientId from Firebase Console
    // TODO: Replace with your actual webClientId from google-services.json (client_type: 3)
    // Go to Firebase Console > Authentication > Sign-in method > Google > Enable
    // Then find the Web client ID in Firebase Console > Project Settings > General
    GoogleSignin.configure({
      webClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
    });

    // Check if device supports Google Play Services
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    // Initiate Google Sign-In
    const signInResult = await GoogleSignin.signIn();

    // Get ID token (supports both v13+ and older versions)
    let idToken = (signInResult as any).data?.idToken;
    if (!idToken) {
      idToken = (signInResult as any).idToken;
    }
    if (!idToken) {
      throw new Error("Google Sign-In başarısız: ID token alınamadı.");
    }

    // Create Firebase credential
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Check if there's an anonymous user to link
    const currentUser = auth().currentUser;
    if (currentUser && currentUser.isAnonymous) {
      try {
        // Try to link the anonymous account with Google credential
        const userCredential =
          await currentUser.linkWithCredential(googleCredential);
        console.log(
          "✅ Anonymous user linked with Google:",
          userCredential.user.uid,
        );

        // Update Firestore document
        await firestore()
          .collection(FIREBASE_CONFIG.collections.users)
          .doc(userCredential.user.uid)
          .set(
            {
              email: userCredential.user.email,
              displayName: userCredential.user.displayName,
              isAnonymous: false,
              updatedAt: firestore.FieldValue.serverTimestamp(),
            },
            { merge: true },
          );

        return userCredential.user;
      } catch (linkError: any) {
        console.warn(
          "⚠️ Could not link anonymous user, signing in directly:",
          linkError.code,
        );
        // If linking fails (e.g., credential already in use), sign in directly
      }
    }

    // Sign in with Firebase credential
    const userCredential = await auth().signInWithCredential(googleCredential);
    console.log("✅ Signed in with Google:", userCredential.user.uid);

    return userCredential.user;
  } catch (error: any) {
    console.error("Google Sign-In error:", error);
    throw new Error(error.message || "Google ile giriş başarısız oldu.");
  }
};

/**
 * Sign in with Apple
 * Requires @invertase/react-native-apple-authentication
 * Only available on iOS
 */
export const signInWithApple = async () => {
  try {
    const { appleAuth } =
      await import("@invertase/react-native-apple-authentication");

    // Perform Apple Sign-In request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw new Error("Apple Sign-In başarısız: identity token alınamadı.");
    }

    // Create Firebase credential
    const { identityToken, nonce } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );

    // Check if there's an anonymous user to link
    const currentUser = auth().currentUser;
    if (currentUser && currentUser.isAnonymous) {
      try {
        const userCredential =
          await currentUser.linkWithCredential(appleCredential);
        console.log(
          "✅ Anonymous user linked with Apple:",
          userCredential.user.uid,
        );

        // Update Firestore document
        const displayName = appleAuthRequestResponse.fullName
          ? `${appleAuthRequestResponse.fullName.givenName || ""} ${appleAuthRequestResponse.fullName.familyName || ""}`.trim()
          : undefined;

        await firestore()
          .collection(FIREBASE_CONFIG.collections.users)
          .doc(userCredential.user.uid)
          .set(
            {
              email: userCredential.user.email,
              displayName: displayName || userCredential.user.displayName,
              isAnonymous: false,
              updatedAt: firestore.FieldValue.serverTimestamp(),
            },
            { merge: true },
          );

        return userCredential.user;
      } catch (linkError: any) {
        console.warn(
          "⚠️ Could not link anonymous user, signing in directly:",
          linkError.code,
        );
      }
    }

    // Sign in with Firebase credential
    const userCredential = await auth().signInWithCredential(appleCredential);
    console.log("✅ Signed in with Apple:", userCredential.user.uid);

    return userCredential.user;
  } catch (error: any) {
    console.error("Apple Sign-In error:", error);
    throw new Error(error.message || "Apple ile giriş başarısız oldu.");
  }
};

// Export auth and firestore instances for direct use
export { auth, firestore, functions, retryWithBackoff };
