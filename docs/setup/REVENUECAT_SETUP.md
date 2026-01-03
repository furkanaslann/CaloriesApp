# RevenueCat In-App Purchase Setup Guide

This guide will help you set up RevenueCat for In-App Purchases in CaloriTrack.

## 📋 Prerequisites

- RevenueCat account (sign up at https://www.revenuecat.com/)
- Apple Developer account (for iOS)
- Google Play Developer account (for Android)
- Basic understanding of in-app purchases

## 🚀 Quick Start

### 1. Create RevenueCat Project

1. Go to https://app.revenuecat.com/
2. Create a new project or select an existing one
3. Name your project "CaloriTrack" or similar

### 2. Get Your API Keys

1. Navigate to **Settings** > **API Keys** in RevenueCat dashboard
2. Copy your **iOS API Key** (starts with `appl_`)
3. Copy your **Android API Key** (starts with `goog_`)
4. Open `src/config/revenuecat.ts` in your project
5. Replace the placeholder API keys:

```typescript
export const REVENUECAT_CONFIG = {
  apiKeys: {
    ios: 'appl_YOUR_ACTUAL_IOS_KEY_HERE',
    android: 'goog_YOUR_ACTUAL_ANDROID_KEY_HERE',
  },
  // ...
};
```

### 3. Configure Products in App Store Connect (iOS)

1. Go to **App Store Connect** > **My Apps** > **CaloriTrack**
2. Navigate to **Subscriptions** or **In-App Purchases**
3. Create your subscription products:
   - **Product ID Examples:**
     - `caloriesapp_premium_monthly` - Monthly subscription
     - `caloriesapp_premium_yearly` - Yearly subscription
     - `caloriesapp_premium_lifetime` - Lifetime purchase
4. Configure pricing and descriptions for each product

### 4. Configure Products in Google Play Console (Android)

1. Go to **Google Play Console** > **Your App** > **Monetize** > **Subscriptions**
2. Create matching subscription products with the **same Product IDs** as iOS
3. Configure pricing and descriptions

### 5. Connect Store Accounts to RevenueCat

#### iOS Setup:
1. In RevenueCat dashboard, go to **Settings** > **Apple App Store**
2. Upload your **In-App Purchase Key** (.p8 file) from App Store Connect
3. Enter your **Issuer ID** and **Key ID**
4. Select your app's **Bundle ID**: `com.techmodern.caloriesapp.ios`

#### Android Setup:
1. In RevenueCat dashboard, go to **Settings** > **Google Play Store**
2. Upload your **Service Account JSON** file from Google Play Console
3. Select your app's **Package Name**: `com.techmodern.caloriesapp.android`

### 6. Create Entitlements in RevenueCat

1. Go to **Entitlements** in RevenueCat dashboard
2. Create a new entitlement:
   - **Identifier:** `premium`
   - **Description:** Premium access to all features

### 7. Create Products in RevenueCat

1. Go to **Products** in RevenueCat dashboard
2. Click **Add Product**
3. For each product you created in stores:
   - Enter the **Product ID** (must match store product IDs exactly)
   - Select **Type** (Subscription or Non-consumable)
   - Attach to the `premium` entitlement

### 8. Create Offerings in RevenueCat

1. Go to **Offerings** in RevenueCat dashboard
2. Create a **default** offering (required)
3. Add your products to the offering
4. Organize products into packages:
   - **Monthly Package** - `$MONTHLY` identifier
   - **Annual Package** - `$ANNUAL` identifier
   - **Lifetime Package** - Custom identifier

### 9. Configure Paywall (Optional)

You can customize the paywall appearance in RevenueCat dashboard:
1. Go to **Paywalls** > **Templates**
2. Choose a template or create custom
3. Configure colors, text, and layout
4. Assign to your default offering

## 📱 Testing

### iOS Testing

1. **Sandbox Testing:**
   - Use TestFlight or Xcode simulator
   - Add sandbox test users in App Store Connect
   - Purchase using sandbox account
   - Transactions won't charge real money

2. **Build and Run:**
```bash
npm run ios
# or
npx expo run:ios
```

### Android Testing

1. **Internal Testing:**
   - Upload to Internal Testing track in Play Console
   - Add test users via email
   - Install app from Play Store (internal test)
   - Make test purchases (no charge with test accounts)

2. **Build and Run:**
```bash
npm run android
# or
npx expo run:android
```

## 🔍 How It Works

### User Flow

1. **App Launch** → Paywall screen appears for new users
2. **Paywall Options:**
   - **Subscribe** → Shows RevenueCat paywall UI
   - **Restore Purchases** → Restores previous subscriptions
   - **Continue Free** → Skip to onboarding (can upgrade later)
3. **After Purchase** → User proceeds to onboarding
4. **Premium Features** → Unlocked throughout the app

### Key Files

- **`src/context/revenuecat-context.tsx`** - RevenueCat SDK initialization and state management
- **`src/app/paywall.tsx`** - Paywall screen component
- **`src/config/revenuecat.ts`** - Configuration and API keys
- **`src/app/_layout.tsx`** - App routing and provider setup

### Checking Premium Status

In any component, you can check if user has premium:

```typescript
import { useRevenueCat } from '@/context/revenuecat-context';

function MyComponent() {
  const { isPremium, isLoading } = useRevenueCat();

  if (isLoading) return <Loading />;

  if (isPremium) {
    return <PremiumFeature />;
  } else {
    return <UpgradePrompt />;
  }
}
```

### Making a Purchase

Use the built-in RevenueCat UI:

```typescript
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';

const result = await RevenueCatUI.presentPaywall({
  displayCloseButton: true,
});

if (result === PAYWALL_RESULT.PURCHASED) {
  // Purchase successful!
}
```

## 🔐 Security Best Practices

1. **Never commit real API keys** to public repositories
2. **Use environment variables** for production builds
3. **Enable entitlement verification** in production:
   ```typescript
   entitlementVerificationMode: ENTITLEMENT_VERIFICATION_MODE.INFORMATIONAL
   ```
4. **Use different API keys** for development and production
5. **Implement receipt validation** on your backend (optional but recommended)

## 🐛 Troubleshooting

### No offerings available
- Check that you've created products in both stores
- Verify product IDs match exactly in RevenueCat
- Ensure offering is set as "current" in RevenueCat
- Wait a few minutes after creating offerings for them to sync

### Purchase fails
- Verify store credentials are correctly configured in RevenueCat
- Check that test user is properly set up
- Ensure product is available in the store for your region
- Check RevenueCat logs for detailed error messages

### "Using placeholder API key" warning
- Replace API keys in `src/config/revenuecat.ts` with actual keys
- Keys should start with `appl_` (iOS) or `goog_` (Android)
- Rebuild the app after changing configuration

### Paywall not showing
- Check that RevenueCat SDK is initialized (`isInitialized: true`)
- Verify offerings are loaded (`currentOffering` is not null)
- Check console logs for initialization errors
- Ensure internet connection is available

## 📚 Additional Resources

- [RevenueCat Documentation](https://docs.revenuecat.com/)
- [React Native SDK Guide](https://docs.revenuecat.com/docs/reactnative)
- [RevenueCat Dashboard](https://app.revenuecat.com/)
- [Testing Purchases](https://docs.revenuecat.com/docs/test-and-launch)
- [iOS Setup Guide](https://docs.revenuecat.com/docs/itunesconnect-app-specific-shared-secret)
- [Android Setup Guide](https://docs.revenuecat.com/docs/creating-play-service-credentials)

## 🎯 Next Steps

1. ✅ Configure API keys in `src/config/revenuecat.ts`
2. ✅ Create products in App Store Connect and Google Play Console
3. ✅ Set up store credentials in RevenueCat
4. ✅ Create entitlements and offerings
5. ✅ Test purchases with sandbox/test accounts
6. ✅ Customize paywall appearance (optional)
7. ✅ Implement premium feature gates throughout your app
8. ✅ Test restore purchases flow
9. ✅ Submit for review to Apple and Google

## 💡 Tips

- **Start with one platform** (iOS or Android) to simplify testing
- **Use identical product IDs** across platforms for easier management
- **Enable debug logs** during development to see detailed information
- **Test restore purchases** thoroughly - it's a common user flow
- **Consider offering a free trial** to increase conversion rates
- **Monitor analytics** in RevenueCat dashboard to optimize pricing

## 🆘 Support

If you encounter issues:
1. Check RevenueCat dashboard logs
2. Review console logs in your app
3. Contact RevenueCat support (excellent support!)
4. Check the RevenueCat Community forums

---

**Happy Monetizing! 🚀**


