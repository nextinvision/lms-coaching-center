// useAttendanceStats Hook
'use client';

import { useState, useEffect } from 'react';
import { useAttendanceStore } from '../store/attendanceStore';
import type { AttendanceStats } from '../types/attendance.types';

export function useAttendanceStats(studentId: string, batchId?: string) {
    const { stats, isLoading, error, setStats, setLoading, setError } = useAttendanceStore();
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        fetchStats();
    }, [studentId, batchId]);

    const fetchStats = async () => {
        try {
            setIsFetching(true);
            setLoading(true);
            setError(null);

            const queryParams = new URLSearchParams();
            queryParams.append('studentId', studentId);
            if (batchId) queryParams.append('batchId', batchId);

            const response = await fetch(`/api/attendance/student/${studentId}?${queryParams.toString()}`);
            if (!response.ok) {
                throw new Error('Failed to fetch attendance stats');
            }

            const result = await response.json();
            setStats(result.data as AttendanceStats);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
            setIsFetching(false);
        }
    };

    return {
        stats,
        isLoading: isLoading || isFetching,
        error,
        refetch: fetchStats,
    };
}

export default useAttendanceStats;

