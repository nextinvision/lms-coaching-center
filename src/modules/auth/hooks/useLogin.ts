// useLogin Hook
'use client';

import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import type { LoginCredentials } from '../types/auth.types';

export function useLogin() {
    const { isLoading, error } = useAuthStore();
    const [localError, setLocalError] = useState<string | null>(null);

    const login = async (credentials: LoginCredentials) => {
        try {
            setLocalError(null);
            
            // Call login API - it will return a redirect response with cookie set
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Important: include cookies
                body: JSON.stringify(credentials),
                redirect: 'follow', // Follow redirects automatically
            });

            // Check if response was redirected
            if (response.redirected && response.url) {
                // Server already redirected - just navigate to the URL
                // The cookie is already set by the server response
                window.location.href = response.url;
                return;
            }

            // If status is 307/302, extract redirect URL from Location header
            if (response.status === 307 || response.status === 302) {
                const location = response.headers.get('Location');
                if (location) {
                    window.location.href = location;
                    return;
                }
            }

            // Try to parse as JSON (for errors)
            try {
                const data = await response.json();
                
                if (!response.ok || !data.success) {
                    throw new Error(data.error || 'Login failed');
                }

                // If we have data, update store and redirect
                if (data.success && data.data) {
                    const { user, token, expiresAt } = data.data;
                    
                    useAuthStore.getState().setUser(user);
                    useAuthStore.getState().setSession({
                        id: '',
                        userId: user.id,
                        token,
                        expiresAt: new Date(expiresAt),
                        createdAt: new Date(),
                    });
                    // setUser already sets isAuthenticated to true
                    
                    // Determine redirect URL
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
                    }
                    
                    // Store token in localStorage
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('auth_token', token);
                    }
                    
                    // Redirect
                    window.location.href = redirectUrl;
                }
            } catch {
                // If JSON parsing fails, it might be a redirect response
                // Try to get redirect URL from response
                if (response.url) {
                    window.location.href = response.url;
                } else {
                    throw new Error('Login failed: Unable to parse response');
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
