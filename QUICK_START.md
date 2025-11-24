# 🚀 Firebase Quick Start

## What's Been Done ✅

1. ✅ **Packages Installed:** `@react-native-firebase/app`, `auth`, `firestore` (v23.5.0)
2. ✅ **Config Files:** `google-services.json` & `GoogleService-Info.plist` in place
3. ✅ **app.json:** Configured with Firebase plugins and service file paths
4. ✅ **iOS Build Settings:** `useFrameworks: static` configured
5. ✅ **Firebase Utils:** Complete utility functions in `src/utils/firebase.ts`

---

## What You Need to Do Now 🎯

### 1️⃣ Rebuild Native Projects (REQUIRED)

```bash
npx expo prebuild --clean
```

### 2️⃣ Build & Run

**Android:**
```bash
npx expo run:android
```

**iOS:**
```bash
npx expo run:ios
```

---

## Quick Usage Examples 📝

### Sign Up
```typescript
import { signUp } from '@/utils/firebase';

const user = await signUp('user@example.com', 'password123');
```

### Sign In
```typescript
import { signIn } from '@/utils/firebase';

const user = await signIn('user@example.com', 'password123');
```

### Listen to Auth State
```typescript
import { onAuthStateChanged } from '@/utils/firebase';

useEffect(() => {
  const unsubscribe = onAuthStateChanged((user) => {
    if (user) {
      console.log('Signed in:', user.uid);
    } else {
      console.log('Signed out');
    }
  });
  return () => unsubscribe();
}, []);
```

### Save User Profile
```typescript
import { saveUserProfile } from '@/utils/firebase';

await saveUserProfile(userId, {
  name: 'John Doe',
  email: 'john@example.com',
  dailyCalorieGoal: 2000,
});
```

### Add a Meal
```typescript
import { addMeal } from '@/utils/firebase';

const mealId = await addMeal(userId, {
  name: 'Chicken Salad',
  calories: 350,
  protein: 30,
  mealType: 'lunch',
});
```

---

## 🔐 Firebase Console Setup

1. **Enable Authentication:**
   - Go to: [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Navigate to: **Authentication** → **Sign-in method**
   - Enable: **Email/Password**

2. **Create Firestore Database:**
   - Navigate to: **Firestore Database**
   - Click: **Create database**
   - Start in: **Test mode** (change to production mode later)

3. **Configure Security Rules:**
   - In Firestore, go to: **Rules** tab
   - Use the rules from `FIREBASE_SETUP_GUIDE.md`

---

## ⚠️ Important

- You **cannot** use Expo Go - must create a development build
- After running `prebuild`, your native code folders (`ios/`, `android/`) will be generated
- First build will take 5-10 minutes

---

## 📚 Full Documentation

See `FIREBASE_SETUP_GUIDE.md` for complete details, troubleshooting, and advanced usage.

---

**Ready to go! Run `npx expo prebuild --clean` now! 🎉**

