// useStudentStats Hook
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useStudentStore } from '../store/studentStore';
import type { StudentStats } from '../types/student.types';

export function useStudentStats() {
    const { stats, isLoading, error, setStats, setLoading, setError } = useStudentStore();
    const [isFetching, setIsFetching] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isMountedRef = useRef(true);
    const hasFetchedRef = useRef(false);

    const fetchStats = useCallback(async () => {
        // Don't fetch if already fetching or already fetched
        if ((hasFetchedRef.current && stats) || (isFetching || isLoading)) {
            return;
        }

        // Cancel previous request if still pending
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        hasFetchedRef.current = true;

        try {
            setIsFetching(true);
            setLoading(true);
            setError(null);

            const response = await fetch('/api/students/stats', {
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error('Failed to fetch student stats');
            }

            const result = await response.json();
            
            if (isMountedRef.current) {
                setStats(result.data as StudentStats);
            }
        } catch (err) {
            hasFetchedRef.current = false; // Reset on error to allow retry
            if (err instanceof Error && err.name !== 'AbortError' && isMountedRef.current) {
                setError(err.message);
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
                setIsFetching(false);
            }
        }
    }, [stats, isFetching, isLoading, setStats, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;
        fetchStats();

        return () => {
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchStats]);

    return {
        stats,
        isLoading: isLoading || isFetching,
        error,
        refetch: () => {
            hasFetchedRef.current = false;
            fetchStats();
        },
    };
}

export default useStudentStats;

