# Feature Gating Implementation Guide

This guide explains how to implement premium feature gating throughout the CaloriTrack app.

---

## 📚 Overview

Feature gating is controlled by the configuration in `src/config/features.ts`. This file defines all limits and access rules for Free and Premium tiers.

---

## 🔧 Basic Usage

### 1. Check Premium Status

```typescript
import { useRevenueCat } from '@/context/revenuecat-context';
import { getFeatureLimits, checkUsageLimit } from '@/config/features';

function MyComponent() {
  const { isPremium } = useRevenueCat();
  const tier = isPremium ? 'premium' : 'free';
  const limits = getFeatureLimits(tier);
  
  // Check if feature is available
  if (limits.advancedAnalytics) {
    return <AdvancedAnalytics />;
  }
  
  return <UpgradePrompt />;
}
```

### 2. Check Usage Limits

```typescript
import { checkUsageLimit } from '@/config/features';
import { useRevenueCat } from '@/context/revenuecat-context';

function CameraScanner() {
  const { isPremium } = useRevenueCat();
  const tier = isPremium ? 'premium' : 'free';
  const [dailyScans, setDailyScans] = useState(0);
  
  const { allowed, remaining } = checkUsageLimit(
    tier,
    'dailyScanLimit',
    dailyScans
  );
  
  if (!allowed) {
    return <ScanLimitReached remaining={0} />;
  }
  
  return (
    <View>
      <Text>Scans remaining today: {remaining}</Text>
      <CameraButton onScan={handleScan} />
    </View>
  );
}
```

### 3. Feature-Specific Gating

```typescript
import { hasFeature } from '@/config/features';
import { useRevenueCat } from '@/context/revenuecat-context';

function AnalyticsScreen() {
  const { isPremium } = useRevenueCat();
  const tier = isPremium ? 'premium' : 'free';
  
  return (
    <View>
      <DailyView /> {/* Always available */}
      
      {hasFeature(tier, 'weeklyReports') && (
        <WeeklyTrendChart />
      )}
      
      {hasFeature(tier, 'monthlyReports') && (
        <MonthlyInsights />
      )}
      
      {!hasFeature(tier, 'advancedAnalytics') && (
        <UpgradePrompt feature="advancedAnalytics" />
      )}
    </View>
  );
}
```

---

## 🎨 PremiumGate Component

Create a reusable component for gating premium features:

```typescript
// src/components/premium/PremiumGate.tsx
import React from 'react';
import { useRevenueCat } from '@/context/revenuecat-context';
import { 
  getFeatureLimits, 
  checkUsageLimit,
  getUpgradeMessage,
  type FeatureLimits 
} from '@/config/features';
import { UpgradePrompt } from './UpgradePrompt';

interface PremiumGateProps {
  feature: keyof FeatureLimits;
  currentUsage?: number;
  fallback?: 'blur' | 'lock' | 'upgrade' | 'hidden';
  children: React.ReactNode;
}

export const PremiumGate: React.FC<PremiumGateProps> = ({
  feature,
  currentUsage = 0,
  fallback = 'upgrade',
  children,
}) => {
  const { isPremium, isLoading } = useRevenueCat();
  const tier = isPremium ? 'premium' : 'free';
  const limits = getFeatureLimits(tier);
  const featureValue = limits[feature];
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  // Boolean feature check
  if (typeof featureValue === 'boolean') {
    if (featureValue) {
      return <>{children}</>;
    }
    return <UpgradePrompt message={getUpgradeMessage(feature)} />;
  }
  
  // Numeric limit check
  if (typeof featureValue === 'number') {
    const { allowed, remaining } = checkUsageLimit(tier, feature, currentUsage);
    
    if (allowed) {
      return (
        <>
          {children}
          {remaining !== null && remaining < 3 && (
            <LimitWarning remaining={remaining} />
          )}
        </>
      );
    }
    
    return <UpgradePrompt message={getUpgradeMessage(feature)} />;
  }
  
  // Unlimited (null)
  return <>{children}</>;
};
```

**Usage:**

```typescript
<PremiumGate feature="advancedAnalytics">
  <WeeklyTrendChart data={data} />
</PremiumGate>

<PremiumGate 
  feature="dailyScanLimit" 
  currentUsage={dailyScans}
>
  <CameraScanner onScan={handleScan} />
</PremiumGate>
```

---

## 📊 Common Patterns

### 1. AI Scan Limit

```typescript
function CameraScreen() {
  const { isPremium } = useRevenueCat();
  const [dailyScans, setDailyScans] = useState(0);
  const tier = isPremium ? 'premium' : 'free';
  const limits = getFeatureLimits(tier);
  
  const handleScan = async () => {
    const { allowed, remaining } = checkUsageLimit(
      tier,
      'dailyScanLimit',
      dailyScans
    );
    
    if (!allowed) {
      Alert.alert(
        'Scan Limit Reached',
        `You've used all ${limits.dailyScanLimit} scans today. Upgrade to Premium for 50 scans/day.`,
        [
          { text: 'Upgrade', onPress: () => router.push('/paywall') },
          { text: 'OK', style: 'cancel' },
        ]
      );
      return;
    }
    
    // Perform scan
    const result = await performScan();
    setDailyScans(prev => prev + 1);
  };
  
  return (
    <View>
      <Text>Scans today: {dailyScans}/{limits.dailyScanLimit}</Text>
      <CameraButton onPress={handleScan} />
    </View>
  );
}
```

### 2. History Access

```typescript
function MealHistoryScreen() {
  const { isPremium } = useRevenueCat();
  const tier = isPremium ? 'premium' : 'free';
  const limits = getFeatureLimits(tier);
  
  const getMealHistory = async () => {
    const days = limits.mealHistoryDays || 365; // null = unlimited
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return await fetchMealsAfter(cutoffDate);
  };
  
  return (
    <View>
      {!isPremium && (
        <Banner>
          Viewing last {limits.mealHistoryDays} days. 
          Upgrade for unlimited history.
        </Banner>
      )}
      <MealList data={meals} />
    </View>
  );
}
```

### 3. Analytics Gating

```typescript
function ProgressScreen() {
  const { isPremium } = useRevenueCat();
  const tier = isPremium ? 'premium' : 'free';
  const limits = getFeatureLimits(tier);
  
  return (
    <ScrollView>
      <DailyStats /> {/* Always available */}
      
      {limits.weeklyReports && (
        <WeeklyTrendChart />
      )}
      
      {limits.monthlyReports && (
        <MonthlyReport />
      )}
      
      {limits.comparativeAnalysis && (
        <ComparisonChart />
      )}
      
      {!limits.advancedAnalytics && (
        <UpgradeCard 
          title="Unlock Advanced Analytics"
          features={[
            'Weekly & Monthly Reports',
            'Pattern Recognition',
            'Comparative Analysis',
            'Export Reports',
          ]}
        />
      )}
    </ScrollView>
  );
}
```

### 4. Recipe Access

```typescript
function RecipeScreen() {
  const { isPremium } = useRevenueCat();
  const [monthlyRecipes, setMonthlyRecipes] = useState(0);
  const tier = isPremium ? 'premium' : 'free';
  const limits = getFeatureLimits(tier);
  
  const handleViewRecipe = (recipeId: string) => {
    if (!isPremium && limits.monthlyRecipes !== null) {
      if (monthlyRecipes >= limits.monthlyRecipes) {
        Alert.alert(
          'Recipe Limit Reached',
          `You've viewed ${limits.monthlyRecipes} recipes this month. Upgrade for unlimited access.`,
          [
            { text: 'Upgrade', onPress: () => router.push('/paywall') },
            { text: 'OK' },
          ]
        );
        return;
      }
    }
    
    setMonthlyRecipes(prev => prev + 1);
    router.push(`/recipes/${recipeId}`);
  };
  
  return (
    <View>
      {!isPremium && (
        <Text>
          Recipes viewed: {monthlyRecipes}/{limits.monthlyRecipes}
        </Text>
      )}
      <RecipeList onSelect={handleViewRecipe} />
    </View>
  );
}
```

---

## 🎯 Upgrade Prompts

### Standard Upgrade Prompt Component

```typescript
// src/components/premium/UpgradePrompt.tsx
import { useRouter } from 'expo-router';
import { getUpgradeMessage } from '@/config/features';

interface UpgradePromptProps {
  feature?: keyof FeatureLimits;
  message?: string;
  title?: string;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  feature,
  message,
  title = 'Upgrade to Premium',
}) => {
  const router = useRouter();
  const displayMessage = message || (feature ? getUpgradeMessage(feature) : 'Upgrade to Premium');
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{displayMessage}</Text>
      <Button 
        title="View Premium Plans"
        onPress={() => router.push('/paywall')}
      />
    </View>
  );
};
```

---

## 📝 Best Practices

1. **Always check limits before actions** - Don't let users hit limits unexpectedly
2. **Show remaining usage** - Display how many scans/recipes/etc. remain
3. **Soft paywalls** - Show upgrade prompts, don't block completely
4. **Clear messaging** - Explain what premium offers
5. **Track usage** - Monitor which limits users hit most
6. **Graceful degradation** - Free users should still have a good experience

---

## 🔍 Testing

```typescript
// Test feature gating
describe('Feature Gating', () => {
  it('should limit free users to 10 scans/day', () => {
    const { allowed } = checkUsageLimit('free', 'dailyScanLimit', 10);
    expect(allowed).toBe(false);
  });
  
  it('should allow premium users unlimited scans', () => {
    const { allowed } = checkUsageLimit('premium', 'dailyScanLimit', 100);
    expect(allowed).toBe(true);
  });
  
  it('should gate advanced analytics for free users', () => {
    const limits = getFeatureLimits('free');
    expect(limits.advancedAnalytics).toBe(false);
  });
});
```

---

## 📚 Related Documentation

- [PREMIUM_FEATURES.md](./PREMIUM_FEATURES.md) - Complete feature specification
- [REVENUECAT_SETUP.md](../setup/REVENUECAT_SETUP.md) - RevenueCat integration
- `src/config/features.ts` - Feature configuration source code

