import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { TRANSLATIONS_CA } from "./ca/translations-ca";
import { TRANSLATIONS_ES } from "./es/translations-es";
import { TRANSLATIONS_EN } from "./en/translations-en";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            ca: {
                translation: TRANSLATIONS_CA
            },
            es: {
                translation: TRANSLATIONS_ES
            },
            en: {
                translation: TRANSLATIONS_EN
            }
        }
    });

i18n.changeLanguage('ca')