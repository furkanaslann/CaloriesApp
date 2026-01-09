# CaloriTrack - Premium Features Specification

**Last Updated:** December 2024  
**Status:** Approved for MVP

---

## 📋 Overview

This document defines the feature split between **Free** and **Premium** tiers for CaloriTrack. The premium tier focuses on AI-powered features, advanced analytics, and unlimited access to core functionality.

---

## 🎯 Core Value Proposition

**Primary Premium Driver:** AI-Powered Food Recognition  
**Target Conversion Rate:** 5-10% (industry standard for freemium apps)

---

## 💎 Feature Matrix: Free vs Premium

### 1. AI Camera Scanning

| Feature | Free Tier | Premium Tier |
|---------|-----------|--------------|
| **Daily Scan Limit** | 10 scans/day | 50 scans/day |
| **Scan Accuracy** | Standard (85-90%) | Enhanced (95%+) |
| **Multi-food Detection** | ❌ Single item only | ✅ Multiple items |
| **Portion Size Analysis** | ❌ Basic estimation | ✅ Advanced AI analysis |
| **Offline Scanning** | ❌ Requires internet | ✅ Basic offline support |
| **Scan History** | Last 20 scans | Unlimited |

**Rationale:**
- 10 scans/day allows 3-4 meals + snacks (sufficient for casual users)
- 50 scans/day covers power users, meal prep tracking, and multiple meals
- AI is the core differentiator - premium users get enhanced accuracy

---

### 2. Data History & Retention

| Feature | Free Tier | Premium Tier |
|---------|-----------|--------------|
| **Meal History** | Last 7 days | Unlimited |
| **Weight History** | Last 30 days | Unlimited |
| **Photo Storage** | Last 20 photos | Unlimited |
| **Custom Foods** | 10 custom items | Unlimited |
| **Meal Plans** | 1 active plan | 10 active plans |
| **Data Backup** | ❌ | ✅ Automatic cloud sync |
| **Data Export** | ❌ | ✅ PDF/CSV export |

**Rationale:**
- 7 days provides basic trend visibility
- Unlimited history enables long-term progress tracking
- Data export is valuable for sharing with health professionals

---

### 3. Analytics & Insights

| Feature | Free Tier | Premium Tier |
|---------|-----------|--------------|
| **Daily Dashboard** | ✅ Basic view | ✅ Enhanced view |
| **Weekly Trends** | ❌ | ✅ Detailed charts |
| **Monthly Reports** | ❌ | ✅ Comprehensive analysis |
| **Pattern Recognition** | ❌ | ✅ AI-powered insights |
| **Nutrition Breakdown** | Basic (calories, macros) | Detailed (vitamins, minerals) |
| **Goal Progress** | Current day only | Historical trends |
| **Custom Date Ranges** | ❌ | ✅ Any date range |
| **Comparative Analysis** | ❌ | ✅ This week vs last week |
| **Export Reports** | ❌ | ✅ PDF/CSV export |

**Premium Analytics Features:**
- 📊 **Weekly Trend Charts:** 7-day calorie, macro, and weight trends
- 📈 **Monthly Insights:** Comprehensive nutrition breakdown
- 🤖 **AI Insights:** Personalized recommendations ("Your protein intake is low on Tuesdays")
- 📉 **Pattern Recognition:** Eating habit analysis
- 🎯 **Goal Optimization:** AI-suggested goal adjustments
- 📋 **Exportable Reports:** Share with dieticians or trainers

---

### 4. Meal Planning

| Feature | Free Tier | Premium Tier |
|---------|-----------|--------------|
| **Active Meal Plans** | 1 plan | 10 plans |
| **Recipe Access** | 5 recipes/month | Unlimited |
| **AI Meal Suggestions** | ❌ | ✅ Personalized suggestions |
| **Custom Recipe Creation** | ❌ | ✅ Create & save recipes |
| **Grocery List Generation** | ❌ | ✅ Auto-generated lists |
| **Meal Prep Scheduling** | ❌ | ✅ Calendar integration |
| **Recipe Filtering** | Basic | Advanced (diet, allergy, calories) |
| **Recipe Import** | ❌ | ✅ Import from URLs |

**Rationale:**
- 1 plan allows users to try the feature
- 10 plans support meal prep enthusiasts and families
- Unlimited recipes remove friction for meal planning

---

### 5. AI Insights & Recommendations

| Feature | Free Tier | Premium Tier |
|---------|-----------|--------------|
| **Basic Calorie Tracking** | ✅ | ✅ |
| **AI Meal Suggestions** | ❌ | ✅ Based on goals & history |
| **Nutritional Gaps Detection** | ❌ | ✅ Vitamin/mineral analysis |
| **Smart Meal Timing** | ❌ | ✅ Optimal eating windows |
| **Personalized Tips** | ❌ | ✅ Daily AI insights |
| **Macro Optimization** | ❌ | ✅ AI-powered macro balancing |
| **Habit Formation** | ❌ | ✅ Pattern-based recommendations |

**Example AI Insights:**
- "You tend to skip breakfast on Mondays - try prepping overnight oats"
- "Your protein intake is 20% below your goal this week"
- "Based on your activity, consider increasing carbs before workouts"

---

### 6. Data Export & Sharing

| Feature | Free Tier | Premium Tier |
|---------|-----------|--------------|
| **PDF Reports** | ❌ | ✅ Weekly/Monthly reports |
| **CSV Export** | ❌ | ✅ Raw data export |
| **Share with Professionals** | ❌ | ✅ Formatted reports |
| **Email Reports** | ❌ | ✅ Scheduled reports |
| **Data Portability** | ❌ | ✅ Full data export |

**Use Cases:**
- Share progress with dieticians
- Track data in spreadsheets
- Long-term data backup
- Health professional consultations

---

### 7. Additional Premium Features

| Feature | Free Tier | Premium Tier |
|---------|-----------|--------------|
| **Offline Mode** | ❌ | ✅ Basic offline functionality |
| **Priority Support** | Standard | Priority email support |
| **Ad-free Experience** | ❌ (future) | ✅ No ads |
| **Early Access** | ❌ | ✅ New features first |
| **Beta Features** | ❌ | ✅ Access to beta features |

---

## 📊 Usage Limits Summary

### Free Tier Limits
- ✅ **AI Scans:** 10/day
- ✅ **History:** 7 days
- ✅ **Recipes:** 5/month
- ✅ **Meal Plans:** 1 active
- ✅ **Custom Foods:** 10 items
- ✅ **Weight History:** 30 days

### Premium Tier Limits
- ⭐ **AI Scans:** 50/day
- ⭐ **History:** Unlimited
- ⭐ **Recipes:** Unlimited
- ⭐ **Meal Plans:** 10 active
- ⭐ **Custom Foods:** Unlimited
- ⭐ **Weight History:** Unlimited

---

## 🎨 Upgrade Prompts Strategy

### Soft Paywall Triggers

1. **AI Scan Limit Reached**
   ```
   📸 You've used all 10 scans today!
   Premium: Get 50 scans/day + enhanced accuracy
   [View Premium] [Continue Tomorrow]
   ```

2. **History Access**
   ```
   📊 Viewing last 7 days
   Premium: Access unlimited history
   [Upgrade] [Continue]
   ```

3. **Advanced Analytics**
   ```
   🔒 Weekly & Monthly Reports
   Premium Feature - Unlock detailed insights
   [Try Premium] [Learn More]
   ```

4. **Recipe Limit**
   ```
   🍽️ 5 recipes/month limit reached
   Premium: Unlimited recipe access
   [Upgrade] [Browse Free Recipes]
   ```

5. **Meal Planning**
   ```
   📅 1 active meal plan limit
   Premium: Create up to 10 meal plans
   [Upgrade] [Continue with 1 Plan]
   ```

---

## 💰 Pricing Strategy

### Premium Tier: $9.99/month

**Value Justification:**
- 5x more AI scans (10 → 50/day)
- Unlimited history & data retention
- Advanced analytics & AI insights
- Full meal planning capabilities
- Data export for professionals

**Alternative Pricing:**
- **Annual:** $79.99/year (33% savings = $6.67/month)
- **Lifetime:** $199.99 (one-time payment)

---

## 🚀 Implementation Priority

### Phase 1: MVP (Launch)
- ✅ AI scan limits (10/50 per day)
- ✅ History limits (7 days / unlimited)
- ✅ Basic analytics gating
- ✅ Recipe limits (5/month / unlimited)

### Phase 2: Enhanced (Month 2-3)
- ⭐ Advanced analytics & reports
- ⭐ AI insights & recommendations
- ⭐ Data export (PDF/CSV)
- ⭐ Enhanced meal planning

### Phase 3: Advanced (Month 4-6)
- 🔮 Offline mode
- 🔮 Custom recipe creation
- 🔮 Grocery list generation
- 🔮 Pattern recognition

---

## 📈 Success Metrics

### Conversion Metrics
- **Target Conversion Rate:** 5-10% (free → premium)
- **Trial-to-Paid:** Track 7-day free trial conversions
- **Upgrade Triggers:** Which limits drive most conversions?

### Engagement Metrics
- **Daily Active Users:** Track free vs premium engagement
- **Feature Adoption:** Which premium features are most used?
- **Retention:** Premium users should have higher retention

### Revenue Metrics
- **ARPU (Average Revenue Per User):** Target $0.50-1.00
- **LTV (Lifetime Value):** Target $50-100 per premium user
- **Churn Rate:** Target <5% monthly churn

---

## 🔄 Future Considerations

### Potential Premium Additions
- **Family Plans:** Multiple user profiles ($14.99/month)
- **Professional Plans:** For dieticians/trainers ($29.99/month)
- **API Access:** For integrations (enterprise pricing)
- **White-label:** For corporate wellness (custom pricing)

### Feature Evolution
- Monitor which limits users hit most
- Adjust limits based on user feedback
- Consider usage-based pricing (pay per scan over limit)
- A/B test different limit combinations

---

## 📝 Notes

- **AI is the core value:** Premium should emphasize AI capabilities
- **Clear upgrade path:** Users should understand premium benefits
- **Flexible limits:** Can adjust based on user behavior data
- **Data-driven decisions:** Use analytics to optimize limits

---

**Document Owner:** Product Team  
**Review Frequency:** Monthly  
**Next Review:** January 2025

