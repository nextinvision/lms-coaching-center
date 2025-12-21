// useStudents Hook
'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useStudentStore } from '../store/studentStore';
import { deduplicatedFetch } from '@/core/utils/requestDeduplication';
import type { Student, StudentFilters } from '../types/student.types';

export function useStudents(filters?: StudentFilters) {
    const { students, isLoading, error, setStudents, setLoading, setError } = useStudentStore();
    const [isFetching, setIsFetching] = useState(false);
    const isMountedRef = useRef(true);
    const hasFetchedRef = useRef(false);

    // Memoize filters key to prevent unnecessary re-renders
    const filtersKey = useMemo(() => {
        return JSON.stringify({
            batchId: filters?.batchId,
            search: filters?.search,
            isActive: filters?.isActive,
        });
    }, [filters?.batchId, filters?.search, filters?.isActive]);

    const fetchStudents = useCallback(async () => {
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
            if (filters?.batchId) queryParams.append('batchId', filters.batchId);
            if (filters?.search) queryParams.append('search', filters.search);
            if (filters?.isActive !== undefined)
                queryParams.append('isActive', String(filters.isActive));

            const url = `/api/students?${queryParams.toString()}`;
            
            // Use deduplicated fetch - automatically handles caching and deduplication
            const result = await deduplicatedFetch<{ data: Student[] }>(url, {
                ttl: 30000, // Cache for 30 seconds
            });

            if (isMountedRef.current) {
                setStudents(result.data);
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
    }, [filtersKey, setStudents, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;
        hasFetchedRef.current = false; // Reset on filters change
        fetchStudents();

        return () => {
            isMountedRef.current = false;
        };
    }, [fetchStudents]);

    return {
        students,
        isLoading: isLoading || isFetching,
        error,
        refetch: () => {
            hasFetchedRef.current = false;
            return fetchStudents();
        },
    };
}

export default useStudents;

