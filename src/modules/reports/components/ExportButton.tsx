// Export Button Component
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Download, ChevronDown } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import type { ExportFormat } from '../types/report.types';

interface ExportButtonProps {
    onExport: (format: ExportFormat) => void;
    isLoading?: boolean;
}

export function ExportButton({ onExport, isLoading }: ExportButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

    const options = [
        { label: 'Export as CSV', value: 'CSV' as ExportFormat },
        { label: 'Export as PDF', value: 'PDF' as ExportFormat },
        { label: 'Export as Excel', value: 'EXCEL' as ExportFormat },
    ];

    return (
        <div ref={menuRef} className="relative">
            <Button
                variant="outline"
                size="sm"
                isLoading={isLoading}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Download className="h-4 w-4 mr-2" />
                Export
                <ChevronDown className={cn('h-4 w-4 ml-2 transition-transform', isOpen && 'transform rotate-180')} />
            </Button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                onExport(option.value);
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ExportButton;

