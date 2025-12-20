// useAcademicYear Hook
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAcademicYearStore } from '../store/academic-yearStore';

export function useAcademicYear(academicYearId: string | null) {
    const { currentAcademicYear, isLoading, error, setCurrentAcademicYear, setLoading, setError } =
        useAcademicYearStore();
    const [isFetching, setIsFetching] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isMountedRef = useRef(true);
    const lastFetchedIdRef = useRef<string | null>(null);

    const fetchAcademicYear = useCallback(async (id: string) => {
        // Don't fetch if already fetching the same academic year
        if (lastFetchedIdRef.current === id && (isFetching || isLoading)) {
            return;
        }

        // Cancel previous request if still pending
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        lastFetchedIdRef.current = id;

        try {
            setIsFetching(true);
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/academic-years/${id}`, {
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error('Failed to fetch academic year');
            }

            const result = await response.json();
            
            if (isMountedRef.current) {
                setCurrentAcademicYear(result.data);
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
    }, [isFetching, isLoading, setCurrentAcademicYear, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;
        
        if (academicYearId) {
            fetchAcademicYear(academicYearId);
        } else {
            setCurrentAcademicYear(null);
            lastFetchedIdRef.current = null;
        }

        return () => {
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [academicYearId, fetchAcademicYear, setCurrentAcademicYear]);

    return {
        academicYear: currentAcademicYear,
        isLoading: isLoading || isFetching,
        error,
        refetch: () => academicYearId && fetchAcademicYear(academicYearId),
    };
}

export default useAcademicYear;

