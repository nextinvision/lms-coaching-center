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
    lastLoginTime: number | null; // Track when user last logged in
    isInitialized: boolean; // Track if auth has been initialized
    checkAuthPromise: Promise<void> | null; // Track ongoing checkAuth to prevent duplicates

    // Actions
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: AuthUser | null) => void;
    setSession: (session: Session | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
    checkAuth: () => Promise<void>;
    initializeAuth: () => Promise<void>; // Initialize auth once globally
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            lastLoginTime: null,
            isInitialized: false,
            checkAuthPromise: null,

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
                        lastLoginTime: Date.now(), // Track login time
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
                        lastLoginTime: null,
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

            initializeAuth: async () => {
                const state = get();
                
                // Only initialize once
                if (state.isInitialized) {
                    return;
                }

                // If already authenticated from persisted state, mark as initialized
                if (state.isAuthenticated && state.session && state.user) {
                    // Handle Date deserialization from localStorage
                    const expiresAt = state.session.expiresAt instanceof Date 
                        ? state.session.expiresAt 
                        : new Date(state.session.expiresAt);
                    
                    const sessionExpiry = expiresAt.getTime();
                    if (sessionExpiry > Date.now()) {
                        // Ensure session has proper Date objects
                        set({ 
                            session: {
                                ...state.session,
                                expiresAt,
                                createdAt: state.session.createdAt instanceof Date
                                    ? state.session.createdAt
                                    : new Date(state.session.createdAt),
                            },
                            isInitialized: true 
                        });
                        return;
                    }
                }

                // Run checkAuth and mark as initialized
                await get().checkAuth();
                set({ isInitialized: true });
            },

            checkAuth: async () => {
                try {
                    // Check if we're on the client side
                    if (typeof window === 'undefined') {
                        return;
                    }

                    const state = get();
                    
                    // If there's already a checkAuth in progress, return that promise
                    if (state.checkAuthPromise) {
                        return state.checkAuthPromise;
                    }

                    // If user just logged in (within last 5 seconds), skip checkAuth
                    // This prevents race condition where checkAuth runs before cookie is available
                    if (state.lastLoginTime && Date.now() - state.lastLoginTime < 5000) {
                        return;
                    }

                    // If already authenticated and session is valid, skip check
                    if (state.isAuthenticated && state.session && state.user) {
                        // Handle Date deserialization from localStorage
                        const expiresAt = state.session.expiresAt instanceof Date 
                            ? state.session.expiresAt 
                            : new Date(state.session.expiresAt);
                        
                        const sessionExpiry = expiresAt.getTime();
                        if (sessionExpiry > Date.now()) {
                            // Ensure session has proper Date objects
                            set({
                                session: {
                                    ...state.session,
                                    expiresAt,
                                    createdAt: state.session.createdAt instanceof Date
                                        ? state.session.createdAt
                                        : new Date(state.session.createdAt),
                                },
                            });
                            return; // Session still valid, no need to check
                        }
                    }

                    // Create a promise for this checkAuth call
                    const checkAuthPromise = (async () => {
                        set({ isLoading: true });

                    // Get token from localStorage or cookies
                    const token = localStorage.getItem('auth_token');
                    
                    // Also check cookies as fallback
                    const cookieToken = document.cookie
                        .split('; ')
                        .find(row => row.startsWith('auth_token='))
                        ?.split('=')[1];

                    const authToken = token || cookieToken;

                    if (!authToken) {
                        set({ 
                            isLoading: false, 
                            isAuthenticated: false,
                            user: null,
                            session: null,
                        });
                        return;
                    }

                        // Verify token via API endpoint with timeout
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

                        let response: Response | null = null;
                        try {
                            response = await fetch('/api/auth/me', {
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

                            // Token invalid or request failed
                            // Only clear if we got a 401 (unauthorized), not on network errors
                            if (response && response.status === 401) {
                                localStorage.removeItem('auth_token');
                                set({
                                    user: null,
                                    session: null,
                                    isAuthenticated: false,
                                    isLoading: false,
                                    lastLoginTime: null,
                                });
                            } else {
                                // Network error or other issue - don't clear auth state
                                set({ isLoading: false });
                            }
                        } catch (fetchError) {
                            clearTimeout(timeoutId);
                            if (fetchError instanceof Error && fetchError.name === 'AbortError') {
                                console.warn('Auth check timeout');
                                // Timeout - don't clear auth state, might be network issue
                                set({ isLoading: false });
                            } else {
                                // Other error - don't clear auth state
                                set({ isLoading: false });
                            }
                        }
                    })();

                    // Store the promise and clear it when done
                    set({ checkAuthPromise });
                    try {
                        await checkAuthPromise;
                    } finally {
                        set({ checkAuthPromise: null });
                    }
                } catch (error) {
                    console.error('Auth check error:', error);
                    // Don't clear auth state on network errors - might be temporary
                    // Only clear if we're sure the token is invalid
                    const state = get();
                    if (!state.isAuthenticated || !state.user) {
                        // Already not authenticated, just set loading to false
                        set({ isLoading: false });
                    } else {
                        // Keep current state, just stop loading
                        set({ isLoading: false });
                    }
                    set({ checkAuthPromise: null });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                session: state.session ? {
                    ...state.session,
                    // Serialize Date objects to ISO strings for storage
                    expiresAt: state.session.expiresAt instanceof Date 
                        ? state.session.expiresAt.toISOString() 
                        : state.session.expiresAt,
                    createdAt: state.session.createdAt instanceof Date 
                        ? state.session.createdAt.toISOString() 
                        : state.session.createdAt,
                } : null,
                isAuthenticated: state.isAuthenticated,
                lastLoginTime: state.lastLoginTime,
                isInitialized: false, // Always re-initialize on page load
            }),
            // Deserialize Date strings back to Date objects on rehydration
            merge: (persistedState, currentState) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const persisted = persistedState as Record<string, any>;
                
                // Convert date strings back to Date objects in session
                if (persisted?.session && typeof persisted.session === 'object') {
                    const session = persisted.session as Record<string, unknown>;
                    if (session.expiresAt && typeof session.expiresAt === 'string') {
                        session.expiresAt = new Date(session.expiresAt);
                    }
                    if (session.createdAt && typeof session.createdAt === 'string') {
                        session.createdAt = new Date(session.createdAt);
                    }
                }
                
                // Convert user date fields if they exist
                if (persisted?.user && typeof persisted.user === 'object') {
                    const user = persisted.user as Record<string, unknown>;
                    if (user.createdAt && typeof user.createdAt === 'string') {
                        user.createdAt = new Date(user.createdAt);
                    }
                    if (user.updatedAt && typeof user.updatedAt === 'string') {
                        user.updatedAt = new Date(user.updatedAt);
                    }
                }
                
                return {
                    ...currentState,
                    ...persisted,
                } as AuthState;
            },
        }
    )
);

export default useAuthStore;
