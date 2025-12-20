// Card Component
'use client';

import React from 'react';
import { cn } from '@/shared/utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'bordered' | 'elevated';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', padding = 'md', hoverable = false, children, ...props }, ref) => {
        const variants = {
            default: 'bg-white border border-gray-200',
            bordered: 'bg-white border-2 border-gray-300',
            elevated: 'bg-white shadow-lg',
        };

        const paddings = {
            none: '',
            sm: 'p-3',
            md: 'p-4',
            lg: 'p-6',
        };

        const hoverClass = hoverable ? 'hover:shadow-lg transition-shadow cursor-pointer' : '';

        return (
            <div
                ref={ref}
                className={cn('rounded-lg', variants[variant], paddings[padding], hoverClass, className)}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-4', className)} {...props} />
));

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn('text-xl font-semibold text-gray-900', className)}
        {...props}
    />
));

CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-gray-600 mt-1', className)} {...props} />
));

CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
));

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('flex items-center mt-4 pt-4 border-t border-gray-200', className)}
        {...props}
    />
));

CardFooter.displayName = 'CardFooter';

export default Card;
