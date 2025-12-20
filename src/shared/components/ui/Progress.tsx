// Progress Component
'use client';

import React from 'react';
import { cn } from '@/shared/utils/cn';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number; // 0-100
    max?: number;
    showLabel?: boolean;
    variant?: 'default' | 'success' | 'warning' | 'error';
    size?: 'sm' | 'md' | 'lg';
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    (
        {
            className,
            value,
            max = 100,
            showLabel = false,
            variant = 'default',
            size = 'md',
            ...props
        },
        ref
    ) => {
        const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

        const variants = {
            default: 'bg-blue-600',
            success: 'bg-green-600',
            warning: 'bg-yellow-600',
            error: 'bg-red-600',
        };

        const sizes = {
            sm: 'h-1',
            md: 'h-2',
            lg: 'h-3',
        };

        return (
            <div ref={ref} className={cn('w-full', className)} {...props}>
                <div className="flex items-center justify-between mb-1">
                    {showLabel && (
                        <span className="text-sm font-medium text-gray-700">
                            {Math.round(percentage)}%
                        </span>
                    )}
                </div>
                <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizes[size])}>
                    <div
                        className={cn(
                            'h-full rounded-full transition-all duration-300 ease-out',
                            variants[variant]
                        )}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        );
    }
);

Progress.displayName = 'Progress';

export default Progress;

