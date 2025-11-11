'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define the shape of the context data
interface LanguageContextType {
  lang: 'en' | 'ar';
  setLang: (lang: 'en' | 'ar') => void;
}

// Create the context with a default undefined value
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Create the Provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<'en' | 'ar'>('ar'); // Default to Arabic

  useEffect(() => {
    // This effect runs once on the client after initial render
    const storedLang = localStorage.getItem('appLang') as 'en' | 'ar';
    if (storedLang) {
      setLangState(storedLang);
    }
  }, []);

  const setLang = (newLang: 'en' | 'ar') => {
    setLangState(newLang);
    // Persist the new language choice to localStorage
    localStorage.setItem('appLang', newLang);
  };

  // This effect updates the document's lang and dir attributes whenever the lang state changes
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Create a custom hook to easily use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
