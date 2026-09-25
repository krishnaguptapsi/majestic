/**
 * Theme Context Provider
 * Manages theme state and provides dark/light mode toggle functionality
 * Automatically detects system preference and persists user choice to localStorage
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { darkTheme, lightTheme, applyThemeCSSVariables, createThemeVariables, ThemeName, Theme } from '../design-system/tokens';

// ============================================================================
// TYPES
// ============================================================================

interface ThemeContextType {
  isDark: boolean;
  themeName: ThemeName;
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (themeName: ThemeName) => void;
  prefersDarkMode: boolean;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeName;
}

// ============================================================================
// CONTEXT CREATION
// ============================================================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ============================================================================
// STORAGE KEYS
// ============================================================================

const THEME_STORAGE_KEY = 'majestic-pro-theme-preference';
const SYSTEM_THEME_QUERY = '(prefers-color-scheme: dark)';

// ============================================================================
// THEME PROVIDER COMPONENT
// ============================================================================

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, defaultTheme = 'dark' }) => {
  const [themeName, setThemeName] = useState<ThemeName>(defaultTheme);
  const [prefersDarkMode, setPrefersDarkMode] = useState<boolean>(true);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  const isDark = themeName === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  // ========================================================================
  // INITIALIZATION - Check saved preference and system preference
  // ========================================================================

  useEffect(() => {
    // Check for saved preference in localStorage
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null;

    // Detect system preference
    const mediaQuery = window.matchMedia(SYSTEM_THEME_QUERY);
    const systemPrefersDark = mediaQuery.matches;
    setPrefersDarkMode(systemPrefersDark);

    // Set theme: saved preference > system preference > default
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      setThemeName(savedTheme);
    } else if (systemPrefersDark) {
      setThemeName('dark');
    }

    setIsHydrated(true);
  }, []);

  // ========================================================================
  // APPLY THEME WHEN IT CHANGES
  // ========================================================================

  useEffect(() => {
    if (!isHydrated) return;

    // Update data attribute for CSS selectors
    document.documentElement.setAttribute('data-theme', themeName);

    // Add/remove light class for CSS theme switching
    if (themeName === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }

    // Update color-scheme for browser defaults
    document.documentElement.style.colorScheme = themeName === 'dark' ? 'dark' : 'light';

    // Save preference to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
  }, [themeName, isHydrated]);

  // ========================================================================
  // LISTEN FOR SYSTEM THEME CHANGES
  // ========================================================================

  useEffect(() => {
    const mediaQuery = window.matchMedia(SYSTEM_THEME_QUERY);

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      setPrefersDarkMode(e.matches);

      // If no saved preference, follow system preference
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (!savedTheme) {
        setThemeName(e.matches ? 'dark' : 'light');
      }
    };

    // Modern browsers use addEventListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }
    // Legacy browsers use addListener
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleSystemThemeChange);
      return () => mediaQuery.removeListener(handleSystemThemeChange);
    }
  }, []);

  // ========================================================================
  // TOGGLE THEME FUNCTION
  // ========================================================================

  const toggleTheme = () => {
    setThemeName((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setThemeManually = (newTheme: ThemeName) => {
    setThemeName(newTheme);
  };

  // ========================================================================
  // CONTEXT VALUE
  // ========================================================================

  const value: ThemeContextType = {
    isDark,
    themeName,
    theme,
    toggleTheme,
    setTheme: setThemeManually,
    prefersDarkMode,
  };

  // Don't render until hydrated to avoid hydration mismatch
  if (!isHydrated) {
    return <>{children}</>;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Main hook to use theme context
 * @throws Error if used outside ThemeProvider
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

/**
 * Hook to get current theme colors
 */
export const useThemeColors = () => {
  const { theme } = useTheme();
  return theme.colors;
};

/**
 * Hook to get current theme shadows
 */
export const useThemeShadows = () => {
  const { theme } = useTheme();
  return theme.shadows;
};

/**
 * Hook to get current theme spacing
 */
export const useThemeSpacing = () => {
  const { theme } = useTheme();
  return theme.spacing;
};

/**
 * Hook to get current theme typography
 */
export const useThemeTypography = () => {
  const { theme } = useTheme();
  return theme.typography;
};

/**
 * Hook to get current theme transitions
 */
export const useThemeTransitions = () => {
  const { theme } = useTheme();
  return theme.transitions;
};

/**
 * Hook to check if dark mode is active
 */
export const useDarkMode = (): boolean => {
  const { isDark } = useTheme();
  return isDark;
};

/**
 * Hook to get theme toggle function
 */
export const useThemeToggle = (): (() => void) => {
  const { toggleTheme } = useTheme();
  return toggleTheme;
};

// ============================================================================
// STYLED-COMPONENTS INTEGRATION HELPER
// ============================================================================

/**
 * Helper to create theme-aware styled components
 * Usage: const Container = styled.div`
 *   color: ${(props) => getThemeValue('colors.text.primary')(props)};
 * `;
 */
export const getThemeValue = (path: string) => (props: any) => {
  const keys = path.split('.');
  let value: any = props.theme || darkTheme;

  for (const key of keys) {
    value = value?.[key];
  }

  return value || 'transparent';
};

// ============================================================================
// CSS INITIALIZATION SCRIPT
// ============================================================================

/**
 * This script should be injected in the HTML head to prevent flash of wrong theme
 * Place this in your index.html before React mounts
 */
export const themeInitScript = `
  (function() {
    const THEME_STORAGE_KEY = 'majestic-pro-theme-preference';
    const SYSTEM_THEME_QUERY = '(prefers-color-scheme: dark)';
    
    // Check saved preference
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    
    // Check system preference
    const systemPrefersDark = window.matchMedia(SYSTEM_THEME_QUERY).matches;
    
    // Determine theme
    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    // Apply theme class immediately
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  })();
`;
