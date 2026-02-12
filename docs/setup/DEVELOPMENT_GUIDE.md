# 🚀 Development Kılavuzu

Bu kılavuz, CaloriesApp'i yerel geliştirme ortamında Firebase Emulator ile çalıştırmak için gereken tüm adımları içerir.

## 📋 İçindekiler

1. [Firebase Emulator Kurulumu](#firebase-emulator-kurulumu)
2. [Test Verisi ile Başlatma (Seed Script)](#test-verisi-ile-başlatma)
3. [Otomatik Dev Login](#otomatik-dev-login)
4. [Normal Geliştirme Akışı](#normal-geliştirme-akışı)
5. [Cache Temizleme](#cache-temizleme)
6. [Troubleshooting](#troubleshooting)

---

## Firebase Emulator Kurulumu

### 1. Emulator'ı Başlat

Proje kök dizininde:

```bash
firebase emulators:start
```

Veya sadece gerekli servisleri başlatmak için:

```bash
firebase emulators:start --only firestore,auth,functions,storage
```

### 2. Emulator UI

Tarayıcıda açılır: **http://localhost:4000**

Buradan şunları görebilirsiniz:
- **Authentication**: Kullanıcılar
- **Firestore**: Database içeriği
- **Functions**: Cloud functions logları
- **Storage**: Yüklenen dosyalar

---

## Test Verisi ile Başlatma

### Hızlı Başlangıç

**PowerShell (Windows):**
```powershell
# Terminal 1: Emulator'ı başlat
firebase emulators:start

# Terminal 2: Seed script'i çalıştır
cd functions
$env:FIRESTORE_EMULATOR_HOST = "localhost:8080"
$env:FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099"
npm run seed:emulator
```

**Bash/Zsh (Mac/Linux):**
```bash
# Terminal 1: Emulator'ı başlat
firebase emulators:start

# Terminal 2: Seed script'i çalıştır
cd functions
export FIRESTORE_EMULATOR_HOST=localhost:8080
export FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
npm run seed:emulator
```

### Ne Oluşturulur?

#### Test Kullanıcısı
- **Email**: `test@example.com`
- **Password**: `DevTest123!`
- **UID**: `testUser1`
- **Onboarding**: Tamamlanmış

#### Test Verileri
- **Profile**: 30 yaş, erkek, 178cm, 78kg
- **Goals**: Kilo kaybı, hedef 72kg, 2000 kcal/gün
- **Meals**: Son 14 güne yayılmış gerçekçi öğün verileri
  - Bazı günler tam dolu (kahvaltı, öğle, akşam, snack)
  - Bazı günler kısmen dolu (1-2 öğün)
  - Bazı günler boş

### Detaylı Bilgi

Seed script hakkında daha fazla bilgi için: [SEED_SCRIPT.md](./SEED_SCRIPT.md)

---

## Otomatik Dev Login

### Nasıl Çalışır?

Uygulama **development modda** (`__DEV__`) otomatik olarak test kullanıcısı ile giriş yapar:

```typescript
// src/app/_layout.tsx içinde
if (__DEV__ && (!user || user.isAnonymous)) {
  await auth().signInWithEmailAndPassword(
    'test@example.com',
    'DevTest123!'
  );
}
```

### Avantajları

✅ **Hızlı Test**: Her restart'ta onboarding'i atla  
✅ **Gerçekçi Veriler**: Seed edilmiş 2 haftalık meal verisi  
✅ **Sıfır Kurulum**: İlk açılışta direkt dashboard/paywall  

### Beklenen Akış

1. Uygulamayı aç
2. Console'da gör: `🔧 DEV: Auto-login with test user...`
3. Ardından: `✅ DEV: Auto-login successful`
4. **Direkt paywall veya dashboard ekranına git**

### Devre Dışı Bırakma

Eğer onboarding flow'unu test etmek isterseniz:

**Yöntem 1:** Kodu yoruma al
```typescript
// src/app/_layout.tsx içinde
// if (__DEV__ && (!user || user.isAnonymous)) {
//   await autoLoginInDev();
// }
```

**Yöntem 2:** Test kullanıcısını sil
- Firebase Emulator UI → Authentication → `test@example.com`'u sil

---

## Normal Geliştirme Akışı

### Günlük Kullanım

```bash
# 1. Emulator'ı başlat (bir kere)
firebase emulators:start

# 2. İlk kez veya data sıfırlamak istiyorsan: Seed çalıştır
cd functions
npm run seed:emulator

# 3. Uygulamayı başlat
npm start
# veya
npx expo start
```

### Emulator Her Restart'ta Sıfırlanır

⚠️ **Önemli**: Firebase Emulator kapatıp açtığınızda tüm data silinir.

**Data'yı korumak için:**
- Emulator'ı açık bırakın (geliştirme boyunca)
- Veya her restart'ta seed script'i tekrar çalıştırın

---

## Cache Temizleme

### Problem: "Eski data hala görünüyor!"

Firebase Emulator yanında, **React Native app'in kendi cache'i** de var (AsyncStorage + Firebase client cache).

### Çözüm 1: App Cache Temizle (EN ETKİLİ)

**Android Emulator:**
1. Settings → Apps → CaloriesApp
2. **Clear Storage** (veya **Clear Data**)
3. Uygulamayı yeniden aç

**iOS Simulator:**
```bash
# Simulator'daki tüm app data'sını sil
npx expo start --clear
```

### Çözüm 2: Developer Menu Reload

1. Uygulamada `Ctrl+M` (Windows) / `Cmd+M` (Mac) / Shake (mobil)
2. **"Reload"** seç

### Çözüm 3: Tam Temizlik

```bash
# 1. Emulator'ı durdur
# Ctrl+C

# 2. App cache'ini temizle (yukarıdaki Çözüm 1)

# 3. Emulator'ı yeniden başlat
firebase emulators:start

# 4. Seed script'i tekrar çalıştır
cd functions
npm run seed:emulator

# 5. Uygulamayı başlat
npm start
```

---

## Troubleshooting

### "Unable to detect a Project Id"

**Sebep**: Emulator env variable'ları set edilmemiş  
**Çözüm**:
```powershell
$env:FIRESTORE_EMULATOR_HOST = "localhost:8080"
$env:FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099"
```

### "auth/user-not-found" (Uygulamada)

**Sebep**: Seed script çalıştırılmamış  
**Çözüm**:
```bash
cd functions
npm run seed:emulator
```

### Onboarding Ekranı Görünüyor (Dev Login Çalışmıyor)

**Olası sebepler:**

1. **Seed çalıştırılmadı**
   ```bash
   npm run seed:emulator
   ```

2. **Emulator kapatıldı/data silindi**
   - Emulator'ı yeniden başlat
   - Seed'i tekrar çalıştır

3. **App cache eski**
   - Android: Clear Storage
   - iOS: `npx expo start --clear`

4. **Console log kontrolü**
   - Görmeli: `"🔧 DEV: Auto-login with test user..."`
   - Görmüyorsan: `_layout.tsx`'te `autoLoginInDev` çağrısını kontrol et

### "Meals görünmüyor"

**Kontrol listesi:**

1. Firestore Emulator UI'da kontrol et:
   - `users/testUser1/meals` koleksiyonu var mı?
   
2. UID eşleşiyor mu?
   - Auth'taki UID: `testUser1`
   - Firestore path: `users/testUser1`
   
3. App cache temizle ve tekrar dene

### "Import/export" Kullanmak İstiyorum

```bash
# Emulator data'sını export et
firebase emulators:export ./emulator-data

# Export edilmiş data ile başlat
firebase emulators:start --import=./emulator-data

# Çıkışta otomatik export
firebase emulators:start --import=./emulator-data --export-on-exit
```

---

## Yararlı Linkler

- [Firebase Emulator Setup](./EMULATOR_SETUP.md) - Cache ve logout detayları
- [Seed Script Dokümanı](./SEED_SCRIPT.md) - Seed script detayları
- [Quick Start](./QUICK_START.md) - Proje genel kurulum

---

## Özet Komutlar

```bash
# Tek seferlik kurulum
firebase emulators:start                    # Terminal 1
cd functions && npm run seed:emulator       # Terminal 2
npm start                                    # Terminal 3

# Günlük kullanım
# Emulator zaten açıksa, sadece:
npm start

# Data sıfırla
firebase emulators:start                    # Ctrl+C ile önce durdur
cd functions && npm run seed:emulator       # Yeniden seed et
```

**İyi geliştirmeler!** 🚀
