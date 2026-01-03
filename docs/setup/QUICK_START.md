# 🚀 RevenueCat Quick Start

## ⚡ 5-Minute Setup

### Step 1: Get Your API Keys (2 minutes)

1. Go to https://app.revenuecat.com/settings/api-keys
2. Copy your iOS API key (starts with `appl_`)
3. Copy your Android API key (starts with `goog_`)

### Step 2: Update Configuration (1 minute)

Open `src/config/revenuecat.ts` and replace:

```typescript
ios: 'appl_YOUR_IOS_API_KEY_HERE',     // ← Paste your iOS key here
android: 'goog_YOUR_ANDROID_API_KEY_HERE', // ← Paste your Android key here
```

### Step 3: Create Products (2 minutes)

In RevenueCat Dashboard:

1. **Entitlements** → Create `premium`
2. **Products** → Add your subscription products
3. **Offerings** → Create "default" offering and add products

### Step 4: Test! 🎉

```bash
npm run ios
# or
npm run android
```

The paywall will appear before onboarding!

---

## 📦 What's Included

✅ **Paywall Screen** - Shows before onboarding  
✅ **Purchase Flow** - Complete RevenueCat integration  
✅ **Restore Purchases** - Easy restoration  
✅ **Premium Gates** - Reusable components  
✅ **Free Trial** - Users can skip and upgrade later  

---

## 🎯 Common Use Cases

### Check if User is Premium

```typescript
import { useRevenueCat } from '@/context/revenuecat-context';

const { isPremium } = useRevenueCat();
```

### Gate a Premium Feature

```typescript
import { PremiumGate } from '@/components/premium';

<PremiumGate featureName="Advanced Analytics">
  <YourPremiumFeature />
</PremiumGate>
```

### Show Upgrade Button

```typescript
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/paywall'); // Shows paywall
```

---

## 📚 Full Documentation

- **Complete Setup**: [REVENUECAT_SETUP.md](./REVENUECAT_SETUP.md)
- **Code Examples**: [IMPLEMENTATION_EXAMPLES.md](./IMPLEMENTATION_EXAMPLES.md)
- **Full Summary**: [REVENUECAT_SUMMARY.md](./REVENUECAT_SUMMARY.md)

---

## ⚠️ Important Notes

1. **API Keys Required**: App won't work until you add real API keys
2. **Store Setup**: Create products in App Store Connect & Google Play
3. **RevenueCat Config**: Set up entitlements and offerings
4. **Test Accounts**: Use sandbox (iOS) or test tracks (Android)

---

## 🆘 Need Help?

**No offerings showing?**
→ Check RevenueCat dashboard configuration

**Purchase fails?**
→ Verify store credentials in RevenueCat

**API key warning?**
→ Replace keys in `src/config/revenuecat.ts`

---

**Ready to monetize! 💰**
