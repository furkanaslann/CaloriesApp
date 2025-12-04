const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = functions.config().gemini.api_key;

/**
 * Gemini 2.0 Flash API ile yiyecek analizi yapan Firebase Function
 * POST /api/analyzeFood
 * Body: { imageBase64: string, userPrompt?: string }
 */
exports.analyzeFood = functions.https.onRequest(async (req, res) => {
  // CORS ayarları
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { imageBase64, userPrompt = 'Bu yemeği analiz et ve besin değerlerini tahmin et' } = req.body;

    if (!imageBase64) {
      res.status(400).json({ error: 'Image data is required' });
      return;
    }

    // Gemini API isteği
    const geminiRequest = {
      contents: [
        {
          parts: [
            {
              text: `${userPrompt}. Lütfen şu formatta JSON döndür:
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
              }`
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

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      geminiRequest,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    const generatedContent = response.data.candidates[0].content.parts[0].text;

    // JSON parse et
    let analysisResult;
    try {
      // JSON string'i temizle ve parse et
      const jsonStr = generatedContent.replace(/```json\n?|\n?```/g, '').trim();
      analysisResult = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Parse hatası olursa ham metni döndür
      analysisResult = {
        raw_response: generatedContent,
        error: 'JSON_parse_error'
      };
    }

    // Firebase'e kaydet
    const analysisData = {
      ...analysisResult,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      user_id: req.headers.authorization?.replace('Bearer ', '') || 'anonymous'
    };

    await admin.firestore().collection('food_analysis').add(analysisData);

    res.status(200).json({
      success: true,
      data: analysisResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to analyze food',
      details: error.response?.data || error.message
    });
  }
});

