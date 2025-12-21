// useHomeworkByBatch Hook
'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useHomeworkStore } from '../store/homeworkStore';
import { deduplicatedFetch } from '@/core/utils/requestDeduplication';
import type { Assignment } from '../types/homework.types';

export function useHomeworkByBatch(batchId: string | null) {
    const { assignments, isLoading, error, setAssignments, setLoading, setError } = useHomeworkStore();
    const [isFetching, setIsFetching] = useState(false);
    const isMountedRef = useRef(true);
    const hasFetchedRef = useRef<string | null>(null);
    const isFetchingRef = useRef(false); // Use ref to track fetching state

    // Memoize batchId to prevent unnecessary re-renders
    const batchIdKey = useMemo(() => batchId, [batchId]);

    const fetchHomeworks = useCallback(async () => {
        if (!batchIdKey) {
            setAssignments([]);
            hasFetchedRef.current = null;
            return;
        }

        // Prevent duplicate calls for the same batch
        if (hasFetchedRef.current === batchIdKey && isFetchingRef.current) {
            return;
        }

        hasFetchedRef.current = batchIdKey;
        isFetchingRef.current = true; // Set ref immediately

        try {
            setIsFetching(true);
            setLoading(true);
            setError(null);

            const url = `/api/homework/batch/${batchIdKey}`;

            // Use deduplicated fetch - automatically handles caching and deduplication
            const result = await deduplicatedFetch<{ data: Assignment[] }>(url, {
                ttl: 30000, // Cache for 30 seconds
            });

            if (isMountedRef.current) {
                setAssignments(result.data);
            }
        } catch (err) {
            hasFetchedRef.current = null; // Reset on error to allow retry
            if (err instanceof Error && isMountedRef.current) {
                setError(err.message);
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
                setIsFetching(false);
                isFetchingRef.current = false; // Clear ref
            }
        }
    }, [batchIdKey, setAssignments, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;
        hasFetchedRef.current = null; // Reset when batchId changes
        fetchHomeworks();

        return () => {
            isMountedRef.current = false;
            isFetchingRef.current = false; // Reset on unmount
        };
    }, [fetchHomeworks]);

    return {
        assignments,
        isLoading: isLoading || isFetching,
        error,
        refetch: () => {
            hasFetchedRef.current = null;
            return fetchHomeworks();
        },
    };
}

export default useHomeworkByBatch;

