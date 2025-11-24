# CaloriTrack - Onboarding Flow Implementation Status

## Overview

A comprehensive onboarding process is being developed for the CaloriTrack application to help users get acquainted with the app, set personal goals, and learn basic features. This flow is designed to enable users to effectively use the application and achieve long-term engagement.

**Current Implementation Status: %20 Complete** (5/28 screens implemented)

## 🎨 Design System Implementation

**COMPLETED:** Comprehensive design system has been implemented with the following structure:

### UI Components (`/components/ui/`)
- **button.tsx:** ✅ COMPLETED - Themed component with 3 variants (primary, secondary, ghost)
- **input.tsx:** ✅ COMPLETED - Modern floating label design with validation

### Context Providers (`/contexts/`)
- **onboarding-context.tsx:** ✅ COMPLETED - Complete state management for 28 screens
- **user-context.tsx:** ✅ COMPLETED - Firestore synchronization
- **theme-context.tsx:** ✅ COMPLETED - Theme provider

### Hooks (`/hooks/`)
- **use-onboarding-sync.ts:** ✅ COMPLETED - Onboarding with User context synchronization

## Technical Infrastructure

- **Platform:** React Native with Expo Router
- **State Management:** React Context API (Onboarding + Theme + User)
- **Storage:** AsyncStorage + Firestore synchronization
- **Navigation:** Expo Router (file-based routing)
- **Design System:** Modern purple color palette with gradient effects
- **Calculations:** Harris-Benedict BMR/TDEE calculations with dynamic macro distribution

## 🎯 Onboarding Flow Implementation Status

### ✅ Completed Screens (5/28)

#### 1. Welcome Screen
**File:** `app/onboarding/welcome.tsx` ✅ **COMPLETED**

**Features:**
- Modern 5-slide onboarding flow
- Smooth transitions and pagination
- Progress indicators
- Theme integration

**UI Elements:**
- Horizontal scrollable slides
- Smooth slide transitions
- Progress dots with active state
- Themed button components

#### 2. Name Input Screen
**File:** `app/onboarding/name.tsx` ✅ **COMPLETED**

**Features:**
- Modern input design
- Progress indicators
- Validation logic
- Theme integration

#### 3. Primary Goals Screen
**File:** `app/onboarding/goals-primary.tsx` ✅ **COMPLETED**

**Features:**
- Interactive goal selection cards
- Color-coded goals
- Icon integration
- Visual goal selection

#### 4. Summary Screen
**File:** `app/onboarding/summary.tsx` ✅ **COMPLETED**

**Features:**
- Dynamic calculation display
- Progress visualization
- Figma image integration
- Results preview

#### 5. Commitment Screen
**File:** `app/onboarding/commitment.tsx` ✅ **COMPLETED**

**Features:**
- Form validation
- Firestore integration
- Preview functionality
- Final confirmation

### 🚧 Incomplete Screens (23/28)

#### Profile Information Screens
- **`last-name.tsx`** - Last name input
- **`date-of-birth.tsx`** - Date of birth and age calculation
- **`gender.tsx`** - Gender selection
- **`height.tsx`** - Height information
- **`weight.tsx`** - Weight information
- **`profile-photo.tsx`** - Profile photo

#### Goals Detail Screens
- **`goals-weight.tsx`** - Target weight setting
- **`goals-weekly.tsx`** - Weekly goals
- **`goals-timeline.tsx`** - Timeline
- **`goals-motivation.tsx`** - Motivation level

#### Activity Information Screens
- **`activity.tsx`** - Activity level
- **`occupation.tsx`** - Occupation type
- **`exercise-types.tsx`** - Exercise types
- **`exercise-frequency.tsx`** - Exercise frequency
- **`sleep-hours.tsx`** - Sleep pattern

#### Diet Information Screens
- **`diet.tsx`** - Diet type
- **`allergies.tsx`** - Allergies
- **`intolerances.tsx`** - Intolerances
- **`disliked-foods.tsx`** - Disliked foods
- **`cultural-restrictions.tsx`** - Cultural restrictions

#### Other Screens
- **`camera-tutorial.tsx`** - Camera permission and tutorial
- **`notifications.tsx`** - Notification preferences
- **`privacy.tsx`** - Privacy settings
- **`account-creation.tsx`** - Account creation
## 🔄 State Management and Data Structure

### Onboarding Context Structure (✅ COMPLETED)
**File:** `contexts/onboarding-context.tsx`

**Complete data structure for 28 screens:**
```typescript
interface OnboardingContextType {
  // Profile information (6 screens)
  profile: {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    age: number;
    gender: 'male' | 'female' | 'other';
    height: number;
    currentWeight: number;
    profilePhoto?: string;
  };

  // Goals information (5 screens)
  goals: {
    primaryGoal: 'weight_loss' | 'maintenance' | 'muscle_gain' | 'healthy_eating';
    targetWeight?: number;
    weeklyGoal: number;
    timeline: number;
    motivation: number;
  };

  // Activity information (5 screens)
  activity: {
    level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
    occupation: 'office' | 'physical' | 'mixed';
    exerciseTypes: string[];
    exerciseFrequency: number;
    sleepHours: number;
  };

  // Diet information (5 screens)
  diet: {
    type: string;
    allergies: string[];
    intolerances: string[];
    dislikedFoods: string[];
    culturalRestrictions: string[];
  };

  // Preferences (4 screens)
  preferences: {
    notifications: {
      mealReminders: boolean;
      waterReminders: boolean;
      exerciseReminders: boolean;
      dailySummary: boolean;
      achievements: boolean;
    };
    privacy: {
      dataSharing: boolean;
      analytics: boolean;
      marketing: boolean;
    };
  };

  // Calculated values
  calculatedValues: {
    bmr: number;
    tdee: number;
    dailyCalorieGoal: number;
    macros: {
      protein: number;
      carbs: number;
      fats: number;
    };
  };

  // Navigation
  currentStep: number;
  completedSteps: number[];
  isCompleted: boolean;
}
```

### Data Synchronization (✅ COMPLETED)
- **Local Storage:** AsyncStorage for offline persistence
- **Cloud Sync:** Firestore synchronization
- **Auto-save:** Automatic save after each step
- **Recovery:** Resume from where left off

### Calculation Logic (✅ COMPLETED)
- **BMR:** Harris-Benedict equation
- **TDEE:** Activity level multipliers
- **Calorie Goals:** Adjusted based on goals
- **Macros:** Dynamic macro distribution
- **Validation:** Validation logic for all fields

## 🚀 Priority Development Steps

### Critical (P0) - Urgent Completion Needed
1. **Profile Screens (6)**
   - `last-name.tsx` - Last name input
   - `date-of-birth.tsx` - Date of birth and age calculation
   - `gender.tsx` - Gender selection
   - `height.tsx` - Height information (cm)
   - `weight.tsx` - Weight information (kg)
   - `profile-photo.tsx` - Profile photo

2. **Goals Detail Screens (4)**
   - `goals-weight.tsx` - Target weight setting
   - `goals-weekly.tsx` - Weekly goals
   - `goals-timeline.tsx` - Timeline
   - `goals-motivation.tsx` - Motivation level

3. **Activity Screens (3)**
   - `activity.tsx` - Activity level
   - `exercise-frequency.tsx` - Exercise frequency
   - `sleep-hours.tsx` - Sleep pattern

### Medium Priority (P1)
4. **Diet Screens (3)**
   - `diet.tsx` - Diet type
   - `allergies.tsx` - Allergies
   - `disliked-foods.tsx` - Disliked foods

5. **Critical Integration Screens (2)**
   - `account-creation.tsx` - Account creation
   - `notifications.tsx` - Notification preferences

### Low Priority (P2)
6. **Remaining Screens (5)**
   - `occupation.tsx`, `exercise-types.tsx`
   - `intolerances.tsx`, `cultural-restrictions.tsx`
   - `camera-tutorial.tsx`, `privacy.tsx`

## 🔧 Technical Requirements

### Dependencies
1. **Firebase/Firestore** - ✅ Available, needs testing
2. **Image Assets** - ❌ Figma images need to be added to project
3. **Navigation** - ✅ Expo-router working
4. **Theme System** - ✅ Working, needs verification

### Infrastructure Checklist
- [ ] Firestore services need to be tested
- [ ] Theme system needs verification
- [ ] Image assets need integration
- [ ] Error handling needs to be added
- [ ] Loading states need implementation

## 📊 Test Strategy

### Required Tests
1. **Unit Tests** - ✅ Ready for context and calculation logic
2. **Integration Tests** - Context synchronization
3. **UI Tests** - Component rendering and interactions
4. **E2E Tests** - Complete onboarding journey
5. **Accessibility Tests** - Screen reader and navigation

### Performance Tests
- [ ] App Launch: < 3 seconds
- [ ] Screen Transitions: < 300ms
- [ ] Form validation: < 100ms
- [ ] Firestore sync: < 1 second

## 📱 Deployment and Rollout

### Feature Flags
- [ ] Gradual rollout for new screens
- [ ] Infrastructure for A/B testing
- [ ] Rapid rollback capability

### Version Management
- [ ] Onboarding version control
- [ ] Data migration strategies
- [ ] Backward compatibility

---

## 💡 Summary and Status

**Current Status:** %20 Complete (5/28 screens)
**Infrastructure:** ✅ Complete (Context, UI Components, Storage)
**Critical Path:** 13 screens need completion
**Estimated Time:** 2-3 weeks (critical path complete)

**Strengths:**
- ✅ Complete state management infrastructure
- ✅ Modern UI component system
- ✅ Advanced calculation logic
- ✅ Firestore synchronization

**Weaknesses:**
- ❌ %80 screens not implemented
- ❌ Image assets integration
- ❌ Error handling
- ❌ Performance optimization

---

## 📱 Usage Examples

### Starting Onboarding
```typescript
import { router } from 'expo-router';

// From app entry point
if (!user.onboardingCompleted) {
  router.push('/onboarding/welcome');
}
```

### Using Onboarding Data
```typescript
import { useOnboarding } from '../contexts/onboarding-context';

const MyComponent = () => {
  const { profile, goals, calculatedValues } = useOnboarding();

  // Use calculated calorie goals
  const dailyGoal = calculatedValues.dailyCalorieGoal;

  // Display user progress
  const progressText = `Hello ${profile.firstName}!`;

  // Target weight calculation
  const targetWeight = goals.targetWeight;
  const currentWeight = profile.currentWeight;
  const weightDifference = targetWeight - currentWeight;
};
```

### Theme Integration
```typescript
import { ThemeProvider } from '../contexts/theme-context';
import { OnboardingProvider } from '../contexts/onboarding-context';
import { UserProvider } from '../contexts/user-context';

export default function App() {
  return (
    <ThemeProvider>
      <OnboardingProvider>
        <UserProvider>
          <YourApp />
        </UserProvider>
      </OnboardingProvider>
    </ThemeProvider>
  );
}
```

### Firestore Synchronization
```typescript
import { useOnboardingSync } from '../hooks/use-onboarding-sync';

const OnboardingWrapper = () => {
  const { syncWithFirestore } = useOnboardingSync();

  // Sync when onboarding is completed
  const handleComplete = async () => {
    await syncWithFirestore();
    // Navigate to main app
  };

  return <OnboardingFlow onComplete={handleComplete} />;
};
```

### Form Validation Example
```typescript
// Validation pattern for profile information
const validateProfile = (profile: ProfileData) => {
  const errors: ValidationError[] = [];

  if (!profile.firstName || profile.firstName.length < 2) {
    errors.push({ field: 'firstName', message: 'Name must be at least 2 characters' });
  }

  if (profile.age < 14 || profile.age > 100) {
    errors.push({ field: 'age', message: 'Age must be between 14-100' });
  }

  if (profile.height < 100 || profile.height > 250) {
    errors.push({ field: 'height', message: 'Height must be between 100-250 cm' });
  }

  return errors;
};
---
## 📋 Screen-by-Screen Detailed Specifications

### 🏗️ Technical Architecture

**Directory Structure:**
```
app/
├── onboarding/
│   ├── _layout.tsx ✅
│   ├── index.tsx ✅
│   ├── welcome.tsx ✅
│   ├── name.tsx ✅
│   ├── goals-primary.tsx ✅
│   ├── summary.tsx ✅
│   ├── commitment.tsx ✅
│   └── [23 remaining screens] 🚧
contexts/
├── onboarding-context.tsx ✅
├── user-context.tsx ✅
└── theme-context.tsx ✅
hooks/
└── use-onboarding-sync.ts ✅
components/ui/
├── button.tsx ✅
└── input.tsx ✅
```

**Context Integration Pattern:**
```typescript
// Pattern to be used in every onboarding screen
import { useOnboarding } from '../contexts/onboarding-context';
import { useTheme } from '../contexts/theme-context';
import { Button, Input } from '../components/ui';

const OnboardingScreen = () => {
  const { profile, updateProfile, nextStep } = useOnboarding();
  const { theme } = useTheme();

  // Screen logic
};
```

**Navigation Pattern:**
```typescript
// Expo-router file-based routing
router.push('/onboarding/name');     // Name input
router.push('/onboarding/goals-primary'); // Primary goals
router.push('/onboarding/summary');  // Summary
```

### 🎯 Implementation Guidelines

**Mandatory Features for Every Screen:**
1. **Progress Indicator** - Shows current step
2. **Back Button** - Return to previous step (except first screen)
3. **Skip Option** - Skip option (optional)
4. **Validation** - Form validation and error handling
5. **Auto-save** - Automatic save on every change
6. **Theme Integration** - Theme support
7. **Loading States** - Loading and error states

**Validation Rules:**
```typescript
// Common validation pattern
const validationRules = {
  firstName: { required: true, minLength: 2, maxLength: 50 },
  age: { required: true, min: 14, max: 100 },
  height: { required: true, min: 100, max: 250 }, // cm
  weight: { required: true, min: 30, max: 300 }, // kg
  targetWeight: { min: 30, max: 300 },
  weeklyGoal: { min: -2, max: 2 }, // kg per week
  motivation: { min: 1, max: 10 },
};
```

**UI Component Pattern:**
```typescript
// Basic structure to be used in every screen
import React from 'react';
import { View, ScrollView } from 'react-native';
import { useTheme } from '../contexts/theme-context';
import { Button } from '../components/ui';

const OnboardingScreenTemplate = ({ children, onContinue, canContinue }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.content}>
        {children}
      </ScrollView>
      <View style={styles.footer}>
        <Button
          onPress={onContinue}
          disabled={!canContinue}
          variant="primary"
        >
          Continue
        </Button>
      </View>
    </View>
  );
};
```

### 🔧 Technical Dependencies

**Required Packages:**
```json
{
  "expo-router": "^3.0.0",      // File-based navigation
  "@react-navigation/native": "^6.0.0",
  "firebase": "^10.0.0",        // Firestore integration
  "@react-native-async-storage/async-storage": "^1.19.0",
  "react-native-vector-icons": "^10.0.0", // Icons
  "react-native-date-picker": "^4.2.0", // Date input
  "react-native-image-picker": "^7.0.0"  // Profile photo
}
```

**Firebase Configuration:**
```typescript
// Firestore collection structure
interface FirestoreUser {
  uid: string;
  onboarding: {
    profile: ProfileData;
    goals: GoalsData;
    activity: ActivityData;
    diet: DietData;
    preferences: PreferencesData;
    calculatedValues: CalculatedValues;
    completedAt: Timestamp;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 📱 Platform-Specific Considerations

**iOS:**
- NSDatePicker usage
- Native permission handling
- App Store review guidelines

**Android:**
- Material Design guidelines
- Permission request flow
- Back navigation handling

**Web (Expo Web):**
- Responsive design
- Web-compatible inputs
- LocalStorage fallback

---

**Summary:** This document shows the current status of the CaloriTrack onboarding system, completed and missing features, and recommended development path. Although the infrastructure is ready, screens critical for user experience need to be completed.