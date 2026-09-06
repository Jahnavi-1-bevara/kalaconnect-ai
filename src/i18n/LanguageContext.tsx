import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage, LanguageOption } from '../types';
import { SUPPORTED_LANGUAGES, translations } from './translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
  languages: LanguageOption[];
}

const STORAGE_KEY = 'kalaconnect_language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
      if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
        return saved;
      }
    } catch {
      // Safe fallback on localStorage errors
    }
    return 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    if (!SUPPORTED_LANGUAGES.some(l => l.code === lang)) {
      return;
    }
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore write errors (e.g. private browsing storage quota)
    }
  };

  // Safe translation retriever with guaranteed English fallback
  const t = (key: string, fallback?: string): string => {
    if (!key || typeof key !== 'string') return fallback || '';

    // 1. Try selected language
    const currentLangDict = translations[language];
    if (currentLangDict && typeof currentLangDict[key] === 'string' && currentLangDict[key].trim() !== '') {
      return currentLangDict[key];
    }

    // 2. Safe fallback to English
    const englishDict = translations['en'];
    if (englishDict && typeof englishDict[key] === 'string' && englishDict[key].trim() !== '') {
      return englishDict[key];
    }

    // 3. Fallback to provided string or clean capitalized key without crash
    if (fallback) return fallback;
    const parts = key.split('.');
    const lastPart = parts[parts.length - 1] || key;
    return lastPart.replace(/_/g, ' ');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return a bulletproof fallback object so components never throw even if rendered outside provider
    return {
      language: 'en',
      setLanguage: () => {},
      t: (k: string, fb?: string) => fb || k || '',
      languages: SUPPORTED_LANGUAGES,
    };
  }
  return context;
};
