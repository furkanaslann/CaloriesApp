# CaloriesApp - Uygulama Yapısı (App Structure)

## Proje Genel Bakış

CaloriesApp, **Expo Router** tabanlı, **React Native** ve **TypeScript** ile geliştirilen bir kalori takip mobil uygulamasıdır. Uygulama, modern bir tasarım sistemi ile geliştirilmekte olup, kullanıcıların beslenme hedeflerini takip etmelerine yardımcı olur.

## Teknoloji Stack

- **Framework:** Expo SDK ~54.0.25
- **Navigation:** Expo Router 6.0.15
- **Language:** TypeScript
- **UI:** React Native 0.81.5
- **State Management:** React Context API
- **Backend:** Firebase (Authentication & Firestore)
- **Platform Support:** iOS, Android, Web

## Proje Yapısı

```
caloriesApp/
├── android/                      # Android özgü dosyalar ve konfigürasyonlar
├── assets/                       # Statik kaynaklar (resimler, ikonlar)
├── docs/                         # Dokümantasyon dosyaları
│   ├── DesignSystem.md          # Tasarım sistem rehberi
│   ├── PRD.md                   # Ürün gereksinim dokümanı
│   ├── OnboardingFlow.md        # Onboarding akış detayları
│   └── AppStructure.md          # Bu dosya - Uygulama yapısı
├── scripts/                     # Yapılandırma scriptleri
├── src/                         # Ana kaynak kodu dizini
│   ├── app/                     # Expo Router sayfa dosyaları
│   │   ├── (tabs)/             # Tab navigation içindeki sayfalar
│   │   │   ├── _layout.tsx     # Tab navigation layout
│   │   │   ├── index.tsx       # Ana ekran (Dashboard)
│   │   │   └── explore.tsx     # Keşif ekranı
│   │   ├── onboarding/         # Onboarding (kayıt) akışı sayfaları
│   │   │   ├── _layout.tsx     # Onboarding layout
│   │   │   ├── index.tsx       # Onboarding ana sayfa
│   │   │   ├── welcome.tsx     # Hoş geldin ekranı
│   │   │   ├── profile.tsx     # Profil bilgileri
│   │   │   ├── goals-*.tsx     # Hedef belirleme ekranları
│   │   │   ├── activity.tsx    # Aktivite seviyesi
│   │   │   ├── diet.tsx        # Diyet tercihi
│   │   │   ├── camera-tutorial.tsx # Kamera eğitimi
│   │   │   ├── commitment.tsx  # Taahhüt ekranı
│   │   │   └── ...             # Diğer onboarding ekranları
│   │   ├── _layout.tsx         # Ana uygulama layout
│   │   ├── _debug.tsx          # Debug ekranı
│   │   ├── loading.tsx         # Loading ekranı
│   │   └── modal.tsx           # Modal component
│   ├── components/             # Tekrar kullanılabilir component'ler
│   │   ├── ui/                 # UI component'leri
│   │   │   ├── button.tsx      # Buton component'i
│   │   │   ├── input.tsx       # Input field component'i
│   │   │   ├── collapsible.tsx # Açılır/kapanır component
│   │   │   └── icon-symbol.tsx # İkon component'i
│   │   ├── external-link.tsx   # Dış link component'i
│   │   ├── haptic-tab.tsx      # Haptic feedback tab
│   │   ├── hello-wave.tsx      # Merhaba animasyon component'i
│   │   ├── parallax-scroll-view.tsx # Parallax scroll
│   │   ├── themed-text.tsx     # Temalı metin component'i
│   │   └── themed-view.tsx     # Temalı view component'i
│   ├── constants/              # Uygulama sabitleri
│   │   ├── animations.ts       # Animasyon konfigürasyonları
│   │   ├── border-radius.ts    # Border radius değerleri
│   │   ├── colors.ts           # Renk paleti
│   │   ├── firebase.ts         # Firebase konfigürasyonu
│   │   ├── shadows.ts          # Gölge efektleri
│   │   ├── spacing.ts          # Spacing sistemi
│   │   ├── theme.ts            # Tema konfigürasyonu
│   │   ├── typography.ts       # Tipografi kuralları
│   │   └── index.ts            # Sabitlerin export edildiği dosya
│   ├── context/                # React Context'ler
│   │   ├── theme-context.tsx   # Tema context'i
│   │   ├── onboarding-context.tsx # Onboarding verileri
│   │   └── user-context.tsx    # Kullanıcı verileri
│   ├── hooks/                  # Custom hook'lar
│   │   ├── use-color-scheme.ts # Renk şeması hook'u
│   │   ├── use-theme-color.ts  # Tema rengi hook'u
│   │   └── use-onboarding-sync.ts # Onboarding senkronizasyonu
│   └── utils/                  # Yardımcı fonksiyonlar
│       └── firebase.ts         # Firebase yardımcı fonksiyonları
├── .expo/                      # Expo özgü dosyalar
├── .idea/                      # IDE konfigürasyonları
├── .vscode/                    # VS Code ayarları
├── node_modules/               # NPM bağımlılıkları
├── app.json                    # Expo uygulama konfigürasyonu
├── package.json                # NPM bağımlılıkları ve script'ler
├── tsconfig.json              # TypeScript konfigürasyonu
└── README.md                  # Proje açıklaması
```

## Önemli Dosyaların Açıklaması

### 1. Konfigürasyon Dosyaları

- **app.json:** Expo uygulama konfigürasyonu, ikonlar, splash screen ve platform ayarları
- **package.json:** Proje bağımlılıkları, script'ler ve meta bilgiler
- **tsconfig.json:** TypeScript derleyici ayarları

### 2. Ana Yapı Dosyaları

- **src/app/_layout.tsx:** Tüm uygulamanın ana layout yapısı
- **src/app/(tabs)/_layout.tsx:** Tab navigation yapısı
- **src/context/onboarding-context.tsx:** Onboarding sürecindeki kullanıcı verileri
- **src/context/user-context.tsx:** Kullanıcı profili ve ayarları

### 3. Component Yapısı

UI component'leri, **Design System.md** dosyasında belirtilen tasarım kurallarına göre geliştirilmiştir:

- **button.tsx:** Primary, secondary ve ghost button varyasyonları
- **input.tsx:** Form input'ları ve validasyon
- **themed-text.tsx & themed-view.tsx:** Tema desteği sağlayan component'ler

### 4. Sabitler ve Tema

**constants/** dizini, uygulamanın tüm tasarım sabitlerini içerir:

- **colors.ts:** Modern mor temalı renk paleti
- **typography.ts:** Inter font tabanlı tipografi sistemi
- **spacing.ts:** 4px tabanlı spacing grid sistemi
- **shadows.ts:** Subtle gölge efektleri

## Navigation Yapısı

### Ana Akış
1. **Onboarding Flow:** Kullanıcı kayıt ve profil oluşturma
   - Hoş geldin ekranı
   - Profil bilgileri (isim, yaş, cinsiyet, boy, kilo)
   - Hedef belirleme (kilo hedefi, aktivite seviyesi, diyet tercihi)
   - Kamera eğitimi ve ayarlar
   - Taahhüt ve özet

2. **Main App:** Ana uygulama akışı
   - Dashboard (index.tsx)
   - Explore/Keşif (explore.tsx)

### Route Yapısı
- **Root Layout:** src/app/_layout.tsx
- **Tabs Layout:** src/app/(tabs)/_layout.tsx
- **Onboarding Layout:** src/app/onboarding/_layout.tsx

## State Management

### React Context Kullanımı
- **OnboardingContext:** Kayıt sürecindeki form verileri ve ilerleme durumu
- **UserContext:** Kullanıcı profili, hedefler ve ayarlar
- **ThemeContext:** Tema ve renk şeması yönetimi

## Platform Özellikleri

### Firebase Entegrasyonu
- **Authentication:** Kullanıcı girişi ve kayıt
- **Firestore:** Veri tabanı işlemleri
- Google Services konfigürasyon dosyaları mevcut

### Platform Destek
- **iOS:** Bundle identifier, camera permissions, tablet desteği
- **Android:** Adaptive icon, camera permissions, edge-to-edge destek
- **Web:** Statik export, favicon desteği

## Development Script'leri

```json
{
  "start": "expo start",              // Geliştirme sunucusu
  "android": "expo run:android",      // Android build ve çalıştırma
  "ios": "expo run:ios",              // iOS build ve çalıştırma
  "web": "expo start --web",          // Web geliştirme
  "lint": "expo lint",                // Kod kalite kontrolü
  "reset-project": "node ./scripts/reset-project.js" // Proje sıfırlama
}
```

## Build ve Deployment

### Özellikler
- **New Architecture:** React Native yeni mimari etkin
- **React Compiler:** Deneysel React compiler desteği
- **Typed Routes:** TypeScript ile type-safe routing

### Platform Build
- **iOS:** Static frameworks ve native source build
- **Android:** Predictive back gesture devre dışı, edge-to-edge enabled

## Erişim ve İzinler

Uygulama aşağıdaki izinleri gerektirir:
- **Camera:** Yemek fotoğrafları için kamera erişimi
- **Notifications:** Hatırlatıcılar için bildirim izni
- **Storage:** Kullanıcı verilerini saklamak için depolama alanı

## Önemli Notlar

1. **Tasarım Sistemi:** Tüm UI component'leri **DesignSystem.md**'deki kurallara uymalıdır
2. **Dil:** Proje dili Türkçe'dir, tüm mesajlar ve içerik Türkçe olmalıdır
3. **Minimalist Yaklaşım:** "Minimal. Cool. Aesthetic." felsefesine uygun geliştirme
4. **Performance:** Native driver ile animasyonlar ve optimize edilmiş render

---

Bu yapı, AI agent'ların CaloriesApp projesini anlamaları ve üzerinde çalışmaları için kapsamlı bir rehber niteliğindedir.