// Export Button Component
'use client';

import React from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Dropdown } from '@/shared/components/ui/Dropdown';
import { Download } from 'lucide-react';
import type { ExportFormat } from '../types/report.types';

interface ExportButtonProps {
    onExport: (format: ExportFormat) => void;
    isLoading?: boolean;
}

export function ExportButton({ onExport, isLoading }: ExportButtonProps) {
    const options = [
        { label: 'Export as CSV', value: 'CSV' },
        { label: 'Export as PDF', value: 'PDF' },
        { label: 'Export as Excel', value: 'EXCEL' },
    ];

    return (
        <Dropdown
            trigger={
                <Button variant="outline" size="sm" isLoading={isLoading}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </Button>
            }
            options={options}
            onSelect={(value) => onExport(value as ExportFormat)}
        />
    );
}

export default ExportButton;

