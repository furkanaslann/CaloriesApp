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

5. Environment değişkenlerini yapılandır (örnek dosyayı kopyalayın):
```bash
cp .env.example .env
```

6. Environment değişkenlerini düzenle ve set et:
```bash
firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY"
```

## 🔑 API Anahtarı Yapılandırması

Gemini API anahtarını güvenli şekilde yapılandırmak için:

1. **Firebase Config (Önerilen):**
```bash
firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY"
```

2. **Environment Variable (Yerel geliştirme için):**
`.env` dosyasına ekle:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## 📦 Geliştirme ve Deploy

### Development
```bash
# Build ve watch
npm run build:watch

# Local emulator
npm run serve

# Functions shell
npm run shell
```

### Testing
```bash
# Unit testler
npm test

# Linting
npm run lint
npm run lint:fix
```

### Production Deploy
```bash
# Build ve deploy
npm run deploy

# Sadece deploy
firebase deploy --only functions
```

## 🔗 API Endpoints

### 1. Yiyecek Analizi
- **POST** `/analyzeFood`
- Body: `{ imageBase64: string, userPrompt?: string, userId?: string }`
- Yiyecek görselini analiz eder ve besin değerlerini döndürür

**Request Example:**
```json
{
  "imageBase64": "base64_encoded_image_data",
  "userPrompt": "Bu yemeği analiz et ve kalori hesapla",
  "userId": "optional_user_id"
}
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "food_name": "Yemek adı",
    "calories": 150,
    "protein": 12,
    "carbs": 20,
    "fat": 6,
    "fiber": 3,
    "ingredients": ["malzeme1", "malzeme2"],
    "health_tips": ["sağlık ipucu1"],
    "confidence_score": 0.85
  },
  "timestamp": "2025-12-04T12:00:00.000Z"
}
```

### 2. Health Check
- **GET** `/health`
- Servis sağlığını kontrol eder

### 3. Gemini Test
- **POST** `/testGemini`
- Gemini API bağlantısını test eder
- Body: `{ testPrompt?: string }`

## 🔧 Özellikler ve Güvenlik

### Güvenlik
- ✅ API anahtarı client-side'da exposed değil
- ✅ Firebase Functions config'inde güvenli saklanıyor
- ✅ CORS ayarları yapılandırılmış
- ✅ Input validation ve sanitization
- ✅ Base64 image validation
- ✅ Prompt sanitization (length ve karakter limit)
- ✅ Rate limiting preparation
- ✅ Request/response logging

### Error Handling
- ✅ Comprehensive error catching
- ✅ Structured error responses
- ✅ Request ID tracking
- ✅ Timeout handling (30s)
- ✅ Fallback response for parse errors

### Performance
- ✅ TypeScript compilation
- ✅ Response caching headers
- ✅ Optimized Gemini API calls
- ✅ Request timeout management

## 📊 Firestore Collections

- `food_analysis` - Yiyecek analiz sonuçları
  ```typescript
  {
    food_name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    ingredients: string[];
    health_tips: string[];
    confidence_score: number;
    timestamp: FirebaseFirestore.Timestamp;
    user_id: string;
    image_hash?: string;
  }
  ```

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Local Testing
```bash
# Start emulators
npm run serve

# Test with curl
curl -X POST http://localhost:5001/your-project/us-central1/analyzeFood \
  -H "Content-Type: application/json" \
  -d '{"imageBase64":"base64_data"}'
```

### Integration Tests
Firebase emulator suite ile test edilebilir.

## 📝 Logging ve Monitoring

### Console Logging
- Request ID tracking
- Processing time measurement
- Structured error logs
- Success/failure rates

### Firebase Monitoring
- Functions metrics
- Error reporting
- Performance monitoring
- Custom events

## 🔄 Continuous Deployment

### GitHub Actions (Opsiyonel)
`.github/workflows/firebase.yml` dosyası oluşturulabilir:

```yaml
name: Deploy Firebase Functions
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: w9jds/firebase-action@master
        with:
          args: deploy --only functions
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

## 🐛 Debugging

### Local Debugging
```bash
# Verbose logging
DEBUG=* firebase functions:shell

# Breakpoint debugging (VS Code)
# launch.json configuration ekle
```

### Common Issues
1. **API Key Error:** Firebase config kontrol et
2. **Timeout:** Image boyutunu küçült
3. **Parse Error:** Gemini response formatını kontrol et
4. **Memory Error:** Function timeout'ını artır

## 📚 Additional Resources

- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [TypeScript Firebase Functions](https://firebase.google.com/docs/functions/typescript)
- [Testing Firebase Functions](https://firebase.google.com/docs/functions/unit-testing)