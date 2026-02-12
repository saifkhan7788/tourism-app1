import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { createTheme } from '@mui/material/styles';

const ThemeContext = createContext();

export const themes = {
  qatar: {
    name: 'Qatar (Maroon & Gold)',
    primary: '#8B1538',
    secondary: '#FFD700',
  },
  ocean: {
    name: 'Ocean Blue',
    primary: '#006994',
    secondary: '#00C9FF',
  },
  forest: {
    name: 'Forest Green',
    primary: '#2D5016',
    secondary: '#8BC34A',
  },
  sunset: {
    name: 'Sunset Orange',
    primary: '#D84315',
    secondary: '#FF9800',
  },
  royal: {
    name: 'Royal Purple',
    primary: '#4A148C',
    secondary: '#E1BEE7',
  },
};

export const ThemeContextProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('appTheme') || 'qatar');

  const theme = useMemo(() => {
    const selectedTheme = themes[currentTheme];
    return createTheme({
      palette: {
        primary: { main: selectedTheme.primary },
        secondary: { main: selectedTheme.secondary },
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      },
    });
  }, [currentTheme]);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      ::-webkit-scrollbar-thumb {
        background: ${themes[currentTheme].primary} !important;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: ${themes[currentTheme].primary}dd !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [currentTheme]);

  const changeTheme = (themeName) => {
    setCurrentTheme(themeName);
    localStorage.setItem('appTheme', themeName);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
