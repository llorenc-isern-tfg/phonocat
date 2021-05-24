import i18n from "i18next"
import intervalPlural from 'i18next-intervalplural-postprocessor'
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import { TRANSLATIONS_CA } from "./ca/translations-ca"
import { TRANSLATIONS_ES } from "./es/translations-es"
import { TRANSLATIONS_EN } from "./en/translations-en"

import { SELECTS_CA } from "./ca/selects-ca"
import { SELECTS_ES } from "./es/selects-es"
import { SELECTS_EN } from "./en/selects-en"

import { COUNTRIES_CA } from "./ca/countries-ca"
import { COUNTRIES_ES } from "./es/countries-es"
import { COUNTRIES_EN } from "./en/countries-en"

import { YUP_CA } from './ca/yup-ca'
import { YUP_ES } from './es/yup-es'
import { YUP_EN } from './en/yup-en'

import { TIMEAGO_CA } from './ca/timeago-ca'
import { TIMEAGO_ES } from './es/timeago-es'
import { TIMEAGO_EN } from './en/timeago-en'

intervalPlural.setOptions({
    intervalSeparator: ';',
    intervalRegex: /\((\S*)\).*{((.|\n)*)}/,
    intervalSuffix: '_interval'
});

i18n
    .use(LanguageDetector)
    .use(intervalPlural)
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
                translation: TRANSLATIONS_ES,
                select: SELECTS_ES,
                country: COUNTRIES_ES,
                yup: YUP_ES,
                timeago: TIMEAGO_ES
            },
            en: {
                translation: TRANSLATIONS_EN,
                select: SELECTS_EN,
                country: COUNTRIES_EN,
                yup: YUP_EN,
                timeago: TIMEAGO_EN
            }
        },
        interpolation: {
            escapeValue: false,
        }
    })