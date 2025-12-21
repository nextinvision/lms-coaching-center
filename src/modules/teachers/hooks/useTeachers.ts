// useTeachers Hook
'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useTeacherStore } from '../store/teacherStore';
import { deduplicatedFetch } from '@/core/utils/requestDeduplication';
import type { Teacher, TeacherFilters } from '../types/teacher.types';

export function useTeachers(filters?: TeacherFilters) {
    const { teachers, isLoading, error, setTeachers, setLoading, setError } = useTeacherStore();
    const [isFetching, setIsFetching] = useState(false);
    const isMountedRef = useRef(true);
    const hasFetchedRef = useRef(false);

    // Memoize filters key to prevent unnecessary re-renders
    const filtersKey = useMemo(() => {
        return JSON.stringify({
            search: filters?.search,
            batchId: filters?.batchId,
        });
    }, [filters?.search, filters?.batchId]);

    const fetchTeachers = useCallback(async () => {
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
            if (filters?.search) queryParams.append('search', filters.search);
            if (filters?.batchId) queryParams.append('batchId', filters.batchId);

            const url = `/api/teachers?${queryParams.toString()}`;
            
            // Use deduplicated fetch - automatically handles caching and deduplication
            const result = await deduplicatedFetch<{ data: Teacher[] }>(url, {
                ttl: 30000, // Cache for 30 seconds
            });

            if (isMountedRef.current) {
                setTeachers(result.data);
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
    // filtersKey already includes all filter deps, isLoading/isFetching cause infinite loops
    }, [filtersKey, setTeachers, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;
        hasFetchedRef.current = false; // Reset on filters change
        fetchTeachers();

        return () => {
            isMountedRef.current = false;
        };
    }, [fetchTeachers]);

    return {
        teachers,
        isLoading: isLoading || isFetching,
        error,
        refetch: () => {
            hasFetchedRef.current = false;
            return fetchTeachers();
        },
    };
}

export default useTeachers;

