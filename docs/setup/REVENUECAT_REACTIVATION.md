# 🔄 RevenueCat Yeniden Aktifleştirme Rehberi

RevenueCat şu anda devre dışı bırakıldı. Yeniden aktifleştirmek için:

## ✅ Hızlı Aktifleştirme

### 1. `src/app/_layout.tsx` dosyasını düzenle:

**Satır ~9:** Import'u aktifleştir:
```typescript
// ÖNCEKİ (Deaktif):
// import { RevenueCatProvider } from '@/context/revenuecat-context'; // DISABLED

// YENİ (Aktif):
import { RevenueCatProvider } from '@/context/revenuecat-context';
```

**Satır ~154:** Paywall yönlendirmesini aktifleştir:
```typescript
// ÖNCEKİ (Deaktif):
console.log('🎯 App: ROUTING TO ONBOARDING - user needs to complete onboarding');
router.replace('/onboarding/welcome');

// YENİ (Aktif):
console.log('🎯 App: ROUTING TO PAYWALL - new user flow');
router.replace('/paywall');
setHasShownPaywall(true);
```

**Satır ~165:** Fallback yönlendirmesini aktifleştir:
```typescript
// ÖNCEKİ (Deaktif):
router.replace('/onboarding/welcome');

// YENİ (Aktif):
router.replace('/paywall');
```

**Satır ~226-232:** Provider'ı aktifleştir:
```typescript
// ÖNCEKİ (Deaktif):
<UserProvider>
  <OnboardingProvider>
    <RootLayoutNav />
  </OnboardingProvider>
</UserProvider>

// YENİ (Aktif):
<UserProvider>
  <RevenueCatProvider>
    <OnboardingProvider>
      <RootLayoutNav />
    </OnboardingProvider>
  </RevenueCatProvider>
</UserProvider>
```

### 2. Uygulamayı yeniden başlat:

```bash
# iOS için
npm run ios

# Android için
npm run android
```

## 📝 Notlar

- Tüm RevenueCat kodu yerinde duruyor, sadece yoruma alındı
- API anahtarları `src/config/revenuecat.ts` dosyasında kayıtlı
- Paywall ekranı `src/app/paywall.tsx` dosyasında mevcut
- Premium komponentleri `src/components/premium/` klasöründe

## 🔑 API Anahtarları

Mevcut durum:
- ✅ Android API Key: Yapılandırıldı
- ⚠️ iOS API Key: Henüz yapılandırılmadı

Aktifleştirmeden önce iOS API anahtarını da `src/config/revenuecat.ts` dosyasına eklemeyi unutmayın.

---

**Yeniden aktifleştirme yaklaşık 2-3 dakika sürer.** 🚀

