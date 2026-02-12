# Firebase Emulator Seed Script

Bu script, Firebase Emulator'a test verisi yüklemek için kullanılır. Auth kullanıcısı ve 2 haftalık gerçekçi öğün verisi içerir.

## Kullanım

### 1. Firebase Emulator'ı Başlat

Proje kök dizininde:

```bash
firebase emulators:start
```

Veya sadece gerekli emulator'ları başlatmak için:

```bash
firebase emulators:start --only firestore,auth,functions,storage
```

### 2. Environment Ayarları

**Önemli**: Hem Firestore hem Auth emulator host'larını belirtmelisiniz.

PowerShell (Windows):
```powershell
cd functions
$env:FIRESTORE_EMULATOR_HOST = "localhost:8080"
$env:FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099"
npm run seed:emulator
```

Bash/Zsh (Mac/Linux):
```bash
cd functions
export FIRESTORE_EMULATOR_HOST=localhost:8080
export FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
npm run seed:emulator
```

**Not**: Script, `FIRESTORE_EMULATOR_HOST` varsa otomatik olarak Auth emulator'ı da kullanır, ama açıkça belirtmek daha güvenlidir.

### 3. Seed Script'i Çalıştır

```bash
npm run seed:emulator
```

## Ne Oluşturulur?

### Auth Kullanıcısı
- **UID**: `testUser1`
- **Email**: `test@example.com`
- **Password**: `DevTest123!`
- **Email Verified**: `true`

### Firestore Dokümanı
- **Path**: `users/testUser1`
- **onboardingCompleted**: `true`
- **Profile**: Test User, 30 yaş, erkek, 178cm, 78kg
- **Goals**: Kilo kaybı, hedef 72kg
- **Calculated Values**: 2000 kcal/gün hedefi

### Meals (Son 14 Gün)
- `users/testUser1/meals/{mealId}`
- Bazı günler: Tam dolu (kahvaltı, öğle, akşam, snack)
- Bazı günler: Kısmen dolu (1-2 öğün)
- Bazı günler: Boş (hiç öğün yok)
- Her öğün gerçekçi kalori, besin değerleri ve portion bilgileri içerir

## Otomatik Dev Login

**Önemli**: Uygulama development modda (`__DEV__`) otomatik olarak `test@example.com` kullanıcısı ile giriş yapar.

Bu sayede:
- ✅ Her app restart'ında onboarding'i atlayıp direkt dashboard/paywall'a gidersiniz
- ✅ Seed verilerini anında test edebilirsiniz
- ✅ Manuel giriş yapmanıza gerek kalmaz

### Otomatik Login'i Devre Dışı Bırakmak

Eğer normal onboarding flow'unu test etmek isterseniz:

1. `src/app/_layout.tsx` içinde `autoLoginInDev` fonksiyon çağrısını yoruma alın
2. Veya emulator'da `test@example.com` kullanıcısını silin

## Script İçeriği

### Dosya Konumu
```
functions/src/scripts/seedEmulator.ts
```

### Çalıştırma Komutu
```json
// package.json
{
  "scripts": {
    "seed:emulator": "npm run build && node lib/scripts/seedEmulator.js"
  }
}
```

### Güvenlik

Script, **sadece emulator ortamı** için çalışır:
```typescript
function ensureEmulator(): void {
  const isUsingEmulator =
    !!process.env.FIRESTORE_EMULATOR_HOST ||
    process.env.FUNCTIONS_EMULATOR === "true";

  if (!isUsingEmulator) {
    console.error("This seed script is designed to run against the Firestore emulator only.");
    process.exit(1);
  }
}
```

Bu sayede **production Firebase'e yanlışlıkla veri yazma riski yoktur**.

## Troubleshooting

### "Unable to detect a Project Id" hatası
**Sebep**: Emulator host env variable'ı set edilmemiş olabilir  
**Çözüm**: 
```powershell
$env:FIRESTORE_EMULATOR_HOST = "localhost:8080"
$env:FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099"
```

### "Invalid Firebase app options" hatası
**Sebep**: Admin SDK credential hatası  
**Çözüm**: Environment variable'ları doğru set ettiğinizden emin olun. Script otomatik olarak emulator modunu algılamalı.

### "auth/user-not-found" hatası (uygulamada)
**Sebep**: Seed script'i çalıştırmayı unutmuş olabilirsiniz  
**Çözüm**: 
```bash
cd functions
npm run seed:emulator
```

### Uygulamada hâlâ onboarding ekranı görüyorum

**Olası sebepler:**

1. **Auth kullanıcısı anonim değil mi kontrol et**
   - Firebase Emulator UI → Authentication → `test@example.com` görünmeli

2. **Firestore'da onboardingCompleted kontrolü**
   - Firebase Emulator UI → Firestore → `users/testUser1`
   - `onboardingCompleted` field'ı `true` olmalı

3. **Console loglarını kontrol et**
   - Görmeli: `"🔧 DEV: Auto-login with test user..."`
   - Ardından: `"✅ DEV: Auto-login successful"`

4. **App cache temizle**
   - Android: Settings → Apps → CaloriesApp → Clear Storage
   - iOS: `npx expo start --clear`

### Meals görünmüyor

**Kontrol listesi:**

1. **Emulator UI'da kontrol et**:
   ```
   Firestore → users → testUser1 → meals (koleksiyon)
   ```
   14 güne yayılmış meal dokümanları olmalı

2. **UID eşleşmesini kontrol et**:
   - Auth'taki kullanıcı UID'si: `testUser1`
   - Firestore meals path'i: `users/testUser1/meals`

3. **Seed script log'larını kontrol et**:
   ```
   Seeding 3 meals for 2026-01-29...
   Seeding 4 meals for 2026-01-31...
   ```

## Tekrar Seed Etme

Emulator'ı **kapatıp açtığınızda** tüm data silinir. Yeniden seed etmek için:

```bash
# Emulator zaten açıksa, sadece seed'i tekrar çalıştır
cd functions
npm run seed:emulator
```

Script, mevcut `testUser1` verilerini temizleyip yeniden oluşturur.

## Daha Fazla Bilgi

- [Development Guide](./DEVELOPMENT_GUIDE.md) - Genel geliştirme akışı
- [Emulator Setup](./EMULATOR_SETUP.md) - Cache ve logout detayları

---

**Not**: Bu script development ve test amaçlıdır. Production ortamında çalışmaz ve çalışmamalıdır.
