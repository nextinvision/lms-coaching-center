// useAuth Hook
'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../utils/permissions';
import type { Permission } from '../types/auth.types';

// Global initialization flag to ensure auth is only initialized once
let globalAuthInitialized = false;

export function useAuth() {
    const {
        user,
        session,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        checkAuth,
        clearError,
        initializeAuth,
        isInitialized,
    } = useAuthStore();

    const hasInitializedRef = useRef(false);

    // Initialize auth globally once
    useEffect(() => {
        // Only initialize once globally and if not already initialized
        if (!globalAuthInitialized && !hasInitializedRef.current && !isInitialized) {
            hasInitializedRef.current = true;
            globalAuthInitialized = true;
            initializeAuth().finally(() => {
                // Reset global flag after a delay to allow re-initialization on page reload
                setTimeout(() => {
                    globalAuthInitialized = false;
                }, 1000);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once on mount

    // Permission helpers
    const can = (permission: Permission): boolean => {
        if (!user) return false;
        return hasPermission(user.role, permission);
    };

    const canAny = (permissions: Permission[]): boolean => {
        if (!user) return false;
        return hasAnyPermission(user.role, permissions);
    };

    const canAll = (permissions: Permission[]): boolean => {
        if (!user) return false;
        return hasAllPermissions(user.role, permissions);
    };

    // Role helpers
    const isStudent = user?.role === 'STUDENT';
    const isTeacher = user?.role === 'TEACHER';
    const isAdmin = user?.role === 'ADMIN';

    return {
        // State
        user,
        session,
        isAuthenticated,
        isLoading,
        error,

        // Actions
        login,
        logout,
        checkAuth,
        clearError,
        initializeAuth,

        // Permission helpers
        can,
        canAny,
        canAll,

        // Role helpers
        isStudent,
        isTeacher,
        isAdmin,
    };
}

export default useAuth;
