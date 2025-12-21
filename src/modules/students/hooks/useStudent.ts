// useStudent Hook
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useStudentStore } from '../store/studentStore';
import { deduplicatedFetch } from '@/core/utils/requestDeduplication';
import type { StudentWithStats } from '../types/student.types';

export function useStudent(studentId: string | null) {
    const { currentStudent, isLoading, error, setCurrentStudent, setLoading, setError } =
        useStudentStore();
    const [isFetching, setIsFetching] = useState(false);
    const isMountedRef = useRef(true);
    const hasFetchedRef = useRef<string | null>(null);
    const isFetchingRef = useRef(false); // Use ref to track fetching state

    const fetchStudent = useCallback(async (id: string) => {
        // Prevent duplicate calls for the same student
        if (hasFetchedRef.current === id && isFetchingRef.current) {
            return;
        }

        hasFetchedRef.current = id;
        isFetchingRef.current = true; // Set ref immediately

        try {
            setIsFetching(true);
            setLoading(true);
            setError(null);

            const url = `/api/students/${id}`;

            // Use deduplicated fetch - automatically handles caching and deduplication
            const result = await deduplicatedFetch<{ data: StudentWithStats }>(url, {
                ttl: 30000, // Cache for 30 seconds
            });

            if (isMountedRef.current) {
                setCurrentStudent(result.data);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // isLoading/isFetching cause infinite loops, studentId is handled separately
    }, [setCurrentStudent, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;

        if (studentId) {
            hasFetchedRef.current = null; // Reset when studentId changes
            fetchStudent(studentId);
        } else {
            setCurrentStudent(null);
            hasFetchedRef.current = null;
        }

        return () => {
            isMountedRef.current = false;
            isFetchingRef.current = false; // Reset on unmount
        };
    }, [studentId, fetchStudent, setCurrentStudent]);

    return {
        student: currentStudent,
        isLoading: isLoading || isFetching,
        error,
        refetch: () => {
            if (studentId) {
                hasFetchedRef.current = null;
                return fetchStudent(studentId);
            }
        },
    };
}

export default useStudent;

