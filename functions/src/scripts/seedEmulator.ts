import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

function getProjectId(): string {
  // Firebase/Admin SDK'nin kullandigi olasi environment degiskenleri
  const fromEnv =
    process.env.GCLOUD_PROJECT ||
    process.env.GCP_PROJECT ||
    process.env.FIREBASE_CONFIG;

  if (fromEnv) {
    try {
      // FIREBASE_CONFIG JSON olabilir, digerleri dogrudan string proje ID
      if (fromEnv.trim().startsWith("{")) {
        const parsed = JSON.parse(fromEnv);
        if (parsed.projectId) {
          return parsed.projectId;
        }
      } else {
        return fromEnv;
      }
    } catch {
      // Dev ortaminda parse hatasini sessizce gec, fallback kullan
    }
  }

  // .firebaserc icindeki default proje ID'si
  return "calories-app-185b6";
}

// Avoid initializing the app multiple times if this file is imported elsewhere
if (!admin.apps.length) {
  const isEmulator = !!process.env.FIRESTORE_EMULATOR_HOST;

  // Emulator modunda credential ekleme, production'da ekle
  const appOptions: admin.AppOptions = {
    projectId: getProjectId(),
  };

  if (!isEmulator) {
    appOptions.credential = admin.credential.applicationDefault();
  }

  admin.initializeApp(appOptions);

  // Auth emulator'a bağlan (eğer FIRESTORE_EMULATOR_HOST varsa, Auth da emulator'dadır)
  if (isEmulator) {
    // Auth emulator default port 9099
    const authEmulatorHost = process.env.FIREBASE_AUTH_EMULATOR_HOST || "localhost:9099";
    process.env.FIREBASE_AUTH_EMULATOR_HOST = authEmulatorHost;
    console.log(`Using Auth Emulator at ${authEmulatorHost}`);
  }
}

const db = admin.firestore();

const TEST_USER_ID = "testUser1";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

interface Nutrition {
  protein: number;
  carbohydrates: number;
  fats: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

interface Portion {
  amount: number;
  unit: string;
}

interface Meal {
  name: string;
  date: string;
  time: string;
  type: MealType;
  calories: number;
  nutrition: Nutrition;
  portion: Portion;
  method: "camera" | "manual" | "barcode" | "quickadd";
  userId: string;
  createdAt: FieldValue;
}

function ensureEmulator(): void {
  const isUsingEmulator =
    !!process.env.FIRESTORE_EMULATOR_HOST ||
    process.env.FUNCTIONS_EMULATOR === "true";

  if (!isUsingEmulator) {
    console.error(
      "This seed script is designed to run against the Firestore emulator only.",
    );
    console.error(
      "Please set FIRESTORE_EMULATOR_HOST (e.g. localhost:8080) or run via `firebase emulators:exec`.",
    );
    process.exit(1);
  }
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, precision = 1): number {
  const value = Math.random() * (max - min) + min;
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}

function formatDateOffset(daysAgo: number): string {
  const date = new Date();
  // Ortak bir saat belirleyip (12:00) gunu sabitle
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

const MEAL_NAMES: Record<MealType, string[]> = {
  breakfast: [
    "Peynirli kahvalti tabagi",
    "Yulaf ezmesi ve meyve",
    "Menemen ve tam bugday ekmek",
    "Yumurta, peynir ve zeytin",
  ],
  lunch: [
    "Izgara tavuklu salata",
    "Kofte, pilav ve salata",
    "Tavuk doner durum",
    "Sebzeli makarna",
  ],
  dinner: [
    "Izgara somon ve sebze",
    "Zeytinyagli yemek ve pilav",
    "Firinda tavuk ve patates",
    "Kuru fasulye ve pilav",
  ],
  snack: [
    "Yogurt ve meyve",
    "Kavrulmus findik/badem",
    "Protein bar",
    "Meyve tabagi",
  ],
};

function getMealTime(type: MealType): string {
  const minute = randomInt(0, 59).toString().padStart(2, "0");

  switch (type) {
    case "breakfast": {
      const hour = randomInt(7, 9).toString().padStart(2, "0");
      return `${hour}:${minute}`;
    }
    case "lunch": {
      const hour = randomInt(12, 14).toString().padStart(2, "0");
      return `${hour}:${minute}`;
    }
    case "dinner": {
      const hour = randomInt(18, 21).toString().padStart(2, "0");
      return `${hour}:${minute}`;
    }
    case "snack":
    default: {
      const hour = randomInt(10, 22).toString().padStart(2, "0");
      return `${hour}:${minute}`;
    }
  }
}

function buildNutritionAndCalories(
  type: MealType,
): { calories: number; nutrition: Nutrition } {
  let calRange: [number, number];

  switch (type) {
    case "breakfast":
      calRange = [350, 550];
      break;
    case "lunch":
      calRange = [500, 800];
      break;
    case "dinner":
      calRange = [600, 900];
      break;
    case "snack":
    default:
      calRange = [100, 300];
      break;
  }

  const calories = randomInt(calRange[0], calRange[1]);
  const protein = randomFloat(10, 40);
  const fats = randomFloat(5, 35);
  const carbs = Math.max(
    0,
    Math.round((calories - (protein * 4 + fats * 9)) / 4),
  );

  const nutrition: Nutrition = {
    protein,
    fats,
    carbohydrates: carbs,
    fiber: randomFloat(1, 10),
    sugar: randomFloat(0, 25),
    sodium: randomInt(50, 900),
  };

  return { calories, nutrition };
}

function pickPortion(): Portion {
  const units: Portion["unit"][] = ["g", "ml", "portion", "plate", "bowl"];
  const unit = units[randomInt(0, units.length - 1)];

  const amount =
    unit === "g" || unit === "ml" ? randomInt(100, 400) : randomInt(1, 2);

  return { amount, unit };
}

function pickMethod(): "camera" | "manual" | "barcode" | "quickadd" {
  const roll = Math.random();

  if (roll < 0.7) return "manual";
  if (roll < 0.85) return "camera";
  if (roll < 0.95) return "quickadd";
  return "barcode";
}

function buildMealsForDay(dateStr: string, dayIndex: number): Meal[] {
  // dayIndex: 0 = en eski gun, 13 = bugun

  // Tamamen bos gunler
  if (dayIndex % 5 === 0) {
    return [];
  }

  let types: MealType[];

  // 1-2 ogunluk eksik loglanmis gunler
  if (dayIndex % 5 === 1) {
    const allTypes: MealType[] = ["breakfast", "lunch", "dinner", "snack"];
    const count = randomInt(1, 2);
    types = [];

    while (types.length < count) {
      const candidate = allTypes[randomInt(0, allTypes.length - 1)];
      if (!types.includes(candidate)) {
        types.push(candidate);
      }
    }
  } else {
    // Tam dolu gunler: kahvalti, ogle, aksam, bazen atistirmalik
    types = ["breakfast", "lunch", "dinner"];
    if (Math.random() < 0.6) {
      types.push("snack");
    }
  }

  return types.map((type) => {
    const { calories, nutrition } = buildNutritionAndCalories(type);
    const names = MEAL_NAMES[type];
    const name = names[randomInt(0, names.length - 1)];

    return {
      name,
      date: dateStr,
      time: getMealTime(type),
      type,
      calories,
      nutrition,
      portion: pickPortion(),
      method: pickMethod(),
      userId: TEST_USER_ID,
      createdAt: FieldValue.serverTimestamp(),
    };
  });
}

async function createOrUpdateTestUser(): Promise<void> {
  const testEmail = "test@example.com";
  const testPassword = "DevTest123!";

  // 1. Auth'ta test kullanıcısı oluştur (eğer yoksa)
  try {
    const existingUser = await admin.auth().getUser(TEST_USER_ID);
    console.log(`Auth user ${TEST_USER_ID} already exists, updating...`);
    
    // Kullanıcı varsa güncelle
    await admin.auth().updateUser(TEST_USER_ID, {
      email: testEmail,
      emailVerified: true,
      password: testPassword,
    });
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      console.log(`Creating Auth user ${TEST_USER_ID}...`);
      await admin.auth().createUser({
        uid: TEST_USER_ID,
        email: testEmail,
        emailVerified: true,
        password: testPassword,
      });
      console.log(`✅ Auth user created: ${testEmail}`);
    } else {
      console.error("Error checking/creating Auth user:", error);
      throw error;
    }
  }

  // 2. Firestore'da kullanıcı dokümanı oluştur
  const userRef = db.collection("users").doc(TEST_USER_ID);

  await userRef.set(
    {
      uid: TEST_USER_ID,
      email: testEmail,
      displayName: "Test User",
      isAnonymous: false,
      onboardingCompleted: true,
      calculatedValues: {
        dailyCalorieGoal: 2000,
        macros: {
          protein: 120,
          carbs: 220,
          fats: 60,
        },
        bmr: 1700,
        tdee: 2200,
      },
      profile: {
        name: "Test",
        lastName: "User",
        age: 30,
        gender: "male",
        height: 178,
        currentWeight: 78,
      },
      goals: {
        primaryGoal: "lose_weight",
        targetWeight: 72,
        weeklyGoal: -0.5,
      },
      updatedAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  console.log(`✅ Firestore document for ${TEST_USER_ID} created/updated.`);
  console.log("\n========================================");
  console.log("🔐 AUTO-LOGIN CREDENTIALS FOR DEV:");
  console.log(`   Email: ${testEmail}`);
  console.log(`   Password: ${testPassword}`);
  console.log("========================================\n");
}

async function clearExistingMeals(): Promise<void> {
  const mealsCol = db
    .collection("users")
    .doc(TEST_USER_ID)
    .collection("meals");

  console.log("Clearing existing meals for", TEST_USER_ID);

  const batchSize = 500;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const snapshot = await mealsCol.limit(batchSize).get();
    if (snapshot.empty) {
      break;
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    console.log(`Deleted ${snapshot.size} existing meal documents...`);
  }
}

async function seedMeals(): Promise<void> {
  const totalDays = 14;

  // En eski gunden bugune dogru ilerle
  for (let i = 0; i < totalDays; i++) {
    const daysAgo = totalDays - 1 - i;
    const dateStr = formatDateOffset(daysAgo);
    const meals = buildMealsForDay(dateStr, i);

    if (meals.length === 0) {
      console.log(`Skipping ${dateStr} (no meals for this day).`);
      continue;
    }

    console.log(`Seeding ${meals.length} meals for ${dateStr}...`);

    const batch = db.batch();
    const colRef = db
      .collection("users")
      .doc(TEST_USER_ID)
      .collection("meals");

    meals.forEach((meal) => {
      const docRef = colRef.doc();
      batch.set(docRef, meal);
    });

    await batch.commit();
  }
}

async function run(): Promise<void> {
  ensureEmulator();
  console.log("Starting Firestore emulator seed for test user...");

  await createOrUpdateTestUser();
  await clearExistingMeals();
  await seedMeals();

  console.log("Seeding completed successfully.");
}

run()
  .then(() => {
    console.log("Seed script finished.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error while running seed script:", error);
    process.exit(1);
  });

