# CaloriTrack Firebase Functions

Bu proje, CaloriTrack mobil uygulaması için Firebase Functions içerir. Gemini 2.0 Flash API entegrasyonu ile yiyecek fotoğraf analizi yapar.

## 🚀 Kurulum

1. Firebase CLI kurulumu:
```bash
npm install -g firebase-tools
```

2. Firebase'e login ol:
```bash
firebase login
```

3. Proje ayarları:
```bash
firebase use your-project-id
```

4. Bağımlılıkları yükle:
```bash
npm install
```

## 🔑 API Anahtarı Yapılandırması

Gemini API anahtarını güvenli şekilde yapılandırmak için:

```bash
firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY"
```

## 📦 Deploy

```bash
firebase deploy --only functions
```

## 🧪 Yerel Test

```bash
npm run serve
```

## 🔗 API Endpoints

### Yiyecek Analizi
- **POST** `/analyzeFood`
- Body: `{ imageBase64: string, userPrompt?: string }`
- Yiyecek görselini analiz eder ve besin değerlerini döndürür

**Response Format:**
```json
{
  "food_name": "Yemek adı",
  "calories": 150,
  "protein": 12,
  "carbs": 20,
  "fat": 6,
  "fiber": 3,
  "ingredients": ["malzeme1", "malzeme2"],
  "health_tips": ["sağlık ipucu1"],
  "confidence_score": 0.85
}
```

## 🔧 Güvenlik

- ✅ API anahtarı client-side'da exposed değil
- ✅ Firebase Functions config'inde güvenli saklanıyor
- ✅ CORS ayarları yapılandırılmış
- ✅ Input validation ve sanitization
- ✅ Error handling ve logging

## 📊 Firestore Collections

- `food_analysis` - Yiyecek analiz sonuçları ve timestamp