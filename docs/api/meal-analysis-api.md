# Meal Analysis API Documentation

## Overview
Meal Analysis API, Gemini 2.0 Flash yapay zeka modelini kullanarak yiyecek görsellerini analiz eder ve detaylı besin değerleri sağlar.

## Current Response Fields

### Basic Nutrition Information
- `food_name` (string): Yiyeceğin adı
- `calories` (number): Toplam kalori (kcal)
- `protein` (number): Protein miktarı (gram)
- `carbs` (number): Karbonhidrat miktarı (gram)
- `fat` (number): Yağ miktarı (gram)
- `fiber` (number): Lif miktarı (gram)

### Additional Information
- `ingredients` (array[]): Malzeme listesi
- `health_tips` (array[]): Sağlık ipuçları
- `confidence_score` (number): Güven skoru (0-1 arası)

## New Enhanced Fields

### Health & Quality Metrics
- `health_score` (number): Sağlık skoru (1-10 arası)
  - 1-3: Düşük sağlıklı
  - 4-6: Orta sağlıklı
  - 7-8: Sağlıklı
  - 9-10: Çok sağlıklı
- `allergens` (array[]): Potansiyel alerjenler
  - Örnek: ["gluten", "lactose", "nuts", "shellfish"]
- `processing_level` (string): İşleme seviyesi
  - "unprocessed" - İşlenmemiş
  - "minimally_processed" - Minimum işlenmiş
  - "processed" - İşlenmiş
  - "ultra_processed" - Ultra işlenmiş

### Detailed Nutrition
- `sugar` (number): Şeker miktarı (gram)
- `sodium` (number): Sodyum miktarı (mg)
- `cholesterol` (number): Kolesterol miktarı (mg)
- `saturated_fat` (number): Doymuş yağ (gram)
- `unsaturated_fat` (number): Doymamış yağ (gram)

### Vitamins & Minerals
- `vitamins` (object): Vitaminler
  - `vitamin_a` (number): A vitamini (IU)
  - `vitamin_c` (number): C vitamini (mg)
  - `vitamin_d` (number): D vitamini (IU)
  - `vitamin_e` (number): E vitamini (mg)
  - `vitamin_k` (number): K vitamini (mcg)
  - `thiamine` (number): B1 vitamini (mg)
  - `riboflavin` (number): B2 vitamini (mg)
  - `niacin` (number): B3 vitamini (mg)
  - `vitamin_b6` (number): B6 vitamini (mg)
  - `folate` (number): B9 vitamini (mcg)
  - `vitamin_b12` (number): B12 vitamini (mcg)

- `minerals` (object): Mineraller
  - `calcium` (number): Kalsiyum (mg)
  - `iron` (number): Demir (mg)
  - `magnesium` (number): Magnezyum (mg)
  - `phosphorus` (number): Fosfor (mg)
  - `potassium` (number): Potasyum (mg)
  - `zinc` (number): Çinko (mg)
  - `copper` (number): Bakır (mg)
  - `manganese` (number): Manganez (mg)
  - `selenium` (number): Selenyum (mcg)

### Meal Analysis
- `meal_type` (string): Öğün tipi
  - "breakfast" - Kahvaltı
  - "lunch" - Öğle yemeği
  - "dinner" - Akşam yemeği
  - "snack" - Atıştırmalık
  - "dessert" - Tatlı
  - "beverage" - İçecek
  - "other" - Diğer

- `cuisine_type` (string): Mutfak türü
  - Örnek: "turkish", "italian", "chinese", "mexican", "american", "mediterranean"

- `cooking_method` (string): Pişirme yöntemi
  - Örnek: "grilled", "fried", "baked", "steamed", "boiled", "raw"

### Dietary Information
- `dietary_restrictions` (array[]): Diyet kısıtlamaları
  - "vegetarian" - Vejetaryen
  - "vegan" - Vegan
  - "gluten_free" - Glutensiz
  - "dairy_free" - Süt ürünü içermeyen
  - "keto" - Ketojenik
  - "paleo" - Paleo
  - "low_carb" - Düşük karbonhidratlı
  - "low_fat" - Düşük yağlı
  - "low_sodium" - Düşük sodyumlu
  - "sugar_free" - Şekersiz

### Recommendations
- `suggestions` (array[]): Öneriler
  - "add_vegetables" - Sebze ekle
  - "reduce_salt" - Tuz azalt
  - "choose_lean_protein" - Yağsız protein seç
  - "add_fiber" - Lif ekle
  - "portion_control" - Porsiyon kontrolü

### Detailed Ingredients
- `ingredient_details` (array[]): Detaylı malzeme bilgileri
  ```json
  [
    {
      "name": "string",
      "amount": "number",
      "unit": "string",
      "notes": "string"
    }
  ]
  ```

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // All fields listed above
  },
  "timestamp": "2025-01-12T10:30:00.000Z",
  "statusCode": 200
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2025-01-12T10:30:00.000Z",
  "statusCode": 400
}
```

## Health Score Calculation

Health score, aşağıdaki faktörlere göre hesaplanır:

- İşleme seviyesi (%30)
- Besin yoğunluğu (%25)
- Şeker ve sodyum oranı (%20)
- Lif içeriği (%15)
- Doymuş yağ oranı (%10)

## Processing Levels

1. **Unprocessed (İşlenmemiş)**
   - Taze meyve ve sebzeler
   - Çiğ et ve balık
   - Tam tahıllar

2. **Minimally Processed (Minimum İşlenmiş)**
   - Dondurulmuş meyve/sebze
   - Haşlanmış veya buğulanmış yiyecekler
   - Basit fermentation ürünleri

3. **Processed (İşlenmiş)**
   - Konserve yiyecekler
   - Ekmek ve hamur işleri
   - Peynir

4. **Ultra Processed (Ultra İşlenmiş)**
   - Paketli atıştırmalıklar
   - Hazır yemekler
   - Şekerli içecekler

## Usage Examples

### Request
```javascript
const response = await fetch('https://us-central1-calories-app-185b6.cloudfunctions.net/analyzeFood', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    imageBase64: 'base64_encoded_image',
    userPrompt: 'Bu yemeği analiz et',
    userId: 'user123'
  })
});
```

### Enhanced Response Example
```json
{
  "success": true,
  "data": {
    "food_name": "Akşam Yemeği Tabağı",
    "calories": 650,
    "protein": 32,
    "carbs": 58,
    "fat": 28,
    "fiber": 8,
    "sugar": 12,
    "sodium": 890,
    "cholesterol": 85,
    "saturated_fat": 8,
    "unsaturated_fat": 18,
    "health_score": 7,
    "ingredients": ["tavuk göğsü", "pilav", "salata", "zeytinyağı"],
    "ingredient_details": [
      {
        "name": "tavuk göğsü",
        "amount": 150,
        "unit": "gram",
        "notes": "ızgara"
      }
    ],
    "allergens": [],
    "processing_level": "minimally_processed",
    "meal_type": "dinner",
    "cuisine_type": "turkish",
    "cooking_method": "grilled",
    "dietary_restrictions": [],
    "vitamins": {
      "vitamin_c": 15,
      "vitamin_a": 320
    },
    "minerals": {
      "iron": 3.2,
      "calcium": 85
    },
    "health_tips": [
      "Daha az tuz kullanabilirsiniz",
      "Yeşil salata eklemek besin değerini artırır"
    ],
    "suggestions": [
      "add_vegetables",
      "reduce_salt"
    ],
    "confidence_score": 0.92
  },
  "timestamp": "2025-01-12T10:30:00.000Z",
  "statusCode": 200
}
```

## Implementation Notes

1. **Required Fields**: `food_name`, `calories`
2. **Optional Fields**: Diğer tüm alanlar opsiyoneldir
3. **Default Values**: Sayısal alanlar için varsayılan değer 0'dır
4. **Validation**: Tüm sayısal değerler minimum 0 olarak doğrulanır
5. **Arrays**: Boş diziler yerine null değerler kabul edilir