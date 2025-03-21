import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import hi from './locales/hi.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
};

// Detect the user's language
const defaultLanguage = Localization.getLocales()[0].languageCode;

i18n.use(initReactI18next).init({
  resources,
  lng: 'hi', // Use detected language, fallback to English
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
