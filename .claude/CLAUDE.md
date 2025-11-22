# CaloriTrack - Design Guidelines & Development Rules

## Core Philosophy

**Minimal. Cool. Aesthetic.**

Every design decision should prioritize simplicity, visual appeal, and an intuitive user experience. Less is more - focus on essential features with beautiful execution.

## Design System

### Color Palette

**Primary Colors (Modern Purple Theme):**
- **Primary:** `#7C3AED` (Purple-600) - Main action buttons, accents
- **Primary Dark:** `#6D28D9` (Purple-700) - Pressed states, active elements
- **Primary Light:** `#A78BFA` (Purple-400) - Hover states, subtle highlights

**Gradient Colors:**
- **Gradient Start:** `#7C3AED` (Purple-600)
- **Gradient End:** `#EC4899` (Pink-500) - Modern gradient effects
- **Gradient Accent:** `#F59E0B` (Amber-500) - Accent highlights

**Neutral Colors:**
- **Background:** `#FFFFFF` (Pure white) - Main app background
- **Surface:** `#FEFEFE` (Very light gray) - Cards, elevated surfaces
- **Surface Alt:** `#F8FAFC` (Blue-50) - Alternative surfaces
- **Border:** `#E2E8F0` (Gray-200) - Subtle dividers, input borders
- **Border Light:** `#F1F5F9` (Gray-100) - Light borders
- **Text Primary:** `#1E293B` (Slate-800) - Main text, headings
- **Text Secondary:** `#64748B` (Slate-500) - Supporting text, captions
- **Text Tertiary:** `#94A3B8` (Slate-400) - Hints, placeholders
- **Text Muted:** `#CBD5E1` (Slate-300) - Very subtle text

**Success Colors:**
- **Success:** `#10B981` (Emerald-500) - Positive actions, achievements
- **Success Light:** `#D1FAE5` (Emerald-100) - Success backgrounds
- **Success Dark:** `#047857` (Emerald-700) - Success text

**Error Colors:**
- **Error:** `#EF4444` (Red-500) - Error states, warnings
- **Error Light:** `#FEE2E2` (Red-100) - Error backgrounds
- **Error Dark:** `#B91C1C` (Red-700) - Error text

**Onboarding Colors:**
- **Onboarding Accent:** `#F97316` (Orange-500) - Special onboarding highlights
- **Onboarding Text:** `#334155` (Slate-700) - Onboarding descriptions
- **Onboarding Subtle:** `#F1F5F9` (Slate-100) - Onboarding backgrounds

### Typography

**Font Family:**
- **Primary:** Inter (system font fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto)
- **Monospace:** 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono' (for data, numbers)

**Font Weights:**
- **Regular:** 400
- **Medium:** 500 - UI elements, buttons, subtle emphasis
- **Semibold:** 600 - Headings, important labels
- **Bold:** 700 - Strong emphasis, used sparingly

**Font Sizes:**
- **xs:** 12px - Tiny labels, captions
- **sm:** 14px - Small text, descriptions
- **base:** 16px - Body text, default size
- **lg:** 18px - Subheadings, emphasis
- **xl:** 20px - Section headings
- **2xl:** 24px - Page titles
- **3xl:** 30px - Hero titles
- **4xl:** 36px - Special occasions, used sparingly

**Line Heights:**
- **Tight:** 1.25 - Large headings
- **Normal:** 1.5 - Body text
- **Relaxed:** 1.75 - Descriptive text

### Spacing System

**Scale:** 4px base unit
- **1:** 4px - Micro spacing
- **2:** 8px - Small gaps
- **3:** 12px - Moderate spacing
- **4:** 16px - Standard spacing
- **5:** 20px - Section separation
- **6:** 24px - Large spacing
- **8:** 32px - Component separation
- **10:** 40px - Page sections
- **12:** 48px - Major sections
- **16:** 64px - Page margins
- **20:** 80px - Hero sections

### Border Radius

**Scale:** Rounded corners for soft, modern feel
- **sm:** 4px - Small elements, tags
- **md:** 8px - Buttons, input fields
- **lg:** 12px - Cards, larger elements
- **xl:** 16px - Modals, special containers
- **full:** 9999px - Pills, avatars

### Shadows

**Subtle elevation system:**
- **sm:** `0 1px 2px 0 rgba(0, 0, 0, 0.05)` - Subtle lift
- **md:** `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)` - Cards
- **lg:** `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)` - Modals
- **xl:** `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)` - Overlays

## Component Guidelines

### Buttons

**Primary Button:**
- Background: Primary color (`#6366F1`)
- Text: White, Medium weight
- Padding: 12px 24px
- Border radius: 8px
- Shadow: md
- Press state: Darken primary, scale down slightly

**Secondary Button:**
- Background: Transparent
- Border: 1px solid Border color
- Text: Text primary, Medium weight
- Padding: 12px 24px
- Border radius: 8px
- Hover: Background turns to Surface

**Ghost Button:**
- Background: Transparent
- Text: Primary color, Medium weight
- No border
- Padding: 12px 16px
- Hover: Background becomes Primary Light (10% opacity)

### Input Fields

**Text Input:**
- Background: White
- Border: 1px solid Border color
- Border radius: 8px
- Padding: 12px 16px
- Font size: base
- Focus: Border changes to Primary, shadow appears
- Error: Border changes to Error, background changes to Error Light

### Cards

**Base Card:**
- Background: White
- Border radius: 12px
- Shadow: sm
- Padding: 24px
- Border: 1px solid Border color

**Interactive Card:**
- Hover: Shadow increases to md, subtle scale up
- Press: Scale down, shadow reduces
- Transition: Smooth 200ms ease

### Icons

**Size System:**
- **xs:** 16px - Small indicators
- **sm:** 20px - Standard icons
- **md:** 24px - Action icons
- **lg:** 32px - Feature icons
- **xl:** 40px - Hero icons

**Colors:**
- **Primary:** Use for primary actions
- **Secondary:** Use for secondary actions
- **Muted:** Use for inactive states
- **Success/Error:** Use for status indicators

## Layout Principles

### Grid System

**12-column grid** for responsive layouts:
- **Mobile (< 768px):** 4 columns
- **Tablet (768px - 1024px):** 8 columns
- **Desktop (> 1024px):** 12 columns

**Containers:**
- **Mobile:** 16px padding
- **Tablet:** 24px padding
- **Desktop:** 32px padding

### Component Spacing

**Vertical Rhythm:**
- Use 8px multiples for vertical spacing
- Maintain consistent spacing between elements
- Group related elements closer together

**Horizontal Alignment:**
- Left-align text for readability
- Center-align for hero content
- Right-align for actions/CTAs

## Animation Guidelines

### Timing Functions

**Ease:** `cubic-bezier(0.4, 0, 0.2, 1)` - Standard animations
**Ease Out:** `cubic-bezier(0, 0, 0.2, 1)` - Entrance animations
**Ease In Out:** `cubic-bezier(0.4, 0, 0.2, 1)` - Complex animations

### Duration

**Fast:** 150ms - Micro-interactions
**Standard:** 200ms - UI transitions
**Slow:** 300ms - Page transitions, complex animations

### Properties

**Always Animate:**
- Transform (translate, scale, rotate)
- Opacity
- Background color (subtle changes)

**Avoid Animating:**
- Layout properties (width, height, left, top)
- Font properties (size, weight, family)

## Development Rules

### Code Style

**Component Structure:**
```typescript
// 1. Imports
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 2. Types
interface Props {
  // prop definitions
}

// 3. Component
const Component: React.FC<Props> = ({ prop1, prop2 }) => {
  // Component logic

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{content}</Text>
    </View>
  );
};

// 4. Styles
const styles = StyleSheet.create({
  container: {
    // styles
  },
  text: {
    // styles
  },
});

export default Component;
```

**Naming Conventions:**
- **Components:** PascalCase (UserProfile, FoodCard)
- **Variables:** camelCase (userName, isLoading)
- **Constants:** UPPER_SNAKE_CASE (API_BASE_URL, MAX_ITEMS)
- **Files:** kebab-case (user-profile.tsx, food-card.tsx)

### File Organization

```
app/
├── (tabs)/
│   ├── _layout.tsx
│   ├── index.tsx          # Home/Dashboard
│   ├── camera.tsx         # Camera screen
│   ├── meals.tsx          # Meal tracking
│   └── profile.tsx        # User profile
├── onboarding/
│   ├── welcome.tsx
│   ├── profile.tsx
│   ├── goals.tsx
│   ├── activity.tsx
│   ├── diet.tsx
│   ├── camera-tutorial.tsx
│   ├── notifications.tsx
│   ├── privacy.tsx
│   └── summary.tsx
├── components/
│   ├── common/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── modal.tsx
│   ├── food/
│   │   ├── food-card.tsx
│   │   ├── meal-item.tsx
│   │   └── nutrition-label.tsx
│   └── charts/
│       ├── progress-chart.tsx
│       └── macro-chart.tsx
├── contexts/
│   ├── onboarding-context.tsx
│   └── user-context.tsx
├── hooks/
│   ├── use-onboarding.ts
│   └── use-camera.ts
├── utils/
│   ├── calculations.ts
│   ├── validation.ts
│   └── storage.ts
└── types/
    ├── user.ts
    ├── onboarding.ts
    └── food.ts
```

### Performance Guidelines

**State Management:**
- Use React Context for global state
- Local state for component-specific data
- Avoid unnecessary re-renders with useMemo and useCallback

**Image Handling:**
- Optimize images before adding to the app
- Use appropriate formats (WebP for Android, optimized PNG for iOS)
- Implement lazy loading for long lists

**Animation Performance:**
- Use `transform` instead of layout properties
- Enable `useNativeDriver` for animations
- Keep animation complexity low

## Accessibility Guidelines

### Screen Reader Support

**Semantic Structure:**
- Use proper heading hierarchy
- Provide descriptive labels for interactive elements
- Include accessibility hints for complex interactions

**Focus Management:**
- Ensure logical focus order
- Provide focus indicators
- Handle focus restoration after modal closure

### Visual Accessibility

**Color Contrast:**
- Maintain 4.5:1 contrast ratio for normal text
- Maintain 3:1 contrast ratio for large text
- Don't rely on color alone for information

**Touch Targets:**
- Minimum 44x44px touch targets
- Adequate spacing between interactive elements
- Consider thumb reach zones on mobile

### Motor Accessibility

**Gesture Alternatives:**
- Provide button alternatives for swipe gestures
- Ensure all actions are accessible via touch
- Consider one-handed usage patterns

## Content Guidelines

### Writing Style

**Voice:** Friendly, encouraging, and motivating
**Tone:** Supportive and non-judgmental
**Language:** Simple, clear, and positive

**Microcopy Examples:**
- **Good:** "Great job logging your breakfast!"
- **Avoid:** "You finally remembered to track your food"
- **Good:** "Let's set some goals together"
- **Avoid:** "You need to fix your goals"

### Data Visualization

**Charts:**
- Use clean, minimal chart designs
- Provide clear labels and legends
- Use color consistently for meaning
- Include data tables for screen readers

**Numbers:**
- Format numbers appropriately (1,234 vs 1234)
- Use consistent units of measurement
- Provide context for numerical data

## Quality Assurance

### Testing Requirements

**Visual Testing:**
- Manual design review for all components
- Cross-device compatibility checks
- Dark mode testing
- Accessibility audit

**Functionality Testing:**
- Unit tests for business logic
- Integration tests for user flows
- E2E tests for critical paths

### Performance Benchmarks

**App Launch:** < 3 seconds
**Screen Transitions:** < 300ms
**Image Loading:** < 2 seconds
**API Responses:** < 1 second

## Onboarding Design Guidelines

### Onboarding Flow Structure

**Welcome Screen:**
- 5 slides with hero images from Figma design
- Modern gradient effects and smooth transitions
- Progressive disclosure of app features
- Clear call-to-action buttons

**Data Collection Screens:**
- Modern card-based layout with shadows
- Focus on one piece of information per screen
- Icon indicators for each data type
- Quick selection options where applicable
- Real-time validation feedback

**Visual Elements:**
- **Hero Images:** Use Figma-provided images (3216b7adc1294b15a468e83c9cae2192.webp, etc.)
- **Icons:** Large, circular icon containers with emoji or icons
- **Input Fields:** Modern floating labels with focus states
- **Buttons:** Primary buttons with gradient shadows on final screens
- **Progress Indicators:** Modern pill-shaped progress dots

### Onboarding Typography

**Screen Titles:**
- Font Size: 30px (3xl)
- Weight: 600 (Semibold)
- Line Height: 1.25 (Tight)
- Letter Spacing: -0.5px

**Screen Subtitles:**
- Font Size: 20px (xl)
- Weight: 500 (Medium)
- Line Height: 1.5 (Normal)

**Descriptions:**
- Font Size: 16px (base)
- Weight: 400 (Regular)
- Line Height: 1.75 (Relaxed)

### Onboarding Spacing

**Container Padding:** 24px horizontal (2xl)
**Top Padding:** 48px (4xl)
**Bottom Footer Padding:** 48px (4xl)
**Icon Size:** 80px circular containers
**Image Container:** 85% width, 65% height with xl border radius

### Onboarding Interactions

**Input Fields:**
- Focus state with primary color border
- Shadow effects on focused inputs
- Smooth transitions between states

**Quick Selection:**
- Button grid with 2px borders
- Selected state with primary background
- Shadow effects on selected items

**Progress Dots:**
- Default: 8px circular dots
- Active: 32px x 8px pill shape
- Smooth transitions between states

## Review Checklist

Before implementing any feature:

**Design:**
- [ ] Follows the modern purple color palette
- [ ] Uses gradient effects appropriately
- [ ] Implements proper onboarding typography scale
- [ ] Includes proper spacing and shadows
- [ ] Works in dark mode

**Onboarding Specific:**
- [ ] Uses Figma hero images correctly
- [ ] Implements modern card layouts
- [ ] Includes icon indicators
- [ ] Has proper progress indicators
- [ ] Focus states on inputs

**Accessibility:**
- [ ] Has proper contrast ratios (4.5:1 minimum)
- [ ] Includes screen reader labels
- [ ] Supports keyboard navigation
- [ ] Has adequate touch targets (44x44px minimum)

**Performance:**
- [ ] Optimized images and assets
- [ ] Efficient state management
- [ ] Smooth animations (200ms standard)
- [ ] Fast loading times

**Code Quality:**
- [ ] Follows naming conventions
- [ ] Proper file organization
- [ ] Includes error handling
- [ ] Has appropriate documentation

---

## Remember: Minimal. Cool. Aesthetic.

Every feature should feel intentional, every interaction should feel smooth, and every moment should feel like a delightful experience. Focus on the essentials, execute them beautifully, and remove everything else.

**Onboarding Philosophy:** Welcome users with beautiful visuals, collect information progressively, and make every step feel effortless and delightful.