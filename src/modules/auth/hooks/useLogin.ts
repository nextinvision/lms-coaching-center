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

            // Redirect based on role
            const user = useAuthStore.getState().user;
            if (user) {
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
