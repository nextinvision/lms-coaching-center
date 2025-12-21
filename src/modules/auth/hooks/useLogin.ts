// useLogin Hook
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import type { LoginCredentials } from '../types/auth.types';

export function useLogin() {
    const router = useRouter();
    const { login: loginAction, isLoading, error } = useAuthStore();
    const [localError, setLocalError] = useState<string | null>(null);

    const login = async (credentials: LoginCredentials) => {
        try {
            setLocalError(null);
            await loginAction(credentials);

            // Get user after login
            const user = useAuthStore.getState().user;
            if (user) {
                // Determine redirect URL based on role
                let redirectUrl = '/';
                switch (user.role) {
                    case 'STUDENT':
                        redirectUrl = '/student/dashboard';
                        break;
                    case 'TEACHER':
                        redirectUrl = '/teacher/dashboard';
                        break;
                    case 'ADMIN':
                        redirectUrl = '/admin/dashboard';
                        break;
                    default:
                        redirectUrl = '/';
                }

                // Use window.location.href for hard navigation to ensure cookie is sent
                // This works reliably across all deployment platforms (Vercel, Railway, etc.)
                // Small delay to ensure cookie is set in browser before navigation
                setTimeout(() => {
                    if (typeof window !== 'undefined') {
                        window.location.href = redirectUrl;
                    }
                }, 100);
            }
        } catch (err) {
            setLocalError((err as Error).message);
            throw err;
        }
    };

    return {
        login,
        isLoading,
        error: error || localError,
    };
}

export default useLogin;
