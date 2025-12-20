// Dialog Component
'use client';

import React, { useEffect } from 'react';
import { cn } from '@/shared/utils/cn';
import { X } from 'lucide-react';

export interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = 'md',
    showCloseButton = true,
    closeOnOverlayClick = true,
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'max-w-full mx-4',
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={closeOnOverlayClick ? onClose : undefined}
        >
            <div className="fixed inset-0 bg-black/50 transition-opacity" />
            <div
                className={cn(
                    'relative z-50 w-full bg-white rounded-lg shadow-xl',
                    'transform transition-all',
                    sizes[size]
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex-1">
                            {title && (
                                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                            )}
                            {description && (
                                <p className="mt-1 text-sm text-gray-600">{description}</p>
                            )}
                        </div>
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                )}
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

export default Dialog;

