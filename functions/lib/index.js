"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeFood = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const axios_1 = __importDefault(require("axios"));
admin.initializeApp();
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
// Get Gemini API key from Firebase Secrets Manager
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
// Debug için API key durumunu logla
console.log('GEMINI_API_KEY exists:', !!GEMINI_API_KEY);
console.log('GEMINI_API_KEY length:', (GEMINI_API_KEY === null || GEMINI_API_KEY === void 0 ? void 0 : GEMINI_API_KEY.length) || 0);
/**
 * Helper function to sanitize user prompt
 */
function sanitizePrompt(prompt) {
    // Remove potentially harmful content and limit length
    const sanitized = prompt.replace(/[<>\"'&]/g, '').trim();
    return sanitized.length > 500 ? sanitized.substring(0, 500) : sanitized;
}
/**
 * Helper function to create consistent response format
 */
function createResponse(success, data, error, statusCode = 200) {
    return {
        success,
        data,
        error,
        timestamp: new Date().toISOString(),
        statusCode
    };
}
/**
 * Gemini 2.5 Flash API ile yiyecek analizi yapan Firebase Function
 * POST /analyzeFood
 * Body: { imageBase64: string, userPrompt?: string, userId?: string }
 */
exports.analyzeFood = functions.https.onRequest({
    secrets: ["GEMINI_API_KEY"],
    region: "us-central1"
}, async (req, res) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substring(7);
    // Validation fonksiyonunu burada tanımla ki requestId erişilebilir olsun
    function isValidBase64Image(data) {
        try {
            console.log(`[${requestId}] Validating base64 image data, length: ${data.length}`);
            // Clean the data - remove whitespace and newlines
            const cleanedData = data.replace(/\s+/g, '').trim();
            console.log(`[${requestId}] Cleaned data length: ${cleanedData.length}`);
            // Check if it's a valid base64 string
            const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
            if (!base64Regex.test(cleanedData)) {
                console.error(`[${requestId}] Invalid base64 format after cleaning`);
                console.error(`[${requestId}] First 100 chars:`, cleanedData.substring(0, 100));
                console.error(`[${requestId}] Last 50 chars:`, cleanedData.slice(-50));
                return false;
            }
            // Check minimum size (at least 100 bytes)
            const sizeInBytes = Math.floor(cleanedData.length * 0.75);
            if (sizeInBytes < 100) {
                console.error(`[${requestId}] Image too small: ${sizeInBytes} bytes`);
                return false;
            }
            // Check maximum size (10MB)
            if (sizeInBytes > 10 * 1024 * 1024) {
                console.error(`[${requestId}] Image too large: ${sizeInBytes} bytes`);
                return false;
            }
            console.log(`[${requestId}] Base64 validation passed, size: ${sizeInBytes} bytes`);
            return true;
        }
        catch (error) {
            console.error(`[${requestId}] Base64 validation error:`, error);
            return false;
        }
    }
    // CORS ayarları
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    if (req.method !== 'POST') {
        console.warn(`[${requestId}] Method not allowed: ${req.method}`);
        res.status(405).json(createResponse(false, null, 'Method not allowed', 405));
        return;
    }
    try {
        const { imageBase64, userPrompt, userId } = req.body;
        const sanitizedPrompt = sanitizePrompt(userPrompt || 'Bu yemeği analiz et ve besin değerlerini tahmin et');
        console.log(`[${requestId}] Request body keys:`, Object.keys(req.body));
        console.log(`[${requestId}] imageBase64 length:`, (imageBase64 === null || imageBase64 === void 0 ? void 0 : imageBase64.length) || 'undefined');
        // Validations
        if (!imageBase64) {
            console.warn(`[${requestId}] No image data provided`);
            res.status(400).json(createResponse(false, null, 'Image data is required', 400));
            return;
        }
        console.log(`[${requestId}] Starting image validation...`);
        if (!isValidBase64Image(imageBase64)) {
            console.warn(`[${requestId}] Invalid image data format`);
            res.status(400).json(createResponse(false, null, 'Invalid image data format', 400));
            return;
        }
        if (!GEMINI_API_KEY) {
            console.error(`[${requestId}] Gemini API key not configured`);
            res.status(500).json(createResponse(false, null, 'Server configuration error', 500));
            return;
        }
        console.log(`[${requestId}] Processing food analysis request...`);
        // Gemini API isteği
        const geminiRequest = {
            contents: [
                {
                    parts: [
                        {
                            text: `${sanitizedPrompt}. Lütfen şu formatta JSON döndür:
              {
                "food_name": "Yemek adı",
                "calories": 150,
                "protein": 12,
                "carbs": 20,
                "fat": 6,
                "fiber": 3,
                "sugar": 8,
                "sodium": 450,
                "cholesterol": 40,
                "saturated_fat": 3,
                "unsaturated_fat": 3,
                "vitamins": {
                  "vitamin_c": 10,
                  "vitamin_a": 200,
                  "vitamin_d": 50
                },
                "minerals": {
                  "iron": 2,
                  "calcium": 80,
                  "potassium": 300
                },
                "health_score": 7,
                "allergens": ["gluten"],
                "processing_level": "minimally_processed",
                "meal_type": "lunch",
                "cuisine_type": "turkish",
                "cooking_method": "grilled",
                "dietary_restrictions": ["gluten_free"],
                "ingredients": ["malzeme1", "malzeme2"],
                "ingredient_details": [
                  {
                    "name": "tavuk",
                    "amount": 150,
                    "unit": "gram",
                    "notes": "ızgara"
                  }
                ],
                "health_tips": ["sağlık ipucu1"],
                "suggestions": ["add_vegetables", "reduce_salt"],
                "confidence_score": 0.85
              }

              Notlar:
              - health_score: 1-10 arası (1=düşük, 10=çok sağlıklı)
              - processing_level: "unprocessed", "minimally_processed", "processed", "ultra_processed"
              - meal_type: "breakfast", "lunch", "dinner", "snack", "dessert", "beverage", "other"
              - dietary_restrictions: "vegetarian", "vegan", "gluten_free", "dairy_free", "keto", "paleo", "low_carb", "low_fat", "low_sodium", "sugar_free"
              - suggestions: "add_vegetables", "reduce_salt", "choose_lean_protein", "add_fiber", "portion_control"`
                        },
                        {
                            inline_data: {
                                mime_type: "image/jpeg",
                                data: imageBase64
                            }
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.1,
                topK: 32,
                topP: 1,
                maxOutputTokens: 4096,
                responseMimeType: "application/json"
            }
        };
        const apiResponse = await axios_1.default.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, geminiRequest, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 30000 // 30 second timeout
        });
        const generatedContent = (_e = (_d = (_c = (_b = (_a = apiResponse.data.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text;
        if (!generatedContent) {
            console.error(`[${requestId}] No content generated from Gemini API`);
            res.status(500).json(createResponse(false, null, 'Failed to generate analysis', 500));
            return;
        }
        // JSON parse et
        let analysisResult;
        try {
            // JSON string'i temizle ve parse et
            const jsonStr = generatedContent.replace(/```json\n?|\n?```/g, '').trim();
            const parsed = JSON.parse(jsonStr);
            // Validate required fields
            if (typeof parsed.food_name !== 'string' || typeof parsed.calories !== 'number') {
                throw new Error('Invalid response format');
            }
            analysisResult = {
                // Basic nutrition
                food_name: parsed.food_name || 'Bilinmeyen Yiyecek',
                calories: Math.max(0, parsed.calories || 0),
                protein: Math.max(0, parsed.protein || 0),
                carbs: Math.max(0, parsed.carbs || 0),
                fat: Math.max(0, parsed.fat || 0),
                fiber: Math.max(0, parsed.fiber || 0),
                // Detailed nutrition
                sugar: parsed.sugar ? Math.max(0, parsed.sugar) : undefined,
                sodium: parsed.sodium ? Math.max(0, parsed.sodium) : undefined,
                cholesterol: parsed.cholesterol ? Math.max(0, parsed.cholesterol) : undefined,
                saturated_fat: parsed.saturated_fat ? Math.max(0, parsed.saturated_fat) : undefined,
                unsaturated_fat: parsed.unsaturated_fat ? Math.max(0, parsed.unsaturated_fat) : undefined,
                // Vitamins and minerals
                vitamins: parsed.vitamins && typeof parsed.vitamins === 'object' ? {
                    vitamin_a: parsed.vitamins.vitamin_a ? Math.max(0, parsed.vitamins.vitamin_a) : undefined,
                    vitamin_c: parsed.vitamins.vitamin_c ? Math.max(0, parsed.vitamins.vitamin_c) : undefined,
                    vitamin_d: parsed.vitamins.vitamin_d ? Math.max(0, parsed.vitamins.vitamin_d) : undefined,
                    vitamin_e: parsed.vitamins.vitamin_e ? Math.max(0, parsed.vitamins.vitamin_e) : undefined,
                    vitamin_k: parsed.vitamins.vitamin_k ? Math.max(0, parsed.vitamins.vitamin_k) : undefined,
                    thiamine: parsed.vitamins.thiamine ? Math.max(0, parsed.vitamins.thiamine) : undefined,
                    riboflavin: parsed.vitamins.riboflavin ? Math.max(0, parsed.vitamins.riboflavin) : undefined,
                    niacin: parsed.vitamins.niacin ? Math.max(0, parsed.vitamins.niacin) : undefined,
                    vitamin_b6: parsed.vitamins.vitamin_b6 ? Math.max(0, parsed.vitamins.vitamin_b6) : undefined,
                    folate: parsed.vitamins.folate ? Math.max(0, parsed.vitamins.folate) : undefined,
                    vitamin_b12: parsed.vitamins.vitamin_b12 ? Math.max(0, parsed.vitamins.vitamin_b12) : undefined,
                } : undefined,
                minerals: parsed.minerals && typeof parsed.minerals === 'object' ? {
                    calcium: parsed.minerals.calcium ? Math.max(0, parsed.minerals.calcium) : undefined,
                    iron: parsed.minerals.iron ? Math.max(0, parsed.minerals.iron) : undefined,
                    magnesium: parsed.minerals.magnesium ? Math.max(0, parsed.minerals.magnesium) : undefined,
                    phosphorus: parsed.minerals.phosphorus ? Math.max(0, parsed.minerals.phosphorus) : undefined,
                    potassium: parsed.minerals.potassium ? Math.max(0, parsed.minerals.potassium) : undefined,
                    zinc: parsed.minerals.zinc ? Math.max(0, parsed.minerals.zinc) : undefined,
                    copper: parsed.minerals.copper ? Math.max(0, parsed.minerals.copper) : undefined,
                    manganese: parsed.minerals.manganese ? Math.max(0, parsed.minerals.manganese) : undefined,
                    selenium: parsed.minerals.selenium ? Math.max(0, parsed.minerals.selenium) : undefined,
                } : undefined,
                // Health metrics
                health_score: parsed.health_score ? Math.min(10, Math.max(1, parsed.health_score)) : undefined,
                allergens: Array.isArray(parsed.allergens) ? parsed.allergens : undefined,
                processing_level: ['unprocessed', 'minimally_processed', 'processed', 'ultra_processed'].includes(parsed.processing_level)
                    ? parsed.processing_level
                    : undefined,
                // Meal analysis
                meal_type: ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'beverage', 'other'].includes(parsed.meal_type)
                    ? parsed.meal_type
                    : undefined,
                cuisine_type: parsed.cuisine_type || undefined,
                cooking_method: parsed.cooking_method || undefined,
                // Dietary information
                dietary_restrictions: Array.isArray(parsed.dietary_restrictions) ? parsed.dietary_restrictions : undefined,
                // Ingredients
                ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients : undefined,
                ingredient_details: Array.isArray(parsed.ingredient_details) ? parsed.ingredient_details : undefined,
                // Recommendations
                health_tips: Array.isArray(parsed.health_tips) ? parsed.health_tips : undefined,
                suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : undefined,
                // Meta
                confidence_score: Math.min(1, Math.max(0, parsed.confidence_score || 0.5))
            };
        }
        catch (parseError) {
            console.error(`[${requestId}] JSON parse error:`, parseError);
            // Parse hatası olursa ham metni döndür
            analysisResult = {
                food_name: 'Analiz Edilemedi',
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0,
                fiber: 0,
                ingredients: [],
                health_tips: [],
                confidence_score: 0,
                raw_response: generatedContent
            };
        }
        // Firebase'e kaydet
        try {
            const analysisData = Object.assign(Object.assign({}, analysisResult), { timestamp: admin.firestore.FieldValue.serverTimestamp(), user_id: userId || ((_f = req.headers.authorization) === null || _f === void 0 ? void 0 : _f.replace('Bearer ', '')) || 'anonymous' });
            await admin.firestore().collection('food_analysis').add(analysisData);
            console.log(`[${requestId}] Analysis saved to Firestore`);
        }
        catch (firestoreError) {
            console.error(`[${requestId}] Firestore save error:`, firestoreError);
            // Continue even if Firestore save fails
        }
        const processingTime = Date.now() - startTime;
        console.log(`[${requestId}] Analysis completed in ${processingTime}ms`);
        res.status(200).json(createResponse(true, analysisResult));
    }
    catch (error) {
        const processingTime = Date.now() - startTime;
        console.error(`[${requestId}] Gemini API Error after ${processingTime}ms:`, {
            message: error.message,
            status: (_g = error.response) === null || _g === void 0 ? void 0 : _g.status,
            data: (_h = error.response) === null || _h === void 0 ? void 0 : _h.data
        });
        res.status(500).json(createResponse(false, null, 'Failed to analyze food', 500));
    }
});
//# sourceMappingURL=index.js.map