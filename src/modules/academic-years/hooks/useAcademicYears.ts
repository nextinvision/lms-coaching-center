// useAcademicYears Hook
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAcademicYearStore } from '../store/academic-yearStore';
import type { AcademicYearFilters } from '../types/academic-year.types';

export function useAcademicYears(filters?: AcademicYearFilters) {
    const { academicYears, isLoading, error, setAcademicYears, setLoading, setError } = useAcademicYearStore();
    const [isFetching, setIsFetching] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isMountedRef = useRef(true);
    const lastFiltersRef = useRef<string>('');

    const fetchAcademicYears = useCallback(async () => {
        // Create a stable key for filters to prevent duplicate requests
        const filtersKey = JSON.stringify({
            isActive: filters?.isActive,
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
            if (filters?.isActive !== undefined) queryParams.append('isActive', String(filters.isActive));
            if (filters?.search) queryParams.append('search', filters.search);

            const response = await fetch(`/api/academic-years?${queryParams.toString()}`, {
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error('Failed to fetch academic years');
            }

            const result = await response.json();
            
            if (isMountedRef.current) {
                setAcademicYears(result.data);
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
    }, [filters?.isActive, filters?.search, isFetching, isLoading, setAcademicYears, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;
        fetchAcademicYears();

        return () => {
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchAcademicYears]);

    return {
        academicYears,
        isLoading: isLoading || isFetching,
        error,
        refetch: fetchAcademicYears,
    };
}

export default useAcademicYears;

