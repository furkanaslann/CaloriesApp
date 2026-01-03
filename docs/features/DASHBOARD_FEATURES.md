# CaloriTrack - Dashboard Özellikleri Dokümantasyonu

Minimal. Cool. Aesthetic.

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Firestore Entegrasyonu](#firestore-entegrasyonu)
3. [Seri Sistemi (Streak System)](#seri-sistemi-streak-system)
4. [Dashboard Veri Yönetimi](#dashboard-veri-yönetimi)
5. [Bileşenler](#bileşenler)
6. [API ve Servisler](#api-ve-servisler)
7. [Kullanım Örnekleri](#kullanım-örnekleri)
8. [Test ve Hata Ayıklama](#test-ve-hata-ayıklama)

---

## 🎯 Genel Bakış

CaloriTrack dashboard'ı kullanıcıların günlük beslenme ilerlemesini takip ettiği modern, minimalist bir arayüzdür. Firestore ile entegre çalışan sistem aşağıdaki temel özellikleri sunar:

- 🏆 **Günlük Seri Takibi**: Kullanıcıların gün boyunca aktif kalmasını teşvik eden seri sistemi
- 📊 **Gerçek Zamanlı İstatistikler**: Kalori, makro besinler, su tüketimi ve adım takibi
- 📸 **Yemek Tanıma**: AI destekli yemek fotoğrafı analizi
- 🎖️ **Başarı Sistemi**: Kullanıcı motivasyonu için başarı rozetleri
- 📱 **Offline Destek**: AsyncStorage ile yerel veri önbellekleme

---

## 🔥 Firestore Entegrasyonu

### Veri Modeli

Dashboard verileri Firestore'da şu yapıda saklanır:

```
users/{userId}/dashboard/data
```

#### Document Yapısı

```typescript
interface UserDashboardDocument {
  uid: string;
  streakData: StreakData;
  dailyStats: { [date: string]: DailyStats }; // YYYY-MM-DD formatında anahtar-değer
  meals: MealEntry[];
  weeklyProgress: { [weekStart: string]: WeeklyProgress };
  monthlySummaries: { [month: string]: MonthlySummary };
  achievements: Achievement[];
  notifications: DashboardNotification[];
  userProgress: UserProgress;
  createdAt: string;
  updatedAt: string;
}
```

### Firestore Koleksiyonları

- **users**: Ana kullanıcı koleksiyonu
  - `users/{userId}`: Kullanıcı dokümanı
  - `users/{userId}/dashboard/data`: Dashboard verileri
  - `users/{userId}/dashboard/meals`: Yemek kayıtları (gelecekte kullanım için)

---

## 🏆 Seri Sistemi (Streak System)

### Seri Hesaplama Mantığı

Sistemi, kullanıcıların gün içinde uygulama üzerinde etkileşime geçmesini takip eder:

```typescript
// Günlük aktivite kontrolü
const checkDailyActivity = async (userId: string, date: string) => {
  const streakData = await getStreakData(userId);
  const today = new Date(date);

  // Son aktif günü kontrol et
  if (streakData.lastActiveDate) {
    const lastActive = new Date(streakData.lastActiveDate);
    const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Art arda gün - seriyi artır
      streakData.currentStreak += 1;
    } else if (diffDays > 1) {
      // Seri kırıldı - yeniden başla
      streakData.currentStreak = 1;
    }
    // diffDays === 0 ise aynı gün - değişiklik yok
  } else {
    // İlk aktivite - seri başla
    streakData.currentStreak = 1;
  }

  return streakData;
};
```

### Haftalık Görünüm

Sistemi 7 günlük haftalık görünüm sunar:

```typescript
// Haftalık günler (Pazartesi'den Pazar'a)
const weekDays: boolean[] = [
  true,  // Pazartesi
  true,  // Salı
  false, // Çarşamba
  true,  // Perşembe
  false, // Cuma
  true,  // Cumartesi
  false  // Pazar
];
```

### Başarı Sistemi

Seri kilometre taşları için otomatik başarılar:

- **3 Günlük Seri**: "İlk Adımlar" 🏃‍♂️
- **7 Günlük Seri**: "Haftalık Başarı" 🏆
- **14 Günlük Seri**: "İki Haftalık İlerleme" 💪
- **30 Günlük Seri**: "Aylık Zafer" 🔥

---

## 📊 Dashboard Veri Yönetimi

### useDashboard Hook

Dashboard verilerini yönetmek için özel hook:

```typescript
import { useDashboard } from '@/hooks/use-dashboard';

const DashboardComponent = () => {
  const {
    dashboardData,      // Tüm dashboard verisi
    isLoading,          // Yükleme durumu
    isRefreshing,       // Yenileme durumu
    error,              // Hata mesajı
    streakData,         // Seri verileri
    todayStats,         // Bugünkü istatistikler
    recentMeals,        // Son yemekler
    achievements,       // Başarılar
    refreshDashboard,   // Dashboard'u yenile
    addMeal,           // Yemek ekle
    updateDailyStats,  // Günlük istatistikleri güncelle
    updateStreak,      // Seriyi güncelle
  } = useDashboard();

  // Component logic...
};
```

### Dashboard Servisi

Veritabanı işlemleri için `DashboardService` sınıfı:

```typescript
import { dashboardService } from '@/services/dashboard-service';

// Yemek ekleme
const meal = await dashboardService.addMealEntry({
  name: 'Çoban Salata',
  calories: 185,
  time: '12:30',
  type: 'Öğle Yemeği',
  nutrition: {
    protein: 8,
    carbohydrates: 12,
    fats: 7
  }
});

// Seri güncelleme
const streakData = await dashboardService.updateStreakData();
```

---

## 🧩 Bileşenler

### StreakCard Component

7 günlük seri görünümünü sunan ana bileşen:

```typescript
import StreakCard from '@/components/dashboard/streak-card';

<StreakCard
  currentStreak={5}
  bestStreak={12}
  weekDays={[true, true, true, false, true, false, true]}
  onPress={() => router.push('/dashboard/progress')}
/>
```

**Özellikler:**
- 🔥 Animasyonlu alev ikonları
- 📅 Haftalık gün görünümü
- 💫 Tıklama animasyonları
- 🎨 Gradient gölgeler

### Camera Dashboard

Yemek fotoğraf analizi ve hızlı ekleme:

```typescript
// Kamera analizi sonucu
const handleCameraPress = async () => {
  const analyzedMeal = {
    name: 'Mevsim Salata',
    calories: 145,
    time: new Date().toTimeString().slice(0, 5),
    type: 'Öğle Yemeği',
    nutrition: { protein: 6, carbohydrates: 18, fats: 7 },
    confidence: 92
  };

  const addedMeal = await addMeal(analyzedMeal);
};
```

### Progress Dashboard

Detaylı ilerleme analizi:

- 📈 Haftalık kalori grafiği
- 🎯 Aylık hedef takibi
- 🏆 Başarı galerisi
- 📊 İstatistiksel analizler

---

## 🛠 API ve Servisler

### DashboardService Metotları

| Metot | Açıklama | Parametreler | Dönüş Değeri |
|-------|----------|-------------|--------------|
| `getUserDashboardData()` | Dashboard verilerini getir | - | `Promise<UserDashboardDocument>` |
| `addMealEntry()` | Yemek kaydı ekle | `Omit<MealEntry, 'id'>` | `Promise<MealEntry>` |
| `updateStreakData()` | Seri verilerini güncelle | `date?: string` | `Promise<StreakData>` |
| `updateDailyStats()` | Günlük istatistikleri güncelle | `Partial<DailyStats>, date?: string` | `Promise<DailyStats>` |
| `getRecentMeals()` | Son yemekleri getir | `limit?: number` | `Promise<MealEntry[]>` |

### Local Storage Keys

```typescript
const DASHBOARD_STORAGE_KEYS = {
  STREAK_DATA: '@caloritrack_streak_data',
  DAILY_STATS: '@caloritrack_daily_stats',
  RECENT_MEALS: '@caloritrack_recent_meals',
  LAST_ACTIVE_DATE: '@caloritrack_last_active_date',
  ACHIEVEMENTS: '@caloritrack_achievements',
} as const;
```

---

## 💡 Kullanım Örnekleri

### 1. Dashboard Verilerini Yükleme

```typescript
// React component içinde
const { refreshDashboard, isLoading } = useDashboard();

useEffect(() => {
  // İlk yükleme
  refreshDashboard();
}, []);

// Pull-to-refresh için
<ScrollView
  refreshControl={
    <RefreshControl
      refreshing={isRefreshing}
      onRefresh={refreshDashboard}
    />
  }
>
  {/* Dashboard content */}
</ScrollView>
```

### 2. Yemek Ekleme

```typescript
const { addMeal, error } = useDashboard();

const handleAddMeal = async () => {
  try {
    const meal = await addMeal({
      name: 'Yulaf Ezmesi',
      calories: 280,
      time: '08:15',
      type: 'Kahvaltı',
      nutrition: {
        protein: 12,
        carbohydrates: 35,
        fats: 8
      },
      confidence: 92
    });

    console.log('Yemek eklendi:', meal);
  } catch (err) {
    console.error('Hata:', error);
  }
};
```

### 3. Seri Verilerini Güncelleme

```typescript
const { updateStreak, streakData } = useDashboard();

// Kullanıcı uygulama açtığında seriyi güncelle
useEffect(() => {
  const handleAppStateChange = (nextAppState: string) => {
    if (nextAppState === 'active') {
      updateStreak();
    }
  };

  AppState.addEventListener('change', handleAppStateChange);

  return () => {
    AppState.removeEventListener('change', handleAppStateChange);
  };
}, [updateStreak]);
```

---

## 🧪 Test ve Hata Ayıklama

### 1. Veri Kalıcılığını Test Etme

```typescript
// Test script
const testDataPersistence = async () => {
  // Test verisi ekle
  const testMeal = {
    name: 'Test Yemeği',
    calories: 100,
    time: '12:00',
    type: 'Öğle Yemeği' as const,
  };

  const addedMeal = await dashboardService.addMealEntry(testMeal);
  console.log('Added meal:', addedMeal);

  // Veriyi çek
  const recentMeals = await dashboardService.getRecentMeals(1);
  console.log('Recent meals:', recentMeals);

  // Firestore'dan doğrula
  const dashboardData = await dashboardService.getUserDashboardData();
  console.log('Dashboard data:', dashboardData);
};
```

### 2. Seri Hesaplamasını Test Etme

```typescript
const testStreakCalculation = async () => {
  const userId = auth().currentUser?.uid;
  if (!userId) return;

  // Simüle edilmiş tarihlerle seri hesapla
  const testDates = [
    '2024-01-01', // Pazartesi
    '2024-01-02', // Salı
    '2024-01-04', // Perşembe (Çarşamba atlandı)
  ];

  for (const date of testDates) {
    await dashboardService.updateStreakData(date);
    const streakData = await dashboardService.getUserDashboardData();
    console.log(`Date: ${date}, Streak: ${streakData?.streakData.currentStreak}`);
  }
};
```

### 3. Offline Mod Test

```typescript
const testOfflineMode = async () => {
  // İnternet bağlantısını kes
  // AsyncStorage'den veri çekmeyi test et

  const cachedData = await AsyncStorage.getItem(DASHBOARD_STORAGE_KEYS.STREAK_DATA);
  const streakData = cachedData ? JSON.parse(cachedData) : null;

  console.log('Cached streak data:', streakData);

  // İnternet geri geldiğinde senkronizasyon test
  await dashboardService.getUserDashboardData();
};
```

### 4. Hata Yönetimi

```typescript
const { error, clearError } = useDashboard();

// Hata mesajlarını göster
useEffect(() => {
  if (error) {
    Alert.alert('Dashboard Hatası', error, [
      { text: 'Yeniden Dene', onPress: refreshDashboard },
      { text: 'İptal', onPress: clearError }
    ]);
  }
}, [error, refreshDashboard, clearError]);
```

---

## 🔄 Veri Senkronizasyonu

### Online Mod
1. Firebase Auth ile kullanıcı kimliği doğrulama
2. Firestore'dan dashboard verilerini çek
3. Real-time listener ile güncellemeleri takip
4. Değişiklikleri anında Firestore'a yaz

### Offline Mod
1. AsyncStorage'de önbelleğe alınmış verileri kullan
2. Yeni verileri yerel olarak sakla
3. İnternet bağlantısı geri geldiğinde senkronize et
4. Conflict resolution (son yazan kazanır stratejisi)

### Senkronizasyon Akışı

```
Uygulama Açılır
    ↓
Firebase Auth Check → User Context
    ↓
Dashboard Service → getUserDashboardData()
    ↓
Firestore Query ← → AsyncStorage Cache
    ↓
Dashboard State → useDashboard Hook
    ↓
UI Components
```

---

## 📱 Performans Optimizasyonları

### 1. Lazy Loading
- Dashboard verilerini ihtiyaç anında yükle
- Haftalık grafiği sadece progress ekranında oluştur

### 2. Caching
- Sık erişilen verileri AsyncStorage'de sakla
- Resimleri optimize et ve önbelleğe al

### 3. Batch Operations
- Firestore yazma işlemlerini grupla
- Aynı anda birden fazla güncelleme yap

### 4. Memory Management
- Unmounted component'lerin listener'larını temizle
- Büyük veri setlerini sayfala

---

## 🔮 Gelecek Geliştirmeler

### Özellikler (Planlanan)
- [ ] **Detaylı Besin Analizi**: Vitamin ve mineral takibi
- [ ] **Sosyal Özellikler**: Arkadaşlarla paylaşım ve rekabet
- [ ] **AI Önerileri**: Kişiselleştirilmiş yemek önerileri
- [ ] **Entegrasyonlar**: Fitness tracker ve sağlık uygulamaları
- [ ] **İhracat**: Veri dışa aktarma (PDF, CSV)

### Teknik İyileştirmeler
- [ ] **Redux Store**: Global state management
- [ ] **Background Sync**: Arka planda veri senkronizasyonu
- [ ] **Push Notifications**: Hatırlatıcılar ve motivasyon
- [ ] **Analytics**: Kullanıcı davranış takibi
- [ ] **A/B Testing**: UI/UX iyileştirmeleri

---

## 🐞 Bilinen Sorunlar ve Çözümler

| Sorun | Açıklama | Çözüm |
|-------|----------|-------|
| **Seri Sıfırlanması** | Gün geçişinde seri yanlışlıkla sıfırlanabilir | UTC ve yerel saat dilimi kontrolü |
| **Offline Eşitleme** | İnternet kesildiğinde veri kaybı | Conflict resolution mekanizması |
| **Bellek Sızıntısı** | Component unmount edilmediğinde | useEffect cleanup fonksiyonları |
| **Yavaş Yükleme** | Büyük veri setlerinde | Pagination ve lazy loading |

---

## 📞 Destek

Sorularınız veya hata bildirimleriniz için:

- **GitHub Issues**: [Proje Repository](https://github.com/caloritrack)
- **Documentation**: [docs.caloritrack.app](https://docs.caloritrack.app)
- **Email**: support@caloritrack.app

---

**CaloriTrack Dashboard** - Minimal. Cool. Aesthetic. 🚀