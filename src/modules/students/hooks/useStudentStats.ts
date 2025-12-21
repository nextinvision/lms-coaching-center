// useStudentStats Hook
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useStudentStore } from '../store/studentStore';
import { deduplicatedFetch } from '@/core/utils/requestDeduplication';
import type { StudentStats } from '../types/student.types';

export function useStudentStats() {
    const { stats, isLoading, error, setStats, setLoading, setError } = useStudentStore();
    const [isFetching, setIsFetching] = useState(false);
    const isMountedRef = useRef(true);
    const hasFetchedRef = useRef(false);

    const fetchStats = useCallback(async () => {
        // Prevent duplicate calls within same render cycle
        if (hasFetchedRef.current && !isFetching) {
            return;
        }

        hasFetchedRef.current = true;

        try {
            setIsFetching(true);
            setLoading(true);
            setError(null);

            // Use deduplicated fetch - automatically handles caching and deduplication
            const result = await deduplicatedFetch<{ data: StudentStats }>('/api/students/stats', {
                ttl: 60000, // Cache stats for 60 seconds
            });

            if (isMountedRef.current) {
                setStats(result.data);
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
            }
        }
    }, [setStats, setLoading, setError]); // Removed stats and isLoading from deps - they cause infinite loops

    useEffect(() => {
        isMountedRef.current = true;
        fetchStats();

        return () => {
            isMountedRef.current = false;
        };
    }, [fetchStats]);

    return {
        stats,
        isLoading: isLoading || isFetching,
        error,
        refetch: () => {
            hasFetchedRef.current = false;
            return fetchStats();
        },
    };
}

export default useStudentStats;

