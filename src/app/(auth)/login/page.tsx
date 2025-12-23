'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/shared/components/layout/AuthLayout';
import { LoginForm, LanguageSelector, useAuth } from '@/modules/auth';
import useTranslation from '@/core/i18n/useTranslation';
import { Loader } from '@/shared/components/ui/Loader';

export default function LoginPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const { isAuthenticated, isLoading, user } = useAuth();

    // Redirect authenticated users to their dashboard
    useEffect(() => {
        if (!isLoading && isAuthenticated && user) {
            switch (user.role) {
                case 'STUDENT':
                    router.push('/student/dashboard');
                    break;
                case 'TEACHER':
                    router.push('/teacher/dashboard');
                    break;
                case 'ADMIN':
                    router.push('/admin/dashboard');
                    break;
                default:
                    router.push('/');
            }
        }
    }, [isAuthenticated, isLoading, user, router]);

    // Show loader while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" text="Checking authentication..." />
            </div>
        );
    }

    // Show loader while redirecting
    if (isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" text="Redirecting to dashboard..." />
            </div>
        );
    }

    // Show login form only if not authenticated
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
