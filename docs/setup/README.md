# Setup Dokümanları

Bu klasör, CaloriesApp projesinin kurulum ve geliştirme ortamı ile ilgili tüm rehberleri içerir.

## 📚 Doküman Listesi

### 🚀 [Development Guide](./DEVELOPMENT_GUIDE.md)
**En önemli doküman!** Yerel geliştirme için başlangıç noktası.

İçerik:
- Firebase Emulator kurulumu
- Test verisi yükleme (seed script)
- Otomatik dev login
- Cache temizleme
- Troubleshooting

**Öncelik**: ⭐⭐⭐ (Her geliştirici okumalı)

---

### 🌱 [Seed Script](./SEED_SCRIPT.md)
Firebase Emulator'a test verisi yükleme rehberi.

İçerik:
- Seed script kullanımı
- Ne oluşturulur (test user, meals)
- Detaylı troubleshooting

**Öncelik**: ⭐⭐ (Development Guide'dan sonra)

---

### 🔥 [Emulator Setup](./EMULATOR_SETUP.md)
Firebase Emulator login/logout sistemi ve cache yönetimi.

İçerik:
- Auth + Firestore senkronizasyonu
- Cache temizleme yöntemleri
- Test senaryoları

**Öncelik**: ⭐ (Gerektiğinde referans)

---

### 💳 [RevenueCat Setup](./REVENUECAT_SETUP.md)
RevenueCat entegrasyonu kurulum rehberi.

İçerik:
- RevenueCat dashboard ayarları
- iOS/Android konfigürasyonu
- Test kullanıcıları

**Öncelik**: ⭐⭐ (Premium features için gerekli)

---

### 🔄 [RevenueCat Reactivation](./REVENUECAT_REACTIVATION.md)
Abonelik yenileme ve reaktivasyon akışları.

**Öncelik**: ⭐ (Premium geliştirirken)

---

### ⚡ [Quick Start](./QUICK_START.md)
Projenin genel kurulum rehberi.

İçerik:
- İlk kurulum adımları
- Bağımlılıklar
- Temel komutlar

**Öncelik**: ⭐⭐⭐ (Projeye ilk başlarken)

---

## 🎯 Hızlı Başlangıç

Yeni bir geliştirici olarak şu sırayı takip edin:

1. **[Quick Start](./QUICK_START.md)** - Projeyi kur
2. **[Development Guide](./DEVELOPMENT_GUIDE.md)** - Emulator ile çalıştır
3. **[Seed Script](./SEED_SCRIPT.md)** - Test verisi yükle
4. Kodlamaya başla! 🚀

---

## 💡 İpuçları

### Günlük Geliştirme
```bash
# 1. Emulator'ı başlat (bir kere)
firebase emulators:start

# 2. İlk kez veya data sıfırlamak istiyorsan
cd functions && npm run seed:emulator

# 3. Uygulamayı başlat
npm start
```

### Sorun Giderme
- Önce [Development Guide - Troubleshooting](./DEVELOPMENT_GUIDE.md#troubleshooting) bölümüne bak
- Cache sorunları için [Emulator Setup](./EMULATOR_SETUP.md)'a bak
- Hala çözemediysen: Team'e sor!

---

## 📂 Diğer Doküman Klasörleri

- **/docs/features** - Özellik dokümantasyonu
- **/docs/architecture** - Mimari ve tasarım
- **/docs/implementation** - Uygulama detayları
- **/docs/api** - API dokümantasyonu
- **/docs/product** - Ürün gereksinimleri

---

**Son güncelleme**: 2026-02-12
