// Dropdown Component
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/shared/utils/cn';
import { ChevronDown } from 'lucide-react';

export interface DropdownOption {
    label: string;
    value: string | number;
    disabled?: boolean;
    icon?: React.ReactNode;
}

export interface DropdownProps {
    options: DropdownOption[];
    value?: string | number;
    onChange?: (value: string | number) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    triggerClassName?: string;
    menuClassName?: string;
    label?: string;
    error?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    disabled = false,
    className,
    triggerClassName,
    menuClassName,
    label,
    error,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const selectedOption = options.find((opt) => opt.value === value);

    const handleSelect = (option: DropdownOption) => {
        if (option.disabled) return;
        onChange?.(option.value);
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className={cn('relative w-full', className)}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={cn(
                    'w-full flex items-center justify-between px-3 py-2 text-left bg-white border rounded-lg',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                    'disabled:bg-gray-100 disabled:cursor-not-allowed',
                    error ? 'border-red-500' : 'border-gray-300',
                    triggerClassName
                )}
            >
                <span className={cn('block truncate', !selectedOption && 'text-gray-400')}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    className={cn(
                        'h-4 w-4 text-gray-400 transition-transform',
                        isOpen && 'transform rotate-180'
                    )}
                />
            </button>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            {isOpen && (
                <div
                    className={cn(
                        'absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg',
                        'max-h-60 overflow-auto',
                        menuClassName
                    )}
                >
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleSelect(option)}
                            disabled={option.disabled}
                            className={cn(
                                'w-full flex items-center gap-2 px-3 py-2 text-left text-sm',
                                'hover:bg-gray-50 transition-colors',
                                option.disabled && 'opacity-50 cursor-not-allowed',
                                value === option.value && 'bg-blue-50 text-blue-600'
                            )}
                        >
                            {option.icon && <span className="shrink-0">{option.icon}</span>}
                            <span className="flex-1">{option.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;

