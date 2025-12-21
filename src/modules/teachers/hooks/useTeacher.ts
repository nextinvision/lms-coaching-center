// useTeacher Hook
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTeacherStore } from '../store/teacherStore';
import { deduplicatedFetch } from '@/core/utils/requestDeduplication';
import type { TeacherWithDetails } from '../types/teacher.types';

export function useTeacher(teacherId: string | null) {
    const { currentTeacher, isLoading, error, setCurrentTeacher, setLoading, setError } =
        useTeacherStore();
    const [isFetching, setIsFetching] = useState(false);
    const isMountedRef = useRef(true);
    const hasFetchedRef = useRef<string | null>(null);

    const fetchTeacher = useCallback(async (id: string) => {
        // Prevent duplicate calls for the same teacher
        if (hasFetchedRef.current === id && !isFetching) {
            return;
        }

        hasFetchedRef.current = id;

        try {
            setIsFetching(true);
            setLoading(true);
            setError(null);

            const url = `/api/teachers/${id}`;
            
            // Use deduplicated fetch - automatically handles caching and deduplication
            const result = await deduplicatedFetch<{ data: TeacherWithDetails }>(url, {
                ttl: 30000, // Cache for 30 seconds
            });

            if (isMountedRef.current) {
                setCurrentTeacher(result.data);
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
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // isLoading/isFetching cause infinite loops, teacherId is handled separately
    }, [setCurrentTeacher, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;
        
        if (teacherId) {
            hasFetchedRef.current = null; // Reset when teacherId changes
            fetchTeacher(teacherId);
        } else {
            setCurrentTeacher(null);
            hasFetchedRef.current = null;
        }

        return () => {
            isMountedRef.current = false;
        };
    }, [teacherId, fetchTeacher, setCurrentTeacher]);

    return {
        teacher: currentTeacher,
        isLoading: isLoading || isFetching,
        error,
        refetch: () => {
            if (teacherId) {
                hasFetchedRef.current = null;
                return fetchTeacher(teacherId);
            }
        },
    };
}

export default useTeacher;

