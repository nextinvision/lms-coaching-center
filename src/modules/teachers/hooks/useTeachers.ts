// useTeachers Hook
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTeacherStore } from '../store/teacherStore';
import type { TeacherFilters } from '../types/teacher.types';

export function useTeachers(filters?: TeacherFilters) {
    const { teachers, isLoading, error, setTeachers, setLoading, setError } = useTeacherStore();
    const [isFetching, setIsFetching] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isMountedRef = useRef(true);
    const lastFiltersRef = useRef<string>('');

    const fetchTeachers = useCallback(async () => {
        // Create a stable key for filters to prevent duplicate requests
        const filtersKey = JSON.stringify({
            search: filters?.search,
            batchId: filters?.batchId,
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
            if (filters?.search) queryParams.append('search', filters.search);
            if (filters?.batchId) queryParams.append('batchId', filters.batchId);

            const response = await fetch(`/api/teachers?${queryParams.toString()}`, {
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error('Failed to fetch teachers');
            }

            const result = await response.json();
            
            if (isMountedRef.current) {
                setTeachers(result.data);
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
    }, [filters?.search, filters?.batchId, isFetching, isLoading, setTeachers, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;
        fetchTeachers();

        return () => {
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchTeachers]);

    return {
        teachers,
        isLoading: isLoading || isFetching,
        error,
        refetch: fetchTeachers,
    };
}

export default useTeachers;

