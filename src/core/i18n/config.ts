// i18n Configuration
export type Locale = 'en' | 'as';

export const defaultLocale: Locale = 'en';

export const locales: Locale[] = ['en', 'as'];

export const localeNames: Record<Locale, string> = {
    en: 'English',
    as: 'অসমীয়া', // Assamese
};

export const i18nConfig = {
    defaultLocale,
    locales,
    localeNames,
};

export default i18nConfig;
