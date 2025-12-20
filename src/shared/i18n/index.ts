// i18n Configuration
import { en } from './locales/en';
import { as } from './locales/as';

export type Language = 'en' | 'as';
export type TranslationKey = keyof typeof en;

const translations = {
    en,
    as,
};

export function getTranslation(language: Language = 'en'): typeof en {
    return translations[language] || translations.en;
}

export function t(key: TranslationKey, language: Language = 'en'): string {
    const translation = getTranslation(language);
    const keys = key.split('.');
    let value: any = translation;

    for (const k of keys) {
        value = value?.[k];
        if (value === undefined) {
            console.warn(`Translation key not found: ${key}`);
            return key;
        }
    }

    return typeof value === 'string' ? value : key;
}

export { en, as };

