# Firebase Setup Guide for CaloriesApp (Expo + React Native Firebase)

## ✅ Completed Steps

### 1. **Packages Installed**
The following React Native Firebase packages are already installed:
- `@react-native-firebase/app` (v23.5.0) - Core Firebase module
- `@react-native-firebase/auth` (v23.5.0) - Authentication
- `@react-native-firebase/firestore` (v23.5.0) - Cloud Firestore

### 2. **Google Service Files**
Firebase configuration files are in place:
- ✅ `google-services.json` (Android)
- ✅ `GoogleService-Info.plist` (iOS)

### 3. **Expo Configuration (app.json)**
Your `app.json` is properly configured:
- Google service files are referenced for both platforms
- Firebase plugins are added: `@react-native-firebase/app`, `@react-native-firebase/auth`, `@react-native-firebase/firestore`
- iOS build properties configured with `"useFrameworks": "static"` (required for Firebase iOS SDK)

### 4. **Firebase Utility Functions**
The `src/utils/firebase.ts` file has been updated with proper react-native-firebase API:
- Authentication functions (sign up, sign in, sign out, password reset)
- User profile management in Firestore
- Meal tracking functions
- Real-time listeners for data changes

---

## 🚀 Next Steps to Complete Setup

### Step 1: Rebuild Native Projects

Since you've enabled the Firestore plugin and updated Firebase configuration, you need to regenerate the native projects:

```bash
npx expo prebuild --clean
```

This command will:
- Generate fresh iOS and Android native projects
- Apply all Expo config plugins
- Configure Firebase with your Google service files

### Step 2: Uninstall Previous Builds (If Applicable)

If you've previously installed a development build without Firebase, uninstall it first:

**Android:**
```bash
# Uninstall from device/emulator
adb uninstall com.techmodern.caloriesapp.android
```

**iOS:**
- Delete the app from your simulator/device manually

### Step 3: Build and Run Your App

**For Android:**
```bash
npx expo run:android
```

**For iOS:**
```bash
npx expo run:ios
```

> **Note:** The first build will take longer as it compiles native Firebase modules.

---

## 📱 Usage Examples

### Authentication

```typescript
import { signUp, signIn, signOut, getCurrentUser, onAuthStateChanged } from '@/utils/firebase';

// Sign up a new user
try {
  const user = await signUp('user@example.com', 'password123');
  console.log('User created:', user.uid);
} catch (error) {
  console.error('Sign up failed:', error.message);
}

// Sign in
try {
  const user = await signIn('user@example.com', 'password123');
  console.log('Signed in:', user.uid);
} catch (error) {
  console.error('Sign in failed:', error.message);
}

// Listen to auth state changes
useEffect(() => {
  const unsubscribe = onAuthStateChanged((user) => {
    if (user) {
      console.log('User is signed in:', user.uid);
    } else {
      console.log('User is signed out');
    }
  });

  return () => unsubscribe();
}, []);

// Get current user
const user = getCurrentUser();
if (user) {
  console.log('Current user:', user.email);
}

// Sign out
await signOut();
```

### Firestore - User Profile

```typescript
import { saveUserProfile, getUserProfile, onUserProfileChanged } from '@/utils/firebase';

// Save user profile
await saveUserProfile(userId, {
  name: 'John Doe',
  email: 'john@example.com',
  dailyCalorieGoal: 2000,
  weight: 75,
  height: 180,
  age: 30,
  gender: 'male',
});

// Get user profile (one-time read)
const profile = await getUserProfile(userId);
console.log('Profile:', profile);

// Listen to profile changes in real-time
const unsubscribe = onUserProfileChanged(userId, (profile) => {
  if (profile) {
    console.log('Profile updated:', profile);
  }
});

// Later, unsubscribe
unsubscribe();
```

### Firestore - Meals

```typescript
import { addMeal, getUserMeals, getMealsByDate, onMealsChanged, updateMeal, deleteMeal } from '@/utils/firebase';

// Add a meal
const mealId = await addMeal(userId, {
  name: 'Chicken Salad',
  calories: 350,
  protein: 30,
  carbs: 20,
  fat: 15,
  mealType: 'lunch',
});

// Get user meals (one-time read, latest 50)
const meals = await getUserMeals(userId, 50);

// Get meals for today
const today = new Date();
const todayMeals = await getMealsByDate(userId, today);

// Listen to meals in real-time
const unsubscribe = onMealsChanged(userId, (meals) => {
  console.log('Meals updated:', meals.length);
}, 50);

// Update a meal
await updateMeal(userId, mealId, {
  calories: 400,
  protein: 35,
});

// Delete a meal
await deleteMeal(userId, mealId);
```

---

## 🔧 Troubleshooting

### Error: "RNFBAppModule not found"
**Solution:** You have an old development build installed. Uninstall the app, run `npx expo prebuild --clean`, and rebuild.

### Build fails on iOS
**Solution:** Make sure you have:
- Xcode 16.2+ installed (macOS 14.5+)
- `"useFrameworks": "static"` in expo-build-properties
- Run `cd ios && pod install && cd ..` if needed

### Firestore queries fail with index errors
**Solution:** Firebase will provide a link in the error message to create the required index in the Firebase Console.

### Native crashes not reported to Crashlytics during development
**Solution:** This is expected with `expo-dev-client`. Test crash reporting in release builds.

---

## 📚 Additional Resources

- [React Native Firebase Documentation](https://rnfirebase.io)
- [Firebase Console](https://console.firebase.google.com/)
- [Expo Development Builds](https://docs.expo.dev/development/introduction/)
- [Cloud Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)

---

## ⚠️ Important Notes

1. **Development Build Required:** React Native Firebase cannot be used in the Expo Go app. You must create a development build.

2. **Google Service Files:** Never commit your `google-services.json` or `GoogleService-Info.plist` files to public repositories. Add them to `.gitignore` if needed.

3. **Firebase Security Rules:** Make sure to configure proper security rules in the Firebase Console for Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Users can only read/write their own meals
      match /meals/{mealId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

4. **Test Authentication:** Enable Email/Password authentication in the Firebase Console under Authentication > Sign-in method.

---

## ✨ Your Firebase is Ready!

Once you complete the rebuild steps above, your app will be fully integrated with Firebase Authentication and Firestore. The utility functions in `src/utils/firebase.ts` provide a clean API for all Firebase operations.

Happy coding! 🚀

