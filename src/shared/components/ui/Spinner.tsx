// Spinner Component
'use client';

import React from 'react';
import { cn } from '@/shared/utils/cn';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'primary' | 'secondary';
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
    ({ className, size = 'md', variant = 'default', ...props }, ref) => {
        const sizes = {
            sm: 'h-4 w-4 border-2',
            md: 'h-8 w-8 border-2',
            lg: 'h-12 w-12 border-4',
        };

        const variants = {
            default: 'border-gray-200 border-t-gray-600',
            primary: 'border-blue-200 border-t-blue-600',
            secondary: 'border-gray-200 border-t-gray-800',
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'inline-block animate-spin rounded-full',
                    sizes[size],
                    variants[variant],
                    className
                )}
                {...props}
            />
        );
    }
);

Spinner.displayName = 'Spinner';

export default Spinner;

