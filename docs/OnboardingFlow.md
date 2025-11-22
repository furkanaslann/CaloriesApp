# CaloriTrack - Onboarding Flow Implementation Status

## Overview

CaloriTrack uygulaması için kapsamlı bir onboarding süreci geliştirilmektedir. Kullanıcıların uygulama ile tanışması, kişisel hedefler belirlemesi ve temel özellikleri öğrenmesi için tasarlanan bu akış, kullanıcıların uygulamayı etkili bir şekilde kullanmasını ve uzun vadeli etkileşim sağlamayı amaçlamaktadır.

**Current Implementation Status: %20 Complete** (5/28 screens implemented)

## 🎨 Design System Implementation

**TAMAMLANDI:** Kapsamlı tasarım sistemi aşağıdaki yapıyla uygulanmıştır:

### UI Components (`/components/ui/`)
- **button.tsx:** ✅ Tamamlandı - Temalı bileşen 3 varyant (primary, secondary, ghost)
- **input.tsx:** ✅ Tamamlandı - Modern floating label tasarımı ve validation

### Context Providers (`/contexts/`)
- **onboarding-context.tsx:** ✅ Tamamlandı - 28 ekran için complete state yönetimi
- **user-context.tsx:** ✅ Tamamlandı - Firestore senkronizasyonu
- **theme-context.tsx:** ✅ Tamamlandı - Tema sağlayıcısı

### Hooks (`/hooks/`)
- **use-onboarding-sync.ts:** ✅ Tamamlandı - Onboarding ile User context senkronizasyonu

## Technical Infrastructure

- **Platform:** React Native with Expo Router
- **State Management:** React Context API (Onboarding + Theme + User)
- **Storage:** AsyncStorage + Firestore synchronization
- **Navigation:** Expo Router (file-based routing)
- **Design System:** Modern purple color palette with gradient effects
- **Calculations:** Harris-Benedict BMR/TDEE calculations with dynamic macro distribution

## 🎯 Onboarding Flow Implementation Status

### ✅ Tamamlanan Ekranlar (5/28)

#### 1. Welcome Screen
**Dosya:** `app/onboarding/welcome.tsx` ✅ **TAMAMLANDI**

**Özellikler:**
- Modern 5 slayt onboarding flow
- Smooth transitions ve pagination
- Progress indicators
- Theme entegrasyonu

**UI Elements:**
- Horizontal scrollable slides
- Smooth slide transitions
- Progress dots with active state
- Themed button components

#### 2. Name Input Screen
**Dosya:** `app/onboarding/name.tsx` ✅ **TAMAMLANDI**

**Özellikler:**
- Modern input design
- Progress indicators
- Validation logic
- Theme integration

#### 3. Primary Goals Screen
**Dosya:** `app/onboarding/goals-primary.tsx` ✅ **TAMAMLANDI**

**Özellikler:**
- Interactive goal selection cards
- Color-coded goals
- Icon integration
- Visual goal selection

#### 4. Summary Screen
**Dosya:** `app/onboarding/summary.tsx` ✅ **TAMAMLANDI**

**Özellikler:**
- Dynamic calculation display
- Progress visualization
- Figma image integration
- Results preview

#### 5. Commitment Screen
**Dosya:** `app/onboarding/commitment.tsx` ✅ **TAMAMLANDI**

**Özellikler:**
- Form validation
- Firestore integration
- Preview functionality
- Final confirmation

### 🚧 Tamamlanmamış Ekranlar (23/28)

#### Profile Bilgileri Ekranları
- **`last-name.tsx`** - Soy isim girişi
- **`date-of-birth.tsx`** - Doğum tarihi ve yaş hesaplama
- **`gender.tsx`** - Cinsiyet seçimi
- **`height.tsx`** - Boy bilgisi
- **`weight.tsx`** - Kilo bilgisi
- **`profile-photo.tsx`** - Profil fotoğrafı

#### Goals Detay Ekranları
- **`goals-weight.tsx`** - Hedef kilo belirleme
- **`goals-weekly.tsx`** - Haftalık hedefler
- **`goals-timeline.tsx`** - Zaman çizelgesi
- **`goals-motivation.tsx`** - Motivasyon seviyesi

#### Activity Bilgileri Ekranları
- **`activity.tsx`** - Aktivite seviyesi
- **`occupation.tsx`** - Meslek tipi
- **`exercise-types.tsx`** - Egzersiz tipleri
- **`exercise-frequency.tsx`** - Egzersiz sıklığı
- **`sleep-hours.tsx`** - Uyku düzeni

#### Diet Bilgileri Ekranları
- **`diet.tsx`** - Diyet tipi
- **`allergies.tsx`** - Alerjiler
- **`intolerances.tsx`** - İntoleranslar
- **`disliked-foods.tsx`** - Sevilmediği yiyecekler
- **`cultural-restrictions.tsx`** - Kültürel kısıtlamalar

#### Diğer Ekranlar
- **`camera-tutorial.tsx`** - Kamera izni ve tutorial
- **`notifications.tsx`** - Bildirim tercihleri
- **`privacy.tsx`** - Gizlilik ayarları
- **`account-creation.tsx`** - Hesap oluşturma
## 🔄 State Management ve Veri Yapısı

### Onboarding Context Structure (✅ Tamamlanmış)
**Dosya:** `contexts/onboarding-context.tsx`

**28 ekran için complete veri yapısı:**
```typescript
interface OnboardingContextType {
  // Profile bilgileri (6 ekran)
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

  // Goals bilgileri (5 ekran)
  goals: {
    primaryGoal: 'weight_loss' | 'maintenance' | 'muscle_gain' | 'healthy_eating';
    targetWeight?: number;
    weeklyGoal: number;
    timeline: number;
    motivation: number;
  };

  // Activity bilgileri (5 ekran)
  activity: {
    level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
    occupation: 'office' | 'physical' | 'mixed';
    exerciseTypes: string[];
    exerciseFrequency: number;
    sleepHours: number;
  };

  // Diet bilgileri (5 ekran)
  diet: {
    type: string;
    allergies: string[];
    intolerances: string[];
    dislikedFoods: string[];
    culturalRestrictions: string[];
  };

  // Preferences (4 ekran)
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

  // Hesaplanan değerler
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

### Veri Senkronizasyonu (✅ Tamamlanmış)
- **Local Storage:** AsyncStorage ile offline persistence
- **Cloud Sync:** Firestore ile senkronizasyon
- **Auto-save:** Her adımda otomatik kayıt
- **Recovery:** Kesintiden sonra devam etme

### Hesaplama Mantığı (✅ Tamamlanmış)
- **BMR:** Harris-Benedict denklemi
- **TDEE:** Aktivite seviyesi çarpanları
- **Calorie Goals:** Hedeflere göre ayarlanmış
- **Macros:** Dinamik makro dağılımı
- **Validation:** Tüm alanlar için validation logic

## 🚀 Öncelikli Geliştirme Adımları

### Kritik (P0) - Acil Tamamlanması Gerekenler
1. **Profile Ekranları (6)**
   - `last-name.tsx` - Soy isim girişi
   - `date-of-birth.tsx` - Doğum tarihi ve yaş hesaplama
   - `gender.tsx` - Cinsiyet seçimi
   - `height.tsx` - Boy bilgisi (cm)
   - `weight.tsx` - Kilo bilgisi (kg)
   - `profile-photo.tsx` - Profil fotoğrafı

2. **Goals Detay Ekranları (4)**
   - `goals-weight.tsx` - Hedef kilo belirleme
   - `goals-weekly.tsx` - Haftalık hedefler
   - `goals-timeline.tsx` - Zaman çizelgesi
   - `goals-motivation.tsx` - Motivasyon seviyesi

3. **Activity Ekranları (3)**
   - `activity.tsx` - Aktivite seviyesi
   - `exercise-frequency.tsx` - Egzersiz sıklığı
   - `sleep-hours.tsx` - Uyku düzeni

### Orta Öncelik (P1)
4. **Diet Ekranları (3)**
   - `diet.tsx` - Diyet tipi
   - `allergies.tsx` - Alerjiler
   - `disliked-foods.tsx` - Sevilmediği yiyecekler

5. **Kritik Entegrasyon Ekranları (2)**
   - `account-creation.tsx` - Hesap oluşturma
   - `notifications.tsx` - Bildirim tercihleri

### Düşük Öncelik (P2)
6. **Kalan Ekranlar (5)**
   - `occupation.tsx`, `exercise-types.tsx`
   - `intolerances.tsx`, `cultural-restrictions.tsx`
   - `camera-tutorial.tsx`, `privacy.tsx`

## 🔧 Teknik Gereksinimler

### Bağımlılıklar
1. **Firebase/Firestore** - ✅ Mevcut, test edilmeli
2. **Image Assets** - ❌ Figma image'lar projeye eklenmeli
3. **Navigation** - ✅ Expo-router çalışıyor
4. **Theme System** - ✅ Çalışıyor, doğrulanmalı

### Altyapı Kontrol Listesi
- [ ] Firestore servisleri test edilmeli
- [ ] Theme system doğrulanmalı
- [ ] Image assets entegre edilmeli
- [ ] Error handling eklenmeli
- [ ] Loading states implement edilmeli

## 📊 Test Stratejisi

### Gerekli Testler
1. **Unit Tests** - ✅ Context ve calculation logic için hazır
2. **Integration Tests** - Context senkronizasyonu
3. **UI Tests** - Component rendering ve interactions
4. **E2E Tests** - Complete onboarding journey
5. **Accessibility Tests** - Screen reader ve navigation

### Performance Testleri
- [ ] App Launch: < 3 saniye
- [ ] Screen Transitions: < 300ms
- [ ] Form validation: < 100ms
- [ ] Firestore sync: < 1 saniye

## 📱 Deployment ve Rolaut

### Feature Flags
- [ ] Yeni ekranlar için gradual rollout
- [ ] A/B testing için altyapı
- [ ] Rapid rollback capability

### Version Management
- [ ] Onboarding version control
- [ ] Data migration strategies
- [ ] Backward compatibility

---

## 💡 Özet ve Durum

**Mevcut Durum:** %20 Complete (5/28 screens)
**Altyapı:** ✅ Complete (Context, UI Components, Storage)
**Kritik Yol:** 13 ekranın tamamlanması gerekiyor
**Tahmini Süre:** 2-3 hafta ( Critical path complete)

**Güçlü Yönler:**
- ✅ Complete state management altyapısı
- ✅ Modern UI component sistemi
- ✅ Advanced calculation logic
- ✅ Firestore senkronizasyonu

**Eksiklikler:**
- ❌ %80 ekran implement edilmedi
- ❌ Image assets entegrasyonu
- ❌ Error handling
- ❌ Performance optimization

---

## 📱 Kullanım Örnekleri

### Onboarding'i Başlatma
```typescript
import { router } from 'expo-router';

// App entry point'den
if (!user.onboardingCompleted) {
  router.push('/onboarding/welcome');
}
```

### Onboarding Verilerini Kullanma
```typescript
import { useOnboarding } from '../contexts/onboarding-context';

const MyComponent = () => {
  const { profile, goals, calculatedValues } = useOnboarding();

  // Hesaplanan kalori hedeflerini kullanma
  const dailyGoal = calculatedValues.dailyCalorieGoal;

  // Kullanıcı progress'ini gösterme
  const progressText = `Merhaba ${profile.firstName}!`;

  // Hedef kilo hesaplaması
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

### Firestore Senkronizasyonu
```typescript
import { useOnboardingSync } from '../hooks/use-onboarding-sync';

const OnboardingWrapper = () => {
  const { syncWithFirestore } = useOnboardingSync();

  // Onboarding tamamlandığında senkronizasyon
  const handleComplete = async () => {
    await syncWithFirestore();
    // Navigate to main app
  };

  return <OnboardingFlow onComplete={handleComplete} />;
};
```

### Form Validation Örneği
```typescript
// Profile bilgileri için validation pattern
const validateProfile = (profile: ProfileData) => {
  const errors: ValidationError[] = [];

  if (!profile.firstName || profile.firstName.length < 2) {
    errors.push({ field: 'firstName', message: 'İsim en az 2 karakter olmalıdır' });
  }

  if (profile.age < 14 || profile.age > 100) {
    errors.push({ field: 'age', message: 'Yaş 14-100 arasında olmalıdır' });
  }

  if (profile.height < 100 || profile.height > 250) {
    errors.push({ field: 'height', message: 'Boy 100-250 cm arasında olmalıdır' });
  }

  return errors;
};
---
## 📋 Ekran Başına Detaylı Spesifikasyonlar

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
// Her onboarding ekranında kullanılacak pattern
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
router.push('/onboarding/name');     // İsim girişi
router.push('/onboarding/goals-primary'); // Ana hedefler
router.push('/onboarding/summary');  // Özet
```

### 🎯 Implementation Guidelines

**Her Ekran İçin Zorunlu Özellikler:**
1. **Progress Indicator** - Hangi adımda olduğunu göster
2. **Back Button** - Önceki adıma dönüş (1. ekran hariç)
3. **Skip Option** - Atla seçeneği (isteğe bağlı)
4. **Validation** - Form validation ve error handling
5. **Auto-save** - Her değişiklikte otomatik kayıt
6. **Theme Integration** - Tema desteği
7. **Loading States** - Loading ve error state'leri

**Validation Kuralları:**
```typescript
// Ortak validation pattern
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
// Her ekranda kullanılacak temel structure
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
          Devam Et
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
- NSDatePicker kullanımı
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

**Özet:** Bu doküman, CaloriTrack onboarding sisteminin mevcut durumunu, tamamlanan ve eksik olan özellikleri, ve geliştirme için önerilen yolu göstermektedir. Altyapı hazır olmasına rağmen, kullanıcı deneyimi için kritik olan ekranların tamamlanması gerekmektedir.