// Protected Route Component
'use client';

import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { hasAnyPermission, hasAllPermissions } from '../utils/permissions';
import { Loader } from '@/shared/components/ui/Loader';
import type { Permission } from '../types/auth.types';

export interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredPermissions?: Permission[];
    requireAll?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredPermissions = [],
    requireAll = false,
}) => {
    const router = useRouter();
    // Use store directly to avoid triggering checkAuth multiple times
    const { isAuthenticated, isLoading, user } = useAuthStore();
    
    // Calculate permissions without using useAuth hook
    const hasPermission = useMemo(() => {
        if (requiredPermissions.length === 0 || !user) return true;
        return requireAll
            ? hasAllPermissions(user.role, requiredPermissions)
            : hasAnyPermission(user.role, requiredPermissions);
    }, [requiredPermissions, requireAll, user]);

    useEffect(() => {
        // Only redirect if we're sure the user is not authenticated
        // Give it a moment for auth state to settle after login (especially after redirect)
        if (!isLoading && !isAuthenticated) {
            const timeout = setTimeout(() => {
                // Double-check auth state before redirecting
                const currentAuth = useAuthStore.getState();
                // Don't redirect if user just logged in (within last 3 seconds)
                const justLoggedIn = currentAuth.lastLoginTime && Date.now() - currentAuth.lastLoginTime < 3000;
                
                if (!currentAuth.isAuthenticated && !currentAuth.isLoading && !justLoggedIn) {
                    router.push('/login');
                }
            }, 1500); // Wait 1.5 seconds before redirecting to allow cookie to be set
            
            return () => clearTimeout(timeout);
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" text="Loading..." />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    // Check permissions if required
    if (!hasPermission) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Access Denied
                    </h1>
                    <p className="text-gray-600">
                        You don&apos;t have permission to access this page.
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;
