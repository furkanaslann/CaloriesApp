# CaloriTrack - Comprehensive Onboarding Flow Design

## Overview

A comprehensive onboarding process has been designed for the CaloriTrack application to help users get acquainted with the app, set personal goals, and learn basic features. This onboarding flow aims to enable users to effectively use the application and achieve long-term engagement.

## 🎨 Design System Implementation

**NEW:** Complete design system has been implemented with the following structure:

### Theme System (`/theme/`)
- **colors.ts:** Complete color palette with light/dark mode support
- **typography.ts:** Font families, sizes, weights, and text styles
- **spacing.ts:** 4px-based spacing system with common patterns
- **border-radius.ts:** Consistent border radius scale
- **shadows.ts:** Platform-specific shadow system
- **animations.ts:** Easing functions, durations, and animation presets
- **index.ts:** Complete theme exports and utilities

### UI Components (`/components/ui/`)
- **button.tsx:** Themed button component with variants and states
- **input.tsx:** Themed input component with validation support

### Context Providers (`/contexts/`)
- **theme-context.tsx:** Theme provider with dark mode support
- **onboarding-context.tsx:** Complete onboarding state management

## Technical Infrastructure

- **Platform:** React Native with Expo Router
- **State Management:** React Context API (Onboarding + Theme)
- **Design System:** Custom theme system with comprehensive styling
- **Animations:** Custom animation system with React Native Animated
- **Storage:** AsyncStorage for onboarding progress
- **Navigation:** Expo Router (file-based routing)
- **Typography:** Inter font family with responsive sizing
- **Color System:** Indigo-based palette with semantic colors

## 🎯 Onboarding Flow Implementation Status

### ✅ Completed Screens

#### 1. Welcome Screen
**File:** `app/onboarding/welcome.tsx` ✅ **COMPLETED**

**Features:**
- Multi-slide welcome carousel with smooth animations
- App branding and introduction
- Interactive progress indicators
- Get started button and skip option
- Responsive design with theme integration

**UI Elements:**
- Horizontal scrollable slides with pagination
- Smooth slide transitions
- Progress dots with active state
- Themed button components
- Consistent spacing and typography

**Technical Details:**
- Uses `ScrollView` with horizontal paging
- State management for current slide
- Theme integration through `useTheme` hook
- Button component integration
- Responsive width calculation

#### 2. Profile Setup Screen
**File:** `app/onboarding/profile.tsx` ✅ **COMPLETED**

**Collected Information:**
- First and last name (text inputs)
- Date of birth with age calculation
- Gender selection (visual cards)
- Height (cm) - numeric input
- Current weight (kg) - numeric input
- Age validation (14-100 range)

**Validations:**
- Name fields: Required validation
- Age: 14-100 range with date picker
- Height: 100-250 cm range
- Weight: 30-300 kg range
- Form validation before navigation

**UI Features:**
- Themed input components with validation
- Visual gender selection with icons
- Date picker integration
- Real-time age calculation
- Error handling and user feedback
- Responsive layout with proper spacing

**Technical Details:**
- DateTimePicker integration for birth dates
- Automatic age calculation from birth date
- Form validation with Alert feedback
- Context state management integration
- Theme-aware styling

#### 3. Goals Setup Screen
**File:** `app/onboarding/goals.tsx` ✅ **COMPLETED**

**Collected Information:**
- Primary goal selection (weight loss, maintenance, muscle gain, healthy eating)
- Target weight calculation
- Weekly goal pacing
- Timeline selection
- Motivation level (1-10 scale)

**Validations:**
- Target weight: 30-300 kg range
- Weekly goal: -2 to +2 kg range
- Motivation: 1-10 range
- Timeline: 1-104 weeks
- Goal consistency validation

**UI Features:**
- Visual goal selection cards with icons and colors
- Interactive motivation selector with emoji indicators
- Timeline and weekly goal quick-select buttons
- Numeric input for custom values
- Progress indicator
- Smart defaults based on goal type

**Technical Details:**
- Complex form state management
- Visual goal selection with color coding
- Smart default suggestions
- Cross-field validation
- Theme integration with consistent styling

### 🚧 In Progress Screens

#### 4. Activity Level Assessment
**File:** `app/onboarding/activity.tsx` 🚧 **PLANNED**

**Planned Features:**
- Activity level selection (Sedentary to Extremely Active)
- Occupation type selection
- Exercise type preferences
- Weekly exercise frequency
- Sleep pattern tracking
- Visual activity level cards

#### 5. Dietary Preferences
**File:** `app/onboarding/diet.tsx` 🚧 **PLANNED**

**Planned Features:**
- Diet type selection (Omnivore, Vegetarian, Vegan, etc.)
- Allergy and intolerance management
- Food preferences and dislikes
- Cultural/religious restrictions
- Search functionality for common foods

### 📋 Remaining Screens

#### 6. Camera Permission and Tutorial
**File:** `app/onboarding/camera-tutorial.tsx` 📋 **PLANNED**

#### 7. Notification Preferences
**File:** `app/onboarding/notifications.tsx` 📋 **PLANNED**

#### 8. Data and Privacy Settings
**File:** `app/onboarding/privacy.tsx` 📋 **PLANNED**

#### 9. Summary and Getting Started
**File:** `app/onboarding/summary.tsx` 📋 **PLANNED**
## 🎨 Design System Integration

All onboarding screens are built using the comprehensive design system:

### Theme Integration
- **Colors:** Semantic color system with light/dark mode support
- **Typography:** Consistent text styles and font families
- **Spacing:** 4px-based spacing system for consistent layouts
- **Components:** Themed Button and Input components
- **Animations:** Smooth transitions and micro-interactions

### UI Components Used
- **Button Component:** Primary, secondary, and ghost variants
- **Input Component:** Text inputs with validation and error states
- **Theme Context:** Light/dark mode support and consistent styling
- **Layout System:** Responsive design with proper spacing

### Accessibility Features
- **Color Contrast:** WCAG compliant color combinations
- **Touch Targets:** Minimum 44x44px touch targets
- **Screen Reader:** Semantic components and proper labeling
- **Keyboard Navigation:** Logical focus management

## 🔄 State Management

### Onboarding Context Structure
```typescript
interface OnboardingContextType {
  profile: UserProfile;
  goals: Goals;
  activity: Activity;
  diet: Diet;
  preferences: Preferences;
  calculatedValues: CalculatedValues;
  currentStep: number;
  completedSteps: number[];
  isCompleted: boolean;
  // Actions
  updateProfile, updateGoals, updateActivity, updateDiet, updatePreferences;
  nextStep, previousStep, goToStep, completeOnboarding;
  saveProgress, loadProgress;
}
```

### Data Persistence
- **Storage:** AsyncStorage for offline data persistence
- **Auto-save:** Progress saved after each step
- **Recovery:** Resume from where left off
- **Version Control:** Data migration support for future updates

### Calculations
- **BMR:** Harris-Benedict equation based on profile data
- **TDEE:** Activity level multipliers
- **Calorie Goals:** Adjusted based on primary goals
- **Macros:** 40/30/30 split (carbs/protein/fats)

## 🚀 Next Steps

### Remaining Development
1. **Activity Screen** - Exercise and lifestyle assessment
2. **Diet Screen** - Dietary preferences and restrictions
3. **Camera Tutorial** - Permission and usage guidance
4. **Notifications** - Preference setup
5. **Privacy** - Data sharing and consent
6. **Summary** - Final review and dashboard transition

### Integration Points
1. **App Router Integration** - Navigation from main app
2. **Theme Provider** - Global theme context setup
3. **API Integration** - User data synchronization
4. **Analytics** - Onboarding funnel tracking
5. **A/B Testing** - Conversion optimization

### Testing Requirements
- **Unit Tests** - Form validation and calculations
- **Integration Tests** - Navigation and data flow
- **UI Tests** - Component rendering and interactions
- **E2E Tests** - Complete onboarding journey
- **Accessibility Tests** - Screen reader and navigation

---

## 📱 Usage

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
  const progressText = `Merhaba ${profile.name}!`;
};
```

### Theme Integration
```typescript
import { ThemeProvider } from '../contexts/theme-context';
import { OnboardingProvider } from '../contexts/onboarding-context';

export default function App() {
  return (
    <ThemeProvider>
      <OnboardingProvider>
        <YourApp />
      </OnboardingProvider>
    </ThemeProvider>
  );
}
**File:** `app/onboarding/goals.tsx`

**Goal Types:**
- Weight Loss
- Maintenance
- Muscle Gain
- Healthy Eating

**Detailed Goals:**
- Target weight
- Timeline (weekly/monthly goals)
- Monthly weight goal (0.5kg - 2kg range)
- Motivation level

**UI Features:**
- Goal selection cards with icons
- Interactive timeline selector
- Visual goal weight indicator
- Progress visualization

### 4. Activity Level Assessment
**File:** `app/onboarding/activity.tsx`

**Activity Levels:**
- Sedentary - Little or no exercise
- Lightly Active - Light exercise 1-3 days per week
- Moderately Active - Moderate exercise 3-5 days per week
- Very Active - Hard exercise 6-7 days per week
- Extremely Active - Physical job or very hard exercise

**Additional Information:**
- Occupation type (Office, Physical, Mixed)
- Preferred exercise types
- Weekly exercise frequency
- Sleep patterns

**UI Features:**
- Visual activity level cards
- Exercise type selection with images
- Weekly schedule selector
- Sleep pattern picker

### 5. Dietary Preferences
**File:** `app/onboarding/diet.tsx`

**Diet Types:**
- Omnivore
- Vegetarian
- Vegan
- Pescatarian
- Ketogenic
- Paleo
- Gluten-free

**Restrictions:**
- Allergies (Peanut, Egg, Dairy, Seafood, etc.)
- Food intolerances (Lactose intolerance, etc.)
- Disliked foods
- Cultural/religious restrictions

**UI Features:**
- Diet type selection with descriptions
- Allergy selection with warning icons
- Multi-select for disliked foods
- Search functionality for common foods

### 6. Camera Permission and Tutorial
**File:** `app/onboarding/camera-tutorial.tsx`

**Features:**
- Camera permission request
- Basic camera usage tutorial
- Food photography tips
- Sample photos

**Tutorial Steps:**
1. Importance of good lighting
2. Framing the food
3. Determining portion size
4. Photographing multiple foods
5. Manual correction options

**UI Features:**
- Interactive tutorial screens
- Camera permission modal
- Sample food photos
- Practice camera mode

### 7. Notification Preferences
**File:** `app/onboarding/notifications.tsx`

**Notification Types:**
- Meal reminders (Breakfast, Lunch, Dinner)
- Water drinking reminders
- Exercise reminders
- Daily summary notifications
- Achievement and milestone notifications

**Timing Options:**
- Customizable notification times
- Frequency selection (daily, weekly)
- Do not disturb hours
- Weekend preferences

**UI Features:**
- Toggle switches for each notification type
- Time picker wheels
- Schedule preview
- Notification sound selection

### 8. Data and Privacy Settings
**File:** `app/onboarding/privacy.tsx`

**Settings:**
- Data sharing preferences
- Analytics and improvement contributions
- Third-party integrations
- Data retention period
- Account security settings

**Information:**
- Privacy policy summary
- GDPR compliance
- Data encryption information
- Communication permissions

**UI Features:**
- Privacy policy summary cards
- Toggle switches for data sharing
- Security options
- Contact preferences

### 9. Summary and Getting Started
**File:** `app/onboarding/summary.tsx`

**Features:**
- Summary of all selections
- Calorie goal display
- Personalized motivational message
- Transition to dashboard button

**Summary Content:**
- Daily calorie goal
- Macro distribution (protein, carbohydrates, fats)
- Recommended meal times
- First week goals

**UI Features:**
- Animated summary cards
- Confetti animation on completion
- Personalized welcome message
- Get started button with micro-interactions

## State Management

### Onboarding Context Structure
```typescript
interface OnboardingContextType {
  // User Profile
  profile: {
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    height: number;
    currentWeight: number;
    profilePhoto?: string;
  };

  // Goals
  goals: {
    primaryGoal: 'weight_loss' | 'maintenance' | 'muscle_gain' | 'healthy_eating';
    targetWeight?: number;
    timeline: number; // weeks
    weeklyGoal: number; // kg per week
    motivation: number; // 1-10 scale
  };

  // Activity
  activity: {
    level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
    occupation: 'office' | 'physical' | 'mixed';
    exerciseTypes: string[];
    exerciseFrequency: number; // per week
    sleepHours: number;
  };

  // Diet
  diet: {
    type: string;
    allergies: string[];
    intolerances: string[];
    dislikedFoods: string[];
    culturalRestrictions: string[];
  };

  // Preferences
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
    bmr: number; // Basal Metabolic Rate
    tdee: number; // Total Daily Energy Expenditure
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

  // Actions
  updateProfile: (data: Partial<UserProfile>) => void;
  updateGoals: (data: Partial<Goals>) => void;
  updateActivity: (data: Partial<Activity>) => void;
  updateDiet: (data: Partial<Diet>) => void;
  updatePreferences: (data: Partial<Preferences>) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  completeOnboarding: () => void;
}
```

## Animations and Transitions

### Page Transitions
- **Slide transition:** Right to left page transition
- **Fade effect:** Fade-in when content loads
- **Scale animation:** Button and card interactions

### Micro-interactions
- **Button press:** Scale down effect (0.95x)
- **Card selection:** Border color change and subtle scale
- **Input focus:** Animated border color change
- **Success states:** Checkmark animations
- **Error states:** Shake animation

### Loading States
- **Skeleton loading:** For form fields
- **Progress indicators:** Between step transitions
- **Spinners:** For API calls

## Data Persistence

### AsyncStorage Structure
```typescript
interface OnboardingStorage {
  isOnboardingCompleted: boolean;
  onboardingData: OnboardingContextType;
  lastUpdated: string;
  version: string;
}
```

### Data Backup
- Automatically save data at each step
- Resume from where left off when app is closed and reopened
- Transfer completed onboarding data to main database

## Error Handling and Validation

### Client-side Validation
- Required field check
- Data type validation
- Range checks (age, height, weight, etc.)
- Format validations (email, phone, etc.)

### Error Handling
- Offline mode for network errors
- User-friendly messages for form validation errors
- Recovery options for lost data
- Restart button for critical errors

## Testing Strategy

### Unit Tests
- Form validation functions
- Calculation functions (BMR, TDEE, etc.)
- Context provider functions

### Integration Tests
- Step-by-step onboarding flow
- Data persistence and recovery
- Navigation between steps

### UI Tests
- Component rendering
- User interactions
- Accessibility compliance

### E2E Tests
- Complete onboarding journey
- Data flow from onboarding to main app
- Error scenarios and recovery

## Performance Optimization

### Code Splitting
- Lazy loading for each onboarding step
- Asset optimization (images, animations)
- Bundle size minimization

### Memory Management
- Cleanup during component unmounting
- Image caching strategies
- Animation performance optimization

### User Experience
- Fast transitions (<300ms)
- Smooth animations (60fps)
- Preloading strategies

## Accessibility

### Screen Reader Support
- Semantic HTML elements
- ARIA labels and descriptions
- Logical tab order

### Visual Accessibility
- High contrast mode support
- Font size scaling
- Color blind friendly design

### Motor Accessibility
- Large tap targets (min 44x44px)
- Gesture alternatives
- Voice control support

## Analytics and Tracking

### User Behavior Tracking
- Drop-off rates at each step
- Time spent per step
- Common error patterns
- Completion rates

### Performance Metrics
- Screen load times
- Animation performance
- Memory usage
- Network request times

## Personalization Features

### Dynamic Content
- Content personalization based on user profile
- Exercise recommendations based on activity level
- Food recommendations based on dietary preferences

### Adaptive UI
- Theme selection based on user preferences
- Language support (Turkish, English, etc.)
- Interface optimization based on usage patterns

## Integration with Other Modules

### Camera Module
- Camera permission management
- Camera tutorial integration
- Photo quality settings

### Notification Module
- Notification permissions
- Scheduled notifications
- Notification preferences

### Database Module
- User data synchronization
- Offline data management
- Data backup and recovery

## Future Developments

### AI-powered Personalization
- Machine learning for goal optimization
- Personal recommendation engine
- Adaptive onboarding process

### Social Features
- Friend invitation system
- Group challenges
- Progress sharing

### Advanced Analytics
- Detailed progress tracking
- Predictive insights
- Health metric integration

## Deployment and Rollout

### Feature Flags
- A/B testing for new onboarding features
- Gradual feature rollout
- Rapid rollback capability

### Version Management
- Onboarding version control
- Data migration strategies
- Backward compatibility

---

This onboarding flow design provides a comprehensive approach to maximize the user experience of the CaloriTrack application, enable users to use the application effectively, and create long-term engagement.