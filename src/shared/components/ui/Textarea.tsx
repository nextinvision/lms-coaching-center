// Textarea Component
'use client';

import React from 'react';
import { cn } from '@/shared/utils/cn';

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, helperText, disabled, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <textarea
                    className={cn(
                        'block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                        'disabled:bg-gray-100 disabled:cursor-not-allowed',
                        'transition-colors duration-200',
                        'resize-vertical',
                        error && 'border-red-500 focus:ring-red-500',
                        className
                    )}
                    ref={ref}
                    disabled={disabled}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                {helperText && !error && (
                    <p className="mt-1 text-sm text-gray-500">{helperText}</p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

export default Textarea;
