// Alert Component
'use client';

import React from 'react';
import { cn } from '@/shared/utils/cn';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    onClose?: () => void;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ className, variant = 'info', title, children, onClose, ...props }, ref) => {
        const variants = {
            info: {
                container: 'bg-blue-50 border-blue-200 text-blue-800',
                icon: <Info className="h-5 w-5 text-blue-600" />,
            },
            success: {
                container: 'bg-green-50 border-green-200 text-green-800',
                icon: <CheckCircle className="h-5 w-5 text-green-600" />,
            },
            warning: {
                container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
                icon: <AlertCircle className="h-5 w-5 text-yellow-600" />,
            },
            error: {
                container: 'bg-red-50 border-red-200 text-red-800',
                icon: <XCircle className="h-5 w-5 text-red-600" />,
            },
        };

        const { container, icon } = variants[variant];

        return (
            <div
                ref={ref}
                className={cn(
                    'relative rounded-lg border p-4',
                    container,
                    className
                )}
                role="alert"
                {...props}
            >
                <div className="flex items-start">
                    <div className="flex-shrink-0">{icon}</div>
                    <div className="ml-3 flex-1">
                        {title && <h3 className="text-sm font-medium mb-1">{title}</h3>}
                        <div className="text-sm">{children}</div>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="ml-3 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>
        );
    }
);

Alert.displayName = 'Alert';

export default Alert;
