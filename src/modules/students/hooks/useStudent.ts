// useStudent Hook
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useStudentStore } from '../store/studentStore';
import type { StudentWithStats } from '../types/student.types';

export function useStudent(studentId: string | null) {
    const { currentStudent, isLoading, error, setCurrentStudent, setLoading, setError } =
        useStudentStore();
    const [isFetching, setIsFetching] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isMountedRef = useRef(true);
    const lastFetchedIdRef = useRef<string | null>(null);

    const fetchStudent = useCallback(async (id: string) => {
        // Don't fetch if already fetching the same student
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

            const response = await fetch(`/api/students/${id}`, {
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error('Failed to fetch student');
            }

            const result = await response.json();
            
            if (isMountedRef.current) {
                setCurrentStudent(result.data as StudentWithStats);
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
    }, [isFetching, isLoading, setCurrentStudent, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;
        
        if (studentId) {
            fetchStudent(studentId);
        } else {
            setCurrentStudent(null);
            lastFetchedIdRef.current = null;
        }

        return () => {
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [studentId, fetchStudent, setCurrentStudent]);

    return {
        student: currentStudent,
        isLoading: isLoading || isFetching,
        error,
        refetch: () => studentId && fetchStudent(studentId),
    };
}

export default useStudent;

