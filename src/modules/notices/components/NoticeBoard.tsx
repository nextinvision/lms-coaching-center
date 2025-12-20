// Notice Board Component
'use client';

import React, { useState } from 'react';
import { NoticeList } from './NoticeList';
import { Select } from '@/shared/components/ui/Select';
import { Input } from '@/shared/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Bell } from 'lucide-react';
import type { NoticeFilters, NoticeType } from '../types/notice.types';
import { useBatches } from '@/modules/batches';

interface NoticeBoardProps {
    batchId?: string | null;
    showFilters?: boolean;
}

export function NoticeBoard({ batchId, showFilters = true }: NoticeBoardProps) {
    const [filters, setFilters] = useState<NoticeFilters>({
        batchId: batchId || undefined,
        isActive: true,
    });
    const [search, setSearch] = useState('');
    const { batches } = useBatches();

    const handleFilterChange = (key: keyof NoticeFilters, value: any) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value === '' ? undefined : value,
        }));
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        setFilters((prev) => ({
            ...prev,
            search: value || undefined,
        }));
    };

    const batchOptions = [
        { label: 'All Batches', value: '' },
        ...batches.map((batch) => ({
            label: batch.name,
            value: batch.id,
        })),
    ];

    const typeOptions = [
        { label: 'All Types', value: '' },
        { label: 'General', value: 'GENERAL' },
        { label: 'Exam Date', value: 'EXAM_DATE' },
        { label: 'Holiday', value: 'HOLIDAY' },
        { label: 'Important', value: 'IMPORTANT' },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-blue-600" />
                    Notice Board
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label="Search"
                            placeholder="Search notices..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <Select
                            label="Batch"
                            value={filters.batchId || ''}
                            onChange={(e) => handleFilterChange('batchId', e.target.value)}
                            options={batchOptions}
                        />
                        <Select
                            label="Type"
                            value={filters.type || ''}
                            onChange={(e) => handleFilterChange('type', e.target.value as NoticeType)}
                            options={typeOptions}
                        />
                    </div>
                )}
                <NoticeList filters={filters} showActions={false} />
            </CardContent>
        </Card>
    );
}

export default NoticeBoard;

