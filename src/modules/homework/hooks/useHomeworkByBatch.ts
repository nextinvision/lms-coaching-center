// useHomeworkByBatch Hook
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useHomeworkStore } from '../store/homeworkStore';
import type { Assignment } from '../types/homework.types';

export function useHomeworkByBatch(batchId: string | null) {
    const { assignments, isLoading, error, setAssignments, setLoading, setError } = useHomeworkStore();
    const [isFetching, setIsFetching] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isMountedRef = useRef(true);
    const lastFetchedBatchIdRef = useRef<string | null>(null);
    const isFetchingRef = useRef(false); // Use ref to track fetching state

    const fetchHomeworks = useCallback(async () => {
        if (!batchId) {
            setAssignments([]);
            lastFetchedBatchIdRef.current = null;
            return;
        }

        // Don't fetch if already fetching the same batch
        if (lastFetchedBatchIdRef.current === batchId && (isFetchingRef.current || isLoading)) {
            return;
        }

        // Cancel previous request if still pending
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        lastFetchedBatchIdRef.current = batchId;
        isFetchingRef.current = true; // Set ref immediately

        try {
            setIsFetching(true);
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/homework/batch/${batchId}`, {
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error('Failed to fetch assignments');
            }

            const result = await response.json();
            
            if (isMountedRef.current) {
                setAssignments(result.data as Assignment[]);
            }
        } catch (err) {
            if (err instanceof Error && err.name !== 'AbortError' && isMountedRef.current) {
                setError(err.message);
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
                setIsFetching(false);
                isFetchingRef.current = false; // Clear ref
            }
        }
    }, [batchId, isLoading, setAssignments, setLoading, setError]); // Removed isFetching from deps

    useEffect(() => {
        isMountedRef.current = true;
        fetchHomeworks();

        return () => {
            isMountedRef.current = false;
            isFetchingRef.current = false; // Reset on unmount
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchHomeworks]);

    return {
        assignments,
        isLoading: isLoading || isFetching,
        error,
        refetch: fetchHomeworks,
    };
}

export default useHomeworkByBatch;

