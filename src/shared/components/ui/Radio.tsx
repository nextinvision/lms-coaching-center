// Radio Component
'use client';

import React from 'react';
import { cn } from '@/shared/utils/cn';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="flex items-center">
                <input
                    type="radio"
                    ref={ref}
                    className={cn(
                        'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300',
                        error && 'border-red-500',
                        className
                    )}
                    {...props}
                />
                {label && (
                    <label
                        htmlFor={props.id}
                        className={cn(
                            'ml-2 text-sm font-medium',
                            props.disabled ? 'text-gray-400' : 'text-gray-700',
                            error && 'text-red-600'
                        )}
                    >
                        {label}
                    </label>
                )}
            </div>
        );
    }
);

Radio.displayName = 'Radio';

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    name: string;
    value?: string;
    onChange?: (value: string) => void;
    error?: string;
    options: Array<{ label: string; value: string; disabled?: boolean }>;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
    name,
    value,
    onChange,
    error,
    options,
    className,
    ...props
}) => {
    return (
        <div className={cn('space-y-2', className)} {...props}>
            {options.map((option) => (
                <Radio
                    key={option.value}
                    id={`${name}-${option.value}`}
                    name={name}
                    value={option.value}
                    checked={value === option.value}
                    onChange={(e) => onChange?.(e.target.value)}
                    disabled={option.disabled}
                    label={option.label}
                    error={error}
                />
            ))}
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    );
};

export default Radio;

