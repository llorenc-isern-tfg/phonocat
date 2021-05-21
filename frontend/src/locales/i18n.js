import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import { TRANSLATIONS_CA } from "./ca/translations-ca"
import { TRANSLATIONS_ES } from "./es/translations-es"
import { TRANSLATIONS_EN } from "./en/translations-en"

import { SELECTS_CA } from "./ca/selects-ca"

import { COUNTRIES_CA } from "./ca/countries-ca"

import { YUP_CA } from './ca/yup-ca'

import { TIMEAGO_CA } from './ca/timeago-ca'

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            ca: {
                translation: TRANSLATIONS_CA,
                select: SELECTS_CA,
                country: COUNTRIES_CA,
                yup: YUP_CA,
                timeago: TIMEAGO_CA
            },
            es: {
                translation: TRANSLATIONS_ES
            },
            en: {
                translation: TRANSLATIONS_EN
            }
        },
        interpolation: {
            escapeValue: false,
        }
    });

i18n.changeLanguage('ca')