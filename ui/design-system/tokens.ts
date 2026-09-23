/**
 * Design System Tokens
 * Central source of truth for colors, spacing, shadows, and typography
 * Supports both dark and light themes with seamless switching
 */

// ============================================================================
// DARK THEME (Default)
// ============================================================================

export const darkTheme = {
  colors: {
    // Primary Colors
    primary: 'hsl(280, 100%, 50%)',      // Vibrant Purple
    primaryLight: 'hsl(280, 100%, 60%)',
    primaryDark: 'hsl(280, 100%, 40%)',

    // Secondary Colors
    secondary: 'hsl(200, 100%, 50%)',    // Bright Cyan
    secondaryLight: 'hsl(200, 100%, 60%)',
    secondaryDark: 'hsl(200, 100%, 40%)',

    // Accent Colors
    accent: 'hsl(330, 100%, 50%)',       // Neon Pink
    accentLight: 'hsl(330, 100%, 60%)',
    accentDark: 'hsl(330, 100%, 40%)',

    // Semantic Colors
    success: 'hsl(150, 100%, 45%)',      // Neon Green
    successLight: 'hsl(150, 100%, 55%)',
    successDark: 'hsl(150, 100%, 35%)',

    warning: 'hsl(40, 100%, 50%)',       // Neon Yellow
    warningLight: 'hsl(40, 100%, 60%)',
    warningDark: 'hsl(40, 100%, 40%)',

    error: 'hsl(0, 100%, 50%)',          // Neon Red
    errorLight: 'hsl(0, 100%, 60%)',
    errorDark: 'hsl(0, 100%, 40%)',

    info: 'hsl(200, 100%, 50%)',         // Bright Cyan (same as secondary)

    // Background & Surface
    background: 'hsl(280, 20%, 8%)',     // Deep Purple Black #0d0d1a
    backgroundAlt: 'hsl(280, 20%, 12%)', // Slightly lighter
    surface: 'hsl(280, 15%, 15%)',       // Purple Black Surface #1a1a2e
    surfaceAlt: 'hsl(280, 15%, 20%)',    // Slightly lighter surface
    surfaceHover: 'hsl(280, 15%, 25%)',  // On hover
    surfaceActive: 'hsl(280, 15%, 30%)', // When active

    // Borders & Dividers
    border: 'hsl(280, 10%, 25%)',        // Purple Gray Border
    borderLight: 'hsl(280, 10%, 35%)',   // Lighter border
    divider: 'hsl(280, 10%, 20%)',       // Divider lines

    // Text Colors
    text: {
      primary: 'hsl(0, 0%, 95%)',        // Near White
      secondary: 'hsl(0, 0%, 70%)',      // Gray
      tertiary: 'hsl(0, 0%, 50%)',       // Darker gray
      disabled: 'hsl(0, 0%, 40%)',       // Very dark gray
      inverse: 'hsl(280, 20%, 8%)',      // Inverse of background
    },

    // Interactive
    link: 'hsl(200, 100%, 50%)',         // Bright Cyan
    linkHover: 'hsl(200, 100%, 60%)',
    linkActive: 'hsl(200, 100%, 40%)',

    // Overlay & Backdrop
    overlay: 'rgba(0, 0, 0, 0.5)',
    backdropDark: 'rgba(0, 0, 0, 0.7)',
  },

  // Shadows for depth and elevation
  shadows: {
    xs: '0 2px 8px rgba(0, 0, 0, 0.1)',
    sm: '0 4px 12px rgba(0, 0, 0, 0.15)',
    md: '0 8px 24px rgba(0, 0, 0, 0.2)',
    lg: '0 12px 40px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 60px rgba(0, 0, 0, 0.4)',

    // Glow effects (neon)
    glowPrimary: '0 0 20px rgba(200, 50, 255, 0.5), 0 0 40px rgba(200, 50, 255, 0.3)',
    glowSecondary: '0 0 20px rgba(0, 255, 200, 0.5), 0 0 40px rgba(0, 255, 200, 0.3)',
    glowSuccess: '0 0 20px rgba(100, 255, 150, 0.5), 0 0 40px rgba(100, 255, 150, 0.3)',
    glowError: '0 0 20px rgba(255, 100, 100, 0.5), 0 0 40px rgba(255, 100, 100, 0.3)',

    // Text shadows (neon text effect)
    textGlow: '0 0 10px rgba(0, 255, 200, 0.8), 0 0 20px rgba(0, 255, 200, 0.5)',
    textGlowPrimary: '0 0 10px rgba(200, 50, 255, 0.8), 0 0 20px rgba(200, 50, 255, 0.5)',

    // Glassmorphism effect base
    glass: '0 8px 32px rgba(31, 38, 135, 0.37)',
  },

  // Spacing scale (4px base unit)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },

  // Border radius
  radius: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
    circle: '50%',
  },

  // Typography
  typography: {
    fontFamily: {
      base: '"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      mono: '"Monaco", "Menlo", "Courier New", monospace',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      xxl: '24px',
      xxxl: '32px',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
  },

  // Transitions & animations
  transitions: {
    fast: '150ms ease-in-out',
    base: '250ms ease-in-out',
    slow: '350ms ease-in-out',
    slowest: '500ms ease-in-out',

    // Timing functions
    timing: {
      linear: 'linear',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      easeInBack: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
      easeOutBack: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
  },

  // Breakpoints for responsive design
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    xxl: '1536px',
  },

  // Z-index scale
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 100,
    sticky: 200,
    fixed: 300,
    backdrop: 400,
    offcanvas: 500,
    modal: 600,
    popover: 700,
    tooltip: 800,
    notification: 900,
  },
};

// ============================================================================
// LIGHT THEME
// ============================================================================

export const lightTheme = {
  colors: {
    // Primary Colors (slightly more saturated for light theme)
    primary: 'hsl(280, 85%, 55%)',       // Adjusted Purple
    primaryLight: 'hsl(280, 85%, 65%)',
    primaryDark: 'hsl(280, 85%, 45%)',

    // Secondary Colors
    secondary: 'hsl(200, 85%, 45%)',     // Adjusted Cyan
    secondaryLight: 'hsl(200, 85%, 55%)',
    secondaryDark: 'hsl(200, 85%, 35%)',

    // Accent Colors
    accent: 'hsl(330, 85%, 50%)',        // Adjusted Pink
    accentLight: 'hsl(330, 85%, 60%)',
    accentDark: 'hsl(330, 85%, 40%)',

    // Semantic Colors
    success: 'hsl(150, 85%, 40%)',       // Adjusted Green
    successLight: 'hsl(150, 85%, 50%)',
    successDark: 'hsl(150, 85%, 30%)',

    warning: 'hsl(40, 90%, 45%)',        // Adjusted Yellow
    warningLight: 'hsl(40, 90%, 55%)',
    warningDark: 'hsl(40, 90%, 35%)',

    error: 'hsl(0, 85%, 50%)',           // Adjusted Red
    errorLight: 'hsl(0, 85%, 60%)',
    errorDark: 'hsl(0, 85%, 40%)',

    info: 'hsl(200, 85%, 45%)',          // Adjusted Cyan

    // Background & Surface (Light theme)
    background: 'hsl(0, 0%, 98%)',       // Off White #f7f7f7
    backgroundAlt: 'hsl(0, 0%, 95%)',    // Slightly darker
    surface: 'hsl(0, 0%, 100%)',         // Pure White
    surfaceAlt: 'hsl(0, 0%, 97%)',       // Slightly off white
    surfaceHover: 'hsl(0, 0%, 95%)',     // On hover
    surfaceActive: 'hsl(0, 0%, 92%)',    // When active

    // Borders & Dividers (Light theme)
    border: 'hsl(0, 0%, 85%)',           // Light Gray Border
    borderLight: 'hsl(0, 0%, 90%)',      // Lighter border
    divider: 'hsl(0, 0%, 88%)',          // Divider lines

    // Text Colors (Light theme)
    text: {
      primary: 'hsl(0, 0%, 15%)',        // Near Black
      secondary: 'hsl(0, 0%, 45%)',      // Gray
      tertiary: 'hsl(0, 0%, 60%)',       // Lighter gray
      disabled: 'hsl(0, 0%, 70%)',       // Very light gray
      inverse: 'hsl(0, 0%, 98%)',        // Inverse of background
    },

    // Interactive
    link: 'hsl(200, 85%, 45%)',          // Cyan
    linkHover: 'hsl(200, 85%, 35%)',
    linkActive: 'hsl(200, 85%, 25%)',

    // Overlay & Backdrop (Light theme)
    overlay: 'rgba(0, 0, 0, 0.3)',
    backdropDark: 'rgba(0, 0, 0, 0.4)',
  },

  // Shadows (lighter for light theme)
  shadows: {
    xs: '0 2px 8px rgba(0, 0, 0, 0.08)',
    sm: '0 4px 12px rgba(0, 0, 0, 0.1)',
    md: '0 8px 24px rgba(0, 0, 0, 0.12)',
    lg: '0 12px 40px rgba(0, 0, 0, 0.15)',
    xl: '0 20px 60px rgba(0, 0, 0, 0.2)',

    // Glow effects (more subtle for light theme)
    glowPrimary: '0 0 15px rgba(200, 50, 255, 0.3), 0 0 30px rgba(200, 50, 255, 0.15)',
    glowSecondary: '0 0 15px rgba(0, 150, 200, 0.3), 0 0 30px rgba(0, 150, 200, 0.15)',
    glowSuccess: '0 0 15px rgba(100, 200, 150, 0.3), 0 0 30px rgba(100, 200, 150, 0.15)',
    glowError: '0 0 15px rgba(255, 100, 100, 0.3), 0 0 30px rgba(255, 100, 100, 0.15)',

    // Text shadows
    textGlow: '0 0 8px rgba(0, 150, 200, 0.5), 0 0 16px rgba(0, 150, 200, 0.25)',
    textGlowPrimary: '0 0 8px rgba(200, 50, 255, 0.5), 0 0 16px rgba(200, 50, 255, 0.25)',

    // Glassmorphism effect base
    glass: '0 8px 32px rgba(31, 38, 135, 0.15)',
  },

  // Spacing (same across themes)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },

  // Border radius (same across themes)
  radius: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
    circle: '50%',
  },

  // Typography (same across themes)
  typography: {
    fontFamily: {
      base: '"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      mono: '"Monaco", "Menlo", "Courier New", monospace',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      xxl: '24px',
      xxxl: '32px',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
  },

  // Transitions & animations (same across themes)
  transitions: {
    fast: '150ms ease-in-out',
    base: '250ms ease-in-out',
    slow: '350ms ease-in-out',
    slowest: '500ms ease-in-out',

    timing: {
      linear: 'linear',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      easeInBack: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
      easeOutBack: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
  },

  // Breakpoints (same across themes)
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    xxl: '1536px',
  },

  // Z-index scale (same across themes)
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 100,
    sticky: 200,
    fixed: 300,
    backdrop: 400,
    offcanvas: 500,
    modal: 600,
    popover: 700,
    tooltip: 800,
    notification: 900,
  },
};

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type Theme = typeof darkTheme;
export type ThemeName = 'dark' | 'light';
export type ColorName = keyof typeof darkTheme.colors;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get theme by name
 */
export const getTheme = (name: ThemeName): Theme => {
  return name === 'dark' ? darkTheme : lightTheme;
};

/**
 * Get color from theme
 */
export const getColor = (theme: Theme, colorPath: string): string => {
  const keys = colorPath.split('.');
  let value: any = theme.colors;

  for (const key of keys) {
    value = value?.[key];
  }

  return value || 'transparent';
};

/**
 * Create CSS variables from theme
 */
export const createThemeVariables = (theme: Theme, prefix = '--'): Record<string, string> => {
  const vars: Record<string, string> = {};

  // Colors
  const flattenColors = (obj: any, parentKey = ''): void => {
    Object.entries(obj).forEach(([key, value]) => {
      const varName = parentKey ? `${parentKey}-${key}` : key;

      if (typeof value === 'string') {
        vars[`${prefix}color-${varName}`] = value;
      } else if (typeof value === 'object') {
        flattenColors(value, varName);
      }
    });
  };

  flattenColors(theme.colors);

  // Shadows
  Object.entries(theme.shadows).forEach(([key, value]) => {
    vars[`${prefix}shadow-${key}`] = value;
  });

  // Spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    vars[`${prefix}spacing-${key}`] = value;
  });

  // Radius
  Object.entries(theme.radius).forEach(([key, value]) => {
    vars[`${prefix}radius-${key}`] = value;
  });

  // Transitions
  Object.entries(theme.transitions).forEach(([key, value]) => {
    if (typeof value === 'string') {
      vars[`${prefix}transition-${key}`] = value;
    }
  });

  return vars;
};

/**
 * Apply theme CSS variables to document root
 */
export const applyThemeCSSVariables = (theme: Theme): void => {
  const root = document.documentElement;
  const vars = createThemeVariables(theme);

  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};
