// useTest Hook
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTestStore } from '../store/testStore';
import type { Test } from '../types/test.types';

export function useTest(testId: string | null, includeQuestions: boolean = true) {
    const { currentTest, isLoading, error, setCurrentTest, setLoading, setError } = useTestStore();
    const [isFetching, setIsFetching] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isMountedRef = useRef(true);
    const lastFetchedKeyRef = useRef<string>('');

    const fetchTest = useCallback(async (id: string) => {
        // Create a stable key to prevent duplicate requests
        const fetchKey = `${id}-${includeQuestions}`;

        // Don't fetch if already fetching the same test with same options
        if (lastFetchedKeyRef.current === fetchKey && (isFetching || isLoading)) {
            return;
        }

        // Cancel previous request if still pending
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        lastFetchedKeyRef.current = fetchKey;

        try {
            setIsFetching(true);
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/tests/${id}?includeQuestions=${includeQuestions}`, {
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error('Failed to fetch test');
            }

            const result = await response.json();
            
            if (isMountedRef.current) {
                setCurrentTest(result.data as Test);
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
    }, [testId, includeQuestions, isFetching, isLoading, setCurrentTest, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;
        
        if (testId) {
            fetchTest(testId);
        } else {
            setCurrentTest(null);
            lastFetchedKeyRef.current = '';
        }

        return () => {
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [testId, includeQuestions, fetchTest, setCurrentTest]);

    return {
        test: currentTest,
        isLoading: isLoading || isFetching,
        error,
        refetch: () => testId && fetchTest(testId),
    };
}

export default useTest;

