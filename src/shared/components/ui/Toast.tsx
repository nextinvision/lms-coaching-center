// Toast Component
'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { cn } from '@/shared/utils/cn';
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    title?: string;
    message: string;
    variant: ToastVariant;
    duration?: number;
}

interface ToastContextValue {
    toasts: Toast[];
    showToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(7);
        const newToast: Toast = { ...toast, id };
        setToasts((prev) => [...prev, newToast]);

        const duration = toast.duration ?? 5000;
        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
};

interface ToastContainerProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
};

interface ToastItemProps {
    toast: Toast;
    onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
    const icons = {
        success: <CheckCircle className="h-5 w-5 text-green-500" />,
        error: <XCircle className="h-5 w-5 text-red-500" />,
        warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
        info: <Info className="h-5 w-5 text-blue-500" />,
    };

    const styles = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
    };

    return (
        <div
            className={cn(
                'flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-in slide-in-from-right',
                styles[toast.variant]
            )}
        >
            <div className="shrink-0">{icons[toast.variant]}</div>
            <div className="flex-1 min-w-0">
                {toast.title && (
                    <p className="font-semibold text-sm mb-1">{toast.title}</p>
                )}
                <p className="text-sm">{toast.message}</p>
            </div>
            <button
                onClick={() => onRemove(toast.id)}
                className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};

