// ConfirmDialog Component
'use client';

import React from 'react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';

export interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'default' | 'danger';
    isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'default',
    isLoading = false,
}) => {
    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            closeOnOverlayClick={!isLoading}
        >
            <div className="space-y-4">
                <p className="text-sm text-gray-600">{message}</p>
                <div className="flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        size="sm"
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        variant={variant === 'danger' ? 'danger' : 'primary'}
                        onClick={handleConfirm}
                        disabled={isLoading}
                        isLoading={isLoading}
                        size="sm"
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
};

export default ConfirmDialog;

