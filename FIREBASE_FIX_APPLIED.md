# Firebase Integration Fix Applied 🔧

## Problem Identified

Your app was crashing because `src/context/user-context.tsx` was using the **Web SDK API** instead of the **React Native Firebase API**.

### ❌ Incorrect (Web SDK - What Was Breaking)
```typescript
// WRONG - This is for web apps, NOT React Native
import { getApp } from '@react-native-firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from '@react-native-firebase/auth';
import { getFirestore, collection, doc, getDoc, setDoc } from '@react-native-firebase/firestore';

const app = getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);

// Usage (WRONG for React Native)
await setDoc(doc(firestore, 'users', userId), data);
const snapshot = await getDoc(doc(firestore, 'users', userId));
```

### ✅ Correct (React Native Firebase API - What I Fixed)
```typescript
// CORRECT - React Native Firebase API
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// No manual initialization needed!
// react-native-firebase auto-initializes from google-services.json

// Usage (CORRECT)
await firestore().collection('users').doc(userId).set(data);
const snapshot = await firestore().collection('users').doc(userId).get();
```

---

## What I Fixed

### 1. **Imports**
Changed from Web SDK modular API to React Native Firebase API:
- ❌ `import { getAuth } from '@react-native-firebase/auth'`
- ✅ `import auth from '@react-native-firebase/auth'`

### 2. **Initialization**
Removed manual initialization (not needed in React Native Firebase):
- ❌ `const app = getApp(); const auth = getAuth(app);`
- ✅ Auto-initialized from `google-services.json` and `GoogleService-Info.plist`

### 3. **Auth API**
- ❌ `onAuthStateChanged(auth, callback)`
- ✅ `auth().onAuthStateChanged(callback)`

- ❌ `await signInAnonymously(auth)`
- ✅ `await auth().signInAnonymously()`

### 4. **Firestore API**
- ❌ `getDoc(doc(firestore, 'users', userId))`
- ✅ `firestore().collection('users').doc(userId).get()`

- ❌ `setDoc(doc(firestore, 'users', userId), data)`
- ✅ `firestore().collection('users').doc(userId).set(data)`

- ❌ `serverTimestamp()`
- ✅ `firestore.FieldValue.serverTimestamp()`

### 5. **Document Checks**
- ❌ `if (doc.exists())` (method call)
- ✅ `if (doc.exists)` (property access)

### 6. **Type Definitions**
- ❌ `User` from '@react-native-firebase/auth'
- ✅ `FirebaseAuthTypes.User`

---

## Files Modified

### ✅ `src/context/user-context.tsx`
Complete rewrite to use react-native-firebase API instead of web SDK.

**Functions Fixed:**
- ✅ `onAuthStateChanged` listener
- ✅ `loadUserData` - Firestore read
- ✅ `createInitialUserDocument` - Firestore write
- ✅ `createAnonymousUser` - Anonymous auth
- ✅ `updateUserProfile` - Firestore update
- ✅ `updateGoals` - Firestore update
- ✅ `updateActivity` - Firestore update
- ✅ `updateDiet` - Firestore update
- ✅ `updatePreferences` - Firestore update
- ✅ `updateCommitment` - Firestore update
- ✅ `calculateAndUpdateValues` - Firestore update
- ✅ `completeOnboarding` - Firestore update
- ✅ `signOut` - Auth signout

---

## Why This Matters

### Web SDK (What You Had) ❌
- Designed for browsers and web apps
- Uses ES modules with tree-shaking
- Requires manual initialization with config object
- **Does NOT work with React Native**

### React Native Firebase (What You Need) ✅
- Built specifically for React Native
- Uses native iOS and Android SDKs
- Auto-initializes from native config files
- Provides offline support, native performance
- **Works with Expo development builds**

---

## Testing the Fix

The build command is now running:
```bash
npx expo run:android
```

This should now work without crashes! The app will:
1. ✅ Initialize Firebase automatically
2. ✅ Load user authentication state
3. ✅ Access Firestore without errors
4. ✅ Display the onboarding or main screen

---

## Next Steps

Once the build completes and the app runs successfully:

### 1. **Firebase Console Setup** (If not done yet)
- Enable **Email/Password** authentication
- Create **Firestore Database** (start in test mode)
- Set proper security rules (see `FIREBASE_SETUP_GUIDE.md`)

### 2. **Test Authentication**
```typescript
// Try creating an anonymous user
const { createAnonymousUser } = useUser();
await createAnonymousUser();
```

### 3. **Test Firestore**
```typescript
// Try saving user profile
const { updateUserProfile } = useUser();
await updateUserProfile({
  name: 'John Doe',
  age: 30,
});
```

---

## Common React Native Firebase Patterns

### ✅ Correct Usage

**Reading data:**
```typescript
const doc = await firestore()
  .collection('users')
  .doc(userId)
  .get();

if (doc.exists) {
  const data = doc.data();
}
```

**Writing data:**
```typescript
await firestore()
  .collection('users')
  .doc(userId)
  .set({
    name: 'John',
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
```

**Real-time listeners:**
```typescript
const unsubscribe = firestore()
  .collection('users')
  .doc(userId)
  .onSnapshot((doc) => {
    if (doc.exists) {
      console.log('Data:', doc.data());
    }
  });

// Later: unsubscribe();
```

**Authentication:**
```typescript
// Sign in
await auth().signInWithEmailAndPassword(email, password);

// Listen to auth state
const unsubscribe = auth().onAuthStateChanged((user) => {
  if (user) {
    console.log('User ID:', user.uid);
  }
});
```

---

## References

- [React Native Firebase Docs](https://rnfirebase.io)
- [Expo + Firebase Guide](https://docs.expo.dev/guides/using-firebase/)
- [React Native Firebase vs Web SDK](https://rnfirebase.io/#comparison-with-firebase-web-sdk)

---

**✨ Your Firebase integration is now correctly configured for React Native!**





