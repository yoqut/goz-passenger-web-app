import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ru from "./locales/ru.json";
import uz from "./locales/uz.json";

// Supported languages configuration
const SUPPORTED_LANGUAGES = ["uz", "ru", "en"] as const;
const DEFAULT_LANGUAGE = "uz";
const STORAGE_KEY = "ui-language";

// Translation resources
const resources = {
  uz: { translation: uz },
  ru: { translation: ru },
  en: { translation: en },
};

type Language = "uz" | "ru" | "en";

// Get saved language from localStorage with validation
const getSavedLanguage = (): Language => {
  if (globalThis.window === undefined) return "uz";

  const savedLang = localStorage.getItem(STORAGE_KEY);
  return savedLang && SUPPORTED_LANGUAGES.includes(savedLang as Language)
    ? (savedLang as "uz" | "ru" | "en")
    : "uz";
};

// Initialize i18n
i18n.use(initReactI18next).init({
  resources,
  lng: getSavedLanguage() || DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export { DEFAULT_LANGUAGE, STORAGE_KEY, SUPPORTED_LANGUAGES };

export { default } from "i18next";

