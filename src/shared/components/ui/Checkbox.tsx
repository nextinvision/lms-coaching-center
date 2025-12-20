// Checkbox Component
'use client';

import React from 'react';
import { cn } from '@/shared/utils/cn';

export interface CheckboxProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input
                        type="checkbox"
                        className={cn(
                            'h-4 w-4 rounded border-gray-300 text-blue-600',
                            'focus:ring-2 focus:ring-blue-500 focus:ring-offset-0',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            'transition-colors duration-200',
                            error && 'border-red-500',
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {label && (
                    <div className="ml-2 text-sm">
                        <label className="font-medium text-gray-700">{label}</label>
                        {error && <p className="text-red-600 mt-1">{error}</p>}
                    </div>
                )}
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
