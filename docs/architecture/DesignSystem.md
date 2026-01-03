# CaloriTrack - Design System Documentation

## 🎨 Overview

CaloriTrack uses a comprehensive design system built on the principles of **Minimal. Cool. Aesthetic.** This system ensures consistent styling across all components while providing excellent developer experience and maintainability.

## 🏗️ Architecture

### File Structure
```
theme/
├── colors.ts          # Color palette and semantic colors
├── typography.ts      # Font families, sizes, weights, and text styles
├── spacing.ts         # 4px-based spacing system
├── border-radius.ts   # Border radius scale
├── shadows.ts         # Shadow system for different platforms
├── animations.ts      # Animation presets and easing functions
└── index.ts          # Main theme exports and utilities

components/ui/
├── button.tsx         # Themed button component
└── input.tsx          # Themed input component

contexts/
├── theme-context.tsx  # Theme provider with dark mode support
└── onboarding-context.tsx # Onboarding state management
```

## 🎨 Color System

### Primary Colors
- **Primary:** `#6366F1` (Indigo-500) - Main action buttons, accents
- **Primary Dark:** `#4F46E5` (Indigo-600) - Pressed states, active elements
- **Primary Light:** `#818CF8` (Indigo-400) - Hover states, subtle highlights

### Neutral Colors
- **Background:** `#FFFFFF` (Pure white) - Main app background
- **Surface:** `#FAFAFA` (Gray-50) - Cards, modals, elevated surfaces
- **Border:** `#E5E7EB` (Gray-200) - Subtle dividers, input borders
- **Text Primary:** `#111827` (Gray-900) - Main text, headings
- **Text Secondary:** `#6B7280` (Gray-500) - Supporting text, captions
- **Text Tertiary:** `#9CA3AF` (Gray-400) - Hints, placeholders

### Semantic Colors
- **Success:** `#10B981` (Emerald-500) - Positive actions, achievements
- **Error:** `#EF4444` (Red-500) - Error states, warnings
- **Warning:** `#F59E0B` (Amber-500) - Warning states
- **Info:** `#3B82F6` (Blue-500) - Informational content

### Dark Mode Support
All colors have corresponding dark mode variants in `DarkColors` and `DarkSemanticColors`.

## ✏️ Typography

### Font Family
- **Primary:** Inter (system-ui fallback)
- **Monospace:** SF Mono, Monaco, Consolas

### Font Sizes (px)
- **xs:** 12 - Tiny labels, captions
- **sm:** 14 - Small text, descriptions
- **base:** 16 - Body text, default size
- **lg:** 18 - Subheadings, emphasis
- **xl:** 20 - Section headings
- **2xl:** 24 - Page titles
- **3xl:** 30 - Hero titles
- **4xl:** 36 - Special occasions

### Font Weights
- **Regular:** 400
- **Medium:** 500 - UI elements, buttons
- **Semibold:** 600 - Headings, important labels
- **Bold:** 700 - Strong emphasis

### Text Styles
Pre-defined text styles for consistent usage:
- `display` - Hero titles
- `heroTitle` - Page titles
- `sectionTitle` - Section headers
- `cardTitle` - Card titles
- `body` - Body text
- `buttonText` - Button text
- `labelText` - Form labels
- `hintText` - Helper text
- `caption` - Captions

## 📏 Spacing System

### Base Scale (4px units)
- **xs:** 4px - Tiny spacing
- **sm:** 8px - Small gaps
- **md:** 12px - Moderate spacing
- **lg:** 16px - Standard spacing
- **xl:** 20px - Section separation
- **2xl:** 24px - Large spacing
- **3xl:** 32px - Component separation
- **4xl:** 40px - Page sections
- **5xl:** 48px - Major sections
- **6xl:** 64px - Page margins
- **7xl:** 80px - Hero sections

### Common Patterns
- `padding.sm/md/lg/xl` - Component internal spacing
- `margin.sm/md/lg/xl` - Component external spacing
- `gap.sm/md/lg/xl` - Gap between elements
- `section.sm/md/lg/xl` - Section spacing
- `container.sm/md/lg` - Container padding

## 🔲 Border Radius

### Scale
- **xs:** 4px - Small elements, tags
- **sm:** 8px - Buttons, input fields
- **md:** 12px - Cards, larger elements
- **lg:** 16px - Modals, special containers
- **xl:** 20px - Hero elements
- **full:** 9999px - Pills, avatars, circles

### Usage Patterns
- Buttons: `borderRadius.sm`
- Inputs: `borderRadius.sm`
- Cards: `borderRadius.md`
- Modals: `borderRadius.lg`
- Badges: `borderRadius.xs`
- Avatars: `borderRadius.full`

## 🌟 Shadows

### Shadow Scale
- **none:** No shadow
- **sm:** Subtle lift for small elements
- **md:** Standard shadow for cards
- **lg:** Large shadow for modals
- **xl:** Extra large shadow for overlays
- **inner:** Inner shadow for pressed states

### Platform-Specific Implementation
Shadows are automatically adapted for iOS, Android, and Web platforms:
- iOS: `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`
- Android: `elevation`
- Web: `box-shadow`

## 🎬 Animation System

### Timing Functions
- **smooth:** `cubic-bezier(0.4, 0, 0.2, 1)` - Standard animations
- **entrance:** `cubic-bezier(0, 0, 0.2, 1)` - Entrance animations
- **exit:** `cubic-bezier(0.4, 0, 1, 1)` - Exit animations
- **bounce:** `cubic-bezier(0.68, -0.55, 0.265, 1.55)` - Bounce effects
- **elastic:** Easing function for elastic animations

### Durations (ms)
- **fast:** 150ms - Micro-interactions
- **standard:** 200ms - UI transitions
- **slow:** 300ms - Page transitions, complex animations
- **slower:** 500ms - Loading states
- **slowest:** 1000ms - Special animations

### Common Animations
- Button press/release animations
- Card hover/pressed states
- Slide transitions (in/out, up/down)
- Fade animations
- Shake animation for errors
- Pulse animation
- Loading animations (skeleton, shimmer, spinner)
- Success animations (checkmark, confetti)

## 🧩 Components

### Button Component
```typescript
<Button
  title="Click me"
  onPress={() => console.log('pressed')}
  variant="primary" // primary, secondary, ghost
  size="medium"     // small, medium, large
  disabled={false}
  loading={false}
  fullWidth={false}
/>
```

### Input Component
```typescript
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="Enter your email"
  error={error}
  helperText="We'll never share your email"
  leftIcon={<EmailIcon />}
  rightIcon={<ClearIcon />}
/>
```

## 🎨 Theme Usage

### Using Theme Hook
```typescript
import { useTheme } from '../theme';

const MyComponent = () => {
  const { theme } = useTheme();

  return (
    <View style={{ backgroundColor: theme.semanticColors.background.primary }}>
      <Text style={{ color: theme.semanticColors.text.primary }}>
        Hello World
      </Text>
    </View>
  );
};
```

### Using Theme Context
```typescript
import { ThemeProvider } from '../contexts/theme-context';

export default function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

### Dark Mode Support
The theme automatically supports light and dark modes. Use `isDark` from the theme context to apply conditional styling if needed.

## 🛠️ Utilities

### Color Utilities
```typescript
import { hexToRgb, rgba, getContrastColor } from '../theme';

const rgb = hexToRgb('#6366F1'); // { r: 99, g: 102, b: 241 }
const withAlpha = rgba('#6366F1', 0.5); // 'rgba(99, 102, 241, 0.5)'
const textColor = getContrastColor('#6366F1'); // '#FFFFFF'
```

## 📱 Responsive Design

### Breakpoints
- **Mobile:** < 768px (4 columns)
- **Tablet:** 768px - 1024px (8 columns)
- **Desktop:** > 1024px (12 columns)

### Container Padding
- **Mobile:** 16px
- **Tablet:** 24px
- **Desktop:** 32px

## ♿ Accessibility

### Color Contrast
- Normal text: 4.5:1 contrast ratio minimum
- Large text: 3:1 contrast ratio minimum
- Never rely on color alone for information

### Touch Targets
- Minimum: 44x44px
- Recommended: 48x48px
- Adequate spacing between interactive elements

### Screen Reader Support
- Use semantic components
- Provide accessibility labels
- Maintain logical focus order

## 🎯 Best Practices

### Consistency
- Use predefined text styles instead of custom styling
- Follow spacing scale for all margins and padding
- Use semantic colors for meaningful UI elements

### Performance
- Use `transform` instead of layout properties for animations
- Enable `useNativeDriver` for animations
- Keep animation complexity low

### Maintainability
- Prefer theme values over hardcoded values
- Use semantic colors for meaningful elements
- Keep component styling consistent with design system

---

## 🚀 Getting Started

1. **Import theme:** `import { useTheme } from '../theme';`
2. **Use theme values:** Access colors, typography, spacing through theme object
3. **Apply components:** Use themed Button and Input components
4. **Follow patterns:** Use predefined styles and spacing scale
5. **Test accessibility:** Ensure proper contrast and touch targets

Remember: **Minimal. Cool. Aesthetic.** - Focus on essential features with beautiful execution.