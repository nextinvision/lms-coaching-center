// Auth Layout Component
'use client';

import React from 'react';
import Link from 'next/link';

export interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
    children,
    title,
    subtitle,
}) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center">
                    <span className="text-3xl font-bold text-blue-600">LMS</span>
                </Link>
                {title && (
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                        {title}
                    </h2>
                )}
                {subtitle && (
                    <p className="mt-2 text-center text-sm text-gray-600">{subtitle}</p>
                )}
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
