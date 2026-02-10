import * as functions from "firebase-functions";
/**
 * Gemini 2.5 Flash API ile yiyecek analizi yapan Firebase Function
 * POST /analyzeFood
 * Body: { imageBase64: string, userPrompt?: string, userId?: string }
 */
export declare const analyzeFood: functions.https.HttpsFunction;
/**
 * Send Email OTP - Callable Cloud Function
 * Generates a 6-digit OTP, stores it in Firestore, and sends it via email
 */
export declare const sendEmailOTP: functions.https.CallableFunction<any, Promise<{
    success: boolean;
    message: string;
}>, unknown>;
/**
 * Verify Email OTP - Callable Cloud Function
 * Verifies the OTP code and returns a custom auth token
 */
export declare const verifyEmailOTP: functions.https.CallableFunction<any, Promise<{
    success: boolean;
    token: string;
    uid: string;
    email: string;
    message: string;
}>, unknown>;
//# sourceMappingURL=index.d.ts.map