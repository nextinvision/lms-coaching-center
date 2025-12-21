// Error Display Component
'use client';

import React from 'react';
import { Alert } from './Alert';
import { Button } from './Button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export interface ErrorDisplayProps {
    error: Error | string;
    onRetry?: () => void;
    title?: string;
    className?: string;
}

export function ErrorDisplay({ error, onRetry, title = 'Error', className }: ErrorDisplayProps) {
    const errorMessage = typeof error === 'string' ? error : error.message;

    return (
        <div className={className}>
            <Alert variant="error" title={title}>
                <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm">{errorMessage}</p>
                        {onRetry && (
                            <Button
                                onClick={onRetry}
                                variant="outline"
                                size="sm"
                                className="mt-3"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Try Again
                            </Button>
                        )}
                    </div>
                </div>
            </Alert>
        </div>
    );
}

