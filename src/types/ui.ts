import { ReactNode } from 'react';
import { TextStyle, ViewStyle, TextProps, ViewProps, TextInputProps } from 'react-native';
import { ReactElement, ComponentProps, PropsWithChildren } from 'react';
import { Href } from 'expo-router';

// Button Component Props
export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

// Input Component Props
export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Themed Components Props
export interface ThemedTextProps extends TextProps {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
}

export interface ThemedViewProps extends ViewProps {
  lightColor?: string;
  darkColor?: string;
}

// Dashboard Components Props
export interface StreakCardProps {
  currentStreak: number;
  bestStreak: number;
  weekDays: boolean[]; // 7 days of the week
  onPress?: () => void;
}

// Theme Types
export type Theme = {
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    background: string;
    surface: string;
    surfaceAlt: string;
    border: string;
    borderLight: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    textMuted: string;
    success: string;
    successLight: string;
    successDark: string;
    error: string;
    errorLight: string;
    errorDark: string;
    onboardingAccent: string;
    onboardingText: string;
    onboardingSubtle: string;
  };
  semanticColors: {
    background: {
      primary: string;
      secondary: string;
    };
    border: {
      primary: string;
      secondary: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      onPrimary: string;
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
    '5xl': number;
    '6xl': number;
    '8xl': number;
    '10xl': number;
    '12xl': number;
    '16xl': number;
    '20xl': number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  typography: {
    xs: TextStyle;
    sm: TextStyle;
    base: TextStyle;
    lg: TextStyle;
    xl: TextStyle;
    '2xl': TextStyle;
    '3xl': TextStyle;
    '4xl': TextStyle;
  };
  shadows: {
    sm: ViewStyle;
    md: ViewStyle;
    lg: ViewStyle;
    xl: ViewStyle;
  };
};

// Theme Context Type
export type ThemeContextType = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
};

// Theme Provider Component Props
export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: 'light' | 'dark';
  storageKey?: string;
}

// Utility Components Props
export interface ParallaxScrollViewProps extends PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}> {}

export interface ExternalLinkProps extends Omit<ComponentProps<typeof any>, 'href'> {
  href: Href & string;
}

// Card Component Props
export interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  padding?: number;
}

// Modal Component Props
export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'small' | 'medium' | 'large' | 'full';
  animationType?: 'none' | 'slide' | 'fade';
}

// Loading Props
export interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
}

// Icon Component Props
export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

// List Item Props
export interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: string;
  rightIcon?: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

// Chip Component Props
export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  closable?: boolean;
  onClose?: () => void;
  style?: ViewStyle;
}