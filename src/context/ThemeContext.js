import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme preference on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themePreference');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.log('Error loading theme preference:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    try {
      await AsyncStorage.setItem('themePreference', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  // Dark Mode Colors: Black and Darker Yellow blend (using GetStarted yellow #CFAD01)
  const darkColors = {
    primary: '#CFAD01', // Darker yellow/gold from GetStarted
    secondary: '#FFD700', // Brighter yellow for accents
    background: '#000000', // Black
    surface: '#1a1a1a', // Dark gray
    surfaceLight: '#2a2a2a', // Lighter dark gray
    text: '#FFFFFF', // White
    textSecondary: '#CCCCCC', // Light gray
    textMuted: '#999999', // Gray
    border: '#333333', // Dark border
    accent: '#CFAD01', // Darker yellow accent
    error: '#FF6B6B',
    success: '#4ECDC4',
    card: '#1a1a1a',
    cardBorder: '#333333',
    inputBackground: '#333333', // Dark gray for input background
    inputText: '#FFFFFF', // White for input text
    inputPlaceholder: '#CCCCCC', // Light gray for placeholder
    inputBorder: '#CFAD01', // Primary yellow for input border
    navy: '#30204D', // Navy blue from GetStarted
    darkNavy: '#0B005F', // Dark navy from GetStarted
  };

  // Light Mode Colors: Yellow (#CFAD01) and Navy Blue (#0B005F) - exact as specified
  const lightColors = {
    primary: '#CFAD01', // Yellow - exact as specified
    secondary: '#0B005F', // Navy Blue - exact as specified
    background: '#FFFFFF', // White background for cards/surfaces
    surface: '#FFFFFF', // White surface
    surfaceLight: '#FFF9E6', // Light yellow tint for surfaces
    text: '#0B005F', // Navy blue text for readability on light backgrounds
    textSecondary: '#30204D', // Darker navy for secondary text
    textMuted: '#666666', // Gray for muted text
    border: '#CFAD01', // Yellow border
    accent: '#0B005F', // Navy blue accent
    error: '#FF6B6B',
    success: '#4ECDC4',
    card: '#FFFFFF', // White cards with yellow border
    cardBorder: '#CFAD01', // Yellow border
    inputBackground: '#FFFFFF', // White input background
    inputText: '#0B005F', // Navy blue input text
    inputPlaceholder: '#999999', // Gray placeholder
    inputBorder: '#CFAD01', // Yellow border for inputs
    navy: '#0B005F', // Navy blue - exact as specified
    darkNavy: '#0B005F', // Dark navy - exact as specified
  };

  const colors = isDarkMode ? darkColors : lightColors;

  // Gradient colors for backgrounds (using GetStarted colors)
  const gradients = {
    dark: {
      primary: ['#000000', '#1a1a1a', '#2a2a2a'], // Black gradient
      accent: ['#CFAD01', '#FFD700', '#FFA500'], // Darker yellow to brighter
      background: ['#000000', '#0a0a0a', '#1a1a1a'], // Black gradient
      main: ['#000000', '#1a1a1a', '#2a2a2a'], // Main dark gradient
    },
    light: {
      primary: ['#CFAD01', '#0B005F'], // Yellow to Navy Blue - exact as specified
      accent: ['#CFAD01', '#0B005F'], // Yellow to Navy Blue
      background: ['#CFAD01', '#0B005F'], // Yellow to Navy Blue gradient
      main: ['#CFAD01', '#30204D', '#0B005F'], // GetStarted gradient (keeping original for compatibility)
    },
  };

  const theme = {
    isDarkMode,
    colors,
    gradients: isDarkMode ? gradients.dark : gradients.light,
    toggleTheme,
  };

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

