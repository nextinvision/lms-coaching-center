// useAttendance Hook
'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAttendanceStore } from '../store/attendanceStore';
import { deduplicatedFetch } from '@/core/utils/requestDeduplication';
import type { AttendanceFilters, Attendance } from '../types/attendance.types';

export function useAttendance(filters?: AttendanceFilters) {
    const { attendances, isLoading, error, setAttendances, setLoading, setError } =
        useAttendanceStore();
    const [isFetching, setIsFetching] = useState(false);
    const isMountedRef = useRef(true);
    const hasFetchedRef = useRef<string | null>(null);
    const isFetchingRef = useRef(false); // Use ref to track fetching state

    // Memoize filters key to prevent unnecessary re-renders
    const filtersKey = useMemo(() => {
        return JSON.stringify({
            batchId: filters?.batchId,
            studentId: filters?.studentId,
            startDate: filters?.startDate?.toISOString(),
            endDate: filters?.endDate?.toISOString(),
        });
    }, [filters?.batchId, filters?.studentId, filters?.startDate, filters?.endDate]);

    const fetchAttendance = useCallback(async () => {
        // Prevent duplicate calls for the same filters
        if (hasFetchedRef.current === filtersKey && isFetchingRef.current) {
            return;
        }

        hasFetchedRef.current = filtersKey;
        isFetchingRef.current = true; // Set ref immediately

        try {
            setIsFetching(true);
            setLoading(true);
            setError(null);

            const queryParams = new URLSearchParams();
            if (filters?.batchId) queryParams.append('batchId', filters.batchId);
            if (filters?.studentId) queryParams.append('studentId', filters.studentId);
            if (filters?.startDate)
                queryParams.append('startDate', filters.startDate.toISOString());
            if (filters?.endDate) queryParams.append('endDate', filters.endDate.toISOString());

            const url = `/api/attendance?${queryParams.toString()}`;

            // Use deduplicated fetch - automatically handles caching and deduplication
            const result = await deduplicatedFetch<{ data: Attendance[] }>(url, {
                ttl: 30000, // Cache for 30 seconds
            });

            if (isMountedRef.current) {
                setAttendances(result.data);
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
                isFetchingRef.current = false; // Clear ref
            }
        }
    }, [filtersKey, filters, setAttendances, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;
        hasFetchedRef.current = null; // Reset on filters change
        fetchAttendance();

        return () => {
            isMountedRef.current = false;
            isFetchingRef.current = false; // Reset on unmount
        };
    }, [fetchAttendance]);

    return {
        attendances,
        isLoading: isLoading || isFetching,
        error,
        refetch: () => {
            hasFetchedRef.current = null;
            return fetchAttendance();
        },
    };
}

export default useAttendance;

