import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Theme = 'dark' | 'light' | 'high-contrast' | 'vim-classic' | 'solarized-dark' | 'solarized-light' | 'monokai';

interface ThemeColors {
  // Background colors
  backgroundPrimary: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  backgroundElevated: string;
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  
  // Border colors
  border: string;
  borderSubtle: string;
  
  // Accent colors
  accentPrimary: string;
  accentPrimaryHover: string;
  accentSecondary: string;
  accentSecondaryHover: string;
  
  // Status colors
  statusSuccess: string;
  statusError: string;
  statusWarning: string;
  statusInfo: string;
  
  // Special colors
  codeBackground: string;
  codeText: string;
  selection: string;
}

export const themes: Record<Theme, ThemeColors> = {
  dark: {
    backgroundPrimary: '#030712', // gray-950
    backgroundSecondary: '#111827', // gray-900
    backgroundTertiary: '#1f2937', // gray-800
    backgroundElevated: '#374151', // gray-700
    
    textPrimary: '#f3f4f6', // gray-100
    textSecondary: '#d1d5db', // gray-300
    textMuted: '#9ca3af', // gray-400
    
    border: '#374151', // gray-700
    borderSubtle: '#1f2937', // gray-800
    
    accentPrimary: '#22c55e', // green-500
    accentPrimaryHover: '#16a34a', // green-600
    accentSecondary: '#3b82f6', // blue-500
    accentSecondaryHover: '#2563eb', // blue-600
    
    statusSuccess: '#22c55e', // green-500
    statusError: '#ef4444', // red-500
    statusWarning: '#eab308', // yellow-500
    statusInfo: '#3b82f6', // blue-500
    
    codeBackground: '#1f2937', // gray-800
    codeText: '#f3f4f6', // gray-100
    selection: 'rgba(34, 197, 94, 0.3)', // green-500 with opacity
  },
  
  light: {
    backgroundPrimary: '#ffffff',
    backgroundSecondary: '#f9fafb', // gray-50
    backgroundTertiary: '#f3f4f6', // gray-100
    backgroundElevated: '#e5e7eb', // gray-200
    
    textPrimary: '#111827', // gray-900
    textSecondary: '#374151', // gray-700
    textMuted: '#6b7280', // gray-500
    
    border: '#e5e7eb', // gray-200
    borderSubtle: '#f3f4f6', // gray-100
    
    accentPrimary: '#16a34a', // green-600
    accentPrimaryHover: '#15803d', // green-700
    accentSecondary: '#2563eb', // blue-600
    accentSecondaryHover: '#1d4ed8', // blue-700
    
    statusSuccess: '#16a34a', // green-600
    statusError: '#dc2626', // red-600
    statusWarning: '#d97706', // amber-600
    statusInfo: '#2563eb', // blue-600
    
    codeBackground: '#f3f4f6', // gray-100
    codeText: '#111827', // gray-900
    selection: 'rgba(22, 163, 74, 0.2)', // green-600 with opacity
  },
  
  'high-contrast': {
    backgroundPrimary: '#000000',
    backgroundSecondary: '#0a0a0a',
    backgroundTertiary: '#171717',
    backgroundElevated: '#262626',
    
    textPrimary: '#ffffff',
    textSecondary: '#ffffff',
    textMuted: '#a3a3a3',
    
    border: '#ffffff',
    borderSubtle: '#525252',
    
    accentPrimary: '#00ff00',
    accentPrimaryHover: '#00cc00',
    accentSecondary: '#00ffff',
    accentSecondaryHover: '#00cccc',
    
    statusSuccess: '#00ff00',
    statusError: '#ff0000',
    statusWarning: '#ffff00',
    statusInfo: '#00ffff',
    
    codeBackground: '#171717',
    codeText: '#ffffff',
    selection: 'rgba(0, 255, 0, 0.4)',
  },
  
  'vim-classic': {
    backgroundPrimary: '#000000',
    backgroundSecondary: '#080808',
    backgroundTertiary: '#101010',
    backgroundElevated: '#1a1a1a',
    
    textPrimary: '#00ff00',
    textSecondary: '#00cc00',
    textMuted: '#008800',
    
    border: '#00ff00',
    borderSubtle: '#004400',
    
    accentPrimary: '#00ff00',
    accentPrimaryHover: '#00cc00',
    accentSecondary: '#00ffff',
    accentSecondaryHover: '#00cccc',
    
    statusSuccess: '#00ff00',
    statusError: '#ff0000',
    statusWarning: '#ffff00',
    statusInfo: '#00ffff',
    
    codeBackground: '#080808',
    codeText: '#00ff00',
    selection: 'rgba(0, 255, 0, 0.3)',
  },
  
  'solarized-dark': {
    backgroundPrimary: '#002b36',
    backgroundSecondary: '#073642',
    backgroundTertiary: '#073642',
    backgroundElevated: '#586e75',
    
    textPrimary: '#839496',
    textSecondary: '#657b83',
    textMuted: '#586e75',
    
    border: '#073642',
    borderSubtle: '#002b36',
    
    accentPrimary: '#859900',
    accentPrimaryHover: '#859900',
    accentSecondary: '#268bd2',
    accentSecondaryHover: '#268bd2',
    
    statusSuccess: '#859900',
    statusError: '#dc322f',
    statusWarning: '#b58900',
    statusInfo: '#268bd2',
    
    codeBackground: '#073642',
    codeText: '#839496',
    selection: 'rgba(133, 153, 0, 0.3)',
  },
  
  'solarized-light': {
    backgroundPrimary: '#fdf6e3',
    backgroundSecondary: '#eee8d5',
    backgroundTertiary: '#eee8d5',
    backgroundElevated: '#93a1a1',
    
    textPrimary: '#657b83',
    textSecondary: '#839496',
    textMuted: '#93a1a1',
    
    border: '#eee8d5',
    borderSubtle: '#fdf6e3',
    
    accentPrimary: '#859900',
    accentPrimaryHover: '#859900',
    accentSecondary: '#268bd2',
    accentSecondaryHover: '#268bd2',
    
    statusSuccess: '#859900',
    statusError: '#dc322f',
    statusWarning: '#b58900',
    statusInfo: '#268bd2',
    
    codeBackground: '#eee8d5',
    codeText: '#657b83',
    selection: 'rgba(133, 153, 0, 0.2)',
  },
  
  monokai: {
    backgroundPrimary: '#272822',
    backgroundSecondary: '#2d2e27',
    backgroundTertiary: '#383a34',
    backgroundElevated: '#3e3d32',
    
    textPrimary: '#f8f8f2',
    textSecondary: '#e6db74',
    textMuted: '#75715e',
    
    border: '#75715e',
    borderSubtle: '#3e3d32',
    
    accentPrimary: '#a6e22e',
    accentPrimaryHover: '#86c02e',
    accentSecondary: '#66d9ef',
    accentSecondaryHover: '#46b9cf',
    
    statusSuccess: '#a6e22e',
    statusError: '#f92672',
    statusWarning: '#e6db74',
    statusInfo: '#66d9ef',
    
    codeBackground: '#2d2e27',
    codeText: '#f8f8f2',
    selection: 'rgba(166, 226, 46, 0.3)',
  },
};

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'vim-io-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return (stored as Theme) || 'dark';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    const colors = themes[theme];
    
    // Set CSS variables
    Object.entries(colors).forEach(([key, value]) => {
      const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVarName, value);
    });
    
    // Set theme attribute for potential CSS-based styling
    root.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors: themes[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}