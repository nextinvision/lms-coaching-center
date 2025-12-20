// useHomeworks Hook
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useHomeworkStore } from '../store/homeworkStore';
import type { Assignment, AssignmentFilters } from '../types/homework.types';

export function useHomeworks(filters?: AssignmentFilters) {
    const { assignments, isLoading, error, setAssignments, setLoading, setError } = useHomeworkStore();
    const [isFetching, setIsFetching] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isMountedRef = useRef(true);
    const lastFiltersRef = useRef<string>('');

    const fetchHomeworks = useCallback(async () => {
        // Create a stable key for filters to prevent duplicate requests
        const filtersKey = JSON.stringify({
            batchId: filters?.batchId,
            subjectId: filters?.subjectId,
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
            if (filters?.batchId) queryParams.append('batchId', filters.batchId);
            if (filters?.subjectId) queryParams.append('subjectId', filters.subjectId);
            if (filters?.search) queryParams.append('search', filters.search);

            const response = await fetch(`/api/homework?${queryParams.toString()}`, {
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
            }
        }
    }, [filters?.batchId, filters?.subjectId, filters?.search, isFetching, isLoading, setAssignments, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;
        fetchHomeworks();

        return () => {
            isMountedRef.current = false;
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

export default useHomeworks;

