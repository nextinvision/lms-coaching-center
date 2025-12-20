// useActiveAcademicYear Hook
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAcademicYearStore } from '../store/academic-yearStore';

export function useActiveAcademicYear() {
    const { activeAcademicYear, isLoading, error, setActiveAcademicYear, setLoading, setError } =
        useAcademicYearStore();
    const [isFetching, setIsFetching] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isMountedRef = useRef(true);

    const fetchActiveAcademicYear = useCallback(async () => {
        // Don't fetch if already fetching
        if (isFetching || isLoading) {
            return;
        }

        // Cancel previous request if still pending
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        try {
            setIsFetching(true);
            setLoading(true);
            setError(null);

            const response = await fetch('/api/academic-years/active', {
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error('Failed to fetch active academic year');
            }

            const result = await response.json();
            
            if (isMountedRef.current) {
                setActiveAcademicYear(result.data);
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
    }, [isFetching, isLoading, setActiveAcademicYear, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;
        fetchActiveAcademicYear();

        return () => {
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchActiveAcademicYear]);

    return {
        academicYear: activeAcademicYear,
        isLoading: isLoading || isFetching,
        error,
        refetch: fetchActiveAcademicYear,
    };
}

export default useActiveAcademicYear;

