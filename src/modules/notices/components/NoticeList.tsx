// Notice List Component
'use client';

import React from 'react';
import { NoticeCard } from './NoticeCard';
import { Loader } from '@/shared/components/ui/Loader';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { useNotices } from '../hooks/useNotices';
import type { NoticeFilters } from '../types/notice.types';

interface NoticeListProps {
    filters?: NoticeFilters;
    showActions?: boolean;
    onView?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export function NoticeList({ filters, showActions = true, onView, onDelete }: NoticeListProps) {
    const { notices, isLoading, error } = useNotices(filters);

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader text="Loading notices..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (notices.length === 0) {
        return (
            <EmptyState
                title="No Notices"
                description="No notices found for the selected filters."
            />
        );
    }

    return (
        <div className="space-y-4">
            {notices.map((notice) => (
                <NoticeCard
                    key={notice.id}
                    notice={notice}
                    showActions={showActions}
                    onView={onView}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

export default NoticeList;

