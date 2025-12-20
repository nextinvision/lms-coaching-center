// Header Component
'use client';

import React from 'react';
import { cn } from '@/shared/utils/cn';

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
    title?: string;
    subtitle?: string;
    actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
    className,
    title,
    subtitle,
    actions,
    ...props
}) => {
    return (
        <header
            className={cn('bg-white border-b border-gray-200 py-4', className)}
            {...props}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    <div>
                        {title && (
                            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                        )}
                        {subtitle && (
                            <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
                        )}
                    </div>
                    {actions && <div className="flex items-center gap-2">{actions}</div>}
                </div>
            </div>
        </header>
    );
};

export default Header;

