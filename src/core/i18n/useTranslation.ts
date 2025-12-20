// useTranslation Hook
'use client';

import { useCallback } from 'react';
import enTranslations from './translations/en.json';
import asTranslations from './translations/as.json';
import { useLanguageStore } from '@/shared/store/languageStore';

type TranslationKey = string;
type Translations = typeof enTranslations;

const translations: Record<string, Translations> = {
    en: enTranslations,
    as: asTranslations,
};

export function useTranslation() {
    const { language } = useLanguageStore();

    const t = useCallback(
        (key: TranslationKey, params?: Record<string, string | number>): string => {
            const keys = key.split('.');
            let value: any = translations[language];

            for (const k of keys) {
                if (value && typeof value === 'object') {
                    value = value[k];
                } else {
                    return key; // Return key if translation not found
                }
            }

            if (typeof value !== 'string') {
                return key;
            }

            // Replace parameters
            if (params) {
                return Object.entries(params).reduce(
                    (str, [paramKey, paramValue]) =>
                        str.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue)),
                    value
                );
            }

            return value;
        },
        [language]
    );

    return { t, language };
}

export default useTranslation;
