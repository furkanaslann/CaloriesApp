import axios from "axios";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import { Resend } from "resend";

admin.initializeApp();

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

// Get Gemini API key from Firebase Secrets Manager
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

// Debug için API key durumunu logla
console.log("GEMINI_API_KEY exists:", !!GEMINI_API_KEY);
console.log("GEMINI_API_KEY length:", GEMINI_API_KEY?.length || 0);

// Interface definitions
interface FoodAnalysisRequest {
  imageBase64: string;
  userPrompt?: string;
  userId?: string;
}

interface Vitamins {
  vitamin_a?: number;
  vitamin_c?: number;
  vitamin_d?: number;
  vitamin_e?: number;
  vitamin_k?: number;
  thiamine?: number;
  riboflavin?: number;
  niacin?: number;
  vitamin_b6?: number;
  folate?: number;
  vitamin_b12?: number;
}

interface Minerals {
  calcium?: number;
  iron?: number;
  magnesium?: number;
  phosphorus?: number;
  potassium?: number;
  zinc?: number;
  copper?: number;
  manganese?: number;
  selenium?: number;
}

interface IngredientDetail {
  name: string;
  amount?: number;
  unit?: string;
  notes?: string;
}

interface FoodAnalysisResponse {
  // Basic nutrition
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;

  // Detailed nutrition
  sugar?: number;
  sodium?: number;
  cholesterol?: number;
  saturated_fat?: number;
  unsaturated_fat?: number;

  // Vitamins and minerals
  vitamins?: Vitamins;
  minerals?: Minerals;

  // Health metrics
  health_score?: number; // 1-10 scale
  allergens?: string[];
  processing_level?:
    | "unprocessed"
    | "minimally_processed"
    | "processed"
    | "ultra_processed";

  // Meal analysis
  meal_type?:
    | "breakfast"
    | "lunch"
    | "dinner"
    | "snack"
    | "dessert"
    | "beverage"
    | "other";
  cuisine_type?: string;
  cooking_method?: string;

  // Dietary information
  dietary_restrictions?: string[];

  // Ingredients
  ingredients?: string[];
  ingredient_details?: IngredientDetail[];

  // Recommendations
  health_tips?: string[];
  suggestions?: string[];

  // Meta
  confidence_score: number;
  raw_response?: string;
}

interface GeminiRequest {
  contents: {
    parts: {
      text?: string;
      inline_data?: {
        mime_type: string;
        data: string;
      };
    }[];
  }[];
  generationConfig: {
    temperature: number;
    topK: number;
    topP: number;
    maxOutputTokens: number;
    responseMimeType: string;
  };
}

interface FirestoreAnalysisData extends FoodAnalysisResponse {
  timestamp: FieldValue;
  user_id: string;
  image_hash?: string;
}

/**
 * Helper function to sanitize user prompt
 */
function sanitizePrompt(prompt: string): string {
  // Remove potentially harmful content and limit length
  const sanitized = prompt.replace(/[<>\"'&]/g, "").trim();
  return sanitized.length > 500 ? sanitized.substring(0, 500) : sanitized;
}

/**
 * Helper function to create consistent response format
 */
function createResponse(
  success: boolean,
  data?: any,
  error?: string,
  statusCode = 200,
) {
  return {
    success,
    data,
    error,
    timestamp: new Date().toISOString(),
    statusCode,
  };
}

/**
 * Gemini 2.5 Flash API ile yiyecek analizi yapan Firebase Function
 * POST /analyzeFood
 * Body: { imageBase64: string, userPrompt?: string, userId?: string }
 */
export const analyzeFood = functions.https.onRequest(
  {
    secrets: ["GEMINI_API_KEY"],
    region: "us-central1",
  },
  async (req, res) => {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substring(7);

    // Validation fonksiyonunu burada tanımla ki requestId erişilebilir olsun
    function isValidBase64Image(data: string): boolean {
      try {
        console.log(
          `[${requestId}] Validating base64 image data, length: ${data.length}`,
        );

        // Clean the data - remove whitespace and newlines
        const cleanedData = data.replace(/\s+/g, "").trim();
        console.log(
          `[${requestId}] Cleaned data length: ${cleanedData.length}`,
        );

        // Check if it's a valid base64 string
        const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
        if (!base64Regex.test(cleanedData)) {
          console.error(`[${requestId}] Invalid base64 format after cleaning`);
          console.error(
            `[${requestId}] First 100 chars:`,
            cleanedData.substring(0, 100),
          );
          console.error(
            `[${requestId}] Last 50 chars:`,
            cleanedData.slice(-50),
          );
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

        console.log(
          `[${requestId}] Base64 validation passed, size: ${sizeInBytes} bytes`,
        );
        return true;
      } catch (error) {
        console.error(`[${requestId}] Base64 validation error:`, error);
        return false;
      }
    }

    // CORS ayarları
    res.set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    });

    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    if (req.method !== "POST") {
      console.warn(`[${requestId}] Method not allowed: ${req.method}`);
      res
        .status(405)
        .json(createResponse(false, null, "Method not allowed", 405));
      return;
    }

    try {
      const { imageBase64, userPrompt, userId }: FoodAnalysisRequest = req.body;
      const sanitizedPrompt = sanitizePrompt(
        userPrompt || "Bu yemeği analiz et ve besin değerlerini tahmin et",
      );

      console.log(`[${requestId}] Request body keys:`, Object.keys(req.body));
      console.log(
        `[${requestId}] imageBase64 length:`,
        imageBase64?.length || "undefined",
      );

      // Validations
      if (!imageBase64) {
        console.warn(`[${requestId}] No image data provided`);
        res
          .status(400)
          .json(createResponse(false, null, "Image data is required", 400));
        return;
      }

      console.log(`[${requestId}] Starting image validation...`);
      if (!isValidBase64Image(imageBase64)) {
        console.warn(`[${requestId}] Invalid image data format`);
        res
          .status(400)
          .json(createResponse(false, null, "Invalid image data format", 400));
        return;
      }

      if (!GEMINI_API_KEY) {
        console.error(`[${requestId}] Gemini API key not configured`);
        res
          .status(500)
          .json(createResponse(false, null, "Server configuration error", 500));
        return;
      }

      console.log(`[${requestId}] Processing food analysis request...`);

      // Gemini API isteği
      const geminiRequest: GeminiRequest = {
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
              - suggestions: "add_vegetables", "reduce_salt", "choose_lean_protein", "add_fiber", "portion_control"`,
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: imageBase64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          topK: 32,
          topP: 1,
          maxOutputTokens: 4096,
          responseMimeType: "application/json",
        },
      };

      const apiResponse = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        geminiRequest,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000, // 30 second timeout
        },
      );

      const generatedContent =
        apiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!generatedContent) {
        console.error(`[${requestId}] No content generated from Gemini API`);
        res
          .status(500)
          .json(
            createResponse(false, null, "Failed to generate analysis", 500),
          );
        return;
      }

      // JSON parse et
      let analysisResult: FoodAnalysisResponse;
      try {
        // JSON string'i temizle ve parse et
        const jsonStr = generatedContent
          .replace(/```json\n?|\n?```/g, "")
          .trim();
        const parsed = JSON.parse(jsonStr);

        // Validate required fields
        if (
          typeof parsed.food_name !== "string" ||
          typeof parsed.calories !== "number"
        ) {
          throw new Error("Invalid response format");
        }

        analysisResult = {
          // Basic nutrition
          food_name: parsed.food_name || "Bilinmeyen Yiyecek",
          calories: Math.max(0, parsed.calories || 0),
          protein: Math.max(0, parsed.protein || 0),
          carbs: Math.max(0, parsed.carbs || 0),
          fat: Math.max(0, parsed.fat || 0),
          fiber: Math.max(0, parsed.fiber || 0),

          // Detailed nutrition
          sugar: parsed.sugar ? Math.max(0, parsed.sugar) : undefined,
          sodium: parsed.sodium ? Math.max(0, parsed.sodium) : undefined,
          cholesterol: parsed.cholesterol
            ? Math.max(0, parsed.cholesterol)
            : undefined,
          saturated_fat: parsed.saturated_fat
            ? Math.max(0, parsed.saturated_fat)
            : undefined,
          unsaturated_fat: parsed.unsaturated_fat
            ? Math.max(0, parsed.unsaturated_fat)
            : undefined,

          // Vitamins and minerals
          vitamins:
            parsed.vitamins && typeof parsed.vitamins === "object"
              ? {
                  vitamin_a: parsed.vitamins.vitamin_a
                    ? Math.max(0, parsed.vitamins.vitamin_a)
                    : undefined,
                  vitamin_c: parsed.vitamins.vitamin_c
                    ? Math.max(0, parsed.vitamins.vitamin_c)
                    : undefined,
                  vitamin_d: parsed.vitamins.vitamin_d
                    ? Math.max(0, parsed.vitamins.vitamin_d)
                    : undefined,
                  vitamin_e: parsed.vitamins.vitamin_e
                    ? Math.max(0, parsed.vitamins.vitamin_e)
                    : undefined,
                  vitamin_k: parsed.vitamins.vitamin_k
                    ? Math.max(0, parsed.vitamins.vitamin_k)
                    : undefined,
                  thiamine: parsed.vitamins.thiamine
                    ? Math.max(0, parsed.vitamins.thiamine)
                    : undefined,
                  riboflavin: parsed.vitamins.riboflavin
                    ? Math.max(0, parsed.vitamins.riboflavin)
                    : undefined,
                  niacin: parsed.vitamins.niacin
                    ? Math.max(0, parsed.vitamins.niacin)
                    : undefined,
                  vitamin_b6: parsed.vitamins.vitamin_b6
                    ? Math.max(0, parsed.vitamins.vitamin_b6)
                    : undefined,
                  folate: parsed.vitamins.folate
                    ? Math.max(0, parsed.vitamins.folate)
                    : undefined,
                  vitamin_b12: parsed.vitamins.vitamin_b12
                    ? Math.max(0, parsed.vitamins.vitamin_b12)
                    : undefined,
                }
              : undefined,

          minerals:
            parsed.minerals && typeof parsed.minerals === "object"
              ? {
                  calcium: parsed.minerals.calcium
                    ? Math.max(0, parsed.minerals.calcium)
                    : undefined,
                  iron: parsed.minerals.iron
                    ? Math.max(0, parsed.minerals.iron)
                    : undefined,
                  magnesium: parsed.minerals.magnesium
                    ? Math.max(0, parsed.minerals.magnesium)
                    : undefined,
                  phosphorus: parsed.minerals.phosphorus
                    ? Math.max(0, parsed.minerals.phosphorus)
                    : undefined,
                  potassium: parsed.minerals.potassium
                    ? Math.max(0, parsed.minerals.potassium)
                    : undefined,
                  zinc: parsed.minerals.zinc
                    ? Math.max(0, parsed.minerals.zinc)
                    : undefined,
                  copper: parsed.minerals.copper
                    ? Math.max(0, parsed.minerals.copper)
                    : undefined,
                  manganese: parsed.minerals.manganese
                    ? Math.max(0, parsed.minerals.manganese)
                    : undefined,
                  selenium: parsed.minerals.selenium
                    ? Math.max(0, parsed.minerals.selenium)
                    : undefined,
                }
              : undefined,

          // Health metrics
          health_score: parsed.health_score
            ? Math.min(10, Math.max(1, parsed.health_score))
            : undefined,
          allergens: Array.isArray(parsed.allergens)
            ? parsed.allergens
            : undefined,
          processing_level: [
            "unprocessed",
            "minimally_processed",
            "processed",
            "ultra_processed",
          ].includes(parsed.processing_level)
            ? parsed.processing_level
            : undefined,

          // Meal analysis
          meal_type: [
            "breakfast",
            "lunch",
            "dinner",
            "snack",
            "dessert",
            "beverage",
            "other",
          ].includes(parsed.meal_type)
            ? parsed.meal_type
            : undefined,
          cuisine_type: parsed.cuisine_type || undefined,
          cooking_method: parsed.cooking_method || undefined,

          // Dietary information
          dietary_restrictions: Array.isArray(parsed.dietary_restrictions)
            ? parsed.dietary_restrictions
            : undefined,

          // Ingredients
          ingredients: Array.isArray(parsed.ingredients)
            ? parsed.ingredients
            : undefined,
          ingredient_details: Array.isArray(parsed.ingredient_details)
            ? parsed.ingredient_details
            : undefined,

          // Recommendations
          health_tips: Array.isArray(parsed.health_tips)
            ? parsed.health_tips
            : undefined,
          suggestions: Array.isArray(parsed.suggestions)
            ? parsed.suggestions
            : undefined,

          // Meta
          confidence_score: Math.min(
            1,
            Math.max(0, parsed.confidence_score || 0.5),
          ),
        };
      } catch (parseError) {
        console.error(`[${requestId}] JSON parse error:`, parseError);
        // Parse hatası olursa ham metni döndür
        analysisResult = {
          food_name: "Analiz Edilemedi",
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          ingredients: [],
          health_tips: [],
          confidence_score: 0,
          raw_response: generatedContent,
        };
      }

      // Firebase'e kaydet
      try {
        const analysisData: FirestoreAnalysisData = {
          ...analysisResult,
          timestamp: FieldValue.serverTimestamp(),
          user_id:
            userId ||
            req.headers.authorization?.replace("Bearer ", "") ||
            "anonymous",
        };

        await admin.firestore().collection("food_analysis").add(analysisData);
        console.log(`[${requestId}] Analysis saved to Firestore`);
      } catch (firestoreError) {
        console.error(`[${requestId}] Firestore save error:`, firestoreError);
        // Continue even if Firestore save fails
      }

      const processingTime = Date.now() - startTime;
      console.log(`[${requestId}] Analysis completed in ${processingTime}ms`);

      res.status(200).json(createResponse(true, analysisResult));
    } catch (error: any) {
      const processingTime = Date.now() - startTime;
      console.error(
        `[${requestId}] Gemini API Error after ${processingTime}ms:`,
        {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        },
      );

      res
        .status(500)
        .json(createResponse(false, null, "Failed to analyze food", 500));
    }
  },
);

// ============================================================================
// EMAIL OTP AUTHENTICATION FUNCTIONS
// ============================================================================

// Email Configuration
interface EmailConfig {
  fromName: string;
  fromAddress: string;
}

/**
 * Get email configuration based on environment
 * - Development: Uses @resend.dev (sends only to registered email)
 * - Production: Uses verified custom domain
 */
function getEmailConfig(): EmailConfig {
  const fromName = process.env.EMAIL_FROM_NAME || "CaloriTrack";
  const nodeEnv = process.env.NODE_ENV || "development";

  // Production: Use custom domain
  if (nodeEnv === "production") {
    const fromAddress = process.env.EMAIL_FROM_ADDRESS_PROD;
    if (!fromAddress) {
      throw new Error("EMAIL_FROM_ADDRESS_PROD is required in production");
    }
    return { fromName, fromAddress: `${fromName} <${fromAddress}>` };
  }

  // Development: Use Resend's default domain
  const fromAddress =
    process.env.EMAIL_FROM_ADDRESS_DEV || "onboarding@resend.dev";
  return { fromName, fromAddress: `${fromName} <${fromAddress}>` };
}

// OTP Configuration
const OTP_EXPIRY_MINUTES = 5;
const OTP_RATE_LIMIT_SECONDS = 60;
const OTP_CODE_LENGTH = 6;
const OTP_COLLECTION = "otpCodes";

/**
 * Generate a random 6-digit OTP code
 */
function generateOTPCode(): string {
  const min = Math.pow(10, OTP_CODE_LENGTH - 1);
  const max = Math.pow(10, OTP_CODE_LENGTH) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}

// Lazy initialization of Resend client (to avoid errors during deploy analysis)
let resendInstance: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

/**
 * Send OTP email using Resend API
 * In development (no API key), logs to console
 */
async function sendOTPEmail(email: string, code: string): Promise<void> {
  const resend = getResendClient();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .logo { text-align: center; font-size: 28px; font-weight: 700; color: #7C3AED; margin-bottom: 24px; }
        .title { text-align: center; font-size: 20px; font-weight: 600; color: #1E293B; margin-bottom: 8px; }
        .subtitle { text-align: center; font-size: 14px; color: #64748B; margin-bottom: 32px; }
        .code-box { background: #F8F5FF; border: 2px solid #7C3AED; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px; }
        .code { font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #7C3AED; }
        .expiry { text-align: center; font-size: 13px; color: #94A3B8; margin-bottom: 16px; }
        .footer { text-align: center; font-size: 12px; color: #CBD5E1; margin-top: 32px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">CaloriTrack</div>
        <div class="title">Dogrulama Kodunuz</div>
        <div class="subtitle">Hesabinizi dogrulamak icin asagidaki kodu kullanin</div>
        <div class="code-box">
          <div class="code">${code}</div>
        </div>
        <div class="expiry">Bu kod ${OTP_EXPIRY_MINUTES} dakika icinde gecersiz olacaktir.</div>
        <div class="footer">
          Bu e-postayi siz talep etmediyseniz, lutfen dikkate almayin.<br/>
          CaloriTrack &copy; ${new Date().getFullYear()}
        </div>
      </div>
    </body>
    </html>
  `;

  // Check if Resend API key is configured
  if (!resend) {
    // Development mode: log OTP code to console
    console.log(`\n========================================`);
    console.log(`📧 OTP CODE for ${email}: ${code}`);
    console.log(`========================================\n`);
    return;
  }

  // Get email configuration based on environment
  const { fromAddress } = getEmailConfig();

  // Send email via Resend
  const { data, error } = await resend.emails.send({
    from: fromAddress,
    to: [email],
    subject: `${code} - CaloriTrack Dogrulama Kodunuz`,
    html: htmlContent,
  });

  if (error) {
    console.error("❌ Resend error:", error);
    throw new Error(`Resend API error: ${error.message}`);
  }

  console.log(`📧 OTP email sent to ${email} via Resend (ID: ${data?.id})`);
}

/**
 * Send Email OTP - Callable Cloud Function
 * Generates a 6-digit OTP, stores it in Firestore, and sends it via email
 */
export const sendEmailOTP = functions.https.onCall(
  {
    region: "us-central1",
    secrets: ["RESEND_API_KEY", "NODE_ENV"],
  },
  async (request) => {
    const { email, anonymousUid } = request.data;

    // Validate email
    if (!email || typeof email !== "string") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Gecerli bir e-posta adresi gereklidir.",
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Gecerli bir e-posta adresi giriniz.",
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    try {
      const db = admin.firestore();

      // Rate limiting: Check if an OTP was sent recently
      const recentOTPs = await db
        .collection(OTP_COLLECTION)
        .where("email", "==", normalizedEmail)
        .where(
          "createdAt",
          ">",
          new Date(Date.now() - OTP_RATE_LIMIT_SECONDS * 1000),
        )
        .limit(1)
        .get();

      if (!recentOTPs.empty) {
        throw new functions.https.HttpsError(
          "resource-exhausted",
          `Lutfen ${OTP_RATE_LIMIT_SECONDS} saniye bekleyip tekrar deneyin.`,
        );
      }

      // Delete any existing OTP codes for this email
      const existingOTPs = await db
        .collection(OTP_COLLECTION)
        .where("email", "==", normalizedEmail)
        .get();

      const batch = db.batch();
      existingOTPs.docs.forEach((doc) => batch.delete(doc.ref));
      if (!existingOTPs.empty) {
        await batch.commit();
      }

      // Generate OTP code
      const code = generateOTPCode();
      const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

      // Store OTP in Firestore
      await db.collection(OTP_COLLECTION).add({
        email: normalizedEmail,
        code: code,
        anonymousUid: anonymousUid || null,
        createdAt: FieldValue.serverTimestamp(),
        expiresAt: expiresAt,
        verified: false,
        attempts: 0,
      });

      // Send OTP email
      await sendOTPEmail(normalizedEmail, code);

      console.log(`✅ OTP sent successfully to ${normalizedEmail}`);
      return { success: true, message: "Dogrulama kodu gonderildi." };
    } catch (error: any) {
      // Re-throw HttpsError as-is
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      console.error("❌ Error sending OTP:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Dogrulama kodu gonderilemedi. Lutfen tekrar deneyin.",
      );
    }
  },
);

/**
 * Verify Email OTP - Callable Cloud Function
 * Verifies the OTP code and returns a custom auth token
 */
export const verifyEmailOTP = functions.https.onCall(
  {
    region: "us-central1",
  },
  async (request) => {
    const { email, code, anonymousUid } = request.data;

    // Validate inputs
    if (!email || typeof email !== "string") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "E-posta adresi gereklidir.",
      );
    }
    if (!code || typeof code !== "string") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Dogrulama kodu gereklidir.",
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedCode = code.trim();

    try {
      const db = admin.firestore();

      // Find the OTP document
      const otpQuery = await db
        .collection(OTP_COLLECTION)
        .where("email", "==", normalizedEmail)
        .where("verified", "==", false)
        .orderBy("createdAt", "desc")
        .limit(1)
        .get();

      if (otpQuery.empty) {
        throw new functions.https.HttpsError(
          "not-found",
          "Dogrulama kodu bulunamadi. Lutfen yeni bir kod talep edin.",
        );
      }

      const otpDoc = otpQuery.docs[0];
      const otpData = otpDoc.data();

      // Check expiry
      const expiresAt =
        otpData.expiresAt?.toDate?.() || new Date(otpData.expiresAt);
      if (new Date() > expiresAt) {
        // Delete expired OTP
        await otpDoc.ref.delete();
        throw new functions.https.HttpsError(
          "deadline-exceeded",
          "Dogrulama kodu suresi dolmus. Lutfen yeni bir kod talep edin.",
        );
      }

      // Check max attempts (5 attempts max)
      if (otpData.attempts >= 5) {
        await otpDoc.ref.delete();
        throw new functions.https.HttpsError(
          "resource-exhausted",
          "Cok fazla basarisiz deneme. Lutfen yeni bir kod talep edin.",
        );
      }

      // Increment attempt counter
      await otpDoc.ref.update({
        attempts: FieldValue.increment(1),
      });

      // Verify the code
      if (otpData.code !== normalizedCode) {
        const remainingAttempts = 4 - otpData.attempts;
        throw new functions.https.HttpsError(
          "permission-denied",
          `Yanlis dogrulama kodu. ${remainingAttempts > 0 ? remainingAttempts + " deneme hakkiniz kaldi." : "Lutfen yeni bir kod talep edin."}`,
        );
      }

      // Code is correct! Mark as verified
      await otpDoc.ref.update({ verified: true });

      let uid: string;

      // Case 1: Onboarding flow - anonymous user upgrading
      if (anonymousUid) {
        try {
          // Update the anonymous user's email and mark as non-anonymous
          await admin.auth().updateUser(anonymousUid, {
            email: normalizedEmail,
            emailVerified: true,
          });
          uid = anonymousUid;
          console.log(
            `✅ Anonymous user ${anonymousUid} upgraded with email ${normalizedEmail}`,
          );
        } catch (updateError: any) {
          // If the anonymous user doesn't exist, check if email already has an account
          if (updateError.code === "auth/user-not-found") {
            try {
              const existingUser = await admin
                .auth()
                .getUserByEmail(normalizedEmail);
              uid = existingUser.uid;
              console.log(
                `✅ Found existing user with email ${normalizedEmail}: ${uid}`,
              );
            } catch {
              // Create a new user
              const newUser = await admin.auth().createUser({
                email: normalizedEmail,
                emailVerified: true,
              });
              uid = newUser.uid;
              console.log(
                `✅ Created new user with email ${normalizedEmail}: ${uid}`,
              );
            }
          } else if (updateError.code === "auth/email-already-exists") {
            // Email is already associated with another account
            const existingUser = await admin
              .auth()
              .getUserByEmail(normalizedEmail);
            uid = existingUser.uid;

            // Migrate data from anonymous user to existing user
            try {
              const anonymousDoc = await db
                .collection("users")
                .doc(anonymousUid)
                .get();
              if (anonymousDoc.exists) {
                const anonymousData = anonymousDoc.data();
                // Merge anonymous user data into existing user (preserving existing data)
                await db
                  .collection("users")
                  .doc(uid)
                  .set(
                    {
                      ...anonymousData,
                      uid: uid,
                      email: normalizedEmail,
                      isAnonymous: false,
                    },
                    { merge: true },
                  );
                // Delete anonymous user document
                await db.collection("users").doc(anonymousUid).delete();
                console.log(
                  `✅ Migrated data from anonymous ${anonymousUid} to existing user ${uid}`,
                );
              }
            } catch (migrateError) {
              console.warn("⚠️ Data migration warning:", migrateError);
            }
          } else {
            throw updateError;
          }
        }
      }
      // Case 2: Sign-in flow - find or create user by email
      else {
        try {
          const existingUser = await admin
            .auth()
            .getUserByEmail(normalizedEmail);
          uid = existingUser.uid;
          console.log(
            `✅ Sign-in: Found existing user with email ${normalizedEmail}: ${uid}`,
          );
        } catch {
          // User doesn't exist - create new user
          const newUser = await admin.auth().createUser({
            email: normalizedEmail,
            emailVerified: true,
          });
          uid = newUser.uid;

          // Create initial user document
          await db.collection("users").doc(uid).set({
            uid: uid,
            email: normalizedEmail,
            isAnonymous: false,
            onboardingCompleted: false,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
          });
          console.log(
            `✅ Sign-in: Created new user with email ${normalizedEmail}: ${uid}`,
          );
        }
      }

      // Update user document with verified email
      try {
        await db.collection("users").doc(uid).set(
          {
            email: normalizedEmail,
            emailVerified: true,
            isAnonymous: false,
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true },
        );
      } catch (dbError) {
        console.warn("⚠️ Could not update user document:", dbError);
      }

      // Create custom auth token
      const customToken = await admin.auth().createCustomToken(uid);

      // Clean up OTP document
      await otpDoc.ref.delete();

      console.log(
        `✅ OTP verified successfully for ${normalizedEmail}, uid: ${uid}`,
      );
      return {
        success: true,
        token: customToken,
        uid: uid,
        email: normalizedEmail,
        message: "E-posta dogrulandi.",
      };
    } catch (error: any) {
      // Re-throw HttpsError as-is
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      console.error("❌ Error verifying OTP:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Dogrulama basarisiz oldu. Lutfen tekrar deneyin.",
      );
    }
  },
);
