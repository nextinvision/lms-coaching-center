// useBatch Hook
'use client';

import { useState, useEffect } from 'react';
import { useBatchStore } from '../store/batchStore';
import type { BatchWithDetails } from '../types/batch.types';

export function useBatch(batchId: string | null) {
    const { currentBatch, isLoading, error, setCurrentBatch, setLoading, setError } =
        useBatchStore();
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        if (batchId) {
            fetchBatch(batchId);
        } else {
            setCurrentBatch(null);
        }
    }, [batchId]);

    const fetchBatch = async (id: string) => {
        try {
            setIsFetching(true);
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/batches/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch batch');
            }

            const result = await response.json();
            setCurrentBatch(result.data as BatchWithDetails);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
            setIsFetching(false);
        }
    };

    return {
        batch: currentBatch,
        isLoading: isLoading || isFetching,
        error,
        refetch: () => batchId && fetchBatch(batchId),
    };
}

export default useBatch;

