// useReports Hook
'use client';

import { useState, useCallback } from 'react';
import type {
    AttendanceReportFilters,
    PerformanceReportFilters,
    AttendanceReportData,
    StudentPerformanceData,
} from '../types/report.types';

export function useReports() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAttendanceReport = useCallback(async (filters: AttendanceReportFilters) => {
        try {
            setIsLoading(true);
            setError(null);

            const queryParams = new URLSearchParams();
            if (filters.batchId) queryParams.append('batchId', filters.batchId);
            if (filters.studentId) queryParams.append('studentId', filters.studentId);
            if (filters.startDate) queryParams.append('startDate', filters.startDate);
            if (filters.endDate) queryParams.append('endDate', filters.endDate);

            const response = await fetch(`/api/reports/attendance?${queryParams.toString()}`);

            if (!response.ok) {
                throw new Error('Failed to fetch attendance report');
            }

            const result = await response.json();
            return result.data;
        } catch (err) {
            const errorMessage = (err as Error).message;
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchPerformanceReport = useCallback(async (filters: PerformanceReportFilters) => {
        try {
            setIsLoading(true);
            setError(null);

            const queryParams = new URLSearchParams();
            if (filters.batchId) queryParams.append('batchId', filters.batchId);
            if (filters.subjectId) queryParams.append('subjectId', filters.subjectId);
            if (filters.testId) queryParams.append('testId', filters.testId);
            if (filters.startDate) queryParams.append('startDate', filters.startDate);
            if (filters.endDate) queryParams.append('endDate', filters.endDate);

            const response = await fetch(`/api/reports/performance?${queryParams.toString()}`);

            if (!response.ok) {
                throw new Error('Failed to fetch performance report');
            }

            const result = await response.json();
            return result.data;
        } catch (err) {
            const errorMessage = (err as Error).message;
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchReportStats = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/reports/stats');

            if (!response.ok) {
                throw new Error('Failed to fetch report stats');
            }

            const result = await response.json();
            return result.data;
        } catch (err) {
            const errorMessage = (err as Error).message;
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        fetchAttendanceReport,
        fetchPerformanceReport,
        fetchReportStats,
        isLoading,
        error,
    };
}

export default useReports;

