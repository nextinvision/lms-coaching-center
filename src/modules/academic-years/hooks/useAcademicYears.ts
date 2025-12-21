// useAcademicYears Hook
'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAcademicYearStore } from '../store/academic-yearStore';
import { deduplicatedFetch } from '@/core/utils/requestDeduplication';
import type { AcademicYearFilters, AcademicYear } from '../types/academic-year.types';

export function useAcademicYears(filters?: AcademicYearFilters) {
    const { academicYears, isLoading, error, setAcademicYears, setLoading, setError } = useAcademicYearStore();
    const [isFetching, setIsFetching] = useState(false);
    const isMountedRef = useRef(true);
    const hasFetchedRef = useRef(false);
    const isFetchingRef = useRef(false);

    // Memoize filters key to prevent unnecessary re-renders
    const filtersKey = useMemo(() => {
        return JSON.stringify({
            isActive: filters?.isActive,
            search: filters?.search,
        });
    }, [filters?.isActive, filters?.search]);

    const fetchAcademicYears = useCallback(async () => {
        // Prevent duplicate calls within same render cycle
        if (hasFetchedRef.current && !isFetchingRef.current) {
            return;
        }

        hasFetchedRef.current = true;
        isFetchingRef.current = true;

        try {
            setIsFetching(true);
            setLoading(true);
            setError(null);

            const queryParams = new URLSearchParams();
            if (filters?.isActive !== undefined) queryParams.append('isActive', String(filters.isActive));
            if (filters?.search) queryParams.append('search', filters.search);

            const url = `/api/academic-years?${queryParams.toString()}`;

            // Use deduplicated fetch - automatically handles caching and deduplication
            const result = await deduplicatedFetch<{ data: AcademicYear[] }>(url, {
                ttl: 30000, // Cache for 30 seconds
            });

            if (isMountedRef.current) {
                setAcademicYears(result.data);
            }
        } catch (err) {
            hasFetchedRef.current = false; // Reset on error to allow retry
            if (err instanceof Error && isMountedRef.current) {
                setError(err.message);
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
                setIsFetching(false);
                isFetchingRef.current = false;
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // filtersKey already includes all filter deps (isActive, search)
    // isLoading/isFetching cause infinite loops if included in deps
    }, [filtersKey, setAcademicYears, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;
        hasFetchedRef.current = false; // Reset on filters change
        fetchAcademicYears();

        return () => {
            isMountedRef.current = false;
        };
    }, [fetchAcademicYears]);

    return {
        academicYears,
        isLoading: isLoading || isFetching,
        error,
        refetch: () => {
            hasFetchedRef.current = false;
            return fetchAcademicYears();
        },
    };
}

export default useAcademicYears;

