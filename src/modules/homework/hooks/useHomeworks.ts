// useHomeworks Hook
'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useHomeworkStore } from '../store/homeworkStore';
import { deduplicatedFetch } from '@/core/utils/requestDeduplication';
import type { Assignment, AssignmentFilters } from '../types/homework.types';

export function useHomeworks(filters?: AssignmentFilters) {
    const { assignments, isLoading, error, setAssignments, setLoading, setError } = useHomeworkStore();
    const [isFetching, setIsFetching] = useState(false);
    const isMountedRef = useRef(true);
    const hasFetchedRef = useRef<string | null>(null);
    const isFetchingRef = useRef(false); // Use ref to track fetching state

    // Memoize filters key to prevent unnecessary re-renders
    const filtersKey = useMemo(() => {
        return JSON.stringify({
            batchId: filters?.batchId,
            subjectId: filters?.subjectId,
            search: filters?.search,
        });
    }, [filters?.batchId, filters?.subjectId, filters?.search]);

    const fetchHomeworks = useCallback(async () => {
        // Prevent duplicate calls for the same filters
        if (hasFetchedRef.current === filtersKey && isFetchingRef.current) {
            return;
        }

        hasFetchedRef.current = filtersKey;
        isFetchingRef.current = true; // Set ref immediately

        try {
            setIsFetching(true);
            setLoading(true);
            setError(null);

            const queryParams = new URLSearchParams();
            if (filters?.batchId) queryParams.append('batchId', filters.batchId);
            if (filters?.subjectId) queryParams.append('subjectId', filters.subjectId);
            if (filters?.search) queryParams.append('search', filters.search);

            const url = `/api/homework?${queryParams.toString()}`;

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
    }, [filtersKey, filters?.batchId, filters?.subjectId, filters?.search, setAssignments, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;
        hasFetchedRef.current = null; // Reset on filters change
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

export default useHomeworks;

