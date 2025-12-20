// useTeacher Hook
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTeacherStore } from '../store/teacherStore';

export function useTeacher(teacherId: string | null) {
    const { currentTeacher, isLoading, error, setCurrentTeacher, setLoading, setError } =
        useTeacherStore();
    const [isFetching, setIsFetching] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isMountedRef = useRef(true);
    const lastFetchedIdRef = useRef<string | null>(null);

    const fetchTeacher = useCallback(async (id: string) => {
        // Don't fetch if already fetching the same teacher
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

            const response = await fetch(`/api/teachers/${id}`, {
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error('Failed to fetch teacher');
            }

            const result = await response.json();
            
            if (isMountedRef.current) {
                setCurrentTeacher(result.data);
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
    }, [isFetching, isLoading, setCurrentTeacher, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;
        
        if (teacherId) {
            fetchTeacher(teacherId);
        } else {
            setCurrentTeacher(null);
            lastFetchedIdRef.current = null;
        }

        return () => {
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [teacherId, fetchTeacher, setCurrentTeacher]);

    return {
        teacher: currentTeacher,
        isLoading: isLoading || isFetching,
        error,
        refetch: () => teacherId && fetchTeacher(teacherId),
    };
}

export default useTeacher;

