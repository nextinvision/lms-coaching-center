// useAttendance Hook
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAttendanceStore } from '../store/attendanceStore';
import type { AttendanceFilters } from '../types/attendance.types';

export function useAttendance(filters?: AttendanceFilters) {
    const { attendances, isLoading, error, setAttendances, setLoading, setError } =
        useAttendanceStore();
    const [isFetching, setIsFetching] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isMountedRef = useRef(true);

    // Convert Date objects to ISO strings for stable dependency comparison
    const startDateStr = filters?.startDate?.toISOString();
    const endDateStr = filters?.endDate?.toISOString();

    const fetchAttendance = useCallback(async () => {
        // Cancel previous request if still pending
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        // Prevent fetch if already loading
        if (isFetching || isLoading) {
            return;
        }

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

            const response = await fetch(`/api/attendance?${queryParams.toString()}`, {
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error('Failed to fetch attendance');
            }

            const result = await response.json();
            
            // Only update state if component is still mounted
            if (isMountedRef.current) {
                setAttendances(result.data);
            }
        } catch (err) {
            // Don't set error if request was aborted
            if (err instanceof Error && err.name !== 'AbortError' && isMountedRef.current) {
                setError(err.message);
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
                setIsFetching(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters?.batchId, filters?.studentId, startDateStr, endDateStr, isFetching, isLoading, setAttendances, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;
        fetchAttendance();

        return () => {
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchAttendance]);

    return {
        attendances,
        isLoading: isLoading || isFetching,
        error,
        refetch: fetchAttendance,
    };
}

export default useAttendance;

