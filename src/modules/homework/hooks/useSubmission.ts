// useSubmission Hook
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useHomeworkStore } from '../store/homeworkStore';
import type { AssignmentSubmission } from '../types/homework.types';

export function useSubmission(submissionId: string | null) {
    const { currentSubmission, isLoading, error, setCurrentSubmission, setLoading, setError } =
        useHomeworkStore();
    const [isFetching, setIsFetching] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isMountedRef = useRef(true);
    const lastFetchedIdRef = useRef<string | null>(null);

    const fetchSubmission = useCallback(async (id: string) => {
        // Don't fetch if already fetching the same submission
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

            const response = await fetch(`/api/homework/submissions/${id}`, {
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error('Failed to fetch submission');
            }

            const result = await response.json();
            
            if (isMountedRef.current) {
                setCurrentSubmission(result.data as AssignmentSubmission);
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
    }, [isFetching, isLoading, setCurrentSubmission, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;
        
        if (submissionId) {
            fetchSubmission(submissionId);
        } else {
            setCurrentSubmission(null);
            lastFetchedIdRef.current = null;
        }

        return () => {
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [submissionId, fetchSubmission, setCurrentSubmission]);

    return {
        submission: currentSubmission,
        isLoading: isLoading || isFetching,
        error,
        refetch: () => submissionId && fetchSubmission(submissionId),
    };
}

export default useSubmission;

