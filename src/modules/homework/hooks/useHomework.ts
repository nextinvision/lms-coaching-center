// useHomework Hook
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useHomeworkStore } from '../store/homeworkStore';
import type { AssignmentWithDetails } from '../types/homework.types';

export function useHomework(assignmentId: string | null) {
    const { currentAssignment, isLoading, error, setCurrentAssignment, setLoading, setError } =
        useHomeworkStore();
    const [isFetching, setIsFetching] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isMountedRef = useRef(true);
    const lastFetchedIdRef = useRef<string | null>(null);
    const isFetchingRef = useRef(false); // Use ref to track fetching state

    const fetchHomework = useCallback(async (id: string) => {
        // Don't fetch if already fetching the same assignment
        if (lastFetchedIdRef.current === id && (isFetchingRef.current || isLoading)) {
            return;
        }

        // Cancel previous request if still pending
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        lastFetchedIdRef.current = id;
        isFetchingRef.current = true; // Set ref immediately

        try {
            setIsFetching(true);
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/homework/${id}`, {
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error('Failed to fetch assignment');
            }

            const result = await response.json();
            
            if (isMountedRef.current) {
                setCurrentAssignment(result.data as AssignmentWithDetails);
            }
        } catch (err) {
            if (err instanceof Error && err.name !== 'AbortError' && isMountedRef.current) {
                setError(err.message);
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
                setIsFetching(false);
                isFetchingRef.current = false; // Clear ref
            }
        }
    }, [isLoading, setCurrentAssignment, setLoading, setError]); // Removed isFetching from deps

    useEffect(() => {
        isMountedRef.current = true;
        
        if (assignmentId) {
            fetchHomework(assignmentId);
        } else {
            setCurrentAssignment(null);
            lastFetchedIdRef.current = null;
        }

        return () => {
            isMountedRef.current = false;
            isFetchingRef.current = false; // Reset on unmount
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [assignmentId, fetchHomework, setCurrentAssignment]);

    return {
        assignment: currentAssignment,
        isLoading: isLoading || isFetching,
        error,
        refetch: () => assignmentId && fetchHomework(assignmentId),
    };
}

export default useHomework;

