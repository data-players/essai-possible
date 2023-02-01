import i18next from "i18next";
import {initReactI18next, useTranslation} from "react-i18next";
import BrowserLanguageDetector from "i18next-browser-languagedetector";
import fr from "../locales/fr.json";
import dayjs from "dayjs";

export const initI18n = () => {
  i18next
    .use(BrowserLanguageDetector)
    .use(initReactI18next)
    .init({
      initImmediate: true,
      resources: {
        fr: {translation: fr},
      },
      interpolation: {escapeValue: false},
      fallbackLng: "fr",
    });

  dayjs.locale("fr");
};

export function useTranslationWithDates() {
  const {t} = useTranslation();
  const tDate = (date, context) => t("intl.date", {val: dayjs(date), context});
  const tDateTime = (date, context) => t("intl.dateTime", {val: dayjs(date), context});
  const tTime = (date, context) => t("intl.time", {val: dayjs(date), context});
  return {t, tTime, tDate, tDateTime};
}
