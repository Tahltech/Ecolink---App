import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTheme } from '../styles/theme';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'ecolink_theme_mode';

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(Appearance.getColorScheme() || 'light');

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setMode(stored);
    })();
  }, []);

  const setThemeMode = async (nextMode) => {
    setMode(nextMode);
    await AsyncStorage.setItem(STORAGE_KEY, nextMode);
  };

  const toggleTheme = () => setThemeMode(mode === 'dark' ? 'light' : 'dark');

  const value = useMemo(
    () => ({ mode, theme: getTheme(mode), toggleTheme, setThemeMode }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeMode = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeMode must be used within a ThemeProvider');
  return ctx;
};
