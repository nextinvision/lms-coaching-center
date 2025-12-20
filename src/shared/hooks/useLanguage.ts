// useLanguage Hook
'use client';

import { useLanguageStore } from '../store/languageStore';

export function useLanguage() {
    const { language, setLanguage } = useLanguageStore();

    return {
        language,
        setLanguage,
        isEnglish: language === 'en',
        isAssamese: language === 'as',
    };
}

export default useLanguage;

