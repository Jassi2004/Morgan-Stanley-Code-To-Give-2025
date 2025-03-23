import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      change_language: "Change to Hindi",
      welcome_back:"Welcome Back!",
    },
  },
  hi: {
    translation: {
      welcome: "स्वागत है",
      change_language: "अंग्रेजी में बदलें",
    },
  },
  
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // Default language
    fallbackLng: "en", // Fallback to English if translation is missing
    interpolation: { escapeValue: false },
  });

export default i18n;
