// Language Selector Component
'use client';

import React, { useEffect } from 'react';
import { useLanguageStore } from '@/shared/store/languageStore';
import { Select } from '@/shared/components/ui/Select';
import { Globe } from 'lucide-react';
import useTranslation from '@/core/i18n/useTranslation';

export const LanguageSelector: React.FC = () => {
    const { language, setLanguage } = useLanguageStore();
    const { t } = useTranslation();

    // Update HTML lang attribute when language changes
    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.lang = language;
        }
    }, [language]);

    const options = [
        { label: 'English', value: 'en' },
        { label: 'অসমীয়া (Assamese)', value: 'as' },
    ];

    return (
        <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-gray-600" />
            <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'as')}
                options={options}
                className="w-auto"
            />
        </div>
    );
};

export default LanguageSelector;
