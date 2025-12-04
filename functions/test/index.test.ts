import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { analyzeFood, health, testGemini } from '../src/index';

// Mock Firebase Admin
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  firestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      add: jest.fn(() => Promise.resolve()),
    })),
    FieldValue: {
      serverTimestamp: jest.fn(() => new Date()),
    },
  })),
}));

// Mock Firebase Functions
jest.mock('firebase-functions', () => ({
  https: {
    onRequest: jest.fn((handler) => handler),
  },
  config: jest.fn(() => ({
    gemini: {
      api_key: 'test-api-key',
    },
  })),
}));

// Mock Axios
jest.mock('axios');
import axios from 'axios';
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Firebase Functions', () => {
  let mockReq: any;
  let mockRes: any;

  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, GEMINI_API_KEY: 'test-api-key' };

    mockReq = {
      method: 'POST',
      headers: {},
      body: {},
    };

    mockRes = {
      set: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('analyzeFood function', () => {
    const validImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77yQAAAABJRU5ErkJggg==';

    it('should handle OPTIONS request', async () => {
      mockReq.method = 'OPTIONS';

      await analyzeFood(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalledWith('');
    });

    it('should reject non-POST requests', async () => {
      mockReq.method = 'GET';

      await analyzeFood(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(405);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Method not allowed',
        })
      );
    });

    it('should require image data', async () => {
      mockReq.body = {};

      await analyzeFood(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Image data is required',
        })
      );
    });

    it('should reject invalid base64 image', async () => {
      mockReq.body = {
        imageBase64: 'invalid-base64',
      };

      await analyzeFood(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Invalid image data format',
        })
      );
    });

    it('should handle successful Gemini API response', async () => {
      const mockGeminiResponse = {
        data: {
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify({
                      food_name: 'Test Food',
                      calories: 200,
                      protein: 15,
                      carbs: 25,
                      fat: 8,
                      fiber: 3,
                      ingredients: ['ingredient1', 'ingredient2'],
                      health_tips: ['tip1'],
                      confidence_score: 0.9,
                    }),
                  },
                ],
              },
            },
          ],
        },
      };

      mockedAxios.post.mockResolvedValue(mockGeminiResponse);

      mockReq.body = {
        imageBase64: validImageBase64,
        userPrompt: 'Analyze this food',
      };

      await analyzeFood(mockReq, mockRes);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('generativelanguage.googleapis.com'),
        expect.any(Object),
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000,
        })
      );

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            food_name: 'Test Food',
            calories: 200,
            confidence_score: 0.9,
          }),
        })
      );
    });

    it('should handle Gemini API errors', async () => {
      mockedAxios.post.mockRejectedValue(new Error('API Error'));

      mockReq.body = {
        imageBase64: validImageBase64,
      };

      await analyzeFood(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Failed to analyze food',
        })
      );
    });
  });

  describe('health function', () => {
    it('should return health status', async () => {
      await health(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            status: 'healthy',
            version: '1.0.0',
          }),
        })
      );
    });
  });

  describe('testGemini function', () => {
    it('should test Gemini API connectivity', async () => {
      const mockResponse = {
        data: {
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: 'Hello from Gemini',
                  },
                ],
              },
            },
          ],
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      mockReq.body = {
        testPrompt: 'Hello',
      };

      await testGemini(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            response: 'Hello from Gemini',
            apiStatus: 'connected',
          }),
        })
      );
    });

    it('should handle Gemini API test failures', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Connection failed'));

      mockReq.body = {
        testPrompt: 'Hello',
      };

      await testGemini(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Gemini API connection failed',
        })
      );
    });
  });
});