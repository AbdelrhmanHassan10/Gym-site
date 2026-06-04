import React, { createContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [lang, setLang] = useState('en');
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleLang = () => {
    setLang((prevLang) => (prevLang === 'en' ? 'ar' : 'en'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, lang, toggleLang }}>
      {children}
    </ThemeContext.Provider>
  );
};
