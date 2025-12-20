// useAuth Hook
'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../utils/permissions';
import type { Permission } from '../types/auth.types';

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
    } = useAuthStore();

    // Check auth on mount
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

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
