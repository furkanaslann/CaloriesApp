# 🔥 Firebase Emulator - Login/Logout Sistemi

## ✅ Sistem Logic'i

Uygulama **Auth ve Firestore senkronizasyonu** ile çalışıyor:

### **Auth + Firestore Sync Kontrolü**
1. ✅ **Auth var** + **Firestore var** + **onboardingCompleted: true**
   → **Dashboard'a git**
   
2. ✅ **Auth var** + **Firestore YOK**
   → **Logout yap** → **Onboarding'e git**
   
3. ✅ **Auth var** + **Firestore var** + **onboardingCompleted: false**
   → **Onboarding'e git**
   
4. ✅ **Auth yok**
   → **Anonymous user oluştur** → **Onboarding'e git**

### **Neden Data Persist Ediyor?**

Emulator kapatıp açtığınızda data kalıyorsa:
- ❌ **Sorun Firebase Emulator değil!**
- ✅ **Sorun: Android Emulator'deki app cache (AsyncStorage + Firebase client cache)**

Firebase Emulator default olarak data persist **etmez**, ancak:
- Android app'in AsyncStorage'ı data cache'liyor
- React Native Firebase client-side cache'i data saklıyor

---

## 🚀 Temiz Başlatma Yöntemleri

### **Yöntem 1: Android App Cache Temizle** (EN ETKİLİ ✨)

**Android Emulator'de:**
1. Uygulamayı kapatın
2. Settings → Apps → CaloriesApp → **Clear Storage**
3. Uygulamayı yeniden açın
4. ✅ **Onboarding flow başlayacak**

**Veya React Native Developer Menu'den:**
1. Uygulamada `Ctrl+M` (Windows) veya `Cmd+M` (Mac) veya emulator'u shake edin
2. **"Reload"** seçin
3. Eğer hala dashboard'a gidiyorsa → Android Settings'ten Clear Storage yapın

---

### **Yöntem 2: Firebase Emulator UI'den Temizle** (Opsiyonel)

**Tarayıcıda:** http://localhost:4000

1. **Authentication** sekmesi → Tüm kullanıcıları silin
2. **Firestore** sekmesi → `users` collection → Tüm dökümanları silin
3. Android app cache'ini de temizleyin (Yöntem 1)
4. Uygulamayı yeniden başlatın

**Not:** Sadece Emulator UI'den silmek yeterli olmayabilir çünkü Android app cache'inde data var!

---

### **Yöntem 3: Emulator + App'i Birlikte Temizle** (TAM TEMİZLİK 🧹)

```powershell
# 1. Firebase Emulator'ı durdur (Ctrl+C)

# 2. Android Emulator'de app cache'ini temizle
# Settings → Apps → CaloriesApp → Clear Storage

# 3. Firebase Emulator'ı yeniden başlat
npm run emulators

# 4. React Native app'i reload et
# Developer Menu (Ctrl+M) → Reload
```

---

## 🧪 Test Senaryoları

### **Senaryo 1: İlk Kurulum (Fresh Install)**
```bash
1. Android app cache'ini temizle (Clear Storage)
2. Firebase Emulator'ı başlat (npm run emulators)
3. Expo app'i başlat (npm run android)
4. ✅ Beklenen: Anonymous user oluşur → Onboarding başlar
```

### **Senaryo 2: Onboarding Tamamlama**
```bash
1. Onboarding flow'unu tamamla
2. ✅ Beklenen: 
   - Firestore'a user document yazılır (onboardingCompleted: true)
   - Dashboard açılır
   - Uygulama kapatıp açınca direkt Dashboard'a gider
```

### **Senaryo 3: Data Sync Kontrolü (Auth var, Firestore yok)**
```bash
1. Firebase Emulator UI'den SADECE Firestore user document'i sil
2. Auth user'ı bırak (silme)
3. Android app'i reload et (Ctrl+M → Reload)
4. ✅ Beklenen: 
   - user-context.tsx logout yapar
   - Onboarding'e yönlendirilir
```

### **Senaryo 4: Tamamen Temiz Başlatma**
```bash
1. Android app cache'ini temizle (Clear Storage)
2. Firebase Emulator'ı durdur (Ctrl+C)
3. Firebase Emulator'ı yeniden başlat (npm run emulators)
4. Android app'i başlat
5. ✅ Beklenen: Her şey sıfırdan başlar → Onboarding
```

---

## 📋 Sistem Dosyaları

### 1. **src/context/user-context.tsx**
```typescript
loadUserData() {
  // Firestore'da document yoksa:
  await auth().signOut(); // Logout yap
  setUserData(null);
}
```

### 2. **src/app/_layout.tsx**
```typescript
// Routing logic:
if (Auth var && Firestore document yok) {
  await auth().signOut(); // Logout
  // user state değişince yeniden başlar → onboarding
}
```

### 3. **src/app/dashboard/index.tsx**
```typescript
// Dashboard'da user kontrolü yapılıyor (simplified)
// Asıl routing _layout.tsx'te
```

---

## 🎯 Özet

### **Sistem Nasıl Çalışıyor?**

1. **Auth ve Firestore senkronize:**
   - Auth var + Firestore var → Dashboard
   - Auth var + Firestore yok → Logout → Onboarding
   - Auth yok → Anonymous user → Onboarding

2. **Data nerede saklanıyor?**
   - Firebase Emulator: Geçici (restart'ta silinir)
   - Android App Cache: Persist ediyor (AsyncStorage + Firebase client cache)

3. **Temiz başlatmak için:**
   - En önemli: **Android app cache'ini temizle** (Clear Storage)
   - Opsiyonel: Firebase Emulator UI'den data sil
   - Her ikisini birden yap en garantili temizlik için

### **Sorun Çözme:**

**Problem:** "Emulator'ü kapattım ama data hala var!"
- **Çözüm:** Android app cache'ini temizle (Settings → Apps → Clear Storage)

**Problem:** "Onboarding yerine Dashboard açılıyor!"
- **Çözüm:** Hem Firebase Emulator UI'den data sil, hem Android app cache'ini temizle

**Problem:** "Her test için temiz başlatmak istiyorum!"
- **Çözüm:** Her test öncesi Android Clear Storage yap

