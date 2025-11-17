/**
 * CaloriTrack - Theme Context Provider
 * Minimal. Cool. Aesthetic.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, ThemeContextType, LightTheme, DarkTheme } from '../theme';

// Theme storage key
const THEME_STORAGE_KEY = '@caloritrack_theme';

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme Provider Component
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: 'light' | 'dark';
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'light',
  storageKey = THEME_STORAGE_KEY,
}) => {
  const [isDark, setIsDark] = useState(defaultTheme === 'dark');
  const [theme, setThemeState] = useState<Theme>(defaultTheme === 'dark' ? DarkTheme : LightTheme);

  // Load theme from storage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        // For now, we'll use a simple approach
        // In a real app, you'd use AsyncStorage or similar
        const storedTheme = localStorage.getItem(storageKey);
        if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
          setIsDark(storedTheme === 'dark');
          setThemeState(storedTheme === 'dark' ? DarkTheme : LightTheme);
        }
      } catch (error) {
        console.warn('Failed to load theme from storage:', error);
      }
    };

    loadTheme();
  }, [storageKey]);

  // Toggle theme
  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    setThemeState(newIsDark ? DarkTheme : LightTheme);

    // Save to storage
    try {
      localStorage.setItem(storageKey, newIsDark ? 'dark' : 'light');
    } catch (error) {
      console.warn('Failed to save theme to storage:', error);
    }
  };

  // Set specific theme
  const setTheme = (themeType: 'light' | 'dark') => {
    const newIsDark = themeType === 'dark';
    setIsDark(newIsDark);
    setThemeState(newIsDark ? DarkTheme : LightTheme);

    // Save to storage
    try {
      localStorage.setItem(storageKey, themeType);
    } catch (error) {
      console.warn('Failed to save theme to storage:', error);
    }
  };

  const contextValue: ThemeContextType = {
    theme,
    isDark,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme
export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

// Higher-order component for theme access
export const withTheme = <P extends object>(
  Component: React.ComponentType<P & { theme: Theme; isDark: boolean }>
) => {
  const WithThemeComponent = (props: P) => {
    const { theme, isDark } = useThemeContext();
    return <Component {...props} theme={theme} isDark={isDark} />;
  };

  WithThemeComponent.displayName = `withTheme(${Component.displayName || Component.name})`;

  return WithThemeComponent;
};

// Export for convenience
export { ThemeContext };