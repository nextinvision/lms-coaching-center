// EmptyState Component
'use client';

import React from 'react';
import { cn } from '@/shared/utils/cn';
import { Button } from '../ui/Button';
import { FileX, Inbox, Search } from 'lucide-react';

export interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    variant?: 'default' | 'search' | 'inbox' | 'file';
    className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    action,
    variant = 'default',
    className,
}) => {
    const defaultIcons = {
        default: <Inbox className="h-12 w-12 text-gray-400" />,
        search: <Search className="h-12 w-12 text-gray-400" />,
        inbox: <Inbox className="h-12 w-12 text-gray-400" />,
        file: <FileX className="h-12 w-12 text-gray-400" />,
    };

    const displayIcon = icon || defaultIcons[variant];

    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center py-12 px-4 text-center',
                className
            )}
        >
            <div className="mb-4">{displayIcon}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-gray-600 max-w-sm mb-6">{description}</p>
            )}
            {action && (
                <Button onClick={action.onClick} variant="primary" size="md">
                    {action.label}
                </Button>
            )}
        </div>
    );
};

export default EmptyState;

