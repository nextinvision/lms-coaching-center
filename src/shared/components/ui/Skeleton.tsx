// Skeleton Loading Component
'use client';

import React from 'react';
import { cn } from '@/shared/utils/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
    animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
    className,
    variant = 'rectangular',
    width,
    height,
    animation = 'pulse',
    style,
    ...props
}: SkeletonProps) {
    const baseStyles = 'bg-gray-200 dark:bg-gray-700';
    const animationStyles = {
        pulse: 'animate-pulse',
        wave: 'animate-[shimmer_2s_infinite]',
        none: '',
    };

    const variantStyles = {
        text: 'rounded h-4',
        circular: 'rounded-full',
        rectangular: 'rounded',
    };

    const combinedStyle = {
        width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
        ...style,
    };

    return (
        <div
            className={cn(baseStyles, variantStyles[variant], animationStyles[animation], className)}
            style={combinedStyle}
            {...props}
        />
    );
}

// Pre-built skeleton components
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
    return (
        <div className={cn('space-y-2', className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton key={i} variant="text" width={i === lines - 1 ? '80%' : '100%'} />
            ))}
        </div>
    );
}

export function SkeletonCard({ className }: { className?: string }) {
    return (
        <div className={cn('p-6 space-y-4', className)}>
            <Skeleton variant="rectangular" height={200} />
            <SkeletonText lines={3} />
        </div>
    );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex gap-4">
                {Array.from({ length: cols }).map((_, i) => (
                    <Skeleton key={i} variant="text" width="25%" height={20} />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, rowIdx) => (
                <div key={rowIdx} className="flex gap-4">
                    {Array.from({ length: cols }).map((_, colIdx) => (
                        <Skeleton key={colIdx} variant="text" width="25%" height={16} />
                    ))}
                </div>
            ))}
        </div>
    );
}

