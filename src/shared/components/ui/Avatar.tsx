// Avatar Component
'use client';

import React from 'react';
import { cn } from '@/shared/utils/cn';
import { helpers } from '@/shared/utils/helpers';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    name?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    fallbackColor?: string;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
    ({ className, src, alt, name, size = 'md', fallbackColor, ...props }, ref) => {
        const sizes = {
            sm: 'h-8 w-8 text-xs',
            md: 'h-10 w-10 text-sm',
            lg: 'h-12 w-12 text-base',
            xl: 'h-16 w-16 text-lg',
        };

        const initials = name ? helpers.getInitials(name) : '?';
        const bgColor = fallbackColor || helpers.randomColor();

        return (
            <div
                ref={ref}
                className={cn(
                    'relative inline-flex items-center justify-center rounded-full overflow-hidden',
                    sizes[size],
                    className
                )}
                {...props}
            >
                {src ? (
                    <img src={src} alt={alt || name || 'Avatar'} className="h-full w-full object-cover" />
                ) : (
                    <div
                        className="flex h-full w-full items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: bgColor }}
                    >
                        {initials}
                    </div>
                )}
            </div>
        );
    }
);

Avatar.displayName = 'Avatar';

export default Avatar;
