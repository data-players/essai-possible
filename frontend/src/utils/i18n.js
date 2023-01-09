import i18next from "i18next";
import {initReactI18next} from "react-i18next";
import BrowserLanguageDetector from "i18next-browser-languagedetector";
import fr from "../locales/fr.json";
import en from "../locales/en.json";

export const initI18n = () =>
  i18next
    .use(BrowserLanguageDetector)
    .use(initReactI18next)
    .init({
      initImmediate: true,
      resources: {
        fr: {translation: fr},
        en: {translation: en},
      },
      interpolation: {escapeValue: false},
      fallbackLng: "fr",
    });
