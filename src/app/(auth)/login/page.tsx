'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/shared/components/layout/AuthLayout';
import { LoginForm, LanguageSelector, useAuth } from '@/modules/auth';
import useTranslation from '@/core/i18n/useTranslation';
import { Loader } from '@/shared/components/ui/Loader';

export default function LoginPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const { isAuthenticated, isLoading, user } = useAuth();
    const [shouldRedirect, setShouldRedirect] = useState(false);

    // Redirect authenticated users to their dashboard
    // Use a delay to ensure auth state is fully settled
    useEffect(() => {
        if (!isLoading && isAuthenticated && user) {
            // Wait a bit for auth state to fully settle
            const timer = setTimeout(() => {
                setShouldRedirect(true);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, isLoading, user]);

    // Perform redirect in separate effect to avoid race conditions
    useEffect(() => {
        if (shouldRedirect && user) {
            switch (user.role) {
                case 'STUDENT':
                    router.replace('/student/dashboard');
                    break;
                case 'TEACHER':
                    router.replace('/teacher/dashboard');
                    break;
                case 'ADMIN':
                    router.replace('/admin/dashboard');
                    break;
                default:
                    router.replace('/');
            }
        }
    }, [shouldRedirect, user, router]);

    // Show loader while checking authentication or redirecting
    if (isLoading || shouldRedirect) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" text={shouldRedirect ? "Redirecting to dashboard..." : "Checking authentication..."} />
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
