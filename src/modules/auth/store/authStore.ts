// Authentication Store (Zustand)
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, Session, LoginCredentials } from '../types/auth.types';

interface AuthState {
    user: AuthUser | null;
    session: Session | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: AuthUser | null) => void;
    setSession: (session: Session | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (credentials) => {
                try {
                    set({ isLoading: true, error: null });

                    // Call API endpoint instead of service directly (Prisma can't run in browser)
                    const response = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify(credentials),
                    });

                    const data = await response.json();

                    if (!response.ok || !data.success) {
                        throw new Error(data.error || 'Login failed');
                    }

                    set({
                        user: data.data.user,
                        session: {
                            id: '', // Will be set by backend
                            userId: data.data.user.id,
                            token: data.data.token,
                            expiresAt: new Date(data.data.expiresAt),
                            createdAt: new Date(),
                        },
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    // Store token in localStorage
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('auth_token', data.data.token);
                    }
                } catch (error) {
                    set({
                        error: (error as Error).message,
                        isLoading: false,
                        isAuthenticated: false,
                    });
                    throw error;
                }
            },

            logout: async () => {
                try {
                    // Call API endpoint instead of service directly
                    await fetch('/api/auth/logout', {
                        method: 'POST',
                        credentials: 'include',
                    });

                    // Clear token from localStorage
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('auth_token');
                    }

                    set({
                        user: null,
                        session: null,
                        isAuthenticated: false,
                        error: null,
                    });
                } catch (error) {
                    console.error('Logout error:', error);
                    // Clear state anyway
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('auth_token');
                    }
                    set({
                        user: null,
                        session: null,
                        isAuthenticated: false,
                    });
                }
            },

            setUser: (user) => set({ user, isAuthenticated: !!user }),

            setSession: (session) => set({ session }),

            setLoading: (loading) => set({ isLoading: loading }),

            setError: (error) => set({ error }),

            clearError: () => set({ error: null }),

            checkAuth: async () => {
                try {
                    set({ isLoading: true });

                    // Check if we're on the client side
                    if (typeof window === 'undefined') {
                        set({ isLoading: false, isAuthenticated: false });
                        return;
                    }

                    // Get token from localStorage or cookies
                    const token = localStorage.getItem('auth_token');
                    
                    // Also check cookies as fallback
                    const cookieToken = document.cookie
                        .split('; ')
                        .find(row => row.startsWith('auth_token='))
                        ?.split('=')[1];

                    const authToken = token || cookieToken;

                    if (!authToken) {
                        set({ isLoading: false, isAuthenticated: false });
                        return;
                    }

                    // Verify token via API endpoint with timeout
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

                    try {
                        const response = await fetch('/api/auth/me', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            credentials: 'include',
                            signal: controller.signal,
                        });

                        clearTimeout(timeoutId);

                        if (response.ok) {
                            const data = await response.json();
                            if (data.success && data.data?.user) {
                                const user = data.data.user;
                                set({
                                    user: {
                                        ...user,
                                        studentProfile: user.studentProfile || undefined,
                                        teacherProfile: user.teacherProfile || undefined,
                                        adminProfile: user.adminProfile || undefined,
                                    },
                                    session: {
                                        id: '',
                                        userId: user.id,
                                        token: authToken,
                                        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                                        createdAt: new Date(),
                                    },
                                    isAuthenticated: true,
                                    isLoading: false,
                                });
                                return;
                            }
                        }
                    } catch (fetchError) {
                        clearTimeout(timeoutId);
                        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
                            console.warn('Auth check timeout');
                        } else {
                            throw fetchError;
                        }
                    }

                    // Token invalid or request failed, clear everything
                    localStorage.removeItem('auth_token');
                    set({
                        user: null,
                        session: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                } catch (error) {
                    console.error('Auth check error:', error);
                    set({
                        user: null,
                        session: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                session: state.session,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

export default useAuthStore;
