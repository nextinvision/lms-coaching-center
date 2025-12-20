'use client';

import { AuthLayout } from '@/shared/components/layout/AuthLayout';
import { LanguageSelector } from '@/modules/auth';
import useTranslation from '@/core/i18n/useTranslation';

export default function LanguageSelectPage() {
    const { t } = useTranslation();

    return (
        <AuthLayout
            title={t('auth.selectLanguage')}
            subtitle={t('auth.chooseYourLanguage')}
        >
            <div className="flex justify-center items-center min-h-[400px]">
                <LanguageSelector />
            </div>
        </AuthLayout>
    );
}

