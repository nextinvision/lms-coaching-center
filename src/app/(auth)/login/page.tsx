'use client';

import { AuthLayout } from '@/shared/components/layout/AuthLayout';
import { LoginForm, LanguageSelector } from '@/modules/auth';
import useTranslation from '@/core/i18n/useTranslation';

export default function LoginPage() {
    const { t } = useTranslation();

    return (
        <AuthLayout
            title={t('auth.welcomeBack')}
            subtitle={t('auth.signIn')}
        >
            <div className="mb-4 flex justify-end">
                <LanguageSelector />
            </div>

            <LoginForm />

            <div className="mt-6 text-center text-sm text-gray-600">
                <p>Demo Credentials:</p>
                <p className="mt-1">
                    <strong>Student:</strong> student@example.com / password123
                </p>
                <p>
                    <strong>Teacher:</strong> teacher@example.com / password123
                </p>
                <p>
                    <strong>Admin:</strong> admin@example.com / password123
                </p>
            </div>
        </AuthLayout>
    );
}

