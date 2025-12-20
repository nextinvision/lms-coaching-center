// Container Component
'use client';

import React from 'react';
import { cn } from '@/shared/utils/cn';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    padding?: boolean;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
    ({ className, size = 'lg', padding = true, children, ...props }, ref) => {
        const sizes = {
            sm: 'max-w-screen-sm',
            md: 'max-w-screen-md',
            lg: 'max-w-screen-lg',
            xl: 'max-w-screen-xl',
            full: 'max-w-full',
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'mx-auto w-full',
                    sizes[size],
                    padding && 'px-4 sm:px-6 lg:px-8',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Container.displayName = 'Container';

export default Container;

