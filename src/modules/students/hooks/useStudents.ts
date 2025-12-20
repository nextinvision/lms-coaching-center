// useStudents Hook
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useStudentStore } from '../store/studentStore';
import type { Student, StudentFilters } from '../types/student.types';

export function useStudents(filters?: StudentFilters) {
    const { students, isLoading, error, setStudents, setLoading, setError } = useStudentStore();
    const [isFetching, setIsFetching] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isMountedRef = useRef(true);
    const lastFiltersRef = useRef<string>('');

    const fetchStudents = useCallback(async () => {
        // Create a stable key for filters to prevent duplicate requests
        const filtersKey = JSON.stringify({
            batchId: filters?.batchId,
            search: filters?.search,
            isActive: filters?.isActive,
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
            if (filters?.search) queryParams.append('search', filters.search);
            if (filters?.isActive !== undefined)
                queryParams.append('isActive', String(filters.isActive));

            const response = await fetch(`/api/students?${queryParams.toString()}`, {
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }

            const result = await response.json();
            
            if (isMountedRef.current) {
                setStudents(result.data as Student[]);
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
    }, [filters?.batchId, filters?.search, filters?.isActive, isFetching, isLoading, setStudents, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;
        fetchStudents();

        return () => {
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchStudents]);

    return {
        students,
        isLoading: isLoading || isFetching,
        error,
        refetch: fetchStudents,
    };
}

export default useStudents;

