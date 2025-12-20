// Batch List Component
'use client';

import React from 'react';
import { useBatches } from '../hooks/useBatches';
import { BatchCard } from './BatchCard';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { Loader } from '@/shared/components/ui/Loader';
import type { BatchFilters } from '../types/batch.types';

interface BatchListProps {
    filters?: BatchFilters;
    onBatchClick?: (batchId: string) => void;
}

export function BatchList({ filters, onBatchClick }: BatchListProps) {
    const { batches, isLoading, error } = useBatches(filters);

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader text="Loading batches..." />
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

    if (batches.length === 0) {
        return (
            <EmptyState
                title="No batches found"
                description="There are no batches matching your criteria."
            />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {batches.map((batch) => (
                <BatchCard
                    key={batch.id}
                    batch={batch}
                    onClick={() => onBatchClick?.(batch.id)}
                />
            ))}
        </div>
    );
}

export default BatchList;

