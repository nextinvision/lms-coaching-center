// Providers Component (Client-side providers wrapper)
'use client';

import React from 'react';
import { ToastProvider } from './ui/Toast';
import { ErrorBoundary } from './feedback/ErrorBoundary';

export interface ProvidersProps {
    children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
    return (
        <ErrorBoundary>
            <ToastProvider>
                {children}
            </ToastProvider>
        </ErrorBoundary>
    );
};

export default Providers;

