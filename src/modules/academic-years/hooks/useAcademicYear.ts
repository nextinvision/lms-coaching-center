// useAcademicYear Hook
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAcademicYearStore } from '../store/academic-yearStore';
import { deduplicatedFetch } from '@/core/utils/requestDeduplication';
import type { AcademicYear } from '../types/academic-year.types';

export function useAcademicYear(academicYearId: string | null) {
    const { currentAcademicYear, isLoading, error, setCurrentAcademicYear, setLoading, setError } =
        useAcademicYearStore();
    const [isFetching, setIsFetching] = useState(false);
    const isMountedRef = useRef(true);
    const hasFetchedRef = useRef<string | null>(null);
    const isFetchingRef = useRef(false);

    const fetchAcademicYear = useCallback(async (id: string) => {
        // Prevent duplicate calls for the same academic year
        if (hasFetchedRef.current === id && !isFetchingRef.current) {
            return;
        }

        hasFetchedRef.current = id;
        isFetchingRef.current = true;

        try {
            setIsFetching(true);
            setLoading(true);
            setError(null);

            const url = `/api/academic-years/${id}`;

            // Use deduplicated fetch - automatically handles caching and deduplication
            const result = await deduplicatedFetch<{ data: AcademicYear }>(url, {
                ttl: 30000, // Cache for 30 seconds
            });

            if (isMountedRef.current) {
                setCurrentAcademicYear(result.data);
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
                isFetchingRef.current = false;
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // isLoading/isFetching cause infinite loops, academicYearId is handled separately
    }, [setCurrentAcademicYear, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;

        if (academicYearId) {
            hasFetchedRef.current = null; // Reset when academicYearId changes
            fetchAcademicYear(academicYearId);
        } else {
            setCurrentAcademicYear(null);
            hasFetchedRef.current = null;
        }

        return () => {
            isMountedRef.current = false;
        };
    }, [academicYearId, fetchAcademicYear, setCurrentAcademicYear]);

    return {
        academicYear: currentAcademicYear,
        isLoading: isLoading || isFetching,
        error,
        refetch: () => {
            if (academicYearId) {
                hasFetchedRef.current = null;
                return fetchAcademicYear(academicYearId);
            }
        },
    };
}

export default useAcademicYear;

