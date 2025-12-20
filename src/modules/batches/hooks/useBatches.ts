// useBatches Hook
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useBatchStore } from '../store/batchStore';
import type { Batch, BatchFilters } from '../types/batch.types';

export function useBatches(filters?: BatchFilters) {
    const { batches, isLoading, error, setBatches, setLoading, setError } = useBatchStore();
    const [isFetching, setIsFetching] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isMountedRef = useRef(true);
    const lastFiltersRef = useRef<string>('');

    const fetchBatches = useCallback(async () => {
        // Create a stable key for filters to prevent duplicate requests
        const filtersKey = JSON.stringify({
            academicYearId: filters?.academicYearId,
            search: filters?.search,
        });

        // Don't fetch if already fetching with same filters
        if (lastFiltersRef.current === filtersKey && (isFetching || isLoading)) {
            return;
        }

        // Cancel previous request if still pending
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        lastFiltersRef.current = filtersKey;

        try {
            setIsFetching(true);
            setLoading(true);
            setError(null);

            const queryParams = new URLSearchParams();
            if (filters?.academicYearId) queryParams.append('academicYearId', filters.academicYearId);
            if (filters?.search) queryParams.append('search', filters.search);

            const response = await fetch(`/api/batches?${queryParams.toString()}`, {
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error('Failed to fetch batches');
            }

            const result = await response.json();
            
            if (isMountedRef.current) {
                setBatches(result.data as Batch[]);
            }
        } catch (err) {
            if (err instanceof Error && err.name !== 'AbortError' && isMountedRef.current) {
                setError(err.message);
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
                setIsFetching(false);
            }
        }
    }, [filters?.academicYearId, filters?.search, isFetching, isLoading, setBatches, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;
        fetchBatches();

        return () => {
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchBatches]);

    return {
        batches,
        isLoading: isLoading || isFetching,
        error,
        refetch: fetchBatches,
    };
}

export default useBatches;

