// Tabs Component
'use client';

import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/shared/utils/cn';

interface TabsContextValue {
    activeTab: string;
    setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultValue: string;
    value?: string;
    onValueChange?: (value: string) => void;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
    ({ className, defaultValue, value: controlledValue, onValueChange, children, ...props }, ref) => {
        const [internalValue, setInternalValue] = useState(defaultValue);
        const value = controlledValue ?? internalValue;
        const setValue = (newValue: string) => {
            if (controlledValue === undefined) {
                setInternalValue(newValue);
            }
            onValueChange?.(newValue);
        };

        return (
            <TabsContext.Provider value={{ activeTab: value, setActiveTab: setValue }}>
                <div ref={ref} className={cn('w-full', className)} {...props}>
                    {children}
                </div>
            </TabsContext.Provider>
        );
    }
);

Tabs.displayName = 'Tabs';

export const TabsList = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-700',
            className
        )}
        {...props}
    />
));

TabsList.displayName = 'TabsList';

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
    ({ className, value, children, ...props }, ref) => {
        const context = useContext(TabsContext);
        if (!context) {
            throw new Error('TabsTrigger must be used within Tabs');
        }

        const isActive = context.activeTab === value;

        return (
            <button
                ref={ref}
                type="button"
                onClick={() => context.setActiveTab(value)}
                className={cn(
                    'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                    isActive
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

TabsTrigger.displayName = 'TabsTrigger';

export const TabsContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, children, ...props }, ref) => {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error('TabsContent must be used within Tabs');
    }

    if (context.activeTab !== value) {
        return null;
    }

    return (
        <div
            ref={ref}
            className={cn(
                'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});

TabsContent.displayName = 'TabsContent';

export default Tabs;

