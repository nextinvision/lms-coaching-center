// Protected Route Component
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
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
    const { isAuthenticated, isLoading, canAny, canAll } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
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
    if (requiredPermissions.length > 0) {
        const hasPermission = requireAll
            ? canAll(requiredPermissions)
            : canAny(requiredPermissions);

        if (!hasPermission) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Access Denied
                        </h1>
                        <p className="text-gray-600">
                            You don't have permission to access this page.
                        </p>
                    </div>
                </div>
            );
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
