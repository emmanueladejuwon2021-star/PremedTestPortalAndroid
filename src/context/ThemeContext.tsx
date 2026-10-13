import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/colors';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  colors: typeof Colors & {
    bg: string;
    cardBg: string;
    cardBorder: string;
    textPrimary: string;
    textSecondary: string;
  };
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  isDark: false,
  colors: {
    ...Colors,
    bg: '#F8FAFC',
    cardBg: '#FFFFFF',
    cardBorder: '#E2E8F0',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
  },
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    AsyncStorage.getItem('@premed_theme_mode').then((saved) => {
      if (saved === 'dark' || saved === 'light') {
        setMode(saved);
      }
    });
  }, []);

  const toggleTheme = () => {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    AsyncStorage.setItem('@premed_theme_mode', next);
  };

  const isDark = mode === 'dark';

  const themeColors = {
    ...Colors,
    bg: isDark ? Colors.dark.background : '#F8FAFC',
    cardBg: isDark ? Colors.dark.card : '#FFFFFF',
    cardBorder: isDark ? Colors.dark.border : '#E2E8F0',
    textPrimary: isDark ? Colors.dark.text : Colors.slate900,
    textSecondary: isDark ? Colors.dark.textMuted : Colors.slate500,
  };

  return (
    <ThemeContext.Provider value={{ mode, isDark, colors: themeColors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
