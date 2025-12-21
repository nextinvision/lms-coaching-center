// useBatches Hook
'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useBatchStore } from '../store/batchStore';
import { deduplicatedFetch } from '@/core/utils/requestDeduplication';
import type { Batch, BatchFilters } from '../types/batch.types';

export function useBatches(filters?: BatchFilters) {
    const { batches, isLoading, error, setBatches, setLoading, setError } = useBatchStore();
    const [isFetching, setIsFetching] = useState(false);
    const isMountedRef = useRef(true);
    const hasFetchedRef = useRef(false);

    // Memoize filters key to prevent unnecessary re-renders
    const filtersKey = useMemo(() => {
        return JSON.stringify({
            academicYearId: filters?.academicYearId,
            search: filters?.search,
        });
    }, [filters?.academicYearId, filters?.search]);

    const fetchBatches = useCallback(async () => {
        // Prevent duplicate calls within same render cycle
        if (hasFetchedRef.current && !isFetching) {
            return;
        }

        hasFetchedRef.current = true;

        try {
            setIsFetching(true);
            setLoading(true);
            setError(null);

            const queryParams = new URLSearchParams();
            if (filters?.academicYearId) queryParams.append('academicYearId', filters.academicYearId);
            if (filters?.search) queryParams.append('search', filters.search);

            const url = `/api/batches?${queryParams.toString()}`;
            
            // Use deduplicated fetch - automatically handles caching and deduplication
            const result = await deduplicatedFetch<{ data: Batch[] }>(url, {
                ttl: 30000, // Cache for 30 seconds
            });

            if (isMountedRef.current) {
                setBatches(result.data);
            }
        } catch (err) {
            if (err instanceof Error && isMountedRef.current) {
                setError(err.message);
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
                setIsFetching(false);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // filtersKey already includes all filter deps, isLoading causes infinite loops
    }, [filtersKey, setBatches, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;
        hasFetchedRef.current = false; // Reset on filters change
        fetchBatches();

        return () => {
            isMountedRef.current = false;
        };
    }, [fetchBatches]);

    return {
        batches,
        isLoading: isLoading || isFetching,
        error,
        refetch: () => {
            hasFetchedRef.current = false;
            return fetchBatches();
        },
    };
}

export default useBatches;

