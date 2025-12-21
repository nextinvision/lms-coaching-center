// Lazy Loading Utilities
import dynamic from 'next/dynamic';
import React, { ComponentType } from 'react';

/**
 * Creates a lazy-loaded component with loading fallback
 */
export function createLazyComponent<P = {}>(
    importFunc: () => Promise<{ default: ComponentType<P> }>,
    options?: {
        loading?: ComponentType<any>;
        ssr?: boolean;
    }
) {
    return dynamic(importFunc, {
        loading: options?.loading
            ? () => React.createElement(options.loading!)
            : undefined,
        ssr: options?.ssr !== false,
    });
}

/**
 * Lazy load with default spinner
 */
export function lazyWithSpinner<P = {}>(
    importFunc: () => Promise<{ default: ComponentType<P> }>
) {
    return dynamic(importFunc, {
        loading: () =>
            React.createElement(
                'div',
                { className: 'flex items-center justify-center min-h-[200px]' },
                React.createElement('div', {
                    className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600',
                })
            ),
    });
}

