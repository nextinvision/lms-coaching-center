// Dashboard Layout Component
'use client';

import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuthStore } from '@/modules/auth';
import { Loader } from '../ui/Loader';

export interface DashboardLayoutProps {
    children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    // Use store directly to avoid triggering checkAuth multiple times
    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" text="Loading..." />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Will be redirected by ProtectedRoute
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Sidebar />
            <main className="pt-16 lg:pl-64">
                <div className="p-4 sm:p-6 lg:p-8">{children}</div>
            </main>
        </div>
    );
};

export default DashboardLayout;
